import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useScroll } from '../providers/ScrollProvider';
import { EXPERIENCE } from '../../data/chapters';
import BookSpread from '../../content/BookSpread';
import { useAudio } from '../providers/AudioProvider';

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience Section - Diary page spread with work history
 * ARCHITECTURE-v2 §3.2: Experience chapter
 */
export function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { section: currentSection } = useScroll();
  const { diaryState, threeDEnabled } = usePortfolioStore();
  const { camera } = useThree();
  const { pageTurn: _pageTurn } = useAudio();

  // Camera behavior for experience section
  useEffect(() => {
    if (!threeDEnabled || diaryState !== 'open' || currentSection !== 'experience') return;

    gsap.to(camera.position, {
      x: 0,
      y: 2.8,
      z: 3.5,
      duration: 1.5,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(0, 0.5, 0),
    });
  }, [currentSection, threeDEnabled, diaryState, camera]);

  // Page turn animation on scroll
  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      onUpdate: () => {
        // Could animate page turn here
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Left page content
  const leftContent = (
    <>
      <motion.p
        className="eyebrow-mini"
        style={{
          fontFamily: 'var(--font-eyebrow)',
          fontSize: 'var(--text-sm)',
          fontWeight: 400,
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
          color: 'var(--text-accent)',
          marginBottom: 'var(--space-6)',
        }}
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        {EXPERIENCE.eyebrow}
      </motion.p>

      {EXPERIENCE.paragraphs.slice(0, 2).map((p, i) => (
        <motion.p
          key={i}
          className="body-copy"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-5)',
            position: 'relative',
            paddingLeft: 'var(--space-6)',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 + i * 0.15 }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: '0.25em',
              width: '3px',
              height: '1.5em',
              background: 'linear-gradient(180deg, var(--text-accent), var(--text-muted))',
              borderRadius: '2px',
            }}
          />
          {p}
        </motion.p>
      ))}
    </>
  );

  // Right page content - timeline
  const rightContent = (
    <>
      <motion.p
        className="eyebrow-mini"
        style={{
          fontFamily: 'var(--font-eyebrow)',
          fontSize: 'var(--text-sm)',
          fontWeight: 400,
          letterSpacing: 'var(--tracking-widest)',
          textTransform: 'uppercase',
          color: 'var(--text-accent)',
          marginBottom: 'var(--space-6)',
        }}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        Timeline
      </motion.p>

      {EXPERIENCE.paragraphs.slice(2).map((item, i) => (
        <motion.div
          key={i}
          className="experience-timeline-item"
          style={{
            position: 'relative',
            paddingLeft: 'var(--space-10)',
            marginBottom: 'var(--space-8)',
            borderLeft: '2px solid var(--border-subtle)',
          }}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 + i * 0.12 }}
        >
          {/* Timeline dot */}
          <div
            style={{
              position: 'absolute',
              left: '-6px',
              top: '0.5em',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--interactive-default)',
              border: '3px solid var(--bg-paper)',
              boxShadow: '0 0 0 2px var(--border-subtle)',
            }}
          />

          {/* Date/Role */}
          <motion.p
            style={{
              fontFamily: 'var(--font-caption)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--text-accent)',
              marginBottom: 'var(--space-1)',
            }}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 + i * 0.12 }}
          >
            {item.split('—')[0]?.trim() || `Role ${i + 1}`}
          </motion.p>

          {/* Description */}
          <motion.p
            className="body-copy"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-sm)',
              lineHeight: 'var(--leading-normal)',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--space-3)',
            }}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.12 }}
          >
            {item.split('—')[1]?.trim() || item}
          </motion.p>

          {/* Technologies */}
          <motion.div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-2)',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 + i * 0.12 }}
          >
            {['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL'].slice(0, 3 + (i % 2)).map((tech, ti) => (
              <motion.span
                key={ti}
                style={{
                  fontFamily: 'var(--font-caption)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '2px var(--space-3)',
                }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      ))}
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="experience-section"
      style={{
        minHeight: '100vh',
        padding: 'var(--space-16) var(--space-6)',
        position: 'relative',
      }}
      aria-labelledby="experience-heading"
    >
      {/* 3D Background - Diary on desk */}
      {threeDEnabled && diaryState === 'open' && currentSection === 'experience' && (
        <div
          className="experience-3d-bg"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          {/* Camera handles the view */}
        </div>
      )}

      {/* Diary Page Spread */}
      <div
        className="experience-spread"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
        }}
      >
        <BookSpread left={leftContent} right={rightContent} />
      </div>

      {/* Section dots */}
      <div
        className="experience-dots"
        style={{
          position: 'absolute',
          bottom: 'var(--space-8)',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 'var(--space-2)',
          zIndex: 20,
        }}
      >
        {['hero', 'about', 'skills', 'projects', 'experience', 'contact'].map((s) => (
          <motion.button
            key={s}
            className={`section-dot ${currentSection === s ? 'active' : ''}`}
            onClick={() => document.getElementById(s)?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: currentSection === s ? 'var(--interactive-default)' : 'var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
            }}
            whileHover={{ scale: 1.3 }}
            whileTap={{ scale: 0.8 }}
          />
        ))}
      </div>
    </section>
  );
}

export default Experience;