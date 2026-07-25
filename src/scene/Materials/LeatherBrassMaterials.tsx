import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

/**
 * Leather Material - Warm, tactile leather for diary cover
 * ARCHITECTURE-v2 §2 Locked Palette: leather-900, leather-700, leather-500
 */
export function LeatherMaterial({ color = '#2b1810', roughness = 0.6, metalness = 0.05, ...props }: JSX.IntrinsicElements['meshStandardMaterial']) {
  // Base leather normal map - procedural or loaded
  const normalMap = useTexture(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    // Add leather grain noise
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(128,128,128,${Math.random() * 0.1})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      normalMap={normalMap}
      normalScale={[0.3, 0.3]}
      {...props}
    />
  );
}

/**
 * Brass Material - Warm brass for fittings, corners, lamp
 * ARCHITECTURE-v2 §2 Locked Palette: brass-900, brass-700, brass-500, brass-300
 */
export function BrassMaterial({
  color = '#c9a15c',
  roughness = 0.35,
  metalness = 0.85,
  envMapIntensity = 1.2,
  ...props
}: JSX.IntrinsicElements['meshStandardMaterial']) {
  const normalMap = useTexture(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 256, 256);
    // Subtle brushed metal texture
    for (let y = 0; y < 256; y += 2) {
      ctx.strokeStyle = `rgba(128,128,128,${0.02 + Math.random() * 0.03})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(256, y);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      envMapIntensity={envMapIntensity}
      normalMap={normalMap}
      normalScale={[0.15, 0.15]}
      {...props}
    />
  );
}

/**
 * Oxidized Brass Material - For aged/weathered brass elements
 */
export function OxidizedBrassMaterial(props: JSX.IntrinsicElements['meshStandardMaterial']) {
  return (
    <BrassMaterial
      color="#8b7343"
      roughness={0.55}
      metalness={0.7}
      envMapIntensity={0.8}
      {...props}
    />
  );
}

/**
 * Polished Brass Material - For shiny brass catches/gleam
 */
export function PolishedBrassMaterial(props: JSX.IntrinsicElements['meshStandardMaterial']) {
  return (
    <BrassMaterial
      color="#e8c56d"
      roughness={0.15}
      metalness={0.95}
      envMapIntensity={1.5}
      {...props}
    />
  );
}

export default LeatherMaterial;