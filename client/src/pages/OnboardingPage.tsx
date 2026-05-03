import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import api from '../services/api';

const AVATAR_COLORS = [
  '#7C3AED', // violet
  '#0891B2', // cyan
  '#059669', // green
  '#D97706', // amber
  '#DC2626', // coral
  '#EA580C', // orange
];

const STEP_TITLES = [
  "What's your name?",
  'How old are you?',
  'Create a secret PIN',
  'Pick your color!',
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -200 : 200,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState(8);
  const [pin, setPin] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const goNext = () => {
    setError('');
    if (step === 0 && displayName.trim().length < 1) {
      setError('Please enter a name');
      return;
    }
    if (step === 2 && pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setError('');
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/profiles/child', {
        displayName: displayName.trim(),
        age,
        pin,
        avatarColor,
      });
      navigate('/parent');
    } catch (err: any) {
      if (!err.response) {
        setError('Cannot reach server. Please make sure the backend is running.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Something went wrong. Please try again.');
      }
      setSubmitting(false);
    }
  };

  const isLastStep = step === 3;

  return (
    <PageTransition>
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: 'var(--bg-void)' }}
      >
        <div className="w-full max-w-md">
          {/* Progress bar */}
          <div className="flex gap-2 mb-8 px-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--bg-surface-2)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: 'var(--neon-cyan)' }}
                  initial={false}
                  animate={{ width: i <= step ? '100%' : '0%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>

          <motion.div
            className="p-8 rounded-2xl"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {/* Step title */}
            <span className="text-4xl mb-4 block text-center">
              {step === 0 ? '👋' : step === 1 ? '🎂' : step === 2 ? '🔐' : '🎨'}
            </span>
            <h1
              className="text-2xl font-bold mb-6 text-center"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)' }}
            >
              {STEP_TITLES[step]}
            </h1>

            {/* Step content with animation */}
            <div style={{ minHeight: '180px', position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {/* Step 1: Display Name */}
                  {step === 0 && (
                    <div className="text-center">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Type your name..."
                        maxLength={20}
                        className="w-full py-3 px-4 rounded-xl text-center text-lg outline-none"
                        style={{
                          backgroundColor: 'var(--bg-surface-2)',
                          color: 'var(--text-primary)',
                          border: '2px solid var(--border-medium)',
                          fontFamily: 'var(--font-body)',
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = 'var(--neon-cyan)')
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = 'var(--border-medium)')
                        }
                        onKeyDown={(e) => e.key === 'Enter' && goNext()}
                        autoFocus
                      />
                      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                        This is how Spark Buddy will greet you
                      </p>
                    </div>
                  )}

                  {/* Step 2: Age */}
                  {step === 1 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-4 mb-4">
                        <motion.button
                          onClick={() => setAge(Math.max(5, age - 1))}
                          className="w-12 h-12 rounded-full text-xl font-bold cursor-pointer"
                          style={{
                            backgroundColor: 'var(--bg-surface-2)',
                            color: 'var(--text-primary)',
                            border: '2px solid var(--border-medium)',
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <motion.span
                          key={age}
                          className="text-5xl font-bold"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)', minWidth: '80px' }}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          {age}
                        </motion.span>
                        <motion.button
                          onClick={() => setAge(Math.min(18, age + 1))}
                          className="w-12 h-12 rounded-full text-xl font-bold cursor-pointer"
                          style={{
                            backgroundColor: 'var(--bg-surface-2)',
                            color: 'var(--text-primary)',
                            border: '2px solid var(--border-medium)',
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Ages 5-18. This helps us adjust the difficulty.
                      </p>
                    </div>
                  )}

                  {/* Step 3: PIN */}
                  {step === 2 && (
                    <div className="text-center">
                      {/* PIN Dots */}
                      <div className="flex justify-center gap-4 mb-5">
                        {[0, 1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            className="w-5 h-5 rounded-full"
                            style={{
                              backgroundColor:
                                i < pin.length ? 'var(--neon-cyan)' : 'var(--bg-surface-3)',
                              boxShadow:
                                i < pin.length ? 'var(--shadow-cyan)' : 'none',
                            }}
                            animate={i < pin.length ? { scale: [1, 1.3, 1] } : {}}
                            transition={{ duration: 0.2 }}
                          />
                        ))}
                      </div>

                      {/* Number Pad */}
                      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'].map(
                          (digit) =>
                            digit === '' ? (
                              <div key="empty" />
                            ) : (
                              <motion.button
                                key={digit}
                                onClick={() => {
                                  if (digit === '←') setPin(pin.slice(0, -1));
                                  else handlePinInput(digit);
                                }}
                                className="py-2.5 rounded-xl text-lg font-bold cursor-pointer"
                                style={{
                                  backgroundColor: 'var(--bg-surface-2)',
                                  color: 'var(--text-primary)',
                                  border: '2px solid var(--border-medium)',
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {digit}
                              </motion.button>
                            )
                        )}
                      </div>
                      <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
                        You'll use this PIN to sign in
                      </p>
                    </div>
                  )}

                  {/* Step 4: Avatar Color */}
                  {step === 3 && (
                    <div className="text-center">
                      {/* Preview avatar */}
                      <motion.div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6"
                        style={{ backgroundColor: avatarColor, color: '#ffffff' }}
                        animate={{ backgroundColor: avatarColor }}
                        transition={{ duration: 0.3 }}
                      >
                        {displayName.charAt(0).toUpperCase() || '?'}
                      </motion.div>

                      {/* Color circles */}
                      <div className="flex justify-center gap-4 mb-4">
                        {AVATAR_COLORS.map((color) => (
                          <motion.button
                            key={color}
                            onClick={() => setAvatarColor(color)}
                            className="w-12 h-12 rounded-full cursor-pointer"
                            style={{
                              backgroundColor: color,
                              border:
                                avatarColor === color
                                  ? '3px solid var(--text-primary)'
                                  : '3px solid transparent',
                              boxShadow:
                                avatarColor === color ? `0 0 15px ${color}60` : 'none',
                            }}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                          />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        This will be your avatar color
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-center mt-2 mb-2"
                style={{ color: 'var(--neon-coral)' }}
              >
                {error}
              </motion.p>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-6">
              {step > 0 && (
                <motion.button
                  onClick={goBack}
                  className="flex-1 py-3 rounded-xl text-sm font-medium cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-surface-2)',
                    color: 'var(--text-secondary)',
                    border: '2px solid var(--border-medium)',
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back
                </motion.button>
              )}
              <motion.button
                onClick={isLastStep ? handleSubmit : goNext}
                disabled={submitting}
                className="flex-1 py-3 rounded-xl text-sm font-bold cursor-pointer"
                style={{
                  backgroundColor: 'var(--neon-cyan)',
                  color: '#ffffff',
                  border: 'none',
                  opacity: submitting ? 0.6 : 1,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {submitting ? 'Creating...' : isLastStep ? 'Create Profile' : 'Next'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
