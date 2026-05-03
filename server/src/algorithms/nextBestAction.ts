/**
 * Next-Best-Action Recommender
 *
 * Determines the single most valuable activity a child should do next
 * in SPARK.  Combines signals from progress state, spaced-repetition
 * due cards, streak health, daily challenges, session fatigue, and the
 * Optimal Challenge Point to produce a prioritized recommendation.
 */

import mongoose from 'mongoose';
import Profile, { IProfile } from '../models/Profile';
import Progress, { IProgress } from '../models/Progress';
import Badge from '../models/Badge';
import DailyChallenge from '../models/DailyChallenge';
import { getDueReviewCards } from './srs';
import { computeOCPScore, getMissionDifficulty, rankMissionsByOCP } from './ocp';

// ---------------------------------------------------------------------------
// DifficultyMode type (defined here since dda.ts may not exist yet)
// ---------------------------------------------------------------------------

export type DifficultyMode = 'easy' | 'normal' | 'challenge';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActionType =
  | 'continue-mission'
  | 'review-concept'
  | 'daily-challenge'
  | 'free-build'
  | 'bonus-mission'
  | 'streak-recovery';

export interface Recommendation {
  action: ActionType;
  reason: string;
  urgency: number; // 0-1, higher = more urgent
  /** Optional payload — e.g. which mission to continue, which skill to review */
  metadata?: Record<string, unknown>;
}

export interface RecommendationContext {
  childId: string;
  currentProgress: IProgress[];
  skillKnowledgeState: Map<string, number>;
  streakCount: number;
  lastActiveDate: Date | null;
  ddaMode: DifficultyMode;
  dailyChallengeCompleted: boolean;
  sessionLengthMinutes: number;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function daysSinceDate(date: Date | null): number {
  if (!date) return Infinity;
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  return diff / (1000 * 60 * 60 * 24);
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Determine the DDA mode from a profile.  Without a dedicated dda module
 * we infer it from average skill-knowledge mastery.
 */
function inferDDAMode(skillKnowledgeState: Map<string, number>): DifficultyMode {
  const values = Array.from(skillKnowledgeState.values());
  if (values.length === 0) return 'normal';
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  if (avg < 0.3) return 'easy';
  if (avg > 0.7) return 'challenge';
  return 'normal';
}

// ---------------------------------------------------------------------------
// Core algorithm
// ---------------------------------------------------------------------------

/**
 * Pure function that evaluates the child's current context and returns
 * the single highest-priority recommendation.
 *
 * Priority cascade (evaluated top to bottom, first match wins unless
 * a higher-urgency item is found):
 *
 *   1. Streak recovery  — if the streak is about to be lost
 *   2. Review concept   — if SRS cards are overdue by a lot
 *   3. Continue mission — if the child has an in-progress mission
 *   4. Daily challenge  — if today's challenge hasn't been done
 *   5. Bonus mission    — if an OCP-optimal mission is available
 *   6. Free build       — fallback creative mode
 */
export function computeNextBestAction(ctx: RecommendationContext): Recommendation {
  const candidates: Recommendation[] = [];

  const daysSinceActive = daysSinceDate(ctx.lastActiveDate);

  // ---- 1. Streak recovery ----
  if (ctx.streakCount > 0 && daysSinceActive >= 1 && daysSinceActive < 2) {
    // The child has a streak but hasn't been active today
    candidates.push({
      action: 'streak-recovery',
      reason: `You have a ${ctx.streakCount}-day streak! Complete any activity today to keep it alive.`,
      urgency: 0.95,
      metadata: { streakCount: ctx.streakCount, daysSinceActive },
    });
  } else if (ctx.streakCount > 3 && daysSinceActive >= 0.8) {
    // Long streak nearing the danger zone
    candidates.push({
      action: 'streak-recovery',
      reason: `Your ${ctx.streakCount}-day streak is almost at risk. A quick activity will save it!`,
      urgency: 0.85,
      metadata: { streakCount: ctx.streakCount },
    });
  }

  // ---- 2. Review concepts (SRS overdue) ----
  // We don't have the SRS cards in the context (they require async),
  // but we approximate from skillKnowledgeState: skills with low mastery
  // that haven't been practiced suggest overdue reviews.
  const weakSkills: string[] = [];
  ctx.skillKnowledgeState.forEach((mastery, skill) => {
    if (mastery < 0.4) {
      weakSkills.push(skill);
    }
  });

  if (weakSkills.length > 0) {
    const urgency = weakSkills.length >= 3 ? 0.80 : 0.55;
    candidates.push({
      action: 'review-concept',
      reason: `You have ${weakSkills.length} skill${weakSkills.length > 1 ? 's' : ''} that could use some practice. A quick review will strengthen your coding powers!`,
      urgency,
      metadata: { weakSkills: weakSkills.slice(0, 3) },
    });
  }

  // ---- 3. Continue in-progress mission ----
  const inProgress = ctx.currentProgress.filter(p => p.status === 'in-progress');
  if (inProgress.length > 0) {
    // Pick the most recently updated in-progress record
    const sorted = [...inProgress].sort((a, b) => {
      const tA = new Date(a.updatedAt).getTime();
      const tB = new Date(b.updatedAt).getTime();
      return tB - tA;
    });
    const mission = sorted[0];

    // Higher urgency if they were mid-way through
    const stageProgress = mission.stageId / 3; // 0.33, 0.67, 1.0
    const urgency = 0.60 + stageProgress * 0.15;

    candidates.push({
      action: 'continue-mission',
      reason: `You're part-way through World ${mission.worldId}, Mission ${mission.missionId}. Let's keep going!`,
      urgency,
      metadata: {
        worldId: mission.worldId,
        missionId: mission.missionId,
        stageId: mission.stageId,
      },
    });
  }

  // ---- 4. Daily challenge ----
  if (!ctx.dailyChallengeCompleted) {
    // Daily challenges are moderately urgent — a fun bounded activity
    candidates.push({
      action: 'daily-challenge',
      reason: "Today's daily challenge is waiting for you! It's a quick way to earn bonus XP.",
      urgency: 0.50,
      metadata: { date: todayString() },
    });
  }

  // ---- 5. Bonus mission (OCP-driven) ----
  // If all current missions are completed but we know the child's level,
  // suggest an optimally challenging next mission
  const completedCount = ctx.currentProgress.filter(p => p.status === 'completed').length;
  const totalPossible = 5 * 6 * 3; // 5 worlds * 6 missions * 3 stages

  if (completedCount < totalPossible && inProgress.length === 0) {
    // Find the next locked mission in sequence
    const completedMissions = new Set(
      ctx.currentProgress
        .filter(p => p.status === 'completed')
        .map(p => `${p.worldId}-${p.missionId}-${p.stageId}`),
    );

    let nextMission: { worldId: number; missionId: number; stageId: number } | null = null;
    outer:
    for (let w = 1; w <= 5; w++) {
      for (let m = 1; m <= 6; m++) {
        for (let s = 1; s <= 3; s++) {
          if (!completedMissions.has(`${w}-${m}-${s}`)) {
            nextMission = { worldId: w, missionId: m, stageId: s };
            break outer;
          }
        }
      }
    }

    if (nextMission) {
      const difficulty = getMissionDifficulty(nextMission.worldId, nextMission.missionId);
      const avgSkill = ctx.skillKnowledgeState.size > 0
        ? Array.from(ctx.skillKnowledgeState.values()).reduce((s, v) => s + v, 0) /
          ctx.skillKnowledgeState.size
        : 0.1;

      const ocpScore = computeOCPScore(avgSkill, difficulty);
      // High OCP score = good fit, boost urgency
      const urgency = 0.35 + ocpScore * 0.25;

      candidates.push({
        action: 'bonus-mission',
        reason: `World ${nextMission.worldId}, Mission ${nextMission.missionId} looks like a great next challenge for you!`,
        urgency,
        metadata: {
          ...nextMission,
          difficulty,
          ocpScore: Math.round(ocpScore * 100) / 100,
        },
      });
    }
  }

  // ---- 6. Free build (fallback) ----
  // If the session is already long, suggest creative mode to wind down
  const isLongSession = ctx.sessionLengthMinutes > 30;
  candidates.push({
    action: 'free-build',
    reason: isLongSession
      ? "You've been working hard! How about some free-build time to create whatever you want?"
      : 'Jump into free-build mode and create your own project!',
    urgency: isLongSession ? 0.45 : 0.15,
    metadata: { sessionLengthMinutes: ctx.sessionLengthMinutes },
  });

  // ---- Pick the highest-urgency candidate ----
  candidates.sort((a, b) => b.urgency - a.urgency);
  const best = candidates[0];

  return {
    action: best.action,
    reason: best.reason,
    urgency: best.urgency,
    metadata: best.metadata,
  };
}

// ---------------------------------------------------------------------------
// Full async recommendation loader
// ---------------------------------------------------------------------------

/**
 * End-to-end function: loads all context from the database for a given
 * child and computes the next-best-action recommendation.
 *
 * @param childId Profile _id as string
 * @returns       The top recommendation (action, reason, urgency)
 */
export async function getRecommendationForChild(
  childId: string,
): Promise<Recommendation> {
  // --- Load profile ---
  const profile = await Profile.findById(childId).lean().exec();
  if (!profile) {
    // Unknown child — safe default
    return {
      action: 'daily-challenge',
      reason: 'Start with today\'s daily challenge!',
      urgency: 0.5,
    };
  }

  // --- Load current progress ---
  const currentProgress = await Progress.find({ childId })
    .lean()
    .exec() as IProgress[];

  // --- Build skill knowledge state Map ---
  const rawState = profile.skillKnowledgeState as unknown as Record<string, number> | undefined;
  const skillKnowledgeState = new Map<string, number>();
  if (rawState && typeof rawState === 'object') {
    for (const [key, val] of Object.entries(rawState)) {
      skillKnowledgeState.set(key, val);
    }
  }

  // --- Check daily challenge completion ---
  const today = todayString();
  const dailyChallenge = await DailyChallenge.findOne({ date: today }).lean().exec();
  const dailyChallengeCompleted = dailyChallenge
    ? dailyChallenge.completedBy.some(
        (id) => id.toString() === childId,
      )
    : true; // No challenge today = treat as completed (don't recommend it)

  // --- Determine DDA mode ---
  const ddaMode = inferDDAMode(skillKnowledgeState);

  // --- Check SRS due cards and augment weak-skill signals ---
  // getDueReviewCards enriches our understanding of what needs review
  try {
    const dueCards = await getDueReviewCards(childId);
    for (const card of dueCards) {
      // If the skill isn't already in the knowledge state, add it as weak
      if (!skillKnowledgeState.has(card.skillSlug)) {
        // Overdue card implies forgotten skill — set low mastery
        skillKnowledgeState.set(card.skillSlug, 0.2);
      }
    }
  } catch {
    // SRS collection might not be initialized yet — that's fine
  }

  // --- Estimate session length ---
  // Use the most recent progress record's timestamp relative to now
  let sessionLengthMinutes = 0;
  const activeProgress = currentProgress.filter(p => p.status === 'in-progress');
  if (activeProgress.length > 0) {
    const latestUpdate = activeProgress.reduce((latest, p) => {
      const t = new Date(p.updatedAt).getTime();
      return t > latest ? t : latest;
    }, 0);

    if (latestUpdate > 0) {
      const elapsed = Date.now() - latestUpdate;
      // Only count as current session if activity was within last 30 minutes
      if (elapsed < 30 * 60 * 1000) {
        sessionLengthMinutes = Math.round(elapsed / (60 * 1000));
      }
    }
  }

  // --- Build context and compute ---
  const ctx: RecommendationContext = {
    childId,
    currentProgress,
    skillKnowledgeState,
    streakCount: profile.streakCount,
    lastActiveDate: profile.lastActiveDate ?? null,
    ddaMode,
    dailyChallengeCompleted,
    sessionLengthMinutes,
  };

  return computeNextBestAction(ctx);
}
