import Profile from '../models/Profile';

export const XP_CONFIG = {
  STAGE_COMPLETE: 50,
  MISSION_COMPLETE_BONUS: 150,
  WORLD_COMPLETE_BONUS: 500,
  DAILY_STREAK_BONUS: 25,
  NO_HINTS_MISSION_BONUS: 75,
  SPEED_BONUS: 50,
  DAILY_CHALLENGE_COMPLETE: 100,
  FIRST_CODE_RUN: 10,
  PUBLISH_PROJECT: 30,
  FIRST_LOGIN_OF_DAY: 15,
} as const;

export const LEVEL_THRESHOLDS = Array.from({ length: 50 }, (_, i) => ({
  level: i + 1,
  xpRequired: Math.floor(100 * Math.pow(1.15, i)),
  tier: i < 10 ? 'spark-starter' : i < 20 ? 'code-explorer' : i < 30 ? 'build-master' : i < 40 ? 'code-wizard' : 'spark-legend',
  tierLabel: i < 10 ? 'Spark Starter' : i < 20 ? 'Code Explorer' : i < 30 ? 'Build Master' : i < 40 ? 'Code Wizard' : 'SPARK Legend',
  ringColor: i < 10 ? '#8899BB' : i < 20 ? '#0891B2' : i < 30 ? '#059669' : i < 40 ? '#7C3AED' : '#D97706',
}));

export const calculateLevel = (totalXp: number): { level: number; tier: string; tierLabel: string; ringColor: string } => {
  let currentLevel = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (totalXp >= threshold.xpRequired) {
      currentLevel = threshold.level;
    } else {
      break;
    }
  }
  const data = LEVEL_THRESHOLDS[currentLevel - 1];
  return {
    level: data.level,
    tier: data.tier,
    tierLabel: data.tierLabel,
    ringColor: data.ringColor,
  };
};

export const awardXP = async (
  profileId: string,
  xpAmount: number
): Promise<{ newXp: number; newLevel: number; leveledUp: boolean; tierChanged: boolean; oldTier: string; newTier: string }> => {
  const profile = await Profile.findById(profileId);
  if (!profile) throw new Error('Profile not found');

  const oldLevel = calculateLevel(profile.xp);
  const newXp = profile.xp + xpAmount;
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel.level > oldLevel.level;
  const tierChanged = newLevel.tier !== oldLevel.tier;

  await Profile.findByIdAndUpdate(profileId, {
    xp: newXp,
    level: newLevel.level,
    skillLevel: newLevel.tier,
  });

  return {
    newXp,
    newLevel: newLevel.level,
    leveledUp,
    tierChanged,
    oldTier: oldLevel.tier,
    newTier: newLevel.tier,
  };
};
