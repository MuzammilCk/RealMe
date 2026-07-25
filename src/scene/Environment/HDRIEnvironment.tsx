import { useLoader } from '@react-three/fiber';
import { useEffect } from 'react';
import { RGBELoader } from 'three-stdlib';
import * as THREE from 'three';
import { Environment } from '@react-three/drei';
import { usePortfolioStore } from '../../store/usePortfolioStore';

/**
 * HDRI Environment - Warm workshop lighting
 * Uses Poly Haven "Wooden Workshop" or similar warm HDRI
 * ARCHITECTURE-v2 §7: Environment (HDRI + procedural)
 */
export function HDRIEnvironment() {
  const { deviceTier } = usePortfolioStore();

  // Only load HDRI on tier 2+ devices
  if (deviceTier < 2) return null;

  // Load warm workshop HDRI
  // Using a warm indoor workshop HDRI from Poly Haven
  const hdriUrl = 'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/wooden_workshop_1k.hdr';

  const hdriTexture = useLoader(RGBELoader, hdriUrl, (loader) => {
    loader.setDataType(THREE.HalfFloatType);
  });

  // Configure HDRI for warm candlelit atmosphere
  useEffect(() => {
    if (hdriTexture) {
      hdriTexture.mapping = THREE.EquirectangularReflectionMapping;
      hdriTexture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [hdriTexture]);

  return (
    <Environment
      files={hdriUrl}
      background={false}
    />
  );
}

/**
 * Procedural Workshop Environment (fallback for tier 1 / no HDRI)
 * Creates warm ambient lighting without HDRI
 */
export function ProceduralEnvironment() {
  const { deviceTier } = usePortfolioStore();

  // Only use procedural on tier 1 or if HDRI fails
  if (deviceTier > 1) return null;

  return (
    <>
      {/* Warm ambient fill */}
      <ambientLight color="#1c1208" intensity={0.35} />

      {/* Warm key light simulating lamp */}
      <directionalLight
        color="#ff9d52"
        intensity={0.5}
        position={[-2, 4, -1.5]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={15}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
        shadow-normalBias={0.02}
      />

      {/* Cool fill for contrast */}
      <directionalLight
        color="#0e1c2a"
        intensity={0.1}
        position={[3, 5, 2]}
      />

      {/* Subtle hemisphere for ground bounce */}
      <hemisphereLight
        groundColor="#1a0f08"
        color="#2a1a0c"
        intensity={0.15}
      />
    </>
  );
}

/**
 * Fog configuration for warm atmosphere
 * ARCHITECTURE-v2 §1: "Warm candlelight/ember glow, not void black"
 */
export function SceneFog() {
  return (
    <>
      <fog attach="fog" args={['#140b05', 4, 18]} />
      <color attach="background" args={['#140b05']} />
    </>
  );
}

export default HDRIEnvironment;