import { motion, HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode, type HTMLAttributes } from 'react';

/**
 * Panel - Sliding/drawer panel with brass trim and backdrop blur
 * ARCHITECTURE-v2 §2, §6: Staggered entrance, premium motion
 */
export interface PanelProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Panel open state */
  open: boolean;
  /** Panel position */
  side?: 'left' | 'right' | 'top' | 'bottom';
  /** Panel size */
  size?: number | string;
  /** Children content */
  children: ReactNode;
  /** Close handler */
  onClose?: () => void;
  /** Show backdrop */
  backdrop?: boolean;
  /** Custom className */
  className?: string;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      open,
      side = 'right',
      size = '400px',
      children,
      onClose,
      backdrop = true,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const sideStyles = {
      left: { right: 'auto', left: 0, borderRight: '1px solid var(--border-default)', borderLeft: 'none' },
      right: { left: 'auto', right: 0, borderLeft: '1px solid var(--border-default)', borderRight: 'none' },
      top: { bottom: 'auto', top: 0, borderBottom: '1px solid var(--border-default)', borderTop: 'none' },
      bottom: { top: 'auto', bottom: 0, borderTop: '1px solid var(--border-default)', borderBottom: 'none' },
    };

    const baseStyle = {
      position: 'fixed',
      top: side === 'top' ? 0 : side === 'bottom' ? 'auto' : 0,
      bottom: side === 'bottom' ? 0 : side === 'top' ? 'auto' : 0,
      width: side === 'left' || side === 'right' ? size : '100%',
      height: side === 'top' || side === 'bottom' ? size : '100%',
      maxWidth: side === 'left' || side === 'right' ? '100vw' : undefined,
      maxHeight: side === 'top' || side === 'bottom' ? '100vh' : undefined,
      backgroundColor: 'var(--bg-card)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-4)',
      ...sideStyles[side],
      ...style,
    };

    const initialX = side === 'left' ? -100 : side === 'right' ? 100 : 0;
    const initialY = side === 'top' ? -100 : side === 'bottom' ? 100 : 0;

    return (
      <>
        {backdrop && open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 99,
            }}
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        <motion.div
          ref={ref}
          style={baseStyle}
          className={className}
          initial={{ opacity: 0, x: initialX, y: initialY }}
          animate={open ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: initialX, y: initialY }}
          exit={{ opacity: 0, x: initialX, y: initialY }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
            duration: 0.5,
          }}
          role="dialog"
          aria-modal="true"
          {...props}
        >
          <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
            {onClose && (
              <motion.button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                whileHover={{ color: 'var(--text-primary)', backgroundColor: 'var(--bg-input)' }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close panel"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </motion.button>
            )}
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 'var(--space-5)' }}>
            {children}
          </div>
        </motion.div>
      </>
    );
  }
);

Panel.displayName = 'Panel';

export default Panel;