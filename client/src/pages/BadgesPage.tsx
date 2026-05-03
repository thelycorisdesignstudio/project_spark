import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import BadgeGrid from '../components/gamification/BadgeGrid';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function BadgesPage() {
  const { profile } = useAuthStore();
  const [earnedSlugs, setEarnedSlugs] = useState<string[]>([]);

  useEffect(() => {
    api.get('/profile/me')
      .then(({ data }) => {
        setEarnedSlugs(data.profile?.badges?.map((b: any) => b.slug) || []);
      })
      .catch(console.error);
  }, []);

  if (!profile) return null;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-3xl font-bold mb-1"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            Badge Collection
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {earnedSlugs.length} badges earned — keep coding to unlock more!
          </p>
        </motion.div>

        {/* Rarity Legend */}
        <motion.div
          className="flex items-center gap-4 mb-6 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {[
            { label: 'Common', color: '#8899BB' },
            { label: 'Uncommon', color: '#0891B2' },
            { label: 'Rare', color: '#7C3AED' },
            { label: 'Epic', color: '#D97706' },
            { label: 'Legendary', color: '#DC2626' },
          ].map((r) => (
            <div key={r.label} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: r.color }}
              />
              <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <BadgeGrid earnedSlugs={earnedSlugs} />
        </motion.div>
      </div>
    </PageTransition>
  );
}
