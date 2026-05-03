export const LEVEL_THRESHOLDS = Array.from({ length: 50 }, (_, i) => ({
  level: i + 1,
  xpRequired: Math.floor(100 * Math.pow(1.15, i)),
  tier: i < 10 ? 'spark-starter' as const : i < 20 ? 'code-explorer' as const : i < 30 ? 'build-master' as const : i < 40 ? 'code-wizard' as const : 'spark-legend' as const,
  tierLabel: i < 10 ? 'Spark Starter' : i < 20 ? 'Code Explorer' : i < 30 ? 'Build Master' : i < 40 ? 'Code Wizard' : 'SPARK Legend',
  ringColor: i < 10 ? '#8899BB' : i < 20 ? '#0891B2' : i < 30 ? '#059669' : i < 40 ? '#7C3AED' : '#D97706',
}));

export const LEVEL_TIERS = {
  'spark-starter': { range: [1, 9] as const, color: '#8899BB', label: 'Spark Starter', icon: '⭐' },
  'code-explorer': { range: [10, 19] as const, color: '#0891B2', label: 'Code Explorer', icon: '🚀' },
  'build-master': { range: [20, 29] as const, color: '#059669', label: 'Build Master', icon: '🔨' },
  'code-wizard': { range: [30, 39] as const, color: '#7C3AED', label: 'Code Wizard', icon: '🧙' },
  'spark-legend': { range: [40, 50] as const, color: '#D97706', label: 'SPARK Legend', icon: '👑' },
} as const;

export const getXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= 50) return 0;
  return LEVEL_THRESHOLDS[currentLevel].xpRequired;
};

export const getXPProgress = (xp: number, level: number): number => {
  if (level >= 50) return 100;
  const currentThreshold = LEVEL_THRESHOLDS[level - 1].xpRequired;
  const nextThreshold = LEVEL_THRESHOLDS[level].xpRequired;
  const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
};
