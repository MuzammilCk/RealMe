import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

/**
 * Card - Elevated container with leather/brass border variants
 * ARCHITECTURE-v2 §2, §5: Uses elevation tokens, locked color palette
 */
export interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Elevation level (1-4) */
  elevation?: 1 | 2 | 3 | 4;
  /** Border variant */
  border?: 'leather' | 'brass' | 'glow' | 'none';
  /** Hover lift effect */
  hoverLift?: boolean;
  /** Children content */
  children: ReactNode;
  /** Padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Click handler makes it interactive */
  onClick?: () => void;
}

const elevationShadows = {
  1: 'var(--shadow-1)',
  2: 'var(--shadow-2)',
  3: 'var(--shadow-3)',
  4: 'var(--shadow-4)',
};

const borderStyles = {
  leather: '1px solid var(--border-subtle)',
  brass: '1px solid var(--border-default)',
  glow: '1px solid var(--border-glow)',
  none: 'none',
};

const paddingStyles = {
  none: '0',
  sm: 'var(--space-3)',
  md: 'var(--space-5)',
  lg: 'var(--space-7)',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      elevation = 1,
      border = 'leather',
      hoverLift = true,
      children,
      padding = 'md',
      onClick,
      className = '',
      style = {},
      whileHover,
      ...props
    },
    ref
  ) => {
    const isInteractive = !!onClick;

    const baseStyle = {
      position: 'relative',
      backgroundColor: 'var(--bg-card)',
      borderRadius: '8px',
      boxShadow: elevationShadows[elevation],
      border: borderStyles[border],
      padding: paddingStyles[padding],
      transition: 'all var(--duration-base) var(--ease-smooth)',
      cursor: isInteractive ? 'pointer' : 'default',
      ...style,
    };

    return (
      <motion.div
        ref={ref}
        style={baseStyle}
        className={className}
        onClick={onClick}
        whileHover={hoverLift && !isInteractive ? {
          y: -4,
          boxShadow: elevationShadows[Math.min(elevation + 1, 4)],
          borderColor: border === 'brass' ? 'var(--border-strong)' : border === 'glow' ? 'var(--border-glow)' : undefined,
        } : undefined}
        whileTap={isInteractive ? { scale: 0.99 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;