import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useScroll } from '../app/providers/ScrollProvider';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene-UI Sync Hook
 * Bridges scroll position to 3D camera, triggers particle bursts, highlights objects
 * ARCHITECTURE-v2 §3.3: useSceneSync — Subscribe to ScrollContext, drive CameraRig
 */
export function useSceneSync() {
  const { progress, section } = useScroll();
  const { camera, scene } = useThree();
  const { diaryState, threeDEnabled } = usePortfolioStore();

  const cameraTargetsRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const cameraLookAtRef = useRef<Map<string, THREE.Vector3>>(new Map());
  const lastSectionRef = useRef<string | null>(null);
  const particleBurstRef = useRef<Set<string>>(new Set());

  // Register camera targets for each section
  useEffect(() => {
    if (!threeDEnabled) return;

    // Define camera positions for each section
    cameraTargetsRef.current.set('hero', new THREE.Vector3(0, 4.0, 6.4));
    cameraTargetsRef.current.set('about', new THREE.Vector3(0, 3.2, 4.8));
    cameraTargetsRef.current.set('skills', new THREE.Vector3(1.5, 3.5, 4.5));
    cameraTargetsRef.current.set('projects', new THREE.Vector3(-1.5, 3.0, 5.0));
    cameraTargetsRef.current.set('experience', new THREE.Vector3(0, 3.5, 5.5));
    cameraTargetsRef.current.set('contact', new THREE.Vector3(0, 4.0, 6.0));

    // Look-at targets
    cameraLookAtRef.current.set('hero', new THREE.Vector3(0, 0.35, 0));
    cameraLookAtRef.current.set('about', new THREE.Vector3(0, 0.5, 0));
    cameraLookAtRef.current.set('skills', new THREE.Vector3(0, 1.5, 0));
    cameraLookAtRef.current.set('projects', new THREE.Vector3(0, 0.35, 0));
    cameraLookAtRef.current.set('experience', new THREE.Vector3(0, 0.5, 0));
    cameraLookAtRef.current.set('contact', new THREE.Vector3(0, 0.35, 0));
  }, [threeDEnabled]);

  // Sync camera on section change
  useEffect(() => {
    if (!threeDEnabled || !section) return;

    // Don't interrupt diary opening/closing animations
    if (diaryState === 'opening' || diaryState === 'closing') return;

    const targetPos = cameraTargetsRef.current.get(section);
    const targetLookAt = cameraLookAtRef.current.get(section);

    if (targetPos && targetLookAt && camera) {
      // Smooth camera transition
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.2,
        ease: 'power3.inOut',
      });

      // Smooth look-at transition
      const currentLookAt = new THREE.Vector3();
      camera.getWorldDirection(currentLookAt);
      currentLookAt.add(camera.position);

      gsap.to(currentLookAt, {
        x: targetLookAt.x,
        y: targetLookAt.y,
        z: targetLookAt.z,
        duration: 1.2,
        ease: 'power3.inOut',
        onUpdate: () => {
          camera.lookAt(currentLookAt);
        },
      });

      // Trigger particle burst on new section (once per section)
      if (lastSectionRef.current !== section && !particleBurstRef.current.has(section)) {
        triggerParticleBurst(section);
        particleBurstRef.current.add(section);
      }

      lastSectionRef.current = section;
    }
  }, [section, threeDEnabled, diaryState, camera]);

  // Continuous camera parallax based on scroll progress (when diary is closed)
  useFrame(() => {
    if (!threeDEnabled || diaryState !== 'closed') return;

    // Subtle parallax on scroll progress
    const parallaxFactor = 0.15;
    camera.position.x = Math.sin(progress * Math.PI * 2) * parallaxFactor;
    camera.position.z = 6.4 + Math.cos(progress * Math.PI * 2) * parallaxFactor * 0.5;
    camera.lookAt(0, 0.35, 0);
  });

  // Trigger particle burst for section transitions
  const triggerParticleBurst = useCallback((sectionId: string) => {
    // This would emit an event that particle systems listen to
    // For now, we'll use a custom event that effects can listen to
    window.dispatchEvent(new CustomEvent('scene:sectionChange', {
      detail: { section: sectionId }
    }));
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
      // Emit hover event for UI tooltip
      window.dispatchEvent(new CustomEvent('scene:objectHover', {
        detail: { object: object.userData, distance: intersects[0].distance }
      }));
    }
  }, [threeDEnabled, scene, camera]);

  return {
    triggerParticleBurst,
    highlightNearbyObjects,
    cameraTargets: cameraTargetsRef.current,
  };
}

/**
 * Hook for 3D effects to listen to scene events
 */
export function useSceneEvents() {
  const { reducedMotion } = usePortfolioStore();

  const subscribe = useCallback((event: string, handler: (detail: any) => void) => {
    const wrappedHandler = (e: CustomEvent) => {
      if (!reducedMotion || event === 'scene:sectionChange') {
        handler(e.detail);
      }
    };

    window.addEventListener(event, wrappedHandler as EventListener);
    return () => window.removeEventListener(event, wrappedHandler as EventListener);
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
 * Camera controller hook for programmatic camera control
 */
export function useCameraControl() {
  const { camera } = useThree();
  const { diaryState } = usePortfolioStore();

  const setFocus = useCallback((target: THREE.Vector3, duration = 1.0) => {
    if (!camera) return;

    gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration,
      ease: 'power3.inOut',
    });
  }, [camera]);

  const setOrbit = useCallback(() => {
    // This would integrate with OrbitControls if used
    // For now, the CameraRig handles orbit behavior
  }, []);

  const resetToHero = useCallback(() => {
    if (!camera) return;

    gsap.to(camera.position, {
      x: 0,
      y: 4.0,
      z: 6.4,
      duration: 1.5,
      ease: 'expo.out',
    });
    camera.lookAt(0, 0.35, 0);
  }, [camera]);

  const followDiary = useCallback(() => {
    if (!camera || diaryState !== 'open') return;

    gsap.to(camera.position, {
      x: 0,
      y: 2.5,
      z: 2.1,
      duration: 1.2,
      ease: 'power3.inOut',
    });
    camera.lookAt(0, 0.5, 0);
  }, [camera, diaryState]);

  return { setFocus, setOrbit, resetToHero, followDiary };
}