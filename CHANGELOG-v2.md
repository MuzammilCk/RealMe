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

### ✨ Features Planned

#### Phase 0: Foundation (Week 1)
- [ ] Token system implementation (Layer A + B)
- [ ] Font loading (preload + font-display: swap)
- [ ] Global styles reset with token variables
- [ ] TypeScript strict mode fixes

#### Phase 1: 3D Scene Core (Week 1-2)
- [ ] Scene root with providers (Canvas, Scroll, Theme, Audio)
- [ ] Camera rig (GSAP ScrollTrigger driven, cinematic intro)
- [ ] Environment: Warm HDRI + procedural workshop props
- [ ] Diary hero object (procedural leather cover, brass corners, page physics)
- [ ] Particle systems: Dust motes, ember float, ink bleed, mystery sparkles
- [ ] Post-processing: Bloom (ember), vignette (subtle), color grading (warm), FXAA
- [ ] Skill orbs (instanced, animated, hover→connect lines)
- [ ] Project scrolls (verlet pages, pull-to-camera)
- [ ] Mystery artifacts (procedural glow, discovery animation)

#### Phase 2: UI Component Library (Week 2)
- [ ] Base: Button (CTA/ghost/mystery), Card (elevated/glow), Input (inkwell)
- [ ] Layout: Container, Section, Grid, Flex
- [ ] Typography: Display, Heading, Body, Caption, Eyebrow, Code
- [ ] Feedback: Toast, Modal, Tooltip, Progress (ink fill)
- [ ] Navigation: ScrollProgress (ink bar), SectionNav (brass dots), MobileDrawer
- [ ] 3D Bridge: SkillOrb (React ↔ Three sync), ProjectScroll, ArtifactReveal
- [ ] Effects: GlowPulse, ParticleBurst, TextReveal, PageTurn

#### Phase 3: Section Integration (Week 3)
- [ ] Hero: Diary center, 1200ms intro camera, title stagger, scroll hint
- [ ] About: Diary spread, page-turn on scroll, skill orbs on right page
- [ ] Skills: Constellation filter, orbit camera, hover connect
- [ ] Projects: Desk scrolls, pull-to-modal, detail view
- [ ] Contact: Inkwell form, quill writing animation, brass send, easter egg

#### Phase 4: Polish & A11y (Week 4)
- [ ] Reduced motion (instant transitions, disable particles)
- [ ] High contrast mode (alternate token set)
- [ ] Full keyboard navigation (3D objects focusable)
- [ ] Screen reader labels (aria-live for scroll position)
- [ ] Performance: InstancedMesh, texture atlas, lazy sections
- [ ] Mobile fallback (simplified scene, no post-processing)

#### Phase 5: Deploy (Week 5)
- [ ] Production build verification
- [ ] Lighthouse audit (Perf >90, A11y >95)
- [ ] Vercel deploy with CSP headers
- [ ] Documentation update

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