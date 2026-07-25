import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

/**
 * Section - Wrapper with scroll reveal, staggered children, background vignette option
 * ARCHITECTURE-v2 §2, §6: Scroll reveal, Framer stagger
 */
export interface SectionProps extends Omit<HTMLMotionProps<'section'>, 'children'> {
  children: ReactNode;
  /** Section ID for navigation */
  id?: string;
  /** Enable scroll reveal animation */
  reveal?: boolean;
  /** Stagger delay for children (ms) */
  stagger?: number;
  /** Background vignette */
  vignette?: boolean;
  /** Full bleed (no container) */
  fullBleed?: boolean;
  /** Custom className */
  className?: string;
}

export const Section = forwardRef<HTMLSectionElement, SectionProps>(
  (
    {
      children,
      id,
      reveal = true,
      stagger = 100,
      vignette = false,
      fullBleed = false,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const containerStyle = {
      position: 'relative',
      padding: fullBleed ? 0 : 'var(--space-10) 0',
      width: fullBleed ? '100vw' : undefined,
      margin: fullBleed ? '0 calc(50% - 50vw)' : undefined,
      ...style,
    };

    return (
      <motion.section
        ref={ref}
        id={id}
        style={containerStyle}
        className={className}
        initial={reveal ? { opacity: 0, y: 40 } : undefined}
        whileInView={reveal ? { opacity: 1, y: 0 } : undefined}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        {...props}
      >
        {/* Vignette overlay */}
        {vignette && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, transparent 40%, var(--bg-scene) 100%)',
              zIndex: -1,
            }}
          />
        )}

        <motion.div
          style={{
            width: fullBleed ? '100%' : 'var(--container-content)',
            maxWidth: fullBleed ? 'none' : 'var(--container-content)',
            margin: '0 auto',
            padding: fullBleed ? 0 : '0 var(--space-6)',
          }}
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: stagger / 1000,
                  delayChildren: 0.2,
                },
              },
            }}
          >
            {React.Children.map(children, (child, index) =>
              React.isValidElement(child)
                ? React.cloneElement(child as React.ReactElement<any>, {
                    variants: {
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] } },
                    },
                    initial: 'hidden',
                    animate: 'visible',
                  })
                : child
            )}
          </motion.div>
        </motion.div>
      </motion.section>
    );
  }
);

Section.displayName = 'Section';

/**
 * Grid - Responsive grid layout
 */
export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Number of columns */
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  /** Gap between items */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Row gap */
  rowGap?: string;
  /** Column gap */
  colGap?: string;
}

export function Grid({
  children,
  columns = { base: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  rowGap,
  colGap,
  className = '',
  style = {},
  ...props
}: GridProps) {
  const gapSizes = {
    none: '0',
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-7)',
    xl: 'var(--space-9)',
  };

  const gridTemplate = typeof columns === 'object'
    ? `
      grid-template-columns: repeat(${columns.base || 1}, 1fr);
      @media (min-width: 640px) { grid-template-columns: repeat(${columns.sm || columns.base || 1}, 1fr); }
      @media (min-width: 768px) { grid-template-columns: repeat(${columns.md || columns.sm || 2}, 1fr); }
      @media (min-width: 1024px) { grid-template-columns: repeat(${columns.lg || columns.md || 3}, 1fr); }
      @media (min-width: 1280px) { grid-template-columns: repeat(${columns.xl || columns.lg || 4}, 1fr); }
    `
    : `grid-template-columns: repeat(${columns}, 1fr);`;

  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gap: gapSizes[gap],
        rowGap,
        colGap,
        ...style,
      }}
      {...props}
    >
      <style jsx>{`
        div {
          ${gridTemplate}
        }
      `}</style>
      {children}
    </div>
  );
}

/**
 * Flex - Flexible box layout
 */
export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Flex direction */
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Align items */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Gap */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Wrap */
  wrap?: boolean;
  /** Flex basis for children */
  basis?: string;
}

export function Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  gap = 'md',
  wrap = false,
  basis,
  className = '',
  style = {},
  ...props
}: FlexProps) {
  const gapSizes = {
    none: '0',
    sm: 'var(--space-3)',
    md: 'var(--space-5)',
    lg: 'var(--space-7)',
    xl: 'var(--space-9)',
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        flexWrap: wrap ? 'wrap' : 'nowrap',
        gap: gapSizes[gap],
        ...(basis && { '> *': { flex: `0 0 ${basis}` } }),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Blockquote - Styled quotation
 */
export interface BlockquoteProps extends HTMLAttributes<HTMLQuoteElement> {
  children: ReactNode;
  cite?: string;
}

export function Blockquote({ children, cite, className = '', style = {}, ...props }: BlockquoteProps) {
  return (
    <blockquote
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'clamp(1.125rem, 1.5vw + 0.875rem, 1.5rem)',
        lineHeight: 1.6,
        fontStyle: 'italic',
        color: 'var(--text-secondary)',
        borderLeft: '2px solid var(--border-default)',
        background: 'linear-gradient(90deg, var(--border-subtle) 0%, transparent 20%)',
        paddingLeft: 'var(--space-6)',
        margin: 'var(--space-8) 0',
        position: 'relative',
        ...style,
      }}
      className={className}
      {...props}
    >
      <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        {children}
      </motion.p>
      {cite && (
        <footer style={{ marginTop: 'var(--space-4)', fontSize: '0.875rem', fontStyle: 'normal', color: 'var(--text-muted)' }}>
          <cite>— {cite}</cite>
        </footer>
      )}
    </blockquote>
  );
}

export default Section;