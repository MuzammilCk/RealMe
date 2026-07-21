import * as THREE from 'three';
import { COVER } from '../data/chapters';

// All textures are procedural canvas drawings so the v1 build ships with zero
// binary assets. Layer B / the store never touch these — only Layer A.

function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function speckle(ctx: CanvasRenderingContext2D, w: number, h: number, count: number, alpha: number) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * alpha})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
}

// Re-draw once web fonts are ready so the cover title uses Fraunces, not the fallback.
function redrawOnFontsReady(draw: () => void, texture: THREE.CanvasTexture) {
  if (typeof document !== 'undefined' && 'fonts' in document) {
    (document as Document & { fonts: FontFaceSet }).fonts.ready.then(() => {
      draw();
      texture.needsUpdate = true;
    });
  }
}

export function createWoodTexture(): THREE.CanvasTexture {
  const c = makeCanvas(512, 512);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#4a2f1c';
  ctx.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 50; i++) {
    ctx.strokeStyle = `rgba(20,12,6,${0.08 + Math.random() * 0.15})`;
    ctx.lineWidth = 1 + Math.random() * 2.5;
    ctx.beginPath();
    const y = Math.random() * 512;
    ctx.moveTo(0, y);
    for (let x = 0; x <= 512; x += 24) ctx.lineTo(x, y + (Math.random() - 0.5) * 14);
    ctx.stroke();
  }
  speckle(ctx, 512, 512, 800, 0.05);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 1.5);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Circuit-trace flourish: nodes + junctions in brass. The one place software
// and physical electronics meet in the same object (per 02-DESIGN-SYSTEM.md).
function drawFlourishCorner(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.beginPath();
  ctx.arc(cx, cy, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#c9a15c';
  ctx.fill();
  for (let i = 0; i < 4; i++) {
    const ang = Math.random() * Math.PI * 2;
    const len = 22 + Math.random() * 34;
    const mx = cx + Math.cos(ang) * len * 0.6;
    const my = cy + Math.sin(ang) * len * 0.6;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(mx, my);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function createDiaryCoverTexture(): THREE.CanvasTexture {
  const c = makeCanvas(1024, 768);
  const ctx = c.getContext('2d')!;
  const draw = () => {
    ctx.fillStyle = '#2b1810';
    ctx.fillRect(0, 0, 1024, 768);
    speckle(ctx, 1024, 768, 2200, 0.06);
    // tooled border
    ctx.strokeStyle = '#c9a15c';
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.85;
    ctx.strokeRect(44, 44, 936, 680);
    // circuit flourish in the four corners
    const corners: [number, number][] = [
      [44, 44],
      [980, 44],
      [44, 724],
      [980, 724],
    ];
    corners.forEach((p) => drawFlourishCorner(ctx, p[0], p[1]));
    ctx.globalAlpha = 1;
    // title + subtitle
    ctx.fillStyle = '#c9a15c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "700 88px 'Fraunces', Georgia, serif";
    ctx.fillText(COVER.title, 512, 350);
    ctx.font = "500 22px 'JetBrains Mono', monospace";
    ctx.fillStyle = 'rgba(201,161,92,0.85)';
    ctx.fillText(COVER.subtitle, 512, 408);
  };
  draw();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  redrawOnFontsReady(draw, tex);
  return tex;
}

export function createNameplateTexture(): THREE.CanvasTexture {
  const c = makeCanvas(512, 128);
  const ctx = c.getContext('2d')!;
  const draw = () => {
    ctx.fillStyle = '#1c110a';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#c9a15c';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 500, 116);
    ctx.fillStyle = '#c9a15c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = "500 18px 'JetBrains Mono', monospace";
    ctx.fillText('HELLO, I AM —', 256, 40);
    ctx.font = "700 30px 'Fraunces', Georgia, serif";
    ctx.fillText(COVER.nameplate.replace('Hello, I’m — ', ''), 256, 82);
  };
  draw();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  redrawOnFontsReady(draw, tex);
  return tex;
}

export function createBookSpineTexture(label: string): THREE.CanvasTexture {
  const c = makeCanvas(256, 180);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#c9a15c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "600 26px 'JetBrains Mono', monospace";
  ctx.fillText(label, 128, 90);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createGlobeTexture(): THREE.CanvasTexture {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#2a4a4a';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#7a6a45';
  for (let i = 0; i < 14; i++) {
    ctx.beginPath();
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    ctx.ellipse(x, y, 10 + Math.random() * 22, 6 + Math.random() * 14, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createStickyTexture(text: string): THREE.CanvasTexture {
  const c = makeCanvas(256, 256);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#d8c877';
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = '#3a2a14';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "600 40px 'JetBrains Mono', monospace";
  ctx.fillText(text, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
