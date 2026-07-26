import { type RefObject, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

interface LampProps {
  lightRef: RefObject<THREE.PointLight | null>;
}

// Key light. Reads diaryState indirectly via the CameraRig (which tweens this
// light's intensity). The shade + arm are stylized primitives.
export default function Lamp({ lightRef }: LampProps) {
  const { reducedMotion } = usePortfolioStore();
  const clock = useRef(0);
  const armRef = useRef<THREE.Group>(null);

  const metal = (
    <meshStandardMaterial color="#1c110a" roughness={0.45} metalness={0.65} />
  );

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (armRef.current) {
      // Subtle sway
      armRef.current.rotation.z = 0.28 + Math.sin(clock.current * 0.5) * 0.02;
    }
  });

  return (
    <group position={[2.0, 0.075, -0.5]}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.24, 0.28, 0.07, 20]} />
        {metal}
      </mesh>
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0.28]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.1, 10]} />
        {metal}
      </mesh>
      <group ref={armRef}>
        <mesh position={[-0.55, 1.25, 0]} rotation={[0, 0, -0.55]} castShadow>
          <cylinderGeometry args={[0.022, 0.022, 0.75, 10]} />
          {metal}
        </mesh>
        <mesh position={[-0.95, 1.55, 0]} rotation={[Math.PI, 0, 0.75]} castShadow>
          <coneGeometry args={[0.3, 0.36, 24, 1, true]} />
          {metal}
        </mesh>
      </group>

      <pointLight
        ref={lightRef}
        position={[-0.95, 1.42, 0]}
        color="#ff9d52"
        intensity={2.6}
        distance={9}
        decay={2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
    </group>
  );
}