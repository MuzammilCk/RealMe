import { motion, AnimatePresence } from 'framer-motion';
import { forwardRef, useState, useEffect, useCallback, type ReactNode, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { IconButton } from './IconButton';

/**
 * Modal - Sliding panel with backdrop blur, brass trim
 * ARCHITECTURE-v2 §2, §6: Staggered children entrance
 */
export interface ModalProps {
  /** Modal open state */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Show close button */
  showClose?: boolean;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Custom className */
  className?: string;
}

const sizeStyles = {
  sm: '400px',
  md: '560px',
  lg: '720px',
  xl: '900px',
  full: 'calc(100vw - 48px)',
};

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      title,
      children,
      size = 'md',
      showClose = true,
      closeOnBackdrop = true,
      className = '',
      style = {},
      ...props
    },
    ref
  ) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      if (open) {
        setMounted(true);
        document.body.style.overflow = 'hidden';
      } else {
        const timer = setTimeout(() => setMounted(false), 300);
        return () => clearTimeout(timer);
      }
      return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!mounted && !open) return null;

    return createPortal(
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 999,
                pointerEvents: closeOnBackdrop ? 'auto' : 'none',
              }}
              onClick={closeOnBackdrop ? onClose : undefined}
              aria-hidden="true"
            />

            {/* Modal */}
            <motion.div
              ref={ref}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: sizeStyles[size],
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: '85vh',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-4)',
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                ...style,
              }}
              className={className}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
              {...props}
            >
              {/* Header */}
              {(title || showClose) && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-5) var(--space-6)',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  {title && (
                    <motion.h2
                      id="modal-title"
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                        color: 'var(--text-primary)',
                        margin: 0,
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {title}
                    </motion.h2>
                  )}
                  {showClose && (
                    <IconButton
                      variant="ghost"
                      size="sm"
                      aria-label="Close modal"
                      onClick={onClose}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </IconButton>
                  )}
                </div>
              )}

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  overflow: 'auto',
                  padding: 'var(--space-6)',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                >
                  {children}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
    );
  }
);

Modal.displayName = 'Modal';

/**
 * Confirmation Modal - Pre-built modal for confirmations
 */
export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'warning';
  loading?: boolean;
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  loading = false,
}: ConfirmModalProps) {
  const variantStyles = {
    danger: { color: 'var(--glow-teal)', bg: 'rgba(42, 168, 158, 0.1)' },
    primary: { color: 'var(--interactive-default)', bg: 'rgba(201, 161, 92, 0.1)' },
    warning: { color: 'var(--glow-brass)', bg: 'rgba(201, 161, 92, 0.1)' },
  };

  const colors = variantStyles[variant];

  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>
        {message}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
        <Button variant="ghost" size="md" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button
          variant={variant === 'danger' ? 'ember' : 'brass'}
          size="md"
          onClick={onConfirm}
          loading={loading}
          disabled={loading}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default Modal;