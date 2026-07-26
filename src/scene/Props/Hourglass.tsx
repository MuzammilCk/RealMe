import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useKeyboardFocusable } from '../../scene/accessibility/KeyboardNavigation';

export default function Hourglass() {
  const { reducedMotion } = usePortfolioStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (meshRef.current) {
      // Subtle rotation
      meshRef.current.rotation.y = Math.sin(clock.current * 0.3) * 0.1;
    }
  });

  const handleActivate = () => {
    window.open('https://github.com/MuzammilCk', '_blank');
  };

  useKeyboardFocusable(
    'hourglass',
    'Hourglass',
    'Time flows, code grows',
    new THREE.Vector3(-1.6, 0.24, -0.9),
    handleActivate
  );

  return (
    <group position={[-1.6, 0.16, -0.9]}>
      <mesh
        ref={meshRef}
        position={[0, 0.24, 0]}
        rotation={[Math.PI, 0, 0]}
      >
        <coneGeometry args={[0.13, 0.22, 16]} />
        <meshStandardMaterial color="#cfd8dc" roughness={0.15} metalness={0.1} transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <coneGeometry args={[0.13, 0.22, 16]} />
        <meshStandardMaterial color="#cfd8dc" roughness={0.15} metalness={0.1} transparent opacity={0.35} />
      </mesh>
      {[0.02, 0.46].map((yy) => (
        <mesh key={yy} position={[0, yy, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
          <meshStandardMaterial color="#2b1810" roughness={0.6} />
        </mesh>
      ))}
      {[
        [0.13, 0],
        [-0.065, 0.11],
        [-0.065, -0.11],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 0.24, p[1]]}>
          <cylinderGeometry args={[0.012, 0.012, 0.44, 8]} />
          <meshStandardMaterial color="#2b1810" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}