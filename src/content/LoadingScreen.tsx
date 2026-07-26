import { motion, AnimatePresence } from 'framer-motion';

/**
 * Loading Screen - Procedural ink blot animation
 * ARCHITECTURE-v2 §4.4.3: Procedural ink blot animation, progress as "drying ink"
 */
export default function LoadingScreen({ done }: { done: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {!done && (
        <motion.div
          className="loading-screen"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-8)',
            backgroundColor: 'var(--bg-scene)',
            color: 'var(--text-primary)',
            pointerEvents: 'auto',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Ink blot animation container */}
          <div
            className="ink-blot-container"
            style={{
              position: 'relative',
              width: '180px',
              height: '180px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Base ink pool */}
            <motion.div
              className="ink-pool"
              style={{
                position: 'absolute',
                width: '120px',
                height: '120px',
                borderRadius: '50% 50% 48% 52% / 48% 48% 52% 50%',
                background: 'radial-gradient(ellipse at center, var(--parchment-900) 0%, #0a0503 70%, #050302 100%)',
                boxShadow: '0 0 40px -8px var(--ember-500 / 0.4), inset 0 -20px 40px rgba(0,0,0,0.5)',
                filter: 'blur(1px)',
              }}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{
                scale: [0.3, 1, 1.02, 1],
                opacity: [0, 1, 1, 1],
                borderRadius: [
                  '50% 50% 48% 52% / 48% 48% 52% 50%',
                  '45% 55% 50% 50% / 50% 48% 52% 50%',
                  '52% 48% 50% 50% / 48% 52% 50% 50%',
                  '50% 50% 48% 52% / 48% 48% 52% 50%',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Spreading ink tendrils */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="ink-tendril"
                style={{
                  position: 'absolute',
                  width: '8px',
                  height: '60px',
                  borderRadius: '4px',
                  background: 'linear-gradient(180deg, var(--ember-400), var(--parchment-900))',
                  transformOrigin: 'bottom center',
                  opacity: 0,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{
                  scaleY: [0, 1, 1, 0.8],
                  opacity: [0, 0.6, 0.6, 0],
                  rotate: [(i * 60) - 30, (i * 60) - 30, (i * 60) + 10, (i * 60) + 10],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut'
                }}
              />
            ))}

            {/* Floating particles */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={`particle-${i}`}
                className="ink-particle"
                style={{
                  position: 'absolute',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: i % 2 === 0 ? 'var(--ember-400)' : 'var(--brass-500)',
                  boxShadow: '0 0 10px currentColor',
                  opacity: 0,
                }}
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: [0, Math.cos(i * 45 * Math.PI / 180) * 80],
                  y: [0, Math.sin(i * 45 * Math.PI / 180) * 80],
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Central glyph - book symbol */}
            <motion.div
              className="ink-glyph"
              style={{
                position: 'relative',
                zIndex: 10,
                fontSize: '3rem',
                color: 'var(--text-accent)',
                filter: 'drop-shadow(0 0 20px var(--glow-ember))',
              }}
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: [0, 1, 1.05, 1],
                rotate: [-180, 0, 2, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              📖
            </motion.div>
          </div>

          {/* Title */}
          <motion.h1
            className="loading-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-4xl)',
              fontWeight: 700,
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--text-accent)',
              textAlign: 'center',
              maxWidth: '90%',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
          >
            The Diary of Me
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="loading-subtitle"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--text-base)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              maxWidth: '40ch',
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Opening the workshop... the lamp flickers, the ink dries.
          </motion.p>

          {/* Progress as "drying ink" */}
          <motion.div
            className="ink-progress"
            style={{
              width: '60%',
              maxWidth: '320px',
              height: '3px',
              backgroundColor: 'var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              position: 'relative',
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, var(--brass-700), var(--ember-400), var(--brass-500))',
                backgroundSize: '200% 100%',
                transformOrigin: 'left center',
                borderRadius: 'var(--radius-full)',
              }}
              animate={{
                scaleX: [0, 0.3, 0.6, 0.85, 1],
              }}
              transition={{ duration: 3, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            <motion.div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent, var(--brass-300 / 0.5), transparent)',
                backgroundSize: '50% 100%',
                animation: 'shimmer 1.5s easeInOut infinite',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
