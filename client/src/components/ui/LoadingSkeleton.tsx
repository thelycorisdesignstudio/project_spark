type SkeletonVariant = 'text' | 'card' | 'avatar' | 'bar';

interface LoadingSkeletonProps {
  className?: string;
  variant?: SkeletonVariant;
}

const variantStyles: Record<
  SkeletonVariant,
  { width: string; height: string; borderRadius: string }
> = {
  text: { width: '100%', height: '14px', borderRadius: '6px' },
  card: { width: '100%', height: '140px', borderRadius: '16px' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%' },
  bar: { width: '100%', height: '8px', borderRadius: '4px' },
};

export default function LoadingSkeleton({
  className = '',
  variant = 'text',
}: LoadingSkeletonProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width: styles.width,
        height: styles.height,
        borderRadius: styles.borderRadius,
        backgroundColor: 'var(--bg-surface-2)',
        backgroundImage:
          'linear-gradient(90deg, var(--bg-surface-2) 25%, var(--bg-surface) 50%, var(--bg-surface-2) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s ease-in-out infinite',
      }}
    >
      <style>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
