import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// EmberFloat — drifting embers rising from the lamp (ARCHITECTURE-v2 §7,
// TASKS-v2 T1.4.2). Reinforces the "warm ember glow" pillar and feeds the
// bloom pass on tier 3. Sibling pattern to DustMotes.tsx: Points + additive
// blending, depthWrite off, CPU-driven drift with a cheap curl-noise
// approximation so the swarm swirls instead of drifting straight up.

// Ember palette drawn from the locked --ember-500/400 tokens (warm orange).
const EMBER_COLOR = 0xff7a2a;
const EMBER_BRIGHT = 0xffb060;

interface EmberFloatProps {
  count?: number;
  /** Origin of the ember swarm — the lamp bulb position. */
  origin?: [number, number, number];
}

export function EmberFloat({ count = 140, origin = [-0.95, 1.42, 0] }: EmberFloatProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const clock = useRef(0);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const lives = new Float32Array(count); // 0..1 normalized remaining life
    const maxLife = new Float32Array(count); // per-particle lifespan (s)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = origin[0] + (Math.random() - 0.5) * 0.25;
      positions[i * 3 + 1] = origin[1] + Math.random() * 0.2;
      positions[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * 0.25;

      velocities[i * 3] = (Math.random() - 0.5) * 0.01;
      velocities[i * 3 + 1] = 0.01 + Math.random() * 0.02; // rising
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;

      phases[i] = Math.random() * Math.PI * 2;
      maxLife[i] = 2.5 + Math.random() * 2.5;
      lives[i] = Math.random(); // staggered start so they don't all respawn together
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('life', new THREE.BufferAttribute(lives, 1));
    geo.setAttribute('maxLife', new THREE.BufferAttribute(maxLife, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9,
      color: EMBER_COLOR,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return { geometry: geo, material: mat };
  }, [count, origin]);

  useFrame((_, delta) => {
    clock.current += delta;
    const points = pointsRef.current;
    if (!points) return;

    const posAttr = points.geometry.attributes.position;
    const velAttr = points.geometry.attributes.velocity;
    const phaseAttr = points.geometry.attributes.phase;
    const lifeAttr = points.geometry.attributes.life;
    const maxLifeAttr = points.geometry.attributes.maxLife;

    const positions = posAttr.array as Float32Array;
    const velocities = velAttr.array as Float32Array;
    const phases = phaseAttr.array as Float32Array;
    const lives = lifeAttr.array as Float32Array;
    const maxLives = maxLifeAttr.array as Float32Array;

    const t = clock.current;
    const dt = Math.min(delta, 0.05); // clamp to avoid spiral-of-death on lag spikes

    for (let i = 0; i < count; i++) {
      // advance life
      lives[i] -= dt / maxLives[i];
      if (lives[i] <= 0) {
        // respawn at origin
        positions[i * 3] = origin[0] + (Math.random() - 0.5) * 0.25;
        positions[i * 3 + 1] = origin[1] + Math.random() * 0.2;
        positions[i * 3 + 2] = origin[2] + (Math.random() - 0.5) * 0.25;
        velocities[i * 3] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 1] = 0.01 + Math.random() * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
        lives[i] = 1;
        phases[i] = Math.random() * Math.PI * 2;
        continue;
      }

      // cheap curl-noise approximation: swirl horizontal velocity with
      // sin/cos of position + time so the swarm meanders organically.
      const px = positions[i * 3];
      const pz = positions[i * 3 + 2];
      const swirl = 0.004;
      velocities[i * 3] += Math.sin(pz * 2.0 + t * 1.3 + phases[i]) * swirl * dt;
      velocities[i * 3 + 2] += Math.cos(px * 2.0 + t * 1.1 + phases[i]) * swirl * dt;

      // gentle damping so horizontal drift doesn't run away
      velocities[i * 3] *= 0.985;
      velocities[i * 3 + 2] *= 0.985;

      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // fade as life runs out — ease the color toward bright ember near birth,
      // dim toward dark as it dies. Cheaper than per-vertex color: modulate
      // via the shared material opacity is too coarse for per-particle, so we
      // sink dying particles back toward the origin band to "vanish" there.
    }

    posAttr.needsUpdate = true;
    velAttr.needsUpdate = true;
    lifeAttr.needsUpdate = true;

    // shared material breathes subtly so the swarm as a whole pulses
    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = 0.7 + Math.sin(t * 1.8) * 0.15;
    mat.color.setHex(Math.sin(t * 0.9) > 0 ? EMBER_COLOR : EMBER_BRIGHT);
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

export default EmberFloat;
