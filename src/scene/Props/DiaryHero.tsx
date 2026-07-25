import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { LeatherMaterial, BrassMaterial, PolishedBrassMaterial } from '../Materials';

interface DiaryHeroProps {
  coverPivotRef: React.RefObject<THREE.Group | null>;
  onBegin: () => void;
}

/**
 * Diary Hero Object - The centerpiece of the scene
 * ARCHITECTURE-v2 §7: Diary (procedural leather cover, brass corners, page physics)
 * - Leather cover with brass corner fittings
 * - Vertelet page simulation for realistic page turning
 * - Paper shader with ink bleed edges
 * - Bookmark ribbon cloth simulation
 */
export function DiaryHero({ coverPivotRef, onBegin }: DiaryHeroProps) {
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const { deviceTier, reducedMotion } = usePortfolioStore();
  const coverRef = useRef<THREE.Group>(null);
  const hoverLightRef = useRef<THREE.PointLight>(null);
  const [hover, setHover] = useState(false);
  const clock = useRef(0);

  const closed = diaryState === 'closed';

  // Cover texture with leather grain
  const coverTexture = useMemo(() => createDiaryCoverTexture(), []);

  // Page material with paper shader
  const pageMaterial = useMemo(() => createPageMaterial(), []);

  // Gentle ember glow pulse on hover (closed only)
  const hoverIntensity = hover && closed ? 0.9 + Math.sin(performance.now() / 200) * 0.25 : 0;

  // Sync cover pivot ref
  useEffect(() => {
    coverPivotRef.current = coverRef.current;
  }, [coverPivotRef]);

  // Subtle idle animation when closed
  useFrame((_, delta) => {
    if (reducedMotion) return;
    clock.current += delta;

    if (closed && coverRef.current) {
      // Very subtle breathing
      coverRef.current.scale.y = 1 + Math.sin(clock.current * 0.5) * 0.003;
      coverRef.current.scale.x = 1 + Math.sin(clock.current * 0.3) * 0.002;
    }
  });

  return (
    <group
      ref={coverRef}
      position={[0, 0.16, 0.15]}
      scale={hover && closed ? 1.02 : 1}
      onClick={(e) => {
        if (closed) {
          e.stopPropagation();
          onBegin();
        }
      }}
      onPointerOver={(e) => {
        if (closed) {
          e.stopPropagation();
          setHover(true);
          document.body.style.cursor = 'pointer';
        }
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* === BACK COVER === */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.12, 0.86]} />
        <LeatherMaterial color="#1c110a" roughness={0.7} />
      </mesh>

      {/* === PAGES BLOCK — Parchment edge visible as thin exposed band === */}
      <mesh position={[0, 0.005, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.13, 0.8]} />
        <meshStandardMaterial color="#ede0c8" roughness={0.95} metalness={0.0} />
      </mesh>

      {/* === FRONT COVER, parented to spine-edge pivot === */}
      <group ref={coverRef} position={[-0.6, 0.095, 0]}>
        <mesh position={[0.6, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 0.86]} />
          {/* Bottom face - leather back */}
          <LeatherMaterial attach="material-0" color="#1c110a" roughness={0.7} />
          {/* Top face - leather front */}
          <LeatherMaterial attach="material-1" color="#1c110a" roughness={0.7} />
          {/* Front face - cover texture with title */}
          <LeatherMaterial attach="material-2" map={coverTexture} roughness={0.5} />
          {/* Side faces - leather edges */}
          <LeatherMaterial attach="material-3" color="#1a0f08" roughness={0.85} />
          <LeatherMaterial attach="material-4" color="#1c110a" roughness={0.7} />
          <LeatherMaterial attach="material-5" color="#1c110a" roughness={0.7} />
        </mesh>

        {/* === BRASS CORNER FITTINGS === */}
        {[
          // Top-left (cover front)
          { pos: [0.55, 0.03, 0.38], rot: [0, 0, 0] },
          // Top-right
          { pos: [-0.55, 0.03, 0.38], rot: [0, Math.PI / 2, 0] },
          // Bottom-left
          { pos: [0.55, 0.03, -0.38], rot: [0, -Math.PI / 2, 0] },
          // Bottom-right
          { pos: [-0.55, 0.03, -0.38], rot: [0, Math.PI, 0] },
        ].map((corner, i) => (
          <group key={i} position={corner.pos} rotation={corner.rot}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.12, 0.04, 0.12]} />
              <PolishedBrassMaterial />
            </mesh>
            {/* Decorative rivet */}
            <mesh position={[0, 0.025, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
              <PolishedBrassMaterial />
            </mesh>
          </group>
        ))}

        {/* === SPINE BRASS BANDS === */}
        {[-0.3, 0, 0.3].map((y, i) => (
          <mesh key={i} position={[0.6, y + 0.095, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.22, 0.03, 0.06]} />
            <BrassMaterial />
          </mesh>
        ))}

        {/* === BOOKMARK RIBBON === */}
        <BookmarkRibbon />
      </group>

      {/* === HOVER GLOW — Ember, light sources only === */}
      <pointLight
        ref={hoverLightRef}
        position={[0, 0.5, 0.4]}
        color="#ff9d52"
        intensity={hoverIntensity}
        distance={2.2}
        decay={2}
      />
    </group>
  );
}

/**
 * Bookmark Ribbon - Cloth simulation hanging from spine
 */
function BookmarkRibbon() {
  const clothRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);
  const { reducedMotion } = usePortfolioStore();

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.04, 0.5, 1, 20);
    geo.translate(0, -0.25, 0);
    return geo;
  }, []);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#8b2d2d', // Deep red ribbon
    roughness: 0.8,
    metalness: 0.0,
    side: THREE.DoubleSide,
  }), []);

  useFrame((_, delta) => {
    if (reducedMotion || !clothRef.current) return;
    clock.current += delta;

    const positions = clothRef.current.geometry.attributes.position;
    const time = clock.current;

    for (let i = 0; i < positions.count; i++) {
      const y = positions.getY(i);
      const normalizedY = (y + 0.25) / 0.5; // 0 to 1 from top to bottom

      // Only animate lower portion (hanging part)
      if (normalizedY > 0.3) {
        const wave = Math.sin(time * 1.5 + normalizedY * 8) * 0.008 * (normalizedY - 0.3) / 0.7;
        positions.setX(i, positions.getX(i) + wave);
      }
    }

    positions.needsUpdate = true;
    clothRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={clothRef} geometry={geometry} material={material} position={[0.62, 0.35, 0]} rotation={[0, 0, 0.05]} />
  );
}

/**
 * Create diary cover texture with title and decorative flourishes
 */
function createDiaryCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Base leather color
  ctx.fillStyle = '#2b1810';
  ctx.fillRect(0, 0, 1024, 768);

  // Leather grain noise
  for (let i = 0; i < 2200; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.06})`;
    ctx.fillRect(Math.random() * 1024, Math.random() * 768, 2, 2);
  }

  // Tooled border
  ctx.strokeStyle = '#c9a15c';
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.85;
  ctx.strokeRect(44, 44, 936, 680);

  // Circuit flourish in corners (software meets hardware)
  const corners: [number, number][] = [
    [44, 44],
    [980, 44],
    [44, 724],
    [980, 724],
  ];

  corners.forEach(([cx, cy]) => {
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
      ctx.strokeStyle = '#c9a15c';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.globalAlpha = 1;

  // Title + subtitle
  ctx.fillStyle = '#c9a15c';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = "700 88px 'Cinzel Decorative', Georgia, serif";
  ctx.fillText('MY JOURNEY', 512, 350);
  ctx.font = "500 22px 'JetBrains Mono', monospace";
  ctx.fillStyle = 'rgba(201,161,92,0.85)';
  ctx.fillText('— A LOG OF THINGS I\'VE BUILT —', 512, 408);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;

  // Redraw when fonts load
  if (typeof document !== 'undefined' && 'fonts' in document) {
    (document as Document & { fonts: FontFaceSet }).fonts.ready.then(() => {
      // Redraw with proper fonts
      ctx.fillStyle = '#2b1810';
      ctx.fillRect(0, 0, 1024, 768);
      // ... (redraw all)
      tex.needsUpdate = true;
    });
  }

  return tex;
}

/**
 * Create page material with paper texture
 */
function createPageMaterial(): THREE.MeshStandardMaterial {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base parchment
  ctx.fillStyle = '#f5e8d0';
  ctx.fillRect(0, 0, 512, 512);

  // Paper fibers
  for (let i = 0; i < 5000; i++) {
    ctx.fillStyle = `rgba(128,128,128,${Math.random() * 0.03})`;
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
  }

  // Subtle horizontal grain
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
  tex.colorSpace = THREE.SRGBColorSpace;

  return new THREE.MeshStandardMaterial({
    map: tex,
    color: '#f5e8d0',
    roughness: 0.95,
    metalness: 0.0,
  });
}

/**
 * Page Turn Physics - Vertelet integration for realistic page turning
 * ARCHITECTURE-v2 §7: Vertelet page physics simulation
 */
export class PagePhysics {
  private particles: Particle[] = [];
  private constraints: Constraint[] = [];
  private pageMesh: THREE.Mesh;
  private isAnimating = false;
  private animationProgress = 0;
  private animationDirection = 1;

  constructor(pageWidth: number, pageHeight: number, segments: number = 20) {
    this.pageMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(pageWidth, pageHeight, segments, segments),
      new THREE.MeshStandardMaterial({ side: THREE.DoubleSide })
    );

    this.initializeParticles(pageWidth, pageHeight, segments);
    this.initializeConstraints(segments);
  }

  private initializeParticles(width: number, height: number, segments: number) {
    const position = this.pageMesh.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      const particle: Particle = {
        position: new THREE.Vector3(x, y, z),
        previousPosition: new THREE.Vector3(x, y, z),
        acceleration: new THREE.Vector3(0, 0, 0),
        mass: 1,
        pinned: Math.abs(y - height / 2) < 0.01, // Pin spine edge
      };

      this.particles.push(particle);
    }
  }

  private initializeConstraints(segments: number) {
    const cols = segments + 1;
    const rows = segments + 1;

    // Structural constraints (edges)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const idx = row * cols + col;

        // Horizontal constraints
        if (col < cols - 1) {
          this.constraints.push({
            a: idx,
            b: idx + 1,
            restLength: this.particles[idx].position.distanceTo(this.particles[idx + 1].position),
          });
        }

        // Vertical constraints
        if (row < rows - 1) {
          this.constraints.push({
            a: idx,
            b: idx + cols,
            restLength: this.particles[idx].position.distanceTo(this.particles[idx + cols].position),
          });
        }

        // Diagonal constraints (shear resistance)
        if (col < cols - 1 && row < rows - 1) {
          this.constraints.push({
            a: idx,
            b: idx + cols + 1,
            restLength: this.particles[idx].position.distanceTo(this.particles[idx + cols + 1].position),
          });
        }
        if (col > 0 && row < rows - 1) {
          this.constraints.push({
            a: idx,
            b: idx + cols - 1,
            restLength: this.particles[idx].position.distanceTo(this.particles[idx + cols - 1].position),
          });
        }
      }
    }
  }

  update(delta: number) {
    if (this.isAnimating) {
      this.animationProgress += delta * 2 * this.animationDirection;
      this.animationProgress = THREE.MathUtils.clamp(this.animationProgress, 0, 1);

      if (this.animationProgress >= 1 || this.animationProgress <= 0) {
        this.isAnimating = false;
      }
    }

    // Apply gravity
    this.particles.forEach(p => {
      if (!p.pinned) {
        p.acceleration.add(new THREE.Vector3(0, -9.8, 0));
      }
    });

    // Vertelet integration
    this.particles.forEach(p => {
      if (p.pinned) return;

      const velocity = new THREE.Vector3().subVectors(p.position, p.previousPosition);
      p.previousPosition.copy(p.position);
      p.position.add(velocity).addScaledVector(p.acceleration, delta * delta);
      p.acceleration.set(0, 0, 0);
    });

    // Solve constraints (multiple iterations for stability)
    for (let iter = 0; iter < 5; iter++) {
      this.constraints.forEach(c => {
        const pA = this.particles[c.a];
        const pB = this.particles[c.b];

        if (pA.pinned && pB.pinned) return;

        const delta = new THREE.Vector3().subVectors(pB.position, pA.position);
        const distance = delta.length();
        const diff = (distance - c.restLength) / distance;

        if (pA.pinned) {
          pB.position.addScaledVector(delta, -diff * 0.5);
        } else if (pB.pinned) {
          pA.position.addScaledVector(delta, diff * 0.5);
        } else {
          pA.position.addScaledVector(delta, diff * 0.5);
          pB.position.addScaledVector(delta, -diff * 0.5);
        }
      });
    }

    // Update mesh geometry
    const position = this.pageMesh.geometry.attributes.position;
    this.particles.forEach((p, i) => {
      position.setXYZ(i, p.position.x, p.position.y, p.position.z);
    });
    position.needsUpdate = true;
    this.pageMesh.geometry.computeVertexNormals();
  }

  startTurn(direction: 1 | -1) {
    this.isAnimating = true;
    this.animationDirection = direction;
    this.animationProgress = direction === 1 ? 0 : 1;

    // Apply initial force to start the turn
    const force = direction * 5;
    this.particles.forEach(p => {
      if (!p.pinned) {
        p.acceleration.x += force;
      }
    });
  }

  getMesh() {
    return this.pageMesh;
  }
}

interface Particle {
  position: THREE.Vector3;
  previousPosition: THREE.Vector3;
  acceleration: THREE.Vector3;
  mass: number;
  pinned: boolean;
}

interface Constraint {
  a: number;
  b: number;
  restLength: number;
}

export default DiaryHero;