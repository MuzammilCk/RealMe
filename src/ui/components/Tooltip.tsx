import { motion } from 'framer-motion';
import { useRef, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/**
 * Tooltip - Follows cursor with brass arrow and paper texture
 * ARCHITECTURE-v2 §2, §6: Delay 200ms, premium motion
 */
export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Children - the element to attach tooltip to */
  children: ReactNode;
  /** Position relative to target */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Delay before showing (ms) */
  delay?: number;
  /** Custom className */
  className?: string;
  /** Tooltip width */
  width?: string | number;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  width = 'auto',
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<number | null>(null);
  const childRef = useRef<HTMLElement>(null);

  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      if (childRef.current) {
        const rect = childRef.current.getBoundingClientRect();
        const positions = {
          top: { x: rect.left + rect.width / 2, y: rect.top - 8 },
          bottom: { x: rect.left + rect.width / 2, y: rect.bottom + 8 },
          left: { x: rect.left - 8, y: rect.top + rect.height / 2 },
          right: { x: rect.right + 8, y: rect.top + rect.height / 2 },
        };
        setTooltipPosition(positions[position]);
      }
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const tooltipStyles = {
    top: { transform: 'translate(-50%, -100%)', arrowBottom: 0 },
    bottom: { transform: 'translate(-50%, 0)', arrowTop: 0 },
    left: { transform: 'translate(-100%, -50%)', arrowRight: 0 },
    right: { transform: 'translate(0, -50%)', arrowLeft: 0 },
  };

  const arrowStyles = {
    top: { borderTopColor: 'var(--brass-700)', bottom: '-6px', left: '50%', marginLeft: '-6px' },
    bottom: { borderBottomColor: 'var(--brass-700)', top: '-6px', left: '50%', marginLeft: '-6px' },
    left: { borderLeftColor: 'var(--brass-700)', right: '-6px', top: '50%', marginTop: '-6px' },
    right: { borderRightColor: 'var(--brass-700)', left: '-6px', top: '50%', marginTop: '-6px' },
  };

  const tooltipContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: position === 'top' ? 8 : position === 'bottom' ? -8 : 0, x: position === 'left' ? 8 : position === 'right' ? -8 : 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        position: 'fixed',
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        zIndex: 200,
        pointerEvents: 'none',
        maxWidth: '300px',
        width,
      }}
      role="tooltip"
    >
      <div
        style={{
          backgroundColor: 'var(--bg-paper)',
          color: 'var(--text-primary)',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid var(--border-default)',
          boxShadow: 'var(--shadow-3)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
          transform: tooltipStyles[position].transform,
          transformOrigin: position === 'top' ? 'bottom center' : position === 'bottom' ? 'top center' : position === 'left' ? 'center right' : 'center left',
        }}
        className={className}
      >
        {content}
        <div
          style={{
            position: 'absolute',
            width: 0,
            height: 0,
            border: '6px solid transparent',
            ...arrowStyles[position],
          }}
        />
      </div>
    </motion.div>
  );

  return (
    <>
      <span
        ref={childRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </span>
      {visible && createPortal(tooltipContent, document.body)}
    </>
  );
}

export default Tooltip;