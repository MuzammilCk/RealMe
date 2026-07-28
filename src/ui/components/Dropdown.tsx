import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, type ReactNode, type CSSProperties } from 'react';

/**
 * Dropdown - Menu with brass arrow and paper texture
 * ARCHITECTURE-v2 §2: Uses locked tokens, spring physics
 */
export interface DropdownItem {
  /** Item label */
  label: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Optional icon */
  icon?: ReactNode;
  /** Divider before this item */
  divider?: boolean;
  /** Keyboard shortcut */
  shortcut?: string;
}

export interface DropdownProps {
  /** Trigger button content */
  trigger: ReactNode;
  /** Menu items */
  items: DropdownItem[];
  /** Placement */
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
}

export function Dropdown({
  trigger,
  items,
  placement = 'bottom-left',
  disabled = false,
  className = '',
  style = {},
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const placementStyles = {
    'bottom-left': { top: '100%', left: 0 },
    'bottom-right': { top: '100%', right: 0 },
    'top-left': { bottom: '100%', left: 0 },
    'top-right': { bottom: '100%', right: 0 },
  };

  return (
    <div
      ref={dropdownRef}
      className={className}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      <motion.button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={disabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)',
          fontFamily: 'var(--font-caption)',
          fontSize: '0.8125rem',
          fontWeight: 500,
          letterSpacing: '0.05em',
          color: disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
          backgroundColor: 'transparent',
          border: '1px solid var(--border-subtle)',
          borderRadius: '6px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          transition: 'all var(--duration-fast) var(--ease-smooth)',
        }}
        whileHover={disabled ? undefined : { backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
        whileTap={disabled ? undefined : { scale: 0.98 }}
        onClick={() => !disabled && setOpen(!open)}
      >
        {trigger}
        <motion.span
          style={{ display: 'flex', alignItems: 'center' }}
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            style={{
              position: 'absolute',
              ...placementStyles[placement],
              zIndex: 100,
              minWidth: '200px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: '8px',
              boxShadow: 'var(--shadow-4)',
              padding: 'var(--space-2) 0',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {items.map((item, index) => (
              <motion.button
                key={index}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3) var(--space-5)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                  color: item.disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  opacity: item.disabled ? 0.5 : 1,
                  textAlign: 'left',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                  ...(item.divider
                    ? {
                        borderTop: '1px solid var(--border-subtle)',
                        marginTop: 'var(--space-2)',
                        paddingTop: 'var(--space-2)',
                      }
                    : {}),
                }}
                whileHover={item.disabled ? undefined : { backgroundColor: 'var(--bg-input)' }}
                whileTap={item.disabled ? undefined : { scale: 0.99 }}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    setOpen(false);
                  }
                }}
              >
                {item.icon && <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>}
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.shortcut && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.shortcut}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

Dropdown.displayName = 'Dropdown';

export default Dropdown;
