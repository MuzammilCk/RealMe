import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { ChapterId } from '../data/chapters';
import { usePortfolioStore } from '../store/usePortfolioStore';
import IntroChrome from './IntroChrome';
import Spread from './Spread';
import ChapterDots from './ChapterDots';
import CloseButton from './CloseButton';
import About from './chapters/About';
import Skills from './chapters/Skills';
import Projects from './chapters/Projects';
import Experience from './chapters/Experience';
import Contact from './chapters/Contact';
import ProjectDetail from './ProjectDetail';

function renderContent(activeChapter: ChapterId | null, activeProject: string | null) {
  if (activeProject) return <ProjectDetail />;
  if (!activeChapter) return <Spread />;
  switch (activeChapter) {
    case 'about':
      return <About />;
    case 'skills':
      return <Skills />;
    case 'projects':
      return <Projects />;
    case 'experience':
      return <Experience />;
    case 'contact':
      return <Contact />;
  }
}

// Layer B root. Reads the store; never imports from scene/. Picks what to show
// from diaryState / activeChapter / activeProject and animates chapter switches
// as a short fade + translate (the "page turn" feel).
export default function Overlay() {
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const activeChapter = usePortfolioStore((s) => s.activeChapter);
  const activeProject = usePortfolioStore((s) => s.activeProject);
  const reduce = useReducedMotion();

  const showChrome = diaryState === 'closed' || diaryState === 'closing';
  const showDiary = diaryState === 'open' || diaryState === 'opening';
  const key = `${activeChapter ?? 'spread'}:${activeProject ?? ''}`;

  return (
    <div className="overlay">
      {showChrome && <IntroChrome />}

      {showDiary && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              className="pointer-events-auto flex w-full justify-center"
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -8 }}
              transition={{ duration: reduce ? 0.1 : 0.38, ease: 'easeInOut' }}
            >
              {renderContent(activeChapter, activeProject)}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {showDiary && <ChapterDots />}
      {showDiary && <CloseButton />}
    </div>
  );
}
