import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Button } from './Button';

/**
 * Toast - Non-blocking notification with ink fill progress
 * ARCHITECTURE-v2 §2: Toast, Progress (ink fill)
 */
export interface ToastProps {
  /** Toast message */
  message: string;
  /** Toast type */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Duration in ms (0 = persistent) */
  duration?: number;
  /** Action button */
  action?: { label: string; onClick: () => void };
  /** Close callback */
  onClose?: () => void;
}

export interface ToastState extends ToastProps {
  id: string;
}

const toastColors = {
  info: { border: 'var(--interactive-default)', icon: 'info', bg: 'var(--bg-card)' },
  success: { border: 'var(--text-teal)', icon: 'check', bg: 'rgba(42, 168, 158, 0.1)' },
  warning: { border: 'var(--glow-brass)', icon: 'alert', bg: 'rgba(201, 161, 92, 0.1)' },
  error: { border: 'var(--glow-teal)', icon: 'x-circle', bg: 'rgba(42, 168, 158, 0.15)' },
};

const icons: Record<string, React.ReactElement> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  check: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  alert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  'x-circle': (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
};

let toastContainer: HTMLDivElement | null = null;

function getToastContainer() {
  if (typeof document === 'undefined') return null;
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
      max-width: 400px;
    `;
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function toast(props: ToastProps) {
  const container = getToastContainer();
  if (!container) return { dismiss: () => {}, update: () => {} };

  const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const duration = props.duration ?? 5000;

  // This is a simplified version - in practice you'd use a context/provider
  // For now, we'll create the element directly
  const toastEl = document.createElement('div');
  toastEl.style.pointerEvents = 'auto';

  const colors = toastColors[props.type || 'info'];

  toastEl.innerHTML = `
    <div style="
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: ${colors.bg};
      border: 1px solid ${colors.border};
      border-radius: 8px;
      box-shadow: var(--shadow-3);
      font-family: var(--font-body);
      font-size: 0.9375rem;
      line-height: 1.6;
      color: var(--text-primary);
      position: relative;
      overflow: hidden;
    ">
      <div style="flex-shrink: 0; color: ${colors.border};">
        ${(icons[colors.icon] as unknown as { outerHTML: string }).outerHTML}
      </div>
      <div style="flex: 1; min-width: 0;">
        <div style="margin-bottom: 4px;">${props.message}</div>
        ${props.action ? `
          <button data-action="${id}" style="
            margin-top: 8px;
            padding: 6px 12px;
            font-family: var(--font-caption);
            font-size: 0.75rem;
            font-weight: 500;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            color: ${colors.border};
            background: transparent;
            border: 1px solid ${colors.border};
            border-radius: 4px;
            cursor: pointer;
          ">${props.action.label}</button>
        ` : ''}
      </div>
      <button data-dismiss="${id}" style="
        flex-shrink: 0;
        padding: 4px;
        color: var(--text-muted);
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  `;

  // Progress bar
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: ${colors.border};
    width: 100%;
    transform-origin: left;
    transform: scaleX(1);
    transition: transform ${duration}ms linear;
  `;
  toastEl.firstElementChild?.appendChild(progressBar);

  container.appendChild(toastEl);

  // Animate in
  requestAnimationFrame(() => {
    toastEl.style.transform = 'translateX(0)';
    toastEl.style.opacity = '1';
    progressBar.style.transform = 'scaleX(0)';
  });

  toastEl.style.cssText = `
    transform: translateX(120%);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
  `;

  let dismissed = false;

  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    toastEl.style.transform = 'translateX(120%)';
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.remove(), 400);
    props.onClose?.();
  };

  // Auto dismiss
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  if (duration > 0) {
    timeoutId = setTimeout(dismiss, duration);
  }

  // Event listeners
  toastEl.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.dataset.dismiss === id) {
      if (timeoutId) clearTimeout(timeoutId);
      dismiss();
    } else if (target.dataset.action === id) {
      props.action?.onClick();
      if (timeoutId) clearTimeout(timeoutId);
      dismiss();
    }
  });

  return { dismiss, update: (_newProps: Partial<ToastProps>) => {} };
}

/**
 * ToastContainer - React component for managing toasts
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </AnimatePresence>
  );
}

export function Toast({ toast, onClose }: { toast: ToastState; onClose: () => void }) {
  const [progress, setProgress] = useState(1);
  const colors = toastColors[toast.type || 'info'];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const start = Date.now();
      const duration = toast.duration;

      const animate = () => {
        const elapsed = Date.now() - start;
        const p = Math.max(0, 1 - elapsed / duration);
        setProgress(p);
        if (p > 0) {
          requestAnimationFrame(animate);
        } else {
          onClose();
        }
      };
      requestAnimationFrame(animate);
    }
  }, [toast.duration, onClose]);

  return (
    <motion.div
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 120, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        pointerEvents: 'auto',
        width: '100%',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          padding: '16px',
          background: colors.bg,
          border: `1px solid ${colors.border}`,
          borderRadius: '8px',
          boxShadow: 'var(--shadow-3)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9375rem',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ flexShrink: 0, color: colors.border }}>
          {icons[colors.icon]}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: toast.action ? '8px' : 0 }}>{toast.message}</div>
          {toast.action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { toast.action!.onClick(); onClose(); }}
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {toast.action.label}
            </Button>
          )}
        </div>
        <motion.button
          onClick={onClose}
          style={{
            flexShrink: 0,
            padding: '4px',
            color: 'var(--text-muted)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          whileHover={{ color: 'var(--text-primary)' }}
          whileTap={{ scale: 0.9 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </motion.button>
      </div>
      {/* Progress bar */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '3px',
          background: colors.border,
          borderRadius: '0 0 8px 8px',
          transformOrigin: 'left',
        }}
        animate={{ scaleX: progress }}
        transition={{ duration: toast.duration ? toast.duration / 1000 : 0, ease: 'linear' }}
        initial={{ scaleX: 1 }}
      />
    </motion.div>
  );
}

export function useToast() {
  // This would integrate with a ToastProvider context
  // For now, return the standalone toast function
  return { toast };
}

export default ToastContainer;