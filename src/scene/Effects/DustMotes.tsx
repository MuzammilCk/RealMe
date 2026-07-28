import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EMBER } from '../colors';

// Dust motes floating in the lamp light - adds life and atmosphere
export function DustMotes({ count = 80 }) {
  const pointsRef = useRef<THREE.Points>(null);
  const clock = useRef(0);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const velocities = new Float32Array(count * 3);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute in a cone under the lamp
      positions[i * 3] = (Math.random() - 0.5) * 3;      // x
      positions[i * 3 + 1] = 0.2 + Math.random() * 3;    // y (above table)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;  // z

      sizes[i] = 0.008 + Math.random() * 0.015;
      alphas[i] = 0.1 + Math.random() * 0.4;

      // Slow drift velocities
      velocities[i * 3] = (Math.random() - 0.5) * 0.002;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.001;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;

      phases[i] = Math.random() * Math.PI * 2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    geo.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

    return geo;
  }, [count]);

  const material = useMemo(() => new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 1,
    vertexColors: false,
    color: EMBER[200],
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((_, delta) => {
    clock.current += delta;
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const velocities = pointsRef.current.geometry.attributes.velocity.array as Float32Array;
    const phases = pointsRef.current.geometry.attributes.phase.array as Float32Array;
    const sizes = pointsRef.current.geometry.attributes.size.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Drift
      positions[i * 3] += velocities[i * 3];
      positions[i * 3 + 1] += velocities[i * 3 + 1];
      positions[i * 3 + 2] += velocities[i * 3 + 2];

      // Gentle sine wave motion
      positions[i * 3] += Math.sin(clock.current * 0.5 + phases[i]) * 0.0003;
      positions[i * 3 + 2] += Math.cos(clock.current * 0.3 + phases[i]) * 0.0003;

      // Boundary wrap - keep in lamp area
      if (positions[i * 3] > 2) positions[i * 3] = -2;
      if (positions[i * 3] < -2) positions[i * 3] = 2;
      if (positions[i * 3 + 1] > 3.5) positions[i * 3 + 1] = 0.2;
      if (positions[i * 3 + 1] < 0.1) positions[i * 3 + 1] = 3.5;
      if (positions[i * 3 + 2] > 2) positions[i * 3 + 2] = -2;
      if (positions[i * 3 + 2] < -2) positions[i * 3 + 2] = 2;

      // Pulsing size
      sizes[i] = (0.008 + Math.random() * 0.015) * (0.8 + Math.sin(clock.current * 2 + phases[i]) * 0.2);
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry} material={material} position={[-0.95, 1.42, 0]} />
  );
}