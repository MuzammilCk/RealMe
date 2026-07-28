import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { usePortfolioStore } from '../../store/usePortfolioStore';
import { SKILL_ORBS, type SkillOrbData } from '../../data/skillOrbs';
import { CATEGORY } from '../colors';

// Category color mapping using OKLCH tokens from colors.ts
const CATEGORY_COLORS: Record<string, { color: string; emissive: string; label: string }> = {
  frontend: { color: CATEGORY.frontend.color, emissive: CATEGORY.frontend.emissive, label: 'Frontend' },
  backend: { color: CATEGORY.backend.color, emissive: CATEGORY.backend.emissive, label: 'Backend' },
  devops: { color: CATEGORY.devops.color, emissive: CATEGORY.devops.emissive, label: 'DevOps' },
  ai: { color: CATEGORY.ai.color, emissive: CATEGORY.ai.emissive, label: 'AI/ML' },
  hardware: { color: CATEGORY.hardware.color, emissive: CATEGORY.hardware.emissive, label: 'Hardware' },
};

/**
 * Skill Orb System - InstancedMesh for efficient rendering of many orbs
 * ARCHITECTURE-v2 §7: Skill orbs (instanced, animated, hover→connect lines)
 * Hover expand + label, connect lines on hover using Drei Line or custom shader
 * ACCESSIBILITY: Keyboard navigable with arrow keys, each orb focusable
 */
interface SkillOrbSystemProps {
  count?: number;
  radius?: number;
  onHover?: (skill: SkillOrbData | null) => void;
  onClick?: (skill: SkillOrbData) => void;
}

export function SkillOrbSystem({
  count = SKILL_ORBS.length,
  radius = 1.8,
  onHover,
  onClick,
}: SkillOrbSystemProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const hoveredIndex = useRef<number | null>(null);
  const focusedIndex = useRef<number | null>(null);
  const clock = useRef(0);
  const [hoveredSkill, setHoveredSkill] = useState<SkillOrbData | null>(null);
  const { deviceTier, reducedMotion } = usePortfolioStore();

  // Reduce count on lower tiers
  const actualCount = useMemo(() => {
    if (deviceTier === 1) return Math.min(count, 15);
    if (deviceTier === 2) return Math.min(count, 25);
    return count;
  }, [count, deviceTier]);

  // Store base positions for animation and connection lines
  const basePositionsRef = useRef<THREE.Vector3[]>([]);

  // Generate orbital positions (Fibonacci sphere distribution)
  const positions = useMemo(() => {
    const pos: THREE.Vector3[] = [];
    const colors: THREE.Color[] = [];
    const scales: number[] = [];

    for (let i = 0; i < actualCount; i++) {
      const skill = SKILL_ORBS[i % SKILL_ORBS.length];
      const catColors = CATEGORY_COLORS[skill.category];

      // Fibonacci sphere for even distribution
      const phi = Math.acos(1 - 2 * (i + 0.5) / actualCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi) + 1.5; // Center above table
      const z = radius * Math.sin(phi) * Math.sin(theta);

      pos.push(new THREE.Vector3(x, y, z));
      colors.push(new THREE.Color(catColors.color));
      scales.push(0.08 + skill.proficiency * 0.04); // Size by proficiency
    }

    basePositionsRef.current = pos;
    return { pos, colors, scales };
  }, [actualCount, radius]);

  // InstancedMesh geometry and materials
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(0.1, 2), []);
  const baseMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    transparent: true,
    opacity: 0.9,
    metalness: 0.3,
    roughness: 0.4,
    vertexColors: true,
  }), []);

  // Initialize InstancedMesh
  useEffect(() => {
    if (!meshRef.current) return;

    const mesh = meshRef.current;
    mesh.count = actualCount;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(actualCount * 3), 3);

    const dummy = new THREE.Object3D();

    positions.pos.forEach((position, i) => {
      dummy.position.copy(position);
      dummy.scale.setScalar(positions.scales[i]);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, positions.colors[i]);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, [actualCount, positions]);

  // Pre-compute emissive colors for hover/focus to avoid creating Color objects in useFrame
  const emissiveColors = useMemo(() => {
    const colors: Record<string, THREE.Color> = {};
    for (const key of Object.keys(CATEGORY_COLORS)) {
      colors[key] = new THREE.Color(CATEGORY_COLORS[key].emissive);
    }
    return colors;
  }, []);

  // Animation frame - floating, orbiting, pulsing
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame((_, delta) => {
    if (reducedMotion) return;

    clock.current += delta;
    const mesh = meshRef.current;
    if (!mesh) return;

    const time = clock.current;

    positions.pos.forEach((basePos, i) => {
      const skill = SKILL_ORBS[i % SKILL_ORBS.length];

      // Gentle orbital motion
      const orbitSpeed = 0.15 + (i % 5) * 0.03;
      const orbitRadius = 0.08 + (i % 3) * 0.04;

      dummy.position.x = basePos.x + Math.sin(time * orbitSpeed + i) * orbitRadius;
      dummy.position.y = basePos.y + Math.cos(time * orbitSpeed * 0.7 + i * 2) * orbitRadius * 0.5;
      dummy.position.z = basePos.z + Math.sin(time * orbitSpeed * 1.3 + i * 3) * orbitRadius;

      // Hover/focus scale expansion
      const isHovered = hoveredIndex.current === i;
      const isFocused = focusedIndex.current === i;
      const targetScale = (isHovered || isFocused) ? positions.scales[i] * 1.8 : positions.scales[i];
      const currentScale = dummy.scale.x;
      dummy.scale.setScalar(currentScale + (targetScale - currentScale) * 0.15);

      // Pulsing glow
      const pulse = 1 + Math.sin(time * 2 + i * 0.5) * 0.05;
      dummy.scale.multiplyScalar(pulse);

      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);

      // Update color for hover/focus glow
      if (isHovered || isFocused) {
        mesh.setColorAt(i, emissiveColors[skill.category]);
      } else {
        mesh.setColorAt(i, positions.colors[i]);
      }
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  });

  // Keyboard navigation handler

  return (
    <group
      aria-label="Skill orbs constellation - use arrow keys to navigate, Enter to select"
    >
      <instancedMesh
        ref={meshRef}
        args={[geometry, baseMaterial, actualCount]}
        onPointerOver={(e) => {
          const idx = (e as any).instanceId;
          if (idx !== undefined && idx < actualCount) {
            hoveredIndex.current = idx;
            const skill = SKILL_ORBS[idx % SKILL_ORBS.length];
            setHoveredSkill(skill);
            onHover?.(skill);
          }
        }}
        onPointerOut={() => {
          hoveredIndex.current = null;
          setHoveredSkill(null);
          onHover?.(null);
        }}
        onClick={(e) => {
          const idx = (e as any).instanceId;
          if (idx !== undefined && idx < actualCount) {
            const skill = SKILL_ORBS[idx % SKILL_ORBS.length];
            onClick?.(skill);
          }
        }}
      />

      {/* Connection lines - rendered separately for hovered/focused orb */}
      {(hoveredSkill || focusedIndex.current !== null) && (
        <SkillOrbConnections
          hoveredSkill={hoveredSkill}
          focusedIndex={focusedIndex.current}
          basePositions={basePositionsRef.current}
        />
      )}
    </group>
  );
}

/**
 * Connection Lines - Draw lines from hovered/focused orb to related orbs (same category)
 */
function SkillOrbConnections({
  hoveredSkill,
  focusedIndex,
  basePositions,
}: { hoveredSkill: SkillOrbData | null; focusedIndex: number | null; basePositions: THREE.Vector3[] }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const clock = useRef(0);
  const { deviceTier } = usePortfolioStore();

  if (deviceTier < 2) return null; // Disable connections on low tier

  // Find hovered/focused orb index
  const targetIndex = focusedIndex ?? SKILL_ORBS.findIndex(s => s.id === hoveredSkill?.id);

  if (targetIndex === -1 || targetIndex >= basePositions.length) return null;

  // Find related orbs (same category)
  const relatedIndices = SKILL_ORBS
    .map((s, i) => ({ skill: s, index: i }))
    .filter(({ skill, index }) => skill.category === SKILL_ORBS[targetIndex].category && index !== targetIndex && index < basePositions.length)
    .slice(0, 5); // Limit connections for performance

  if (relatedIndices.length === 0) return null;

  // Build line geometry
  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(relatedIndices.length * 6); // 2 points per line * 3 coords

    relatedIndices.forEach(({ index }, i) => {
      const start = basePositions[targetIndex];
      const end = basePositions[index];

      if (start && end) {
        positions[i * 6] = start.x;
        positions[i * 6 + 1] = start.y;
        positions[i * 6 + 2] = start.z;
        positions[i * 6 + 3] = end.x;
        positions[i * 6 + 4] = end.y;
        positions[i * 6 + 5] = end.z;
      }
    });

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setDrawRange(0, relatedIndices.length * 2);
    return geo;
  }, [targetIndex, basePositions, relatedIndices]);

  useFrame((_, delta) => {
    clock.current += delta;
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(clock.current * 3) * 0.15;
    }
  });

  const targetSkill = SKILL_ORBS[targetIndex];

  return (
    <lineSegments ref={lineRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color={CATEGORY_COLORS[targetSkill.category]?.emissive}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/**
 * Skill Orb Label Tooltip - HTML overlay for hovered/focused orb
 */
export function SkillOrbLabel({ skill, position }: { skill: SkillOrbData | null; position: THREE.Vector3 }) {
  const { camera } = useThree();

  if (!skill) return null;

  const screenPos = position.clone().project(camera);
  const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-screenPos.y * 0.5 + 0.5) * window.innerHeight;

  return (
    <html
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translate(-50%, -120%)',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div className="font-mono text-xs text-brass px-2 py-1 bg-void/95 border border-brass/30 rounded whitespace-nowrap">
        {skill.name}
      </div>
    </html>
  );
}

export default SkillOrbSystem;