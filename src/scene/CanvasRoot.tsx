import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
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
import { DustMotes } from './Effects/DustMotes';
import { EmberFloat } from './Effects/EmberFloat';
import VolumetricLight from './Effects/VolumetricLight';
import { PostProcessing } from './Effects/PostProcessing';
import { LightRig, SceneFog } from './LightRig';
import { HDRIEnvironment, ProceduralEnvironment } from './Environment/HDRIEnvironment';

// Layer A root. Mounted only when 3D is enabled. Owns the shared refs the CameraRig drives.
export default function CanvasRoot() {
  const coverPivotRef = useRef<THREE.Group>(null);
  const lampLightRef = useRef<THREE.PointLight | null>(null);
  const openDiary = usePortfolioStore((s) => s.openDiary);
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const deviceTier = usePortfolioStore((s) => s.deviceTier);
  const [dimmed, setDimmed] = useState(false);

  // Dim the scene once the diary is opening/open so parchment overlay pops
  const openish = diaryState === 'opening' || diaryState === 'open';
  useEffect(() => {
    setDimmed(openish);
  }, [openish]);

  // Post-processing only on tier 3 (high-end)
  const enablePostProcessing = deviceTier === 3;

  return (
    <div className={`canvas-root${dimmed ? ' dimmed' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 38, position: [0, 4.0, 6.4], near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          logarithmicDepthBuffer: true,
        }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
      >
        {/* Scene background and fog - warm ember-tinted void */}
        <SceneFog />

        {/* HDRI Environment for realistic reflections (tier 2+) */}
        <HDRIEnvironment />

        {/* Procedural fallback for tier 1 */}
        <ProceduralEnvironment />

        {/* Professional Lighting Rig */}
        <LightRig />

        {/* === POST-PROCESSING === */}
        {enablePostProcessing && <PostProcessing />}

        {/* === SCENE OBJECTS === */}
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

        {/* === ATMOSPHERIC EFFECTS === */}
        <DustMotes count={120} />
        {/* Embers rise from the lamp bulb — fewer on low tiers */}
        <EmberFloat count={deviceTier >= 3 ? 140 : deviceTier === 2 ? 70 : 0} />
        <VolumetricLight lightRef={lampLightRef} />

        <CameraRig coverPivotRef={coverPivotRef} lampLightRef={lampLightRef} />
      </Canvas>
    </div>
  );
}