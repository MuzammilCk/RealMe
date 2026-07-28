import { useMemo, useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createStickyTexture } from '../textures';
import { STICKY_NOTES } from '../../data/chapters';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { useKeyboardFocusable } from '../../scene/accessibility/KeyboardNavigation';
import { ACCENT } from '../colors';

// Decorative desk litter — two tilted sticky notes + a pen. Intro state only,
// but harmless to leave in the scene. (03-CONTENT-STORYLINE.md)
export default function StickyNotes() {
  const { reducedMotion } = usePortfolioStore();
  const textures = useMemo(
    () => STICKY_NOTES.map((n) => createStickyTexture(n.text)),
    []
  );
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;
    // Subtle float animation
  });

  // Register sticky notes for keyboard navigation
  const notePositions = [
    new THREE.Vector3(-1.1, 0.078, 1.35),
    new THREE.Vector3(-0.75, 0.078, 1.35),
  ];

  notePositions.forEach((position, i) => {
    useKeyboardFocusable(
      `sticky-note-${i}`,
      `Sticky note ${i + 1}`,
      `Shows: ${STICKY_NOTES[i].text}`,
      position,
      () => {
        // Click action
        setFocusedIndex(i);
        setHoveredIndex(i);
      }
    );
  });

  return (
    <group>
      <mesh position={[-0.9, 0.06, 0.9]} rotation={[Math.PI / 2, 0, Math.PI / 2.3]}>
        <cylinderGeometry args={[0.012, 0.012, 0.5, 8]} />
        <meshStandardMaterial color={ACCENT.camera} roughness={0.3} metalness={0.4} />
      </mesh>
      {STICKY_NOTES.map((n, i) => {
        const isHovered = hoveredIndex === i;
        const isFocused = focusedIndex === i;
        return (
          <mesh
            key={n.text}
            position={[-1.1 + i * 0.35, 0.078 + (isHovered || isFocused ? 0.02 : 0), 1.35]}
            rotation={[-Math.PI / 2, 0, (Math.random() - 0.5) * 0.5]}
            scale={isHovered || isFocused ? 1.05 : 1}
            onPointerOver={() => setHoveredIndex(i)}
            onPointerOut={() => setHoveredIndex(null)}
          >
            <planeGeometry args={[0.22, 0.22]} />
            <meshStandardMaterial map={textures[i]} roughness={0.9} side={2} />
          </mesh>
        );
      })}
    </group>
  );
}