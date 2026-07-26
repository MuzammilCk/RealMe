import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useScroll } from '../providers/ScrollProvider';
import { CONTACT } from '../../data/chapters';
import { useAudio } from '../providers/AudioProvider';

gsap.registerPlugin(ScrollTrigger);

/**
 * Contact Section - Inkwell + Quill Form
 * ARCHITECTURE-v2 §3.2.5: Contact - Inkwell form, quill writing animation, brass send, easter egg
 */
export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { section: currentSection } = useScroll();
  const { diaryState, threeDEnabled } = usePortfolioStore();
  const { camera } = useThree();
  const { brassClick, inkScratch, success, emberWhoosh } = useAudio();

  const [formState, setFormState] = useState<{
    name: string;
    email: string;
    subject: string;
    message: string;
  }>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [fieldFocus, setFieldFocus] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [inkwellClicks, setInkwellClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inkwellRef = useRef<HTMLDivElement>(null);

  // Camera behavior for contact section
  useEffect(() => {
    if (!threeDEnabled || diaryState !== 'open' || currentSection !== 'contact') return;

    // Position camera above inkwell
    gsap.to(camera.position, {
      x: 0,
      y: 3.2,
      z: 4.8,
      duration: 1.5,
      ease: 'power3.inOut',
      onUpdate: () => camera.lookAt(0, 0.5, 0),
    });
  }, [currentSection, threeDEnabled, diaryState, camera]);

  // Handle form input with ink writing animation
  const handleInputChange = (field: string, value: string) => {
    setFormState(prev => ({ ...prev, [field]: value }));
    if (value.length === 1) {
      inkScratch(); // Play ink sound on first character
    }
  };

  const handleFocus = (field: string) => {
    setFieldFocus(field);
    brassClick();
  };

  const handleBlur = () => {
    setFieldFocus(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    // Simulate sending
    setSubmitted(true);
    success();

    // Create mailto link
    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(formState.subject || 'Portfolio Contact')}&body=${encodeURIComponent(
      `From: ${formState.name} (${formState.email})\n\n${formState.message}`
    )}`;
    window.location.href = mailto;

    // Reset after delay
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  // Inkwell easter egg
  const handleInkwellClick = () => {
    const clicks = inkwellClicks + 1;
    setInkwellClicks(clicks);
    brassClick();

    if (clicks >= 7) {
      setShowEasterEgg(true);
      emberWhoosh();
      // Reset after showing
      setTimeout(() => {
        setInkwellClicks(0);
        setShowEasterEgg(false);
      }, 5000);
    }
  };

  // Field configurations
  const fields = [
    { name: 'name', label: 'Your Name', type: 'text', placeholder: 'A. Craftsman', required: true },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'artisan@workshop.dev', required: true },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Commission / Collaboration / Curiosity', required: false },
    { name: 'message', label: 'Message', type: 'textarea', placeholder: 'What brings you to my desk?', required: true },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="contact-section"
      style={{
        minHeight: '100vh',
        padding: 'var(--space-16) var(--space-6)',
        position: 'relative',
        overflow: 'hidden',
      }}
      aria-labelledby="contact-heading"
    >
      {/* 3D Background - Inkwell on Desk */}
      {threeDEnabled && diaryState === 'open' && (
        <div
          className="contact-3d-bg"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {/* Inkwell and quill rendered in CanvasRoot */}
        </div>
      )}

      {/* UI Overlay */}
      <div
        className="contact-ui-overlay"
        style={{
          position: 'relative',
          zIndex: 20,
          maxWidth: 'var(--container-content)',
          margin: '0 auto',
          pointerEvents: 'auto',
        }}
      >
        {/* Section Header */}
        <motion.div
          className="contact-header"
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
            05 — Contact
          </motion.p>
          <motion.h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-4xl)',
              fontWeight: 600,
              lineHeight: 'var(--leading-snug)',
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--text-primary)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Send a Letter
          </motion.h2>
          <motion.p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-lg)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--text-secondary)',
              maxWidth: '50ch',
              margin: '0 auto',
            }}
          >
            {CONTACT.lead}
          </motion.p>
        </motion.div>

        {/* Inkwell Form */}
        <motion.div
          className="inkwell-form-container"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-12)',
            alignItems: 'start',
            maxWidth: '900px',
            margin: '0 auto',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ delay: 0.2 }}
        >
          {/* Left: Inkwell Visual */}
          <motion.div
            className="inkwell-visual"
            ref={inkwellRef}
            onClick={handleInkwellClick}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-8)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all var(--duration-base) var(--ease-smooth)',
            }}
            whileHover={{
              borderColor: 'var(--border-default)',
              boxShadow: 'var(--shadow-2), var(--shadow-glow-ember)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Inkwell */}
            <div className="inkwell" style={{
              position: 'relative',
              width: '120px',
              height: '140px',
              marginBottom: 'var(--space-6)',
            }}>
              {/* Inkwell base */}
              <motion.div
                className="inkwell-base"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                  background: 'linear-gradient(180deg, var(--leather-900), var(--leather-700))',
                  border: '2px solid var(--brass-700)',
                  borderBottom: 'none',
                  boxShadow: 'inset 0 -20px 40px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.4)',
                }}
              />
              {/* Ink liquid */}
              <motion.div
                className="inkwell-ink"
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '88px',
                  height: '70px',
                  borderRadius: '0 0 50% 50%',
                  background: 'linear-gradient(180deg, var(--parchment-900), #0a0503)',
                  boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.5)',
                  overflow: 'hidden',
                }}
              >
                {/* Ink surface ripple */}
                <motion.div
                  className="ink-ripple"
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '1px solid var(--brass-500 / 0.3)',
                    opacity: 0,
                  }}
                  animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1.2, 1.5] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </motion.div>
              {/* Quill */}
              <motion.div
                className="quill"
                style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-20px',
                  width: '8px',
                  height: '140px',
                  transformOrigin: 'bottom center',
                  transform: 'rotate(-25deg)',
                }}
              >
                <motion.div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(180deg, var(--brass-500), var(--brass-900))',
                    borderRadius: '4px',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                  }}
                >
                  {/* Feather */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%) rotate(-15deg)',
                      width: '24px',
                      height: '50px',
                      background: 'linear-gradient(180deg, #fff, var(--parchment-300))',
                      borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Inkwell label */}
            <p style={{
              fontFamily: 'var(--font-caption)',
              fontSize: 'var(--text-xs)',
              fontWeight: 400,
              letterSpacing: 'var(--tracking-wider)',
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              textAlign: 'center',
            }}>
              Click the inkwell 7× for a surprise
            </p>

            {/* Easter egg */}
            <AnimatePresence>
              {showEasterEgg && (
                <motion.div
                  className="easter-egg"
                  style={{
                    position: 'absolute',
                    bottom: 'var(--space-8)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: 'var(--space-4) var(--space-6)',
                    backgroundColor: 'var(--mystery-500 / 0.2)',
                    border: '1px solid var(--mystery-400)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    maxWidth: '280px',
                  }}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <p style={{
                    fontFamily: 'var(--font-eyebrow)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--mystery-400)',
                    marginBottom: 'var(--space-2)',
                  }}>
                    ✦ The Secret Compartment ✦
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--leading-relaxed)',
                  }}>
                    You found the hidden drawer. Some things are meant to be discovered, not displayed.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Form */}
          <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="inkwell-form"
            style={{
              padding: 'var(--space-8)',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
            }}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ delay: 0.3 }}
          >
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-5)',
            }}>
              {fields.map((field, i) => (
                <motion.div
                  key={field.name}
                  className="form-field"
                  style={{ position: 'relative' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  <label
                    htmlFor={field.name}
                    style={{
                      position: 'absolute',
                      top: fieldFocus === field.name ? '-24px' : 'var(--space-4)',
                      left: 'var(--space-4)',
                      fontFamily: fieldFocus === field.name ? 'var(--font-caption)' : 'var(--font-body)',
                      fontSize: fieldFocus === field.name ? 'var(--text-xs)' : 'var(--text-base)',
                      fontWeight: fieldFocus === field.name ? 500 : 400,
                      letterSpacing: fieldFocus === field.name ? 'var(--tracking-wide)' : 'var(--tracking-normal)',
                      textTransform: fieldFocus === field.name ? 'uppercase' : 'none',
                      color: fieldFocus === field.name ? 'var(--text-accent)' : 'var(--text-secondary)',
                      pointerEvents: 'none',
                      transition: 'all var(--duration-fast) var(--ease-spring)',
                      backgroundColor: fieldFocus === field.name ? 'var(--bg-card)' : 'transparent',
                      padding: fieldFocus === field.name ? '0 var(--space-2)' : 0,
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    {field.label} {field.required && (
                      <span style={{ color: 'var(--ember-400)' }}>*</span>
                    )}
                  </label>

                  {field.type === 'textarea' ? (
                    <motion.textarea
                      id={field.name}
                      name={field.name}
                      value={formState[field.name as keyof typeof formState]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      onFocus={() => handleFocus(field.name)}
                      onBlur={handleBlur}
                      placeholder={field.placeholder}
                      required={field.required}
                      rows={5}
                      style={{
                        width: '100%',
                        padding: 'var(--space-4)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-base)',
                        lineHeight: 'var(--leading-relaxed)',
                        color: 'var(--text-primary)',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        resize: 'vertical',
                        minHeight: '120px',
                        outline: 'none',
                        transition: 'all var(--duration-fast) var(--ease-smooth)',
                      }}
                      whileFocus={{
                        borderColor: 'var(--interactive-default)',
                        boxShadow: '0 0 0 3px var(--brass-700 / 0.2)',
                      }}
                    />
                  ) : (
                    <motion.input
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      value={formState[field.name as keyof typeof formState]}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      onFocus={() => handleFocus(field.name)}
                      onBlur={handleBlur}
                      placeholder={field.placeholder}
                      required={field.required}
                      style={{
                        width: '100%',
                        padding: 'var(--space-4)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 'var(--text-base)',
                        lineHeight: 'var(--leading-relaxed)',
                        color: 'var(--text-primary)',
                        backgroundColor: 'var(--bg-input)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        outline: 'none',
                        transition: 'all var(--duration-fast) var(--ease-smooth)',
                      }}
                      whileFocus={{
                        borderColor: 'var(--interactive-default)',
                        boxShadow: '0 0 0 3px var(--brass-700 / 0.2)',
                      }}
                    />
                  )}

                  {/* Ink trail animation */}
                  <motion.div
                    className="ink-trail"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      height: '2px',
                      background: `linear-gradient(90deg, var(--interactive-default), var(--glow-ember))`,
                      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                      transformOrigin: 'left center',
                    }}
                    animate={{
                      scaleX: formState[field.name as keyof typeof formState] ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                  />
                </motion.div>
              ))}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitted || !formState.name || !formState.email || !formState.message}
                className="inkwell-submit"
                style={{
                  marginTop: 'var(--space-4)',
                  padding: 'var(--space-4) var(--space-8)',
                  fontFamily: 'var(--font-caption)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--text-inverse)',
                  backgroundColor: submitted ? 'var(--text-muted)' : 'var(--interactive-default)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--radius-base)',
                  cursor: submitted ? 'not-allowed' : 'pointer',
                  opacity: submitted ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-3)',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                }}
                whileHover={
                  !submitted
                    ? {
                        backgroundColor: 'var(--interactive-hover)',
                        borderColor: 'var(--border-strong)',
                        boxShadow: 'var(--shadow-glow-brass)',
                        scale: 1.02,
                      }
                    : undefined
                }
                whileTap={!submitted ? { scale: 0.98 } : undefined}
              >
                {submitted ? (
                  <>
                    <motion.span
                      className="spinner"
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid currentColor',
                        borderRightColor: 'transparent',
                        borderRadius: '50%',
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    />
                    <span>Sending...</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </>
                ) : (
                  <>
                    <span>{CONTACT.cta}</span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </motion.button>

              {/* Direct links */}
              <div style={{
                marginTop: 'var(--space-6)',
                paddingTop: 'var(--space-6)',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}>
                <p style={{
                  fontFamily: 'var(--font-caption)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 500,
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}>
                  Or reach me directly:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {CONTACT.email}
                  </a>
                  <a
                    href={`https://${CONTACT.github}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {CONTACT.github}
                  </a>
                  <a
                    href={`https://${CONTACT.linkedin}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'underline',
                      textUnderlineOffset: '4px',
                      transition: 'color var(--duration-fast) var(--ease-smooth)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-accent)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    {CONTACT.linkedin}
                  </a>
                </div>
              </div>
            </div>
          </motion.form>
        </motion.div>

        {/* Closing note */}
        <motion.p
          className="contact-closing"
          style={{
            marginTop: 'var(--space-12)',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            fontStyle: 'italic',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--text-muted)',
            maxWidth: '50ch',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-200px' }}
          transition={{ delay: 1.0 }}
        >
          "The best code, like the best ink, outlives its author."
        </motion.p>
      </div>

      {/* Section dots */}
      <div
        className="contact-dots"
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

export default Contact;