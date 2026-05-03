import { Response } from 'express';
import Badge from '../models/Badge';
import { AuthRequest } from '../middleware/auth.middleware';
import { BADGE_DEFINITIONS, checkStreakBadges, checkLevelBadges } from '../services/badge.service';
import Profile from '../models/Profile';

export const getBadges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const earned = await Badge.find({ childId });

    const badges = Object.entries(BADGE_DEFINITIONS).map(([slug, def]) => {
      const earnedBadge = earned.find(b => b.badgeSlug === slug);
      return {
        slug,
        ...def,
        earned: !!earnedBadge,
        earnedAt: earnedBadge?.earnedAt,
        seen: earnedBadge ? (earnedBadge as any).seen : undefined,
      };
    });

    res.json(badges);
  } catch {
    res.status(500).json({ error: 'Failed to get badges' });
  }
};

export const checkBadges = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    const profile = await Profile.findById(childId);
    if (!profile) {
      res.status(404).json({ error: 'Profile not found' });
      return;
    }

    const newBadges: string[] = [];

    // Check streak badges
    const streakBadges = await checkStreakBadges(childId, profile.streakCount);
    newBadges.push(...streakBadges);

    // Check level badges
    const levelBadges = await checkLevelBadges(childId, profile.level);
    newBadges.push(...levelBadges);

    res.json({ newBadges });
  } catch {
    res.status(500).json({ error: 'Failed to check badges' });
  }
};

export const markBadgeSeen = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const { slug } = req.params;

    await Badge.findOneAndUpdate(
      { childId, badgeSlug: slug },
      { seen: true }
    );

    res.json({ message: 'Badge marked as seen' });
  } catch {
    res.status(500).json({ error: 'Failed to update badge' });
  }
};
