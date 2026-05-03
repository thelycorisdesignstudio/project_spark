import Profile, { IProfile } from '../models/Profile';
import Progress, { IProgress } from '../models/Progress';
import Badge, { IBadge } from '../models/Badge';
import DailyChallenge from '../models/DailyChallenge';
import { BADGE_DEFINITIONS } from '../services/badge.service';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type EngagementEventType =
  | 'streak-risk'
  | 'milestone-near'
  | 'badge-near'
  | 'friend-activity'
  | 'new-challenge';

export interface EngagementEvent {
  childId: string;
  type: EngagementEventType;
  /** 0 = informational, 10 = act now */
  urgency: number;
  message: string;
  pushTitle: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Exponential XP required to reach the *next* level.
 * Formula: 100 * 1.15^(level - 1)
 * Level 1 -> 100 XP, Level 2 -> 115 XP, etc.
 */
export function computeNextLevelXP(currentLevel: number): number {
  return Math.floor(100 * Math.pow(1.15, currentLevel)); // XP needed for (currentLevel + 1)
}

/**
 * Given a child's completed progress records and earned badges, determine
 * the closest un-earned badge that the child is one stage/mission away from
 * unlocking.  Returns null if nothing is close.
 */
export function computeNearestBadge(
  progressRecords: Pick<IProgress, 'worldId' | 'missionId' | 'stageId' | 'status' | 'hintsUsed'>[],
  earnedBadges: Pick<IBadge, 'badgeSlug'>[],
): { name: string; slug: string } | null {
  const earnedSlugs = new Set(earnedBadges.map((b) => b.badgeSlug));

  // World-completion badges: check if only 1 stage remains in any world
  for (let worldId = 1; worldId <= 5; worldId++) {
    const slug = `world-${worldId}`;
    if (earnedSlugs.has(slug)) continue;

    // A world has 6 missions x 3 stages = 18 stages total
    const completedInWorld = progressRecords.filter(
      (p) => p.worldId === worldId && p.status === 'completed',
    );
    const totalStages = 6 * 3; // 18
    if (completedInWorld.length >= totalStages - 1) {
      const def = BADGE_DEFINITIONS[slug];
      return { name: def?.name ?? slug, slug };
    }
  }

  // Streak badges - cannot evaluate from progress alone; skip here
  // (streaks are time-based, handled by streak-risk instead)

  // No-hints hero: child is in-progress on a mission with 0 hints so far
  if (!earnedSlugs.has('no-hints-hero')) {
    const zeroHintMissions = progressRecords.filter(
      (p) => p.status === 'completed' && p.hintsUsed === 0,
    );
    // Group by world+mission to see if any *full* mission (all 3 stages) was done hintless
    const missionKey = (p: Pick<IProgress, 'worldId' | 'missionId'>) =>
      `${p.worldId}-${p.missionId}`;
    const missionMap = new Map<string, number>();
    for (const p of zeroHintMissions) {
      const k = missionKey(p);
      missionMap.set(k, (missionMap.get(k) ?? 0) + 1);
    }
    // If any mission has 2 of 3 stages complete with 0 hints, badge is one stage away
    for (const [, count] of missionMap) {
      if (count === 2) {
        const def = BADGE_DEFINITIONS['no-hints-hero'];
        return { name: def?.name ?? 'No Hints Hero', slug: 'no-hints-hero' };
      }
    }
  }

  // Challenger badge: if never completed a daily challenge, skip (too far)
  // All-worlds badge: if 4 of 5 world badges earned
  if (!earnedSlugs.has('all-worlds')) {
    const worldBadgeCount = [1, 2, 3, 4, 5].filter((w) =>
      earnedSlugs.has(`world-${w}`),
    ).length;
    if (worldBadgeCount === 4) {
      const def = BADGE_DEFINITIONS['all-worlds'];
      return { name: def?.name ?? 'Grand Master', slug: 'all-worlds' };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main function
// ---------------------------------------------------------------------------

/**
 * Compute engagement events for a child.  Designed to be called by a
 * scheduled job or push-notification service to decide what (if anything)
 * to nudge the child about.
 */
export async function computeReEngagementEvents(
  childId: string,
): Promise<EngagementEvent[]> {
  const events: EngagementEvent[] = [];

  // Fetch data in parallel
  const [profile, progressRecords, earnedBadges, todayChallenge] = await Promise.all([
    Profile.findOne({ userId: childId }).lean<IProfile>(),
    Progress.find({ childId }).lean<IProgress[]>(),
    Badge.find({ childId }).lean<IBadge[]>(),
    DailyChallenge.findOne({
      date: new Date().toISOString().slice(0, 10),
    }).lean(),
  ]);

  if (!profile) return events;

  // ------------------------------------------------------------------
  // 1. Streak at risk (18-22 hours since last session, streakCount > 0)
  // ------------------------------------------------------------------
  if (profile.lastActiveDate && profile.streakCount > 0) {
    const hoursSinceActive =
      (Date.now() - new Date(profile.lastActiveDate).getTime()) / (1000 * 60 * 60);

    if (hoursSinceActive >= 18 && hoursSinceActive <= 22) {
      events.push({
        childId,
        type: 'streak-risk',
        urgency: 9,
        message: `Your ${profile.streakCount}-day streak is about to end! Log in to keep it going.`,
        pushTitle: `${profile.displayName}, don't lose your streak!`,
      });
    }
  }

  // ------------------------------------------------------------------
  // 2. XP milestone near (within 50 XP of levelling up)
  // ------------------------------------------------------------------
  const xpForNextLevel = computeNextLevelXP(profile.level);
  const xpRemaining = xpForNextLevel - profile.xp;

  if (xpRemaining > 0 && xpRemaining <= 50) {
    events.push({
      childId,
      type: 'milestone-near',
      urgency: 7,
      message: `Only ${xpRemaining} XP until you reach Level ${profile.level + 1}! One more stage could do it.`,
      pushTitle: `Almost Level ${profile.level + 1}!`,
    });
  }

  // ------------------------------------------------------------------
  // 3. Badge one stage away
  // ------------------------------------------------------------------
  const nearestBadge = computeNearestBadge(progressRecords, earnedBadges);
  if (nearestBadge) {
    events.push({
      childId,
      type: 'badge-near',
      urgency: 6,
      message: `You're one step away from earning the "${nearestBadge.name}" badge!`,
      pushTitle: `Badge almost yours!`,
    });
  }

  // ------------------------------------------------------------------
  // 4. New daily challenge available
  // ------------------------------------------------------------------
  if (todayChallenge) {
    const alreadyCompleted = todayChallenge.completedBy?.some(
      (id) => id.toString() === childId,
    );

    if (!alreadyCompleted) {
      events.push({
        childId,
        type: 'new-challenge',
        urgency: 4,
        message: `Today's challenge "${todayChallenge.title}" is live! Earn ${todayChallenge.xpReward} XP.`,
        pushTitle: `New Daily Challenge!`,
      });
    }
  }

  // Sort by urgency descending (most urgent first)
  events.sort((a, b) => b.urgency - a.urgency);

  return events;
}
