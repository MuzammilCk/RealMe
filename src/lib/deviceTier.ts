import { getGPUTier } from 'detect-gpu';
import type { DeviceTier } from '../store/usePortfolioStore';

export function webglSupported(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl') || c.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export interface DeviceProfile {
  tier: DeviceTier;
  webglOk: boolean;
  reducedMotion: boolean;
  threeDEnabled: boolean;
}

function fallbackProfile(): DeviceProfile {
  const webglOk = webglSupported();
  const reducedMotion = prefersReducedMotion();
  const tier: DeviceTier = webglOk ? 2 : 1;
  return { tier, webglOk, reducedMotion, threeDEnabled: webglOk && !reducedMotion && tier >= 2 };
}

// getGPUTier() loads a benchmark from a CDN; if that hangs or rejects we must
// not block boot on it. Race it against a timeout and never throw.
function getTierSafe(): Promise<{ tier: number }> {
  return Promise.race([
    getGPUTier()
      .then((r) => ({ tier: r.tier }))
      .catch(() => ({ tier: webglSupported() ? 2 : 1 })),
    new Promise<{ tier: number }>((resolve) =>
      setTimeout(() => resolve({ tier: webglSupported() ? 2 : 1 }), 2000)
    ),
  ]);
}

// Runs once at boot. The fallback isn't a degraded 3D scene — it's Layer B only.
export async function detectDevice(): Promise<DeviceProfile> {
  try {
    const webglOk = webglSupported();
    const reducedMotion = prefersReducedMotion();

    let tier: DeviceTier = 1;
    if (webglOk) {
      const result = await getTierSafe();
      // detect-gpu tier: 0 (worst) … 3 (best)
      if (result.tier >= 3) tier = 3;
      else if (result.tier === 2) tier = 2;
      else tier = 1;
    }

    // Device-class nudge: phones are tier 2 max even on tier-3 hardware.
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
    if (isMobile && tier === 3) tier = 2;

    // Tier 1 / no WebGL / reduced-motion => Layer B only.
    const threeDEnabled = webglOk && !reducedMotion && tier >= 2;

    return { tier, webglOk, reducedMotion, threeDEnabled };
  } catch {
    return fallbackProfile();
  }
}
