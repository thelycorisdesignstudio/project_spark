import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import PageTransition from '../components/layout/PageTransition';
import XPBar from '../components/gamification/XPBar';
import LevelRing from '../components/gamification/LevelRing';
import StreakCounter from '../components/gamification/StreakCounter';
import { LEVEL_THRESHOLDS } from '../constants/levels';
import { BADGE_DEFINITIONS, RARITY_COLORS } from '../constants/badges';
import { projectService } from '../services/project.service';
import type { Project } from '../types';

const DAILY_CHALLENGES = [
  { id: 1, title: 'Color Swap', description: 'Change the background color of a page using CSS', xp: 30, icon: '🎨' },
  { id: 2, title: 'Button Builder', description: 'Create a button that changes text when clicked', xp: 40, icon: '🖱️' },
  { id: 3, title: 'List Master', description: 'Build an HTML list with at least 5 items', xp: 25, icon: '📋' },
  { id: 4, title: 'Style Detective', description: 'Add hover effects to three different elements', xp: 35, icon: '🔍' },
  { id: 5, title: 'Shape Maker', description: 'Create a circle and a square using CSS', xp: 30, icon: '⬛' },
  { id: 6, title: 'Animation Station', description: 'Make something move or fade using CSS animations', xp: 45, icon: '✨' },
  { id: 7, title: 'Form Builder', description: 'Create a simple contact form with name and email', xp: 35, icon: '📝' },
];

export default function DashboardPage() {
  const { profile } = useAuthStore();
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    projectService.getAll(1, 4)
      .then((data) => setRecentProjects(data.projects))
      .catch(console.error);
  }, []);

  if (!profile) return null;

  const tierData = LEVEL_THRESHOLDS[profile.level - 1];
  const earnedBadges = profile.badges?.map((b: any) => b.slug) || [];
  const recentBadges = earnedBadges.slice(-4);

  // Pick daily challenge based on day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const todayChallenge = DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Hey, {profile.displayName}! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Ready to code something awesome today?
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Level + XP */}
          <motion.div
            className="p-5 rounded-2xl md:col-span-2"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-6">
              <LevelRing level={profile.level} xp={profile.xp} size={80} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: tierData?.ringColor + '20',
                      color: tierData?.ringColor,
                    }}
                  >
                    {tierData?.tierLabel}
                  </span>
                </div>
                <XPBar xp={profile.xp} level={profile.level} />
              </div>
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StreakCounter count={profile.streakCount} />
          </motion.div>
        </div>

        {/* Daily Challenge */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Link to="/editor/new">
            <motion.div
              className="p-5 rounded-2xl cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid rgba(217, 119, 6, 0.3)',
                boxShadow: '0 0 20px rgba(217, 119, 6, 0.08)',
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{todayChallenge.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(217, 119, 6, 0.1)', color: 'var(--neon-amber)' }}>
                        Daily Challenge
                      </span>
                      <span className="text-xs font-medium" style={{ color: 'var(--neon-amber)' }}>
                        +{todayChallenge.xp} XP
                      </span>
                    </div>
                    <h3 className="text-base font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                      {todayChallenge.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {todayChallenge.description}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold" style={{ color: 'var(--neon-amber)' }}>
                  Accept →
                </span>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link to="/worlds">
            <motion.div
              className="p-6 rounded-2xl cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-glow-violet)',
                boxShadow: 'var(--shadow-violet)',
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-3xl mb-3 block">🌍</span>
              <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-violet)' }}>
                Continue Learning
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Pick up where you left off in the worlds
              </p>
            </motion.div>
          </Link>

          <Link to="/editor/new">
            <motion.div
              className="p-6 rounded-2xl cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-glow-cyan)',
                boxShadow: 'var(--shadow-cyan)',
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-3xl mb-3 block">💻</span>
              <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)' }}>
                Free Code
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Build anything you want with Spark Buddy
              </p>
            </motion.div>
          </Link>
        </div>

        {/* Recent Badges */}
        {recentBadges.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2
                className="text-xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                Recent Badges
              </h2>
              <Link to="/badges" className="text-sm font-medium" style={{ color: 'var(--neon-violet)' }}>
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {recentBadges.map((slug: string) => {
                const badge = BADGE_DEFINITIONS[slug];
                if (!badge) return null;
                const rarityColor = RARITY_COLORS[badge.rarity];
                return (
                  <motion.div
                    key={slug}
                    className="p-3 rounded-xl text-center"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: `1px solid ${rarityColor}40`,
                      boxShadow: `0 0 12px ${rarityColor}15`,
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                  >
                    <span className="text-2xl block mb-1">{badge.icon}</span>
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {badge.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Your Projects
            </h2>
            {recentProjects.length > 0 && (
              <Link to="/projects" className="text-sm font-medium" style={{ color: 'var(--neon-cyan)' }}>
                View all →
              </Link>
            )}
          </div>

          {recentProjects.length === 0 ? (
            <div
              className="p-8 rounded-2xl text-center"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <span className="text-4xl mb-3 block">🚀</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Your projects will appear here. Start coding to create your first one!
              </p>
              <Link to="/editor/new">
                <motion.button
                  className="mt-4 px-6 py-2 rounded-xl text-sm font-medium cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(8, 145, 178, 0.1)',
                    color: 'var(--neon-cyan)',
                    border: '1px solid var(--border-glow-cyan)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start a Project
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentProjects.map((project, i) => (
                <Link key={project._id} to={`/editor/${project._id}`}>
                  <motion.div
                    className="p-5 rounded-2xl cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-card)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 + i * 0.05 }}
                    whileHover={{ scale: 1.03, y: -4, boxShadow: 'var(--shadow-float)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span>{project.language === 'python' ? '🐍' : '🌐'}</span>
                      <h3
                        className="text-sm font-bold"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                      {project.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      {project.isPublic && (
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: 'rgba(5, 150, 105, 0.1)', color: 'var(--neon-green)' }}
                        >
                          Public
                        </span>
                      )}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </PageTransition>
  );
}
