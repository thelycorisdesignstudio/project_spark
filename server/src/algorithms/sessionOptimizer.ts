/**
 * Session Optimizer
 *
 * Monitors real-time session metrics to detect cognitive fatigue and
 * recommends optimal session lengths personalized to each child.
 * Built for SPARK's kids-coding platform where maintaining engagement
 * without burnout is critical.
 */

import mongoose from 'mongoose';
import Progress from '../models/Progress';
import Profile from '../models/Profile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SessionMetrics {
  /** Ratio of errors to total actions in the last 5 minutes (0-1) */
  errorRateLast5Mins: number;
  /** Messages sent per minute over the last 5 minutes */
  messageFrequency: number;
  /** Number of meaningful code edits in the last 5 minutes */
  codeChangesLast5Mins: number;
  /** Total minutes elapsed since session start */
  sessionLengthMinutes: number;
}

export interface SessionSummary {
  childId: string;
  sessionId: string;
  xpEarned: number;
  stagesCompleted: number;
  timeSpentMinutes: number;
  averageHintsPerStage: number;
  averageTimePerStageSeconds: number;
}

// ---------------------------------------------------------------------------
// Fatigue detection
// ---------------------------------------------------------------------------

/**
 * Detect whether a child is showing signs of cognitive fatigue.
 *
 * Heuristic signals:
 *   1. Error rate is climbing (above baseline threshold)
 *   2. Engagement is dropping (message frequency & code changes fall)
 *   3. Session has been running for a while
 *
 * The detection is intentionally conservative — we'd rather gently
 * suggest a break than interrupt flow state.  The thresholds are tuned
 * for kids aged 5-18.
 *
 * @param metrics Current rolling-window session metrics
 * @returns true if the child appears fatigued
 */
export function detectFatigue(metrics: SessionMetrics): boolean {
  const {
    errorRateLast5Mins,
    messageFrequency,
    codeChangesLast5Mins,
    sessionLengthMinutes,
  } = metrics;

  // --- Individual fatigue signals ---

  // High error rate: above 40% errors in the recent window
  const highErrors = errorRateLast5Mins > 0.4;

  // Low engagement: very few code changes or messages
  const lowEngagement = codeChangesLast5Mins <= 1 && messageFrequency < 0.5;

  // Declining activity: some code changes but coupled with low messaging
  // suggests the child is "going through the motions"
  const decliningActivity =
    codeChangesLast5Mins <= 3 && messageFrequency < 1.0 && errorRateLast5Mins > 0.25;

  // Extended session without much output
  const longSession = sessionLengthMinutes > 30;
  const veryLongSession = sessionLengthMinutes > 45;

  // --- Composite decision ---

  // Clear fatigue: high errors + low engagement regardless of duration
  if (highErrors && lowEngagement) {
    return true;
  }

  // Probable fatigue: long session with declining metrics
  if (longSession && decliningActivity) {
    return true;
  }

  // Very long session with ANY negative signal
  if (veryLongSession && (highErrors || lowEngagement || decliningActivity)) {
    return true;
  }

  // Rising errors on a moderate-length session with falling engagement
  if (
    sessionLengthMinutes > 20 &&
    errorRateLast5Mins > 0.35 &&
    messageFrequency < 1.5 &&
    codeChangesLast5Mins <= 2
  ) {
    return true;
  }

  return false;
}

// ---------------------------------------------------------------------------
// Session summary
// ---------------------------------------------------------------------------

/**
 * Compute a summary of what was accomplished during a specific session.
 *
 * Sessions are identified by a sessionId string.  Since the Progress
 * model doesn't store sessionId natively, we approximate a session as
 * all Progress records for the child that were updated within the
 * session window.  The sessionId is treated as an ISO timestamp marking
 * the session start; all progress records updated between that time and
 * now belong to the session.
 *
 * If sessionId is not a valid ISO string, we fall back to the last 60
 * minutes of activity.
 *
 * @param childId   Profile ObjectId as string
 * @param sessionId ISO timestamp of session start, or opaque identifier
 */
export async function getSessionSummary(
  childId: string,
  sessionId: string,
): Promise<SessionSummary> {
  // Determine the session time window
  let sessionStart: Date;
  const parsed = Date.parse(sessionId);
  if (!isNaN(parsed)) {
    sessionStart = new Date(parsed);
  } else {
    // Fallback: treat the session as the last 60 minutes
    sessionStart = new Date(Date.now() - 60 * 60 * 1000);
  }

  const progressRecords = await Progress.find({
    childId,
    updatedAt: { $gte: sessionStart },
  })
    .lean()
    .exec();

  const stagesCompleted = progressRecords.filter(p => p.status === 'completed').length;
  const xpEarned = progressRecords.reduce((sum, p) => sum + p.xpEarned, 0);
  const totalTimeSeconds = progressRecords.reduce((sum, p) => sum + p.timeSpentSeconds, 0);
  const totalHints = progressRecords.reduce((sum, p) => sum + p.hintsUsed, 0);

  const averageHintsPerStage =
    progressRecords.length > 0 ? totalHints / progressRecords.length : 0;

  const averageTimePerStageSeconds =
    progressRecords.length > 0 ? totalTimeSeconds / progressRecords.length : 0;

  return {
    childId,
    sessionId,
    xpEarned,
    stagesCompleted,
    timeSpentMinutes: Math.round(totalTimeSeconds / 60),
    averageHintsPerStage: Math.round(averageHintsPerStage * 100) / 100,
    averageTimePerStageSeconds: Math.round(averageTimePerStageSeconds),
  };
}

// ---------------------------------------------------------------------------
// Optimal session length
// ---------------------------------------------------------------------------

/**
 * Recommend an optimal session length (in minutes) for a child based on
 * their historical performance patterns.
 *
 * Approach:
 *   1. Pull all completed Progress records, grouped into approximate
 *      sessions (clusters of activity with <30 min gaps).
 *   2. For each reconstructed session compute: length, XP-per-minute.
 *   3. Find the session length range that maximizes XP-per-minute
 *      (proxy for peak learning efficiency).
 *   4. Clamp the recommendation to sane bounds for kids.
 *
 * @param childId Profile ObjectId as string
 * @returns Recommended session length in minutes
 */
export async function getOptimalSessionLength(childId: string): Promise<number> {
  const MIN_SESSION_MINUTES = 10;
  const MAX_SESSION_MINUTES = 60;
  const DEFAULT_SESSION_MINUTES = 25;
  const SESSION_GAP_MS = 30 * 60 * 1000; // 30 minutes gap = new session

  // Retrieve the child's profile for age-based adjustments
  const profile = await Profile.findById(childId).lean().exec();

  // Age-based cap: younger kids have shorter optimal windows
  let ageCap = MAX_SESSION_MINUTES;
  if (profile?.age) {
    if (profile.age <= 7) {
      ageCap = 20;
    } else if (profile.age <= 10) {
      ageCap = 30;
    } else if (profile.age <= 13) {
      ageCap = 45;
    }
    // 14+ can go up to MAX_SESSION_MINUTES
  }

  // Pull historical progress sorted by time
  const allProgress = await Progress.find({
    childId,
    status: 'completed',
  })
    .sort({ completedAt: 1 })
    .lean()
    .exec();

  if (allProgress.length < 3) {
    // Not enough data — return age-appropriate default
    return Math.min(DEFAULT_SESSION_MINUTES, ageCap);
  }

  // --- Reconstruct sessions from progress timestamps ---
  interface ReconstructedSession {
    totalSeconds: number;
    totalXp: number;
  }

  const sessions: ReconstructedSession[] = [];
  let currentSessionSeconds = 0;
  let currentSessionXp = 0;
  let lastTimestamp: number | null = null;

  for (const prog of allProgress) {
    const ts = prog.completedAt
      ? new Date(prog.completedAt).getTime()
      : new Date(prog.updatedAt).getTime();

    if (lastTimestamp !== null && ts - lastTimestamp > SESSION_GAP_MS) {
      // Gap detected — close previous session
      if (currentSessionSeconds > 0) {
        sessions.push({
          totalSeconds: currentSessionSeconds,
          totalXp: currentSessionXp,
        });
      }
      currentSessionSeconds = 0;
      currentSessionXp = 0;
    }

    currentSessionSeconds += prog.timeSpentSeconds;
    currentSessionXp += prog.xpEarned;
    lastTimestamp = ts;
  }

  // Close final session
  if (currentSessionSeconds > 0) {
    sessions.push({
      totalSeconds: currentSessionSeconds,
      totalXp: currentSessionXp,
    });
  }

  if (sessions.length === 0) {
    return Math.min(DEFAULT_SESSION_MINUTES, ageCap);
  }

  // --- Find the session-length bucket with peak XP-per-minute ---
  // Bucket sessions into 5-minute bins and compute average efficiency
  const buckets: Map<number, { totalEfficiency: number; count: number }> = new Map();

  for (const session of sessions) {
    const minutes = Math.max(1, Math.round(session.totalSeconds / 60));
    const efficiency = session.totalXp / minutes; // XP per minute
    const bucket = Math.round(minutes / 5) * 5 || 5; // 5-min buckets

    const existing = buckets.get(bucket);
    if (existing) {
      existing.totalEfficiency += efficiency;
      existing.count += 1;
    } else {
      buckets.set(bucket, { totalEfficiency: efficiency, count: 1 });
    }
  }

  // Find bucket with highest average efficiency
  let bestBucket = DEFAULT_SESSION_MINUTES;
  let bestEfficiency = -1;

  for (const [bucket, data] of buckets.entries()) {
    const avgEfficiency = data.totalEfficiency / data.count;
    // Slight preference for longer sessions at equal efficiency
    // (more total learning even if rate is equal)
    const adjustedEfficiency = avgEfficiency * (1 + bucket * 0.001);
    if (adjustedEfficiency > bestEfficiency) {
      bestEfficiency = adjustedEfficiency;
      bestBucket = bucket;
    }
  }

  // Clamp to sane bounds
  const recommended = Math.max(
    MIN_SESSION_MINUTES,
    Math.min(ageCap, bestBucket),
  );

  return recommended;
}
