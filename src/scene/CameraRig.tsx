import { useEffect, useRef, type RefObject } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { usePortfolioStore } from '../store/usePortfolioStore';
import {
  CAMERA_POSITION_HERO,
  CAMERA_POSITION_DIARY,
  CAMERA_LOOKAT_HERO,
  CAMERA_ANIMATION,
  IDLE_DRIFT,
} from './camera/config';

interface CameraRigProps {
  coverPivotRef: RefObject<THREE.Group | null>;
  lampLightRef: RefObject<THREE.PointLight | null>;
}

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

    // Camera starts close to diary cover, pulls back to hero position
    tl.to(camera.position, {
      x: CAMERA_POSITION_HERO.x,
      y: CAMERA_POSITION_HERO.y,
      z: CAMERA_POSITION_HERO.z,
      duration: CAMERA_ANIMATION.introSequence,
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
      tl.to(camera.position, { x: CAMERA_POSITION_DIARY.x, y: CAMERA_POSITION_DIARY.y, z: CAMERA_POSITION_DIARY.z, duration: CAMERA_ANIMATION.diaryOpen, ease: 'power3.inOut' }, 0);
      if (cover) tl.to(cover, { z: OPEN_ANGLE, duration: 1.15, ease: 'power2.out' }, 0.35);
      // lamp dims slightly on open so the parchment overlay reads against a darker scene
      if (lamp) tl.to(lamp, { intensity: 2.0, duration: 0.9 }, 0.7);
      tlRef.current = tl;
    } else {
      const tl = gsap.timeline({ onComplete: () => _setDiaryState('closed') });
      if (cover) tl.to(cover, { z: 0, duration: 0.9, ease: 'power2.inOut' }, 0);
      tl.to(camera.position, { x: CAMERA_POSITION_HERO.x, y: CAMERA_POSITION_HERO.y, z: CAMERA_POSITION_HERO.z, duration: CAMERA_ANIMATION.diaryClose, ease: 'power3.inOut' }, 0.25);
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
      camera.position.x = CAMERA_POSITION_HERO.x + Math.sin(clock.current * IDLE_DRIFT.frequencyX) * IDLE_DRIFT.amplitudeX;
      camera.position.y = CAMERA_POSITION_HERO.y + Math.sin(clock.current * IDLE_DRIFT.frequencyY) * IDLE_DRIFT.amplitudeY;
      camera.position.z = CAMERA_POSITION_HERO.z + Math.cos(clock.current * IDLE_DRIFT.frequencyZ) * IDLE_DRIFT.amplitudeZ;
    }
    camera.lookAt(CAMERA_LOOKAT_HERO);
  });

  return null;
}
