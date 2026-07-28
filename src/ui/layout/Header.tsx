import { motion, useScroll, useTransform } from 'framer-motion';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { Button } from '../components/Button';
import { Flex } from './Layout';

/**
 * Header - Logo, nav links, theme toggle, scroll progress
 * ARCHITECTURE-v2 §2, §3: Cinzel Decorative logo, brass hover states
 */
export function Header() {
  const { diaryState, threeDEnabled, setThreeDEnabled } = usePortfolioStore();

  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#experience', label: 'Experience' },
    { href: '#contact', label: 'Contact' },
  ];

  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const isScrolled = false; // Could track scroll position if needed

  return (
    <motion.header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: isScrolled ? 'rgba(20, 11, 5, 0.95)' : 'transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'all var(--duration-base) var(--ease-smooth)',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '0 var(--space-6)' }}>
        <Flex justify="between" align="center" style={{ height: '72px' }}>
          {/* Logo */}
          <motion.a
            href="#"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: 'var(--text-accent)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>📓</span>
            My Journey
          </motion.a>

          {/* Navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            {navLinks.map((link) => (
              <motion.a
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-caption)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  position: 'relative',
                  padding: '4px 0',
                }}
                whileHover={{ color: 'var(--text-accent)' }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {link.label}
                <motion.span
                  layoutId="nav-underline"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    backgroundColor: 'var(--interactive-default)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              </motion.a>
            ))}

            {/* 3D Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setThreeDEnabled(!threeDEnabled)}
              style={{ marginLeft: 'var(--space-4)' }}
            >
              {threeDEnabled ? '🌐 3D' : '📄 2D'}
            </Button>
          </nav>

          {/* Diary CTA - only show when diary is closed */}
          {diaryState === 'closed' && (
            <motion.button
              style={{
                background: 'transparent',
                border: '1px solid var(--interactive-default)',
                color: 'var(--interactive-default)',
                padding: '10px 20px',
                borderRadius: '4px',
                fontFamily: 'var(--font-caption)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              whileHover={{
                background: 'var(--interactive-default)',
                color: 'var(--text-inverse)',
                boxShadow: 'var(--glow-brass)',
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => usePortfolioStore.getState().openDiary()}
            >
              Open Diary
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </motion.button>
          )}
        </Flex>
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          backgroundColor: 'var(--border-subtle)',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--interactive-default), var(--interactive-hover), var(--glow-ember))',
            transformOrigin: 'left center',
            scaleX: progress,
          }}
        />
      </motion.div>
    </motion.header>
  );
}

export default Header;