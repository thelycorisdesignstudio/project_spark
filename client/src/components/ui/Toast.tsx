import {
  createContext,
  useContext,
  useCallback,
  useState,
  type ReactNode,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  addToast: (type: ToastType, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const toastConfig: Record<
  ToastType,
  { color: string; bg: string; border: string; Icon: typeof CheckCircle }
> = {
  success: {
    color: 'var(--neon-green)',
    bg: 'rgba(5, 150, 105, 0.1)',
    border: 'rgba(5, 150, 105, 0.25)',
    Icon: CheckCircle,
  },
  error: {
    color: 'var(--neon-red)',
    bg: 'rgba(220, 38, 38, 0.1)',
    border: 'rgba(220, 38, 38, 0.25)',
    Icon: XCircle,
  },
  info: {
    color: 'var(--neon-cyan)',
    bg: 'rgba(8, 145, 178, 0.1)',
    border: 'rgba(8, 145, 178, 0.25)',
    Icon: Info,
  },
  warning: {
    color: 'var(--neon-amber)',
    bg: 'rgba(217, 119, 6, 0.1)',
    border: 'rgba(217, 119, 6, 0.25)',
    Icon: AlertTriangle,
  },
};

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = `toast-${++toastCounter}`;
      setToasts((prev) => [...prev, { id, type, message }]);

      // Auto-dismiss after 3 seconds
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      {/* Toast container - top right */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          right: '16px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const { Icon } = config;

            return (
              <motion.div
                key={toast.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{
                  backgroundColor: config.bg,
                  border: `1px solid ${config.border}`,
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: 'var(--shadow-card)',
                  minWidth: '280px',
                  maxWidth: '400px',
                  pointerEvents: 'auto',
                }}
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <Icon size={18} style={{ color: config.color, flexShrink: 0 }} />
                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {toast.message}
                </span>
                <motion.button
                  className="flex items-center justify-center w-6 h-6 rounded-md cursor-pointer"
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                  }}
                  onClick={() => removeToast(toast.id)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={14} />
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
