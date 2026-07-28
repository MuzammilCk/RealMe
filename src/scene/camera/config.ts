import * as THREE from 'three';

/**
 * Camera Configuration — Single source of truth for all camera positions,
 * look-at targets, and canvas settings.
 *
 * ARCHITECTURE-v2 §7: Camera Behavior
 * - Idle: Slow orbital drift, breathing FOV
 * - Scroll: Dolly forward/back on Z, slight pitch
 * - Hover Object: Dolly to focus distance, lock orbit
 * - Mobile: Gyro parallax (reduced), touch dolly
 */

// ─── Canvas Camera ────────────────────────────────────────────────────────────

export const CANVAS_CAMERA = {
  fov: 38,
  near: 0.1,
  far: 100,
  dpr: { mobile: [1, 1.5] as [number, number], desktop: [1, 2] as [number, number] },
} as const;

// ─── Named Camera Positions ───────────────────────────────────────────────────

/**
 * Camera position when the diary is closed (intro / resting state).
 * This is the canonical "hero" position used everywhere.
 */
export const CAMERA_POSITION_HERO = new THREE.Vector3(0, 4.0, 6.4);

/**
 * Camera position when the diary is open (reading view).
 */
export const CAMERA_POSITION_DIARY = new THREE.Vector3(0, 2.5, 2.1);

/**
 * Default look-at target for the hero position.
 */
export const CAMERA_LOOKAT_HERO = new THREE.Vector3(0, 0.35, 0);

/**
 * Look-at target when the diary is open.
 */
export const CAMERA_LOOKAT_DIARY = new THREE.Vector3(0, 0.5, 0);

// ─── Section Camera Targets ───────────────────────────────────────────────────

export interface SectionCameraTarget {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
}

/**
 * Camera targets for each section. Used by useSceneSync for section transitions.
 * These are the resting positions the camera settles on when a section is active.
 */
export const SECTION_CAMERA_TARGETS: Record<string, SectionCameraTarget> = {
  hero: {
    position: CAMERA_POSITION_HERO,
    lookAt: CAMERA_LOOKAT_HERO,
  },
  about: {
    position: new THREE.Vector3(0, 3.2, 4.8),
    lookAt: new THREE.Vector3(0, 0.5, 0),
  },
  skills: {
    position: new THREE.Vector3(1.5, 3.5, 4.5),
    lookAt: new THREE.Vector3(0, 1.5, 0),
  },
  projects: {
    position: new THREE.Vector3(-1.5, 3.0, 5.0),
    lookAt: CAMERA_LOOKAT_HERO,
  },
  experience: {
    position: new THREE.Vector3(0, 3.5, 5.5),
    lookAt: new THREE.Vector3(0, 0.5, 0),
  },
  contact: {
    position: new THREE.Vector3(0, 4.0, 6.0),
    lookAt: CAMERA_LOOKAT_HERO,
  },
};

// ─── Animation Durations ──────────────────────────────────────────────────────

export const CAMERA_ANIMATION = {
  sectionTransition: 1.2,
  introSequence: 1.6,
  diaryOpen: 1.6,
  diaryClose: 1.3,
  resetToHero: 1.5,
  followDiary: 1.2,
  parallax: 0.1,
} as const;

// ─── Parallax Settings ────────────────────────────────────────────────────────

export const PARALLAX_SETTINGS = {
  factor: 0.15,
  baseZ: 6.4,
  frequencyX: 2,
  frequencyZ: 2,
  amplitudeX: 0.15,
  amplitudeZ: 0.075,
} as const;

// ─── Idle Drift Settings ──────────────────────────────────────────────────────

export const IDLE_DRIFT = {
  amplitudeX: 0.15,
  amplitudeY: 0.08,
  amplitudeZ: 0.1,
  frequencyX: 0.15,
  frequencyY: 0.1,
  frequencyZ: 0.12,
} as const;
