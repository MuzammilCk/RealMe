import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

/**
 * Badge - Small status indicator
 * ARCHITECTURE-v2 §2: Brass/ember/mystery/teal variants
 */
export interface BadgeProps {
  children: ReactNode;
  variant?: 'brass' | 'ember' | 'mystery' | 'teal' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export function Badge({ children, variant = 'brass', size = 'md', dot = false }: BadgeProps) {
  const variants = {
    brass: { bg: 'var(--interactive-default)', color: 'var(--text-inverse)', border: 'none' },
    ember: { bg: 'var(--glow-ember)', color: 'var(--text-inverse)', border: 'none' },
    mystery: { bg: 'transparent', color: 'var(--text-mystery)', border: '1px solid var(--interactive-mystery)' },
    teal: { bg: 'transparent', color: 'var(--text-teal)', border: '1px solid var(--glow-teal)' },
    ghost: { bg: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' },
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '0.625rem', gap: '4px' },
    md: { padding: '4px 10px', fontSize: '0.75rem', gap: '6px' },
    lg: { padding: '6px 12px', fontSize: '0.875rem', gap: '8px' },
  };

  const v = variants[variant];
  const s = sizes[size];

  return (
    <motion.span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-caption)',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        borderRadius: '9999px',
        backgroundColor: v.bg,
        color: v.color,
        border: v.border,
        padding: s.padding,
        fontSize: s.fontSize,
        gap: s.gap,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {dot && (
        <motion.span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor',
            opacity: 0.8,
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      {children}
    </motion.span>
  );
}

export default Badge;