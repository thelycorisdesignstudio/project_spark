import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/User';
import Profile from '../models/Profile';
import Subscription from '../models/Subscription';
import { hashPassword, comparePassword, hashPin, comparePin } from '../utils/hash.utils';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { checkPinAttempt, recordFailedPinAttempt, resetPinAttempts } from '../algorithms/pinGuard';
import { trackEvent } from '../algorithms/analytics';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(50),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const childLoginSchema = z.object({
  parentId: z.string(),
  profileId: z.string(),
  pin: z.string().length(4),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, displayName } = registerSchema.parse(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash, role: 'parent', isVerified: false });

    // Create parent profile
    await Profile.create({
      userId: user._id,
      displayName,
      avatarColor: '#0891B2',
    });

    // Create free subscription
    await Subscription.create({
      parentId: user._id,
      stripeCustomerId: `pending_${user._id}`,
      plan: 'free',
      status: 'active',
      childSlots: 1,
    });

    const accessToken = signAccessToken({ userId: user._id.toString(), role: 'parent' });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: 'parent' });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.issues });
      return;
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const accessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.issues });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      res.status(401).json({ error: 'No refresh token' });
      return;
    }

    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.userId);
    if (!user || user.refreshToken !== token) {
      res.status(401).json({ error: 'Invalid refresh token' });
      return;
    }

    // Rotate refresh token
    const newAccessToken = signAccessToken({ userId: user._id.toString(), role: user.role });
    const newRefreshToken = signRefreshToken({ userId: user._id.toString(), role: user.role });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
    }
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch {
    res.status(500).json({ error: 'Logout failed' });
  }
};

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement Google OAuth token exchange
  res.status(501).json({ error: 'Google OAuth not yet implemented' });
};

export const childLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { parentId, profileId, pin } = childLoginSchema.parse(req.body);

    // PIN brute force protection
    try {
      await checkPinAttempt(profileId);
    } catch (pinError: any) {
      res.status(429).json({ error: pinError.message || 'Too many attempts' });
      return;
    }

    const profile = await Profile.findOne({ _id: profileId, parentId });
    if (!profile || !profile.pinHash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const valid = await comparePin(pin, profile.pinHash);
    if (!valid) {
      await recordFailedPinAttempt(profileId);
      res.status(401).json({ error: 'Invalid PIN' });
      return;
    }

    // Reset failed attempts on successful login
    await resetPinAttempts(profileId);

    const accessToken = signAccessToken({
      userId: profile.userId.toString(),
      role: 'child',
      profileId: profile._id.toString(),
    });

    // Track session start
    try {
      await trackEvent(profile._id.toString(), 'session_start', {
        loginMethod: 'pin',
      }, `session-${profile._id}-${Date.now()}`);
    } catch {
      // Non-critical
    }

    res.json({
      accessToken,
      profile: {
        id: profile._id,
        displayName: profile.displayName,
        avatarColor: profile.avatarColor,
        level: profile.level,
        xp: profile.xp,
        streakCount: profile.streakCount,
        skillLevel: profile.skillLevel,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.issues });
      return;
    }
    console.error('Child login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const childLookup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(req.body);

    const parent = await User.findOne({ email, role: 'parent' });
    if (!parent) {
      // Don't reveal whether email exists
      res.json({ parentId: null, profiles: [] });
      return;
    }

    const profiles = await Profile.find({ parentId: parent._id })
      .select('displayName avatarColor');

    res.json({
      parentId: parent._id,
      profiles: profiles.map(p => ({
        _id: p._id,
        displayName: p.displayName,
        avatarColor: p.avatarColor,
      })),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid email' });
      return;
    }
    console.error('Child lookup error:', error);
    res.status(500).json({ error: 'Lookup failed' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement password reset email
  res.json({ message: 'If that email exists, a reset link has been sent' });
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  // TODO: Implement password reset with token
  res.status(501).json({ error: 'Not yet implemented' });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash -refreshToken');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // For child users, return the specific child profile from the JWT
    // For parent users, return their own profile
    let profile;
    if (req.user?.role === 'child' && req.user?.profileId) {
      profile = await Profile.findById(req.user.profileId);
    } else {
      profile = await Profile.findOne({ userId: user._id, parentId: { $exists: false } })
        || await Profile.findOne({ userId: user._id });
    }

    res.json({ user: { ...user.toObject(), role: req.user?.role }, profile });
  } catch {
    res.status(500).json({ error: 'Failed to get user data' });
  }
};
