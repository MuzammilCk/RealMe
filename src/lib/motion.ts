import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP Animation Presets
 * ARCHITECTURE-v2 §6: Spring physics, staggered reveals, micro-interactions
 */

// Easing curves from locked design tokens
export const easings = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  expoOut: 'cubic-bezier(0.19, 1, 0.22, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Duration tokens
export const durations = {
  instant: 0.05,
  fast: 0.15,
  base: 0.3,
  slow: 0.5,
  major: 0.8,
  cinematic: 1.2,
} as const;

/**
 * Reveal up - Standard entrance animation
 */
export function revealUp(
  elements: gsap.TweenTarget,
  options: { delay?: number; stagger?: number; duration?: number; ease?: string } = {}
) {
  return gsap.fromTo(
    elements,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration ?? durations.base,
      ease: options.ease ?? easings.spring,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0,
      clearProps: 'all',
    }
  );
}

/**
 * Reveal fade - Simple fade in
 */
export function revealFade(
  elements: gsap.TweenTarget,
  options: { delay?: number; stagger?: number; duration?: number; ease?: string } = {}
) {
  return gsap.fromTo(
    elements,
    { opacity: 0 },
    {
      opacity: 1,
      duration: options.duration ?? durations.base,
      ease: options.ease ?? easings.smooth,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0,
      clearProps: 'all',
    }
  );
}

/**
 * Reveal scale - Scale up from center
 */
export function revealScale(
  elements: gsap.TweenTarget,
  options: { delay?: number; stagger?: number; duration?: number; ease?: string; from?: number } = {}
) {
  return gsap.fromTo(
    elements,
    { scale: options.from ?? 0.9, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: options.duration ?? durations.base,
      ease: options.ease ?? easings.spring,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0,
      clearProps: 'all',
    }
  );
}

/**
 * Stagger children - For container with multiple children
 */
export function staggerChildren(
  container: gsap.TweenTarget,
  options: { delay?: number; stagger?: number; duration?: number; ease?: string; from?: 'start' | 'center' | 'end' } = {}
) {
  const children = gsap.utils.toArray(container);
  return gsap.fromTo(
    children,
    { y: 20, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration ?? durations.base,
      ease: options.ease ?? easings.spring,
      delay: options.delay ?? 0,
      stagger: {
        each: options.stagger ?? 0.1,
        from: options.from ?? 'start',
      },
      clearProps: 'all',
    }
  );
}

/**
 * Page turn animation - For diary page transitions
 */
export function pageTurn(
  pageElement: gsap.TweenTarget,
  direction: 'forward' | 'backward',
  options: { duration?: number; ease?: string; onComplete?: () => void } = {}
) {
  const isForward = direction === 'forward';
  const rotation = isForward ? -Math.PI : 0;
  const targetRotation = isForward ? 0 : Math.PI;

  return gsap.fromTo(
    pageElement,
    { rotationY: rotation, transformOrigin: 'left center' },
    {
      rotationY: targetRotation,
      duration: options.duration ?? durations.major,
      ease: options.ease ?? easings.expoOut,
      transformOrigin: 'left center',
      onComplete: options.onComplete,
      clearProps: 'all',
    }
  );
}

/**
 * Orb float - Continuous floating animation for skill orbs
 */
export function orbFloat(
  elements: gsap.TweenTarget,
  options: { duration?: number; yAmount?: number; xAmount?: number; delay?: number; stagger?: number } = {}
) {
  return gsap.to(elements, {
    y: `+=${options.yAmount ?? 0.15}`,
    x: `+=${options.xAmount ?? 0.05}`,
    duration: options.duration ?? 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: options.delay ?? 0,
    stagger: options.stagger ?? 0.1,
  });
}

/**
 * Glow pulse - Pulsing glow effect for interactive elements
 */
export function glowPulse(
  elements: gsap.TweenTarget,
  options: { duration?: number; scale?: number; glowColor?: string; delay?: number } = {}
) {
  return gsap.to(elements, {
    scale: options.scale ?? 1.05,
    boxShadow: `0 0 20px -4px ${options.glowColor ?? '#ff9d52'}, 0 0 40px -8px ${options.glowColor ?? '#ff9d52'}80`,
    duration: options.duration ?? 1.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: options.delay ?? 0,
  });
}

/**
 * Magnetic hover - Element follows cursor within bounds
 */
export function magneticHover(
  element: HTMLElement,
  options: { strength?: number; bounds?: number; ease?: string } = {}
) {
  let animation: gsap.core.Tween | null = null;

  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * (options.strength ?? 0.3);
    const deltaY = (e.clientY - centerY) * (options.strength ?? 0.3);

    const boundedX = gsap.utils.clamp(-(options.bounds ?? 20), options.bounds ?? 20, deltaX);
    const boundedY = gsap.utils.clamp(-(options.bounds ?? 20), options.bounds ?? 20, deltaY);

    if (animation) animation.kill();

    animation = gsap.to(element, {
      x: boundedX,
      y: boundedY,
      duration: 0.3,
      ease: options.ease ?? 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (animation) animation.kill();
    animation = gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
    if (animation) animation.kill();
  };
}

/**
 * Text reveal - Character/word/line by line
 */
export function textReveal(
  elements: gsap.TweenTarget,
  options: { type?: 'chars' | 'words' | 'lines'; delay?: number; stagger?: number; duration?: number; ease?: string } = {}
) {
  const splitType = options.type ?? 'words';
  const stagger = options.stagger ?? (splitType === 'chars' ? 0.02 : 0.05);

  return gsap.fromTo(
    elements,
    { y: splitType === 'lines' ? 30 : 0, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: options.duration ?? durations.base,
      ease: options.ease ?? easings.spring,
      delay: options.delay ?? 0,
      stagger,
      clearProps: 'all',
    }
  );
}

/**
 * Scroll-triggered reveal - For sections entering viewport
 */
export function scrollReveal(
  elements: gsap.TweenTarget | Element | string,
  options: {
    trigger?: Element | string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    delay?: number;
    stagger?: number;
    duration?: number;
    ease?: string;
    from?: gsap.TweenVars;
    to?: gsap.TweenVars;
  } = {}
) {
  const defaultFrom = { y: 50, opacity: 0 };
  const defaultTo = { y: 0, opacity: 1 };

  return gsap.fromTo(
    elements,
    options.from ?? defaultFrom,
    {
      ...defaultTo,
      ...options.to,
      duration: options.duration ?? durations.slow,
      ease: options.ease ?? easings.expoOut,
      delay: options.delay ?? 0,
      stagger: options.stagger ?? 0,
      scrollTrigger: {
        trigger: options.trigger ?? (typeof elements === 'string' ? elements : undefined),
        start: options.start ?? 'top 80%',
        end: options.end ?? 'bottom 20%',
        scrub: options.scrub ?? false,
        toggleActions: options.scrub ? undefined : 'play none none reverse',
      },
      clearProps: 'all',
    }
  );
}

/**
 * Parallax scroll - Element moves at different speed than scroll
 */
export function parallaxScroll(
  elements: Element | string,
  options: { speed?: number; trigger?: Element | string; start?: string; end?: string } = {}
) {
  return gsap.to(elements, {
    yPercent: -50 * (options.speed ?? 0.5),
    ease: 'none',
    scrollTrigger: {
      trigger: options.trigger ?? elements,
      start: options.start ?? 'top bottom',
      end: options.end ?? 'bottom top',
      scrub: true,
    },
  });
}

/**
 * Cinematic camera move - For 3D camera transitions
 */
export function cinematicCameraMove(
  camera: THREE.Camera,
  targetPosition: THREE.Vector3,
  targetLookAt: THREE.Vector3,
  options: { duration?: number; ease?: string; onComplete?: () => void } = {}
) {
  const currentLookAt = new THREE.Vector3();
  camera.getWorldDirection(currentLookAt);
  currentLookAt.add(camera.position);

  const tl = gsap.timeline({ onComplete: options.onComplete });

  tl.to(camera.position, {
    x: targetPosition.x,
    y: targetPosition.y,
    z: targetPosition.z,
    duration: options.duration ?? durations.cinematic,
    ease: options.ease ?? easings.expoOut,
  }, 0);

  tl.to(currentLookAt, {
    x: targetLookAt.x,
    y: targetLookAt.y,
    z: targetLookAt.z,
    duration: options.duration ?? durations.cinematic,
    ease: options.ease ?? easings.expoOut,
    onUpdate: () => {
      camera.lookAt(currentLookAt);
    },
  }, 0);

  return tl;
}

/**
 * Particle burst - For section transitions
 */
export function particleBurst(
  particleSystem: { burst: (count: number, position: THREE.Vector3, color: number) => void },
  options: { count?: number; position?: THREE.Vector3; color?: number } = {}
) {
  particleSystem.burst(
    options.count ?? 50,
    options.position ?? new THREE.Vector3(0, 1.5, 0),
    options.color ?? 0xff9d52
  );
}

/**
 * Ink bleed trigger - For page turn moments
 */
export function triggerInkBleed(
  inkBleedEffect: { activate: (duration?: number) => void },
  options: { duration?: number } = {}
) {
  inkBleedEffect.activate(options.duration ?? 1.5);
}

/**
 * Create a timeline for complex sequenced animations
 */
export function createSequence() {
  return gsap.timeline({
    defaults: { ease: easings.smooth },
  });
}

/**
 * Hero intro sequence - 1200ms cinematic intro
 */
export function heroIntroSequence(
  elements: {
    title: Element | string;
    subtitle: Element | string;
    scrollHint: Element | string;
    diary: THREE.Object3D;
  },
  camera: THREE.Camera
) {
  const tl = gsap.timeline({ defaults: { ease: easings.expoOut } });

  // Camera starts close to diary, pulls back
  tl.to(camera.position, {
    x: 0,
    y: 4.0,
    z: 6.4,
    duration: 1.2,
    ease: easings.expoOut,
  }, 0);

  // Diary cover opens slightly
  tl.to(elements.diary.rotation, {
    z: 0.15,
    duration: 0.8,
    ease: easings.spring,
  }, 0.3);

  // Title reveal
  tl.fromTo(elements.title,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: easings.spring },
    0.4
  );

  // Subtitle reveal
  tl.fromTo(elements.subtitle,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: easings.smooth },
    0.6
  );

  // Scroll hint appears last
  tl.fromTo(elements.scrollHint,
    { opacity: 0, scale: 0.8 },
    { opacity: 1, scale: 1, duration: 0.5, ease: easings.spring },
    0.9
  );

  // Gentle camera idle drift starts after intro
  tl.call(() => {
    // CameraRig will handle idle drift
  }, [], 1.2);

  return tl;
}