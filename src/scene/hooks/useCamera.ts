import { useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { ScrollCamera, type CameraKeyframe } from '../camera/ScrollCamera';
import { useGyroCamera } from '../camera/GyroCamera';
import {
  CAMERA_POSITION_HERO,
  CAMERA_LOOKAT_HERO,
  CANVAS_CAMERA,
  IDLE_DRIFT,
} from '../camera/config';
import gsap from 'gsap';

/**
 * Camera Hook - Centralized camera control
 * ARCHITECTURE-v2 §7: Camera behaviors (idle, scroll, hover, mobile)
 * Exposes cameraRef, setFocus, setOrbit methods
 */

export interface CameraState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  fov: number;
  target: THREE.Vector3;
}

export interface UseCameraReturn {
  cameraRef: React.RefObject<THREE.PerspectiveCamera | null>;
  setFocus: (target: THREE.Vector3, duration?: number, ease?: string) => void;
  setOrbit: (enabled: boolean) => void;
  setPosition: (position: THREE.Vector3, duration?: number, ease?: string) => void;
  setFOV: (fov: number, duration?: number) => void;
  getState: () => CameraState;
  scrollCamera: ScrollCamera | null;
  gyroCamera: ReturnType<typeof useGyroCamera> | null;
}

/**
 * Main camera hook for scene integration
 */
export function useCamera(): UseCameraReturn {
  const { camera } = useThree();
  const { deviceTier, reducedMotion } = usePortfolioStore();

  const cameraRef = useRef<THREE.PerspectiveCamera>(camera as THREE.PerspectiveCamera);
  const scrollCameraRef = useRef<ScrollCamera | null>(null);
  const isOrbiting = useRef(false);
  const focusAnimationRef = useRef<gsap.core.Tween | null>(null);

  // Initialize GyroCamera (disabled on tier 1 or reduced motion)
  const gyroCamera = useGyroCamera(camera as THREE.PerspectiveCamera, {
    enabled: deviceTier > 1 && !reducedMotion,
    intensity: 0.5,
    maxAngle: 0.5,
  });

  // Initialize ScrollCamera
  useEffect(() => {
    if (!camera || reducedMotion) return;

    scrollCameraRef.current = new ScrollCamera({
      camera: camera as THREE.PerspectiveCamera,
      keyframes: [
        {
          progress: 0,
          position: CAMERA_POSITION_HERO,
          rotation: new THREE.Euler(0, 0, 0),
          fov: CANVAS_CAMERA.fov,
          lookAt: CAMERA_LOOKAT_HERO,
        },
        {
          progress: 0.15,
          position: new THREE.Vector3(0, 3.5, 5.0),
          rotation: new THREE.Euler(-0.1, 0, 0),
          fov: 40,
          lookAt: new THREE.Vector3(0, 0.5, 0),
        },
        {
          progress: 0.35,
          position: new THREE.Vector3(0.5, 3.0, 3.8),
          rotation: new THREE.Euler(-0.15, 0.05, 0),
          fov: 42,
          lookAt: new THREE.Vector3(0, 0.8, 0),
        },
        {
          progress: 0.55,
          position: new THREE.Vector3(0.8, 2.5, 2.8),
          rotation: new THREE.Euler(-0.2, 0.1, 0),
          fov: 45,
          lookAt: new THREE.Vector3(0, 1.2, 0),
        },
        {
          progress: 0.75,
          position: new THREE.Vector3(1.0, 2.2, 2.2),
          rotation: new THREE.Euler(-0.25, 0.15, 0),
          fov: 48,
          lookAt: new THREE.Vector3(0, 1.5, 0),
        },
        {
          progress: 1,
          position: new THREE.Vector3(1.2, 2.0, 1.8),
          rotation: new THREE.Euler(-0.3, 0.2, 0),
          fov: 50,
          lookAt: new THREE.Vector3(0, 1.8, 0),
        },
      ],
      scrub: 1,
    });
  }, [camera, reducedMotion]);

  // Idle camera drift (when not scrolling or focused)
  const idleClock = useRef(0);
  useEffect(() => {
    if (reducedMotion) return;

    const animateIdle = () => {
      if (isOrbiting.current) return;

      idleClock.current += 0.016; // ~60fps

      // Gentle orbital drift
      camera.position.x = Math.sin(idleClock.current * IDLE_DRIFT.frequencyX) * IDLE_DRIFT.amplitudeX;
      camera.position.y = CAMERA_POSITION_HERO.y + Math.sin(idleClock.current * IDLE_DRIFT.frequencyY) * IDLE_DRIFT.amplitudeY;
      camera.position.z = CAMERA_POSITION_HERO.z + Math.cos(idleClock.current * IDLE_DRIFT.frequencyZ) * IDLE_DRIFT.amplitudeZ;

      // Subtle breathing FOV
      if ('fov' in camera) {
        camera.fov = CANVAS_CAMERA.fov + Math.sin(idleClock.current * 0.08) * 1.5;
        camera.updateProjectionMatrix();
      }

      camera.lookAt(CAMERA_LOOKAT_HERO.x, CAMERA_LOOKAT_HERO.y, CAMERA_LOOKAT_HERO.z);
      requestAnimationFrame(animateIdle);
    };

    animateIdle();
  }, [camera, reducedMotion]);

  /**
   * Focus camera on a target position
   */
  const setFocus = useCallback((
    target: THREE.Vector3,
    duration = 1.2,
    ease = 'power3.inOut'
  ) => {
    if (focusAnimationRef.current) {
      focusAnimationRef.current.kill();
    }

    isOrbiting.current = true;

    focusAnimationRef.current = gsap.to(camera.position, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration,
      ease,
      onComplete: () => {
        isOrbiting.current = false;
      },
    });

    // Also animate lookAt
    gsap.to(camera.rotation, {
      x: target.x * 0.05,
      y: target.y * 0.05,
      duration,
      ease,
    });
  }, [camera]);

  /**
   * Enable/disable orbit controls
   */
  const setOrbit = useCallback((enabled: boolean) => {
    isOrbiting.current = enabled;
  }, []);

  /**
   * Set camera position directly with animation
   */
  const setPosition = useCallback((
    position: THREE.Vector3,
    duration = 1,
    ease = 'power2.inOut'
  ) => {
    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration,
      ease,
    });
  }, [camera]);

  /**
   * Set camera FOV with animation
   */
  const setFOV = useCallback((
    fov: number,
    duration = 0.8,
    ease = 'power2.inOut'
  ) => {
    const perspCamera = camera as THREE.PerspectiveCamera;
    if ('fov' in perspCamera) {
      gsap.to(perspCamera, {
        fov,
        duration,
        ease,
        onUpdate: () => perspCamera.updateProjectionMatrix(),
      });
    }
  }, [camera]);

  /**
   * Get current camera state
   */
  const getState = useCallback((): CameraState => {
    return {
      position: camera.position.clone(),
      rotation: camera.rotation.clone(),
      fov: 'fov' in camera ? camera.fov : 50,
      target: CAMERA_LOOKAT_HERO,
    };
  }, [camera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      scrollCameraRef.current?.destroy();
      focusAnimationRef.current?.kill();
    };
  }, []);

  return {
    cameraRef,
    setFocus,
    setOrbit,
    setPosition,
    setFOV,
    getState,
    scrollCamera: scrollCameraRef.current,
    gyroCamera,
  };
}

/**
 * Hook for scroll-synced camera (simpler interface)
 */
export function useScrollCamera(camera: THREE.Camera | null, keyframes: CameraKeyframe[] = []) {
  const scrollCameraRef = useRef<ScrollCamera | null>(null);

  useEffect(() => {
    if (!camera) return;

    scrollCameraRef.current = new ScrollCamera({
      camera,
      keyframes,
    });

    return () => {
      scrollCameraRef.current?.destroy();
    };
  }, [camera, keyframes]);

  return scrollCameraRef.current;
}

/**
 * Hook for programmatic camera control (cinematic sequences)
 */
export function useCameraAnimation(camera: THREE.Camera | null) {
  const animateTo = useCallback((
    target: { position?: THREE.Vector3; rotation?: THREE.Euler; fov?: number },
    duration = 1.5,
    ease = 'expo.inOut'
  ) => {
    if (!camera) return Promise.resolve();

    const promises: Promise<void>[] = [];

    if (target.position) {
      promises.push(new Promise(resolve => {
        gsap.to(camera.position, {
          ...target.position,
          duration,
          ease,
          onComplete: resolve,
        });
      }));
    }

    if (target.rotation) {
      promises.push(new Promise(resolve => {
        gsap.to(camera.rotation, {
          ...target.rotation,
          duration,
          ease,
          onComplete: resolve,
        });
      }));
    }

    if (target.fov && 'fov' in camera) {
      const perspCamera = camera as THREE.PerspectiveCamera;
      promises.push(new Promise(resolve => {
        gsap.to(perspCamera, {
          fov: target.fov,
          duration,
          ease,
          onUpdate: () => perspCamera.updateProjectionMatrix(),
          onComplete: resolve,
        });
      }));
    }

    return Promise.all(promises).then(() => {});
  }, [camera]);

  const shake = useCallback((
    intensity = 0.1,
    duration = 0.5
  ) => {
    if (!camera) return;

    const originalPos = camera.position.clone();
    const originalRot = camera.rotation.clone();

    gsap.to(camera.position, {
      x: originalPos.x + (Math.random() - 0.5) * intensity,
      y: originalPos.y + (Math.random() - 0.5) * intensity,
      z: originalPos.z + (Math.random() - 0.5) * intensity,
      duration: duration / 4,
      ease: 'rough({strength: 2, points: 10, template: none.out})',
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        camera.position.copy(originalPos);
      },
    });

    gsap.to(camera.rotation, {
      x: originalRot.x + (Math.random() - 0.5) * intensity * 0.1,
      y: originalRot.y + (Math.random() - 0.5) * intensity * 0.1,
      duration: duration / 4,
      ease: 'rough({strength: 2, points: 10, template: none.out})',
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        camera.rotation.copy(originalRot);
      },
    });
  }, [camera]);

  return { animateTo, shake };
}

export default useCamera;