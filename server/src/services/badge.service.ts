import Badge from '../models/Badge';
import Profile from '../models/Profile';
import Progress from '../models/Progress';

export const BADGE_DEFINITIONS: Record<string, {
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpBonus: number;
}> = {
  'first-spark': { name: 'First Spark', icon: '⚡', description: 'Ran your very first line of code', rarity: 'common', xpBonus: 0 },
  'first-project': { name: 'Creator', icon: '🏗️', description: 'Saved your first project', rarity: 'common', xpBonus: 0 },
  'bug-squasher': { name: 'Bug Squasher', icon: '🐛', description: 'Fixed your first error', rarity: 'common', xpBonus: 25 },
  'no-hints-hero': { name: 'No Hints Hero', icon: '🧠', description: 'Completed a mission without hints', rarity: 'rare', xpBonus: 75 },
  'speed-coder': { name: 'Speed Coder', icon: '💨', description: 'Finished a mission in under 10 minutes', rarity: 'rare', xpBonus: 50 },
  'perfectionist': { name: 'Perfectionist', icon: '💎', description: 'Got all checkpoints on first try', rarity: 'epic', xpBonus: 100 },
  'streak-3': { name: 'On Fire', icon: '🔥', description: '3 days in a row', rarity: 'common', xpBonus: 50 },
  'streak-7': { name: 'Week Warrior', icon: '🔥🔥', description: '7 days in a row', rarity: 'uncommon', xpBonus: 150 },
  'streak-14': { name: 'Fortnight Fighter', icon: '⚔️', description: '14 days in a row', rarity: 'rare', xpBonus: 250 },
  'streak-30': { name: 'Month Master', icon: '🌟', description: '30 days straight', rarity: 'epic', xpBonus: 500 },
  'streak-100': { name: 'Century Coder', icon: '💯', description: '100 days. Legendary.', rarity: 'legendary', xpBonus: 1000 },
  'world-1': { name: 'Web Knight', icon: '🏰', description: 'Conquered the Web Kingdom', rarity: 'uncommon', xpBonus: 100 },
  'world-2': { name: 'Logic Lord', icon: '🧩', description: 'Mastered the Logic Lands', rarity: 'uncommon', xpBonus: 100 },
  'world-3': { name: 'Animate Ace', icon: '🎬', description: 'Tamed the Animation Archipelago', rarity: 'rare', xpBonus: 150 },
  'world-4': { name: 'Game Maker', icon: '🎮', description: 'Escaped the Game Galaxy', rarity: 'rare', xpBonus: 150 },
  'world-5': { name: 'Pythoneer', icon: '🐍', description: 'Returned from the Python Planet', rarity: 'epic', xpBonus: 200 },
  'all-worlds': { name: 'Grand Master', icon: '🌌', description: 'Completed all 5 worlds', rarity: 'legendary', xpBonus: 1000 },
  'builder': { name: 'Builder', icon: '📡', description: 'Published your first public project', rarity: 'uncommon', xpBonus: 30 },
  'challenger': { name: 'Challenger', icon: '🎯', description: 'Completed your first daily challenge', rarity: 'common', xpBonus: 25 },
  'level-10': { name: 'Code Explorer', icon: '🚀', description: 'Reached Level 10', rarity: 'uncommon', xpBonus: 0 },
  'level-25': { name: 'Build Master', icon: '🔨', description: 'Reached Level 25', rarity: 'rare', xpBonus: 0 },
  'spark-legend': { name: 'SPARK Legend', icon: '👑', description: 'Reached Level 50', rarity: 'legendary', xpBonus: 0 },
};

export const awardBadge = async (
  childId: string,
  badgeSlug: string
): Promise<{ awarded: boolean; badge?: typeof BADGE_DEFINITIONS[string] }> => {
  const definition = BADGE_DEFINITIONS[badgeSlug];
  if (!definition) return { awarded: false };

  // Check if already earned (dedup)
  const existing = await Badge.findOne({ childId, badgeSlug });
  if (existing) return { awarded: false };

  await Badge.create({ childId, badgeSlug });
  return { awarded: true, badge: definition };
};

export const checkStreakBadges = async (childId: string, streakCount: number): Promise<string[]> => {
  const awarded: string[] = [];
  const milestones: Record<number, string> = {
    3: 'streak-3',
    7: 'streak-7',
    14: 'streak-14',
    30: 'streak-30',
    100: 'streak-100',
  };

  for (const [milestone, slug] of Object.entries(milestones)) {
    if (streakCount >= Number(milestone)) {
      const result = await awardBadge(childId, slug);
      if (result.awarded) awarded.push(slug);
    }
  }

  return awarded;
};

export const checkLevelBadges = async (childId: string, level: number): Promise<string[]> => {
  const awarded: string[] = [];
  const milestones: Record<number, string> = {
    10: 'level-10',
    25: 'level-25',
    50: 'spark-legend',
  };

  for (const [milestone, slug] of Object.entries(milestones)) {
    if (level >= Number(milestone)) {
      const result = await awardBadge(childId, slug);
      if (result.awarded) awarded.push(slug);
    }
  }

  return awarded;
};

export const checkWorldCompletionBadge = async (childId: string, worldId: number): Promise<string[]> => {
  const awarded: string[] = [];
  const worldSlug = `world-${worldId}`;
  const result = await awardBadge(childId, worldSlug);
  if (result.awarded) awarded.push(worldSlug);

  // Check if all 5 worlds completed
  const worldBadges = await Badge.find({
    childId,
    badgeSlug: { $in: ['world-1', 'world-2', 'world-3', 'world-4', 'world-5'] },
  });
  if (worldBadges.length === 5) {
    const grandResult = await awardBadge(childId, 'all-worlds');
    if (grandResult.awarded) awarded.push('all-worlds');
  }

  return awarded;
};
