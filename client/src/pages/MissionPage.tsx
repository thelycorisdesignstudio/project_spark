import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { useProgressStore } from '../store/progressStore';
import { progressService } from '../services/progress.service';
import { projectService } from '../services/project.service';
import { CURRICULUM } from '../constants/curriculum';

export default function MissionPage() {
  const { worldId, missionId } = useParams<{ worldId: string; missionId: string }>();
  const navigate = useNavigate();
  const { setProgress, getStageStatus } = useProgressStore();
  const [launching, setLaunching] = useState<number | null>(null);

  const world = CURRICULUM.find((w) => w.id === Number(worldId));
  const mission = world?.missions.find((m) => m.id === Number(missionId));

  useEffect(() => {
    progressService.getAll().then(setProgress).catch(console.error);
  }, []);

  if (!world || !mission) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <span className="text-5xl mb-4 block">🔍</span>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Mission Not Found
          </h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            This mission doesn't exist in the curriculum.
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

  const isStageUnlocked = (stageIndex: number): boolean => {
    if (stageIndex === 0) return true;
    const prevStage = mission.stages[stageIndex - 1];
    return getStageStatus(world.id, mission.id, prevStage.id) === 'completed';
  };

  const getCurrentStageIndex = (): number => {
    for (let i = 0; i < mission.stages.length; i++) {
      const status = getStageStatus(world.id, mission.id, mission.stages[i].id);
      if (status !== 'completed') return i;
    }
    return mission.stages.length - 1;
  };

  const handleStartStage = async (stage: (typeof mission.stages)[number]) => {
    setLaunching(stage.id);
    try {
      const project = await projectService.create({
        title: `${mission.title} - ${stage.title}`,
        language: world.language,
        missionRef: { worldId: world.id, missionId: mission.id },
      });

      // Store mission context so the editor knows which stage we're working on
      localStorage.setItem(
        'spark_mission_context',
        JSON.stringify({
          worldId: world.id,
          missionId: mission.id,
          stageId: stage.id,
        })
      );

      // Pre-populate with starter code if the project files are empty
      if (stage.starterCode) {
        await projectService.update(project._id, {
          files: {
            html: stage.starterCode.html || '',
            css: stage.starterCode.css || '',
            js: stage.starterCode.js || '',
            python: stage.starterCode.python || '',
          },
        });
      }

      navigate(
        `/editor/${project._id}?worldId=${world.id}&missionId=${mission.id}&stageId=${stage.id}`
      );
    } catch (err) {
      console.error('Failed to create project for stage:', err);
      setLaunching(null);
    }
  };

  const currentStageIndex = getCurrentStageIndex();
  const allCompleted = mission.stages.every(
    (s) => getStageStatus(world.id, mission.id, s.id) === 'completed'
  );

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          to={`/worlds/${world.id}`}
          className="inline-flex items-center gap-2 text-sm mb-6 no-underline"
          style={{ color: 'var(--text-muted)' }}
        >
          <motion.span whileHover={{ x: -3 }} style={{ display: 'inline-block' }}>
            &larr;
          </motion.span>
          Back to {world.name}
        </Link>

        {/* Mission Header */}
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
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: world.color }}>
                {world.icon} {world.name} &mdash; Mission {mission.id}
              </p>
              <h1
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {mission.title}
              </h1>
            </div>
            {allCompleted && (
              <div
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: 'rgba(5, 150, 105, 0.1)',
                  color: 'var(--neon-green)',
                  border: '1px solid rgba(5, 150, 105, 0.2)',
                }}
              >
                ✅ Mission Complete
              </div>
            )}
          </div>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
            {mission.questBrief}
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>~{mission.estimatedMinutes} min</span>
            <span style={{ color: 'var(--neon-amber)' }}>+{mission.xpReward} XP</span>
            <span>{mission.stages.length} stages</span>
          </div>
        </motion.div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {mission.stages.map((stage, i) => {
            const status = getStageStatus(world.id, mission.id, stage.id);
            return (
              <div key={stage.id} className="flex items-center gap-3">
                <motion.div
                  className="flex flex-col items-center gap-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor:
                        status === 'completed'
                          ? 'rgba(5, 150, 105, 0.2)'
                          : i === currentStageIndex && !allCompleted
                            ? `${world.color}30`
                            : 'var(--bg-surface-2)',
                      color:
                        status === 'completed'
                          ? 'var(--neon-green)'
                          : i === currentStageIndex && !allCompleted
                            ? world.color
                            : 'var(--text-muted)',
                      border: `2px solid ${
                        status === 'completed'
                          ? 'var(--neon-green)'
                          : i === currentStageIndex && !allCompleted
                            ? world.color
                            : 'var(--border-subtle)'
                      }`,
                      boxShadow:
                        i === currentStageIndex && !allCompleted
                          ? `0 0 12px ${world.color}40`
                          : 'none',
                    }}
                  >
                    {status === 'completed' ? '✓' : i + 1}
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      color:
                        status === 'completed'
                          ? 'var(--neon-green)'
                          : i === currentStageIndex && !allCompleted
                            ? world.color
                            : 'var(--text-muted)',
                    }}
                  >
                    Stage {i + 1}
                  </span>
                </motion.div>
                {i < mission.stages.length - 1 && (
                  <div
                    className="h-0.5 w-12"
                    style={{
                      backgroundColor:
                        getStageStatus(world.id, mission.id, stage.id) === 'completed'
                          ? 'var(--neon-green)'
                          : 'var(--border-subtle)',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Stage Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {mission.stages.map((stage, i) => {
            const status = getStageStatus(world.id, mission.id, stage.id);
            const unlocked = isStageUnlocked(i);
            const isCurrent = i === currentStageIndex && !allCompleted;

            return (
              <motion.div
                key={stage.id}
                className="p-5 rounded-2xl flex flex-col"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${
                    status === 'completed'
                      ? 'rgba(5, 150, 105, 0.3)'
                      : isCurrent
                        ? `${world.color}50`
                        : 'var(--border-subtle)'
                  }`,
                  boxShadow: isCurrent ? `0 0 20px ${world.color}20` : 'var(--shadow-card)',
                  opacity: unlocked ? 1 : 0.4,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: unlocked ? 1 : 0.4, y: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        status === 'completed'
                          ? 'rgba(5, 150, 105, 0.1)'
                          : isCurrent
                            ? `${world.color}15`
                            : 'var(--bg-surface-2)',
                      color:
                        status === 'completed'
                          ? 'var(--neon-green)'
                          : isCurrent
                            ? world.color
                            : 'var(--text-muted)',
                    }}
                  >
                    {status === 'completed'
                      ? '✅ Done'
                      : isCurrent
                        ? '▶ Current'
                        : unlocked
                          ? 'Ready'
                          : '🔒 Locked'}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--neon-amber)' }}>
                    +{stage.xpReward} XP
                  </span>
                </div>

                <h3
                  className="text-base font-bold mb-2"
                  style={{
                    fontFamily: 'var(--font-display)',
                    color: status === 'completed' ? 'var(--neon-green)' : 'var(--text-primary)',
                  }}
                >
                  {stage.title}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4 flex-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {stage.brief}
                </p>

                {unlocked && status !== 'completed' && (
                  <motion.button
                    onClick={() => handleStartStage(stage)}
                    disabled={launching === stage.id}
                    className="w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                    style={{
                      backgroundColor: isCurrent ? world.color : `${world.color}20`,
                      color: isCurrent ? '#ffffff' : world.color,
                      border: `1px solid ${world.color}`,
                      opacity: launching === stage.id ? 0.6 : 1,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {launching === stage.id ? 'Launching...' : isCurrent ? 'Start Stage' : 'Open Stage'}
                  </motion.button>
                )}

                {status === 'completed' && (
                  <motion.button
                    onClick={() => handleStartStage(stage)}
                    disabled={launching === stage.id}
                    className="w-full py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                    style={{
                      backgroundColor: 'rgba(5, 150, 105, 0.1)',
                      color: 'var(--neon-green)',
                      border: '1px solid rgba(5, 150, 105, 0.3)',
                      opacity: launching === stage.id ? 0.6 : 1,
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {launching === stage.id ? 'Launching...' : 'Replay'}
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageTransition>
  );
}
