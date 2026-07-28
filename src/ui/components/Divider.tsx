import { type ReactNode, type CSSProperties } from 'react';

/**
 * Divider - Subtle separator with brass accent option
 * ARCHITECTURE-v2 §2: Uses locked border tokens
 */
export interface DividerProps {
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Visual variant */
  variant?: 'default' | 'brass' | 'glow';
  /** Flex width (for horizontal) or height (for vertical) */
  size?: string;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: CSSProperties;
  /** Label text to display in the center */
  label?: ReactNode;
}

export function Divider({
  orientation = 'horizontal',
  variant = 'default',
  size = orientation === 'horizontal' ? '1px' : '100%',
  className = '',
  style = {},
  label,
}: DividerProps) {
  const variantStyles = {
    default: {
      bg: 'var(--border-subtle)',
      labelColor: 'var(--text-muted)',
    },
    brass: {
      bg: 'var(--interactive-default)',
      labelColor: 'var(--text-accent)',
    },
    glow: {
      bg: 'var(--glow-brass)',
      labelColor: 'var(--glow-brass)',
    },
  };

  const styles = variantStyles[variant];

  const baseStyle: CSSProperties = {
    ...(orientation === 'horizontal'
      ? {
          width: '100%',
          height: size,
          margin: 'var(--space-6) 0',
        }
      : {
          width: size,
          height: '100%',
          margin: '0 var(--space-6)',
          display: 'inline-block',
          verticalAlign: 'middle',
        }),
    backgroundColor: styles.bg,
    borderRadius: '9999px',
    ...style,
  };

  if (label) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          margin: 'var(--space-6) 0',
          ...style,
        }}
      >
        <span style={{ ...baseStyle, flex: '1 1 auto' }} />
        <span
          style={{
            fontFamily: 'var(--font-caption)',
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: styles.labelColor,
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        <span style={{ ...baseStyle, flex: '1 1 auto' }} />
      </div>
    );
  }

  return <div className={className} style={baseStyle} />;
}

Divider.displayName = 'Divider';

export default Divider;
