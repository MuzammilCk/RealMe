import { useMemo } from 'react';
import { createBookSpineTexture } from '../textures';

const BOOKS = [
  { label: 'SKILLS', color: '#2b1810' },
  { label: 'DESIGN', color: '#3a2418' },
  { label: 'DEV', color: '#1c2b2b' },
];

export default function Books() {
  const spines = useMemo(
    () => BOOKS.map((b) => createBookSpineTexture(b.label)),
    []
  );

  let y = 0.075;
  return (
    <group position={[-2.5, 0, 1.3]}>
      {BOOKS.map((b, i) => {
        const h = 0.13;
        const baseY = y;
        const el = (
          <mesh
            key={b.label}
            position={[(Math.random() - 0.5) * 0.05, baseY, (Math.random() - 0.5) * 0.05]}
            rotation={[0, (Math.random() - 0.5) * 0.08, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[0.7, h, 0.5]} />
            <meshStandardMaterial attach="material-0" color={b.color} roughness={0.7} />
            <meshStandardMaterial attach="material-1" color={b.color} roughness={0.7} />
            <meshStandardMaterial attach="material-2" color={b.color} roughness={0.7} />
            <meshStandardMaterial attach="material-3" color={b.color} roughness={0.7} />
            <meshStandardMaterial attach="material-4" map={spines[i]} roughness={0.6} />
            <meshStandardMaterial attach="material-5" color={b.color} roughness={0.7} />
          </mesh>
        );
        y += h + 0.005;
        return el;
      })}
    </group>
  );
}