import { useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { useEditorStore } from '../../store/editorStore';
import FileTabBar from './FileTabBar';

const SPARK_THEME = {
  base: 'vs' as const,
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '0891B2', fontStyle: 'bold' },
    { token: 'string', foreground: '059669' },
    { token: 'number', foreground: 'B45309' },
    { token: 'comment', foreground: '94A3B8', fontStyle: 'italic' },
    { token: 'type', foreground: '7C3AED' },
    { token: 'function', foreground: '2563EB' },
    { token: 'variable', foreground: '1E293B' },
    { token: 'operator', foreground: 'DB2777' },
    { token: 'tag', foreground: '7C3AED' },
    { token: 'attribute.name', foreground: '0891B2' },
    { token: 'attribute.value', foreground: '059669' },
  ],
  colors: {
    'editor.background': '#FFFFFF',
    'editor.foreground': '#1E293B',
    'editorLineNumber.foreground': '#CBD5E1',
    'editorLineNumber.activeForeground': '#0891B2',
    'editor.selectionBackground': '#0891B222',
    'editor.lineHighlightBackground': '#F1F5F9',
    'editorCursor.foreground': '#0891B2',
    'editorGutter.background': '#FAFBFE',
    'scrollbarSlider.background': '#E2E8F0',
    'scrollbarSlider.hoverBackground': '#CBD5E1',
  },
};

const LANGUAGE_MAP: Record<string, string> = {
  html: 'html',
  css: 'css',
  js: 'javascript',
  python: 'python',
};

export default function CodePanel() {
  const { files, activeTab, updateFile } = useEditorStore();

  const handleMount = useCallback((_editor: any, monaco: any) => {
    monaco.editor.defineTheme('spark-light', SPARK_THEME);
    monaco.editor.setTheme('spark-light');
  }, []);

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        updateFile(activeTab, value);
      }
    },
    [activeTab, updateFile]
  );

  const currentContent = files[activeTab] || '';
  const language = LANGUAGE_MAP[activeTab] || 'plaintext';

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--bg-void)' }}>
      <FileTabBar />

      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={currentContent}
          onChange={handleChange}
          onMount={handleMount}
          theme="spark-light"
          options={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15,
            lineHeight: 1.8,
            wordWrap: 'on',
            minimap: { enabled: false },
            smoothScrolling: true,
            cursorBlinking: 'expand',
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            formatOnPaste: true,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            contextmenu: false,
          }}
        />
      </div>

      {/* Status Bar */}
      <motion.div
        className="flex items-center justify-between px-4 py-1 text-xs"
        style={{
          backgroundColor: 'var(--bg-surface)',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <span>
          {currentContent.split('\n').length} lines
        </span>
        <span>
          {currentContent.length} chars
        </span>
      </motion.div>
    </div>
  );
}
