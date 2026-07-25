import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useThree, useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useScroll } from '../providers/ScrollProvider';
import { ABOUT } from '../../data/chapters';
import SkillOrbSystem, { SkillOrbLabel } from '../../scene/Props/SkillOrbSystem';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/**
 * About Section - Diary page spread with bio and skill orbs
 * ARCHITECTURE-v2 §3.2.2: About - Diary spread, page-turn on scroll, skill orbs on right page
 */
export function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { section: currentSection, getSectionProgress } = useScroll();
  const { diaryState, threeDEnabled } = usePortfolioStore();
  const { camera } = useThree();
  const leftPageRef = useRef<HTMLDivElement>(null);
  const rightPageRef = useRef<HTMLDivElement>(null);

  // Camera follows scroll when diary is open and on about section
  useFrame(() => {
    if (!threeDEnabled || diaryState !== 'open' || currentSection !== 'about') return;

    const sectionProgress = getSectionProgress('about');

    // Camera moves from hero position to closer diary view
    const targetY = gsap.utils.interpolate(4.0, 2.5, sectionProgress);
    const targetZ = gsap.utils.interpolate(6.4, 2.1, sectionProgress);

    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0.5 + sectionProgress * 0.3, 0);
  });

  // Page turn animation on scroll
  useEffect(() => {
    if (!sectionRef.current) return;

    const leftPage = leftPageRef.current;
    const rightPage = rightPageRef.current;
    if (!leftPage || !rightPage) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        // Left page turns first, then right
        if (leftPage) {
          leftPage.style.transform = `rotateY(${-progress * 15}deg)`;
        }
        if (rightPage) {
          rightPage.style.transform = `rotateY(${progress * 15}deg)`;
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
      style={{
        minHeight: '100vh',
        padding: 'var(--space-16) var(--space-6)',
        position: 'relative',
      }}
    >
      {/* 3D Skill Orbs Background */}
      {threeDEnabled && diaryState === 'open' && currentSection === 'about' && (
        <div
          className="about-3d-bg"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
          }}
        >
          <SkillOrbSystem
            count={12}
            radius={2.2}
            onHover={(skill) => {
              // Could trigger UI tooltip
            }}
            onClick={(skill) => {
              // Could open skill detail
            }}
          />
        </div>
      )}

      {/* Diary Page Spread */}
      <div
        className="about-spread"
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          perspective: '1000px',
        }}
      >
        {/* Left Page - Bio */}
        <motion.div
          ref={leftPageRef}
          className="about-page about-page-left"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'right center',
            background: 'linear-gradient(180deg, rgba(237,224,200,0.98), rgba(228,212,184,0.98))',
            borderRadius: '3px 0 0 3px',
            borderRight: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-3)',
            padding: 'var(--space-8) var(--space-10)',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
        >
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
            {ABOUT.eyebrow}
          </motion.p>

          {ABOUT.paragraphs.slice(0, 2).map((p, i) => (
            <motion.p
              key={i}
              className="body-copy"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-base)',
                lineHeight: 'var(--leading-relaxed)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-4)',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              {p}
            </motion.p>
          ))}
        </motion.div>

        {/* Right Page - Skills Preview */}
        <motion.div
          ref={rightPageRef}
          className="about-page about-page-right"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'left center',
            background: 'linear-gradient(180deg, rgba(237,224,200,0.98), rgba(228,212,184,0.98))',
            borderRadius: '0 3px 3px 0',
            boxShadow: 'var(--shadow-3)',
            padding: 'var(--space-8) var(--space-10)',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
        >
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
            Skills at a Glance
          </motion.p>

          <motion.div
            className="about-skills-preview"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--space-3)',
              maxHeight: '300px',
              overflow: 'hidden',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {ABOUT.paragraphs.slice(2).map((p, i) => (
              <motion.span
                key={i}
                className="skill-tag"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
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
                  cursor: 'default',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                }}
                whileHover={{
                  color: 'var(--text-accent)',
                  borderColor: 'var(--border-default)',
                  backgroundColor: 'var(--bg-input)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                {p}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            className="about-see-more"
            style={{
              marginTop: 'var(--space-8)',
              fontFamily: 'var(--font-caption)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--text-accent)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            whileHover={{ x: 8 }}
          >
            Explore all skills →
          </motion.p>
        </motion.div>
      </div>

      {/* Skill Orb Labels (HTML overlay for 3D orbs) */}
      {threeDEnabled && diaryState === 'open' && currentSection === 'about' && (
        <SkillOrbLabel
          skill={null} // Would be connected to actual hovered skill
          position={new THREE.Vector3(0, 1.5, 0)}
        />
      )}

      {/* Section indicator dots */}
      <div
        className="about-dots"
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
        {['hero', 'about', 'skills', 'projects', 'experience', 'contact'].map((s, i) => (
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

export default About;