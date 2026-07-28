import { motion } from 'framer-motion';
import { type ReactNode, type CSSProperties } from 'react';

/**
 * DiaryPage - Paper texture page with ink bleed edges, text in Crimson Pro
 * ARCHITECTURE-v2 §3, §6: Page turn animation (Framer Motion + custom)
 */
export interface DiaryPageProps {
  /** Page content */
  children: ReactNode;
  /** Page number */
  pageNumber?: number;
  /** Whether this is the left page */
  isLeft?: boolean;
  /** Turn animation progress (0-1) */
  turnProgress?: number;
  /** Click to turn page */
  onTurn?: (direction: 'next' | 'prev') => void;
  /** Class name */
  className?: string;
}

export function DiaryPage({
  children,
  pageNumber,
  isLeft = false,
  turnProgress = 0,
  onTurn,
  className = '',
}: DiaryPageProps) {
  const pageStyle = {
    position: 'relative',
    backgroundColor: 'var(--bg-paper)',
    borderRadius: isLeft ? '4px 0 0 4px' : '0 4px 4px 0',
    boxShadow: `
      inset -1px 0 4px rgba(0,0,0,0.1),
      inset 1px 0 4px rgba(0,0,0,0.05),
      ${isLeft ? '4px 0 8px -2px rgba(0,0,0,0.1)' : '-4px 0 8px -2px rgba(0,0,0,0.1)'}
    `,
    overflow: 'hidden',
    transformStyle: 'preserve-3d',
    perspective: 1000,
  } as CSSProperties;

  // Page turn transform
  if (turnProgress > 0 && turnProgress < 1) {
    const angle = turnProgress * -180;
    pageStyle.transform = isLeft
      ? `rotateY(${angle}deg)`
      : `rotateY(${180 + angle}deg)`;
    pageStyle.transformOrigin = isLeft ? 'right center' : 'left center';
  }

  return (
    <motion.div
      style={pageStyle}
      className={className}
      animate={{
        opacity: turnProgress > 0 && turnProgress < 1 ? 0.8 : 1,
      }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {/* Paper texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />

      {/* Ink bleed edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at ${isLeft ? '0% 50%' : '100% 50%'}, rgba(26,15,8,0.15) 0%, transparent 30%),
            radial-gradient(ellipse at ${isLeft ? '0% 0%' : '100% 0%'}, rgba(26,15,8,0.08) 0%, transparent 20%),
            radial-gradient(ellipse at ${isLeft ? '0% 100%' : '100% 100%'}, rgba(26,15,8,0.08) 0%, transparent 20%)
          `,
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      {/* Page number */}
      {pageNumber && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: isLeft ? 'auto' : '24px',
            right: isLeft ? '24px' : 'auto',
            fontFamily: 'var(--font-caption)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          {pageNumber}
        </div>
      )}

      {/* Content */}
      <div
        style={{
          padding: 'var(--space-8)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-body)',
          lineHeight: 1.7,
          color: 'var(--text-primary)',
        }}
      >
        {children}
      </div>

      {/* Turn hint areas */}
      {onTurn && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '60px',
              [isLeft ? 'left' : 'right']: 0,
              cursor: 'pointer',
              background: 'linear-gradient(90deg, transparent, rgba(201,161,92,0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isLeft ? 'flex-start' : 'flex-end',
              padding: '0 20px',
              opacity: 0,
            }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => onTurn(isLeft ? 'prev' : 'next')}
            whileHover={{ background: 'linear-gradient(90deg, transparent, rgba(201,161,92,0.15))' }}
            aria-label={isLeft ? 'Previous page' : 'Next page'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ color: 'var(--brass-700)' }}
            >
              {isLeft ? (
                <polyline points="15 18 9 12 15 6" />
              ) : (
                <polyline points="9 18 15 12 9 6" />
              )}
            </svg>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default DiaryPage;