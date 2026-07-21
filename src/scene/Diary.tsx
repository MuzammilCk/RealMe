import { useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { createDiaryCoverTexture } from './textures';
import { usePortfolioStore } from '../store/usePortfolioStore';

interface DiaryProps {
  coverPivotRef: RefObject<THREE.Group | null>;
  onBegin: () => void;
}

// The hero object. Reads `diaryState` to gate click/hover; emits onBegin on
// click. The hinge is a pivot group offset to the spine edge, so rotating its
// z swings the cover open like a real hinge, not around its own centre.
export default function Diary({ coverPivotRef, onBegin }: DiaryProps) {
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const pivotRef = useRef<THREE.Group>(null);
  const hoverLightRef = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState(false);

  const cover = useRef(createDiaryCoverTexture());
  const closed = diaryState === 'closed';

  // gentle ember glow pulse on hover (closed only)
  const hoverIntensity = hover && closed ? 0.9 + Math.sin(performance.now() / 200) * 0.25 : 0;

  return (
    <group
      ref={pivotRef}
      position={[0, 0.16, 0.15]}
      scale={hover && closed ? 1.02 : 1}
      onClick={(e) => {
        if (closed) {
          e.stopPropagation();
          onBegin();
        }
      }}
      onPointerOver={(e) => {
        if (closed) {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* back cover */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.12, 0.86]} />
        <meshStandardMaterial color="#2b1810" roughness={0.6} />
      </mesh>

      {/* pages block — parchment edge visible as a thin exposed band */}
      <mesh position={[0, 0.005, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.13, 0.8]} />
        <meshStandardMaterial color="#ede0c8" roughness={0.95} />
      </mesh>

      {/* front cover, parented to spine-edge pivot */}
      <group ref={coverPivotRef} position={[-0.6, 0.095, 0]}>
        <mesh position={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.05, 0.86]} />
          <meshStandardMaterial attach="material-0" color="#2b1810" roughness={0.6} />
          <meshStandardMaterial attach="material-1" color="#2b1810" roughness={0.6} />
          <meshStandardMaterial attach="material-2" map={cover.current} roughness={0.5} />
          <meshStandardMaterial attach="material-3" color="#1c110a" roughness={0.85} />
          <meshStandardMaterial attach="material-4" color="#2b1810" roughness={0.6} />
          <meshStandardMaterial attach="material-5" color="#2b1810" roughness={0.6} />
        </mesh>
      </group>

      {/* hover glow — ember, light sources ONLY (02-DESIGN-SYSTEM.md) */}
      <pointLight
        ref={hoverLightRef}
        position={[0, 0.5, 0.4]}
        color="#ff9d52"
        intensity={hoverIntensity}
        distance={2.2}
        decay={2}
      />
    </group>
  );
}
