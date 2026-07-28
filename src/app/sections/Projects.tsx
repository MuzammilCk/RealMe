import { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useScroll } from '../providers/ScrollProvider';
import { PROJECTS } from '../../data/projects';
import ProjectCard from '../../content/ProjectCard';
import { useAudio } from '../providers/AudioProvider';

gsap.registerPlugin(ScrollTrigger);

/**
 * Projects Section - Project scrolls on desk
 * ARCHITECTURE-v2 §3.2.4: Projects - Desk scrolls, pull toward camera on hover, open modal
 */
export function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { section: currentSection } = useScroll();
  const { diaryState, threeDEnabled, openProject, activeProject } = usePortfolioStore();
  const { success } = useAudio();

  // Camera behavior for projects section is handled by useSceneSync in the scene layer

  const handleProjectClick = (projectId: string) => {
    openProject(projectId);
    success();
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="projects-section"
      style={{
        minHeight: '100vh',
        padding: 'var(--space-16) var(--space-6)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="projects-heading"
    >
      {/* 3D Scene Background - Project Scrolls on Desk */}
      {threeDEnabled && diaryState === 'open' && (
        <div
          className="projects-3d-bg"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {/* The actual 3D scrolls are rendered in CanvasRoot via Props */}
          {/* This is just a placeholder for camera behavior */}
        </div>
      )}

      {/* UI Overlay */}
      <div
        className="projects-ui-overlay"
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: 'var(--container-wide)',
          margin: '0 auto',
          pointerEvents: 'auto',
        }}
      >
        {/* Section Header */}
        <motion.div
          className="projects-header"
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-12)',
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
            04 — Projects
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
            Things I&apos;ve Built
          </motion.h2>
        </motion.div>

        {/* Project Cards Grid */}
        <motion.div
          className="projects-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 'var(--space-6)',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.2 }}
        >
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              className="project-card-wrapper"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1 }}
            >
              <ProjectCard
                project={project}
                onOpen={handleProjectClick}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Active Project Detail Modal */}
        {activeProject && (
          <motion.div
            className="project-detail-modal"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-6)',
              backgroundColor: 'rgba(20, 11, 5, 0.9)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="project-detail-content"
              style={{
                width: '100%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'auto',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-4), var(--shadow-glow-ember)',
              }}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <div style={{ padding: 'var(--space-8)' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: 'var(--space-6)',
                  paddingBottom: 'var(--space-4)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}>
                  <div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: 'var(--space-2)',
                    }}>
                      {PROJECTS.find(p => p.id === activeProject)?.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-caption)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 500,
                      letterSpacing: 'var(--tracking-wide)',
                      textTransform: 'uppercase',
                      color: 'var(--text-accent)',
                    }}>
                      Click outside or press Esc to close
                    </p>
                  </div>
                  <motion.button
                    onClick={() => usePortfolioStore.getState().closeProject()}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      padding: 'var(--space-2)',
                    }}
                    whileHover={{ color: 'var(--text-accent)', scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'var(--text-base)',
                  lineHeight: 'var(--leading-relaxed)',
                  color: 'var(--text-secondary)',
                }}>
                  Project detail view would render here with full case study.
                  This integrates with the existing ProjectDetail component.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Keyboard hint */}
        <motion.p
          className="projects-hint"
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
          Hover project cards in 3D to pull them closer • Click to explore
        </motion.p>
      </div>

      {/* Section dots */}
      <div
        className="projects-dots"
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

export default Projects;