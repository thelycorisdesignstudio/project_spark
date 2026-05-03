/**
 * Optimal Challenge Point (OCP) Algorithm
 *
 * Implements the Optimal Challenge Point framework for matching mission
 * difficulty to a child's current skill level. Uses a Gaussian curve
 * centered at a slight positive gap (gap = 0.1) so the child is always
 * gently stretched beyond their current ability — the sweet spot for
 * learning and flow.
 */

import Progress from '../models/Progress';
import Profile from '../models/Profile';

// ---------------------------------------------------------------------------
// Curriculum difficulty table
// Each cell: normalized difficulty 0-1 for (worldId, missionId)
// World 1 = HTML basics, World 2 = CSS, World 3 = JS intro,
// World 4 = advanced JS, World 5 = capstone projects
// ---------------------------------------------------------------------------

const CURRICULUM_DIFFICULTY: Record<number, Record<number, number>> = {
  1: { 1: 0.05, 2: 0.10, 3: 0.15, 4: 0.20, 5: 0.25, 6: 0.30 },
  2: { 1: 0.20, 2: 0.28, 3: 0.35, 4: 0.42, 5: 0.48, 6: 0.55 },
  3: { 1: 0.40, 2: 0.48, 3: 0.55, 4: 0.62, 5: 0.68, 6: 0.75 },
  4: { 1: 0.60, 2: 0.67, 3: 0.73, 4: 0.80, 5: 0.86, 6: 0.92 },
  5: { 1: 0.75, 2: 0.80, 3: 0.85, 4: 0.90, 5: 0.95, 6: 1.00 },
};

// ---------------------------------------------------------------------------
// Skill-level string to numeric mapping
// ---------------------------------------------------------------------------

const SKILL_LEVEL_MAP: Record<string, number> = {
  'spark-starter':   0.10,
  'code-explorer':   0.30,
  'build-master':    0.50,
  'code-wizard':     0.70,
  'spark-legend':    0.90,
};

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface RankedMission {
  worldId: number;
  missionId: number;
  difficulty: number;
  ocpScore: number;
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * Compute the OCP score using a Gaussian curve centered at an ideal
 * skill–challenge gap of +0.1.  A score of 1.0 means the mission is
 * perfectly calibrated; the score falls off symmetrically for missions
 * that are too easy or too hard.
 *
 * Formula: score = exp( -(gap - IDEAL_GAP)^2 / (2 * sigma^2) )
 *
 * @param skillLevel     Normalized skill level 0-1
 * @param challengeLevel Normalized challenge difficulty 0-1
 * @returns OCP score in range (0, 1]
 */
export function computeOCPScore(skillLevel: number, challengeLevel: number): number {
  const IDEAL_GAP = 0.1;  // slight stretch is optimal
  const SIGMA = 0.25;     // controls width of the Gaussian bell

  const gap = challengeLevel - skillLevel;
  const deviation = gap - IDEAL_GAP;
  const score = Math.exp(-(deviation * deviation) / (2 * SIGMA * SIGMA));

  return score;
}

/**
 * Return the normalized 0-1 difficulty for a specific mission in the
 * curriculum.  Falls back to a linear interpolation if the worldId or
 * missionId is outside the predefined table.
 */
export function getMissionDifficulty(worldId: number, missionId: number): number {
  const world = CURRICULUM_DIFFICULTY[worldId];
  if (world && world[missionId] !== undefined) {
    return world[missionId];
  }

  // Fallback: linear interpolation across the full 5-world, 6-mission grid
  const clampedWorld = Math.max(1, Math.min(5, worldId));
  const clampedMission = Math.max(1, Math.min(6, missionId));
  const totalSlots = 5 * 6; // 30 mission slots
  const linearIndex = (clampedWorld - 1) * 6 + (clampedMission - 1); // 0-29
  return Math.min(1, Math.max(0, linearIndex / (totalSlots - 1)));
}

/**
 * Rank a list of available missions by their OCP score relative to the
 * child's current ability.  Missions closest to the optimal challenge
 * point appear first.
 *
 * The child's numeric skill level is derived from:
 *   1. The average of their skillKnowledgeState values (if any exist), OR
 *   2. Their categorical skillLevel string mapped to a number.
 *
 * @param childId            Mongo ObjectId as string
 * @param availableMissions  Candidate missions with their difficulty
 * @returns Missions sorted descending by OCP score
 */
export async function rankMissionsByOCP(
  childId: string,
  availableMissions: { worldId: number; missionId: number; difficulty: number }[],
): Promise<RankedMission[]> {
  // Resolve the child's numeric skill level
  const profile = await Profile.findById(childId).lean().exec();

  let numericSkill: number;

  if (profile && profile.skillKnowledgeState) {
    // skillKnowledgeState is stored as a Map in Mongoose but lean() returns a plain object
    const stateObj = profile.skillKnowledgeState as unknown as Record<string, number>;
    const values = Object.values(stateObj);
    if (values.length > 0) {
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      // Clamp to [0, 1] — knowledge values are expected in that range
      numericSkill = Math.max(0, Math.min(1, avg));
    } else {
      numericSkill = SKILL_LEVEL_MAP[profile.skillLevel] ?? 0.1;
    }
  } else {
    numericSkill = profile ? (SKILL_LEVEL_MAP[profile.skillLevel] ?? 0.1) : 0.1;
  }

  // Also factor in recent performance — if the child breezes through
  // recent missions (low hints, fast completion) nudge skill estimate up
  const recentProgress = await Progress.find({ childId })
    .sort({ updatedAt: -1 })
    .limit(5)
    .lean()
    .exec();

  if (recentProgress.length > 0) {
    const avgHints =
      recentProgress.reduce((s, p) => s + p.hintsUsed, 0) / recentProgress.length;
    const completedCount = recentProgress.filter(p => p.status === 'completed').length;
    const completionRate = completedCount / recentProgress.length;

    // Small adjustment: up to +0.08 for flawless runs, down to -0.05 for struggling
    const adjustment = (completionRate - 0.5) * 0.1 - avgHints * 0.015;
    numericSkill = Math.max(0, Math.min(1, numericSkill + adjustment));
  }

  // Score and sort
  const ranked: RankedMission[] = availableMissions.map(m => ({
    worldId: m.worldId,
    missionId: m.missionId,
    difficulty: m.difficulty,
    ocpScore: computeOCPScore(numericSkill, m.difficulty),
  }));

  ranked.sort((a, b) => b.ocpScore - a.ocpScore);

  return ranked;
}
