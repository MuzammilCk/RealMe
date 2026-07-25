import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';

/**
 * Heat Shimmer Effect - Refraction shader on plane above desk
 * Simulates heat rising from lamp using simplex noise distortion
 * ARCHITECTURE-v2 §7: Particle Systems - HeatShimmer (refraction shader, simplex noise)
 */
export function HeatShimmer() {
  const meshRef = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial> | null>(null);
  const clock = useRef(0);
  const { deviceTier, reducedMotion } = usePortfolioStore();

  // Disable on low-tier devices or reduced motion
  if (deviceTier < 2 || reducedMotion) return null;

  const geometry = useMemo(() => new THREE.PlaneGeometry(4, 3, 1, 1), []);

  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntensity: { value: 0.008 },
      uSpeed: { value: 0.3 },
      uScale: { value: 12.0 },
      uHeatCenter: { value: new THREE.Vector2(-0.95 / 6 + 0.5, 1.42 / 3 + 0.5) }, // Normalized lamp position
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      uniform float uTime;
      uniform float uIntensity;
      uniform float uSpeed;
      uniform float uScale;
      uniform vec2 uHeatCenter;
      varying vec2 vUv;

      // Simplex 2D noise
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
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 4; i++) {
          value += amplitude * snoise(p * frequency);
          amplitude *= 0.5;
          frequency *= 2.0;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;

        // Distance from heat center (lamp position)
        float dist = length(uv - uHeatCenter);
        float falloff = smoothstep(0.0, 0.6, 1.0 - dist);

        // Multi-octave noise for organic heat distortion
        float noise1 = fbm(uv * uScale + uTime * uSpeed);
        float noise2 = fbm(uv * uScale * 2.0 - uTime * uSpeed * 1.3) * 0.5;
        float noise3 = fbm(uv * uScale * 0.5 + uTime * uSpeed * 0.7) * 0.25;

        float combinedNoise = noise1 + noise2 + noise3;

        // Vertical heat rises - distortion primarily in Y
        vec2 distortion = vec2(0.0, combinedNoise * falloff * uIntensity);

        // Apply distortion to UV coordinates (simulating refraction)
        vec2 distortedUv = uv + distortion;

        // Output - this effect works by rendering to a render target
        // and sampling the scene behind it. In practice this would need
        // a render pass. For now, output a subtle heat haze visualization.
        float heat = falloff * (0.3 + combinedNoise * 0.4);
        vec3 color = mix(vec3(0.0), vec3(1.0, 0.6, 0.2), heat * 0.1);

        gl_FragColor = vec4(color, heat * 0.15);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  }), []);

  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return;

    clock.current += delta;
    material.uniforms.uTime.value = clock.current;

    // Subtle intensity variation
    material.uniforms.uIntensity.value = 0.006 + Math.sin(clock.current * 0.5) * 0.002;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      position={[-0.95, 1.8, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      renderOrder={100}
    />
  );
}

/**
 * Advanced Heat Shimmer using render target for true refraction
 * More expensive but produces actual refraction of scene behind
 * Disabled by default - enable for tier 3 only
 */
export function HeatShimmerAdvanced() {
  const { deviceTier, reducedMotion } = usePortfolioStore();

  if (deviceTier < 3 || reducedMotion) return null;

  // This would require a custom render pass with render target
  // For now, return the simpler version
  return <HeatShimmer />;
}

export default HeatShimmer;