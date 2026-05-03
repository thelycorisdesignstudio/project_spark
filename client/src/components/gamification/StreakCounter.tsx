import { motion } from 'framer-motion';

interface StreakCounterProps {
  count: number;
}

export default function StreakCounter({ count }: StreakCounterProps) {
  const isActive = count > 0;

  return (
    <motion.div
      className="h-full flex flex-col items-center justify-center p-5 rounded-2xl text-center"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${isActive ? 'rgba(220, 38, 38, 0.2)' : 'var(--border-subtle)'}`,
        boxShadow: 'var(--shadow-card)',
      }}
      whileHover={{ scale: 1.02 }}
    >
      <motion.span
        className="text-3xl mb-2 block"
        animate={isActive ? {
          scale: [1, 1.2, 1],
          rotate: [0, -5, 5, 0],
        } : {}}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {isActive ? '🔥' : '❄️'}
      </motion.span>
      <div
        className="text-2xl font-bold mb-1"
        style={{ fontFamily: 'var(--font-display)', color: isActive ? 'var(--neon-coral)' : 'var(--text-muted)' }}
      >
        {count}
      </div>
      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        day streak
      </div>
    </motion.div>
  );
}
