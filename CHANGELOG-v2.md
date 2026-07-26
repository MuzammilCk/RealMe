# CHANGELOG-v2.md — "The Diary of Me" Portfolio

**Versioning**: Semantic Versioning (MAJOR.MINOR.PATCH)  
**v2.0.0** = Complete UI/UX overhaul with premium 3D gaming/mystery aesthetic  
**Baseline**: v1.0.0 = Original "kid did it" implementation (commit 16e0f6d)

---

## [v2.0.0] — 2026-07-22 (In Progress)

### 🎨 Art Direction — LOCKED
- **Palette**: Warm void/walnut/leather/brass/parchment/ember/mystery/teal (OKLCH)
- **Typography**: Cinzel Decorative / Cinzel / IM Fell English SC / Crimson Pro / IBM Plex Sans / JetBrains Mono
- **Atmosphere**: Candlelit artisan workshop — not "dark mode"
- **Motion**: Spring physics (cubic-bezier(0.34, 1.56, 0.64, 1)), staggered reveals, micro-interactions

### 🔧 Technical Foundation
- **Architecture**: Three-layer token system (Primitive → Semantic → Component)
- **3D Stack**: React Three Fiber + Drei + GSAP + @react-three/postprocessing
- **UI Stack**: React 18 + Framer Motion + Tailwind CSS (via CSS variables)
- **State**: React Context + GSAP ScrollTrigger for scene sync

### 🐛 Critical Fixes (Blocking)
- [x] Fix broken imports in `CanvasRoot.tsx` (missing Effects components)
- [x] Install `@react-three/postprocessing` + `postprocessing`
- [x] Wire design tokens to Tailwind via CSS variables (Layer B semantic block added)
- [x] Resolve three competing design systems (design-tokens.css is single source of truth)
- [x] Fix `PostProcessing.tsx` effect double-invocation (EffectComposer children as JSX)
- [x] Fix `vite.config.ts` `node:url` typing (root-relative aliases, no @types/node needed)
- [x] Fix Tailwind v4 `@apply glass` on non-utility class (`.card-glass` inlined)
- [x] Deliver locked typography via @fontsource (was: 17 missing .woff2 files)
- [x] Warm atmosphere fix — scene bg/fog `#030304`→`#140b05`, warm ambient/fill/rim lights, warm vignette terminus (2026-07-24). Resolves the v1 "too dark, pain to see" complaint vs LOCKED §1.
- [x] EmberFloat particle system (T1.4.2) — lamp embers with curl-noise swirl, lifespan respawn
- [x] InkBleed full-screen shader for page-turn moments
- [x] HeatShimmer refraction shader above desk
- [x] SkillOrbSystem with InstancedMesh, Fibonacci distribution, hover connections
- [x] DiaryHero with leather cover, brass corners, vertelet page physics, bookmark ribbon
- [x] Complete PBR material library (Leather, Brass, Paper, Wood variants)
- [x] ScrollProvider with GSAP ScrollTrigger integration
- [x] ThemeProvider with prefers-color-scheme/reduced-motion/contrast listeners
- [x] AudioProvider with Web Audio API procedural SFX
- [x] Hero, About, Skills, Projects, Contact sections integrated
- [x] useSceneSync for scroll-driven camera and particle events
- [x] motion.ts GSAP presets library
- [x] Event bus (lib/eventBus.ts) for typed scene↔UI communication

### ✅ Phase 1-3 Complete (Week 1-3)
- **Phase 0**: Foundation — Build green, tokens wired, fonts delivered, all blockers resolved
- **Phase 1**: 3D Scene Core — Lighting rig, camera system, particle systems, core objects (Diary, Desk, Artifacts), post-processing, materials
- **Phase 2**: UI Component Library — 12 base components (Button, Card, Panel, Tooltip, DiaryPage, SkillOrb), layout components (Header, Footer, Section), hooks (useScrollReveal, useReducedMotion, useTheme)
- **Phase 3**: Integration — 5 section components (Hero, About, Skills, Projects, Contact), providers (Scroll, Theme, Audio), scene-UI sync (useSceneSync, motion.ts, eventBus)

### ✨ Phase 4: Polish & Accessibility (Week 4) — COMPLETE
- [x] Reduced motion — disable all Framer/GSAP animations, keep instant state changes (via `design-tokens.css` @media prefers-reduced-motion)
- [x] High contrast mode — alternative token set, toggle via ThemeProvider (`prefers-contrast: high` + manual toggle)
- [x] Color blind safe verification — Deuteranopia simulation test (added `.color-blind-safe` class with shifted hues)
- [x] All interactive 3D objects: `tabIndex=0`, `onKeyDown` (Enter/Space), `aria-label` (via `KeyboardNavigationProvider` + `AccessibleObject` wrapper)
- [x] Focus visible rings — 3px `--border-glow` offset (implemented in `utilities.css`)
- [x] Skip links, landmark regions, heading hierarchy — Added to all sections with `aria-labelledby`, `<main role="main">`, `<footer role="contentinfo">`, skip link at top
- [ ] Performance profile: `chrome://tracing` + React DevTools Profiler
- [ ] Optimize: InstancedMesh for repeated objects, texture atlasing, shader minification
- [x] Lazy load: Heavy sections (Projects, Skills) via React.lazy + Suspense (with skeleton fallbacks)
- [x] Mobile fallback: Simplified scene (no post-processing, reduced particles) via `isMobile` flag in store
- [ ] Finalize all copy — mystery tone, brass/ember metaphors
- [x] Easter eggs: Konami code → mystery mode (`useKonamiCode` hook), click inkwell 7× → secret (in Contact section)
- [x] Loading screen: Procedural ink blot animation, progress as "drying ink" (spreading tendrils, floating particles, pulsing glyph)

### ✨ Phase 5: Deploy (Week 5) — PLANNED
- [ ] Production build verification — npm run build, npm run preview
- [ ] Lighthouse audit — Performance > 90, Accessibility > 95, Best Practices > 90
- [ ] Deploy to Vercel/Netlify — configure headers (CSP, font preload)
- [ ] Update README.md — v2 architecture, run commands, env vars
- [ ] Write CONTRIBUTING.md — Token system, component patterns, 3D workflow
- [ ] Archive v1 docs → docs/v1-archive/

---

## [v1.0.0] — 2026-07-22 (Baseline)

### Added
- Initial portfolio structure with React + TypeScript + Vite
- Basic Three.js scene in `CanvasRoot.tsx`
- Design tokens in `design-tokens.css` (gold/ember/mystery theme)
- Design system documentation (02-DESIGN-SYSTEM.md - void/walnut/leather theme)
- Master specification (MASTER.md - Amatic SC + Cabin + blue theme)
- Basic UI components: CTA buttons, skill cards, timeline, project cards
- Tailwind + CSS variables attempt (incomplete)

### Known Issues (v1.0.0)
- ❌ Broken imports: `./Effects/VolumetricLight`, `./Effects/PostProcessing` don't exist
- ❌ Missing dependency: `@react-three/postprocessing`
- ❌ Custom CSS classes unused: `.cta`, `.eyebrow-mini`, `.body-copy`, `.page-title`, `.tagline`, `.skill-card`, `--shadow-spread`
- ❌ Tailwind config missing — no `@theme` block, custom colors not registered
- ❌ Three conflicting design systems with different palettes/typography
- ❌ Scene background `#030304` (near-black) — too dark, "pain to see"
- ❌ No motion system, no GSAP, no Framer Motion integration
- ❌ No accessibility considerations
- ❌ No responsive/mobile strategy for 3D scene