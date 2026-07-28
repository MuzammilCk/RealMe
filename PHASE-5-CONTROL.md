# Phase 5 Control File — Fix Performance Issues

**Status:** COMPLETE  
**Started:** 2026-07-28  
**Goal:** Identify and fix performance issues in the codebase.

## Tasks

- [x] 5.1 — Fix `Diary.tsx` — Move `performance.now()` out of render function
  - Replaced inline `hoverIntensity` computation with `useFrame` loop
  - `useFrame` updates `hoverLightRef.current.intensity` directly, avoiding re-renders
- [x] 5.2 — Fix `SkillOrbSystem.tsx` — Move `new THREE.Object3D()` out of `useFrame`
  - `dummy` Object3D is now created once with `useMemo` and reused across frames
  - Pre-computed emissive `THREE.Color` objects to avoid creating new Color instances in `useFrame`
- [x] 5.3 — Vite build optimizations
  - Added `chunkSizeWarningLimit: 1000` to suppress expected Three.js chunk size warning
  - Added `cssCodeSplit: true` for CSS code splitting
  - Added `sourcemap: false` for production builds
- [x] 5.4 — Remove redundant `motion` dependency from `package.json`
  - `motion` package was not directly imported (0 imports vs 34 from `framer-motion`)
  - `framer-motion` already depends on `motion` as a transitive dependency

## Existing Performance Optimizations (Already in Place)

- `CanvasRoot` is lazy-loaded with `lazy(() => import('./scene/CanvasRoot'))` in `App.tsx`
- `Skills` and `Projects` sections are lazy-loaded with `Suspense` in `layout.tsx`
- 3D canvas only mounts when `threeDEnabled` is true
- `LightRig` uses `useMemo` for all light objects
- `Table` uses `useMemo` for wood texture
- `Diary` uses `useRef` for diary cover texture
- Vite config has `manualChunks` for `three`, `r3f`, `gsap`, and `motion`
- Vite config has `optimizeDeps` for faster dev server startup
- `SkillOrbSystem` uses `InstancedMesh` for efficient rendering
- `SkillOrbSystem` reduces orb count on lower device tiers
- `SkillOrbConnections` limits connections to 5 for performance
- `SkillOrbConnections` disables on device tier < 2

## Verification

- [x] `npm run typecheck` exits with code 0 (zero errors)
- [x] `npm run build` exits with code 0 (no warnings)
- [x] Bundle size unchanged (expected — `motion` was already transitive dep of `framer-motion`)
