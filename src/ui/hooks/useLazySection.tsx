import { lazy, Suspense, useRef, useEffect, useState, type ComponentType } from 'react';
import { motion } from 'framer-motion';

/**
 * Lazy-loaded section wrapper with suspense fallback
 * ARCHITECTURE-v2 §4.3.3: Lazy load heavy sections via React.lazy + Suspense
 */
interface LazySectionProps {
  /** The lazy-loaded component */
  children: React.ReactNode;
  /** Fallback content while loading */
  fallback?: React.ReactNode;
  /** ID for the section (used for intersection observer) */
  id?: string;
  /** Whether to preload on idle */
  preload?: boolean;
}

export function LazySection({
  children,
  fallback,
  id,
  preload = false,
}: LazySectionProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Preload when element is near viewport
  useEffect(() => {
    if (!preload || !id || isLoaded) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '500px' }
    );

    const element = document.getElementById(id);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [id, preload, isLoaded]);

  return (
    <div ref={elementRef} id={id}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </div>
  );
}

/**
 * Skeleton placeholder for section loading
 */
function SectionSkeleton() {
  return (
    <motion.div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'var(--space-6)',
        padding: 'var(--space-16) var(--space-6)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        style={{
          width: '60%',
          maxWidth: '600px',
          height: '4px',
          background: 'var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
        }}
        animate={{ scaleX: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, var(--interactive-default), var(--interactive-hover), var(--glow-ember))',
            transformOrigin: 'left center',
          }}
          animate={{ scaleX: [0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </motion.div>
      <p style={{
        fontFamily: 'var(--font-caption)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-muted)',
        letterSpacing: 'var(--tracking-wider)',
        textTransform: 'uppercase',
      }}>
        Loading section...
      </p>
    </motion.div>
  );
}

/**
 * Creates a lazy-loaded section component
 * Usage: const LazySkills = createLazySection(() => import('./sections/Skills'), 'skills');
 */
export function createLazySection<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  sectionId: string,
  fallback?: React.ReactNode
) {
  const LazyComponent = lazy(importFn);

  return function LazySectionWrapper(props: React.ComponentProps<T>) {
    return (
      <LazySection id={sectionId} preload fallback={fallback}>
        <LazyComponent {...props} />
      </LazySection>
    );
  };
}

/**
 * Hook for intersection observer based lazy loading
 */
export function useIntersectionObserver(
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return [elementRef, isIntersecting] as const;
}