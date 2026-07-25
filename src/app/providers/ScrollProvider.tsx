import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollContextValue {
  /** Normalized scroll progress 0-1 across the entire page */
  progress: number;
  /** Current active section based on scroll position */
  section: string | null;
  /** Scroll direction: 1 = down, -1 = up */
  direction: number;
  /** Scroll velocity in pixels per second */
  velocity: number;
  /** Register a section for scroll tracking */
  registerSection: (id: string, element: HTMLElement | null) => () => void;
  /** Scroll to a specific section */
  scrollToSection: (id: string) => void;
  /** Get scroll progress for a specific section */
  getSectionProgress: (id: string) => number;
}

const ScrollContext = createContext<ScrollContextValue | null>(null);

interface SectionRef {
  id: string;
  element: HTMLElement | null;
  trigger: ScrollTrigger | null;
  progress: number;
  start: number;
  end: number;
}

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState<string | null>(null);
  const [direction, setDirection] = useState(1);
  const [velocity, setVelocity] = useState(0);
  const [sections, setSections] = useState<Map<string, SectionRef>>(new Map());
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  // Global scroll progress trigger
  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        setProgress(self.progress);

        // Calculate velocity
        const now = performance.now();
        const deltaY = self.scroll() - lastScrollY;
        const deltaTime = now - lastTime;
        if (deltaTime > 0) {
          setVelocity((deltaY / deltaTime) * 1000); // px/s
        }
        setLastScrollY(self.scroll());
        setLastTime(now);

        // Direction
        setDirection(self.direction);
      },
    });

    return () => scrollTrigger.kill();
  }, [lastScrollY, lastTime]);

  // Section registration
  const registerSection = useCallback((id: string, element: HTMLElement | null) => {
    if (!element) return () => {};

    const sectionTrigger = ScrollTrigger.create({
      trigger: element,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setSection(id),
      onEnterBack: () => setSection(id),
      onLeave: () => {
        if (section === id) setSection(null);
      },
      onLeaveBack: () => {
        if (section === id) setSection(null);
      },
      onUpdate: (self) => {
        setSections((prev) => {
          const next = new Map(prev);
          const existing = next.get(id);
          if (existing) {
            next.set(id, { ...existing, progress: self.progress, start: self.start, end: self.end });
          } else {
            next.set(id, { id, element, trigger: sectionTrigger, progress: self.progress, start: self.start, end: self.end });
          }
          return next;
        });
      },
    });

    setSections((prev) => {
      const next = new Map(prev);
      next.set(id, { id, element, trigger: sectionTrigger, progress: 0, start: 0, end: 0 });
      return next;
    });

    return () => {
      sectionTrigger.kill();
      setSections((prev) => {
        const next = new Map(prev);
        next.delete(id);
        return next;
      });
    };
  }, [section]);

  // Scroll to section
  const scrollToSection = useCallback((id: string) => {
    const sectionData = sections.get(id);
    if (sectionData?.element) {
      gsap.to(window, {
        scrollTo: { y: sectionData.element, offsetY: 80 },
        duration: 1.2,
        ease: 'power3.inOut',
      });
    }
  }, [sections]);

  // Get section progress
  const getSectionProgress = useCallback((id: string) => {
    return sections.get(id)?.progress ?? 0;
  }, [sections]);

  const value: ScrollContextValue = {
    progress,
    section,
    direction,
    velocity,
    registerSection,
    scrollToSection,
    getSectionProgress,
  };

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}