# Phase 4 Control File — Fix Camera System

**Status:** COMPLETE  
**Started:** 2026-07-28  
**Goal:** Consolidate camera system into a single source of truth with consistent values.

## Tasks

- [x] 4.1 — Create `src/scene/camera/config.ts` with all camera constants
  - `CANVAS_CAMERA` — canvas camera config (fov, near, far, dpr)
  - `CAMERA_POSITION_HERO` — resting/intro camera position (0, 4.0, 6.4)
  - `CAMERA_POSITION_DIARY` — diary open camera position (0, 2.5, 2.1)
  - `CAMERA_LOOKAT_HERO` — hero look-at target (0, 0.35, 0)
  - `CAMERA_LOOKAT_DIARY` — diary look-at target (0, 0.5, 0)
  - `SECTION_CAMERA_TARGETS` — per-section camera positions and look-at targets
  - `CAMERA_ANIMATION` — animation durations for all transitions
  - `PARALLAX_SETTINGS` — scroll parallax parameters
  - `IDLE_DRIFT` — idle camera drift parameters
- [x] 4.2 — Update `CameraRig.tsx` to use config constants
  - Replaced `INTRO_CAM`, `DIARY_CAM`, `LOOK_AT` with config imports
  - Replaced hardcoded animation durations with `CAMERA_ANIMATION` constants
  - Replaced idle drift magic numbers with `IDLE_DRIFT` constants
- [x] 4.3 — Update `useSceneSync.ts` to use config constants
  - Removed hardcoded `cameraTargetsRef` and `cameraLookAtRef` Maps
  - Now reads directly from `SECTION_CAMERA_TARGETS`
  - Replaced parallax magic numbers with `PARALLAX_SETTINGS` constants
  - Replaced hardcoded durations with `CAMERA_ANIMATION` constants
  - Updated `useCameraControl` to use config constants
- [x] 4.4 — Update `CanvasRoot.tsx` to use config constants
  - Replaced hardcoded canvas camera config with `CANVAS_CAMERA` and `CAMERA_POSITION_HERO`
- [x] 4.5 — Update `ScrollCamera.ts` to use config constants
  - Replaced hardcoded hero position/fov/lookAt in `DEFAULT_DIARY_KEYFRAMES`
  - Replaced hardcoded fallback lookAt in lerp functions with `CAMERA_LOOKAT_HERO`
- [x] 4.6 — Update `useCamera.ts` to use config constants
  - Replaced hardcoded hero position/fov/lookAt in keyframes
  - Replaced idle drift magic numbers with `IDLE_DRIFT` constants
  - Replaced hardcoded FOV with `CANVAS_CAMERA.fov`
  - Replaced hardcoded lookAt with `CAMERA_LOOKAT_HERO`
- [x] 4.7 — Update `camera/index.ts` to export config

## Findings

- `CameraRig` is properly connected in `CanvasRoot.tsx` — handles intro sequence and diary open/close
- `useSceneSync` hook is defined but NOT imported anywhere in the app — only referenced in comments
- `useCamera` hook is defined but NOT imported anywhere in the app — only referenced in comments
- `useCameraControl` (in `useSceneSync.ts`) is defined but NOT imported anywhere
- These disconnected hooks are noted for Phase 9 (Complete Phase 4 Blocked Tasks)

## Verification

- [x] `npm run typecheck` exits with code 0 (zero errors)
- [x] `npm run build` exits with code 0 (only expected chunk size warning for Three.js)
- [x] No hardcoded camera position vectors outside `config.ts` (verified via `Select-String`)
- [x] All camera positions, look-at targets, and animation durations defined in single source: `src/scene/camera/config.ts`
