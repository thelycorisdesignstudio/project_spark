import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: '🏠' },
  { path: '/worlds', label: 'Worlds', icon: '🌍' },
  { path: '/projects', label: 'Projects', icon: '📁' },
  { path: '/badges', label: 'Badges', icon: '🏅' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function ChildNav() {
  const location = useLocation();
  const { profile } = useAuthStore();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2">
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)' }}
        >
          SPARK
        </span>
      </Link>

      {/* Nav Links */}
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
                  color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                  border: isActive ? '1px solid var(--border-glow-cyan)' : '1px solid transparent',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            backgroundColor: profile?.avatarColor || 'var(--neon-cyan)',
            color: '#ffffff',
          }}
        >
          {profile?.displayName?.charAt(0).toUpperCase() || '?'}
        </div>
        <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
          {profile?.displayName || 'Coder'}
        </span>
      </div>
    </nav>
  );
}
