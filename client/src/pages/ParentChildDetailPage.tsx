import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import ParentNav from '../components/layout/ParentNav';
import LevelRing from '../components/gamification/LevelRing';
import XPBar from '../components/gamification/XPBar';
import api from '../services/api';

interface ChildStats {
  displayName: string;
  avatarColor: string;
  level: number;
  xp: number;
  streakCount: number;
  totalStagesCompleted: number;
  totalMissionsCompleted: number;
  totalWorldsCompleted: number;
  totalTimeSpentMinutes: number;
  averageSessionMinutes: number;
  strongestSkills: string[];
  badges: { slug: string; earnedAt: string }[];
}

interface ActivityEntry {
  date: string;
  type: string;
  description: string;
  xpEarned: number;
}

export default function ParentChildDetailPage() {
  const { childId } = useParams<{ childId: string }>();
  const [stats, setStats] = useState<ChildStats | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!childId) return;
    Promise.all([
      api.get(`/parent/child/${childId}/stats`),
      api.get(`/parent/child/${childId}/activity`),
    ])
      .then(([statsRes, activityRes]) => {
        setStats(statsRes.data);
        setActivity(activityRes.data.entries || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [childId]);

  return (
    <div style={{ backgroundColor: 'var(--bg-void)', minHeight: '100vh' }}>
      <ParentNav />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-6 py-24">
          <Link
            to="/parent"
            className="text-sm font-medium mb-6 inline-block"
            style={{ color: 'var(--neon-cyan)' }}
          >
            ← Back to Dashboard
          </Link>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-2xl skeleton" style={{ backgroundColor: 'var(--bg-surface)' }} />
              ))}
            </div>
          ) : !stats ? (
            <div className="p-12 rounded-2xl text-center" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Could not load child data.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <motion.div
                className="flex items-center gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: stats.avatarColor, color: '#ffffff' }}
                >
                  {stats.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                  >
                    {stats.displayName}
                  </h1>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Level {stats.level} | {stats.streakCount} day streak
                  </p>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'XP', value: stats.xp, color: 'var(--neon-amber)', icon: '⚡' },
                  { label: 'Stages Done', value: stats.totalStagesCompleted, color: 'var(--neon-green)', icon: '✅' },
                  { label: 'Missions Done', value: stats.totalMissionsCompleted, color: 'var(--neon-cyan)', icon: '🎯' },
                  { label: 'Worlds Done', value: stats.totalWorldsCompleted, color: 'var(--neon-violet)', icon: '🌍' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    className="p-4 rounded-2xl text-center"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <span className="text-xl block mb-1">{stat.icon}</span>
                    <p className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Level Progress */}
              <motion.div
                className="p-5 rounded-2xl mb-8"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  Level Progress
                </h3>
                <div className="flex items-center gap-6">
                  <LevelRing level={stats.level} xp={stats.xp} size={64} />
                  <div className="flex-1">
                    <XPBar xp={stats.xp} level={stats.level} />
                  </div>
                </div>
              </motion.div>

              {/* Time Stats */}
              <motion.div
                className="p-5 rounded-2xl mb-8"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  Time Spent Coding
                </h3>
                <div className="flex items-center gap-8">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--neon-cyan)' }}>
                      {stats.totalTimeSpentMinutes}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Total minutes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--neon-violet)' }}>
                      {stats.averageSessionMinutes}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Avg session (min)</p>
                  </div>
                </div>
              </motion.div>

              {/* Strongest Skills */}
              {stats.strongestSkills && stats.strongestSkills.length > 0 && (
                <motion.div
                  className="p-5 rounded-2xl mb-8"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                    Strongest Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.strongestSkills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'rgba(5, 150, 105, 0.1)',
                          color: 'var(--neon-green)',
                          border: '1px solid rgba(5, 150, 105, 0.2)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Recent Activity */}
              <motion.div
                className="p-5 rounded-2xl"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <h3 className="text-sm font-bold mb-3" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  Recent Activity
                </h3>
                {activity.length === 0 ? (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {activity.slice(0, 10).map((entry, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span>
                            {entry.type === 'stage_complete' ? '✅' :
                              entry.type === 'mission_complete' ? '🎯' :
                                entry.type === 'badge_earned' ? '🏅' : '📝'}
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>{entry.description}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          {entry.xpEarned > 0 && (
                            <span className="text-xs font-bold" style={{ color: 'var(--neon-amber)' }}>
                              +{entry.xpEarned} XP
                            </span>
                          )}
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {new Date(entry.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
