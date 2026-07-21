import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SoftShadows } from '@react-three/drei';
import * as THREE from 'three';
import { usePortfolioStore } from '../store/usePortfolioStore';
import Table from './Table';
import Diary from './Diary';
import CameraRig from './CameraRig';
import Lamp from './Props/Lamp';
import Globe from './Props/Globe';
import Books from './Props/Books';
import Mug from './Props/Mug';
import Hourglass from './Props/Hourglass';
import Camera from './Props/Camera';
import Plant from './Props/Plant';
import Nameplate from './Props/Nameplate';
import StickyNotes from './Props/StickyNotes';

// Layer A root. Mounted only when 3D is enabled (see App). Owns the two shared
// refs the CameraRig drives: the diary's spine hinge and the lamp's key light.
export default function CanvasRoot() {
  const coverPivotRef = useRef<THREE.Group>(null);
  const lampLightRef = useRef<THREE.PointLight>(null);
  const openDiary = usePortfolioStore((s) => s.openDiary);
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const [dimmed, setDimmed] = useState(false);

  // dim the scene once the diary is opening/open so parchment overlay pops
  const openish = diaryState === 'opening' || diaryState === 'open';
  if (openish !== dimmed) setDimmed(openish);

  return (
    <div className={`canvas-root${dimmed ? ' dimmed' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 38, position: [0, 4.0, 6.4], near: 0.1, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <color attach="background" args={['#0b0a08']} />
        <fogExp2 attach="fog" args={['#0b0a08', 0.045]} />

        {/* lighting recipe: dim warm ambient + lamp key (in Lamp) + cool rim */}
        <ambientLight color="#2a2018" intensity={0.7} />
        <directionalLight color="#8fa0ff" intensity={0.12} position={[-4, 5, -3]} />

        <SoftShadows size={28} samples={12} focus={0.9} />

        <Table />
        <Diary coverPivotRef={coverPivotRef} onBegin={openDiary} />
        <Lamp lightRef={lampLightRef} />
        <Globe />
        <Books />
        <Mug />
        <Hourglass />
        <Camera />
        <Plant />
        <Nameplate />
        <StickyNotes />

        <CameraRig coverPivotRef={coverPivotRef} lampLightRef={lampLightRef} />
      </Canvas>
    </div>
  );
}
