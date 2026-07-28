import { motion } from 'framer-motion';
import { type CSSProperties } from 'react';

/**
 * Progress - Bar with ink fill and brass accent
 * ARCHITECTURE-v2 §2: Uses locked tokens, GPU-accelerated
 */
export interface ProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value */
  max?: number;
  /** Visual variant */
  variant?: 'brass' | 'ember' | 'mystery' | 'teal';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Show value label */
  showLabel?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
}

export function Progress({
  value,
  max = 100,
  variant = 'brass',
  size = 'md',
  showLabel = false,
  className = '',
  style = {},
}: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const variantColors = {
    brass: { track: 'var(--border-subtle)', fill: 'var(--interactive-default)' },
    ember: { track: 'var(--border-subtle)', fill: 'var(--glow-ember)' },
    mystery: { track: 'var(--border-subtle)', fill: 'var(--interactive-mystery)' },
    teal: { track: 'var(--border-subtle)', fill: 'var(--text-teal)' },
  };

  const sizeHeights = {
    sm: '4px',
    md: '8px',
    lg: '12px',
  };

  const colors = variantColors[variant];
  const height = sizeHeights[size];

  return (
    <div
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          height,
          backgroundColor: colors.track,
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            backgroundColor: colors.fill,
            borderRadius: '9999px',
            transformOrigin: 'left center',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: percent / 100 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            fontFamily: 'var(--font-caption)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          {Math.round(percent)}%
        </span>
      )}
    </div>
  );
}

Progress.displayName = 'Progress';

export default Progress;
