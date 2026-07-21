import { useMemo } from 'react';
import { createWoodTexture } from './textures';

// Static geometry. Receives shadow. Never moves. (04-COMPONENTS.md)
export default function Table() {
  const wood = useMemo(() => createWoodTexture(), []);

  return (
    <group>
      <mesh receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[6, 0.15, 3.4]} />
        <meshStandardMaterial map={wood} roughness={0.55} metalness={0.04} color="#4a2f1c" />
      </mesh>

      {(
        [
          [-2.9, -0.925, 1.55],
          [2.9, -0.925, 1.55],
          [-2.9, -0.925, -1.55],
          [2.9, -0.925, -1.55],
        ] as [number, number, number][]
      ).map((p, i) => (
        <mesh key={i} castShadow receiveShadow position={p}>
          <cylinderGeometry args={[0.09, 0.11, 1.7, 10]} />
          <meshStandardMaterial color="#2b1810" roughness={0.75} />
        </mesh>
      ))}
      {/* floor shadow catcher tone so the void reads as a room, not a void */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.86, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0b0a08" roughness={1} />
      </mesh>
    </group>
  );
}
