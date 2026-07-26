import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../../store/usePortfolioStore';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onScrollHint?: () => void;
}

/**
 * Hero Section - Diary center-stage with cinematic intro
 * ARCHITECTURE-v2 §3.2.1: Hero - 3D diary center, camera intro (1200ms), title stagger, scroll hint
 * NOTE: Camera animation is now handled in CameraRig inside CanvasRoot
 */
export function Hero({ onScrollHint }: HeroProps) {
  const { diaryState, threeDEnabled, openDiary, setThreeDEnabled } = usePortfolioStore();
  const scrollHintRef = useRef<HTMLDivElement>(null);

  // Trigger in-view for scroll hint
  const scrollHintInView = useInView(scrollHintRef, { once: true, margin: '0px 0px -200px 0px' });

  // Handle scroll hint click
  const handleScrollHintClick = () => {
    if (diaryState === 'closed') {
      openDiary();
      onScrollHint?.();
    }
  };

  return (
    <section
      className="hero-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        padding: 'var(--space-16) var(--space-6)',
      }}
      aria-labelledby="hero-title"
    >
      {/* Background vignette overlay */}
      <div
        className="hero-vignette"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 40%, var(--bg-scene) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* UI Overlay */}
      <div
        className="hero-overlay"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 'var(--container-prose)',
          textAlign: 'center',
          paddingTop: 'var(--space-12)',
        }}
      >
        {/* Eyebrow */}
        <motion.p
          className="hero-eyebrow"
          style={{
            fontFamily: 'var(--font-eyebrow)',
            fontSize: 'var(--text-sm)',
            fontWeight: 400,
            letterSpacing: 'var(--tracking-widest)',
            textTransform: 'uppercase',
            color: 'var(--text-accent)',
            marginBottom: 'var(--space-4)',
            opacity: 0,
            y: 20,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
        >
          Welcome to My Workshop
        </motion.p>

        {/* Main Title */}
        <motion.h1
          id="hero-title"
          className="hero-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-5xl)',
            fontWeight: 700,
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-6)',
            opacity: 0,
            y: 30,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: [0.34, 1.56, 0.64, 1] }}
        >
          The Diary of Me
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="hero-subtitle"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-xl)',
            fontWeight: 400,
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--text-secondary)',
            maxWidth: '60ch',
            margin: '0 auto var(--space-12)',
            opacity: 0,
            y: 20,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          A craftsman's log of code, circuits, and curiosity.
          Step inside — the lamp is lit, the pages wait.
        </motion.p>

        {/* CTA Button - Open Diary */}
        {diaryState === 'closed' && (
          <motion.button
            className="hero-cta"
            onClick={handleScrollHintClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-4) var(--space-8)',
              fontFamily: 'var(--font-caption)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--text-inverse)',
              backgroundColor: 'var(--interactive-default)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-base)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
              opacity: 0,
              y: 20,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
            whileHover={{
              backgroundColor: 'var(--interactive-hover)',
              borderColor: 'var(--border-strong)',
              boxShadow: 'var(--shadow-glow-brass)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            Open Diary
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </motion.button>
        )}

        {/* Scroll Hint */}
        <motion.div
          ref={scrollHintRef}
          className="hero-scroll-hint"
          style={{
            marginTop: 'var(--space-16)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'var(--space-3)',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-caption)',
            fontSize: 'var(--text-xs)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            opacity: 0,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: scrollHintInView ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span>Scroll to begin</span>
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            animate={{ y: [0, -8, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </motion.svg>
          <style>{`@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } 60% { transform: translateY(-4px); } }`}</style>
        </motion.div>
      </div>

      {/* 3D Toggle */}
      <motion.button
        className="hero-3d-toggle"
        onClick={() => setThreeDEnabled(!threeDEnabled)}
        style={{
          position: 'fixed',
          bottom: 'var(--space-6)',
          right: 'var(--space-6)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          padding: 'var(--space-2) var(--space-4)',
          fontFamily: 'var(--font-caption)',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          cursor: 'pointer',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'all var(--duration-fast) var(--ease-smooth)',
        }}
        whileHover={{
          color: 'var(--text-accent)',
          borderColor: 'var(--border-default)',
          backgroundColor: 'var(--bg-input)',
        }}
        whileTap={{ scale: 0.96 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.0 }}
      >
        {threeDEnabled ? '🌐 3D On' : '📄 2D Mode'}
      </motion.button>
    </section>
  );
}

export default Hero;