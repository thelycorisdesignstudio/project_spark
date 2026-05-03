export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface BadgeDefinition {
  name: string;
  icon: string;
  description: string;
  rarity: BadgeRarity;
  xpBonus: number;
}

export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
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
  'challenge-streak-7': { name: '7-Day Challenger', icon: '🗓️', description: '7 daily challenges in a row', rarity: 'rare', xpBonus: 200 },
  'level-10': { name: 'Code Explorer', icon: '🚀', description: 'Reached Level 10', rarity: 'uncommon', xpBonus: 0 },
  'level-25': { name: 'Build Master', icon: '🔨', description: 'Reached Level 25', rarity: 'rare', xpBonus: 0 },
  'spark-legend': { name: 'SPARK Legend', icon: '👑', description: 'Reached Level 50', rarity: 'legendary', xpBonus: 0 },
};

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#8899BB',
  uncommon: '#0891B2',
  rare: '#7C3AED',
  epic: '#D97706',
  legendary: '#DC2626',
};

export const RARITY_GLOW: Record<BadgeRarity, string> = {
  common: 'rgba(136, 153, 187, 0.2)',
  uncommon: 'rgba(8, 145, 178, 0.25)',
  rare: 'rgba(124, 58, 237, 0.25)',
  epic: 'rgba(217, 119, 6, 0.25)',
  legendary: 'rgba(220, 38, 38, 0.3)',
};
