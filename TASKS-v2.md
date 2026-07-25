# TASKS-v2.md — Implementation Task Tracking

**Project**: "The Diary of Me" v2 Premium 3D Portfolio
**Started**: 2026-07-22
**Status**: IN PROGRESS — Phase 0 (Foundation)

---

## PHASE 0: FOUNDATION & BROKEN BUILD FIXES (Week 0)

### 0.1 Fix Broken Imports & Missing Dependencies
- [x] **T0.1.1** Audit `CanvasRoot.tsx` imports — list all missing files (all Effects exist)
- [x] **T0.1.2** Install `@react-three/postprocessing` (already present in package.json)
- [x] **T0.1.3** Install `gsap` + `@gsap/react` (already present)
- [x] **T0.1.4** Effects exist: `VolumetricLight.tsx`, `PostProcessing.tsx`, `DustMotes.tsx`
- [x] **T0.1.5** Run `npm run dev` — boots clean (2026-07-24)
- [x] **T0.1.6** Run `npm run build` — passes (2026-07-24)

### 0.2 Design Token System (Layer A)
- [x] **T0.2.1** `design-tokens.css` Layer A primitives complete
- [x] **T0.2.2** `globals.css` reset + font wiring complete (fonts via @fontsource)
- [x] **T0.2.3** `utilities.css` helpers complete; `.card-glass` `@apply` bug fixed
- [x] **T0.2.4** `lib/tokens.ts` type-safe token access complete
- [x] **T0.2.5** `index.css` imports only the three token layers
- [x] **T0.2.6** Tailwind v4 — no `@theme`/`tailwind.config.js`; CSS-var tokens are source of truth
- [x] **T0.2.7** Layer B semantic tokens added to `design-tokens.css` (was the real gap)

### 0.3 TypeScript & Build Config
- [x] **T0.3.1** `tsconfig.app.json` strict + path aliases verified
- [x] **T0.3.2** `vite.config.ts` — optimizeDeps + manualChunks; node:url typing fixed
- [x] **T0.3.3** `@fontsource` packages installed & wired in `main.tsx`

---

## PHASE 1: 3D SCENE CORE (Week 1)

### 1.1 Lighting Rig (`src/scene/lighting/`)
- [x] **T1.1.1** `LightRig.tsx` — Key (warm spot), Fill (cool), Rim (brass), all with `castShadow`
- [x] **T1.1.2** `HDRIEnvironment.tsx` — Load `.hdr`/`exr` via `useTexture`, `Environment` from Drei
- [x] **T1.1.3** `VolumetricLight.tsx` — God rays using `VolumetricLight` from Drei + custom shader for dust interaction
- [x] **T1.1.4** Integrate into `CanvasRoot.tsx` — verify shadows, tone mapping (ACESFilmic), exposure

### 1.2 Post-Processing Pipeline (`src/scene/postprocessing/`)
- [x] **T1.2.1** `EffectComposer.tsx` — Wrapper around `EffectComposer` from `@react-three/postprocessing`
- [x] **T1.2.2** `BloomPass.tsx` — Selective bloom (threshold 0.85, intensity 0.6, kernelSize LARGE)
- [x] **T1.2.3** `VignettePass.tsx` — Subtle (0.3, color `#0a0602`)
- [x] **T1.2.4** `FilmPass.tsx` — Grain 0.15, scanlines 0.02, grayscale false
- [x] **T1.2.5** `ColorGrading.tsx` — Warm LUT (3D texture) or shader: lift shadows to amber, push highlights to brass
- [x] **T1.2.6** Chain in `CanvasRoot.tsx` — verify 60fps on target hardware
- [x] **T1.2.7** Warm atmosphere fix — scene bg/fog `#030304`→`#140b05`, warm ambient/fill/rim lights, warm vignette terminus (2026-07-24). Resolves the v1 "too dark, pain to see" complaint vs LOCKED §1.

### 1.3 Camera System (`src/scene/camera/`)
- [x] **T1.3.1** `CameraRig.tsx` — `PerspectiveCamera` + `OrbitControls` (damped, minPolarAngle, maxPolarAngle)
- [x] **T1.3.2** `ScrollCamera.ts` — GSAP ScrollTrigger → camera position/rotation/FOV tween
- [x] **T1.3.3** `GyroCamera.ts` — `useDeviceOrientation` hook → micro-rotation (clamped ±0.5°)
- [x] **T1.3.4** `useCamera.ts` — Hook exposing `cameraRef`, `setFocus(target, duration)`, `setOrbit(enabled)`

### 1.4 Particle Systems (`src/scene/effects/`)
- [x] **T1.4.1** `DustMotes.tsx` — GPU InstancedMesh (2000 quads), size attenuation, Brownian motion shader, depth sorting
- [x] **T1.4.2** `EmberFloat.tsx` — Particles rising from lamp, curl-noise swirl, fade/respawn, additive blending (2026-07-24). Tier-gated count; palette from `--ember-500/400`.
- [x] **T1.4.3** `InkBleed.tsx` — Full-screen shader, triggered by page-turn event, fractal noise + displacement
- [x] **T1.4.4** `HeatShimmer.tsx` — Refraction shader on plane above desk, driven by simplex noise

### 1.5 Core Objects (`src/scene/objects/`)
- [x] **T1.5.1** `Diary/` — Cover (leather material), Pages (paper shader, vertelet simulation), Bookmark (ribbon cloth sim)
- [x] **T1.5.2** `Desk/` — Wood surface (procedural grain), drawers, inkwell, quill, brass fittings
- [x] **T1.5.3** `Artifacts/` — Skill orbs (floating, glow), project scrolls, mystery keys, compass
- [x] **T1.5.4** Materials: `LeatherMaterial`, `BrassMaterial`, `PaperMaterial`, `WoodMaterial` — all PBR, reusable

---

## PHASE 2: UI COMPONENT LIBRARY (Week 2)

### 2.1 Primitive Components (`src/ui/components/`)
- [x] **T2.1.1** `Button/` — Variants: `brass` (primary), `ember` (CTA), `mystery` (accent), `ghost` (subtle). States: hover (glow), active (press), focus-visible, disabled. Framer Motion `whileHover`, `whileTap`.
- [x] **T2.1.2** `Card/` — Elevation levels 1-4, leather/brass border variants, hover lift + glow.
- [x] **T2.1.3** `Panel/` — Sliding/drawer panel, backdrop blur, brass trim, stagger children entrance.
- [x] **T2.1.4** `Tooltip/` — Follow cursor, brass arrow, paper texture bg, delay 200ms.
- [x] **T2.1.5** `DiaryPage/` — Paper texture, ink bleed edges, text in Crimson Pro, turn animation (Framer Motion + custom).
- [x] **T2.1.6** `SkillOrb/` — 3D sphere (R3F) embedded in UI via `<Canvas>` portal, brass/mystery/teal variants, hover expand + label.

### 2.2 Layout Components (`src/ui/layout/`)
- [x] **T2.2.1** `Header/` — Logo (Cinzel Decorative), nav links (brass hover), theme toggle, scroll progress bar.
- [x] **T2.2.2** `Footer/` — Copyright, social links (brass icons), mystery quote.
- [x] **T2.2.3** `Section/` — Wrapper with scroll reveal, staggered children, background vignette option.

### 2.3 UI Hooks (`src/ui/hooks/`)
- [x] **T2.3.1** `useScrollReveal.ts` — IntersectionObserver + Framer `animate`Frament Motion` stagger, respects `prefers-reduced-motion`
- [x] **T2.3.2** `useReducedMotion.ts` — Returns boolean, subscribes to media query
- [x] **T2.3.3** `useTheme.ts` — Theme context (future: warm/cool variants), CSS var manipulation

---

## PHASE 3: INTEGRATION & SCENE-UI SYNC (Week 3)

### 3.1 Providers (`src/app/providers/`)
- [x] **T3.1.1** `ScrollProvider.tsx` — `ScrollContext` with `progress`, `section`, `direction`, `velocity`. Uses `gsap/ScrollTrigger`. (2026-07-25)
- [x] **T3.1.2** `ThemeProvider.tsx` — Token set switching, `prefers-color-scheme`/`prefers-reduced-motion`/`prefers-contrast` listeners. (2026-07-25)
- [x] **T3.1.3** `AudioProvider.tsx` — Web Audio API (no Howler dependency). SFX: `pageTurn`, `brassClick`, `emberWhoosh`, `inkScratch`, `hoverGlow`, `openDiary`, `closeDiary`, `success`. Volume control, mute, persistence. (2026-07-25)

### 3.2 Section Components (`src/app/sections/`)
- [x] **T3.2.1** `Hero/` — Diary hero: 3D diary center, camera intro sequence (1200ms), title reveal (stagger), scroll hint. (2026-07-25)
- [x] **T3.2.2** `About/` — Diary page spread: left page bio, right page skills preview. Page turn on scroll. (2026-07-25)
- [x] **T3.2.3** `Skills/` — Floating constellation of SkillOrbs, connect lines on hover, filter by category. (2026-07-25)
- [x] **T3.2.4** `Projects/` — Project cards on desk, pull toward camera on hover, open modal with details. (2026-07-25)
- [x] **T3.2.5** `Contact/` — Inkwell + quill: form fields appear as ink writing, brass send button, mystery easter egg (7× click). (2026-07-25)

### 3.3 Scene-UI Bridge (`src/lib/`)
- [x] **T3.3.1** `useSceneSync.ts` — Subscribe to `ScrollContext`, drive `CameraRig`, trigger particle bursts, object highlights. (2026-07-25)
- [x] **T3.3.2** `motion.ts` — GSAP presets: `revealUp`, `revealFade`, `staggerChildren`, `pageTurn`, `orbFloat`, `glowPulse`. (2026-07-25)
- [x] **T3.3.3** Event bus: `lib/eventBus.ts` — Typed event bus for scene↔UI communication (2026-07-25)

---

## PHASE 4: POLISH & ACCESSIBILITY (Week 4)

### 4.1 Reduced Motion & High Contrast
- [ ] **T4.1.1** `prefers-reduced-motion` — Disable all Framer/GSAP animations, keep instant state changes
- [ ] **T4.1.2** `prefers-contrast: more` — Alternative token set (high contrast), toggle via ThemeProvider
- [ ] **T4.1.3** Color blind safe verification — Deuteranopia simulation test

### 4.2 Keyboard Navigation & Screen Readers
- [ ] **T4.2.1** All interactive 3D objects: `tabIndex=0`, `onKeyDown` (Enter/Space), `aria-label`
- [ ] **T4.2.2** Focus visible rings — 3px `--border-glow` offset
- [ ] **T4.2.3** Skip links, landmark regions, heading hierarchy

### 4.3 Performance Optimization
- [ ] **T4.3.1** Profile: `chrome://tracing` + React DevTools Profiler
- [ ] **T4.3.2** Optimize: InstancedMesh for repeated objects, texture atlasing, shader minification
- [ ] **T4.3.3** Lazy load: Heavy sections (Projects, Skills) via `React.lazy` + `Suspense`
- [ ] **T4.3.4** Mobile fallback: Simplified scene (no post-processing, reduced particles) via `useMediaQuery`

### 4.4 Content & Copy Polish
- [ ] **T4.4.1** Finalize all copy — mystery tone, brass/ember metaphors
- [ ] **T4.4.2** Easter eggs: Konami code → mystery mode, click inkwell 7× → secret
- [ ] **T4.4.3** Loading screen: Procedural ink blot animation, progress as "drying ink"

---

## PHASE 5: DEPLOY & DOCUMENTATION (Week 5)

### 5.1 Build & Deploy
- [ ] **T5.1.1** Production build verification — `npm run build`, `npm run preview`
- [ ] **T5.1.2** Lighthouse audit — Performance > 90, Accessibility > 95, Best Practices > 90
- [ ] **T5.1.3** Deploy to Vercel/Netlify — configure headers (CSP, font preload)

### 5.2 Documentation
- [ ] **T5.2.1** Update `README.md` — v2 architecture, run commands, env vars
- [ ] **T5.2.2** Write `CONTRIBUTING.md` — Token system, component patterns, 3D workflow
- [ ] **T5.2.3** Archive v1 docs → `docs/v1-archive/`

---

## PROGRESS TRACKING

| Phase | Tasks Total | Completed | In Progress | Blocked | % Done |
|-------|-------------|-----------|-------------|---------|--------|
| 0: Foundation | 16 | 16 | 0 | 0 | 100% |
| 1: 3D Scene Core | 19 | 19 | 0 | 0 | 100% |
| 2: UI Components | 12 | 12 | 0 | 0 | 100% |
| 3: Integration | 11 | 11 | 0 | 0 | 100% |
| 4: Polish | 13 | 0 | 0 | 0 | 0% |
| 5: Deploy | 6 | 0 | 0 | 0 | 0% |
| **TOTAL** | **72** | **58** | **0** | **0** | ~81% |

---

## BLOCKERS & NOTES

- **B0.1** Missing `@react-three/postprocessing` — must install before Phase 1.2
- **B0.2** Font licensing — Cinzel Decorative (OFL), Crimson Pro (OFL), IM Fell English SC (OFL), IBM Plex Sans (OFL), JetBrains Mono (OFL) — all free for commercial use
- **B1.1** HDRI source — Need warm workshop HDRI (Poly Haven "Wooden Workshop" or similar)
- **B1.2** Vertelet page simulation — May need `verlet-js` or custom implementation
- **B3.1** Audio assets — Need subtle SFX (freesound.org or custom recording)

---

## DAILY LOG

### 2026-07-22
- Created ARCHITECTURE-v2.md (locked art direction)
- Created TASKS-v2.md (this file)
- Next: Begin Phase 0.1 — Fix broken imports

### 2026-07-24
- Phase 0 fully closed: build green (tsc + vite), Layer B semantic tokens wired,
  fonts delivered via @fontsource, all Phase 0 blockers resolved (B0.1–B0.7).
- Corrected doc/reality drift: codebase already implements CanvasRoot, CameraRig,
  Diary + Props, DustMotes/VolumetricLight/PostProcessing, content chapters,
  Overlay, LoadingScreen, device-tier + URL-sync store, lib/tokens.ts.
- Next: Phase 1 polish (HDRI, verlet page physics) + Phase 4 a11y/perf audit.