import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

/**
 * Button - Premium interactive button with multiple variants
 * ARCHITECTURE-v2 §2, §6: Uses locked design tokens, spring physics easing
 */
export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  /** Button variant - maps to locked color tokens */
  variant?: 'brass' | 'ember' | 'mystery' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Show as loading state */
  loading?: boolean;
  /** Button content */
  children: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Left icon */
  leftIcon?: ReactNode;
  /** Right icon */
  rightIcon?: ReactNode;
}

const variantStyles = {
  brass: {
    background: 'var(--interactive-default)',
    color: 'var(--text-inverse)',
    border: '1px solid var(--border-default)',
    hoverBackground: 'var(--interactive-hover)',
    hoverBorder: 'var(--border-strong)',
    activeBackground: 'var(--interactive-active)',
    glow: 'var(--glow-brass)',
  },
  ember: {
    background: 'var(--glow-ember)',
    color: 'var(--text-inverse)',
    border: 'none',
    hoverBackground: 'var(--ember-400)',
    hoverBorder: 'var(--glow-ember)',
    activeBackground: 'var(--ember-500)',
    glow: 'var(--glow-ember)',
  },
  mystery: {
    background: 'transparent',
    color: 'var(--text-mystery)',
    border: '1px solid var(--interactive-mystery)',
    hoverBackground: 'var(--mystery-500 / 0.1)',
    hoverBorder: 'var(--interactive-mystery)',
    activeBackground: 'var(--mystery-500 / 0.2)',
    glow: 'var(--glow-mystery)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-subtle)',
    hoverBackground: 'var(--bg-input)',
    hoverBorder: 'var(--border-default)',
    activeBackground: 'var(--bg-card)',
    glow: 'none',
  },
};

const sizeStyles = {
  sm: { padding: '8px 16px', fontSize: '0.875rem', gap: '8px' },
  md: { padding: '12px 24px', fontSize: '1rem', gap: '10px' },
  lg: { padding: '16px 32px', fontSize: '1.125rem', gap: '12px' },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'brass',
      size = 'md',
      loading = false,
      children,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      className = '',
      style = {},
      whileHover,
      whileTap,
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant];
    const sizes = sizeStyles[size];

    const baseStyle = {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-caption)',
      fontWeight: 500,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      borderRadius: '4px',
      cursor: disabled || loading ? 'not-allowed' : 'pointer',
      opacity: disabled || loading ? 0.6 : 1,
      width: fullWidth ? '100%' : 'auto',
      transition: 'all var(--duration-fast) var(--ease-smooth)',
      boxShadow: 'var(--shadow-1)',
      backgroundColor: styles.background,
      color: styles.color,
      border: styles.border,
      padding: sizes.padding,
      fontSize: sizes.fontSize,
      gap: sizes.gap,
      ...style,
    };

    return (
      <motion.button
        ref={ref}
        style={baseStyle as any}
        className={className}
        disabled={disabled || loading}
        whileHover={disabled || loading ? undefined : {
          backgroundColor: styles.hoverBackground,
          borderColor: styles.hoverBorder,
          boxShadow: styles.glow !== 'none' ? `0 0 20px -4px ${styles.glow}, 0 0 40px -8px ${styles.glow}80` : 'var(--shadow-2)',
          scale: 1.02,
        }}
        whileTap={disabled || loading ? undefined : { scale: 0.98 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        {...props}
      >
        {loading && (
          <motion.span
            className="button-spinner"
            style={{
              position: 'absolute',
              width: '18px',
              height: '18px',
              border: '2px solid currentColor',
              borderRightColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            aria-hidden="true"
          />
        )}
        <span style={{ display: 'flex', alignItems: 'center', gap: sizes.gap, opacity: loading ? 0 : 1 }}>
          {leftIcon && !loading && <span style={{ display: 'flex' }}>{leftIcon}</span>}
          <span style={{ whiteSpace: 'nowrap' }}>{children}</span>
          {rightIcon && !loading && <span style={{ display: 'flex' }}>{rightIcon}</span>}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;