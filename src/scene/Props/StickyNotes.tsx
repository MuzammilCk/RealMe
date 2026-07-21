import { useMemo } from 'react';
import { createStickyTexture } from '../textures';
import { STICKY_NOTES } from '../../data/chapters';

// Decorative desk litter — two tilted sticky notes + a pen. Intro state only,
// but harmless to leave in the scene. (03-CONTENT-STORYLINE.md)
export default function StickyNotes() {
  const textures = useMemo(
    () => STICKY_NOTES.map((n) => createStickyTexture(n.text)),
    []
  );
  return (
    <group>
      <mesh position={[-0.9, 0.06, 0.9]} rotation={[Math.PI / 2, 0, Math.PI / 2.3]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.3} metalness={0.4} />
      </mesh>
      {STICKY_NOTES.map((n, i) => (
        <mesh
          key={n.text}
          position={[-1.1 + i * 0.35, 0.078, 1.35]}
          rotation={[-Math.PI / 2, 0, (Math.random() - 0.5) * 0.5]}
        >
          <planeGeometry args={[0.22, 0.22]} />
          <meshStandardMaterial map={textures[i]} roughness={0.9} side={2} />
        </mesh>
      ))}
    </group>
  );
}
