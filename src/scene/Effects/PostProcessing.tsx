import { EffectComposer, Bloom, Vignette, SMAA } from '@react-three/postprocessing';

/**
 * Post-processing pipeline for premium cinematic look
 * Only enabled on high-end devices (deviceTier === 3)
 *
 * Effects are composed as JSX children of <EffectComposer/> — each effect is a
 * real component, NOT a function call. (Calling Bloom({...}) returns a React
 * element; re-rendering it as <Effect/> would double-instantiate it.)
 */
export function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      {/* Selective bloom - selective glow for warm highlights (lamp, brass, ember) */}
      <Bloom
        intensity={0.6}
        mipmapBlur
        luminanceThreshold={0.85}
        luminanceSmoothing={0.025}
        kernelSize={3}
        radius={0.6}
      />

      {/* Subtle vignette - draws eye to center without being obvious */}
      <Vignette offset={0.3} darkness={0.4} />

      {/* SMAA - high quality anti-aliasing */}
      <SMAA preset="high" edgeDetectionMode="luma" />
    </EffectComposer>
  );
}

/**
 * Minimal post-processing for mid-tier devices
 */
export function PostProcessingLite() {
  return (
    <EffectComposer>
      <Bloom intensity={0.4} luminanceThreshold={0.9} mipmapBlur />
      <Vignette offset={0.25} darkness={0.3} />
    </EffectComposer>
  );
}

/**
 * Color grading LUT effect for warm cinematic look
 * Would require a 3D LUT texture (not included)
 */
export function ColorGradingEffect() {
  // Placeholder for future LUT-based color grading
  return null;
}

export default PostProcessing;
