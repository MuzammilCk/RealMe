import { motion } from 'framer-motion';
import { type ReactNode, type HTMLAttributes } from 'react';

/**
 * Blockquote - Styled quotation
 * ARCHITECTURE-v2 §4: Typography blockquote with motion reveal
 *
 * Note: Section, Grid, and Flex components have been consolidated into Layout.tsx
 * to eliminate duplicate definitions. This file now only exports Blockquote.
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

export default Blockquote;
