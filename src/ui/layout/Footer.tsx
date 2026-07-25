import { motion } from 'framer-motion';
import { Flex } from './Section';
import { usePortfolioStore } from '../../store/usePortfolioStore';

/**
 * Footer - Copyright, social links, mystery quote
 * ARCHITECTURE-v2 §2: Brass icons, mystery quote
 */
export function Footer() {
  const { threeDEnabled } = usePortfolioStore();

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com', icon: 'github' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
    { label: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
    { label: 'Email', href: 'mailto:hello@example.com', icon: 'email' },
  ];

  const mysteryQuotes = [
    "The best code is written at 3 AM, fueled by coffee and curiosity.",
    "Hardware teaches you what software forgets: constraints are features.",
    "Every bug is a lesson wearing a disguise.",
    "The soldering iron and the keyboard are not so different.",
    "Ship it. Then make it better. Then make it right.",
  ];

  const randomQuote = mysteryQuotes[Math.floor(Math.random() * mysteryQuotes.length)];

  return (
    <footer
      style={{
        position: 'relative',
        padding: 'var(--space-12) 0 var(--space-8)',
        backgroundColor: 'var(--void-950)',
        borderTop: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <motion.div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(ellipse at center, var(--glow-brass) 0%, transparent 70%)',
          opacity: 0.03,
          pointerEvents: 'none',
        }}
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div style={{ maxWidth: 'var(--container-wide)', margin: '0 auto', padding: '0 var(--space-6)', position: 'relative', zIndex: 1 }}>
        <Flex direction="col" gap="var(--space-8)" align="center" style={{ textAlign: 'center' }}>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center' }}>
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-muted)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-caption)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '8px 12px',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '4px',
                  transition: 'all var(--duration-fast) var(--ease-smooth)',
                }}
                whileHover={{
                  color: 'var(--interactive-hover)',
                  borderColor: 'var(--interactive-hover)',
                  boxShadow: '0 0 20px -4px var(--glow-brass)',
                }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <SocialIcon name={social.icon} />
                {social.label}
              </motion.a>
            ))}
          </div>

          {/* Divider */}
          <motion.hr
            style={{
              width: '100%',
              maxWidth: '400px',
              border: 'none',
              background: 'linear-gradient(90deg, transparent, var(--border-default), transparent)',
              height: '1px',
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          />

          {/* Copyright & 3D Toggle */}
          <Flex direction="col" gap="var(--space-3)" align="center">
            <motion.p
              style={{
                fontFamily: 'var(--font-caption)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              © {new Date().getFullYear()} My Journey. Built with React, Three.js, and curiosity.
            </motion.p>

            <motion.button
              onClick={() => usePortfolioStore.getState().setThreeDEnabled(!threeDEnabled)}
              style={{
                background: 'none',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontFamily: 'var(--font-caption)',
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              whileHover={{
                borderColor: 'var(--interactive-default)',
                color: 'var(--interactive-default)',
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {threeDEnabled ? '🌐 3D Mode' : '📄 2D Mode'}
            </motion.button>
          </Flex>

          {/* Mystery Quote */}
          <motion.blockquote
            style={{
              marginTop: 'var(--space-6)',
              padding: 'var(--space-6)',
              borderLeft: '2px solid var(--border-default)',
              background: 'linear-gradient(90deg, var(--bg-card) 0%, transparent 100%)',
              borderRadius: '0 8px 8px 0',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '600px',
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            &ldquo;{randomQuote}&rdquo;
          </motion.blockquote>

        </Flex>
      </div>
    </footer>
  );
}

/**
 * Social Icon Components
 */
function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    github: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    linkedin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    twitter: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
      </svg>
    ),
    email: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  };

  return icons[name] || icons.github;
}

export default Footer;