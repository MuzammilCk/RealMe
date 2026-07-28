import { motion, AnimatePresence } from 'framer-motion';
import { useState, type ReactNode, type CSSProperties } from 'react';

/**
 * Accordion - Collapsible sections with brass indicator
 * ARCHITECTURE-v2 §2: Uses locked tokens, spring physics
 */
export interface AccordionItem {
  /** Item identifier */
  id: string;
  /** Item title */
  title: ReactNode;
  /** Item content */
  content: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Initially expanded */
  defaultExpanded?: boolean;
}

export interface AccordionProps {
  /** Accordion items */
  items: AccordionItem[];
  /** Multiple items can be open */
  multiple?: boolean;
  /** Default expanded item IDs */
  defaultExpanded?: string[];
  /** Controlled expanded IDs */
  expanded?: string[];
  /** Change handler */
  onExpandedChange?: (ids: string[]) => void;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
}

export function Accordion({
  items,
  multiple = false,
  defaultExpanded,
  expanded: controlledExpanded,
  onExpandedChange,
  className = '',
  style = {},
}: AccordionProps) {
  const initialExpanded = defaultExpanded || items.filter(i => i.defaultExpanded).map(i => i.id);
  const [internalExpanded, setInternalExpanded] = useState<string[]>(initialExpanded);

  const expanded = controlledExpanded ?? internalExpanded;

  const toggleItem = (id: string) => {
    let newExpanded: string[];
    if (multiple) {
      newExpanded = expanded.includes(id)
        ? expanded.filter(i => i !== id)
        : [...expanded, id];
    } else {
      newExpanded = expanded.includes(id) ? [] : [id];
    }

    if (controlledExpanded === undefined) {
      setInternalExpanded(newExpanded);
    }
    onExpandedChange?.(newExpanded);
  };

  return (
    <div
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)',
        ...style,
      }}
    >
      {items.map((item) => {
        const isOpen = expanded.includes(item.id);
        const isDisabled = item.disabled;

        return (
          <div key={item.id} style={{ width: '100%' }}>
            <motion.h3 style={{ margin: 0, fontSize: '1rem' }}>
              <motion.button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${item.id}`}
                disabled={isDisabled}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4) var(--space-5)',
                  fontFamily: 'var(--font-caption)',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: isDisabled ? 'var(--text-muted)' : 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.5 : 1,
                  textAlign: 'left',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                }}
                whileHover={isDisabled ? undefined : { backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)' }}
                whileTap={isDisabled ? undefined : { scale: 0.99 }}
                onClick={() => !isDisabled && toggleItem(item.id)}
              >
                <span style={{ flex: 1 }}>{item.title}</span>
                <motion.span
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </motion.span>
              </motion.button>
            </motion.h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-content-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: 'var(--space-5) var(--space-5) 0' }}>
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

Accordion.displayName = 'Accordion';

export default Accordion;
