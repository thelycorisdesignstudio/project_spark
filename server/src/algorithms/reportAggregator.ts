import mongoose from 'mongoose';
import { AnalyticsEvent, AnalyticsEventType, IAnalyticsEvent } from './analytics';
import Progress from '../models/Progress';
import Profile from '../models/Profile';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DailyTimeEntry {
  date: string;           // YYYY-MM-DD
  totalMinutes: number;
}

export interface ErrorCategoryEntry {
  category: string;
  count: number;
}

export interface XpOverTimeEntry {
  date: string;           // YYYY-MM-DD
  xpEarned: number;
}

export interface WeeklyStats {
  dailyTime: DailyTimeEntry[];
  missionsCompleted: number;
  totalXp: number;
  errorBreakdown: ErrorCategoryEntry[];
  xpOverTime: XpOverTimeEntry[];
}

export interface DailyActivity {
  date: string;
  events: IAnalyticsEvent[];
  totalEvents: number;
  sessionCount: number;
  totalMinutes: number;
}

export interface SkillState {
  skill: string;
  mastery: number;       // 0-1 probability from BKT
  label: string;         // human-readable proficiency label
}

export interface SkillProgressReport {
  childId: string;
  displayName: string;
  level: number;
  xp: number;
  skills: SkillState[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function startOfWeek(): Date {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday-start
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function masteryLabel(p: number): string {
  if (p >= 0.95) return 'Mastered';
  if (p >= 0.8) return 'Proficient';
  if (p >= 0.5) return 'Developing';
  if (p >= 0.2) return 'Emerging';
  return 'Novice';
}

// ---------------------------------------------------------------------------
// Weekly Stats
// ---------------------------------------------------------------------------

/**
 * Aggregate the current week's data for a child across four parallel
 * MongoDB pipelines.  Returns daily time breakdown, mission/XP totals,
 * error category counts, and XP over time.
 */
export async function getWeeklyStats(childId: string): Promise<WeeklyStats> {
  const weekStart = startOfWeek();
  const childObjectId = new mongoose.Types.ObjectId(childId);

  // Run all four pipelines in parallel
  const [dailyTimeResult, missionStatsResult, errorBreakdownResult, xpOverTimeResult] =
    await Promise.all([
      // 1. Daily time breakdown from session_end events
      //    Each session_end event is expected to carry metadata.durationMinutes
      AnalyticsEvent.aggregate<{ _id: string; totalMinutes: number }>([
        {
          $match: {
            childId: childObjectId,
            eventType: 'session_end' as AnalyticsEventType,
            timestamp: { $gte: weekStart },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            totalMinutes: { $sum: { $ifNull: ['$metadata.durationMinutes', 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // 2. Missions completed + total XP this week
      Progress.aggregate<{ missionsCompleted: number; totalXp: number }>([
        {
          $match: {
            childId: childObjectId,
            status: 'completed',
            completedAt: { $gte: weekStart },
          },
        },
        {
          // Count distinct missions (a mission = unique worldId+missionId combo
          // where all 3 stages are complete).  We approximate by counting
          // stage completions and summing XP; the caller can refine if needed.
          $group: {
            _id: null,
            missionsCompleted: { $sum: 1 },
            totalXp: { $sum: '$xpEarned' },
          },
        },
      ]),

      // 3. Error category breakdown
      //    Each code_error event is expected to carry metadata.category
      AnalyticsEvent.aggregate<{ _id: string; count: number }>([
        {
          $match: {
            childId: childObjectId,
            eventType: 'code_error' as AnalyticsEventType,
            timestamp: { $gte: weekStart },
          },
        },
        {
          $group: {
            _id: { $ifNull: ['$metadata.category', 'unknown'] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ]),

      // 4. XP earned over time (daily)
      //    stage_complete, mission_complete, daily_challenge_complete, etc.
      AnalyticsEvent.aggregate<{ _id: string; xpEarned: number }>([
        {
          $match: {
            childId: childObjectId,
            eventType: {
              $in: [
                'stage_complete',
                'mission_complete',
                'world_complete',
                'daily_challenge_complete',
                'badge_earned',
                'level_up',
              ] as AnalyticsEventType[],
            },
            timestamp: { $gte: weekStart },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            xpEarned: { $sum: { $ifNull: ['$metadata.xp', 0] } },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

  // Shape results
  const dailyTime: DailyTimeEntry[] = dailyTimeResult.map((r) => ({
    date: r._id,
    totalMinutes: Math.round(r.totalMinutes * 10) / 10,
  }));

  const missionRow = missionStatsResult[0];
  const missionsCompleted = missionRow?.missionsCompleted ?? 0;
  const totalXp = missionRow?.totalXp ?? 0;

  const errorBreakdown: ErrorCategoryEntry[] = errorBreakdownResult.map((r) => ({
    category: String(r._id),
    count: r.count,
  }));

  const xpOverTime: XpOverTimeEntry[] = xpOverTimeResult.map((r) => ({
    date: r._id,
    xpEarned: r.xpEarned,
  }));

  return { dailyTime, missionsCompleted, totalXp, errorBreakdown, xpOverTime };
}

// ---------------------------------------------------------------------------
// Daily Activity
// ---------------------------------------------------------------------------

/**
 * Fetch all analytics events for a child on a single calendar day.
 */
export async function getDailyActivity(
  childId: string,
  date: Date,
): Promise<DailyActivity> {
  const dayStart = startOfDay(date);
  const dayEnd = endOfDay(date);

  const events = await AnalyticsEvent.find({
    childId,
    timestamp: { $gte: dayStart, $lte: dayEnd },
  })
    .sort({ timestamp: 1 })
    .lean<IAnalyticsEvent[]>();

  // Count distinct sessions
  const sessionIds = new Set(events.map((e) => e.sessionId));

  // Sum duration from session_end events
  const totalMinutes = events
    .filter((e) => e.eventType === 'session_end')
    .reduce((sum, e) => {
      const dur = (e.metadata as Record<string, unknown>)?.durationMinutes;
      return sum + (typeof dur === 'number' ? dur : 0);
    }, 0);

  return {
    date: dayStart.toISOString().slice(0, 10),
    events,
    totalEvents: events.length,
    sessionCount: sessionIds.size,
    totalMinutes: Math.round(totalMinutes * 10) / 10,
  };
}

// ---------------------------------------------------------------------------
// Skill Progress Report (for parent dashboard)
// ---------------------------------------------------------------------------

/**
 * Format the child's BKT (Bayesian Knowledge Tracing) skill-knowledge state
 * into a parent-friendly report.  Each skill maps to a mastery probability
 * (0-1) stored on the Profile model.
 */
export async function getSkillProgressReport(
  childId: string,
): Promise<SkillProgressReport> {
  const profile = await Profile.findOne({ userId: childId }).lean();
  if (!profile) {
    throw new Error(`Profile not found for childId: ${childId}`);
  }

  // profile.skillKnowledgeState is stored as a Map<string, number> in Mongoose.
  // After .lean() it becomes a plain object (or potentially a Map depending on
  // Mongoose version).  Normalise to entries.
  const raw = profile.skillKnowledgeState;
  const entries: [string, number][] =
    raw instanceof Map
      ? Array.from(raw.entries())
      : Object.entries(raw ?? {}).map(([k, v]) => [k, Number(v)]);

  const skills: SkillState[] = entries.map(([skill, mastery]) => ({
    skill,
    mastery: Math.round(mastery * 1000) / 1000, // 3 decimal places
    label: masteryLabel(mastery),
  }));

  // Sort: lowest mastery first so parents see where the child needs help
  skills.sort((a, b) => a.mastery - b.mastery);

  return {
    childId,
    displayName: profile.displayName,
    level: profile.level,
    xp: profile.xp,
    skills,
  };
}
