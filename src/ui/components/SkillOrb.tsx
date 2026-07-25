import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { forwardRef, useRef, useEffect, useState, type ReactNode, type ForwardedRef } from 'react';
import * as THREE from 'three';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import { SkillOrbSystem, SkillOrbData } from '../../../scene/Props/SkillOrbSystem';

/**
 * SkillOrb - 3D sphere embedded in UI via Canvas portal
 * ARCHITECTURE-v2 §8: 3D Bridge - SkillOrb (React ↔ Three sync)
 * brass/mystery/teal variants, hover expand + label
 */
export interface SkillOrbProps {
  /** Skill data */
  skill: SkillOrbData;
  /** Size of the canvas */
  size?: number;
  /** Click handler */
  onClick?: () => void;
  /** Class name */
  className?: string;
}

export const SkillOrb = forwardRef<HTMLDivElement, SkillOrbProps>(
  ({ skill, size = 120, onClick, className = '' }, ref) => {
    const [hovered, setHovered] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { deviceTier, reducedMotion } = usePortfolioStore();

    // Create a minimal scene with just this orb
    const orbScene = (canvas: HTMLCanvasElement) => {
      // This would mount a mini R3F scene with the orb
      // For now, we use a styled div as fallback
      return null;
    };

    const catColors = {
      frontend: { color: '#ff7a2a', glow: '#ff9d52' },
      backend: { color: '#9b59b6', glow: '#bb86fc' },
      devops: { color: '#2aa89e', glow: '#4ecdc4' },
      ai: { color: '#bb86fc', glow: '#d0bfff' },
      hardware: { color: '#c9a15c', glow: '#e8d4a0' },
    };

    const colors = catColors[skill.category];

    return (
      <motion.div
        ref={ref}
        className={`skill-orb ${className}`}
        style={{
          width: size,
          height: size,
          position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Canvas for 3D orb (only on tier 2+) */}
        {(deviceTier >= 2 && !reducedMotion) && (
          <Canvas
            ref={canvasRef}
            camera={{ position: [0, 0, 3], fov: 30 }}
            gl={{ antialias: true, alpha: true }}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[1, 1, 2]} intensity={0.8} />
            <SkillOrbMesh
              color={colors.color}
              glowColor={colors.glow}
              hovered={hovered}
              proficiency={skill.proficiency}
              reducedMotion={reducedMotion}
            />
          </Canvas>
        )}

        {/* Fallback 2D representation */}
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${colors.glow} 0%, ${colors.color} 60%, ${colors.color}CC 100%)`,
            boxShadow: `
              0 0 ${hovered ? '30px' : '15px'} ${hovered ? '10px' : '5px'} ${colors.glow}40,
              inset 0 -${size * 0.1}px ${size * 0.2}px ${colors.color}80,
              inset 0 ${size * 0.05}px ${size * 0.1}px ${colors.glow}40
            `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
          animate={{
            scale: hovered ? 1.05 : 1,
            rotateZ: reducedMotion ? 0 : hovered ? 5 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        >
          {/* Proficiency ring */}
          <motion.svg
            style={{
              position: 'absolute',
              inset: 0,
              transform: 'rotate(-90deg)',
            }}
            animate={{
              pathLength: skill.proficiency,
            }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
          >
            <circle
              cx="50%"
              cy="50%"
              r={`${(size / 2) - 8}`}
              fill="none"
              stroke={colors.glow}
              strokeWidth="3"
              strokeDasharray={`${Math.PI * (size - 16)} ${Math.PI * (size - 16)}`}
              strokeLinecap="round"
              filter="drop-shadow(0 0 4px currentColor)"
            />
            <circle
              cx="50%"
              cy="50%"
              r={`${(size / 2) - 8}`}
              fill="none"
              stroke={`${colors.color}80`}
              strokeWidth="3"
            />
          </motion.svg>

          {/* Category icon/label */}
          <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
            <div style={{
              fontFamily: 'var(--font-caption)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: colors.glow,
              textShadow: `0 0 8px ${colors.glow}`,
            }}>
              {skill.category.toUpperCase()}
            </div>
          </div>
        </motion.div>

        {/* Tooltip on hover */}
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginBottom: '8px',
              padding: '6px 10px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-default)',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-body)',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              boxShadow: 'var(--shadow-3)',
              zIndex: 10,
            }}
          >
            <div style={{ fontWeight: 600, color: colors.glow }}>{skill.name}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
              {Math.round(skill.proficiency * 100)}% proficiency
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  }
);

/**
 * SkillOrbMesh - 3D mesh for the skill orb (used inside Canvas)
 */
function SkillOrbMesh({
  color,
  glowColor,
  hovered,
  proficiency,
  reducedMotion,
}: {
  color: string;
  glowColor: string;
  hovered: boolean;
  proficiency: number;
  reducedMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const clock = useRef(0);

  useEffect(() => {
    if (!meshRef.current) return;
    meshRef.current.material.color.set(color);
  }, [color]);

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh
        scale={hovered ? 1.3 : 1.15}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={hovered ? 0.3 : 0.15}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main orb */}
      <mesh
        ref={meshRef}
        scale={hovered ? 1.1 : 1}
        onPointerOver={(e) => { e.stopPropagation(); }}
        onPointerOut={(e) => { e.stopPropagation(); }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.3}
          roughness={0.4}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
          transmission={0.1}
          thickness={0.5}
        />
      </mesh>

      {/* Proficiency ring */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        scale={1.05}
      >
        <ringGeometry args={[0.95, 1.05, 64]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default SkillOrb;