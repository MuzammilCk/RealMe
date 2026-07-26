export interface LeatherMaterialProps {
  color?: string;
  roughness?: number;
  metalness?: number;
  normalScale?: [number, number];
}

export interface BrassMaterialProps {
  color?: string;
  roughness?: number;
  metalness?: number;
  envMapIntensity?: number;
  normalScale?: [number, number];
}

export interface PaperMaterialProps {
  color?: string;
  roughness?: number;
  metalness?: number;
  normalScale?: [number, number];
}

export interface WoodMaterialProps {
  color?: string;
  roughness?: number;
  metalness?: number;
  normalScale?: [number, number];
}

// Re-export MeshStandardMaterialProps from three
import type { MeshStandardMaterialParameters as ThreeMeshStandardMaterialParams } from 'three';
export type MeshStandardMaterialProps = ThreeMeshStandardMaterialParams;