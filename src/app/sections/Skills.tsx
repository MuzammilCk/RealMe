import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useScroll } from '../providers/ScrollProvider';
import { SKILL_ORBS, type SkillOrbData } from '../../scene/Props/SkillOrbSystem';
import SkillOrbSystem from '../../scene/Props/SkillOrbSystem';
import { useAudio } from '../providers/AudioProvider';

gsap.registerPlugin(ScrollTrigger);

/**
 * Skills Section - Floating constellation of SkillOrbs
 * ARCHITECTURE-v2 §3.2.3: Skills - Constellation filter, orbit camera, hover connect
 */
export function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { section: currentSection, getSectionProgress } = useScroll();
  const { diaryState, threeDEnabled, reducedMotion } = usePortfolioStore();
  const { camera } = useThree();
  const { brassClick, hoverGlow } = useAudio();

  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [hoveredSkill, setHoveredSkill] = useState<SkillOrbData | null>(null);
  const cameraTargetRef = useRef(new THREE.Vector3(0, 1.5, 0));
  const cameraDistanceRef = useRef(5.5);
  const isOrbitingRef = useRef(true);

  const categories = ['all', 'frontend', 'backend', 'devops', 'ai', 'hardware'];
  const categoryLabels: Record<string, string> = {
    all: 'All Skills',
    frontend: 'Frontend',
    backend: 'Backend',
    devops: 'DevOps',
    ai: 'AI/ML',
    hardware: 'Hardware',
  };

  // Category colors from locked palette
  const categoryColors: Record<string, string> = {
    frontend: 'var(--text-ember)',
    backend: 'var(--text-mystery)',
    devops: 'var(--text-teal)',
    ai: 'var(--text-mystery)',
    hardware: 'var(--text-accent)',
  };

  // Camera behavior for skills section
  useFrame(() => {
    if (!threeDEnabled || diaryState !== 'open' || currentSection !== 'skills') return;

    const sectionProgress = getSectionProgress('skills');

    if (isOrbitingRef.current && !reducedMotion) {
      // Slow orbital camera around skill constellation
      const time = performance.now() * 0.0003;
      const radius = cameraDistanceRef.current;
      cameraTargetRef.current.set(0, 1.5, 0);

      camera.position.x = Math.cos(time) * radius;
      camera.position.z = Math.sin(time) * radius;
      camera.position.y = 3.5 + Math.sin(time * 0.7) * 0.3;
      camera.lookAt(cameraTargetRef.current);
    }
  });

  // Filter orbs by category
  const filteredOrbs = activeCategory === 'all'
    ? SKILL_ORBS
    : SKILL_ORBS.filter(s => s.category === activeCategory);

  // Handle category filter click
  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat);
    brassClick();
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="skills-section"
      style={{
        minHeight: '100vh',
        padding: 'var(--space-16) var(--space-6)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Category Filter Bar */}
      <div
        className="skills-filter"
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: 'var(--container-wide)',
          margin: '0 auto var(--space-12)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--space-3)',
          justifyContent: 'center',
        }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`skills-filter-btn ${activeCategory === cat ? 'active' : ''}`}
            style={{
              padding: 'var(--space-2) var(--space-5)',
              fontFamily: 'var(--font-caption)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: activeCategory === cat ? 'var(--text-inverse)' : 'var(--text-secondary)',
              backgroundColor: activeCategory === cat
                ? categoryColors[cat] || 'var(--interactive-default)'
                : 'transparent',
              border: `1px solid ${
                activeCategory === cat
                  ? categoryColors[cat] || 'var(--interactive-default)'
                  : 'var(--border-subtle)'
              }`,
              borderRadius: 'var(--radius-full)',
              cursor: 'pointer',
              transition: 'all var(--duration-fast) var(--ease-smooth)',
            }}
            whileHover={{
              backgroundColor: activeCategory === cat
                ? categoryColors[cat] || 'var(--interactive-hover)'
                : 'var(--bg-input)',
              borderColor: categoryColors[cat] || 'var(--border-default)',
              color: activeCategory === cat ? 'var(--text-inverse)' : 'var(--text-accent)',
            }}
            whileTap={{ scale: 0.96 }}
          >
            {categoryLabels[cat]}
          </motion.button>
        ))}
      </div>

      {/* 3D Skill Orb Constellation */}
      {threeDEnabled && diaryState === 'open' && (
        <div
          className="skills-3d-canvas"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <SkillOrbSystem
            ref={orbsRef as any}
            count={filteredOrbs.length}
            radius={2.5}
            onHover={(skill) => {
              setHoveredSkill(skill);
              hoverGlow();
            }}
            onClick={(skill) => {
              brassClick();
              // Could open skill detail modal
            }}
          />
        </div>
      )}

      {/* UI Overlay - Skills Info Panel */}
      <div
        className="skills-ui-overlay"
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          pointerEvents: 'auto',
        }}
      >
        {/* Section Title */}
        <motion.div
          className="skills-header"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-10)',
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
              marginBottom: 'var(--space-3)',
            }}
          >
            03 — Skills Constellation
          </motion.p>
          <motion.h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-4xl)',
              fontWeight: 600,
              lineHeight: 'var(--leading-snug)',
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--text-primary)',
            }}
          >
            Technologies I Craft With
          </motion.h2>
        </motion.div>

        {/* Hovered Skill Detail Panel */}
        {hoveredSkill && (
          <motion.div
            className="skill-detail-panel"
            style={{
              position: 'fixed',
              bottom: 'var(--space-8)',
              left: '50%',
              transform: 'translateX(-50%)',
              maxWidth: '600px',
              width: 'calc(100% - var(--space-12))',
              padding: 'var(--space-6) var(--space-8)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-3), var(--shadow-glow-ember)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 50,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: categoryColors[hoveredSkill.category] || 'var(--interactive-default)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>
                  {hoveredSkill.category === 'frontend' && '⚛'}
                  {hoveredSkill.category === 'backend' && '⚙'}
                  {hoveredSkill.category === 'devops' && '☁'}
                  {hoveredSkill.category === 'ai' && '🧠'}
                  {hoveredSkill.category === 'hardware' && '🔧'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-xl)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--space-1)',
                }}>
                  {hoveredSkill.name}
                </h3>
                <span style={{
                  fontFamily: 'var(--font-caption)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: categoryColors[hoveredSkill.category] || 'var(--text-accent)',
                  marginBottom: 'var(--space-2)',
                  display: 'block',
                }}>
                  {categoryLabels[hoveredSkill.category]}
                </span>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 'var(--leading-normal)',
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-3)',
                }}>
                  {hoveredSkill.description}
                </p>
                <div style={{
                  height: '6px',
                  backgroundColor: 'var(--bg-input)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    style={{
                      width: `${hoveredSkill.proficiency * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, ${categoryColors[hoveredSkill.category] || 'var(--interactive-default)'}, ${categoryColors[hoveredSkill.category]?.replace('text-', 'glow-') || 'var(--glow-ember)'})`,
                      borderRadius: 'var(--radius-full)',
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${hoveredSkill.proficiency * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills Grid (2D Fallback / Mobile) */}
        <motion.div
          className="skills-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
            marginTop: 'var(--space-12)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.3 }}
        >
          {filteredOrbs.map((skill, i) => (
            <motion.article
              key={skill.id}
              className="skill-card"
              style={{
                padding: 'var(--space-5)',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-smooth)',
              }}
              whileHover={{
                borderColor: categoryColors[skill.category] || 'var(--border-default)',
                boxShadow: `var(--shadow-2), 0 0 20px -4px ${categoryColors[skill.category] || 'var(--glow-ember)'}`,
                y: -4,
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setHoveredSkill(skill); brassClick(); }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-3)',
              }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: categoryColors[skill.category] || 'var(--interactive-default)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: '1.125rem' }}>
                    {skill.category === 'frontend' && '⚛'}
                    {skill.category === 'backend' && '⚙'}
                    {skill.category === 'devops' && '☁'}
                    {skill.category === 'ai' && '🧠'}
                    {skill.category === 'hardware' && '🔧'}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-lg)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-1)',
                  }}>
                    {skill.name}
                  </h4>
                  <span style={{
                    fontFamily: 'var(--font-caption)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 500,
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    color: categoryColors[skill.category] || 'var(--text-accent)',
                  }}>
                    {categoryLabels[skill.category]}
                  </span>
                </div>
              </div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                lineHeight: 'var(--leading-normal)',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-3)',
              }}>
                {skill.description}
              </p>
              <div style={{
                height: '4px',
                backgroundColor: 'var(--bg-input)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}>
                <motion.div
                  style={{
                    width: `${skill.proficiency * 100}%`,
                    height: '100%',
                    background: `linear-gradient(90deg, ${categoryColors[skill.category] || 'var(--interactive-default)'}, ${categoryColors[skill.category]?.replace('text-', 'glow-') || 'var(--glow-ember)'})`,
                    borderRadius: 'var(--radius-full)',
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 + i * 0.03 }}
                />
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Keyboard hint */}
        <motion.p
          className="skills-hint"
          style={{
            marginTop: 'var(--space-12)',
            textAlign: 'center',
            fontFamily: 'var(--font-caption)',
            fontSize: 'var(--text-xs)',
            fontWeight: 400,
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-200px' }}
          transition={{ delay: 1.2 }}
        >
          Hover orbs in 3D view to see connections • Click for details
        </motion.p>
      </div>

      {/* Section dots */}
      <div
        className="skills-dots"
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

export default Skills;