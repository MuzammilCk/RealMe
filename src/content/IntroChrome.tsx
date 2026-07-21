import { motion } from 'motion/react';
import { COVER } from '../data/chapters';
import { useDiaryControls } from './useDiaryControls';

// Intro state only. Eyebrow (quiet mono, top-left) + a pulsing hint the user
// can click or keyboard-activate to begin. (02-DESIGN-SYSTEM.md layout)
export default function IntroChrome() {
  const { begin } = useDiaryControls();
  return (
    <>
      <motion.div
        className="pointer-events-none absolute left-8 top-8 font-mono text-xs uppercase tracking-[0.15em] text-parchment/55 sm:left-10 sm:top-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {COVER.eyebrow}
      </motion.div>

      <motion.button
        type="button"
        onClick={begin}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-xs tracking-[0.08em] text-brass/75 transition-opacity hover:text-brass focus-visible:text-brass"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.35, 0.9, 0.35] }}
        transition={{ opacity: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }, delay: 0.6 }}
        aria-label="Open the diary"
      >
        {COVER.hint}
      </motion.button>
    </>
  );
}
