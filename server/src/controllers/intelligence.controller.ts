import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Profile from '../models/Profile';
import Progress from '../models/Progress';
import { getChildBKTState, MASTERY_THRESHOLD } from '../algorithms/bkt';
import { getUnlockableSkills, getMasteredSkills } from '../algorithms/skillGraph';
import { computeDDAMetrics, classifyDifficulty, getDDAInstructions } from '../algorithms/dda';
import { getRecommendationForChild } from '../algorithms/nextBestAction';
import { computeFrustrationScore, buildFrustrationSignals } from '../algorithms/frustrationDetector';
import { analyzeError } from '../algorithms/errorAnalyzer';
import { scoreCode } from '../algorithms/codeQuality';
import { isInFlowState, type FlowIndicators } from '../algorithms/flowDetector';
import { detectFatigue, type SessionMetrics } from '../algorithms/sessionOptimizer';
import { trackEvent } from '../algorithms/analytics';
import { cacheError } from '../algorithms/contextBuilder';

export const getRecommendation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    const recommendation = await getRecommendationForChild(childId);
    res.json(recommendation);
  } catch (error) {
    console.error('Recommendation error:', error);
    // Return safe default
    res.json({
      action: 'continue-mission',
      reason: 'Pick up where you left off!',
      urgency: 'low',
    });
  }
};

export const getDDAStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    const metrics = await computeDDAMetrics(childId);
    const mode = classifyDifficulty(metrics);

    res.json({
      mode,
      metrics,
      instructions: getDDAInstructions(mode),
    });
  } catch {
    res.json({ mode: 'optimal', metrics: null, instructions: '' });
  }
};

export const getSkillMap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    const bktState = await getChildBKTState(childId);
    const masteredSkills = getMasteredSkills(bktState);
    const unlockableSkills = getUnlockableSkills(masteredSkills);

    // Convert Map to object for JSON serialization
    const skillMap: Record<string, number> = {};
    bktState.forEach((value, key) => {
      skillMap[key] = value;
    });

    res.json({
      skills: skillMap,
      mastered: masteredSkills,
      unlockable: unlockableSkills,
      masteryThreshold: MASTERY_THRESHOLD,
    });
  } catch {
    res.json({ skills: {}, mastered: [], unlockable: [], masteryThreshold: 0.95 });
  }
};

export const getAnalyticsSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    const profile = await Profile.findById(childId);
    const progress = await Progress.find({ childId });

    const completedStages = progress.filter(p => p.status === 'completed').length;
    const totalTime = progress.reduce((sum, p) => sum + p.timeSpentSeconds, 0);
    const totalHints = progress.reduce((sum, p) => sum + p.hintsUsed, 0);

    res.json({
      totalStagesCompleted: completedStages,
      totalTimeMinutes: Math.round(totalTime / 60),
      totalHintsUsed: totalHints,
      level: profile?.level || 1,
      xp: profile?.xp || 0,
      streakCount: profile?.streakCount || 0,
    });
  } catch {
    res.status(500).json({ error: 'Failed to get analytics' });
  }
};

export const reportCodeRun = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const { sessionId, success, error: errorMsg, code } = req.body;

    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    if (success) {
      // Track success
      await trackEvent(childId, 'code_success', { sessionId }, sessionId || '');

      // Score code quality if provided
      let qualityScore = null;
      if (code) {
        qualityScore = scoreCode({
          html: code.html || '',
          css: code.css || '',
          js: code.js || '',
          python: code.python || '',
        });
      }

      res.json({ success: true, qualityScore });
    } else {
      // Analyze error
      const parsed = analyzeError(errorMsg || '', code?.js || code?.python || '');
      cacheError(childId, parsed);

      await trackEvent(childId, 'code_error', {
        sessionId,
        errorCategory: parsed.category,
        errorMessage: parsed.message,
      }, sessionId || '');

      res.json({
        success: false,
        error: parsed,
      });
    }
  } catch {
    res.status(500).json({ error: 'Failed to report code run' });
  }
};

export const reportSessionEnd = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const childId = req.user?.profileId;
    const { sessionId, sessionLengthMinutes, codeChanges, stagesCompleted, xpEarned } = req.body;

    if (!childId) {
      res.status(401).json({ error: 'Profile required' });
      return;
    }

    // Detect flow state
    const flowIndicators: FlowIndicators = {
      codeChangesPerMinute: (codeChanges || 0) / Math.max(sessionLengthMinutes || 1, 1),
      aiMessagesPerMinute: 0.3,
      errorFrequency: 0.5,
      sessionLengthMinutes: sessionLengthMinutes || 0,
      successRate: 0.7,
    };
    const wasInFlow = isInFlowState(flowIndicators);

    // Detect fatigue
    const sessionMetrics: SessionMetrics = {
      errorRateLast5Mins: 0,
      messageFrequency: 0.3,
      codeChangesLast5Mins: codeChanges || 0,
      sessionLengthMinutes: sessionLengthMinutes || 0,
    };
    const fatigued = detectFatigue(sessionMetrics);

    // Update total time
    await Profile.findByIdAndUpdate(childId, {
      $inc: { totalTimeSpentMinutes: sessionLengthMinutes || 0 },
      lastActiveDate: new Date(),
    });

    // Track events
    await trackEvent(childId, 'session_end', {
      sessionId,
      sessionLengthMinutes,
      stagesCompleted,
      xpEarned,
      wasInFlow,
      fatigued,
    }, sessionId || '');

    if (wasInFlow) {
      await trackEvent(childId, 'flow_detected', { sessionLengthMinutes }, sessionId || '');
    }
    if (fatigued) {
      await trackEvent(childId, 'fatigue_detected', { sessionLengthMinutes }, sessionId || '');
    }

    res.json({
      wasInFlow,
      fatigued,
      sessionSummary: {
        minutes: sessionLengthMinutes,
        stagesCompleted,
        xpEarned,
      },
    });
  } catch {
    res.status(500).json({ error: 'Failed to report session end' });
  }
};
