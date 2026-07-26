import { useMemo } from 'react';
import * as THREE from 'three';
import { type MeshStandardMaterialProps } from './types';

/**
 * Wood Material - Warm walnut for desk, furniture
 * ARCHITECTURE-v2 §2 Locked Palette: walnut-900, walnut-700, walnut-500
 */
export function WoodMaterial({
  color = '#4a2f1c',
  roughness = 0.55,
  metalness = 0.04,
  ...props
}: MeshStandardMaterialProps) {
  const colorValue = typeof color === 'string' ? color : '#4a2f1c';

  const map = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base wood color
    ctx.fillStyle = colorValue;
    ctx.fillRect(0, 0, 1024, 1024);

    // Wood grain lines
    for (let i = 0; i < 80; i++) {
      const y = Math.random() * 1024;
      const darkness = 0.08 + Math.random() * 0.15;
      ctx.strokeStyle = `rgba(20,12,6,${darkness})`;
      ctx.lineWidth = 1 + Math.random() * 2.5;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 1024; x += 24) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 14);
      }
      ctx.stroke();
    }

    // Knots
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = 15 + Math.random() * 30;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(20,12,6,${0.3 + Math.random() * 0.2})`);
      gradient.addColorStop(0.5, `rgba(20,12,6,${0.15 + Math.random() * 0.1})`);
      gradient.addColorStop(1, 'rgba(20,12,6,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Speckle
    for (let i = 0; i < 800; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 1.5);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [colorValue]);

  const normalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    // Wood grain normal
    for (let i = 0; i < 60; i++) {
      const y = Math.random() * 512;
      ctx.strokeStyle = `rgba(128,128,128,${0.15 + Math.random() * 0.1})`;
      ctx.lineWidth = 2 + Math.random() * 3;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 512; x += 12) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 8);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  const aoMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    // Subtle wood pore shadows
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.02})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <meshStandardMaterial
      map={map}
      normalMap={normalMap}
      normalScale={[0.4, 0.4]}
      aoMap={aoMap}
      aoMapIntensity={0.4}
      color={color}
      roughness={roughness}
      metalness={metalness}
      {...props}
    />
  );
}

/**
 * Dark Walnut Material - For table legs, darker accents
 */
export function DarkWalnutMaterial(props: MeshStandardMaterialProps) {
  return (
    <WoodMaterial
      color="#2b1810"
      roughness={0.75}
      metalness={0.02}
      {...props}
    />
  );
}

/**
 * Light Walnut Material - For highlights, worn edges
 */
export function LightWalnutMaterial(props: MeshStandardMaterialProps) {
  return (
    <WoodMaterial
      color="#8b6914"
      roughness={0.5}
      metalness={0.05}
      {...props}
    />
  );
}

/**
 * Desk Surface Material - Specialized for the main desk
 * Includes subtle wear marks, ink stains, coffee rings
 */
export function DeskSurfaceMaterial() {
  const map = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base walnut
    ctx.fillStyle = '#4a2f1c';
    ctx.fillRect(0, 0, 2048, 1024);

    // Wood grain - horizontal for desk surface
    for (let i = 0; i < 60; i++) {
      const y = (i / 60) * 1024 + (Math.random() - 0.5) * 10;
      const darkness = 0.06 + Math.random() * 0.12;
      ctx.strokeStyle = `rgba(20,12,6,${darkness})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 2048; x += 32) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 8);
      }
      ctx.stroke();
    }

    // Wear marks - areas where hands rest
    const wearAreas = [
      { x: 0.2 * 2048, y: 0.3 * 1024, r: 120 }, // Left hand rest
      { x: 0.8 * 2048, y: 0.3 * 1024, r: 100 }, // Right hand rest
      { x: 0.5 * 2048, y: 0.7 * 1024, r: 80 },  // Center wear
    ];

    wearAreas.forEach(area => {
      const gradient = ctx.createRadialGradient(area.x, area.y, 0, area.x, area.y, area.r);
      gradient.addColorStop(0, 'rgba(255,255,255,0.04)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.015)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(area.x, area.y, area.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Ink stain near inkwell position
    const inkStain = { x: 0.15 * 2048, y: 0.4 * 1024, r: 25 };
    const inkGradient = ctx.createRadialGradient(inkStain.x, inkStain.y, 0, inkStain.x, inkStain.y, inkStain.r);
    inkGradient.addColorStop(0, 'rgba(26,15,8,0.3)');
    inkGradient.addColorStop(0.5, 'rgba(26,15,8,0.1)');
    inkGradient.addColorStop(1, 'rgba(26,15,8,0)');
    ctx.fillStyle = inkGradient;
    ctx.beginPath();
    ctx.arc(inkStain.x, inkStain.y, inkStain.r, 0, Math.PI * 2);
    ctx.fill();

    // Coffee ring near mug position
    const coffeeRing = { x: 0.85 * 2048, y: 0.6 * 1024, r: 18 };
    ctx.strokeStyle = 'rgba(74,47,28,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(coffeeRing.x, coffeeRing.y, coffeeRing.r, 0, Math.PI * 2);
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  const normalMap = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 40; i++) {
      const y = (i / 40) * 512 + (Math.random() - 0.5) * 6;
      ctx.strokeStyle = `rgba(128,128,128,${0.1 + Math.random() * 0.08})`;
      ctx.lineWidth = 2 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= 1024; x += 16) {
        ctx.lineTo(x, y + (Math.random() - 0.5) * 5);
      }
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  return (
    <meshStandardMaterial
      map={map}
      normalMap={normalMap}
      normalScale={[0.35, 0.35]}
      color="#4a2f1c"
      roughness={0.55}
      metalness={0.04}
    />
  );
}

export default WoodMaterial;