import { motion } from 'framer-motion';
import type { ProjectFiles } from '../../types';

interface Template {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  files: ProjectFiles;
}

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Project',
    icon: '📄',
    description: 'Start from scratch',
    color: 'var(--text-muted)',
    files: { html: '', css: '', js: '', python: '' },
  },
  {
    id: 'hello',
    name: 'Hello World',
    icon: '👋',
    description: 'A simple starting page',
    color: 'var(--neon-cyan)',
    files: {
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello World</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>Welcome to my first project!</p>\n</body>\n</html>',
      css: 'body {\n  font-family: sans-serif;\n  text-align: center;\n  padding: 40px;\n  background: #f0f4fa;\n}\n\nh1 {\n  color: #0891b2;\n}\n\np {\n  color: #334155;\n}',
      js: '',
      python: '',
    },
  },
  {
    id: 'colorful',
    name: 'Colorful Page',
    icon: '🎨',
    description: 'A styled page with colors and layout',
    color: 'var(--neon-violet)',
    files: {
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>My Colorful Page</title>\n</head>\n<body>\n  <div class="container">\n    <h1>My Colorful Page</h1>\n    <p>This page has style! ✨</p>\n    <div class="card-row">\n      <div class="card card-1">Card 1</div>\n      <div class="card card-2">Card 2</div>\n      <div class="card card-3">Card 3</div>\n    </div>\n  </div>\n</body>\n</html>',
      css: 'body {\n  margin: 0;\n  font-family: sans-serif;\n  background: linear-gradient(135deg, #1e293b, #0f172a);\n  color: white;\n  min-height: 100vh;\n}\n\n.container {\n  max-width: 600px;\n  margin: 0 auto;\n  padding: 40px 20px;\n  text-align: center;\n}\n\nh1 {\n  color: #7c3aed;\n  font-size: 2em;\n}\n\n.card-row {\n  display: flex;\n  gap: 16px;\n  margin-top: 24px;\n}\n\n.card {\n  flex: 1;\n  padding: 24px;\n  border-radius: 12px;\n  font-weight: bold;\n}\n\n.card-1 { background: rgba(8, 145, 178, 0.2); border: 1px solid #0891b2; }\n.card-2 { background: rgba(124, 58, 237, 0.2); border: 1px solid #7c3aed; }\n.card-3 { background: rgba(5, 150, 105, 0.2); border: 1px solid #059669; }',
      js: '',
      python: '',
    },
  },
  {
    id: 'interactive',
    name: 'Interactive Button',
    icon: '🖱️',
    description: 'A page with JavaScript interactivity',
    color: 'var(--neon-green)',
    files: {
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Click Counter</title>\n</head>\n<body>\n  <div class="container">\n    <h1>Click Counter</h1>\n    <p>How many times can you click?</p>\n    <button id="clickBtn">Click me!</button>\n    <p id="count">Clicks: 0</p>\n  </div>\n</body>\n</html>',
      css: 'body {\n  font-family: sans-serif;\n  text-align: center;\n  padding: 40px;\n  background: #f8fafc;\n}\n\nbutton {\n  background: #0891b2;\n  color: white;\n  border: none;\n  padding: 12px 32px;\n  border-radius: 8px;\n  font-size: 18px;\n  cursor: pointer;\n  margin: 16px 0;\n}\n\nbutton:hover {\n  background: #0e7490;\n}\n\n#count {\n  font-size: 24px;\n  font-weight: bold;\n  color: #7c3aed;\n}',
      js: 'let clicks = 0;\n\nconst btn = document.getElementById("clickBtn");\nconst countDisplay = document.getElementById("count");\n\nbtn.addEventListener("click", function() {\n  clicks++;\n  countDisplay.textContent = "Clicks: " + clicks;\n});',
      python: '',
    },
  },
  {
    id: 'animation',
    name: 'CSS Animation',
    icon: '✨',
    description: 'A page with CSS animations',
    color: 'var(--neon-amber)',
    files: {
      html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Animations</title>\n</head>\n<body>\n  <div class="scene">\n    <div class="ball"></div>\n    <div class="shadow"></div>\n  </div>\n</body>\n</html>',
      css: 'body {\n  margin: 0;\n  background: #0f172a;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\n.scene {\n  text-align: center;\n}\n\n.ball {\n  width: 60px;\n  height: 60px;\n  background: linear-gradient(135deg, #0891b2, #7c3aed);\n  border-radius: 50%;\n  margin: 0 auto;\n  animation: bounce 1s ease-in-out infinite;\n}\n\n.shadow {\n  width: 60px;\n  height: 10px;\n  background: rgba(8, 145, 178, 0.3);\n  border-radius: 50%;\n  margin: 10px auto 0;\n  animation: shrink 1s ease-in-out infinite;\n}\n\n@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-80px); }\n}\n\n@keyframes shrink {\n  0%, 100% { transform: scaleX(1); opacity: 0.5; }\n  50% { transform: scaleX(0.5); opacity: 0.2; }\n}',
      js: '',
      python: '',
    },
  },
];

interface ProjectTemplateModalProps {
  onSelect: (files: ProjectFiles, title: string) => void;
}

export default function ProjectTemplateModal({ onSelect }: ProjectTemplateModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(15, 15, 35, 0.9)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-2xl w-full mx-4 p-6 rounded-2xl"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 0 60px rgba(8, 145, 178, 0.1)',
        }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          Choose a Template
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Pick a starting point for your project
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TEMPLATES.map((tpl) => (
            <motion.button
              key={tpl.id}
              onClick={() => onSelect(tpl.files, tpl.id === 'blank' ? 'Untitled Project' : tpl.name)}
              className="p-4 rounded-xl text-left cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
              }}
              whileHover={{
                scale: 1.03,
                y: -4,
                borderColor: tpl.color,
                boxShadow: `0 0 20px ${tpl.color}15`,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="text-2xl block mb-2">{tpl.icon}</span>
              <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                {tpl.name}
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {tpl.description}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
