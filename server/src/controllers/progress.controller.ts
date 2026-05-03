import { Response } from 'express';
import { z } from 'zod';
import Progress from '../models/Progress';
import { AuthRequest } from '../middleware/auth.middleware';
import { awardXP, XP_CONFIG } from '../services/xp.service';
import { updateStreak } from '../services/streak.service';
import { checkStreakBadges, checkWorldCompletionBadge, awardBadge } from '../services/badge.service';
import { updateChildSkill } from '../algorithms/bkt';
import { getSkillsForWorld } from '../algorithms/skillGraph';
import { computeDDAMetrics, classifyDifficulty } from '../algorithms/dda';
import { updateSRS, hintUsageToQuality } from '../algorithms/srs';
import { trackEvent } from '../algorithms/analytics';
import { scoreCode } from '../algorithms/codeQuality';

const stageCompleteSchema = z.object({
  worldId: z.number().min(1).max(5),
  missionId: z.number().min(1).max(6),
  stageId: z.number().min(1).max(3),
  timeSpentSeconds: z.number().min(0).optional(),
  hintsUsed: z.number().min(0).optional(),
  code: z.object({
    html: z.string().optional(),
    css: z.string().optional(),
    js: z.string().optional(),
    python: z.string().optional(),
  }).optional(),
});

export const getProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const progress = await Progress.find({ childId }).sort({ worldId: 1, missionId: 1, stageId: 1 });
    res.json(progress);
  } catch {
    res.status(500).json({ error: 'Failed to get progress' });
  }
};

export const getWorldProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const worldId = parseInt(String(req.params.worldId));
    const progress = await Progress.find({ childId, worldId }).sort({ missionId: 1, stageId: 1 });
    res.json(progress);
  } catch {
    res.status(500).json({ error: 'Failed to get world progress' });
  }
};

export const completeStage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { worldId, missionId, stageId, timeSpentSeconds, hintsUsed, code } = stageCompleteSchema.parse(req.body);
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    // Update or create progress
    const progress = await Progress.findOneAndUpdate(
      { childId, worldId, missionId, stageId },
      {
        status: 'completed',
        completedAt: new Date(),
        timeSpentSeconds: timeSpentSeconds || 0,
        hintsUsed: hintsUsed || 0,
        xpEarned: XP_CONFIG.STAGE_COMPLETE,
      },
      { upsert: true, new: true }
    );

    // Award base XP
    let totalXP = XP_CONFIG.STAGE_COMPLETE;
    const xpResult = await awardXP(childId, XP_CONFIG.STAGE_COMPLETE);

    // Update streak
    const streakResult = await updateStreak(childId);

    // Check streak badges
    const newBadges = await checkStreakBadges(childId, streakResult.streakCount);

    // --- INTELLIGENCE LAYER: BKT Update ---
    const skills = getSkillsForWorld(worldId);
    for (const skill of skills) {
      try {
        await updateChildSkill(childId, skill, true); // correct = completed
      } catch {
        // Non-critical — don't fail the request
      }
    }

    // --- INTELLIGENCE LAYER: Code Quality Scoring ---
    let qualityScore = null;
    if (code) {
      try {
        qualityScore = scoreCode({
          html: code.html || '',
          css: code.css || '',
          js: code.js || '',
          python: code.python || '',
        });
        if (qualityScore.bonusXP > 0) {
          await awardXP(childId, qualityScore.bonusXP);
          totalXP += qualityScore.bonusXP;
        }
      } catch {
        // Non-critical
      }
    }

    // --- INTELLIGENCE LAYER: SRS Update ---
    try {
      const quality = hintUsageToQuality(hintsUsed || 0);
      for (const skill of skills) {
        await updateSRS(
          { skillSlug: skill, interval: 1, easeFactor: 2.5, repetitions: 0, nextReviewDate: new Date() },
          quality
        );
      }
    } catch {
      // Non-critical
    }

    // --- INTELLIGENCE LAYER: DDA Recomputation ---
    let ddaMode = 'optimal';
    try {
      const metrics = await computeDDAMetrics(childId);
      ddaMode = classifyDifficulty(metrics);
    } catch {
      // Non-critical
    }

    // --- INTELLIGENCE LAYER: Analytics ---
    try {
      await trackEvent(childId, 'stage_complete', {
        worldId,
        missionId,
        stageId,
        timeSpentSeconds,
        hintsUsed,
        xpEarned: totalXP,
        ddaMode,
        qualityScore: qualityScore?.total,
      }, `session-${childId}`);
    } catch {
      // Non-critical
    }

    // Unlock next stage
    if (stageId < 3) {
      await Progress.findOneAndUpdate(
        { childId, worldId, missionId, stageId: stageId + 1 },
        { $setOnInsert: { status: 'in-progress', childId, worldId, missionId, stageId: stageId + 1 } },
        { upsert: true }
      );
    }

    res.json({
      progress,
      xp: xpResult,
      totalXP,
      streak: streakResult,
      badges: newBadges,
      qualityScore,
      ddaMode,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input', details: error.issues });
      return;
    }
    console.error('Complete stage error:', error);
    res.status(500).json({ error: 'Failed to complete stage' });
  }
};

export const completeMission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { worldId, missionId } = req.body;
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    // Check all 3 stages are completed
    const stages = await Progress.find({ childId, worldId, missionId, status: 'completed' });
    if (stages.length < 3) {
      res.status(400).json({ error: 'Not all stages completed' });
      return;
    }

    // Check if no hints were used
    const totalHints = stages.reduce((sum, s) => sum + s.hintsUsed, 0);
    let bonusXp = XP_CONFIG.MISSION_COMPLETE_BONUS;
    const badges: string[] = [];

    if (totalHints === 0) {
      bonusXp += XP_CONFIG.NO_HINTS_MISSION_BONUS;
      const result = await awardBadge(childId, 'no-hints-hero');
      if (result.awarded) badges.push('no-hints-hero');
    }

    // Check speed bonus
    const totalTime = stages.reduce((sum, s) => sum + s.timeSpentSeconds, 0);
    if (totalTime < 600) {
      bonusXp += XP_CONFIG.SPEED_BONUS;
      const result = await awardBadge(childId, 'speed-coder');
      if (result.awarded) badges.push('speed-coder');
    }

    const xpResult = await awardXP(childId, bonusXp);

    // Analytics
    try {
      await trackEvent(childId, 'mission_complete', {
        worldId,
        missionId,
        totalTime,
        totalHints,
        bonusXp,
        badges,
      }, `session-${childId}`);
    } catch {
      // Non-critical
    }

    // Unlock next mission
    if (missionId < 6) {
      await Progress.findOneAndUpdate(
        { childId, worldId, missionId: missionId + 1, stageId: 1 },
        { $setOnInsert: { status: 'in-progress', childId, worldId, missionId: missionId + 1, stageId: 1 } },
        { upsert: true }
      );
    }

    res.json({ xp: xpResult, badges, bonusXp });
  } catch {
    res.status(500).json({ error: 'Failed to complete mission' });
  }
};

export const completeWorld = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { worldId } = req.body;
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    // Check all 6 missions (18 stages) completed
    const stages = await Progress.find({ childId, worldId, status: 'completed' });
    if (stages.length < 18) {
      res.status(400).json({ error: 'Not all missions completed' });
      return;
    }

    const xpResult = await awardXP(childId, XP_CONFIG.WORLD_COMPLETE_BONUS);
    const badges = await checkWorldCompletionBadge(childId, worldId);

    // Analytics
    try {
      await trackEvent(childId, 'world_complete', {
        worldId,
        totalStages: stages.length,
      }, `session-${childId}`);
    } catch {
      // Non-critical
    }

    // Unlock next world
    if (worldId < 5) {
      await Progress.findOneAndUpdate(
        { childId, worldId: worldId + 1, missionId: 1, stageId: 1 },
        { $setOnInsert: { status: 'in-progress', childId, worldId: worldId + 1, missionId: 1, stageId: 1 } },
        { upsert: true }
      );
    }

    res.json({ xp: xpResult, badges });
  } catch {
    res.status(500).json({ error: 'Failed to complete world' });
  }
};
