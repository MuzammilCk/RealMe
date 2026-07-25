import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

/**
 * Container - Main layout container with responsive widths
 * ARCHITECTURE-v2 §4: Container widths (prose, content, wide, full)
 */
export interface ContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Container width variant */
  size?: 'prose' | 'content' | 'wide' | 'full';
  /** Children */
  children: ReactNode;
  /** Custom max-width */
  maxWidth?: string;
  /** Padding */
  padding?: string;
}

const sizeWidths = {
  prose: '65ch',
  content: '72rem',  // 1152px
  wide: '90rem',     // 1440px
  full: '100%',
};

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      size = 'content',
      children,
      maxWidth,
      padding = '0 var(--space-6)',
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        style={{
          width: '100%',
          maxWidth: maxWidth || sizeWidths[size],
          margin: '0 auto',
          padding,
          boxSizing: 'border-box',
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Container.displayName = 'Container';

/**
 * Section - Page section with scroll reveal and staggered children
 * ARCHITECTURE-v2 §6, §9: Scroll reveal, staggered entrance
 */
export interface SectionProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** Section children */
  children: ReactNode;
  /** Section ID for anchor linking */
  id?: string;
  /** Background variant */
  background?: 'none' | 'vignette' | 'paper' | 'dark';
  /** Vertical padding */
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Enable scroll reveal for children */
  reveal?: boolean;
  /** Stagger delay for children */
  staggerDelay?: number;
  /** Custom className */
  className?: string;
}

const paddingYStyles = {
  none: '0',
  sm: 'var(--space-8) 0',
  md: 'var(--space-10) 0',
  lg: 'var(--space-12) 0',
  xl: 'var(--space-14) 0',
};

const backgroundStyles = {
  none: {},
  vignette: {
    position: 'relative' as const,
    '::before': {
      content: '""',
      position: 'absolute' as const,
      inset: 0,
      background: 'radial-gradient(ellipse at center, transparent 40%, var(--void-950) 100%)',
      pointerEvents: 'none' as const,
      zIndex: -1,
    },
  },
  paper: {
    backgroundColor: 'var(--parchment-300)',
  },
  dark: {
    backgroundColor: 'var(--void-900)',
  },
};

export const Section = forwardRef<HTMLSectionElement, SectionProps>(
  (
    {
      children,
      id,
      background = 'none',
      paddingY = 'lg',
      reveal = true,
      staggerDelay = 0.1,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const variants = {
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94], // ease-smooth
          staggerChildren: staggerDelay,
        },
      },
    };

    const childVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.34, 1.56, 0.64, 1], // ease-spring
        },
      },
    };

    return (
      <motion.section
        ref={ref}
        id={id}
        style={{
          padding: paddingYStyles[paddingY],
          position: 'relative',
          ...backgroundStyles[background],
          ...style,
        }}
        className={className}
        initial={reveal ? 'hidden' : undefined}
        whileInView={reveal ? 'visible' : undefined}
        viewport={{ once: true, margin: '-100px' }}
        variants={variants}
        {...props}
      >
        <motion.div
          variants={childVariants}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
        >
          {children}
        </motion.div>
      </motion.section>
    );
  }
);

Section.displayName = 'Section';

/**
 * Grid - Responsive grid layout
 */
export interface GridProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  /** Grid columns at different breakpoints */
  columns?: { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items */
  gap?: string;
  /** Column gap */
  columnGap?: string;
  /** Row gap */
  rowGap?: string;
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  (
    {
      children,
      columns = { base: 1, sm: 2, md: 3, lg: 4 },
      gap,
      columnGap = 'var(--space-6)',
      rowGap = 'var(--space-6)',
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const gridTemplateColumns = [
      `repeat(${columns.base}, 1fr)`,
      columns.sm && `@media (min-width: 640px) { grid-template-columns: repeat(${columns.sm}, 1fr); }`,
      columns.md && `@media (min-width: 768px) { grid-template-columns: repeat(${columns.md}, 1fr); }`,
      columns.lg && `@media (min-width: 1024px) { grid-template-columns: repeat(${columns.lg}, 1fr); }`,
      columns.xl && `@media (min-width: 1280px) { grid-template-columns: repeat(${columns.xl}, 1fr); }`,
    ].filter(Boolean).join(' ');

    return (
      <motion.div
        ref={ref}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.base}, 1fr)`,
          gap: gap || undefined,
          columnGap,
          rowGap,
          ...style,
        }}
        className={className}
        {...props}
      >
        <style jsx>{`
          @media (min-width: 640px) {
            .grid { grid-template-columns: repeat(${columns.sm || columns.base}, 1fr); }
          }
          @media (min-width: 768px) {
            .grid { grid-template-columns: repeat(${columns.md || columns.sm || columns.base}, 1fr); }
          }
          @media (min-width: 1024px) {
            .grid { grid-template-columns: repeat(${columns.lg || columns.md || columns.sm || columns.base}, 1fr); }
          }
          @media (min-width: 1280px) {
            .grid { grid-template-columns: repeat(${columns.xl || columns.lg || columns.md || columns.sm || columns.base}, 1fr); }
          }
        `}</style>
        {children}
      </motion.div>
    );
  }
);

Grid.displayName = 'Grid';

/**
 * Flex - Flexbox layout wrapper
 */
export interface FlexProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: ReactNode;
  /** Flex direction */
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Align items */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Gap */
  gap?: string;
  /** Wrap */
  wrap?: boolean;
  /** Flex grow */
  flex?: number | string;
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      direction = 'row',
      justify = 'start',
      align = 'stretch',
      gap = 'var(--space-4)',
      wrap = false,
      flex,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: direction,
          justifyContent: justify,
          alignItems: align,
          gap,
          flexWrap: wrap ? 'wrap' : 'nowrap',
          flex: flex ? (typeof flex === 'number' ? `1 1 ${100 / flex}%` : flex) : undefined,
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Flex.displayName = 'Flex';

export default Container;