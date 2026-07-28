# Phase-by-Phase Implementation Plan
## "The Diary of Me" Portfolio — Fix All Issues & Complete Unfinished Work

**Created:** 2026-07-28  
**Based on:** Full Audit Report (`AUDIT-REPORT.md`), `.claude/skills/` reference documentation, frontend-design/optimize/harden skills  
**Goal:** Fix all 183 TypeScript errors, resolve architectural violations, complete unfinished work, and achieve a production-ready build.

---

## MCP Server Integration

The following MCP servers are configured in `.mcp.json` and should be used throughout implementation:

| Server | Purpose | How to Use |
|--------|---------|------------|
| `filesystem` | File system access to `D:\projects` | Read/write/edit all project files |
| `chrome-devtools` | Browser DevTools | Inspect runtime performance, debug 3D scene |
| `playwright` | Browser automation | E2E testing, visual regression, accessibility testing |
| `github` | GitHub API | Issue tracking, PR management, CI/CD |
| `context7` | Documentation search | Look up Three.js, R3F, GSAP, Framer Motion docs |
| `21st` | Design system (HTTP) | UI component inspiration, design patterns |
| `magicuidesign-mcp` | Magic UI components | Pre-built animated components |
| `shadcn` | shadcn/ui components | Component library reference |

**Note:** MCP tools are not directly available in this environment. The skills and reference documentation from `.claude/skills/` are used as design/development guidance instead. The `playwright` MCP server should be used for E2E testing once the build is fixed.

---

## Design System Alignment (from `.claude/skills/` reference)

### Three-Layer Token Architecture (design-system skill)

The project should follow a three-layer token architecture:

```
Primitive (raw OKLCH values)     →  design-tokens.css Layer A
       ↓
Semantic (purpose aliases)       →  design-tokens.css Layer B
       ↓
Component (component-specific)   →  CSS custom properties in component styles
```

**Current state:** The project has Layer A (primitives) and Layer B (semantic) in `design-tokens.css`, but the 3D scene code bypasses both layers by using raw hex/numeric values.

**Action:** Create `src/scene/colors.ts` that exports OKLCH color constants derived from the design tokens, and use these throughout the 3D scene code.

### Absolute Bans (impeccable skill)

The following patterns must NOT be introduced during implementation:

- **Side-stripe borders** — `border-left`/`border-right` > 1px as colored accent
- **Gradient text** — `background-clip: text` with gradient
- **Glassmorphism as default** — blur effects used decoratively
- **Hero-metric template** — big number, small label, gradient accent
- **Identical card grids** — same-sized cards with icon + heading + text, repeated
- **Tiny uppercase eyebrows** — small all-caps text above every section
- **Numbered section markers** — `01 / 02 / 03` as default scaffolding
- **Text overflow** — headings overflowing containers at any breakpoint

### Color Strategy (impeccable skill)

The project currently uses a "committed" color strategy (one saturated color carries 30-60% of the surface). The audit found that hex colors in the 3D scene don't match the locked OKLCH palette.

**Action:** All 3D scene colors must be derived from the locked OKLCH tokens:
- `void-950`: `oklch(0.08 0.005 240)` — scene background
- `walnut-900`: `oklch(0.15 0.04 35)` — wood textures
- `leather-900`: `oklch(0.18 0.03 25)` — diary cover
- `brass-500`: `oklch(0.72 0.14 85)` — brass fittings
- `parchment-300`: `oklch(0.92 0.03 55)` — paper/pages
- `ember-400`: `oklch(0.75 0.16 45)` — warm glow
- `mystery-400`: `oklch(0.62 0.18 285)` — amethyst accents
- `teal-400`: `oklch(0.68 0.14 185)` — verdigris

### Typography (frontend-design skill)

**DO:**
- Use modular type scale with fluid sizing (clamp)
- Vary font weights and sizes for clear visual hierarchy
- Cap body line length at 65-75ch
- Use `text-wrap: balance` on h1-h3, `text-wrap: pretty` on long prose
- Hero/display heading ceiling: clamp() max ≤ 6rem
- Display heading letter-spacing floor: ≥ -0.04em

**DON'T:**
- Use overused fonts (Inter, Roboto, Arial, Open Sans, system defaults)
- Use monospace typography as lazy "technical" shorthand
- Use gradient text for "impact"
- Put large icons with rounded corners above every heading

### Motion (frontend-design + impeccable skills)

**DO:**
- Use exponential easing (ease-out-quart/quint/expo) for natural deceleration
- Use motion to convey state changes (entrances, exits, feedback)
- Stagger items within lists (but each reveal should fit what it reveals)
- Reveal animations must enhance an already-visible default
- Use GPU-accelerated properties (transform, opacity)
- Every animation needs `@media (prefers-reduced-motion: reduce)` alternative

**DON'T:**
- Animate CSS layout properties (width, height, padding, margin)
- Use bounce or elastic easing
- Gate content visibility on class-triggered transitions
- Use decorative-only animation

### Accessibility (ui-ux-pro-max skill)

**Priority 1 (CRITICAL):**
- Contrast ≥4.5:1 for body text, ≥3:1 for large text
- Visible focus rings (2-4px) on interactive elements
- Alt text for meaningful images
- aria-label for icon-only buttons
- Keyboard navigation (Tab order matches visual order)
- Form labels with `for` attribute
- Skip links for keyboard users
- Sequential heading hierarchy (h1→h6, no skips)
- Don't convey info by color alone

**Priority 2 (CRITICAL):**
- Min touch size 44×44px
- 8px+ spacing between interactive elements
- Loading feedback for all actions

### Performance (optimize skill)

**Core Web Vitals targets:**
- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

**Key optimizations:**
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Avoid layout thrashing (batch reads, then batch writes)
- Use CSS `contain` for independent regions
- Use `content-visibility: auto` for long lists
- Lazy load below-fold content
- Use `font-display: swap` for fonts
- Set dimensions on images/videos (prevent CLS)
- Use `aspect-ratio` CSS property

### Hardening (harden skill)

**Edge cases to test:**
- Very long text (100+ characters in names/titles)
- Very short text (empty, single character)
- Special characters (emoji, RTL text, accents)
- Large datasets (1000+ items)
- No data (empty states)
- Network failures (offline, slow, timeout)
- Concurrent operations (double-submission)

**Key hardening patterns:**
- `min-width: 0` on flex/grid items to prevent overflow
- `word-wrap: break-word` for long text
- `hyphens: auto` for better wrapping
- Clear error messages with retry options
- Preserve user input on errors
- Disable buttons while loading (prevent double-submission)
- `aspect-ratio` for media to prevent CLS

---

---

## Phase 0: Fix the Build (CRITICAL — Must be first)

**Goal:** Get `npm run build` passing with zero TypeScript errors.

**Estimated Effort:** 2–3 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 0.1 | Fix `verbatimModuleSyntax` violations — add `import type` for `HTMLMotionProps`, `SkillOrbData`, etc. | `src/ui/components/Button.tsx`, `Card.tsx`, `DiaryPage.tsx`, `Input.tsx`, `Panel.tsx`, `SkillOrb.tsx` | 🔴 Critical |
| 0.2 | Remove all unused imports/variables (`noUnusedLocals`/`noUnusedParameters`) | `Button.tsx`, `Card.tsx`, `DiaryPage.tsx`, `Modal.tsx`, `Panel.tsx`, `SkillOrb.tsx`, `Toast.tsx`, `Experience.tsx` | 🔴 Critical |
| 0.3 | Create missing component files: `Divider`, `Spinner`, `Tabs`, `Accordion`, `Dropdown`, `Progress` | `src/ui/components/` | 🔴 Critical |
| 0.4 | Fix `Typography` export — add named export or fix `index.ts` | `src/ui/components/Typography.tsx`, `index.ts` | 🔴 Critical |
| 0.5 | Fix `Toast` export — add named `Toast` export or fix `index.ts` | `src/ui/components/Toast.tsx`, `index.ts` | 🔴 Critical |
| 0.6 | Fix `SkillOrb.tsx` import path: `../../../store/` → `../../store/` | `src/ui/components/SkillOrb.tsx:5` | 🔴 Critical |
| 0.7 | Fix Framer Motion type conflicts (`HTMLMotionProps` vs native event handlers) | All UI components using `motion.*` | 🔴 Critical |
| 0.8 | Fix `Card.tsx` index signature error (`elevationShadows[number]`) | `src/ui/components/Card.tsx:82` | 🔴 Critical |
| 0.9 | Fix `Toast.tsx` index signature error (`icons[string]`) | `src/ui/components/Toast.tsx:118` | 🔴 Critical |
| 0.10 | Fix `Modal.tsx` — `style` prop not in `ModalProps`, `colors` unused | `src/ui/components/Modal.tsx` | 🔴 Critical |
| 0.11 | Fix `IconButton.tsx` — `children` + `aria-label` type conflict | `src/ui/components/IconButton.tsx:81` | 🔴 Critical |
| 0.12 | Fix `SkillOrb.tsx` — `meshRef.current.material.color` type error | `src/ui/components/SkillOrb.tsx:212` | 🔴 Critical |
| 0.13 | Verify `npm run build` passes | — | 🔴 Critical |

### Verification
- `npx tsc -b` exits with code 0
- `npm run build` exits with code 0
- `npm run typecheck` exits with code 0

---

## Phase 1: Fix Architectural Violations (HIGH)

**Goal:** Enforce Layer A / Layer B separation, consolidate event systems, resolve component spec contradictions.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 1.1 | Remove `useThree` import from `Contact.tsx` section | `src/app/sections/Contact.tsx:3` | 🔴 High |
| 1.2 | Remove `useThree` import from `Experience.tsx` section | `src/app/sections/Experience.tsx:3` | 🔴 High |
| 1.3 | Remove `SkillOrbSystem` import from `About.tsx` — use 2D fallback or bridge component | `src/app/sections/About.tsx:6` | 🔴 High |
| 1.4 | Remove `SkillOrbSystem` import from `Skills.tsx` — use 2D fallback or bridge component | `src/app/sections/Skills.tsx:6` | 🔴 High |
| 1.5 | Replace `window.dispatchEvent(new CustomEvent(...))` with typed `eventBus` in `useSceneSync.ts` | `src/lib/useSceneSync.ts` | 🟡 Medium |
| 1.6 | Resolve Contact section contradiction — align `app/sections/Contact.tsx` with static letter layout spec OR update `04-COMPONENTS.md` | `src/app/sections/Contact.tsx`, `04-COMPONENTS.md` | 🔴 High |
| 1.7 | Remove direct `camera.position` mutation in `useSceneSync.ts` `useFrame` — use GSAP/CameraRig | `src/lib/useSceneSync.ts` | 🟡 Medium |
| 1.8 | Remove dead `_pageTurn` import in `Experience.tsx` | `src/app/sections/Experience.tsx:23` | 🟢 Low |
| 1.9 | Remove dead `hoveredProject` state in `Projects.tsx` | `src/app/sections/Projects.tsx` | 🟢 Low |

### Verification
- No imports from `scene/` in `src/app/` or `src/content/`
- No `useThree` imports in `src/app/sections/`
- `eventBus` is used consistently for scene↔UI communication
- `npm run build` still passes

---

## Phase 2: Color System Alignment (HIGH)

**Goal:** Replace all hex/numeric color values in the 3D scene with locked OKLCH tokens.

**Estimated Effort:** 2–3 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 2.1 | Create `src/scene/colors.ts` — OKLCH color constants derived from design tokens | New file | 🔴 Critical |
| 2.2 | Replace hex colors in `Diary.tsx` — leather `#2b1810` → `oklch(0.18 0.03 25)` | `src/scene/Diary.tsx` | 🔴 Critical |
| 2.3 | Replace hex colors in `Table.tsx` — walnut `#4a2f1c` → `oklch(0.15 0.04 35)` | `src/scene/Table.tsx` | 🔴 Critical |
| 2.4 | Replace hex colors in `LightRig.tsx` — `0xffd4aa` → derive from `--ember-400` | `src/scene/LightRig.tsx` | 🔴 Critical |
| 2.5 | Replace hex colors in `Lamp.tsx` — `#1c110a`, `#ff9d52` → OKLCH tokens | `src/scene/Props/Lamp.tsx` | 🔴 Critical |
| 2.6 | Replace hex colors in `VolumetricLight.tsx` — `0xffaa33` → OKLCH token | `src/scene/Effects/VolumetricLight.tsx` | 🔴 Critical |
| 2.7 | Replace hex colors in `DustMotes.tsx` — `0xffb366` → OKLCH token | `src/scene/Effects/DustMotes.tsx` | 🔴 Critical |
| 2.8 | Replace hex colors in `EmberFloat.tsx` — `0xff7a2a`, `0xffb060` → OKLCH tokens | `src/scene/Effects/EmberFloat.tsx` | 🔴 Critical |
| 2.9 | Replace hex colors in `DiaryHero.tsx` — `#1c110a`, `#8b2d2d` → OKLCH tokens | `src/scene/Props/DiaryHero.tsx` | 🔴 Critical |
| 2.10 | Replace hex colors in `Books.tsx` — `#2b1810`, `#3a2418`, `#1c2b2b` → OKLCH tokens | `src/scene/Props/Books.tsx` | 🔴 Critical |
| 2.11 | Replace hex colors in `Globe.tsx`, `Camera.tsx`, `Mug.tsx`, `Plant.tsx`, `Hourglass.tsx` | `src/scene/Props/*.tsx` | 🔴 Critical |
| 2.12 | Replace hex defaults in `LeatherBrassMaterials.tsx` | `src/scene/Materials/LeatherBrassMaterials.tsx` | 🔴 Critical |
| 2.13 | Replace hex defaults in `PaperMaterials.tsx` | `src/scene/Materials/PaperMaterials.tsx` | 🔴 Critical |
| 2.14 | Replace hex defaults in `WoodMaterials.tsx` | `src/scene/Materials/WoodMaterials.tsx` | 🔴 Critical |
| 2.15 | Replace hex colors in `SkillOrbSystem.tsx` — `CATEGORY_COLORS` | `src/scene/Props/SkillOrbSystem.tsx` | 🔴 Critical |

### Verification
- No raw hex colors in `src/scene/` (except in CSS string literals for canvas textures, which should use OKLCH-derived values)
- `npm run build` still passes

---

## Phase 3: Fix Duplicates & Missing Definitions (MEDIUM)

**Goal:** Remove duplicate definitions, fix missing CSS variables, resolve inconsistencies.

**Estimated Effort:** 1 day

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 3.1 | Remove duplicate `SceneFog` — keep in `LightRig.tsx`, remove from `HDRIEnvironment.tsx` | `src/scene/LightRig.tsx`, `src/scene/Environment/HDRIEnvironment.tsx` | 🟡 Medium |
| 3.2 | Remove duplicate `.color-blind-safe` class in `design-tokens.css` (line 374) | `src/styles/design-tokens.css` | 🟡 Medium |
| 3.3 | Define `--shadow-spread` CSS variable in `design-tokens.css` | `src/styles/design-tokens.css` | 🟡 Medium |
| 3.4 | Fix `package.json` version: `1.0.0` → `2.0.0` | `package.json` | 🟢 Low |
| 3.5 | Fix `README.md` title: `# RealMe` → `# The Diary of Me` | `README.md` | 🟢 Low |
| 3.6 | Consolidate duplicated simplex noise + FBM shader code into shared utility | `src/scene/shaders/noise.ts` (new) | 🟢 Low |
| 3.7 | Move inline `@keyframes` to CSS utilities | `Hero.tsx`, `Button.tsx`, `KeyboardNavigation.tsx`, `Toast.tsx` | 🟢 Low |

### Verification
- No duplicate `SceneFog` in scene
- No duplicate `.color-blind-safe` in CSS
- `--shadow-spread` is defined
- `npm run build` still passes

---

## Phase 4: Fix Camera System (MEDIUM)

**Goal:** Consolidate camera systems, fix FOV and OPEN_ANGLE mismatches, resolve conflicting values.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 4.1 | Fix CameraRoot FOV: 38° → 50° (per ARCHITECTURE-v2.md §7) OR update docs | `src/scene/CanvasRoot.tsx` | 🟡 Medium |
| 4.2 | Fix CameraRig OPEN_ANGLE: 2.7 → 2.88 (~165° per ARCHITECTURE-v2.md §4.4) OR update docs | `src/scene/CameraRig.tsx` | 🟡 Medium |
| 4.3 | Consolidate camera targets — pick one source of truth (useSceneSync.ts or ScrollCamera.ts) | `src/lib/useSceneSync.ts`, `src/scene/camera/ScrollCamera.ts` | 🟡 Medium |
| 4.4 | Fix Hero.tsx title mismatch — "The Diary of Me" vs "MY JOURNEY" (per 03-CONTENT-STORYLINE.md) | `src/app/sections/Hero.tsx` | 🟡 Medium |
| 4.5 | Connect Layout.tsx scroll progress bar to ScrollProvider | `src/app/layout.tsx` | 🟡 Medium |
| 4.6 | Fix ScrollProvider `registerSection` useCallback dependency | `src/app/providers/ScrollProvider.tsx` | 🟡 Medium |

### Verification
- Single camera system with consistent values
- Scroll progress bar reflects actual scroll position
- FOV and OPEN_ANGLE match documentation

---

## Phase 5: Fix Performance Issues (MEDIUM)

**Goal:** Optimize runtime performance, fix wasteful patterns in animation loops.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 5.1 | Pre-generate random values in DustMotes instead of calling `Math.random()` in `useFrame` | `src/scene/Effects/DustMotes.tsx:83` | 🟡 Medium |
| 5.2 | Reuse `THREE.Object3D` dummy in SkillOrbSystem instead of creating new one every frame | `src/scene/Props/SkillOrbSystem.tsx:165` | 🟡 Medium |
| 5.3 | Cache `THREE.Color` in SkillOrbSystem instead of creating new one every frame | `src/scene/Props/SkillOrbSystem.tsx:196` | 🟡 Medium |
| 5.4 | Replace `requestAnimationFrame` idle loop in `useCamera.ts` with `useFrame` + visibility check | `src/scene/hooks/useCamera.ts:114` | 🟡 Medium |
| 5.5 | Remove unnecessary `useFrame` in `KeyboardNavigation.tsx` FocusRing | `src/scene/accessibility/KeyboardNavigation.tsx:218` | 🟡 Medium |
| 5.6 | Cache `window.innerWidth/innerHeight` in HeatShimmer and InkBleed instead of updating every frame | `src/scene/Effects/HeatShimmer.tsx:153`, `src/scene/Effects/InkBleed.tsx:153` | 🟡 Medium |
| 5.7 | Implement `HeatShimmerAdvanced` (currently returns simple HeatShimmer) | `src/scene/Effects/HeatShimmer.tsx:147` | 🟢 Low |

### Verification
- No `Math.random()` calls in `useFrame`
- No `new THREE.Object3D()` or `new THREE.Color()` in `useFrame`
- Idle animations pause when tab is not visible

---

## Phase 6: Fix Provider Issues (MEDIUM)

**Goal:** Fix provider coupling, cascade bypass, and hardcoded values.

**Estimated Effort:** 1 day

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 6.1 | Decouple audio from `reducedMotion` in AudioProvider — use separate `reducedAudio` flag or respect `prefers-reduced-motion` only for animations | `src/app/providers/AudioProvider.tsx` | 🟡 Medium |
| 6.2 | Fix ThemeProvider `applyTheme` to use CSS class instead of inline `style.setProperty` | `src/app/providers/ThemeProvider.tsx` | 🟡 Medium |
| 6.3 | Fix Header.tsx `isScrolled` hardcoded to `false` — track actual scroll position | `src/ui/layout/Header.tsx:25` | 🟡 Medium |
| 6.4 | Fix KeyboardNavigationProvider double-render of children | `src/scene/accessibility/KeyboardNavigation.tsx:193,201` | 🟡 Medium |
| 6.5 | Implement empty keyboard navigation handler in SkillOrbSystem | `src/scene/Props/SkillOrbSystem.tsx:208` | 🟡 Medium |

### Verification
- Audio plays even when `prefers-reduced-motion` is set
- Theme changes use CSS classes, not inline styles
- Header background changes on scroll
- No double-render in KeyboardNavigationProvider

---

## Phase 7: Fill Placeholder Content (MEDIUM)

**Goal:** Replace all placeholder content with real values.

**Estimated Effort:** 0.5 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 7.1 | Fill `CONTACT.email` placeholder | `src/data/chapters.ts` | 🟡 Medium |
| 7.2 | Fill project links in `projects.ts` (replace `#` with real URLs) | `src/data/projects.ts` | 🟡 Medium |
| 7.3 | Fill `data/skills.ts` to match `SkillOrbSystem.tsx` (add Hardware category) | `src/data/skills.ts` | 🟡 Medium |
| 7.4 | Add `noopener,noreferrer` to `window.open` calls | `src/scene/Props/Globe.tsx`, `Nameplate.tsx`, `Mug.tsx`, `Hourglass.tsx`, `Plant.tsx` | 🟢 Low |

### Verification
- No `your.email@example.com` in source
- No `#` placeholder links in projects
- Skills data matches SkillOrbSystem data

---

## Phase 8: Complete Missing UI Components (HIGH)

**Goal:** Create the 6 missing UI component files referenced in `index.ts`.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 8.1 | Create `Divider.tsx` — styled divider component | `src/ui/components/Divider.tsx` | 🔴 High |
| 8.2 | Create `Spinner.tsx` — loading spinner component | `src/ui/components/Spinner.tsx` | 🔴 High |
| 8.3 | Create `Tabs.tsx` — tabbed interface component | `src/ui/components/Tabs.tsx` | 🔴 High |
| 8.4 | Create `Accordion.tsx` — collapsible accordion component | `src/ui/components/Accordion.tsx` | 🔴 High |
| 8.5 | Create `Dropdown.tsx` — dropdown menu component | `src/ui/components/Dropdown.tsx` | 🔴 High |
| 8.6 | Create `Progress.tsx` — progress bar component | `src/ui/components/Progress.tsx` | 🔴 High |
| 8.7 | Create missing hooks: `useLazySection.ts`, `useEasterEggs.ts` | `src/ui/hooks/` | 🟡 Medium |

### Verification
- All 6 component files exist and export correctly
- `index.ts` imports resolve without errors
- `npm run build` still passes

---

## Phase 9: Complete Phase 4 Blocked Tasks (BLOCKED)

**Goal:** Unblock T4.3.1 (profiling) and T4.3.2 (shader optimization).

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 9.1 | T4.3.1: Run profiling on scene performance — identify bottlenecks | Browser dev tools | 🟡 Medium |
| 9.2 | T4.3.2: Optimize shaders — consolidate noise functions, reduce uniform updates | `src/scene/Effects/*.tsx` | 🟡 Medium |
| 9.3 | Unblock Verlet page physics (B1.2) — integrate `PagePhysics` into `DiaryHero` or remove | `src/scene/Props/DiaryHero.tsx` | 🟡 Medium |
| 9.4 | Unblock HDRI source (B1.1) — add local fallback or error boundary | `src/scene/Environment/HDRIEnvironment.tsx` | 🟡 Medium |

### Verification
- T4.3.1 and T4.3.2 marked as done in TASKS-v2.md
- PagePhysics is either integrated or removed
- HDRI has error handling

---

## Phase 10: Deployment Readiness (Phase 5 — NOT STARTED)

**Goal:** Complete all Phase 5 tasks from TASKS-v2.md.

**Estimated Effort:** 2–3 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 10.1 | T5.1.1: Production build optimization — verify bundle sizes, tree-shaking | `vite.config.ts`, `dist/` | 🟡 Medium |
| 10.2 | T5.1.2: Asset optimization — font preloading, image optimization | `index.html`, `src/main.tsx` | 🟡 Medium |
| 10.3 | T5.2.1: SEO metadata — meta tags, Open Graph, Twitter Cards | `index.html` | 🟡 Medium |
| 10.4 | T5.2.2: CONTRIBUTING.md | New file | 🟢 Low |
| 10.5 | T5.3.1: Deployment pipeline — Vercel/Netlify config | `vercel.json` or `netlify.toml` | 🟡 Medium |
| 10.6 | T5.3.2: Performance monitoring — Lighthouse CI or similar | `.github/workflows/` | 🟡 Medium |
| 10.7 | Add `robots.txt` | `public/robots.txt` | 🟢 Low |
| 10.8 | Add `sitemap.xml` | `public/sitemap.xml` or generate | 🟢 Low |
| 10.9 | Add ESLint and Prettier config | `.eslintrc.*`, `.prettierrc.*` | 🟢 Low |
| 10.10 | Add test infrastructure — Vitest config | `vitest.config.ts` | 🟢 Low |

### Verification
- All Phase 5 tasks marked as done in TASKS-v2.md
- `robots.txt` and `sitemap.xml` exist
- ESLint/Prettier configured
- Test infrastructure in place

---

## Phase 11: Final Polish & Verification (FINAL)

**Goal:** Final quality pass, verify everything works end-to-end.

**Estimated Effort:** 1 day

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 11.1 | Run full audit again — verify all issues resolved | — | 🔴 Critical |
| 11.2 | Run `npm run build` — verify clean build | — | 🔴 Critical |
| 11.3 | Run `npm run typecheck` — verify clean typecheck | — | 🔴 Critical |
| 11.4 | Update TASKS-v2.md — mark all completed tasks | `TASKS-v2.md` | 🟡 Medium |
| 11.5 | Update PROGRESS-v2.md — update status | `PROGRESS-v2.md` | 🟡 Medium |
| 11.6 | Update CHANGELOG-v2.md — document fixes | `CHANGELOG-v2.md` | 🟡 Medium |
| 11.7 | Update AUDIT-REPORT.md — mark resolved issues | `AUDIT-REPORT.md` | 🟡 Medium |

### Verification
- `npm run build` exits with code 0
- `npm run typecheck` exits with code 0
- All TASKS-v2.md tasks marked as done
- All blockers resolved

---

## Phase 12: Design System Hardening (from design-system + impeccable skills)

**Goal:** Enforce three-layer token architecture, remove AI slop patterns, ensure design quality.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 12.1 | Create `src/scene/colors.ts` — OKLCH constants from design tokens (three-layer: primitive → semantic → component) | New file | 🔴 Critical |
| 12.2 | Replace all hex colors in Materials with OKLCH tokens from `colors.ts` | `src/scene/Materials/*.tsx` | 🔴 Critical |
| 12.3 | Replace all hex colors in Props with OKLCH tokens | `src/scene/Props/*.tsx` | 🔴 Critical |
| 12.4 | Replace all hex colors in Effects with OKLCH tokens | `src/scene/Effects/*.tsx` | 🔴 Critical |
| 12.5 | Replace all hex colors in LightRig/Diary/Table with OKLCH tokens | `src/scene/LightRig.tsx`, `Diary.tsx`, `Table.tsx` | 🔴 Critical |
| 12.6 | Remove AI slop patterns: tiny uppercase eyebrows on every section | `src/app/sections/*.tsx`, `src/content/*.tsx` | 🟡 Medium |
| 12.7 | Remove AI slop patterns: numbered section markers (01/02/03) as default scaffolding | `src/app/sections/*.tsx` | 🟡 Medium |
| 12.8 | Remove AI slop patterns: identical card grids | `src/app/sections/Projects.tsx` | 🟡 Medium |
| 12.9 | Remove AI slop patterns: side-stripe borders on cards/list items | `src/ui/components/*.tsx` | 🟡 Medium |
| 12.10 | Remove AI slop patterns: gradient text | All components | 🟡 Medium |
| 12.11 | Add `text-wrap: balance` to h1-h3, `text-wrap: pretty` to long prose | All section components | 🟡 Medium |
| 12.12 | Cap hero heading clamp() max at 6rem | `src/app/sections/Hero.tsx` | 🟡 Medium |
| 12.13 | Verify no text overflow at any breakpoint — test heading copy at mobile/tablet/desktop | All components | 🟡 Medium |
| 12.14 | Add semantic z-index scale (dropdown → sticky → modal-backdrop → modal → toast → tooltip) | `src/styles/design-tokens.css` | 🟡 Medium |

### Verification
- No raw hex colors in `src/scene/` (all use `colors.ts` OKLCH constants)
- No AI slop patterns (eyebrows, numbered markers, identical card grids, side-stripe borders, gradient text)
- All headings use `text-wrap: balance`
- Hero heading max ≤ 6rem
- Semantic z-index scale defined

---

## Phase 13: Accessibility Hardening (from ui-ux-pro-max + harden skills)

**Goal:** Achieve WCAG 2.1 AA compliance, handle edge cases, ensure robustness.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 13.1 | Verify all body text ≥4.5:1 contrast, large text ≥3:1 | All components | 🔴 Critical |
| 13.2 | Add visible focus rings (2-4px) on all interactive elements | `src/ui/components/*.tsx` | 🔴 Critical |
| 13.3 | Add `aria-label` to all icon-only buttons | `src/ui/components/IconButton.tsx`, `src/content/*.tsx` | 🔴 Critical |
| 13.4 | Ensure Tab order matches visual order | All interactive components | 🔴 Critical |
| 13.5 | Add `for` attribute to all form labels | `src/ui/components/Input.tsx`, `src/app/sections/Contact.tsx` | 🔴 Critical |
| 13.6 | Add skip links for keyboard users | `src/app/layout.tsx` | 🔴 Critical |
| 13.7 | Verify sequential heading hierarchy (h1→h6, no skips) | All sections | 🔴 Critical |
| 13.8 | Don't convey info by color alone — add icons/text | `src/content/ChapterDots.tsx`, `src/ui/components/Badge.tsx` | 🟡 Medium |
| 13.9 | Ensure min touch size 44×44px for all interactive elements | `src/content/ChapterDots.tsx`, `src/content/CloseButton.tsx` | 🟡 Medium |
| 13.10 | Add 8px+ spacing between interactive elements | All components | 🟡 Medium |
| 13.11 | Add loading feedback for all actions | `src/app/sections/Contact.tsx`, `src/ui/components/Button.tsx` | 🟡 Medium |
| 13.12 | Handle long text — `min-width: 0` on flex/grid items, `word-wrap: break-word` | All components | 🟡 Medium |
| 13.13 | Handle empty states — provide clear next action | `src/content/chapters/Projects.tsx` (empty projects) | 🟡 Medium |
| 13.14 | Handle network failures — clear error messages with retry | `src/scene/Environment/HDRIEnvironment.tsx` | 🟡 Medium |
| 13.15 | Prevent double-submission — disable buttons while loading | `src/app/sections/Contact.tsx` | 🟡 Medium |
| 13.16 | Add `prefers-reduced-motion` to all animations | All animated components | 🟡 Medium |
| 13.17 | Add `prefers-contrast` media query support | `src/styles/design-tokens.css` | 🟡 Medium |
| 13.18 | Add `dir="auto"` for RTL support on dynamic text | All components with user text | 🟢 Low |
| 13.19 | Test with emoji, CJK characters, RTL text | All text inputs | 🟢 Low |

### Verification
- All body text ≥4.5:1 contrast (use axe or Lighthouse)
- All interactive elements have visible focus rings
- All icon-only buttons have `aria-label`
- Tab order matches visual order
- All form labels have `for` attribute
- Skip links present
- Sequential heading hierarchy
- Min touch size 44×44px
- `prefers-reduced-motion` respected on all animations

---

## Phase 14: Performance Optimization (from optimize skill)

**Goal:** Achieve Core Web Vitals targets (LCP < 2.5s, INP < 200ms, CLS < 0.1).

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 14.1 | Use `transform` and `opacity` for all animations (GPU-accelerated) | All animated components | 🔴 Critical |
| 14.2 | Avoid layout thrashing — batch reads then writes | `src/scene/Effects/DustMotes.tsx`, `EmberFloat.tsx` | 🔴 Critical |
| 14.3 | Use CSS `contain` for independent regions | `src/app/layout.tsx`, `src/app/sections/*.tsx` | 🟡 Medium |
| 14.4 | Use `content-visibility: auto` for long lists | `src/content/chapters/Projects.tsx` | 🟡 Medium |
| 14.5 | Set dimensions on all images/media (prevent CLS) | All `<img>` tags | 🟡 Medium |
| 14.6 | Use `aspect-ratio` CSS property for media containers | All media containers | 🟡 Medium |
| 14.7 | Add `font-display: swap` to all `@fontsource` imports | `src/main.tsx` | 🟡 Medium |
| 14.8 | Preload critical fonts | `index.html` | 🟡 Medium |
| 14.9 | Lazy load below-fold content | `src/app/sections/*.tsx` | 🟡 Medium |
| 14.10 | Use `IntersectionObserver` for scroll-triggered animations | `src/app/sections/*.tsx` | 🟡 Medium |
| 14.11 | Debounce/throttle scroll handlers | `src/app/providers/ScrollProvider.tsx` | 🟡 Medium |
| 14.12 | Use `will-change` sparingly (only for known expensive operations) | All animated components | 🟡 Medium |
| 14.13 | Optimize DustMotes — pre-generate random values, reduce particle count on mobile | `src/scene/Effects/DustMotes.tsx` | 🟡 Medium |
| 14.14 | Optimize SkillOrbSystem — reuse Object3D, cache Color | `src/scene/Props/SkillOrbSystem.tsx` | 🟡 Medium |
| 14.15 | Cache window dimensions in shader effects | `src/scene/Effects/HeatShimmer.tsx`, `InkBleed.tsx` | 🟡 Medium |

### Verification
- Lighthouse LCP < 2.5s
- Lighthouse INP < 200ms
- Lighthouse CLS < 0.1
- No layout thrashing in animation loops
- All animations use `transform`/`opacity` only

---

## Phase 15: E2E Testing with Playwright (from MCP `playwright` server)

**Goal:** Add comprehensive E2E tests for critical user flows.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 15.1 | Install Playwright and configure | `package.json`, `playwright.config.ts` | 🔴 Critical |
| 15.2 | Test build passes and dev server starts | — | 🔴 Critical |
| 15.3 | Test loading screen appears and disappears | `src/content/LoadingScreen.tsx` | 🔴 Critical |
| 15.4 | Test diary open/close animation | `src/scene/CameraRig.tsx` | 🔴 Critical |
| 15.5 | Test chapter navigation (About, Skills, Projects, Experience, Contact) | `src/app/sections/*.tsx` | 🔴 Critical |
| 15.6 | Test 3D/2D toggle | `src/app/layout.tsx` | 🔴 Critical |
| 15.7 | Test contact form submission (mailto) | `src/app/sections/Contact.tsx` | 🔴 Critical |
| 15.8 | Test keyboard navigation (Tab, Arrow keys, Enter) | `src/scene/accessibility/KeyboardNavigation.tsx` | 🔴 Critical |
| 15.9 | Test reduced motion preference | All animated components | 🟡 Medium |
| 15.10 | Test mobile viewport | All sections | 🟡 Medium |
| 15.11 | Test error boundary (3D disabled) | `src/scene/CanvasErrorBoundary.tsx` | 🟡 Medium |
| 15.12 | Test accessibility (axe-core) | All pages | 🟡 Medium |

### Verification
- All E2E tests pass
- No critical accessibility violations (axe-core)
- Mobile viewport works correctly
- Keyboard navigation works end-to-end

---

## Phase 16: Deployment & Monitoring (from optimize skill)

**Goal:** Production-ready deployment with monitoring.

**Estimated Effort:** 1–2 days

### Tasks

| Task | Description | Files | Priority |
|------|-------------|-------|----------|
| 16.1 | T5.1.1: Verify bundle sizes — `npx vite build --mode production` | `vite.config.ts` | 🟡 Medium |
| 16.2 | T5.1.2: Font preloading — add `<link rel="preload">` for critical fonts | `index.html` | 🟡 Medium |
| 16.3 | T5.2.1: SEO metadata — meta tags, Open Graph, Twitter Cards, favicons | `index.html` | 🟡 Medium |
| 16.4 | T5.2.2: CONTRIBUTING.md | New file | 🟢 Low |
| 16.5 | T5.3.1: Vercel deployment config | `vercel.json` | 🟡 Medium |
| 16.6 | T5.3.2: Lighthouse CI configuration | `.github/workflows/lighthouse.yml` | 🟡 Medium |
| 16.7 | Add `robots.txt` | `public/robots.txt` | 🟢 Low |
| 16.8 | Add `sitemap.xml` | `public/sitemap.xml` | 🟢 Low |
| 16.9 | Add ESLint and Prettier config | `.eslintrc.*`, `.prettierrc.*` | 🟢 Low |
| 16.10 | Add Vitest test infrastructure | `vitest.config.ts` | 🟢 Low |
| 16.11 | Add `manifest.json` for PWA support | `public/manifest.json` | 🟢 Low |
| 16.12 | Add favicons in all sizes | `public/favicon.*` | 🟢 Low |

### Verification
- Bundle size < 500KB compressed (target)
- Lighthouse score ≥ 90 (performance, accessibility, best practices, SEO)
- `robots.txt` and `sitemap.xml` exist
- ESLint/Prettier configured and passing
- Test infrastructure in place
- Deployment pipeline configured

---

## Updated Execution Order Summary

```
Phase 0: Fix the Build (CRITICAL)              → 2-3 days
Phase 1: Fix Architectural Violations          → 1-2 days
Phase 2: Color System Alignment                → 2-3 days
Phase 3: Fix Duplicates & Missing Defs         → 1 day
Phase 4: Fix Camera System                   → 1-2 days
Phase 5: Fix Performance Issues               → 1-2 days
Phase 6: Fix Provider Issues                  → 1 day
Phase 7: Fill Placeholder Content             → 0.5 days
Phase 8: Complete Missing UI Components       → 1-2 days
Phase 9: Complete Phase 4 Blocked Tasks       → 1-2 days
Phase 10: Deployment Readiness (Phase 5)      → 2-3 days
Phase 11: Final Polish & Verification         → 1 day
Phase 12: Design System Hardening             → 1-2 days
Phase 13: Accessibility Hardening             → 1-2 days
Phase 14: Performance Optimization            → 1-2 days
Phase 15: E2E Testing with Playwright         → 1-2 days
Phase 16: Deployment & Monitoring             → 1-2 days

Total Estimated Effort: 20-30 days
```

### Recommended Parallel Execution

- **Phase 0** must be completed first (blocks everything)
- **Phase 2** and **Phase 8** can run in parallel (both are component/file creation)
- **Phase 3** and **Phase 7** can run in parallel (small fixes)
- **Phase 9** and **Phase 10** can partially overlap (both are "completion" phases)
- **Phase 12** can run in parallel with **Phase 2** (both are color/token work)
- **Phase 13** can run in parallel with **Phase 12** (both are design system work)
- **Phase 14** can run in parallel with **Phase 5** (both are performance work)
- **Phase 15** can start after **Phase 0** (needs working build)
- **Phase 16** can start after **Phase 11** (final verification)
- **Phase 11** must be last (final verification)

### Updated Success Criteria

1. `npm run build` exits with code 0
2. `npm run typecheck` exits with code 0
3. No hex colors in `src/scene/` (all use OKLCH tokens from `colors.ts`)
4. No imports from `scene/` in `src/app/` or `src/content/`
5. No `useThree` in `src/app/sections/`
6. Single camera system with consistent values
7. No duplicate definitions (SceneFog, `.color-blind-safe`)
8. All placeholder content filled
9. All Phase 5 tasks complete
10. All blockers resolved
11. Lighthouse score ≥ 90 (performance, accessibility, best practices, SEO)
12. No AI slop patterns (eyebrows, numbered markers, identical card grids, etc.)
13. WCAG 2.1 AA compliance (contrast, focus, keyboard nav, ARIA)
14. All E2E tests pass
15. Deployment pipeline configured and tested

---

*End of Implementation Plan*
