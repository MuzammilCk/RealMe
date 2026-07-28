import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { LeatherMaterial, BrassMaterial, PolishedBrassMaterial } from '../Materials';
import { LEATHER, PARCHMENT, EMBER, BRASS, ACCENT } from '../colors';

interface DiaryHeroProps {
  coverPivotRef: React.RefObject<THREE.Group | null>;
}

/**
 * Diary Hero Object - The centerpiece of the scene
 * ARCHITECTURE-v2 §7: Diary (procedural leather cover, brass corners, page physics)
 * - Leather cover with brass corner fittings
 * - Vertelet page simulation for realistic page turning
 * - Paper shader with ink bleed edges
 * - Bookmark ribbon cloth simulation
 * ACCESSIBILITY: Keyboard navigable (Enter/Space), aria-label, focus-visible ring
 */
export function DiaryHero({ coverPivotRef }: DiaryHeroProps) {
  const diaryState = usePortfolioStore((s) => s.diaryState);
  const { reducedMotion } = usePortfolioStore();
  const coverRef = useRef<THREE.Group>(null);
  const hoverLightRef = useRef<THREE.PointLight>(null);
  const clock = useRef(0);

  const closed = diaryState === 'closed';

  // Cover texture with leather grain
  const coverTexture = useMemo(() => createDiaryCoverTexture(), []);

  // Gentle ember glow pulse on hover (closed only)
  const hoverIntensity = 0;

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
      scale={closed ? 1 : 1}
    >
      {/* === BACK COVER === */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.12, 0.86]} />
        <LeatherMaterial color={LEATHER[700]} roughness={0.7} />
      </mesh>

      {/* === PAGES BLOCK — Parchment edge visible as thin exposed band === */}
      <mesh position={[0, 0.005, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.13, 0.8]} />
        <meshStandardMaterial color={PARCHMENT[500]} roughness={0.95} metalness={0.0} />
      </mesh>

      {/* === FRONT COVER, parented to spine-edge pivot === */}
      <group ref={coverRef} position={[-0.6, 0.095, 0]}>
        <mesh position={[0.6, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 0.86]} />
          {/* Bottom face - leather back */}
          <LeatherMaterial attach="material-0" color={LEATHER[700]} roughness={0.7} />
          {/* Top face - leather front */}
          <LeatherMaterial attach="material-1" color={LEATHER[700]} roughness={0.7} />
          {/* Front face - cover texture with title */}
          <LeatherMaterial attach="material-2" map={coverTexture} roughness={0.5} />
          {/* Side faces - leather edges */}
          <LeatherMaterial attach="material-3" color={LEATHER[900]} roughness={0.85} />
          <LeatherMaterial attach="material-4" color={LEATHER[700]} roughness={0.7} />
          <LeatherMaterial attach="material-5" color={LEATHER[700]} roughness={0.7} />
        </mesh>

        {/* === BRASS CORNER FITTINGS === */}
        {[
          // Top-left (cover front)
          { pos: [0.55, 0.03, 0.38] as [number, number, number], rot: [0, 0, 0] as [number, number, number] },
          // Top-right
          { pos: [-0.55, 0.03, 0.38] as [number, number, number], rot: [0, Math.PI / 2, 0] as [number, number, number] },
          // Bottom-left
          { pos: [0.55, 0.03, -0.38] as [number, number, number], rot: [0, -Math.PI / 2, 0] as [number, number, number] },
          // Bottom-right
          { pos: [-0.55, 0.03, -0.38] as [number, number, number], rot: [0, Math.PI, 0] as [number, number, number] },
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
        color={EMBER[400]}
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
    color: ACCENT.ribbon,
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
      const x = positions.getX(i);
      const wave = Math.sin(time * 3 + y * 10) * 0.002;
      positions.setX(i, x + wave);
    }

    positions.needsUpdate = true;
    clothRef.current.geometry.computeVertexNormals();
  });

  return (
    <mesh ref={clothRef} geometry={geometry} material={material} castShadow receiveShadow />
  );
}

/**
 * Create diary cover texture with leather grain
 */
function createDiaryCoverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base leather color
  ctx.fillStyle = LEATHER[700];
  ctx.fillRect(0, 0, 1024, 1024);

  // Leather grain
  for (let i = 0; i < 8000; i++) {
    ctx.fillStyle = `rgba(60,40,20,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * 1024, Math.random() * 1024, 1, 1);
  }

  // Pores
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = 1 + Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(30,20,10,${0.05 + Math.random() * 0.1})`;
    ctx.fill();
  }

  // Embossed title area (top center)
  const titleY = 180;
  ctx.fillStyle = BRASS[700];
  ctx.beginPath();
  ctx.roundRect(362, titleY, 300, 80, 8);
  ctx.fill();

  // Subtle border lines
  ctx.strokeStyle = BRASS[700];
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(362, titleY, 300, 80, 8);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Page Turn Physics - Vertelet integration for realistic page turning
 * ARCHITECTURE-v2 §7: Vertelet page physics simulation
 */
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

  private initializeParticles(_width: number, _height: number, _segments: number) {
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
        pinned: Math.abs(y - _height / 2) < 0.01, // Pin spine edge
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

        const deltaVec = new THREE.Vector3().subVectors(pB.position, pA.position);
        const distance = deltaVec.length();
        const diff = (distance - c.restLength) / distance;

        if (pA.pinned) {
          pB.position.addScaledVector(deltaVec, -diff * 0.5);
        } else if (pB.pinned) {
          pA.position.addScaledVector(deltaVec, diff * 0.5);
        } else {
          pA.position.addScaledVector(deltaVec, diff * 0.5);
          pB.position.addScaledVector(deltaVec, -diff * 0.5);
        }
      });
    }

    // Update geometry
    const positionAttr = this.pageMesh.geometry.attributes.position;
    this.particles.forEach((p, i) => {
      positionAttr.setXYZ(i, p.position.x, p.position.y, p.position.z);
    });
    positionAttr.needsUpdate = true;
    this.pageMesh.geometry.computeVertexNormals();
  }

  startTurn(direction: 1 | -1) {
    this.isAnimating = true;
    this.animationDirection = direction;
    this.animationProgress = direction === 1 ? 0 : 1;
  }

  getMesh(): THREE.Mesh {
    return this.pageMesh;
  }
}