import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useScroll } from '../app/providers/ScrollProvider';
import { emitScene, eventBus, type EventMap } from './eventBus';
import {
  SECTION_CAMERA_TARGETS,
  CAMERA_POSITION_HERO,
  CAMERA_LOOKAT_HERO,
  CAMERA_POSITION_DIARY,
  CAMERA_LOOKAT_DIARY,
  CAMERA_ANIMATION,
  PARALLAX_SETTINGS,
} from '../scene/camera/config';

/**
 * Scene-UI Sync Hook
 * Bridges scroll position to 3D camera, triggers particle bursts, highlights objects
 * ARCHITECTURE-v2 §3.3: useSceneSync — Subscribe to ScrollContext, drive CameraRig
 */
export function useSceneSync() {
  const { progress, section } = useScroll();
  const { camera, scene } = useThree();
  const { diaryState, threeDEnabled } = usePortfolioStore();

  const lastSectionRef = useRef<string | null>(null);
  const particleBurstRef = useRef<Set<string>>(new Set());

  // Register camera targets for each section
  useEffect(() => {
    if (!threeDEnabled) return;

    // Camera targets are now defined in a single source of truth:
    // src/scene/camera/config.ts — SECTION_CAMERA_TARGETS
    // No need to register them here; we read directly from the config.
  }, [threeDEnabled]);

  // Sync camera on section change
  useEffect(() => {
    if (!threeDEnabled || !section) return;

    // Don't interrupt diary opening/closing animations
    if (diaryState === 'opening' || diaryState === 'closing') return;

    const target = SECTION_CAMERA_TARGETS[section];

    if (target && camera) {
      // Emit camera move via eventBus (decoupled from direct mutation)
      emitScene.cameraMove({
        position: { x: target.position.x, y: target.position.y, z: target.position.z },
        lookAt: { x: target.lookAt.x, y: target.lookAt.y, z: target.lookAt.z },
        duration: CAMERA_ANIMATION.sectionTransition,
      });

      // Trigger particle burst on new section (once per section)
      if (lastSectionRef.current !== section && !particleBurstRef.current.has(section)) {
        triggerParticleBurst(section);
        particleBurstRef.current.add(section);
      }

      lastSectionRef.current = section;
    }
  }, [section, threeDEnabled, diaryState]);

  // Continuous camera parallax based on scroll progress (when diary is closed)
  useFrame(() => {
    if (!threeDEnabled || diaryState !== 'closed') return;

    // Subtle parallax on scroll progress — emit via eventBus
    const parallaxFactor = PARALLAX_SETTINGS.factor;
    const targetX = Math.sin(progress * Math.PI * PARALLAX_SETTINGS.frequencyX) * parallaxFactor;
    const targetZ = PARALLAX_SETTINGS.baseZ + Math.cos(progress * Math.PI * PARALLAX_SETTINGS.frequencyZ) * parallaxFactor * 0.5;

    emitScene.cameraMove({
      position: { x: targetX, y: CAMERA_POSITION_HERO.y, z: targetZ },
      lookAt: { x: CAMERA_LOOKAT_HERO.x, y: CAMERA_LOOKAT_HERO.y, z: CAMERA_LOOKAT_HERO.z },
      duration: CAMERA_ANIMATION.parallax,
    });
  });

  // Trigger particle burst for section transitions
  const triggerParticleBurst = useCallback((sectionId: string) => {
    // Emit via eventBus for scene layer to consume
    emitScene.sectionChange({
      section: sectionId,
      direction: 'down',
      velocity: 0,
      progress: 0,
    });
  }, []);

  // Highlight interactive objects near camera
  const highlightNearbyObjects = useCallback(() => {
    if (!threeDEnabled || !scene) return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    const interactiveObjects = scene.children.filter(child =>
      child.userData?.interactive === true
    );

    const intersects = raycaster.intersectObjects(interactiveObjects, true);

    if (intersects.length > 0) {
      const object = intersects[0].object;
      // Emit hover event for UI tooltip via eventBus
      emitScene.objectHover({
        object: {
          id: object.userData.id || 'unknown',
          type: object.userData.type || 'unknown',
          name: object.userData.name || 'unknown',
          burstOnHover: object.userData.burstOnHover,
          position: object.userData.position,
        },
        distance: intersects[0].distance,
      });
    }
  }, [threeDEnabled, scene, camera]);

  return {
    triggerParticleBurst,
    highlightNearbyObjects,
  };
}

/**
 * Hook for 3D effects to listen to scene events via eventBus
 */
export function useSceneEvents() {
  const { reducedMotion } = usePortfolioStore();

  const subscribe = useCallback(<K extends keyof EventMap>(
    event: K,
    handler: (detail: EventMap[K]) => void
  ) => {
    const wrappedHandler = (detail: EventMap[K]) => {
      if (!reducedMotion || event === 'scene:sectionChange') {
        handler(detail);
      }
    };

    return eventBus.on(event, wrappedHandler);
  }, [reducedMotion]);

  return { subscribe };
}

/**
 * Hook for particle systems to react to scroll/events
 */
export function useParticleEvents() {
  const { subscribe } = useSceneEvents();
  const burstRef = useRef<Map<string, number>>(new Map());

  // Section change bursts
  useEffect(() => {
    const unsubscribe = subscribe('scene:sectionChange', (detail) => {
      const { section } = detail;
      const key = `section-${section}`;
      burstRef.current.set(key, performance.now());

      // Clear after animation
      setTimeout(() => burstRef.current.delete(key), 2000);
    });

    return unsubscribe;
  }, [subscribe]);

  // Object hover bursts
  useEffect(() => {
    const unsubscribe = subscribe('scene:objectHover', (detail) => {
      const { object } = detail;
      if (object?.burstOnHover) {
        const key = `hover-${object.id || 'unknown'}`;
        burstRef.current.set(key, performance.now());
        setTimeout(() => burstRef.current.delete(key), 1000);
      }
    });

    return unsubscribe;
  }, [subscribe]);

  return { burstRef };
}

/**
 * Camera controller hook for programmatic camera control via eventBus
 */
export function useCameraControl() {
  const { diaryState } = usePortfolioStore();

  const setFocus = useCallback((target: THREE.Vector3, duration = 1.0) => {
    emitScene.cameraFocus({
      target: { x: target.x, y: target.y, z: target.z },
      duration,
    });
  }, []);

  const setOrbit = useCallback(() => {
    // This would integrate with OrbitControls if used
    // For now, the CameraRig handles orbit behavior
  }, []);

  const resetToHero = useCallback(() => {
    emitScene.cameraMove({
      position: { x: CAMERA_POSITION_HERO.x, y: CAMERA_POSITION_HERO.y, z: CAMERA_POSITION_HERO.z },
      lookAt: { x: CAMERA_LOOKAT_HERO.x, y: CAMERA_LOOKAT_HERO.y, z: CAMERA_LOOKAT_HERO.z },
      duration: CAMERA_ANIMATION.resetToHero,
    });
  }, []);

  const followDiary = useCallback(() => {
    if (diaryState !== 'open') return;

    emitScene.cameraMove({
      position: { x: CAMERA_POSITION_DIARY.x, y: CAMERA_POSITION_DIARY.y, z: CAMERA_POSITION_DIARY.z },
      lookAt: { x: CAMERA_LOOKAT_DIARY.x, y: CAMERA_LOOKAT_DIARY.y, z: CAMERA_LOOKAT_DIARY.z },
      duration: CAMERA_ANIMATION.followDiary,
    });
  }, [diaryState]);

  return { setFocus, setOrbit, resetToHero, followDiary };
}