import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import PageTransition from '../components/layout/PageTransition';

interface ChildProfile {
  _id: string;
  displayName: string;
  avatarColor: string;
}

type Step = 'email' | 'pick' | 'pin';

export default function ChildLoginPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [parentId, setParentId] = useState('');
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ChildProfile | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await authService.lookupProfiles(email);
      if (!data.parentId || data.profiles.length === 0) {
        setError('No kid profiles found for this email. Ask your parent to create one!');
        return;
      }
      setParentId(data.parentId);
      setProfiles(data.profiles);
      if (data.profiles.length === 1) {
        setSelectedProfile(data.profiles[0]);
        setStep('pin');
      } else {
        setStep('pick');
      }
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot reach server. Please try again later.');
      } else {
        setError('Something went wrong. Try again!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePickProfile = (profile: ChildProfile) => {
    setSelectedProfile(profile);
    setPin('');
    setError('');
    setStep('pin');
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        handleLogin(newPin);
      }
    }
  };

  const handleLogin = async (pinValue: string) => {
    if (!parentId || !selectedProfile) return;
    setLoading(true);
    setError('');

    try {
      await authService.childLogin(parentId, selectedProfile._id, pinValue);
      const me = await authService.getMe();
      setAuth(me.user, me.profile);
      navigate('/dashboard');
    } catch {
      setError('Wrong PIN! Try again');
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
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
            maxWidth: 420,
            padding: '40px 36px',
            borderRadius: 20,
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
            textAlign: 'center',
          }}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
        >
          <span style={{ fontSize: 40, display: 'block', marginBottom: 8 }}>⚡</span>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--neon-cyan)',
              marginBottom: 4,
            }}
          >
            Kid Login
          </h1>

          <AnimatePresence mode="wait">
            {/* ── Step 1: Enter parent email ── */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                  Enter your parent's email to find your profile
                </p>
                <form onSubmit={handleEmailSubmit}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="parent@example.com"
                    required
                    style={{ ...inputStyle, marginBottom: 14 }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--neon-cyan)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
                  />
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
                      fontFamily: 'var(--font-body)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.6 : 1,
                      border: 'none',
                      boxShadow: '0 2px 12px rgba(8, 145, 178, 0.3)',
                    }}
                    whileHover={loading ? {} : { scale: 1.02 }}
                    whileTap={loading ? {} : { scale: 0.98 }}
                  >
                    {loading ? 'Looking...' : 'Find My Profile'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Pick your profile ── */}
            {step === 'pick' && (
              <motion.div
                key="pick"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
                  Which one are you?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {profiles.map((p) => (
                    <motion.button
                      key={p._id}
                      onClick={() => handlePickProfile(p)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '14px 18px',
                        borderRadius: 14,
                        backgroundColor: 'var(--bg-surface-2)',
                        border: '2px solid var(--border-medium)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        textAlign: 'left',
                      }}
                      whileHover={{ scale: 1.02, borderColor: p.avatarColor }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: '50%',
                          backgroundColor: p.avatarColor,
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {p.displayName.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                        {p.displayName}
                      </span>
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => { setStep('email'); setError(''); }}
                  style={{ fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', background: 'none', border: 'none' }}
                >
                  ← That's not my parent's email
                </button>
              </motion.div>
            )}

            {/* ── Step 3: Enter PIN ── */}
            {step === 'pin' && selectedProfile && (
              <motion.div
                key="pin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: selectedProfile.avatarColor,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 800,
                    margin: '12px auto 8px',
                  }}
                >
                  {selectedProfile.displayName.charAt(0).toUpperCase()}
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  Hi, {selectedProfile.displayName}!
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
                  Enter your 4-digit secret PIN
                </p>

                {/* PIN Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: i < pin.length ? 'var(--neon-cyan)' : 'var(--bg-surface-3)',
                        boxShadow: i < pin.length ? '0 2px 8px rgba(8,145,178,0.3)' : 'none',
                      }}
                      animate={i < pin.length ? { scale: [1, 1.4, 1] } : {}}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>

                {/* Number Pad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'].map((digit) =>
                    digit === '' ? <div key="empty" /> : (
                      <motion.button
                        key={digit}
                        onClick={() => {
                          if (digit === '←') setPin(pin.slice(0, -1));
                          else handlePinInput(digit);
                        }}
                        disabled={loading}
                        style={{
                          padding: '14px 0',
                          borderRadius: 12,
                          fontSize: 20,
                          fontWeight: 700,
                          backgroundColor: 'var(--bg-surface-2)',
                          color: 'var(--text-primary)',
                          border: '2px solid var(--border-medium)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                        }}
                        whileHover={{ scale: 1.06, backgroundColor: 'var(--bg-surface-3)' }}
                        whileTap={{ scale: 0.94 }}
                      >
                        {digit}
                      </motion.button>
                    )
                  )}
                </div>

                <button
                  onClick={() => {
                    setPin('');
                    setError('');
                    setStep(profiles.length > 1 ? 'pick' : 'email');
                  }}
                  style={{ fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', background: 'none', border: 'none' }}
                >
                  ← Not {selectedProfile.displayName}? Go back
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                padding: '12px 16px',
                borderRadius: 10,
                backgroundColor: 'rgba(220, 38, 38, 0.06)',
                border: '1px solid rgba(220, 38, 38, 0.15)',
                marginTop: 16,
              }}
            >
              <p style={{ fontSize: 14, color: 'var(--neon-coral)', fontWeight: 600, margin: 0 }}>
                {error}
              </p>
            </motion.div>
          )}

          <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-subtle)' }}>
            <Link to="/login" style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
              I'm a parent — sign in with email
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
