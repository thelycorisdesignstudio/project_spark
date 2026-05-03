import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CodePanel from './CodePanel';
import PreviewPanel from './PreviewPanel';
import SparkChatPanel from './SparkChatPanel';
import EditorToolbar from './EditorToolbar';
import MissionSidebar from './MissionSidebar';
import MissionIntro from './MissionIntro';
import { useEditorStore } from '../../store/editorStore';
import { useAuthStore } from '../../store/authStore';
import { CURRICULUM } from '../../constants/curriculum';

interface EditorLayoutProps {
  missionMode?: boolean;
  worldId?: number;
  missionId?: number;
  stageId?: number;
}

type MobileTab = 'code' | 'preview' | 'chat' | 'mission';

export default function EditorLayout({ missionMode, worldId, missionId, stageId }: EditorLayoutProps) {
  const navigate = useNavigate();
  const [showMission, setShowMission] = useState(!!missionMode);
  const [showChat, setShowChat] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('code');
  const [showIntro, setShowIntro] = useState(!!missionMode);
  const [timeLimitWarning, setTimeLimitWarning] = useState<string | null>(null);
  const { language } = useEditorStore();
  const { profile } = useAuthStore();

  // Session time tracking
  useEffect(() => {
    const dailyLimit = (profile as any)?.dailyTimeLimitMinutes;
    if (!dailyLimit || dailyLimit <= 0) return;

    const sessionStart = Date.now();
    const todayKey = `spark_time_${new Date().toISOString().slice(0, 10)}`;
    const previousMinutes = Number(localStorage.getItem(todayKey) || '0');

    const interval = setInterval(() => {
      const elapsedMinutes = Math.floor((Date.now() - sessionStart) / 60000);
      const totalMinutes = previousMinutes + elapsedMinutes;
      localStorage.setItem(todayKey, String(totalMinutes));

      const remaining = dailyLimit - totalMinutes;
      if (remaining <= 0) {
        setTimeLimitWarning("Time's up for today! Great coding session!");
      } else if (remaining <= 5) {
        setTimeLimitWarning(`Only ${remaining} minutes left for today`);
      } else if (remaining <= 10) {
        setTimeLimitWarning(`${remaining} minutes left for today`);
      } else {
        setTimeLimitWarning(null);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [profile]);

  // Get curriculum data for intro
  const missionData = useMemo(() => {
    if (!missionMode || !worldId || !missionId || !stageId) return null;
    const world = CURRICULUM.find((w) => w.id === worldId);
    if (!world) return null;
    const mission = world.missions.find((m) => m.id === missionId);
    if (!mission) return null;
    const stage = mission.stages.find((s) => s.id === stageId);
    if (!stage) return null;
    return { world, mission, stage };
  }, [missionMode, worldId, missionId, stageId]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const mobileTabs: { key: MobileTab; label: string; icon: string }[] = [
    { key: 'code', label: 'Code', icon: '📝' },
    { key: 'preview', label: 'Preview', icon: '👁' },
    { key: 'chat', label: 'Buddy', icon: '💬' },
    ...(missionMode ? [{ key: 'mission' as MobileTab, label: 'Mission', icon: '🎯' }] : []),
  ];

  const timeBanner = timeLimitWarning ? (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-medium"
      style={{
        backgroundColor: timeLimitWarning.includes("Time's up") ? 'rgba(220, 38, 38, 0.1)' : 'rgba(217, 119, 6, 0.1)',
        color: timeLimitWarning.includes("Time's up") ? 'var(--neon-coral)' : 'var(--neon-amber)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <span>⏰</span>
      <span>{timeLimitWarning}</span>
      {timeLimitWarning.includes("Time's up") && (
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="ml-2 px-2 py-0.5 rounded text-xs cursor-pointer"
          style={{ backgroundColor: 'var(--neon-coral)', color: '#ffffff', border: 'none' }}
          whileHover={{ scale: 1.05 }}
        >
          Go Home
        </motion.button>
      )}
    </motion.div>
  ) : null;

  // Mission intro overlay
  if (showIntro && missionData) {
    return (
      <AnimatePresence>
        <MissionIntro
          worldName={missionData.world.name}
          worldIcon={missionData.world.icon}
          worldColor={missionData.world.color || '#0891B2'}
          missionTitle={missionData.mission.title}
          questBrief={missionData.mission.questBrief}
          stageTitle={missionData.stage.title}
          stageBrief={missionData.stage.brief}
          stageNumber={missionData.stage.id}
          xpReward={missionData.stage.xpReward}
          onStart={() => setShowIntro(false)}
        />
      </AnimatePresence>
    );
  }

  // Mobile layout: stacked panels with tab switcher
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-void)' }}>
        <EditorToolbar
          onToggleMission={() => setMobileTab(mobileTab === 'mission' ? 'code' : 'mission')}
          onToggleChat={() => setMobileTab(mobileTab === 'chat' ? 'code' : 'chat')}
          showMission={mobileTab === 'mission'}
          showChat={mobileTab === 'chat'}
        />
        {timeBanner}

        {/* Mobile Tab Bar */}
        <div
          className="flex items-center gap-1 px-2 py-1.5 overflow-x-auto no-scrollbar"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          {mobileTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setMobileTab(tab.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              style={{
                backgroundColor: mobileTab === tab.key ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
                color: mobileTab === tab.key ? 'var(--neon-cyan)' : 'var(--text-muted)',
                border: mobileTab === tab.key ? '1px solid var(--border-glow-cyan)' : '1px solid transparent',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Active Panel */}
        <div className="flex-1 overflow-hidden">
          {mobileTab === 'code' && <CodePanel />}
          {mobileTab === 'preview' && (
            language === 'python' ? (
              <div className="h-full p-4" style={{ backgroundColor: 'var(--bg-void)', color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>
                <p>Python Terminal Ready</p>
              </div>
            ) : (
              <PreviewPanel />
            )
          )}
          {mobileTab === 'chat' && <SparkChatPanel />}
          {mobileTab === 'mission' && missionMode && (
            <MissionSidebar worldId={worldId!} missionId={missionId!} stageId={stageId!} />
          )}
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-void)' }}>
      {/* Toolbar */}
      <EditorToolbar
        onToggleMission={() => setShowMission(!showMission)}
        onToggleChat={() => setShowChat(!showChat)}
        showMission={showMission}
        showChat={showChat}
      />
      {timeBanner}

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Panel */}
        <motion.div
          className="flex-1 min-w-0"
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <CodePanel />
        </motion.div>

        {/* Preview / Terminal Panel */}
        <motion.div
          className="flex-1 min-w-0"
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ borderLeft: '1px solid var(--border-subtle)' }}
        >
          {language === 'python' ? (
            <div className="h-full flex flex-col">
              <div className="flex-1">
                <div className="h-full p-4" style={{ backgroundColor: 'var(--bg-void)', color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>
                  <p>Python Terminal Ready</p>
                </div>
              </div>
            </div>
          ) : (
            <PreviewPanel />
          )}
        </motion.div>

        {/* Mission Sidebar */}
        <AnimatePresence>
          {showMission && missionMode && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="overflow-hidden"
              style={{ borderLeft: '1px solid var(--border-subtle)' }}
            >
              <MissionSidebar
                worldId={worldId!}
                missionId={missionId!}
                stageId={stageId!}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat Panel at Bottom */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 200 }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <SparkChatPanel />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
