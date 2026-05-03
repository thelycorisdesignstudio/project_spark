import { motion } from 'framer-motion';
import Button from '../ui/Button';

interface NextAction {
  type: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
}

interface NextActionCardProps {
  action: NextAction;
  onAction: () => void;
}

const buddyFaces: Record<string, string> = {
  mission: '🚀',
  practice: '🧪',
  streak: '🔥',
  review: '🔍',
  challenge: '⚡',
  default: '✨',
};

const urgencyButtonVariant: Record<string, 'primary' | 'secondary' | 'ghost'> = {
  high: 'primary',
  medium: 'secondary',
  low: 'ghost',
};

const urgencyCtaLabel: Record<string, string> = {
  high: "Let's go!",
  medium: 'Start now',
  low: 'Check it out',
};

export default function NextActionCard({ action, onAction }: NextActionCardProps) {
  const emoji = buddyFaces[action.type] ?? buddyFaces.default;
  const isHighUrgency = action.urgency === 'high';

  return (
    <motion.div
      className="relative p-5 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${isHighUrgency ? 'var(--border-glow-cyan)' : 'var(--border-subtle)'}`,
        boxShadow: isHighUrgency ? 'var(--shadow-cyan)' : 'var(--shadow-card)',
      }}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Pulsing glow border for high urgency */}
      {isHighUrgency && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            border: '1.5px solid var(--neon-cyan)',
            borderRadius: 'inherit',
          }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Spark Buddy face */}
        <motion.div
          className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl shrink-0"
          style={{ backgroundColor: 'var(--bg-surface-2)' }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        >
          {emoji}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium mb-1 uppercase tracking-wider"
            style={{ color: 'var(--text-muted)' }}
          >
            Spark Buddy says...
          </p>
          <p
            className="text-sm font-medium mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {action.reason}
          </p>
          <Button
            variant={urgencyButtonVariant[action.urgency] ?? 'secondary'}
            size="sm"
            onClick={onAction}
          >
            {urgencyCtaLabel[action.urgency] ?? 'Go'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
