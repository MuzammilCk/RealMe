import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useKeyboardFocusable } from '../../scene/accessibility/KeyboardNavigation';
import { ACCENT } from '../colors';

export default function Mug() {
  const { reducedMotion } = usePortfolioStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (meshRef.current) {
      // Subtle steam animation - gentle rise
      meshRef.current.position.y = 0.09 + Math.sin(clock.current * 0.5) * 0.003;
    }
  });

  const handleActivate = () => {
    // Fun easter egg - could trigger a toast
    console.log('☕ Coffee is life');
  };

  useKeyboardFocusable(
    'mug',
    'Coffee mug',
    "A developer's fuel",
    new THREE.Vector3(2.4, 0.09, 1.5),
    handleActivate
  );

  return (
    <group position={[2.4, 0, 1.5]}>
      <mesh
        ref={meshRef}
        castShadow
        position={[0, 0, 0]}
      >
        <cylinderGeometry args={[0.13, 0.11, 0.18, 20]} />
        <meshStandardMaterial color={ACCENT.camera} roughness={0.4} />
      </mesh>
      <mesh position={[0.14, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.018, 8, 16, Math.PI * 1.3]} />
        <meshStandardMaterial color={ACCENT.camera} roughness={0.4} />
      </mesh>
    </group>
  );
}