import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Play, CheckCircle, Clock, Zap } from 'lucide-react';

interface MissionData {
  id: number;
  title: string;
  questBrief: string;
  estimatedMinutes: number;
  xpReward: number;
}

type MissionStatus = 'locked' | 'in-progress' | 'completed';

interface MissionCardProps {
  mission: MissionData;
  worldId: number;
  worldColor: string;
  status: MissionStatus;
  index: number;
}

const statusConfig: Record<
  MissionStatus,
  { Icon: typeof Lock; label: string; getColor: (worldColor: string) => string }
> = {
  locked: {
    Icon: Lock,
    label: 'Locked',
    getColor: () => 'var(--text-muted)',
  },
  'in-progress': {
    Icon: Play,
    label: 'In Progress',
    getColor: (worldColor) => worldColor,
  },
  completed: {
    Icon: CheckCircle,
    label: 'Complete',
    getColor: () => 'var(--neon-green)',
  },
};

export default function MissionCard({
  mission,
  worldId,
  worldColor,
  status,
  index,
}: MissionCardProps) {
  const config = statusConfig[status];
  const { Icon } = config;
  const statusColor = config.getColor(worldColor);
  const isLocked = status === 'locked';

  const cardContent = (
    <motion.div
      className="relative p-5 rounded-2xl"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: `1px solid ${isLocked ? 'var(--border-subtle)' : statusColor + '40'}`,
        boxShadow: isLocked ? 'none' : `0 0 20px ${statusColor}15`,
        opacity: isLocked ? 0.5 : 1,
        cursor: isLocked ? 'default' : 'pointer',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: isLocked ? 0.5 : 1, x: 0 }}
      transition={{
        delay: index * 0.08,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      whileHover={
        isLocked
          ? {}
          : {
              scale: 1.02,
              y: -4,
              boxShadow: `0 0 30px ${statusColor}25`,
              transition: { type: 'spring', stiffness: 300, damping: 25 },
            }
      }
      whileTap={isLocked ? {} : { scale: 0.98 }}
    >
      <div className="flex items-start gap-4">
        {/* Mission number */}
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold shrink-0"
          style={{
            backgroundColor: isLocked ? 'var(--bg-surface-2)' : statusColor + '15',
            color: isLocked ? 'var(--text-muted)' : statusColor,
            fontFamily: 'var(--font-mono)',
          }}
        >
          {mission.id}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className="text-base font-bold mb-1"
            style={{
              fontFamily: 'var(--font-display)',
              color: isLocked ? 'var(--text-muted)' : 'var(--text-primary)',
            }}
          >
            {mission.title}
          </h3>
          <p
            className="text-xs mb-3 line-clamp-2"
            style={{ color: isLocked ? 'var(--text-muted)' : 'var(--text-secondary)' }}
          >
            {mission.questBrief}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--text-muted)' }}
            >
              <Clock size={12} />
              <span>{mission.estimatedMinutes} min</span>
            </div>
            <div
              className="flex items-center gap-1 text-xs"
              style={{ color: 'var(--neon-amber)' }}
            >
              <Zap size={12} />
              <span>{mission.xpReward} XP</span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div
          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{
            backgroundColor: isLocked ? 'var(--bg-surface-2)' : statusColor + '15',
          }}
        >
          <Icon size={16} style={{ color: statusColor }} />
        </div>
      </div>
    </motion.div>
  );

  if (isLocked) {
    return cardContent;
  }

  return (
    <Link
      to={`/worlds/${worldId}/missions/${mission.id}`}
      style={{ textDecoration: 'none' }}
    >
      {cardContent}
    </Link>
  );
}
