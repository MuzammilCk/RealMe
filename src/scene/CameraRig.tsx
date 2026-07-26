import { useEffect, useRef, type RefObject } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { usePortfolioStore } from '../store/usePortfolioStore';

interface CameraRigProps {
  coverPivotRef: RefObject<THREE.Group | null>;
  lampLightRef: RefObject<THREE.PointLight | null>;
}

const INTRO_CAM = { x: 0, y: 4.0, z: 6.4 };
const DIARY_CAM = { x: 0, y: 2.5, z: 2.1 };
const LOOK_AT = new THREE.Vector3(0, 0.35, 0);
const OPEN_ANGLE = 2.7; // ~155°, cover swings open on the spine hinge

// The ONLY place allowed to call gsap.timeline() against scene objects.
export default function CameraRig({ coverPivotRef, lampLightRef }: CameraRigProps) {
  const camera = useThree((s) => s.camera);
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const threeDEnabled = usePortfolioStore((s) => s.threeDEnabled);
  const _setDiaryState = usePortfolioStore((s) => s._setDiaryState);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const clock = useRef(0);
  const introCompleteRef = useRef(false);
  const introStartedRef = useRef(false);

  // Cinematic intro sequence when 3D is first enabled
  useEffect(() => {
    if (!threeDEnabled || introCompleteRef.current || introStartedRef.current) return;

    introStartedRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        introCompleteRef.current = true;
        // Enable scroll after intro
        document.body.style.overflow = 'auto';
      },
    });

    // Lock scroll during intro
    document.body.style.overflow = 'hidden';

    // Camera starts close to diary cover, pulls back to INTRO_CAM
    tl.to(camera.position, {
      x: INTRO_CAM.x,
      y: INTRO_CAM.y,
      z: INTRO_CAM.z,
      duration: 1.6,
      ease: 'expo.out',
    }, 0);

    // Diary cover subtle scale/rotate
    if (coverPivotRef.current) {
      tl.to(coverPivotRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.2,
        ease: 'power2.out',
      }, 0.2);

      tl.to(coverPivotRef.current.rotation, {
        y: 0.05,
        duration: 1.6,
        ease: 'expo.out',
      }, 0);
    }

    return () => {
      tl.kill();
      document.body.style.overflow = 'auto';
    };
  }, [threeDEnabled, camera, coverPivotRef]);

  useEffect(() => {
    // ignore the resting states — only act on a real transition
    if (diaryState !== 'opening' && diaryState !== 'closing') return;

    tlRef.current?.kill();
    const cover = coverPivotRef.current?.rotation;
    const lamp = lampLightRef.current;

    if (diaryState === 'opening') {
      const tl = gsap.timeline({ onComplete: () => _setDiaryState('open') });
      tl.to(camera.position, { x: DIARY_CAM.x, y: DIARY_CAM.y, z: DIARY_CAM.z, duration: 1.6, ease: 'power3.inOut' }, 0);
      if (cover) tl.to(cover, { z: OPEN_ANGLE, duration: 1.15, ease: 'power2.out' }, 0.35);
      // lamp dims slightly on open so the parchment overlay reads against a darker scene
      if (lamp) tl.to(lamp, { intensity: 2.0, duration: 0.9 }, 0.7);
      tlRef.current = tl;
    } else {
      const tl = gsap.timeline({ onComplete: () => _setDiaryState('closed') });
      if (cover) tl.to(cover, { z: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(camera.position, { x: INTRO_CAM.x, y: INTRO_CAM.y, z: INTRO_CAM.z, duration: 1.3, ease: 'power3.inOut' }, 0.25);
      if (lamp) tl.to(lamp, { intensity: 2.6, duration: 0.8 }, 0.2);
      tlRef.current = tl;
    }

    return () => {
      tlRef.current?.kill();
    };
  }, [diaryState, camera, coverPivotRef, lampLightRef, _setDiaryState]);

  useFrame((_, delta) => {
    clock.current += delta;
    // gentle idle drift only while closed; otherwise hold framing
    if (diaryState === 'closed') {
      camera.position.x = INTRO_CAM.x + Math.sin(clock.current * 0.15) * 0.15;
      camera.position.y = INTRO_CAM.y + Math.sin(clock.current * 0.1) * 0.08;
      camera.position.z = INTRO_CAM.z + Math.cos(clock.current * 0.12) * 0.1;
    }
    camera.lookAt(LOOK_AT);
  });

  return null;
}
