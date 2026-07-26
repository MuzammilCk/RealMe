import { useEffect, useState } from 'react';

/**
 * Hook to detect prefers-reduced-motion media query
 * Returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}

/**
 * Hook to get reduced motion config for Framer Motion
 * Returns transition config that respects user preference
 */
export function useReducedMotionConfig() {
  const prefersReduced = useReducedMotion();

  return {
    transition: prefersReduced
      ? { duration: 0 }
      : { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }, // ease-spring
  };
}