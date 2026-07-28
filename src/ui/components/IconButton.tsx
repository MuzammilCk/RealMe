import { motion } from 'framer-motion';
import { forwardRef, type ReactNode, type ButtonHTMLAttributes } from 'react';

/**
 * IconButton - Icon-only button with brass/ember/mystery variants
 * ARCHITECTURE-v2 §2, §6: Premium motion, locked tokens
 */
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  /** Button variant */
  variant?: 'brass' | 'ember' | 'mystery' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Icon to display */
  children: ReactNode;
  /** Aria label (required for accessibility) */
  'aria-label': string;
}

const variantStyles = {
  brass: {
    background: 'transparent',
    color: 'var(--interactive-default)',
    border: '1px solid var(--border-default)',
    hoverBackground: 'var(--interactive-default)',
    hoverColor: 'var(--text-inverse)',
    activeBackground: 'var(--interactive-active)',
    glow: 'var(--glow-brass)',
  },
  ember: {
    background: 'transparent',
    color: 'var(--glow-ember)',
    border: '1px solid var(--glow-ember)',
    hoverBackground: 'var(--glow-ember)',
    hoverColor: 'var(--text-inverse)',
    activeBackground: 'var(--ember-500)',
    glow: 'var(--glow-ember)',
  },
  mystery: {
    background: 'transparent',
    color: 'var(--interactive-mystery)',
    border: '1px solid var(--interactive-mystery)',
    hoverBackground: 'var(--mystery-500 / 0.1)',
    hoverColor: 'var(--interactive-mystery)',
    activeBackground: 'var(--mystery-500 / 0.2)',
    glow: 'var(--glow-mystery)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
    hoverBackground: 'var(--bg-input)',
    hoverColor: 'var(--text-primary)',
    activeBackground: 'var(--bg-card)',
    glow: 'none',
  },
};

const sizeStyles = {
  sm: { width: '36px', height: '36px', fontSize: '14px' },
  md: { width: '44px', height: '44px', fontSize: '18px' },
  lg: { width: '52px', height: '52px', fontSize: '22px' },
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = 'brass',
      size = 'md',
      children,
      disabled,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const styles = variantStyles[variant];
    const sizes = sizeStyles[size];

    return (
      <motion.button
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: sizes.width,
          height: sizes.height,
          fontSize: sizes.fontSize,
          borderRadius: '8px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--duration-fast) var(--ease-smooth)',
          backgroundColor: styles.background,
          color: styles.color,
          border: styles.border,
          ...style,
        }}
        className={className}
        disabled={disabled}
        whileHover={disabled ? undefined : {
          backgroundColor: styles.hoverBackground,
          color: styles.hoverColor,
          boxShadow: styles.glow !== 'none' ? `0 0 20px -4px ${styles.glow}, 0 0 40px -8px ${styles.glow}80` : 'var(--shadow-2)',
          scale: 1.05,
        }}
        whileTap={disabled ? undefined : { scale: 0.95 }}
        {...props as any}
      >
        {children}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;