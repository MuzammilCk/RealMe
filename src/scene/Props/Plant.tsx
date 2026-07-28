import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useKeyboardFocusable } from '../../scene/accessibility/KeyboardNavigation';
import { WALNUT, ACCENT } from '../colors';

export default function Plant() {
  const { reducedMotion } = usePortfolioStore();
  const meshRef = useRef<THREE.Group>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (meshRef.current) {
      // Subtle sway
      meshRef.current.rotation.z = Math.sin(clock.current * 0.3) * 0.02;
    }
  });

  const handleActivate = () => {
    window.open('https://linkedin.com', '_blank');
  };

  useKeyboardFocusable(
    'plant',
    'Desk plant',
    'Bringing life to code',
    new THREE.Vector3(-2.9, 0.32, -1.1),
    handleActivate
  );

  return (
    <group
      ref={meshRef}
      position={[-2.9, 0, -1.1]}
    >
      <mesh position={[0, 0.11, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.13, 0.22, 16]} />
        <meshStandardMaterial color={WALNUT[700]} roughness={0.7} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => {
        const ang = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(ang) * 0.09, 0.32 + Math.random() * 0.18, Math.sin(ang) * 0.09]}
            scale={[0.8, 1.3, 0.8]}
          >
            <sphereGeometry args={[0.11 + Math.random() * 0.05, 8, 8]} />
            <meshStandardMaterial color={ACCENT.leaf} roughness={0.8} />
          </mesh>
        );
      })}
    </group>
  );
}