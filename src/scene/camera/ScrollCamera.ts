import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

// Register ScrollTrigger plugin
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ScrollCamera - GSAP ScrollTrigger driven camera animation
 * ARCHITECTURE-v2 §7: Scroll-linked camera dolly
 * Maps scroll progress to camera position, rotation, FOV
 */

export interface CameraKeyframe {
  progress: number; // 0-1 scroll progress
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  fov?: number;
  lookAt?: THREE.Vector3;
  ease?: string;
}

export interface ScrollCameraConfig {
  camera: THREE.Camera;
  keyframes: CameraKeyframe[];
  scrollElement?: HTMLElement | string;
  scrub?: number | boolean;
  immediateRender?: boolean;
  onProgress?: (progress: number) => void;
}

export class ScrollCamera {
  private camera: THREE.Camera;
  private keyframes: CameraKeyframe[];
  private timeline: gsap.core.Timeline | null = null;
  private scrollTrigger: ScrollTriggerType | null = null;
  private isActive = false;
  private config: ScrollCameraConfig;
  private destroyCallbacks: (() => void)[] = [];
  private progressCallbacks: ((progress: number) => void)[] = [];

  constructor(config: ScrollCameraConfig) {
    this.camera = config.camera;
    this.keyframes = config.keyframes.sort((a, b) => a.progress - b.progress);
    this.config = config;
    this.init();
  }

  private init() {
    // Build GSAP timeline from keyframes
    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: this.config.scrollElement || 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: this.config.scrub ?? 1,
        immediateRender: this.config.immediateRender ?? true,
        onUpdate: (self: any) => {
          this.config.onProgress?.(self.progress);
        },
      },
    });

    // Add keyframe animations to timeline
    this.keyframes.forEach((kf, i) => {
      if (i === 0) return; // First keyframe is starting position

      const prevKf = this.keyframes[i - 1];
      const duration = kf.progress - prevKf.progress;

      // Position animation
      if (kf.position) {
        this.timeline!.to(this.camera.position, {
          x: kf.position.x,
          y: kf.position.y,
          z: kf.position.z,
          duration: duration * 100, // Convert to percentage for timeline
          ease: kf.ease || 'power3.inOut',
        }, prevKf.progress * 100);
      }

      // Rotation animation
      if (kf.rotation) {
        this.timeline!.to(this.camera.rotation, {
          x: kf.rotation.x,
          y: kf.rotation.y,
          z: kf.rotation.z,
          duration: duration * 100,
          ease: kf.ease || 'power3.inOut',
        }, prevKf.progress * 100);
      }

      // FOV animation
      if (kf.fov && 'fov' in this.camera) {
        const cameraWithFov = this.camera as THREE.PerspectiveCamera;
        this.timeline!.to(cameraWithFov, {
          fov: kf.fov,
          duration: duration * 100,
          ease: kf.ease || 'power3.inOut',
          onUpdate: () => {
            cameraWithFov.updateProjectionMatrix();
          },
        }, prevKf.progress * 100);
      }

      // LookAt animation (custom)
      if (kf.lookAt) {
        this.timeline!.to({}, {
          duration: duration * 100,
          ease: kf.ease || 'power3.inOut',
          onUpdate: () => {
            const progress = this.timeline!.progress();
            const t = (progress - prevKf.progress) / duration;
            const eased = gsap.parseEase(kf.ease || 'power3.inOut')(t);

            // Slerp lookAt
            const currentLookAt = new THREE.Vector3();
            currentLookAt.lerpVectors(prevKf.lookAt || new THREE.Vector3(0, 0.35, 0), kf.lookAt!, eased);
            this.camera.lookAt(currentLookAt);
          },
        }, prevKf.progress * 100);
      }
    });

    this.isActive = true;
  }

  /**
   * Update camera to specific progress (0-1) without scroll
   */
  setProgress(progress: number, immediate = false) {
    if (!this.timeline) return;

    const clampedProgress = THREE.MathUtils.clamp(progress, 0, 1);

    if (immediate) {
      this.timeline.progress(clampedProgress);
    } else {
      gsap.to(this.timeline, {
        progress: clampedProgress,
        duration: 1,
        ease: 'power2.inOut',
      });
    }
  }

  /**
   * Get current scroll progress
   */
  getProgress(): number {
    return this.scrollTrigger?.progress ?? 0;
  }

  /**
   * Enable/disable scroll tracking
   */
  setEnabled(enabled: boolean) {
    if (this.scrollTrigger) {
      this.scrollTrigger.enable(enabled);
    }
    this.isActive = enabled;
  }

  /**
   * Update keyframes dynamically
   */
  updateKeyframes(keyframes: CameraKeyframe[]) {
    this.keyframes = keyframes.sort((a, b) => a.progress - b.progress);
    this.rebuild();
  }

  /**
   * Rebuild timeline with current keyframes
   */
  private rebuild() {
    this.destroy();
    this.init();
  }

  /**
   * Add callback for when scroll reaches specific progress
   */
  onProgress(callback: (progress: number) => void) {
    this.progressCallbacks.push(callback);
  }

  /**
   * Remove progress callback
   */
  offProgress(callback: (progress: number) => void) {
    const idx = this.progressCallbacks.indexOf(callback);
    if (idx > -1) this.progressCallbacks.splice(idx, 1);
  }

  /**
   * Scroll to a specific progress
   */
  scrollTo(progress: number, duration = 1) {
    if (!this.scrollTrigger) return;

    const trigger = this.scrollTrigger;
    const start = trigger.start;
    const end = trigger.end;
    const targetScroll = start + (end - start) * progress;

    gsap.to(window, {
      scrollTo: { y: targetScroll, autoKill: false },
      duration,
      ease: 'power2.inOut',
    });
  }

  /**
   * Refresh ScrollTrigger (call on layout changes)
   */
  refresh() {
    ScrollTrigger.refresh();
  }

  /**
   * Get camera state at specific progress (for preview/debug)
   */
  getStateAtProgress(progress: number): { position: THREE.Vector3; rotation: THREE.Euler; fov: number; lookAt: THREE.Vector3 } {
    const clamped = THREE.MathUtils.clamp(progress, 0, 1);

    // Find surrounding keyframes
    let prev = this.keyframes[0];
    let next = this.keyframes[this.keyframes.length - 1];

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (clamped >= this.keyframes[i].progress && clamped <= this.keyframes[i + 1].progress) {
        prev = this.keyframes[i];
        next = this.keyframes[i + 1];
        break;
      }
    }

    const t = (clamped - prev.progress) / (next.progress - prev.progress);
    const eased = gsap.parseEase(prev.ease || 'power3.inOut')(t);

    // Euler doesn't have lerp, so we interpolate manually
    const prevRot = prev.rotation || new THREE.Euler();
    const nextRot = next.rotation || new THREE.Euler();
    const rotation = new THREE.Euler(
      THREE.MathUtils.lerp(prevRot.x, nextRot.x, eased),
      THREE.MathUtils.lerp(prevRot.y, nextRot.y, eased),
      THREE.MathUtils.lerp(prevRot.z, nextRot.z, eased)
    );

    return {
      position: new THREE.Vector3().lerpVectors(prev.position, next.position, eased),
      rotation,
      fov: THREE.MathUtils.lerp(prev.fov || 50, next.fov || 50, eased),
      lookAt: new THREE.Vector3().lerpVectors(prev.lookAt || new THREE.Vector3(0, 0.35, 0), next.lookAt || new THREE.Vector3(0, 0.35, 0), eased),
    };
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.timeline?.kill();
    this.scrollTrigger?.kill();
    this.destroyCallbacks.forEach(cb => cb());
    this.destroyCallbacks = [];
    this.isActive = false;
  }

  /**
   * Check if camera is currently being controlled by scroll
   */
  get isScrollControlled(): boolean {
    return this.isActive && this.scrollTrigger?.isActive === true;
  }
}

/**
 * Default keyframes for diary portfolio scroll experience
 * ARCHITECTURE-v2 §7 Camera Behavior:
 * - Idle: Slow orbital drift (0.02 rad/s), breathing FOV (50→52)
 * - Scroll: Dolly forward/back on Z, slight pitch
 * - Hover Object: Dolly to focus distance, lock orbit
 * - Mobile: Gyro parallax (reduced), touch dolly
 */
export const DEFAULT_DIARY_KEYFRAMES: CameraKeyframe[] = [
  {
    // Intro: Diary cover view
    progress: 0,
    position: new THREE.Vector3(0, 4.0, 6.4),
    rotation: new THREE.Euler(0, 0, 0),
    fov: 38,
    lookAt: new THREE.Vector3(0, 0.35, 0),
  },
  {
    // Early scroll: Pull back slightly, reveal desk
    progress: 0.15,
    position: new THREE.Vector3(0, 3.5, 5.0),
    rotation: new THREE.Euler(-0.1, 0, 0),
    fov: 40,
    lookAt: new THREE.Vector3(0, 0.5, 0),
  },
  {
    // Mid scroll: Dolly toward diary, show spread
    progress: 0.35,
    position: new THREE.Vector3(0.5, 3.0, 3.8),
    rotation: new THREE.Euler(-0.15, 0.05, 0),
    fov: 42,
    lookAt: new THREE.Vector3(0, 0.8, 0),
  },
  {
    // Page turn area: Closer to pages
    progress: 0.55,
    position: new THREE.Vector3(0.8, 2.5, 2.8),
    rotation: new THREE.Euler(-0.2, 0.1, 0),
    fov: 45,
    lookAt: new THREE.Vector3(0, 1.2, 0),
  },
  {
    // Skill orbs section: Pull back for constellation view
    progress: 0.75,
    position: new THREE.Vector3(1.0, 2.2, 2.2),
    rotation: new THREE.Euler(-0.25, 0.15, 0),
    fov: 48,
    lookAt: new THREE.Vector3(0, 1.5, 0),
  },
  {
    // End: Close detail view
    progress: 1,
    position: new THREE.Vector3(1.2, 2.0, 1.8),
    rotation: new THREE.Euler(-0.3, 0.2, 0),
    fov: 50,
    lookAt: new THREE.Vector3(0, 1.8, 0),
  },
];

/**
 * Alternative keyframes for different scroll sections
 */
export const SECTION_KEYFRAMES: Record<string, CameraKeyframe[]> = {
  hero: [
    { progress: 0, position: new THREE.Vector3(0, 4.0, 6.4), fov: 38, lookAt: new THREE.Vector3(0, 0.35, 0) },
    { progress: 1, position: new THREE.Vector3(0, 3.5, 5.0), fov: 40, lookAt: new THREE.Vector3(0, 0.5, 0) },
  ],
  about: [
    { progress: 0, position: new THREE.Vector3(0, 3.5, 5.0), fov: 40, lookAt: new THREE.Vector3(0, 0.5, 0) },
    { progress: 1, position: new THREE.Vector3(0.5, 3.0, 3.8), fov: 42, lookAt: new THREE.Vector3(0, 0.8, 0) },
  ],
  skills: [
    { progress: 0, position: new THREE.Vector3(0.5, 3.0, 3.8), fov: 42, lookAt: new THREE.Vector3(0, 0.8, 0) },
    { progress: 1, position: new THREE.Vector3(1.0, 2.2, 2.2), fov: 48, lookAt: new THREE.Vector3(0, 1.5, 0) },
  ],
  projects: [
    { progress: 0, position: new THREE.Vector3(1.0, 2.2, 2.2), fov: 48, lookAt: new THREE.Vector3(0, 1.5, 0) },
    { progress: 1, position: new THREE.Vector3(1.2, 2.0, 1.8), fov: 50, lookAt: new THREE.Vector3(0, 1.8, 0) },
  ],
};

/**
 * Create a ScrollCamera with smooth section transitions
 */
export function createSectionedScrollCamera(
  camera: THREE.Camera,
  sections: string[],
  scrollElement?: HTMLElement | string
): ScrollCamera {
  const keyframes: CameraKeyframe[] = [];

  // Build continuous keyframes from sections
  sections.forEach((section, i) => {
    const sectionFrames = SECTION_KEYFRAMES[section];
    if (!sectionFrames) return;

    const sectionStart = i / sections.length;
    const sectionEnd = (i + 1) / sections.length;

    sectionFrames.forEach((kf, j) => {
      const progress = sectionStart + (kf.progress / sectionFrames.length) * (sectionEnd - sectionStart);
      keyframes.push({
        ...kf,
        progress,
        // Smooth ease between sections
        ease: j === sectionFrames.length - 1 && i < sections.length - 1 ? 'power2.inOut' : kf.ease,
      });
    });
  });

  return new ScrollCamera({
    camera,
    keyframes,
    scrollElement,
    scrub: 1,
  });
}

export default ScrollCamera;