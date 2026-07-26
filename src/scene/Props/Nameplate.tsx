import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createNameplateTexture } from '../textures';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useKeyboardFocusable } from '../../scene/accessibility/KeyboardNavigation';

export default function Nameplate() {
  const tex = useMemo(() => createNameplateTexture(), []);
  const { reducedMotion } = usePortfolioStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = 0.045 + Math.sin(clock.current * 0.8) * 0.01;
    }
  });

  const handleActivate = () => {
    window.open('https://github.com/MuzammilCk', '_blank');
  };

  useKeyboardFocusable(
    'nameplate',
    'Nameplate',
    'Muzammil CK - Software Engineer',
    new THREE.Vector3(0.1, 0.045, -1.15),
    handleActivate
  );

  return (
    <group position={[0.1, 0.045, -1.15]}>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        rotation={[-0.25, 0, 0]}
        castShadow
      >
        <boxGeometry args={[0.9, 0.09, 0.05]} />
        <meshStandardMaterial attach="material-0" color="#1c110a" roughness={0.5} />
        <meshStandardMaterial attach="material-1" color="#1c110a" roughness={0.5} />
        <meshStandardMaterial attach="material-2" color="#1c110a" roughness={0.5} />
        <meshStandardMaterial attach="material-3" color="#1c110a" roughness={0.5} />
        <meshStandardMaterial attach="material-4" map={tex} roughness={0.4} />
        <meshStandardMaterial attach="material-5" color="#1c110a" roughness={0.5} />
      </mesh>
    </group>
  );
}