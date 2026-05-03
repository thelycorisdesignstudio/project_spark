import Profile from '../models/Profile';

export const updateStreak = async (
  profileId: string
): Promise<{ streakCount: number; wasUpdated: boolean; frozeUsed: boolean }> => {
  const profile = await Profile.findById(profileId);
  if (!profile) throw new Error('Profile not found');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = profile.lastActiveDate ? new Date(profile.lastActiveDate) : null;
  if (lastActive) lastActive.setHours(0, 0, 0, 0);

  // Already updated today
  const isToday = lastActive?.getTime() === today.getTime();
  if (isToday) {
    return { streakCount: profile.streakCount, wasUpdated: false, frozeUsed: false };
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = lastActive?.getTime() === yesterday.getTime();

  let newStreak: number;
  let frozeUsed = false;

  if (wasYesterday) {
    // Consecutive day
    newStreak = profile.streakCount + 1;
  } else if (lastActive && profile.streakFreezes > 0) {
    // Gap exists but have freeze available — preserve streak
    newStreak = profile.streakCount;
    frozeUsed = true;
    await Profile.findByIdAndUpdate(profileId, {
      streakFreezes: profile.streakFreezes - 1,
      lastActiveDate: today,
      streakCount: newStreak,
    });
    return { streakCount: newStreak, wasUpdated: true, frozeUsed };
  } else {
    // Streak broken
    newStreak = 1;
  }

  await Profile.findByIdAndUpdate(profileId, {
    streakCount: newStreak,
    lastActiveDate: today,
  });

  return { streakCount: newStreak, wasUpdated: true, frozeUsed };
};
