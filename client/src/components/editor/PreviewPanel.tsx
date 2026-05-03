import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../store/editorStore';
import { buildPreviewDocument } from '../../algorithms/previewBuilder';

interface PreviewError {
  message: string;
  lineno: number;
}

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<DeviceMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '375px',
};

export default function PreviewPanel() {
  const { files, previewKey } = useEditorStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewError, setPreviewError] = useState<PreviewError | null>(null);
  const [debouncedFiles, setDebouncedFiles] = useState(files);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounce preview updates: 600ms after last keystroke
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedFiles({ ...files });
      setPreviewError(null);
    }, 600);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [files.html, files.css, files.js]);

  // Also update immediately on manual Run (previewKey change)
  useEffect(() => {
    setDebouncedFiles({ ...files });
    setPreviewError(null);
  }, [previewKey]);

  // Listen for errors from sandboxed iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'SPARK_ERROR') {
        setPreviewError({
          message: e.data.payload?.message || 'Something went wrong',
          lineno: e.data.payload?.lineno || 0,
        });
      }
      if (e.data?.type === 'SPARK_LOAD_SUCCESS') {
        setPreviewError(null);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // ESC to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen]);

  const srcdoc = useMemo(() => {
    return buildPreviewDocument(
      debouncedFiles.html || '',
      debouncedFiles.css || '',
      debouncedFiles.js || ''
    );
  }, [debouncedFiles.html, debouncedFiles.css, debouncedFiles.js, previewKey]);

  const panelStyle = isFullscreen
    ? { position: 'fixed' as const, inset: 0, zIndex: 100 }
    : { height: '100%' };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-surface)' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-1.5"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Preview {previewError ? '⚠️' : ''}
        </span>
        <div className="flex items-center gap-2">
          {/* Device Preview Toggle */}
          <div className="flex items-center gap-0.5 px-1 py-0.5 rounded-lg" style={{ backgroundColor: 'var(--bg-surface-2)' }}>
            {([
              { mode: 'desktop' as DeviceMode, icon: '🖥', title: 'Desktop' },
              { mode: 'tablet' as DeviceMode, icon: '📱', title: 'Tablet (768px)' },
              { mode: 'mobile' as DeviceMode, icon: '📲', title: 'Mobile (375px)' },
            ]).map(({ mode, icon, title }) => (
              <motion.button
                key={mode}
                onClick={() => setDeviceMode(mode)}
                className="px-1.5 py-0.5 rounded text-xs cursor-pointer"
                style={{
                  color: deviceMode === mode ? 'var(--neon-cyan)' : 'var(--text-muted)',
                  backgroundColor: deviceMode === mode ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title={title}
              >
                {icon}
              </motion.button>
            ))}
          </div>

          <motion.button
            onClick={() => {
              // Open preview in new window for screenshot/printing
              const w = window.open('', '_blank');
              if (w) {
                w.document.write(srcdoc);
                w.document.close();
              }
            }}
            className="px-2 py-0.5 rounded text-xs cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Open in new window"
          >
            📸 Share
          </motion.button>

          <motion.button
            onClick={() => {
              setPreviewError(null);
              useEditorStore.getState().refreshPreview();
            }}
            className="px-2 py-0.5 rounded text-xs cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            🔄 Refresh
          </motion.button>
          <motion.button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="px-2 py-0.5 rounded text-xs cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isFullscreen ? '⊟ Exit' : '⊞ Fullscreen'}
          </motion.button>
        </div>
      </div>

      {/* iframe */}
      <div className="flex-1 relative flex justify-center" style={panelStyle}>
        <iframe
          key={previewKey}
          srcDoc={srcdoc}
          sandbox="allow-scripts"
          className="h-full border-0"
          style={{
            width: DEVICE_WIDTHS[deviceMode],
            maxWidth: '100%',
            backgroundColor: '#ffffff',
            borderRadius: isFullscreen ? 0 : undefined,
            border: deviceMode !== 'desktop' ? '2px solid var(--border-subtle)' : undefined,
            transition: 'width 0.3s ease',
          }}
          title="Code Preview"
        />
        {isFullscreen && (
          <motion.button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-lg text-sm font-medium z-10"
            style={{
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--neon-coral)',
              border: '1px solid var(--border-subtle)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Press ESC or click to exit
          </motion.button>
        )}

        {/* Error Overlay */}
        <AnimatePresence>
          {previewError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 left-4 right-4 p-3 rounded-xl z-10"
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">😟</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold mb-0.5" style={{ color: 'var(--neon-coral)' }}>
                    Oops! Something went wrong
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {previewError.message}
                    {previewError.lineno > 0 && ` (line ${previewError.lineno})`}
                  </p>
                </div>
                <motion.button
                  onClick={() => setPreviewError(null)}
                  className="text-xs px-2 py-0.5 rounded cursor-pointer flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                  whileHover={{ scale: 1.1 }}
                >
                  ✕
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
