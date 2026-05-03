import { Response } from 'express';
import Profile from '../models/Profile';
import Progress from '../models/Progress';
import Project from '../models/Project';
import Badge from '../models/Badge';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateParentReport } from '../services/ai.service';
import { sendWeeklyReport } from '../services/email.service';
import User from '../models/User';

export const getOverview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const parentId = req.user?.userId;
    const children = await Profile.find({ parentId });

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const overview = await Promise.all(children.map(async (child) => {
      const weekProgress = await Progress.find({
        childId: child._id,
        completedAt: { $gte: weekAgo },
        status: 'completed',
      });

      return {
        id: child._id,
        displayName: child.displayName,
        avatarColor: child.avatarColor,
        level: child.level,
        xp: child.xp,
        streakCount: child.streakCount,
        skillLevel: child.skillLevel,
        lastActiveDate: child.lastActiveDate,
        missionsCompletedThisWeek: new Set(weekProgress.map(p => `${p.worldId}-${p.missionId}`)).size,
        stagesCompletedThisWeek: weekProgress.length,
      };
    }));

    res.json({ children: overview, totalChildren: children.length });
  } catch {
    res.status(500).json({ error: 'Failed to get overview' });
  }
};

export const getChildStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.childId,
      parentId: req.user?.userId,
    });
    if (!profile) {
      res.status(404).json({ error: 'Child not found' });
      return;
    }

    const progress = await Progress.find({ childId: profile._id });
    const badges = await Badge.find({ childId: profile._id });
    const projectCount = await Project.countDocuments({ childId: profile._id });

    const worldProgress = [1, 2, 3, 4, 5].map(worldId => {
      const worldStages = progress.filter(p => p.worldId === worldId);
      const completed = worldStages.filter(p => p.status === 'completed').length;
      return { worldId, completed, total: 18 };
    });

    res.json({
      profile,
      worldProgress,
      totalBadges: badges.length,
      totalProjects: projectCount,
      totalStagesCompleted: progress.filter(p => p.status === 'completed').length,
    });
  } catch {
    res.status(500).json({ error: 'Failed to get child stats' });
  }
};

export const getChildActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.childId,
      parentId: req.user?.userId,
    });
    if (!profile) {
      res.status(404).json({ error: 'Child not found' });
      return;
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activity = await Progress.find({
      childId: profile._id,
      updatedAt: { $gte: thirtyDaysAgo },
    }).sort({ updatedAt: -1 });

    res.json(activity);
  } catch {
    res.status(500).json({ error: 'Failed to get activity' });
  }
};

export const getChildProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.childId,
      parentId: req.user?.userId,
    });
    if (!profile) {
      res.status(404).json({ error: 'Child not found' });
      return;
    }

    const projects = await Project.find({ childId: profile._id })
      .sort({ updatedAt: -1 });

    res.json(projects);
  } catch {
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

export const generateReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({
      _id: req.params.childId,
      parentId: req.user?.userId,
    });
    if (!profile) {
      res.status(404).json({ error: 'Child not found' });
      return;
    }

    const parent = await User.findById(req.user?.userId);
    if (!parent) {
      res.status(404).json({ error: 'Parent not found' });
      return;
    }

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekProgress = await Progress.find({
      childId: profile._id,
      completedAt: { $gte: weekAgo },
      status: 'completed',
    });

    const weekBadges = await Badge.find({
      childId: profile._id,
      earnedAt: { $gte: weekAgo },
    });

    const weekProjects = await Project.countDocuments({
      childId: profile._id,
      createdAt: { $gte: weekAgo },
    });

    const report = await generateParentReport(
      profile.displayName,
      profile.age || 10,
      {
        totalMinutes: Math.round(weekProgress.reduce((sum, p) => sum + p.timeSpentSeconds, 0) / 60),
        activeDays: new Set(weekProgress.map(p => p.completedAt?.toDateString())).size,
        missionsCompleted: new Set(weekProgress.map(p => `${p.worldId}-${p.missionId}`)).size,
        badgesEarned: weekBadges.map(b => b.badgeSlug),
        projectsCreated: weekProjects,
        streakCount: profile.streakCount,
        level: profile.level,
        skillLevel: profile.skillLevel,
      }
    );

    // Send email
    await sendWeeklyReport(parent.email, profile.displayName, report);

    res.json({ report, sent: true });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
