import { motion } from 'framer-motion';
import { useEditorStore } from '../../store/editorStore';

const HTML_TABS = [
  { key: 'html' as const, label: 'HTML', icon: '📄' },
  { key: 'css' as const, label: 'CSS', icon: '🎨' },
  { key: 'js' as const, label: 'JS', icon: '⚡' },
];

const PYTHON_TABS = [
  { key: 'python' as const, label: 'Python', icon: '🐍' },
];

export default function FileTabBar() {
  const { language, activeTab, setActiveTab, isDirty, files } = useEditorStore();
  const tabs = language === 'python' ? PYTHON_TABS : HTML_TABS;

  return (
    <div
      className="flex items-center gap-1 px-2 py-1"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        const hasContent = (files[tab.key] || '').length > 0;
        return (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="relative px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: isActive ? 'rgba(8, 145, 178, 0.1)' : 'transparent',
              color: isActive ? 'var(--neon-cyan)' : 'var(--text-muted)',
              border: isActive ? '1px solid var(--border-glow-cyan)' : '1px solid transparent',
              boxShadow: isActive ? '0 0 12px rgba(8, 145, 178, 0.15)' : 'none',
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
            {isDirty && hasContent && (
              <span
                className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--neon-amber)' }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
