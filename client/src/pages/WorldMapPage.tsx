import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { useProgressStore } from '../store/progressStore';
import { progressService } from '../services/progress.service';

const WORLDS = [
  { id: 1, name: 'The Web Kingdom', icon: '🏰', color: '#7C3AED', tagline: 'Build your first pages and rule the web', missions: 6 },
  { id: 2, name: 'The Logic Lands', icon: '🧩', color: '#0891B2', tagline: 'Bring order with JavaScript', missions: 6 },
  { id: 3, name: 'Animation Archipelago', icon: '🎬', color: '#059669', tagline: 'Bring your pages to life', missions: 6 },
  { id: 4, name: 'The Game Galaxy', icon: '🎮', color: '#D97706', tagline: 'Build real games with Canvas', missions: 6 },
  { id: 5, name: 'Python Planet', icon: '🐍', color: '#DC2626', tagline: 'Master the Python language', missions: 6 },
];

export default function WorldMapPage() {
  const { setProgress, getWorldStatus, progress } = useProgressStore();

  useEffect(() => {
    progressService.getAll().then(setProgress).catch(console.error);
  }, []);

  const getWorldProgress = (worldId: number) => {
    const worldStages = progress.filter((p) => p.worldId === worldId && p.status === 'completed');
    return worldStages.length;
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Choose Your World
        </h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Each world teaches you new coding powers. Complete all missions to conquer a world!
        </p>

        {/* Path connector line */}
        <div className="relative">
          {/* Vertical progress line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-0.5"
            style={{ backgroundColor: 'var(--border-subtle)' }}
          />

          <div className="space-y-4">
            {WORLDS.map((world, i) => {
              const status = getWorldStatus(world.id);
              const isLocked = world.id > 1 && getWorldStatus(world.id - 1) !== 'completed' && status === 'locked';
              const completedStages = getWorldProgress(world.id);
              const totalStages = world.missions * 3;
              const progressPct = Math.round((completedStages / totalStages) * 100);

              return (
                <motion.div
                  key={world.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
                  className="relative"
                >
                  {/* Node dot on the path line */}
                  <div
                    className="absolute left-6 top-8 w-5 h-5 rounded-full z-10 flex items-center justify-center"
                    style={{
                      backgroundColor: status === 'completed'
                        ? 'var(--neon-green)'
                        : status === 'in-progress'
                          ? world.color
                          : 'var(--bg-surface-3)',
                      boxShadow: status === 'completed'
                        ? '0 0 12px rgba(5, 150, 105, 0.4)'
                        : status === 'in-progress'
                          ? `0 0 12px ${world.color}40`
                          : 'none',
                      border: '2px solid var(--bg-void)',
                    }}
                  >
                    {status === 'completed' && (
                      <span className="text-xs text-white">✓</span>
                    )}
                  </div>

                  <div className="ml-16">
                    {isLocked ? (
                      <div
                        className="p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden"
                        style={{
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          opacity: 0.5,
                        }}
                      >
                        {/* Fog overlay */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(135deg, rgba(15, 15, 35, 0.6) 0%, rgba(15, 15, 35, 0.3) 100%)',
                            backdropFilter: 'blur(2px)',
                            pointerEvents: 'none',
                          }}
                        />
                        <span className="text-4xl" style={{ filter: 'grayscale(100%) brightness(0.6)' }}>{world.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)' }}>
                            {world.name}
                          </h3>
                          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            Complete {WORLDS[i - 1]?.name || 'the previous world'} to unlock
                          </p>
                        </div>
                        <span className="ml-auto text-2xl">🔒</span>
                      </div>
                    ) : (
                      <Link to={`/worlds/${world.id}`}>
                        <motion.div
                          className="p-6 rounded-2xl flex items-center gap-6 cursor-pointer relative overflow-hidden"
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: `1px solid ${world.color}40`,
                            boxShadow: `0 0 20px ${world.color}15`,
                          }}
                          whileHover={{ scale: 1.02, y: -4, boxShadow: `0 0 30px ${world.color}25` }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Glow effect for active world */}
                          {status === 'in-progress' && (
                            <motion.div
                              className="absolute inset-0"
                              style={{
                                background: `radial-gradient(ellipse at 0% 50%, ${world.color}08 0%, transparent 70%)`,
                                pointerEvents: 'none',
                              }}
                              animate={{ opacity: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 3 }}
                            />
                          )}

                          <motion.span
                            className="text-4xl relative z-10"
                            animate={status === 'in-progress' ? { y: [0, -3, 0] } : {}}
                            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                          >
                            {world.icon}
                          </motion.span>
                          <div className="flex-1 relative z-10">
                            <h3
                              className="text-lg font-bold"
                              style={{ fontFamily: 'var(--font-display)', color: world.color }}
                            >
                              {world.name}
                            </h3>
                            <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                              {world.tagline}
                            </p>

                            {/* Progress bar */}
                            {status !== 'locked' && (
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex-1 h-1.5 rounded-full overflow-hidden"
                                  style={{ backgroundColor: 'var(--bg-surface-3)' }}
                                >
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: world.color }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPct}%` }}
                                    transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                                  />
                                </div>
                                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                  {completedStages}/{totalStages}
                                </span>
                              </div>
                            )}
                          </div>
                          <div
                            className="px-3 py-1 rounded-full text-xs font-medium relative z-10"
                            style={{
                              backgroundColor: status === 'completed' ? 'rgba(5, 150, 105, 0.1)' : status === 'in-progress' ? `${world.color}15` : 'var(--bg-surface-2)',
                              color: status === 'completed' ? 'var(--neon-green)' : status === 'in-progress' ? world.color : 'var(--text-muted)',
                              border: `1px solid ${status === 'completed' ? 'rgba(5, 150, 105, 0.2)' : status === 'in-progress' ? `${world.color}30` : 'var(--border-subtle)'}`,
                            }}
                          >
                            {status === 'completed' ? '✅ Complete' : status === 'in-progress' ? '▶ Continue' : '🆕 Start'}
                          </div>
                        </motion.div>
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
