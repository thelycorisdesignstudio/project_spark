import { motion } from 'framer-motion';
import { getXPProgress } from '../../constants/levels';

interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const progress = getXPProgress(xp, level);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium" style={{ color: 'var(--neon-amber)' }}>
          ⚡ {xp} XP
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Level {level}
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ backgroundColor: 'var(--bg-surface-3)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #D97706, #EA580C)',
            boxShadow: '0 0 8px rgba(217, 119, 6, 0.4)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 15, duration: 0.8 }}
        />
      </div>
    </div>
  );
}
