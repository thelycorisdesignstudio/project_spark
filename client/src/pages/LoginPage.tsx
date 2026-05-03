import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import PageTransition from '../components/layout/PageTransition';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login(email, password);
      const me = await authService.getMe();
      setAuth(me.user, me.profile);
      navigate(me.user.role === 'parent' ? '/parent' : '/dashboard');
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot reach server. Please make sure the backend is running.');
      } else if (err.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: 'var(--bg-void)',
        }}
      >
        <motion.div
          style={{
            width: '100%',
            maxWidth: 440,
            padding: '40px 36px',
            borderRadius: 20,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>⚡</span>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 800,
                color: 'var(--neon-cyan)',
                marginBottom: 6,
              }}
            >
              SPARK
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
              Welcome back!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  fontSize: 15,
                  backgroundColor: 'var(--bg-surface-2)',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--border-medium)',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--neon-cyan)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: 8,
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 12,
                  fontSize: 15,
                  backgroundColor: 'var(--bg-surface-2)',
                  color: 'var(--text-primary)',
                  border: '2px solid var(--border-medium)',
                  outline: 'none',
                  fontFamily: 'var(--font-body)',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--neon-cyan)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  backgroundColor: 'rgba(220, 38, 38, 0.06)',
                  border: '1px solid rgba(220, 38, 38, 0.15)',
                  marginBottom: 16,
                }}
              >
                <p
                  style={{
                    fontSize: 14,
                    color: 'var(--neon-coral)',
                    fontWeight: 500,
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  {error}
                </p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px 0',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                backgroundColor: 'var(--neon-cyan)',
                color: '#ffffff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontFamily: 'var(--font-body)',
                boxShadow: '0 2px 12px rgba(8, 145, 178, 0.3)',
              }}
              whileHover={loading ? {} : { scale: 1.02, y: -2 }}
              whileTap={loading ? {} : { scale: 0.98 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </motion.button>
          </form>

          <p
            style={{
              textAlign: 'center',
              marginTop: 24,
              fontSize: 14,
              color: 'var(--text-muted)',
            }}
          >
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--neon-cyan)', fontWeight: 600 }}>
              Sign up
            </Link>
          </p>

          <div
            style={{
              marginTop: 16,
              paddingTop: 16,
              textAlign: 'center',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <Link
              to="/child-login"
              style={{ fontSize: 14, color: 'var(--neon-violet)', fontWeight: 600 }}
            >
              I'm a kid — log in with PIN
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
