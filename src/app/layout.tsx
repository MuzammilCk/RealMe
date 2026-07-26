import { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ScrollProvider } from './providers/ScrollProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AudioProvider, useAudio } from './providers/AudioProvider';
import { usePortfolioStore } from '../store/usePortfolioStore';

// Lazy load heavy sections
const Skills = lazy(() => import('./sections/Skills'));
const Projects = lazy(() => import('./sections/Projects'));
import Hero from './sections/Hero';
import About from './sections/About';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

/**
 * Skeleton fallback for lazy-loaded sections
 */
function SectionSkeleton() {
  return (
    <motion.div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--space-6)',
        padding: 'var(--space-16) var(--space-6)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={{
          width: '60%',
          maxWidth: '600px',
          height: '4px',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
        animate={{ scaleX: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, var(--interactive-default), var(--interactive-hover), var(--glow-ember))',
            transformOrigin: 'left center',
          }}
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
      <p style={{
        fontFamily: 'var(--font-caption)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
      }}>
        Loading section...
      </p>
    </motion.div>
  );
}

/**
 * App Layout - Orchestrates providers and sections
 * ARCHITECTURE-v2 §8 Layer D: Integration - ScrollProvider, ThemeProvider, AudioProvider
 */
export default function AppLayout() {
  const { diaryState, threeDEnabled } = usePortfolioStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-canvas)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', color: 'var(--text-accent)' }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <ScrollProvider>
      <ThemeProvider>
        <AudioProvider>
          <div
            className="app-layout"
            style={{
              minHeight: '100vh',
              backgroundColor: 'var(--bg-canvas)',
              color: 'var(--text-primary)',
              overflowX: 'hidden',
            }}
          >
            {/* Skip link for accessibility */}
            <a
              href="#main-content"
              className="skip-link"
              style={{
                position: 'absolute',
                top: '-100%',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: 'var(--space-3) var(--space-6)',
                background: 'var(--interactive-default)',
                color: 'var(--text-inverse)',
                fontFamily: 'var(--font-caption)',
                fontWeight: 500,
                borderRadius: 'var(--radius-md)',
                zIndex: 9999,
                transition: 'top var(--duration-fast) var(--ease-smooth)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.top = 'var(--space-4)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.top = '-100%';
              }}
            >
              Skip to main content
            </a>

            {/* Main content */}
            <main id="main-content" style={{ position: 'relative' }}>
              {/* Hero Section */}
              <section id="hero" aria-labelledby="hero-title" style={{ position: 'relative' }}>
                <Hero />
              </section>

              {/* About Section */}
              <section id="about" aria-labelledby="about-heading" style={{ position: 'relative' }}>
                <About />
              </section>

              {/* Skills Section */}
              <section id="skills" aria-labelledby="skills-heading" style={{ position: 'relative' }}>
                <Suspense fallback={<SectionSkeleton />}>
                  <Skills />
                </Suspense>
              </section>

              {/* Projects Section */}
              <section id="projects" aria-labelledby="projects-heading" style={{ position: 'relative' }}>
                <Suspense fallback={<SectionSkeleton />}>
                  <Projects />
                </Suspense>
              </section>

              {/* Experience Section */}
              <section id="experience" aria-labelledby="experience-heading" style={{ position: 'relative' }}>
                <Experience />
              </section>

              {/* Contact Section */}
              <section id="contact" aria-labelledby="contact-heading" style={{ position: 'relative' }}>
                <Contact />
              </section>
            </main>

            {/* Scroll progress indicator (global) */}
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: 'var(--border-subtle)',
                zIndex: 999,
                pointerEvents: 'none',
              }}
            >
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--interactive-default), var(--interactive-hover), var(--glow-ember))',
                  transformOrigin: 'left center',
                }}
                animate={{ scaleX: 0 }} // Will be controlled by ScrollProvider
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            </div>

            {/* 3D Toggle Button (global) */}
            {threeDEnabled && diaryState !== 'closed' && (
              <motion.button
                onClick={() => usePortfolioStore.getState().setThreeDEnabled(false)}
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
                transition={{ delay: 0.5 }}
              >
                📄 2D Mode
              </motion.button>
            )}

            {/* Audio Controls */}
            <AudioControls />
          </div>
        </AudioProvider>
      </ThemeProvider>
    </ScrollProvider>
  );
}

/**
 * Audio Controls - Volume, mute, test sounds
 */
function AudioControls() {
  const { volume, muted, setVolume, play } = useAudio();
  const [showControls, setShowControls] = useState(false);

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        left: 'var(--space-6)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        alignItems: 'flex-start',
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 }}
    >
      <motion.button
        onClick={() => setShowControls(!showControls)}
        style={{
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
        }}
        whileTap={{ scale: 0.96 }}
      >
        {muted ? '🔇' : '🔊'} Audio
      </motion.button>

      {showControls && (
        <motion.div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            padding: 'var(--space-4)',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-3)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontFamily: 'var(--font-caption)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
            }}>
              Volume
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                style={{
                  width: '100px',
                  accentColor: 'var(--interactive-default)',
                }}
              />
              <span style={{ minWidth: '30px' }}>{Math.round(volume * 100)}%</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {(['pageTurn', 'brassClick', 'emberWhoosh', 'inkScratch', 'success'] as const).map(sound => (
              <motion.button
                key={sound}
                onClick={() => play(sound)}
                style={{
                  padding: 'var(--space-1) var(--space-3)',
                  fontFamily: 'var(--font-caption)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                }}
                whileHover={{
                  color: 'var(--text-accent)',
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--bg-card)',
                }}
                whileTap={{ scale: 0.96 }}
              >
                {sound}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}