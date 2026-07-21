import { useMemo } from 'react';
import { createGlobeTexture } from '../textures';

export default function Globe() {
  const tex = useMemo(() => createGlobeTexture(), []);
  return (
    <group position={[2.7, 0, 1.1]}>
      <mesh position={[0, 0.46, 0]} rotation={[0, 0, 0.4]} castShadow>
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
