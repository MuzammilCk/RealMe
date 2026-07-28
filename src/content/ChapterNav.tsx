import { motion, useReducedMotion } from 'framer-motion';
import { CHAPTERS } from '../data/chapters';
import { usePortfolioStore } from '../store/usePortfolioStore';

// Chapter list (right page of the spread, and reusable). The active chapter's
// brass underline slides between items via a shared layoutId — no pop.
export default function ChapterNav() {
  const activeChapter = usePortfolioStore((s) => s.activeChapter);
  const goToChapter = usePortfolioStore((s) => s.goToChapter);
  const reduce = useReducedMotion();

  return (
    <ul className="m-0 list-none p-0">
      {CHAPTERS.map((ch) => {
        const active = activeChapter === ch.id;
        return (
          <li key={ch.id}>
            <button
              type="button"
              onClick={() => goToChapter(ch.id)}
              aria-current={active ? 'true' : undefined}
              className={`group flex w-full items-baseline gap-3.5 border-b border-leather/10 py-3 text-left font-display text-xl transition-colors ${
                active ? 'text-leather' : 'text-leather/70 hover:text-leather'
              }`}
            >
              <span className="font-mono text-xs text-brass-dim">{ch.num}</span>
              <span className="relative">
                {ch.title}
                {active && (
                  <motion.span
                    layoutId="chapter-underline"
                    className="absolute -bottom-1 left-0 h-[2px] w-full bg-brass"
                    transition={
                      reduce ? { duration: 0 } : { type: 'spring', stiffness: 380, damping: 30 }
                    }
                  />
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
