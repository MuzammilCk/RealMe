import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlobeTexture } from '../textures';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useKeyboardFocusable } from '../../scene/accessibility/KeyboardNavigation';

export default function Globe() {
  const { reducedMotion } = usePortfolioStore();
  const tex = useMemo(() => createGlobeTexture(), []);
  const sphereRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (sphereRef.current) {
      // Subtle rotation
      sphereRef.current.rotation.y = 0.4 + clock.current * 0.02;
      // Gentle floating
      sphereRef.current.position.y = 0.46 + Math.sin(clock.current * 0.7) * 0.02;
    }
  });

  const handleActivate = () => {
    window.open('https://github.com/MuzammilCk', '_blank');
  };

  useKeyboardFocusable(
    'globe',
    'World globe',
    'Explore my global projects',
    new THREE.Vector3(2.7, 0.46, 1.1),
    handleActivate
  );

  return (
    <group position={[2.7, 0, 1.1]}>
      <mesh
        ref={sphereRef}
        position={[0, 0.46, 0]}
        rotation={[0, 0, 0.4]}
        castShadow
      >
        <sphereGeometry args={[0.28, 24, 24]} />
        <meshStandardMaterial map={tex} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.46, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.018, 8, 24]} />
        <meshStandardMaterial color="#2b1810" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.23, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.11, 0.46, 10]} />
        <meshStandardMaterial color="#2b1810" roughness={0.6} />
      </mesh>
    </group>
  );
}