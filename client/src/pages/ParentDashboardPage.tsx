import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import ParentNav from '../components/layout/ParentNav';
import api from '../services/api';

interface ChildOverview {
  id: string;
  displayName: string;
  avatarColor: string;
  level: number;
  xp: number;
  streakCount: number;
  skillLevel: string;
  lastActiveDate?: string;
  missionsCompletedThisWeek: number;
  stagesCompletedThisWeek: number;
}

export default function ParentDashboardPage() {
  const [overview, setOverview] = useState<{ children: ChildOverview[]; totalChildren: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/parent/overview')
      .then(({ data }) => setOverview(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-void)', minHeight: '100vh' }}>
      <ParentNav />
      <PageTransition>
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Parent Dashboard 📊
          </h1>
          <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
            Track your children's coding journey
          </p>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 rounded-2xl skeleton" style={{ backgroundColor: 'var(--bg-surface)' }} />
              ))}
            </div>
          ) : !overview || overview.children.length === 0 ? (
            <div
              className="p-12 rounded-2xl text-center"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
              }}
            >
              <span className="text-5xl mb-4 block">👦</span>
              <h3
                className="text-xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                No child profiles yet
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                Create a child profile to get started
              </p>
              <Link to="/onboarding">
                <motion.button
                  className="px-6 py-2 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    backgroundColor: 'var(--neon-cyan)',
                    color: '#ffffff',
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  Add a Child
                </motion.button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {overview.children.map((child, i) => (
                <Link key={child.id} to={`/parent/child/${child.id}`}>
                  <motion.div
                    className="p-6 rounded-2xl flex items-center gap-6 cursor-pointer"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ backgroundColor: child.avatarColor, color: '#ffffff' }}
                    >
                      {child.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                        {child.displayName}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Level {child.level} {child.skillLevel} | {child.streakCount} day streak
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold" style={{ color: 'var(--neon-amber)' }}>
                        {child.xp} XP
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {child.stagesCompletedThisWeek} stages this week
                      </p>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  );
}
