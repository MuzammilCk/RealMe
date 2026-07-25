import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

/**
 * Ink Bleed Effect - Full-screen shader triggered by page-turn events
 * Fractal noise + displacement for organic ink spreading effect
 * ARCHITECTURE-v2 §7: Particle Systems - InkBleed (shader, page-turn moments)
 */
export function InkBleed() {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null>(null);
  const clock = useRef(0);
  const progressRef = useRef(0);
  const activeRef = useRef(false);
  const { diaryState } = usePortfolioStore();

  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2), []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uInkColor: { value: new THREE.Color(0x1a0f08) }, // parchment-900 dark ink
      uPaperColor: { value: new THREE.Color(0xf5e8d0) }, // parchment-300 paper
      uNoiseScale: { value: 0.015 },
      uDisplacement: { value: 0.0 },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform float uProgress;
      uniform vec2 uResolution;
      uniform vec3 uInkColor;
      uniform vec3 uPaperColor;
      uniform float uNoiseScale;
      uniform float uDisplacement;
      varying vec2 vUv;

      // Simplex noise approximation
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      // Fractal Brownian Motion
      float fbm(vec2 p, int octaves) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 6; i++) {
          if (i >= octaves) break;
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;

        // Center-out radial progress for page turn
        float dist = length(uv - 0.5);
        float radialProgress = smoothstep(0.0, 1.0, uProgress - dist * 1.5);

        // Organic ink bleed noise
        float noise = fbm(uv * uNoiseScale * 100.0 + uTime * 0.3, 5);
        float noise2 = fbm(uv * uNoiseScale * 200.0 - uTime * 0.2, 4);

        // Ink bleed edge - organic, feathered
        float bleedEdge = smoothstep(0.3, 0.7, noise + noise2 * 0.5 + uDisplacement);
        float inkMask = radialProgress * bleedEdge;

        // Paper texture
        float paperNoise = fbm(uv * 50.0, 3) * 0.02;

        vec3 color = mix(uPaperColor + paperNoise, uInkColor, inkMask);

        // Subtle vignette at edges
        float vignette = 1.0 - smoothstep(0.7, 1.0, dist * 1.4);
        color *= vignette;

        // Alpha for blending
        float alpha = smoothstep(0.01, 0.1, radialProgress);

        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  }), []);

  // Trigger on page turn (diaryState transitions)
  useEffect(() => {
    if (diaryState === 'opening' || diaryState === 'closing') {
      activeRef.current = true;
      progressRef.current = 0;
    } else if (diaryState === 'open' && activeRef.current) {
      // Fade out after opening completes
      setTimeout(() => {
        activeRef.current = false;
      }, 800);
    }
  }, [diaryState]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    clock.current += delta;
    material.uniforms.uTime.value = clock.current;

    if (activeRef.current) {
      progressRef.current = Math.min(1, progressRef.current + delta * 1.5);
      material.uniforms.uProgress.value = progressRef.current;
      material.uniforms.uDisplacement.value = Math.sin(progressRef.current * Math.PI) * 0.15;
    } else {
      // Fade out
      material.uniforms.uProgress.value = Math.max(0, material.uniforms.uProgress.value - delta * 2);
    }

    // Update resolution on resize
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  });

  if (!activeRef.current && material.uniforms.uProgress.value <= 0) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[0, 0, -0.1]}
      renderOrder={999}
    />
  );
}

export default InkBleed;