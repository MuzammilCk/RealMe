import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Paper Material - Parchment-like paper for diary pages
 * ARCHITECTURE-v2 §2 Locked Palette: parchment-900, parchment-700, parchment-500, parchment-300
 */
export function PaperMaterial({
  color = '#f5e8d0',
  roughness = 0.95,
  metalness = 0.0,
  ...props
}: JSX.IntrinsicElements['meshStandardMaterial']) {
  const normalMap = useTexture(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    // Paper fiber texture
    for (let i = 0; i < 5000; i++) {
      ctx.fillStyle = `rgba(128,128,128,${Math.random() * 0.03})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }
    // Subtle paper grain lines
    for (let y = 0; y < 512; y += 4) {
      ctx.strokeStyle = `rgba(128,128,128,${0.008 + Math.random() * 0.015})`;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 512; x += 8) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 2);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const aoMap = useTexture(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    // Edge darkening for page depth
    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 300);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.92)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }, []);

  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      normalMap={normalMap}
      normalScale={[0.15, 0.15]}
      aoMap={aoMap}
      aoMapIntensity={0.3}
      {...props}
    />
  );
}

/**
 * Aged Paper Material - For older diary pages with yellowing
 */
export function AgedPaperMaterial(props: JSX.IntrinsicElements['meshStandardMaterial']) {
  return (
    <PaperMaterial
      color="#ede0c8"
      roughness={0.98}
      {...props}
    />
  );
}

/**
 * Writing Paper Material - Slightly smoother for ink receptivity
 */
export function WritingPaperMaterial(props: JSX.IntrinsicElements['meshStandardMaterial']) {
  return (
    <PaperMaterial
      color="#faf4eb"
      roughness={0.92}
      {...props}
    />
  );
}

/**
 * Ink Material - For text/ink on paper (can have subtle emissive for glow effects)
 */
export function InkMaterial({
  color = '#1a0f08',
  roughness = 0.9,
  metalness = 0.0,
  emissive = '#000000',
  emissiveIntensity = 0,
  ...props
}: JSX.IntrinsicElements['meshStandardMaterial']) {
  return (
    <meshStandardMaterial
      color={color}
      roughness={roughness}
      metalness={metalness}
      emissive={emissive}
      emissiveIntensity={emissiveIntensity}
      {...props}
    />
  );
}

export default PaperMaterial;