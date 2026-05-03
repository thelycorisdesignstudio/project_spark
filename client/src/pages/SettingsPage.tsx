import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const AVATAR_COLORS = [
  '#7C3AED', // violet
  '#0891B2', // cyan
  '#059669', // green
  '#D97706', // amber
  '#DC2626', // coral
  '#EA580C', // orange
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { profile, setProfile, clearAuth } = useAuthStore();

  const [avatarColor, setAvatarColor] = useState(profile?.avatarColor || AVATAR_COLORS[0]);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('spark_sound_enabled');
    return stored !== null ? stored === 'true' : true;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!profile) return null;

  const handleColorChange = async (color: string) => {
    setAvatarColor(color);
    setSaving(true);
    setSaved(false);
    try {
      await api.put('/profiles/me', { avatarColor: color });
      setProfile({ ...profile, avatarColor: color });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to update avatar color:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('spark_sound_enabled', String(newValue));
  };

  const handleSignOut = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <PageTransition>
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Settings
        </motion.h1>
        <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>
          Customize your Spark experience
        </p>

        <div className="space-y-4">
          {/* Display Name */}
          <motion.div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h3
              className="text-sm font-bold mb-1"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              Display Name
            </h3>
            <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
              Your name is set by your parent
            </p>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                style={{ backgroundColor: avatarColor, color: '#ffffff' }}
              >
                {profile.displayName.charAt(0).toUpperCase()}
              </div>
              <span
                className="text-lg font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {profile.displayName}
              </span>
            </div>
          </motion.div>

          {/* Avatar Color */}
          <motion.div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  Avatar Color
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Pick a color for your avatar
                </p>
              </div>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: 'rgba(5, 150, 105, 0.1)',
                    color: 'var(--neon-green)',
                  }}
                >
                  Saved!
                </motion.span>
              )}
            </div>
            <div className="flex gap-3">
              {AVATAR_COLORS.map((color) => (
                <motion.button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  disabled={saving}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  style={{
                    backgroundColor: color,
                    border:
                      avatarColor === color
                        ? '3px solid var(--text-primary)'
                        : '3px solid transparent',
                    boxShadow: avatarColor === color ? `0 0 12px ${color}50` : 'none',
                    opacity: saving ? 0.6 : 1,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Sound Toggle */}
          <motion.div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  Sound Effects
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Play sounds for XP, badges, and celebrations
                </p>
              </div>
              <motion.button
                onClick={handleSoundToggle}
                className="relative w-14 h-8 rounded-full cursor-pointer"
                style={{
                  backgroundColor: soundEnabled
                    ? 'var(--neon-cyan)'
                    : 'var(--bg-surface-2)',
                  border: `1px solid ${soundEnabled ? 'var(--neon-cyan)' : 'var(--border-subtle)'}`,
                  padding: 0,
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-6 h-6 rounded-full"
                  style={{
                    backgroundColor: soundEnabled ? 'var(--bg-void)' : 'var(--text-muted)',
                    position: 'absolute',
                    top: '50%',
                  }}
                  animate={{
                    x: soundEnabled ? 28 : 4,
                    y: '-50%',
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.button>
            </div>
          </motion.div>

          {/* Daily Time Limit */}
          <motion.div
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="text-sm font-bold mb-1"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                  Daily Time Limit
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Set by your parent
                </p>
              </div>
              <span
                className="text-sm font-medium px-3 py-1.5 rounded-xl"
                style={{
                  backgroundColor: 'var(--bg-surface-2)',
                  color: 'var(--neon-amber)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {(profile as any).dailyTimeLimitMinutes
                  ? `${(profile as any).dailyTimeLimitMinutes} min`
                  : 'No limit'}
              </span>
            </div>
          </motion.div>

          {/* Sign Out */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="pt-4"
          >
            <motion.button
              onClick={handleSignOut}
              className="w-full py-3 rounded-2xl text-sm font-bold cursor-pointer"
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                color: 'var(--neon-coral)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
              }}
              whileHover={{ scale: 1.01, backgroundColor: 'rgba(220, 38, 38, 0.15)' }}
              whileTap={{ scale: 0.99 }}
            >
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
