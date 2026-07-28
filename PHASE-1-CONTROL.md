# Phase 1 Control File — Fix Architectural Violations

**Status:** COMPLETE  
**Started:** 2026-07-28  
**Goal:** Enforce Layer A / Layer B separation, consolidate event systems, resolve component spec contradictions.

## Tasks

- [x] 1.1 — Remove `useThree` import from `Contact.tsx` — Replaced direct camera mutation with `emitScene.cameraMove()` via eventBus
- [x] 1.2 — Remove `useThree` import from `Experience.tsx` — Replaced direct camera mutation with `emitScene.cameraMove()` via eventBus; also removed dead `_pageTurn` import (1.8)
- [x] 1.3 — Remove `SkillOrbSystem` import from `About.tsx` — Replaced with 2D fallback comment; removed `useThree`, `useFrame`, `THREE` imports; removed `SkillOrbLabel` usage
- [x] 1.4 — Remove `SkillOrbSystem` import from `Skills.tsx` — Replaced with 2D fallback comment; removed `useThree`, `useFrame`, `THREE` imports; moved `SKILL_ORBS`/`SkillOrbData` to `src/data/skillOrbs.ts` (shared data file)
- [x] 1.5 — Replace `window.dispatchEvent` with typed `eventBus` in `useSceneSync.ts` — Replaced both `window.dispatchEvent(new CustomEvent(...))` calls with `emitScene.sectionChange()` and `emitScene.objectHover()`; updated `useSceneEvents` to use `eventBus.on()` instead of `window.addEventListener()`
- [x] 1.6 — Resolve Contact section contradiction — Camera control now emits via eventBus instead of direct `useThree` access
- [x] 1.7 — Remove direct `camera.position` mutation in `useSceneSync.ts` — Replaced all `gsap.to(camera.position, ...)` and direct `camera.position.x/z` mutations with `emitScene.cameraMove()` and `emitScene.cameraFocus()`; updated `useCameraControl` hook similarly
- [x] 1.8 — Remove dead `_pageTurn` import in `Experience.tsx` — Removed `useAudio` import (only consumer was `_pageTurn`)
- [x] 1.9 — Remove dead `hoveredProject` state in `Projects.tsx` — Removed `useState`, `useThree`, `useFrame`, `THREE` imports; removed `cameraTargetRef`, `isOrbitingRef`; camera behavior delegated to `useSceneSync`

## Additional Changes

- Created `src/data/skillOrbs.ts` — Shared `SkillOrbData` interface and `SKILL_ORBS` array, moved from `scene/Props/SkillOrbSystem.tsx` to avoid scene→app import violations
- Updated `src/scene/Props/SkillOrbSystem.tsx` — Imports `SKILL_ORBS`/`SkillOrbData` from `../../data/skillOrbs` instead of defining locally
- Updated `src/ui/components/SkillOrb.tsx` — Imports `SkillOrbData` from `../../data/skillOrbs` instead of `@scene/Props/SkillOrbSystem`
- Removed `gsap`/`ScrollTrigger` imports from `useSceneSync.ts` (no longer needed after eventBus migration)

## Verification

- [x] No imports from `scene/` in `src/app/` or `src/content/` — Verified via `findstr`
- [x] No `useThree` imports in `src/app/sections/` — Verified via `findstr`
- [x] No `useThree` imports in entire `src/app/` directory — Verified via `findstr`
- [x] `eventBus` is used consistently for scene↔UI communication — `emitScene` in Contact/Experience/useSceneSync; `eventBus.on` in useSceneEvents
- [x] No `window.dispatchEvent` calls in `src/` — Verified via `findstr`
- [x] No direct `camera.position` mutations in `useSceneSync.ts` — Verified via `findstr`
- [x] `npm run typecheck` exits with code 0 (zero errors)
- [x] `npm run build` exits with code 0 (only expected chunk size warning for Three.js)
