import { motion } from 'framer-motion';
import { type CSSProperties } from 'react';

/**
 * Spinner - Loading indicator with brass/ember variants
 * ARCHITECTURE-v2 §2: GPU-accelerated rotation
 */
export interface SpinnerProps {
  /** Size in pixels */
  size?: number;
  /** Border width in pixels */
  thickness?: number;
  /** Variant color */
  variant?: 'brass' | 'ember' | 'mystery' | 'teal';
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
  /** Label for screen readers */
  label?: string;
}

export function Spinner({
  size = 24,
  thickness = 2,
  variant = 'brass',
  className = '',
  style = {},
  label = 'Loading',
}: SpinnerProps) {
  const variantColors = {
    brass: { track: 'var(--border-subtle)', active: 'var(--interactive-default)' },
    ember: { track: 'var(--border-subtle)', active: 'var(--glow-ember)' },
    mystery: { track: 'var(--border-subtle)', active: 'var(--interactive-mystery)' },
    teal: { track: 'var(--border-subtle)', active: 'var(--text-teal)' },
  };

  const colors = variantColors[variant];

  return (
    <motion.div
      className={className}
      style={{
        width: size,
        height: size,
        position: 'relative',
        ...style,
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      role="status"
      aria-label={label}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{ width: '100%', height: '100%' }}
      >
        <circle
          cx="12"
          cy="12"
          r={(size / 2) - thickness}
          strokeWidth={thickness}
          stroke={colors.track}
          strokeDasharray={`${Math.PI * (size - thickness * 2)} ${Math.PI * (size - thickness * 2)}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <path
          d={`M 12 ${thickness / 2} A ${12 - thickness / 2} ${12 - thickness / 2} 0 0 1 ${12 + (12 - thickness / 2) * Math.sin(Math.PI / 4)} ${12 + (12 - thickness / 2) * Math.cos(Math.PI / 4)}`}
          fill="none"
          stroke={colors.active}
          strokeWidth={thickness}
          strokeLinecap="round"
        />
      </svg>
    </motion.div>
  );
}

Spinner.displayName = 'Spinner';

export default Spinner;
