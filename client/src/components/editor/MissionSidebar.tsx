import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../store/editorStore';
import { useAuthStore } from '../../store/authStore';
import { progressService } from '../../services/progress.service';
import Confetti from '../gamification/Confetti';
import type { ValidationResult } from '../../types';

interface MissionSidebarProps {
  worldId: number;
  missionId: number;
  stageId: number;
}

interface CompletionInfo {
  type: 'stage' | 'mission' | 'world';
  xpEarned: number;
  label: string;
}

export default function MissionSidebar({ worldId, missionId, stageId }: MissionSidebarProps) {
  const navigate = useNavigate();
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [stageComplete, setStageComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completionInfo, setCompletionInfo] = useState<CompletionInfo | null>(null);
  const { files } = useEditorStore();
  const { profile, setAuth } = useAuthStore();

  const handleValidate = useCallback(async () => {
    setIsValidating(true);

    try {
      // Dynamic import of validators
      const validators = await import('../../utils/validators');
      const fnName = `validate_W${worldId}_M${missionId}_S${stageId}`;
      const validateFn = (validators as any)[fnName];

      if (!validateFn) {
        setValidationResult({ passed: false, checkpoints: [{ id: 'error', label: 'Validator not found', passed: false }] });
        return;
      }

      const code = files.html || files.python || '';
      const result = validateFn(code);
      setValidationResult(result);

      if (result.passed && !stageComplete) {
        setStageComplete(true);
        setShowConfetti(true);

        const response = await progressService.completeStage({
          worldId,
          missionId,
          stageId,
          timeSpentSeconds: 0,
          hintsUsed: 0,
        });

        const xp = response?.xpAwarded || 50;

        // Update profile XP locally
        if (profile) {
          const user = useAuthStore.getState().user;
          if (user) {
            setAuth(user, { ...profile, xp: profile.xp + xp });
          }
        }

        // Determine completion type
        if (stageId === 3 && missionId === 6) {
          setCompletionInfo({ type: 'world', xpEarned: xp, label: `World ${worldId} Complete!` });
        } else if (stageId === 3) {
          setCompletionInfo({ type: 'mission', xpEarned: xp, label: `Mission ${missionId} Complete!` });
        } else {
          setCompletionInfo({ type: 'stage', xpEarned: xp, label: 'Stage Complete!' });
        }
      }
    } catch (err) {
      console.error('Validation error:', err);
    } finally {
      setIsValidating(false);
    }
  }, [worldId, missionId, stageId, files, stageComplete]);

  return (
    <div
      className="h-full overflow-y-auto p-4"
      style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
    >
      {/* Stage Progress */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor: s < stageId ? 'var(--neon-green)'
                : s === stageId ? 'var(--neon-cyan)'
                  : 'var(--bg-surface-3)',
              boxShadow: s === stageId ? 'var(--shadow-cyan)' : 'none',
            }}
          />
        ))}
        <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
          Stage {stageId} of 3
        </span>
      </div>

      {/* Quest Brief */}
      <div
        className="p-3 rounded-xl mb-4"
        style={{
          backgroundColor: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <h3
          className="text-sm font-bold mb-1"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Current Objective
        </h3>
        <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Complete this stage by passing all checkpoints below.
        </p>
      </div>

      {/* Checkpoints */}
      {validationResult && (
        <div className="space-y-2 mb-4">
          <AnimatePresence>
            {validationResult.checkpoints.map((cp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 p-2 rounded-lg text-xs"
                style={{
                  backgroundColor: cp.passed ? 'rgba(5, 150, 105, 0.1)' : 'rgba(220, 38, 38, 0.05)',
                  border: `1px solid ${cp.passed ? 'rgba(5, 150, 105, 0.2)' : 'rgba(220, 38, 38, 0.1)'}`,
                }}
              >
                <span>{cp.passed ? '✅' : '⬜'}</span>
                <span style={{ color: cp.passed ? 'var(--neon-green)' : 'var(--text-secondary)' }}>
                  {cp.label}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Validate Button */}
      <motion.button
        onClick={handleValidate}
        className="w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer"
        style={{
          backgroundColor: stageComplete ? 'var(--neon-green)' : 'var(--neon-cyan)',
          color: '#ffffff',
          boxShadow: stageComplete ? '0 0 20px rgba(5, 150, 105, 0.3)' : 'var(--shadow-cyan)',
        }}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        disabled={isValidating || stageComplete}
      >
        {isValidating ? 'Checking...' : stageComplete ? '✅ Stage Complete!' : '🔍 Check My Code'}
      </motion.button>

      {stageComplete && completionInfo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-5 rounded-xl text-center"
          style={{
            backgroundColor: completionInfo.type === 'world'
              ? 'rgba(124, 58, 237, 0.1)'
              : completionInfo.type === 'mission'
                ? 'rgba(8, 145, 178, 0.1)'
                : 'rgba(5, 150, 105, 0.1)',
            border: `1px solid ${
              completionInfo.type === 'world'
                ? 'rgba(124, 58, 237, 0.3)'
                : completionInfo.type === 'mission'
                  ? 'rgba(8, 145, 178, 0.3)'
                  : 'rgba(5, 150, 105, 0.2)'
            }`,
          }}
        >
          <motion.p
            className="text-3xl mb-2"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            {completionInfo.type === 'world' ? '🏆' : completionInfo.type === 'mission' ? '🌟' : '🎉'}
          </motion.p>
          <p
            className="text-sm font-bold mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              color: completionInfo.type === 'world'
                ? 'var(--neon-violet)'
                : completionInfo.type === 'mission'
                  ? 'var(--neon-cyan)'
                  : 'var(--neon-green)',
            }}
          >
            {completionInfo.label}
          </p>
          <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
            Amazing work!
          </p>
          <motion.p
            className="text-sm font-bold"
            style={{ color: 'var(--neon-amber)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            +{completionInfo.xpEarned} XP
          </motion.p>

          {/* Next stage / mission / back to worlds */}
          <motion.button
            className="mt-3 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            style={{
              backgroundColor: 'var(--neon-cyan)',
              color: '#ffffff',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (completionInfo.type === 'world') {
                navigate('/worlds');
              } else if (completionInfo.type === 'mission') {
                navigate(`/worlds/${worldId}`);
              } else {
                // Next stage: reload page for next stage
                const nextStage = stageId + 1;
                navigate(`/editor/new?worldId=${worldId}&missionId=${missionId}&stageId=${nextStage}`);
              }
            }}
          >
            {completionInfo.type === 'world'
              ? '🌍 Back to Worlds'
              : completionInfo.type === 'mission'
                ? '📋 View Missions'
                : '➡️ Next Stage'}
          </motion.button>
        </motion.div>
      )}

      {/* Confetti */}
      <Confetti trigger={showConfetti} onComplete={() => setShowConfetti(false)} />
    </div>
  );
}
