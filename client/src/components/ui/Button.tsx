import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; borderRadius: string }> = {
  sm: { padding: '6px 14px', fontSize: '0.8rem', borderRadius: '8px' },
  md: { padding: '10px 20px', fontSize: '0.875rem', borderRadius: '12px' },
  lg: { padding: '14px 28px', fontSize: '1rem', borderRadius: '14px' },
};

function getVariantStyles(variant: ButtonVariant): Record<string, string> {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: 'var(--neon-cyan)',
        color: '#ffffff',
        border: 'none',
        boxShadow: 'var(--shadow-cyan)',
      };
    case 'secondary':
      return {
        backgroundColor: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'none',
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid transparent',
        boxShadow: 'none',
      };
    case 'danger':
      return {
        backgroundColor: 'var(--neon-red)',
        color: '#ffffff',
        border: 'none',
        boxShadow: 'none',
      };
  }
}

function Spinner() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="28"
        strokeDashoffset="20"
        opacity="0.8"
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  type = 'button',
}: ButtonProps) {
  const variantStyles = getVariantStyles(variant);
  const { padding, fontSize, borderRadius } = sizeStyles[size];
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      className={`inline-flex items-center justify-center gap-2 font-semibold cursor-pointer ${className}`}
      style={{
        ...variantStyles,
        padding,
        fontSize,
        borderRadius,
        fontFamily: 'var(--font-body)',
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.2s',
      }}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      whileHover={isDisabled ? {} : { scale: 1.05 }}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
>
      {loading && <Spinner />}
      {children}
    </motion.button>
  );
}
