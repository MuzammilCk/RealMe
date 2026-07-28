# Phase 2 Control File — Color System Alignment

**Status:** COMPLETE  
**Started:** 2026-07-28  
**Goal:** Create `src/scene/colors.ts` with OKLCH color tokens; replace all raw hex colors in `src/scene/` with OKLCH tokens.

## Tasks

- [x] 2.1 — Create `src/scene/colors.ts` with OKLCH color tokens
- [x] 2.2 — Replace hex colors in `SkillOrbSystem.tsx` (CATEGORY_COLORS)
- [x] 2.3 — Replace hex colors in `LightRig.tsx` (light colors, fog, background)
- [x] 2.4 — Replace hex colors in Effects files (EmberFloat, DustMotes, InkBleed, VolumetricLight)
- [x] 2.5 — Replace hex colors in Materials files (LeatherBrass, Paper, Wood)
- [x] 2.6 — Replace hex colors in Props files (DiaryHero, Books, Camera, Globe, Hourglass, Lamp, Mug, Nameplate, Plant, StickyNotes)
- [x] 2.7 — Replace hex colors in `Diary.tsx`, `Table.tsx`, `textures.ts`
- [x] 2.8 — Replace hex colors in `HDRIEnvironment.tsx`
- [x] 2.9 — Replace hex colors in `KeyboardNavigation.tsx`

## Color Token Categories Created

- **LEATHER** (900, 700, 500, 300) — Diary cover, dark furniture
- **BRASS** (900, 700, 500, 300) — Fittings, corners, lamp, circuit flourishes
- **PARCHMENT** (900, 700, 500, 300, 100) — Diary pages, paper
- **WALNUT** (900, 700, 500) — Desk, table, furniture
- **EMBER** (500, 400, 300, 200) — Warm orange, lamp glow, particle effects
- **MYSTERY** (500, 400, 300) — Purple, AI/ML, backend
- **TEAL** (500, 400) — DevOps, verdigris
- **LIGHTING** (key, fill, rim, ambient, hemiGround, hemiSky, volumetric) — Lighting rig
- **SCENE** (fog, shadow, coolFill, hemiGround, hemiSky, ambient) — Environment
- **ACCENT** (ribbon, camera, lens, leaf, glass, globe, globeAccent, sticky, stickyText, bookDark, bookTeal) — Props and decorative elements
- **CATEGORY** (frontend, backend, devops, ai, hardware) — Skill orb categories
- **UTILITY** (normalMap, aoWhite, emissiveBlack, woodGrain, speckleBlack, grayUtility, whiteUtility) — Procedural texture helpers

## Verification

- [x] No raw hex colors (`#` or `0x`) in `src/scene/` (excluding `colors.ts`) — Verified via `Select-String` (0 matches)
- [x] `npm run typecheck` exits with code 0 (zero errors)
- [x] `npm run build` exits with code 0 (only expected chunk size warning for Three.js)
