import { motion } from 'framer-motion';
import { type ReactNode, type HTMLAttributes } from 'react';

/**
 * Typography Components - Using locked font families and scales
 * ARCHITECTURE-v2 §3: Cinzel Decorative, Cinzel, IM Fell English SC, Crimson Pro, IBM Plex Sans, JetBrains Mono
 */

/**
 * Display - Large titles (Cinzel Decorative)
 */
export interface DisplayProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'as' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  children: ReactNode;
  level?: 1 | 2 | 3;
  weight?: 400 | 700 | 900;
}

export function Display({ children, level = 1, weight = 700, className = '', style = {}, ...props }: DisplayProps) {
  return (
    <motion.h1
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: weight,
        fontSize: 'clamp(2.5rem, 5vw + 1rem, 5rem)',
        lineHeight: 1.1,
        letterSpacing: '0.04em',
        color: 'var(--text-primary)',
        margin: 0,
        ...style,
      } as any}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
      {...props as any}
    >
      {children}
    </motion.h1>
  );
}

/**
 * Heading - Section headings (Cinzel)
 */
export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'as' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4;
  weight?: 400 | 600 | 700;
}

export function Heading({ children, level = 2, weight = 600, className = '', style = {}, ...props }: HeadingProps) {
  return (
    <motion.h2
      style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: weight,
        fontSize: 'clamp(1.75rem, 3vw + 0.5rem, 3rem)',
        lineHeight: 1.2,
        letterSpacing: '0.02em',
        color: 'var(--text-primary)',
        margin: 0,
        ...style,
      } as any}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      {...props as any}
    >
      {children}
    </motion.h2>
  );
}

/**
 * Subheading / Eyebrow - Small uppercase labels (IM Fell English SC)
 */
export interface SubheadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  children: ReactNode;
  /** Accent color */
  accent?: 'brass' | 'mystery' | 'teal' | 'ember';
}

export function Subheading({ children, accent = 'brass', className = '', style = {}, ...props }: SubheadingProps) {
  const accentColors = {
    brass: 'var(--text-accent)',
    mystery: 'var(--text-mystery)',
    teal: 'var(--text-teal)',
    ember: 'var(--glow-ember)',
  };

  return (
    <motion.div
      style={{
        fontFamily: 'var(--font-eyebrow)',
        fontSize: 'clamp(0.75rem, 1vw + 0.5rem, 1rem)',
        lineHeight: 1.5,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: accentColors[accent],
        margin: 0,
        ...style,
      }}
      className={className}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props as any}
    >
      {children}
    </motion.div>
  );
}

/**
 * Body - Main text content (Crimson Pro)
 */
export interface BodyProps extends Omit<HTMLAttributes<HTMLParagraphElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  weight?: 400 | 500 | 600 | 700;
  muted?: boolean;
  lead?: boolean;
}

export function Body({ children, size = 'md', weight = 400, muted = false, lead = false, className = '', style = {}, ...props }: BodyProps) {
  const sizes = {
    sm: '0.875rem',
    md: 'clamp(1rem, 0.5vw + 0.875rem, 1.125rem)',
    lg: 'clamp(1.125rem, 0.75vw + 1rem, 1.25rem)',
  };

  return (
    <motion.p
      style={{
        fontFamily: 'var(--font-body)',
        fontWeight: weight,
        fontSize: sizes[size],
        lineHeight: 1.7,
        color: muted ? 'var(--text-muted)' : 'var(--text-primary)',
        margin: 0,
        maxWidth: lead ? '65ch' : undefined,
        ...style,
      }}
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...props as any}
    >
      {children}
    </motion.p>
  );
}

/**
 * Caption / Label - Small UI text (IBM Plex Sans)
 */
export interface CaptionProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  children: ReactNode;
  weight?: 400 | 500 | 600;
  uppercase?: boolean;
}

export function Caption({ children, weight = 400, uppercase = true, className = '', style = {}, ...props }: CaptionProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-caption)',
        fontWeight: weight,
        fontSize: '0.75rem',
        lineHeight: 1.5,
        letterSpacing: uppercase ? '0.05em' : 'normal',
        textTransform: uppercase ? 'uppercase' : 'none',
        color: 'var(--text-secondary)',
        ...style,
      }}
      className={className}
      {...props}
    >
      {children}
    </span>
  );
}

/**
 * Code - Monospace code text (JetBrains Mono)
 */
export interface CodeProps extends Omit<HTMLAttributes<HTMLElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  children: ReactNode;
  inline?: boolean;
}

export function Code({ children, inline = true, className = '', style = {}, ...props }: CodeProps) {
  if (inline) {
    return (
      <code
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.875em',
          color: 'var(--text-accent)',
          backgroundColor: 'var(--bg-input)',
          padding: '0.15em 0.4em',
          borderRadius: '4px',
          ...style,
        }}
        className={className}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <pre
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.875rem',
        lineHeight: 1.6,
        color: 'var(--text-primary)',
        backgroundColor: 'var(--void-900)',
        padding: 'var(--space-5)',
        borderRadius: '8px',
        overflowX: 'auto',
        border: '1px solid var(--border-subtle)',
        ...style,
      }}
      className={className}
      {...props}
    >
      <code style={{ color: 'inherit' }}>{children}</code>
    </pre>
  );
}

/**
 * Blockquote - Styled quotation
 */
export interface BlockquoteProps extends Omit<HTMLAttributes<HTMLQuoteElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
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

/**
 * Text Reveal - Animated text reveal by word/character
 */
export interface TextRevealProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onTransitionEnd'> {
  children: ReactNode;
  /** Reveal by: 'word' | 'char' | 'line' */
  split?: 'word' | 'char' | 'line';
  /** Delay between each split */
  stagger?: number;
}

export function TextReveal({ children, split = 'word', stagger = 0.05, className = '', style = {}, ...props }: TextRevealProps) {
  const text = typeof children === 'string' ? children : String(children);
  const parts = split === 'char' ? text.split('') : split === 'word' ? text.split(' ') : [text];
  const separator = split === 'char' ? '' : split === 'word' ? ' ' : '';

  return (
    <div
      style={{
        display: 'inline-flex',
        flexWrap: split === 'word' ? 'wrap' : 'nowrap',
        ...style,
      }}
      className={className}
      {...props}
    >
      {parts.map((part, i) => (
        <motion.span
          key={i}
          style={{ display: 'inline-block', whiteSpace: 'pre-wrap' }}
          initial={{ opacity: 0, y: 10, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1], delay: i * stagger }}
        >
          {part}{separator}
        </motion.span>
      ))}
    </div>
  );
}

export default Display;