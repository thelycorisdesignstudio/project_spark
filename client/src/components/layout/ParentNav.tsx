import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/parent', label: 'Dashboard', icon: '📊' },
  { path: '/parent/settings', label: 'Settings', icon: '⚙️' },
];

export default function ParentNav() {
  const location = useLocation();
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    clearAuth();
    navigate('/login');
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-16"
      style={{
        backgroundColor: 'var(--bg-glass)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <Link to="/parent" className="flex items-center gap-2">
        <span
          className="text-2xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)' }}
        >
          SPARK
        </span>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(124, 58, 237, 0.2)', color: 'var(--neon-violet)' }}
        >
          Parent
        </span>
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                className="px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium cursor-pointer"
                style={{
                  backgroundColor: isActive ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
                  color: isActive ? 'var(--neon-cyan)' : 'var(--text-secondary)',
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

      <div className="flex items-center gap-3">
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {user?.email}
        </span>
        <motion.button
          onClick={handleLogout}
          className="px-3 py-1.5 rounded-lg text-sm"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            color: 'var(--neon-coral)',
            border: '1px solid rgba(220, 38, 38, 0.2)',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
        >
          Logout
        </motion.button>
      </div>
    </nav>
  );
}
