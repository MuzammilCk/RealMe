import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useScroll } from '../providers/ScrollProvider';
import DiaryHero from '../../scene/Props/DiaryHero';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  onScrollHint?: () => void;
}

/**
 * Hero Section - Diary center-stage with cinematic intro
 * ARCHITECTURE-v2 §3.2.1: Hero - 3D diary center, camera intro (1200ms), title stagger, scroll hint
 */
export function Hero({ onScrollHint }: HeroProps) {
  const { camera } = useThree();
  const { progress, section } = useScroll();
  const { diaryState, threeDEnabled, openDiary, setThreeDEnabled } = usePortfolioStore();
  const diaryRef = useRef<THREE.Group>(null);
  const introCompleteRef = useRef(false);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  // Trigger in-view for scroll hint
  const scrollHintInView = useInView(scrollHintRef, { once: true, margin: '0px 0px -200px 0px' });

  // Cinematic intro sequence when 3D enables
  useEffect(() => {
    if (!threeDEnabled || introCompleteRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        introCompleteRef.current = true;
        // Enable scroll after intro
        document.body.style.overflow = 'auto';
      },
    });

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    // Camera starts close to diary cover, pulls back
    tl.to(camera.position, {
      x: 0,
      y: 4.0,
      z: 6.4,
      duration: 1.6,
      ease: 'expo.out',
    }, 0);

    // Diary cover subtle scale/rotate
    if (diaryRef.current) {
      tl.to(diaryRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, 0.2);

      tl.to(diaryRef.current.rotation, {
        y: 0.05,
        duration: 1.6,
        ease: 'expo.out',
      }, 0);
    }

    // Title stagger reveal
    tl.to('.hero-title', {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
    }, 0.6);

    // Subtitle reveal
    tl.to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    }, 1.0);

    // Scroll hint appear
    tl.to('.hero-scroll-hint', {
      opacity: 1,
      duration: 0.6,
      ease: 'power3.out',
    }, 1.4);

    return () => {
      tl.kill();
      document.body.style.overflow = 'auto';
    };
  }, [threeDEnabled, camera]);

  // Scroll-driven camera parallax (when diary closed)
  useFrame((_) => {
    if (!threeDEnabled || diaryState !== 'closed') return;

    // Gentle orbital drift
    const time = performance.now() * 0.001;
    camera.position.x = Math.sin(time * 0.15) * 0.15;
    camera.position.y = 4.0 + Math.sin(time * 0.1) * 0.08;
    camera.position.z = 6.4 + Math.cos(time * 0.12) * 0.1;
    camera.lookAt(0, 0.35, 0);
  });

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

      {/* 3D Diary Hero - only when 3D enabled */}
      {threeDEnabled && (
        <div
          className="hero-canvas"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            width: '100%',
            height: '100%',
          }}
        >
          <DiaryHero
            coverPivotRef={diaryRef as any}
            onBegin={openDiary}
          />
        </div>
      )}

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
            style={{ animation: 'bounce 2s ease-in-out infinite' }}
          >
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </motion.svg>
          <style jsx>{`
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-8px); }
              60% { transform: translateY(-4px); }
            }
          `}</style>
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