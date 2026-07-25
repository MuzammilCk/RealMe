import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

/**
 * Avatar - User/image avatar with brass ring
 * ARCHITECTURE-v2 §2: Brass accent ring
 */
export interface AvatarProps {
  /** Image source */
  src?: string;
  /** Fallback initials */
  alt?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Shape */
  shape?: 'circle' | 'square';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Custom className */
  className?: string;
}

export function Avatar({ src, alt = 'User', size = 'md', shape = 'circle', status, className = '' }: AvatarProps) {
  const sizes = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const statusSizes = {
    xs: 6,
    sm: 8,
    md: 10,
    lg: 14,
    xl: 18,
  };

  const dimension = sizes[size];
  const statusDimension = statusSizes[size];

  const statusColors = {
    online: 'var(--text-teal)',
    offline: 'var(--text-muted)',
    busy: 'var(--glow-ember)',
    away: 'var(--glow-brass)',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      className={className}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: dimension,
        height: dimension,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Image or fallback */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: shape === 'circle' ? '50%' : '8px',
          overflow: 'hidden',
          backgroundColor: 'var(--bg-input)',
          border: '2px solid var(--interactive-default)',
          boxShadow: 'inset 0 0 0 1px var(--border-subtle)',
        }}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-caption)',
              fontSize: dimension * 0.35,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
            }}
          >
            {getInitials(alt)}
          </div>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: statusDimension,
            height: statusDimension,
            borderRadius: '50%',
            backgroundColor: statusColors[status],
            border: `2px solid var(--bg-scene)`,
            boxShadow: `0 0 0 2px ${statusColors[status]}`,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
    </motion.div>
  );
}

export default Avatar;