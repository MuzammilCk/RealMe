import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export default function Camera() {
  const { reducedMotion } = usePortfolioStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (meshRef.current) {
      // Subtle breathing
      meshRef.current.scale.setScalar(1 + Math.sin(clock.current * 0.4) * 0.005);
    }
  });

  return (
    <group position={[2.85, 0.1, 0.15]} rotation={[0, -0.5, 0]}>
      <mesh
        ref={meshRef}
        castShadow
      >
        <boxGeometry args={[0.34, 0.22, 0.16]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.075, 0.09, 0.14, 20]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0.12, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 12]} />
        <meshStandardMaterial color="#c9a15c" roughness={0.4} metalness={0.6} />
      </mesh>
    </group>
  );
}
