import { motion } from 'framer-motion';
import { useState, type ReactNode, type CSSProperties } from 'react';

/**
 * Tabs - Tabbed interface with brass indicator
 * ARCHITECTURE-v2 §2: Uses locked tokens, spring physics
 */
export interface Tab {
  /** Tab identifier */
  id: string;
  /** Tab label */
  label: ReactNode;
  /** Tab content */
  content: ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Optional icon */
  icon?: ReactNode;
}

export interface TabsProps {
  /** Tab definitions */
  tabs: Tab[];
  /** Default active tab */
  defaultTab?: string;
  /** Active tab (controlled) */
  activeTab?: string;
  /** Change handler */
  onChange?: (id: string) => void;
  /** Tab position */
  tabPosition?: 'top' | 'left';
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
}

export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  tabPosition = 'top',
  className = '',
  style = {},
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs.find(t => !t.disabled)?.id || ''
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabChange = (id: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(id);
    }
    onChange?.(id);
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: tabPosition === 'top' ? 'column' : 'row',
        width: '100%',
        ...style,
      }}
    >
      {/* Tab List */}
      <div
        style={{
          display: 'flex',
          flexDirection: tabPosition === 'top' ? 'row' : 'column',
          gap: 'var(--space-2)',
          borderBottom: tabPosition === 'top' ? '1px solid var(--border-subtle)' : 'none',
          borderRight: tabPosition === 'left' ? '1px solid var(--border-subtle)' : 'none',
          paddingBottom: tabPosition === 'top' ? 'var(--space-3)' : 'none',
          marginRight: tabPosition === 'left' ? 'var(--space-6)' : 'none',
          flexShrink: 0,
        }}
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDisabled = tab.disabled;

          return (
            <motion.button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              id={`tab-${tab.id}`}
              disabled={isDisabled}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-5)',
                fontFamily: 'var(--font-caption)',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: isDisabled ? 'var(--text-muted)' : isActive ? 'var(--text-accent)' : 'var(--text-secondary)',
                backgroundColor: 'transparent',
                border: '1px solid transparent',
                borderRadius: '6px 6px 0 0',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.5 : 1,
                transition: 'all var(--duration-fast) var(--ease-smooth)',
                ...(tabPosition === 'left' ? { borderRadius: '6px 0 0 6px' } : {}),
              }}
              whileHover={isDisabled ? undefined : { color: 'var(--text-accent)', backgroundColor: 'var(--bg-input)' }}
              whileTap={isDisabled ? undefined : { scale: 0.98 }}
              onClick={() => !isDisabled && handleTabChange(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div
        style={{
          flex: 1,
          position: 'relative',
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <motion.div
              key={tab.id}
              id={`tab-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              style={{
                position: 'absolute',
                inset: 0,
                padding: 'var(--space-6)',
                opacity: isActive ? 1 : 0,
                pointerEvents: isActive ? 'auto' : 'none',
              }}
              initial={false}
              animate={{ opacity: isActive ? 1 : 0 }}
              transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {tab.content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

Tabs.displayName = 'Tabs';

export default Tabs;
