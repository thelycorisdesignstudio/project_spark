import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { useProgressStore } from '../store/progressStore';
import { progressService } from '../services/progress.service';
import { CURRICULUM } from '../constants/curriculum';

export default function WorldDetailPage() {
  const { worldId } = useParams<{ worldId: string }>();
  const { setProgress, getMissionStatus } = useProgressStore();

  const world = CURRICULUM.find((w) => w.id === Number(worldId));

  useEffect(() => {
    progressService.getAll().then(setProgress).catch(console.error);
  }, []);

  if (!world) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <span className="text-5xl mb-4 block">🔍</span>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            World Not Found
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            This world doesn't exist in the curriculum.
          </p>
          <Link to="/worlds">
            <motion.button
              className="px-6 py-2 rounded-xl text-sm font-medium cursor-pointer"
              style={{
                backgroundColor: 'rgba(8, 145, 178, 0.1)',
                color: 'var(--neon-cyan)',
                border: '1px solid var(--border-glow-cyan)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Worlds
            </motion.button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const isMissionUnlocked = (missionIndex: number): boolean => {
    if (missionIndex === 0) return true;
    const prevMission = world.missions[missionIndex - 1];
    return getMissionStatus(world.id, prevMission.id) === 'completed';
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to="/worlds"
          className="inline-flex items-center gap-2 text-sm mb-6 no-underline"
          style={{ color: 'var(--text-muted)' }}
        >
          <motion.span whileHover={{ x: -3 }} style={{ display: 'inline-block' }}>
            &larr;
          </motion.span>
          Back to Worlds
        </Link>

        {/* World Header */}
        <motion.div
          className="p-8 rounded-2xl mb-8"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: `1px solid ${world.color}40`,
            boxShadow: `0 0 30px ${world.color}15`,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">{world.icon}</span>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: world.color }}
              >
                {world.name}
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {world.tagline}
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {world.narrative}
          </p>
        </motion.div>

        {/* Missions List */}
        <h2
          className="text-xl font-bold mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Missions
        </h2>

        <div className="space-y-4">
          {world.missions.map((mission, i) => {
            const status = getMissionStatus(world.id, mission.id);
            const unlocked = isMissionUnlocked(i);

            return (
              <motion.div
                key={mission.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 25 }}
              >
                {!unlocked ? (
                  <div
                    className="p-6 rounded-2xl flex items-center gap-5"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      opacity: 0.4,
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ backgroundColor: 'var(--bg-surface-2)', color: 'var(--text-muted)' }}
                    >
                      {mission.id}
                    </div>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-muted)' }}
                      >
                        {mission.title}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        Complete the previous mission to unlock
                      </p>
                    </div>
                    <span className="text-2xl">🔒</span>
                  </div>
                ) : (
                  <Link
                    to={`/worlds/${world.id}/missions/${mission.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <motion.div
                      className="p-6 rounded-2xl flex items-center gap-5 cursor-pointer"
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: `1px solid ${status === 'completed' ? 'rgba(5, 150, 105, 0.3)' : `${world.color}40`}`,
                        boxShadow: status === 'completed'
                          ? '0 0 20px rgba(5, 150, 105, 0.1)'
                          : `0 0 20px ${world.color}10`,
                      }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          backgroundColor: status === 'completed'
                            ? 'rgba(5, 150, 105, 0.15)'
                            : `${world.color}20`,
                          color: status === 'completed' ? 'var(--neon-green)' : world.color,
                        }}
                      >
                        {status === 'completed' ? '✓' : mission.id}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold mb-1"
                          style={{
                            fontFamily: 'var(--font-display)',
                            color: status === 'completed' ? 'var(--neon-green)' : 'var(--text-primary)',
                          }}
                        >
                          {mission.title}
                        </h3>
                        <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {mission.questBrief}
                        </p>
                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span>~{mission.estimatedMinutes} min</span>
                          <span style={{ color: 'var(--neon-amber)' }}>+{mission.xpReward} XP</span>
                          <span>{mission.stages.length} stages</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div
                        className="px-3 py-1 rounded-full text-xs font-medium flex-shrink-0"
                        style={{
                          backgroundColor:
                            status === 'completed'
                              ? 'rgba(5, 150, 105, 0.1)'
                              : status === 'in-progress'
                                ? `${world.color}15`
                                : 'var(--bg-surface-2)',
                          color:
                            status === 'completed'
                              ? 'var(--neon-green)'
                              : status === 'in-progress'
                                ? world.color
                                : 'var(--text-muted)',
                          border: `1px solid ${
                            status === 'completed'
                              ? 'rgba(5, 150, 105, 0.2)'
                              : status === 'in-progress'
                                ? `${world.color}30`
                                : 'var(--border-subtle)'
                          }`,
                        }}
                      >
                        {status === 'completed'
                          ? '✅ Complete'
                          : status === 'in-progress'
                            ? '▶ In Progress'
                            : 'Start'}
                      </div>
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
