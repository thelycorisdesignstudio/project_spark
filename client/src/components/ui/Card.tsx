import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

type GlowColor = 'cyan' | 'violet' | 'green' | 'amber';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: GlowColor | null;
  hover?: boolean;
  onClick?: () => void;
}

const glowBorderMap: Record<GlowColor, string> = {
  cyan: 'var(--border-glow-cyan)',
  violet: 'var(--border-glow-violet)',
  green: 'var(--neon-green)',
  amber: 'var(--neon-amber)',
};

const glowShadowMap: Record<GlowColor, string> = {
  cyan: 'var(--shadow-cyan)',
  violet: 'var(--shadow-violet)',
  green: '0 0 20px rgba(5, 150, 105, 0.15)',
  amber: '0 0 20px rgba(217, 119, 6, 0.15)',
};

export default function Card({
  children,
  className = '',
  glow = null,
  hover = false,
  onClick,
}: CardProps) {
  const borderColor = glow ? glowBorderMap[glow] : 'var(--border-subtle)';
  const shadowValue = glow ? glowShadowMap[glow] : 'var(--shadow-card)';

  return (
    <motion.div
      className={`rounded-2xl ${className}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${borderColor}`,
        boxShadow: shadowValue,
        cursor: onClick ? 'pointer' : undefined,
      }}
      onClick={onClick}
      whileHover={
        hover
          ? { scale: 1.02, y: -4, transition: { type: 'spring', stiffness: 300, damping: 25 } }
          : {}
      }
      whileTap={hover && onClick ? { scale: 0.98 } : {}}
    >
      {children}
    </motion.div>
  );
}
