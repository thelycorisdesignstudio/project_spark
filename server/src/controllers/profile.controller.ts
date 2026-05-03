import { Response } from 'express';
import { z } from 'zod';
import Profile from '../models/Profile';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { hashPin } from '../utils/hash.utils';

const createChildSchema = z.object({
  displayName: z.string().min(1).max(50),
  age: z.number().min(5).max(18).optional(),
  pin: z.string().length(4),
  avatarColor: z.string().optional(),
  dailyTimeLimitMinutes: z.number().min(15).max(180).optional(),
});

const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  avatarColor: z.string().optional(),
  age: z.number().min(5).max(18).optional(),
});

export const getMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ userId: req.user?.userId });
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch {
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

export const updateMyProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user?.userId },
      data,
      { new: true }
    );
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }
    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.issues });
      return;
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const createChildProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { displayName, age, pin, avatarColor, dailyTimeLimitMinutes } = createChildSchema.parse(req.body);
    const parentId = req.user?.userId;

    // Create child user account
    const childUser = await User.create({
      email: `child_${Date.now()}@spark.internal`,
      role: 'child',
      isVerified: true,
    });

    const pinHash = await hashPin(pin);

    const profile = await Profile.create({
      userId: childUser._id,
      parentId,
      displayName,
      age,
      pinHash,
      avatarColor: avatarColor || '#0891B2',
      dailyTimeLimitMinutes,
    });

    res.status(201).json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.issues });
      return;
    }
    console.error('Create child error:', error);
    res.status(500).json({ error: 'Failed to create child profile' });
  }
};

export const getChildProfiles = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profiles = await Profile.find({ parentId: req.user?.userId });
    res.json(profiles);
  } catch {
    res.status(500).json({ error: 'Failed to get child profiles' });
  }
};

export const getChildProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.childId,
      parentId: req.user?.userId,
    });
    if (!profile) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }
    res.json(profile);
  } catch {
    res.status(500).json({ error: 'Failed to get child profile' });
  }
};

export const updateChildProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updateData: Record<string, unknown> = {};
    if (req.body.displayName) updateData.displayName = req.body.displayName;
    if (req.body.avatarColor) updateData.avatarColor = req.body.avatarColor;
    if (req.body.age) updateData.age = req.body.age;
    if (req.body.dailyTimeLimitMinutes !== undefined) updateData.dailyTimeLimitMinutes = req.body.dailyTimeLimitMinutes;
    if (req.body.publicSharingEnabled !== undefined) updateData.publicSharingEnabled = req.body.publicSharingEnabled;
    if (req.body.pin) updateData.pinHash = await hashPin(req.body.pin);

    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.childId, parentId: req.user?.userId },
      updateData,
      { new: true }
    );
    if (!profile) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }
    res.json(profile);
  } catch {
    res.status(500).json({ error: 'Failed to update child profile' });
  }
};

export const deleteChildProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOneAndDelete({
      _id: req.params.childId,
      parentId: req.user?.userId,
    });
    if (!profile) {
      res.status(404).json({ error: 'Child profile not found' });
      return;
    }

    // Cascade delete: user, progress, projects, badges, chat history
    const { default: Progress } = await import('../models/Progress');
    const { default: Project } = await import('../models/Project');
    const { default: Badge } = await import('../models/Badge');
    const { default: ChatHistory } = await import('../models/ChatHistory');

    await Promise.all([
      User.findByIdAndDelete(profile.userId),
      Progress.deleteMany({ childId: profile._id }),
      Project.deleteMany({ childId: profile._id }),
      Badge.deleteMany({ childId: profile._id }),
      ChatHistory.deleteMany({ childId: profile._id }),
    ]);

    res.json({ message: 'Child profile and all associated data deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete child profile' });
  }
};
