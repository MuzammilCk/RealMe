import { lazy, Suspense, useRef, useEffect, useState, type ComponentType } from 'react';

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