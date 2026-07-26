import { useEffect, useRef } from 'react';

/**
 * Konami Code Easter Egg Hook
 * Sequence: ↑ ↑ ↓ ↓ ← → ← → B A
 * ARCHITECTURE-v2 §4.4.2: Easter eggs - Konami code → mystery mode
 */
export function useKonamiCode(onActivate: () => void) {
  const sequenceRef = useRef<string[]>([]);
  const timeoutRef = useRef<number | null>(null);

  const KONAMI_SEQUENCE = [
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'KeyB',
    'KeyA',
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
      }

      const key = e.code;
      sequenceRef.current.push(key);

      // Keep only the last 10 keys
      if (sequenceRef.current.length > KONAMI_SEQUENCE.length) {
        sequenceRef.current.shift();
      }

      // Check for match
      if (sequenceRef.current.length === KONAMI_SEQUENCE.length) {
        const isMatch = sequenceRef.current.every((k, i) => k === KONAMI_SEQUENCE[i]);
        if (isMatch) {
          onActivate();
          sequenceRef.current = []; // Reset after activation
        }
      }

      // Reset sequence on timeout (2 seconds between keys)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        sequenceRef.current = [];
      }, 2000);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [onActivate]);
}

/**
 * Inkwell Click Easter Egg Hook
 * 7 clicks on the inkwell reveals secret compartment
 * ARCHITECTURE-v2 §4.4.2: Easter eggs - click inkwell 7× → secret
 */
export function useInkwellEasterEgg(
  onClick: () => void,
  threshold: number = 7,
  resetDelay: number = 5000
) {
  const clickCountRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClick = () => {
      clickCountRef.current++;

      if (clickCountRef.current >= threshold) {
        onClick();
        clickCountRef.current = 0;
        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        return;
      }

      // Reset count after delay
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, resetDelay);
    };

    // This is attached via ref to the inkwell element
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [onClick, threshold, resetDelay]);

  return { clickCount: clickCountRef.current };
}