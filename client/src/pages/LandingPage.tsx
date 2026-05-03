import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stagger = {
  animate: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 180, damping: 22 } },
};

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-void)' }}>
      {/* ── Navbar ──────────────────────────────────────────── */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{ maxWidth: 1120, margin: '0 auto', padding: '16px 32px' }}
          className="flex items-center justify-between"
        >
          <Link to="/" className="flex items-center gap-2">
            <span style={{ fontSize: 28 }}>⚡</span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 800,
                color: 'var(--neon-cyan)',
                letterSpacing: '-0.02em',
              }}
            >
              SPARK
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <motion.button
                style={{
                  padding: '8px 20px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}
                whileHover={{ color: 'var(--text-primary)' }}
              >
                Sign In
              </motion.button>
            </Link>
            <Link to="/signup">
              <motion.button
                style={{
                  padding: '10px 24px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  backgroundColor: 'var(--neon-cyan)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-body)',
                  boxShadow: '0 2px 12px rgba(8, 145, 178, 0.3)',
                }}
                whileHover={{ scale: 1.04, y: -1, boxShadow: '0 4px 20px rgba(8, 145, 178, 0.4)' }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section
        style={{
          padding: '80px 32px 100px',
          textAlign: 'center',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(8, 145, 178, 0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 140, damping: 20, delay: 0.1 }}
          style={{ maxWidth: 720, margin: '0 auto' }}
        >
          <motion.span
            style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: 100,
              fontSize: 13,
              fontWeight: 600,
              backgroundColor: 'rgba(8, 145, 178, 0.08)',
              color: 'var(--neon-cyan)',
              border: '1px solid rgba(8, 145, 178, 0.2)',
              marginBottom: 32,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            🚀 The #1 AI coding platform for kids
          </motion.span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5vw, 60px)',
              fontWeight: 900,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              marginBottom: 24,
              letterSpacing: '-0.02em',
            }}
          >
            Where kids stop{' '}
            <span style={{ color: 'var(--neon-cyan)' }}>consuming</span>
            <br />
            the internet and start{' '}
            <span style={{ color: 'var(--neon-violet)' }}>building</span> it
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              maxWidth: 560,
              margin: '0 auto 40px',
            }}
          >
            SPARK teaches real coding through an AI companion that feels like a best friend,
            a visual world that feels like a video game, and projects that make kids feel like
            genuine builders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <motion.button
                style={{
                  padding: '16px 40px',
                  borderRadius: 16,
                  fontSize: 17,
                  fontWeight: 800,
                  backgroundColor: 'var(--neon-cyan)',
                  color: '#ffffff',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 20px rgba(8, 145, 178, 0.35)',
                  letterSpacing: '-0.01em',
                }}
                whileHover={{ scale: 1.04, y: -3, boxShadow: '0 8px 30px rgba(8, 145, 178, 0.45)' }}
                whileTap={{ scale: 0.97 }}
              >
                Start Free — No Card Needed
              </motion.button>
            </Link>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
              Ages 8–16 · 5 worlds · 90 coding missions
            </span>
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section style={{ padding: '80px 32px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: 56 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              How SPARK Works
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 480, margin: '0 auto' }}>
              Kids don't take a course. They go on an adventure.
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                step: '01',
                icon: '🌍',
                title: 'Choose a World',
                desc: 'Five unique coding worlds — from HTML kingdoms to Python planets. Each one teaches real skills through story-driven missions.',
                color: 'var(--neon-violet)',
              },
              {
                step: '02',
                icon: '⚡',
                title: 'Code with Spark Buddy',
                desc: "An AI companion that never gives the answer. It guides, encourages, and celebrates — like having the world's best coding teacher.",
                color: 'var(--neon-cyan)',
              },
              {
                step: '03',
                icon: '🚀',
                title: 'Build Real Projects',
                desc: 'Every mission ends with something kids built themselves — websites, games, animations. Real code. Real pride.',
                color: 'var(--neon-green)',
              },
            ].map((item) => (
              <motion.div
                key={item.step}
                variants={fadeUp}
                style={{
                  padding: 32,
                  borderRadius: 20,
                  textAlign: 'center',
                  backgroundColor: 'var(--bg-void)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: 100,
                    backgroundColor: `color-mix(in srgb, ${item.color} 10%, transparent)`,
                    color: item.color,
                    marginBottom: 16,
                    letterSpacing: '0.05em',
                  }}
                >
                  STEP {item.step}
                </span>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{item.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 800,
                    color: item.color,
                    marginBottom: 10,
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', backgroundColor: 'var(--bg-void)' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: 56 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              Everything a young coder needs
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              Built by engineers and educators who believe every child is capable of anything.
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: '🤖',
                title: 'AI Coding Buddy',
                desc: "A patient, encouraging AI companion that adapts to each child's skill level. Never gives the answer — always guides.",
                color: 'var(--neon-cyan)',
                borderColor: 'rgba(8, 145, 178, 0.15)',
              },
              {
                icon: '🧠',
                title: 'Adaptive Learning',
                desc: 'Bayesian knowledge tracing, dynamic difficulty adjustment, and frustration detection. SPARK gets smarter with every interaction.',
                color: 'var(--neon-violet)',
                borderColor: 'rgba(124, 58, 237, 0.15)',
              },
              {
                icon: '🏆',
                title: 'Gamification',
                desc: "50 levels, 22 badges, XP streaks, and daily challenges. Every line of code earns progress. Kids can't wait to come back.",
                color: 'var(--neon-amber)',
                borderColor: 'rgba(217, 119, 6, 0.15)',
              },
              {
                icon: '📊',
                title: 'Parent Dashboard',
                desc: 'Track progress, set time limits, and receive AI-generated weekly reports. Know exactly what your child is learning.',
                color: 'var(--neon-green)',
                borderColor: 'rgba(5, 150, 105, 0.15)',
              },
              {
                icon: '💻',
                title: 'Real Code Editor',
                desc: 'Professional Monaco editor with syntax highlighting, live preview, and intelligent error messages made for kids.',
                color: 'var(--neon-cyan)',
                borderColor: 'rgba(8, 145, 178, 0.15)',
              },
              {
                icon: '🔒',
                title: 'COPPA Compliant',
                desc: "No ads. No tracking. No external links. Sandboxed code execution. Built from the ground up for children's safety.",
                color: 'var(--neon-coral)',
                borderColor: 'rgba(220, 38, 38, 0.15)',
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  padding: 28,
                  borderRadius: 18,
                  display: 'flex',
                  gap: 20,
                  alignItems: 'flex-start',
                  backgroundColor: 'var(--bg-surface)',
                  border: `1px solid ${feat.borderColor}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                }}
              >
                <span
                  style={{
                    fontSize: 32,
                    flexShrink: 0,
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 14,
                    backgroundColor: 'var(--bg-void)',
                  }}
                >
                  {feat.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                      fontWeight: 800,
                      color: feat.color,
                      marginBottom: 6,
                    }}
                  >
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--text-secondary)', margin: 0 }}>
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Worlds Preview ─────────────────────────────────── */}
      <section style={{ padding: '80px 32px', backgroundColor: 'var(--bg-surface)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: 48 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              5 Worlds of Coding Adventure
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 520, margin: '0 auto' }}>
              From first HTML tag to building full games — a curriculum designed for real mastery.
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: '🏰', name: 'The Web Kingdom', skills: 'HTML & CSS', missions: 6, color: '#7C3AED' },
              { icon: '🧩', name: 'The Logic Lands', skills: 'JavaScript Fundamentals', missions: 6, color: '#0891B2' },
              { icon: '🎬', name: 'Animation Archipelago', skills: 'CSS & JS Animation', missions: 6, color: '#059669' },
              { icon: '🎮', name: 'The Game Galaxy', skills: 'Canvas Game Development', missions: 6, color: '#D97706' },
              { icon: '🐍', name: 'Python Planet', skills: 'Python Programming', missions: 6, color: '#DC2626' },
            ].map((world, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  padding: '20px 24px',
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  backgroundColor: 'var(--bg-void)',
                  border: `1px solid ${world.color}20`,
                  boxShadow: '0 1px 8px rgba(0,0,0,0.03)',
                }}
              >
                <span style={{ fontSize: 36, flexShrink: 0 }}>{world.icon}</span>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 16,
                      fontWeight: 800,
                      color: world.color,
                      marginBottom: 2,
                    }}
                  >
                    {world.name}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    {world.skills}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '5px 14px',
                    borderRadius: 100,
                    backgroundColor: `${world.color}10`,
                    color: world.color,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {world.missions} missions
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ────────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', backgroundColor: 'var(--bg-void)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <motion.div
            style={{ textAlign: 'center', marginBottom: 48 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: 12,
              }}
            >
              Simple pricing for every family
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 420, margin: '0 auto' }}>
              Start free. Upgrade when you're ready.
            </p>
          </motion.div>

          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'start' }}
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                features: ['1 child profile', 'World 1 (HTML & CSS)', '3 projects', 'AI Spark Buddy'],
                color: 'var(--text-secondary)',
                featured: false,
              },
              {
                name: 'SPARK Pro',
                price: '$9.99',
                period: '/month',
                features: ['1 child profile', 'All 5 worlds', 'Unlimited projects', 'Parent dashboard', 'Weekly reports', 'Daily challenges'],
                color: 'var(--neon-cyan)',
                featured: true,
              },
              {
                name: 'Family',
                price: '$14.99',
                period: '/month',
                features: ['Up to 3 children', 'All Pro features', 'Family leaderboard', 'Priority support'],
                color: 'var(--neon-violet)',
                featured: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                style={{
                  padding: 32,
                  borderRadius: 20,
                  position: 'relative',
                  backgroundColor: 'var(--bg-surface)',
                  border: plan.featured ? '2px solid var(--neon-cyan)' : '1px solid var(--border-subtle)',
                  boxShadow: plan.featured
                    ? '0 8px 32px rgba(8, 145, 178, 0.15)'
                    : '0 2px 12px rgba(0,0,0,0.04)',
                  ...(plan.featured ? { transform: 'scale(1.03)' } : {}),
                }}
              >
                {plan.featured && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -14,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '5px 16px',
                      borderRadius: 100,
                      fontSize: 12,
                      fontWeight: 800,
                      backgroundColor: 'var(--neon-cyan)',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(8, 145, 178, 0.3)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: 14, fontWeight: 700, color: plan.color, marginBottom: 4 }}>{plan.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 36,
                      fontWeight: 900,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ fontSize: 14, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--neon-green)', fontSize: 16 }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <motion.button
                    style={{
                      width: '100%',
                      padding: '12px 0',
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: 'var(--font-body)',
                      backgroundColor: plan.featured ? 'var(--neon-cyan)' : 'var(--bg-surface-2)',
                      color: plan.featured ? '#ffffff' : 'var(--text-primary)',
                      border: plan.featured ? 'none' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                    }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {plan.featured ? 'Start 7-Day Free Trial' : 'Get Started'}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
            7-day free trial on Pro and Family plans. Cancel anytime. No questions asked.
          </p>
        </div>
      </section>

      {/* ── CTA Section ────────────────────────────────────── */}
      <section style={{ padding: '80px 32px', backgroundColor: 'var(--bg-surface)' }}>
        <motion.div
          style={{
            maxWidth: 680,
            margin: '0 auto',
            padding: '64px 48px',
            borderRadius: 28,
            textAlign: 'center',
            background: 'linear-gradient(135deg, rgba(8, 145, 178, 0.06) 0%, rgba(124, 58, 237, 0.06) 100%)',
            border: '1px solid rgba(8, 145, 178, 0.15)',
            boxShadow: '0 4px 24px rgba(8, 145, 178, 0.08)',
          }}
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 30,
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: 12,
            }}
          >
            Ready to spark something amazing?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, marginBottom: 32 }}>
            Your child is 2 minutes away from writing their first line of code.
          </p>
          <Link to="/signup">
            <motion.button
              style={{
                padding: '16px 40px',
                borderRadius: 16,
                fontSize: 17,
                fontWeight: 800,
                backgroundColor: 'var(--neon-cyan)',
                color: '#ffffff',
                fontFamily: 'var(--font-display)',
                boxShadow: '0 4px 20px rgba(8, 145, 178, 0.35)',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.04, y: -3, boxShadow: '0 8px 30px rgba(8, 145, 178, 0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              Get Started Free
            </motion.button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer
        style={{
          padding: '48px 32px',
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-void)',
        }}
      >
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="flex items-center justify-center gap-2" style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 20 }}>⚡</span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 800,
                color: 'var(--neon-cyan)',
              }}
            >
              SPARK
            </span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Where kids learn to build the future
          </p>
          <div className="flex items-center justify-center gap-6" style={{ marginBottom: 20 }}>
            {['Privacy', 'Terms', 'Safety', 'Contact'].map((link) => (
              <span
                key={link}
                style={{ fontSize: 13, color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}
              >
                {link}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-disabled)' }}>
            COPPA Compliant · No ads · No tracking · Built for children's safety
          </p>
        </div>
      </footer>
    </div>
  );
}
