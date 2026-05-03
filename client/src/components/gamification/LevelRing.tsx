import { motion } from 'framer-motion';
import { LEVEL_THRESHOLDS } from '../../constants/levels';
import { getXPProgress } from '../../constants/levels';

interface LevelRingProps {
  level: number;
  xp: number;
  size?: number;
}

export default function LevelRing({ level, xp, size = 80 }: LevelRingProps) {
  const progress = getXPProgress(xp, level);
  const tierData = LEVEL_THRESHOLDS[level - 1];
  const ringColor = tierData?.ringColor || '#8899BB';

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Ring */}
      <svg width={size} height={size} className="absolute">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--bg-surface-3)"
          strokeWidth="4"
        />
      </svg>

      {/* Progress Ring */}
      <svg width={size} height={size} className="absolute" style={{ transform: 'rotate(-90deg)' }}>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
          style={{
            filter: `drop-shadow(0 0 6px ${ringColor}40)`,
          }}
        />
      </svg>

      {/* Level Number */}
      <span
        className="text-lg font-bold z-10"
        style={{ fontFamily: 'var(--font-display)', color: ringColor }}
      >
        {level}
      </span>
    </div>
  );
}
