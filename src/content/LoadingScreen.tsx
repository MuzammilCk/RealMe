import { motion } from 'motion/react';

// Brief boot veil while device detection + asset warm-up runs. Fades out.
export default function LoadingScreen({ done }: { done: boolean }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-void"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ pointerEvents: done ? 'none' : 'auto' }}
      aria-hidden={done}
    >
      <div className="font-display text-brass text-2xl font-bold tracking-wide">MY JOURNEY</div>
      <div className="h-[2px] w-[200px] overflow-hidden bg-brass/20">
        <motion.div
          className="h-full bg-brass"
          initial={{ width: '0%' }}
          animate={{ width: done ? '100%' : '70%' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
