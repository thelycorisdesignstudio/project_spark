import { motion } from 'framer-motion';
import { BADGE_DEFINITIONS, RARITY_COLORS, RARITY_GLOW } from '../../constants/badges';

interface BadgeGridProps {
  earnedSlugs: string[];
}

export default function BadgeGrid({ earnedSlugs }: BadgeGridProps) {
  const allBadges = Object.entries(BADGE_DEFINITIONS);

  return (
    <div className="grid grid-cols-4 gap-3">
      {allBadges.map(([slug, badge]) => {
        const earned = earnedSlugs.includes(slug);
        const rarityColor = RARITY_COLORS[badge.rarity];
        const rarityGlow = RARITY_GLOW[badge.rarity];

        return (
          <motion.div
            key={slug}
            className="relative flex flex-col items-center p-3 rounded-xl cursor-default"
            style={{
              backgroundColor: earned ? 'var(--bg-surface-2)' : 'var(--bg-surface)',
              border: `1px solid ${earned ? rarityColor + '40' : 'var(--border-subtle)'}`,
              boxShadow: earned ? `0 0 16px ${rarityGlow}` : 'none',
              opacity: earned ? 1 : 0.4,
            }}
            whileHover={earned ? { scale: 1.05, y: -4 } : {}}
          >
            <span className="text-2xl mb-1" style={{ filter: earned ? 'none' : 'grayscale(100%)' }}>
              {badge.icon}
            </span>
            <span className="text-xs font-medium text-center" style={{ color: earned ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              {badge.name}
            </span>
            <span
              className="text-xs mt-0.5 px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor: earned ? rarityColor + '20' : 'transparent',
                color: earned ? rarityColor : 'var(--text-muted)',
                fontSize: '0.65rem',
              }}
            >
              {badge.rarity}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
