import { useState } from 'react';
import { motion } from 'framer-motion';

interface StageData {
  id: number;
  title: string;
}

interface StageIndicatorProps {
  stages: StageData[];
  currentStage: number;
  completedStages: number[];
}

export default function StageIndicator({
  stages,
  currentStage,
  completedStages,
}: StageIndicatorProps) {
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);

  function getStageState(stageId: number): 'completed' | 'current' | 'locked' {
    if (completedStages.includes(stageId)) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'locked';
  }

  const stateStyles = {
    completed: {
      bg: 'var(--neon-green)',
      border: 'var(--neon-green)',
      inner: '#ffffff',
      size: 28,
    },
    current: {
      bg: 'transparent',
      border: 'var(--neon-cyan)',
      inner: 'var(--neon-cyan)',
      size: 28,
    },
    locked: {
      bg: 'transparent',
      border: 'var(--text-muted)',
      inner: 'transparent',
      size: 28,
    },
  };

  return (
    <div className="flex items-center justify-center gap-0">
      {stages.map((stage, index) => {
        const state = getStageState(stage.id);
        const styles = stateStyles[state];
        const isLast = index === stages.length - 1;

        return (
          <div key={stage.id} className="flex items-center">
            {/* Stage dot */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredStage(stage.id)}
              onMouseLeave={() => setHoveredStage(null)}
            >
              <motion.div
                className="flex items-center justify-center rounded-full cursor-default"
                style={{
                  width: styles.size,
                  height: styles.size,
                  backgroundColor: state === 'completed' ? styles.bg : 'transparent',
                  border: `2px solid ${styles.border}`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: index * 0.12,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                }}
              >
                {/* Inner fill for completed */}
                {state === 'completed' && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M3 7l3 3 5-5"
                      stroke={styles.inner}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}

                {/* Pulsing dot for current */}
                {state === 'current' && (
                  <motion.div
                    className="rounded-full"
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: styles.inner,
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [1, 0.6, 1],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'easeInOut',
                    }}
                  />
                )}

                {/* Empty for locked (gray outline only) */}
              </motion.div>

              {/* Tooltip */}
              {hoveredStage === stage.id && (
                <motion.div
                  className="absolute left-1/2 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
                  style={{
                    bottom: 'calc(100% + 8px)',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'var(--bg-surface-2)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'var(--shadow-card)',
                    zIndex: 10,
                  }}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {stage.title}
                  {/* Tooltip arrow */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--bg-surface-2)',
                      borderRight: '1px solid var(--border-subtle)',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  />
                </motion.div>
              )}
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                style={{
                  width: '40px',
                  height: '2px',
                  backgroundColor:
                    getStageState(stages[index + 1].id) === 'locked' &&
                    state === 'locked'
                      ? 'var(--text-muted)'
                      : state === 'completed'
                        ? 'var(--neon-green)'
                        : 'var(--text-muted)',
                  opacity: 0.4,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
