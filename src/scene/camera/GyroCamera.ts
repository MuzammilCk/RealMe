import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

/**
 * GyroCamera - Device orientation parallax
 * ARCHITECTURE-v2 §7: Gyro parallax (reduced), touch dolly
 * Micro-rotation clamped ±0.5°, subtle layer depth shift
 */

interface DeviceOrientationData {
  alpha: number | null; // Z-axis (compass)
  beta: number | null;  // X-axis (front/back tilt)
  gamma: number | null; // Y-axis (left/right tilt)
}

interface GyroCameraConfig {
  camera: THREE.Camera;
  intensity?: number;        // Parallax intensity (default 0.5°)
  maxAngle?: number;         // Maximum rotation in degrees (default 0.5)
  smoothing?: number;        // Smoothing factor 0-1 (default 0.15)
  enabled?: boolean;
}

interface GyroCameraState {
  rotation: THREE.Euler;
  quaternion: THREE.Quaternion;
  isSupported: boolean;
  isActive: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unsupported';
}

/**
 * Hook for device orientation access
 * Returns current orientation state and permission status
 */
export function useDeviceOrientation(): {
  orientation: DeviceOrientationData;
  state: GyroCameraState;
  requestPermission: () => Promise<PermissionState>;
} {
  const [orientation, setOrientation] = useState<DeviceOrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [isSupported, setIsSupported] = useState(false);

  const orientationRef = useRef<DeviceOrientationData>({
    alpha: null,
    beta: null,
    gamma: null,
  });

  useEffect(() => {
    // Check if DeviceOrientationEvent is supported
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      setIsSupported(false);
      setPermission('unsupported');
      return;
    }

    setIsSupported(true);

    // Check permission (iOS 13+)
    const checkPermission = async () => {
      if ('requestPermission' in DeviceOrientationEvent) {
        try {
          const perm = await (DeviceOrientationEvent as any).requestPermission();
          setPermission(perm);
          return perm;
        } catch {
          setPermission('denied');
          return 'denied';
        }
      } else {
        setPermission('granted');
        return 'granted';
      }
    };

    checkPermission();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      orientationRef.current = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma,
      };
      setOrientation({ ...orientationRef.current });
    };

    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const requestPermission = async () => {
    if ('requestPermission' in DeviceOrientationEvent) {
      try {
        const perm = await (DeviceOrientationEvent as any).requestPermission();
        setPermission(perm);
        return perm;
      } catch {
        setPermission('denied');
        return 'denied';
      }
    }
    setPermission('granted');
    return 'granted';
  };

  // Convert to camera rotation (clamped)
  const maxAngle = 0.5 * Math.PI / 180; // 0.5 degrees in radians
  const rotation = new THREE.Euler(
    THREE.MathUtils.clamp((orientation.beta ?? 0) * Math.PI / 180 * 0.5, -maxAngle, maxAngle),  // pitch
    THREE.MathUtils.clamp((orientation.gamma ?? 0) * Math.PI / 180 * 0.5, -maxAngle, maxAngle),  // yaw
    0
  );

  const quaternion = new THREE.Quaternion().setFromEuler(rotation);

  return {
    orientation,
    state: {
      rotation,
      quaternion,
      isSupported,
      isActive: isSupported && permission === 'granted',
      permission,
    },
    requestPermission,
  };
}

/**
 * GyroCamera class for programmatic control
 * Applies device orientation to camera with smoothing and clamping
 */
export class GyroCamera {
  private camera: THREE.Camera;
  private config: Required<GyroCameraConfig>;
  private targetRotation = new THREE.Euler();
  private smoothedRotation = new THREE.Euler();
  private isActive = false;
  private animationId: number | null = null;
  private orientationListener: ((event: DeviceOrientationEvent) => void) | null = null;

  constructor(config: GyroCameraConfig) {
    this.camera = config.camera;
    this.config = {
      intensity: config.intensity ?? 0.5,
      maxAngle: config.maxAngle ?? 0.5,
      smoothing: config.smoothing ?? 0.15,
      enabled: config.enabled ?? true,
      camera: config.camera,
    };

    if (this.config.enabled) {
      this.init();
    }
  }

  private init() {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      console.warn('GyroCamera: DeviceOrientationEvent not supported');
      return;
    }

    this.orientationListener = (event: DeviceOrientationEvent) => {
      this.onOrientationChange(event);
    };

    // Request permission on iOS
    if ('requestPermission' in DeviceOrientationEvent) {
      (DeviceOrientationEvent as any).requestPermission().then((perm: string) => {
        if (perm === 'granted') {
          window.addEventListener('deviceorientation', this.orientationListener!, true);
          this.isActive = true;
          this.animate();
        }
      }).catch(() => {
        console.warn('GyroCamera: Permission denied');
      });
    } else {
      window.addEventListener('deviceorientation', this.orientationListener, true);
      this.isActive = true;
      this.animate();
    }
  }

  private onOrientationChange(event: DeviceOrientationEvent) {
    if (!this.isActive) return;

    const maxRad = this.config.maxAngle * Math.PI / 180;

    // Beta = front/back tilt (pitch), Gamma = left/right tilt (yaw)
    // Apply intensity scaling and clamp
    this.targetRotation.x = THREE.MathUtils.clamp(
      (event.beta ?? 0) * Math.PI / 180 * this.config.intensity,
      -maxRad,
      maxRad
    );
    this.targetRotation.y = THREE.MathUtils.clamp(
      (event.gamma ?? 0) * Math.PI / 180 * this.config.intensity,
      -maxRad,
      maxRad
    );
    this.targetRotation.z = 0; // No roll
  }

  private animate() {
    if (!this.isActive) return;

    // Smooth interpolation towards target
    this.smoothedRotation.x += (this.targetRotation.x - this.smoothedRotation.x) * this.config.smoothing;
    this.smoothedRotation.y += (this.targetRotation.y - this.smoothedRotation.y) * this.config.smoothing;
    this.smoothedRotation.z += (this.targetRotation.z - this.smoothedRotation.z) * this.config.smoothing;

    // Apply to camera
    this.camera.rotation.x = this.smoothedRotation.x;
    this.camera.rotation.y = this.smoothedRotation.y;
    this.camera.rotation.z = this.smoothedRotation.z;

    // Also apply subtle position parallax (depth shift)
    const parallaxIntensity = 0.02; // Very subtle
    this.camera.position.x += (this.targetRotation.y * parallaxIntensity - this.camera.position.x) * 0.1;
    this.camera.position.y += (-this.targetRotation.x * parallaxIntensity - this.camera.position.y) * 0.1;

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /**
   * Enable/disable gyro camera
   */
  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
    if (enabled && !this.isActive) {
      this.init();
    } else if (!enabled && this.isActive) {
      this.destroy();
    }
  }

  /**
   * Set intensity at runtime
   */
  setIntensity(intensity: number) {
    this.config.intensity = Math.max(0, Math.min(2, intensity));
  }

  /**
   * Set max angle at runtime
   */
  setMaxAngle(angle: number) {
    this.config.maxAngle = Math.max(0, Math.min(5, angle));
  }

  /**
   * Get current rotation state
   */
  getRotation(): THREE.Euler {
    return this.smoothedRotation.clone();
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    this.isActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.orientationListener) {
      window.removeEventListener('deviceorientation', this.orientationListener, true);
      this.orientationListener = null;
    }
  }
}

/**
 * React hook for using GyroCamera in components
 */
export function useGyroCamera(camera: THREE.Camera | null, options?: Partial<GyroCameraConfig>) {
  const gyroRef = useRef<GyroCamera | null>(null);
  const { reducedMotion, deviceTier } = usePortfolioStore();

  useEffect(() => {
    if (!camera || reducedMotion || deviceTier === 1) return;

    gyroRef.current = new GyroCamera({
      camera,
      intensity: options?.intensity ?? 0.5,
      maxAngle: options?.maxAngle ?? 0.5,
      smoothing: options?.smoothing ?? 0.15,
      enabled: options?.enabled ?? true,
    });

    return () => {
      gyroRef.current?.destroy();
      gyroRef.current = null;
    };
  }, [camera, reducedMotion, deviceTier, options?.intensity, options?.maxAngle, options?.smoothing, options?.enabled]);

  return gyroRef.current;
}

/**
 * Touch dolly controls for mobile (pinch to zoom/dolly)
 * Used as fallback when gyro is unavailable
 */
export function useTouchDolly(
  camera: THREE.Camera | null,
  options: { minDistance?: number; maxDistance?: number; sensitivity?: number } = {}
) {
  const { minDistance = 2, maxDistance = 10, sensitivity = 0.02 } = options;
  const initialDistance = useRef<number | null>(null);
  const initialPinchDistance = useRef<number | null>(null);

  useEffect(() => {
    if (!camera) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
        initialDistance.current = camera.position.length();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance.current !== null && initialDistance.current !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentPinchDistance = Math.sqrt(dx * dx + dy * dy);

        const scale = currentPinchDistance / initialPinchDistance.current;
        const newDistance = THREE.MathUtils.clamp(
          initialDistance.current / scale,
          minDistance,
          maxDistance
        );

        // Dolly camera along its view direction
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        camera.position.setLength(newDistance);
      }
    };

    const handleTouchEnd = () => {
      initialPinchDistance.current = null;
      initialDistance.current = null;
    };

    const element = window;
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [camera, minDistance, maxDistance, sensitivity]);
}

export default GyroCamera;