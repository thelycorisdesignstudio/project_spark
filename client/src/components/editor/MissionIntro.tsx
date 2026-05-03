import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MissionIntroProps {
  worldName: string;
  worldIcon: string;
  worldColor: string;
  missionTitle: string;
  questBrief: string;
  stageTitle: string;
  stageBrief: string;
  stageNumber: number;
  xpReward: number;
  onStart: () => void;
}

export default function MissionIntro({
  worldName,
  worldIcon,
  worldColor,
  missionTitle,
  questBrief,
  stageTitle,
  stageBrief,
  stageNumber,
  xpReward,
  onStart,
}: MissionIntroProps) {
  const [step, setStep] = useState(0);

  const slides = [
    // Slide 0: World + Mission context
    {
      icon: worldIcon,
      title: `${worldName}`,
      subtitle: missionTitle,
      body: questBrief,
      accent: worldColor,
    },
    // Slide 1: Stage briefing
    {
      icon: '🎯',
      title: `Stage ${stageNumber}: ${stageTitle}`,
      subtitle: 'Your Mission',
      body: stageBrief,
      accent: worldColor,
    },
    // Slide 2: Ready to code
    {
      icon: '⚡',
      title: "You've got this!",
      subtitle: `+${xpReward} XP available`,
      body: "Spark Buddy is here to help. Use hints if you get stuck — there's no penalty for learning!",
      accent: worldColor,
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-void)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-lg w-full mx-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="p-8 rounded-3xl text-center"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: `1px solid ${slides[step].accent}40`,
              boxShadow: `0 0 60px ${slides[step].accent}15`,
            }}
          >
            <motion.span
              className="text-5xl block mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, delay: 0.1 }}
            >
              {slides[step].icon}
            </motion.span>

            <motion.p
              className="text-xs font-medium mb-2"
              style={{ color: slides[step].accent }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {slides[step].subtitle}
            </motion.p>

            <motion.h2
              className="text-2xl font-bold mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {slides[step].title}
            </motion.h2>

            <motion.p
              className="text-sm leading-relaxed mb-8"
              style={{ color: 'var(--text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {slides[step].body}
            </motion.p>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{
                    backgroundColor: i === step ? slides[step].accent : 'var(--bg-surface-3)',
                    transform: i === step ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
              ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center gap-3">
              {step > 0 && (
                <motion.button
                  onClick={() => setStep(step - 1)}
                  className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Back
                </motion.button>
              )}

              {step < slides.length - 1 ? (
                <motion.button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    backgroundColor: slides[step].accent,
                    color: '#ffffff',
                    boxShadow: `0 0 20px ${slides[step].accent}30`,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  onClick={onStart}
                  className="px-8 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
                  style={{
                    backgroundColor: slides[step].accent,
                    color: '#ffffff',
                    boxShadow: `0 0 20px ${slides[step].accent}30`,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Let's Code! ⚡
                </motion.button>
              )}
            </div>

            {/* Skip link */}
            {step < slides.length - 1 && (
              <button
                onClick={onStart}
                className="mt-4 text-xs cursor-pointer"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none' }}
              >
                Skip intro →
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
