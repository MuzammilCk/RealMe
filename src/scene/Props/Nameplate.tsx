import { useMemo } from 'react';
import { createNameplateTexture } from '../textures';

export default function Nameplate() {
  const tex = useMemo(() => createNameplateTexture(), []);
  return (
    <group position={[0.1, 0.045, -1.15]}>
      <mesh position={[0, 0, 0]} rotation={[-0.25, 0, 0]} castShadow>
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
