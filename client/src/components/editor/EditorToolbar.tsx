import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '../../store/editorStore';
import { useAuthStore } from '../../store/authStore';
import { projectService } from '../../services/project.service';
import { smartAutoSave, resetSaveHash } from '../../algorithms/autoSave';
import { buildPreviewDocument } from '../../algorithms/previewBuilder';

interface EditorToolbarProps {
  onToggleMission: () => void;
  onToggleChat: () => void;
  showMission: boolean;
  showChat: boolean;
}

export default function EditorToolbar({
  onToggleMission,
  onToggleChat,
  showMission,
  showChat,
}: EditorToolbarProps) {
  const navigate = useNavigate();
  const { projectId, projectTitle, files, isDirty, lastSavedAt, markSaved, refreshPreview } = useEditorStore();
  const { profile } = useAuthStore();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Auto-save: trigger every time files change
  useEffect(() => {
    if (!projectId || projectId === 'local' || !isDirty) return;
    smartAutoSave(files, projectId);
  }, [files, projectId, isDirty]);

  // Reset save hash when project changes
  useEffect(() => {
    resetSaveHash();
  }, [projectId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === 's') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          refreshPreview();
        } else if (e.key === 'b') {
          e.preventDefault();
          onToggleChat();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [projectId, files]);

  const handleSave = useCallback(async () => {
    if (!projectId || projectId === 'local') return;
    setSaveStatus('saving');
    try {
      await projectService.update(projectId, { files });
      markSaved();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Save failed:', err);
      setSaveStatus('error');
      // Backup to localStorage on failure
      localStorage.setItem(`spark_backup_${projectId}`, JSON.stringify({ files, timestamp: Date.now() }));
    }
  }, [projectId, files, markSaved]);

  const handleRun = useCallback(() => {
    refreshPreview();
  }, [refreshPreview]);

  const handleDownload = useCallback(() => {
    const doc = buildPreviewDocument(files.html || '', files.css || '', files.js || '');
    const blob = new Blob([doc], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectTitle.replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [files, projectTitle]);

  const getSaveLabel = () => {
    if (saveStatus === 'saving') return 'Saving...';
    if (saveStatus === 'saved') return '✓ Saved';
    if (saveStatus === 'error') return 'Save failed';
    if (lastSavedAt) {
      const seconds = Math.floor((Date.now() - lastSavedAt) / 1000);
      if (seconds < 5) return 'Saved just now';
      if (seconds < 60) return `Saved ${seconds}s ago`;
      return `Saved ${Math.floor(seconds / 60)}m ago`;
    }
    return 'Save';
  };

  return (
    <div
      className="flex items-center justify-between px-4 h-12"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-4">
        <motion.button
          onClick={() => navigate('/dashboard')}
          className="text-lg font-bold cursor-pointer"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--neon-cyan)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          SPARK
        </motion.button>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {projectTitle}
          {isDirty && (
            <span style={{ color: 'var(--neon-amber)' }}> (unsaved)</span>
          )}
        </span>
      </div>

      {/* Center: Actions */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={handleRun}
          className="px-4 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 cursor-pointer"
          style={{
            backgroundColor: 'var(--neon-cyan)',
            color: '#ffffff',
            boxShadow: 'var(--shadow-cyan)',
          }}
          whileHover={{ scale: 1.04, y: -1 }}
          whileTap={{ scale: 0.96 }}
          title="Run (Ctrl+Enter)"
        >
          <span>▶</span>
          <span>Run</span>
        </motion.button>

        <motion.button
          onClick={handleSave}
          className="px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
          style={{
            backgroundColor: saveStatus === 'saved' ? 'rgba(5, 150, 105, 0.1)' : saveStatus === 'error' ? 'rgba(220, 38, 38, 0.1)' : 'var(--bg-surface-2)',
            color: saveStatus === 'saved' ? 'var(--neon-green)' : saveStatus === 'error' ? 'var(--neon-coral)' : 'var(--text-primary)',
            border: `1px solid ${saveStatus === 'saved' ? 'rgba(5, 150, 105, 0.2)' : 'var(--border-subtle)'}`,
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          disabled={saveStatus === 'saving'}
        >
          {getSaveLabel()}
        </motion.button>

        <motion.button
          onClick={handleDownload}
          className="px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-surface-2)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          title="Download as HTML"
        >
          ⬇ Export
        </motion.button>
      </div>

      {/* Right: Toggles + XP */}
      <div className="flex items-center gap-3">
        {profile && (
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              color: 'var(--neon-amber)',
              border: '1px solid rgba(217, 119, 6, 0.2)',
            }}
          >
            <span>⚡</span>
            <span>{profile.xp} XP</span>
          </div>
        )}

        <motion.button
          onClick={onToggleMission}
          className="px-2 py-1 rounded text-xs cursor-pointer"
          style={{
            color: showMission ? 'var(--neon-violet)' : 'var(--text-muted)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          🎯 Mission
        </motion.button>

        <motion.button
          onClick={onToggleChat}
          className="px-2 py-1 rounded text-xs cursor-pointer"
          style={{
            color: showChat ? 'var(--neon-cyan)' : 'var(--text-muted)',
          }}
          whileTap={{ scale: 0.95 }}
        >
          💬 Buddy
        </motion.button>
      </div>
    </div>
  );
}
