# ARCHITECTURE-v2.md — "The Diary of Me" Premium 3D Portfolio

**Status**: LOCKED — v2 Art Direction (do not deviate without explicit approval)
**Created**: 2026-07-22
**Last Updated**: 2026-07-22

---

## 1. VISION STATEMENT

> A premium, immersive 3D portfolio that feels like stepping into a **mysterious artisan's workshop** — warm, tactile, and alive with subtle magic. Not a "dark mode" site; a **lit environment** where every surface catches light, every particle has weight, and the user discovers layers of craftsmanship through exploration.

**Core Pillars**:
- **Atmosphere over darkness** — Warm candlelight/ember glow, not void black
- **Tactile materiality** — Leather, brass, aged paper, worn wood, oxidized metal
- **Living detail** — Dust motes, heat shimmer, page flutter, ink bleed, subtle physics
- **Gaming mystery** — Progressive disclosure, environmental storytelling, reward curiosity
- **Premium motion** — 60fps buttery, spring-physics, staggered reveals, micro-interactions

---

## 2. COLOR PALETTE (LOCKED)

### Primitive Tokens (OKLCH)

| Token | Value | Role |
|-------|-------|------|
| `--void-950` | `oklch(0.08 0.005 240)` | Deepest shadow (scene bg base) |
| `--void-900` | `oklch(0.12 0.008 240)` | Card elevations |
| `--void-800` | `oklch(0.18 0.01 240)` | Input/border backgrounds |
| `--walnut-900` | `oklch(0.15 0.04 35)` | Wood grain dark |
| `--walnut-700` | `oklch(0.28 0.06 35)` | Wood mid |
| `--walnut-500` | `oklch(0.45 0.08 35)` | Wood highlight |
| `--leather-900` | `oklch(0.18 0.03 25)` | Leather dark |
| `--leather-700` | `oklch(0.32 0.05 25)` | Leather mid |
| `--leather-500` | `oklch(0.52 0.07 25)` | Leather worn highlight |
| `--brass-900` | `oklch(0.35 0.08 75)` | Brass dark (oxidized) |
| `--brass-700` | `oklch(0.52 0.12 75)` | Brass primary |
| `--brass-500` | `oklch(0.72 0.14 85)` | Brass highlight (catch light) |
| `--brass-300` | `oklch(0.88 0.1 90)` | Brass gleam |
| `--parchment-900` | `oklch(0.35 0.02 45)` | Ink on aged paper |
| `--parchment-700` | `oklch(0.55 0.03 45)` | Body text |
| `--parchment-500` | `oklch(0.75 0.04 50)` | Muted text |
| `--parchment-300` | `oklch(0.92 0.03 55)` | Paper bg |
| `--ember-500` | `oklch(0.62 0.18 40)` | Ember glow primary |
| `--ember-400` | `oklch(0.75 0.16 45)` | Ember bright |
| `--ember-300` | `oklch(0.88 0.12 50)` | Ember haze |
| `--mystery-500` | `oklch(0.48 0.15 285)` | Amethyst mystery accent |
| `--mystery-400` | `oklch(0.62 0.18 285)` | Mystery bright |
| `--teal-500` | `oklch(0.52 0.12 185)` | Teal verdigris (oxidized copper) |
| `--teal-400` | `oklch(0.68 0.14 185)` | Teal bright |

### Semantic Mappings (Layer B → Layer A)

```css
:root {
  /* Backgrounds */
  --bg-scene: var(--void-950);
  --bg-canvas: var(--void-900);
  --bg-card: var(--void-800);
  --bg-input: var(--void-800);
  --bg-paper: var(--parchment-300);

  /* Text */
  --text-primary: var(--parchment-700);
  --text-secondary: var(--parchment-500);
  --text-muted: var(--parchment-500 / 0.7);
  --text-inverse: var(--void-950);
  --text-accent: var(--brass-500);
  --text-mystery: var(--mystery-400);
  --text-teal: var(--teal-400);

  /* Borders */
  --border-subtle: var(--brass-900 / 0.3);
  --border-default: var(--brass-700 / 0.4);
  --border-strong: var(--brass-500);
  --border-glow: var(--ember-400);

  /* Interactive */
  --interactive-default: var(--brass-700);
  --interactive-hover: var(--brass-500);
  --interactive-active: var(--brass-300);
  --interactive-glow: var(--ember-400);
  --interactive-mystery: var(--mystery-400);

  /* Glows */
  --glow-ember: var(--ember-400);
  --glow-mystery: var(--mystery-400);
  --glow-teal: var(--teal-400);
  --glow-brass: var(--brass-300);
}
```

---

## 3. TYPOGRAPHY SYSTEM (LOCKED)

| Role | Font | Weights | Scale (clamp) | Letter-spacing |
|------|------|---------|---------------|----------------|
| **Display/Title** | `Cinzel Decorative` | 400, 700, 900 | `clamp(2.5rem, 5vw + 1rem, 5rem)` | `0.04em` |
| **Heading** | `Cinzel` | 400, 600, 700 | `clamp(1.75rem, 3vw + 0.5rem, 3rem)` | `0.02em` |
| **Subheading/Eyebrow** | `IM Fell English SC` | 400 | `clamp(0.75rem, 1vw + 0.5rem, 1rem)` | `0.12em` (tracking-wide) |
| **Body** | `Crimson Pro` | 400, 500, 600, 700 | `clamp(1rem, 0.5vw + 0.875rem, 1.125rem)` | `0` |
| **Caption/Label** | `IBM Plex Sans` | 400, 500, 600 | `0.75rem` | `0.05em` |
| **Code/Monospace** | `JetBrains Mono` | 400, 500 | `0.875rem` | `0` |

**Line Heights**: Display 1.1, Heading 1.2, Body 1.7, Caption 1.5

**Font Loading**: Preload `Cinzel Decorative` + `Crimson Pro` via `<link rel="preload">` + `font-display: swap`

---

## 4. SPACING & LAYOUT (LOCKED)

### Base Unit: `4px` (0.25rem)

### Scale (Tailwind-compatible)

| Step | Value | Rem | Use Case |
|------|-------|-----|----------|
| 0 | 0 | 0 | Reset |
| 1 | 4px | 0.25 | Micro gaps |
| 2 | 8px | 0.5 | Tight component padding |
| 3 | 12px | 0.75 | Default component gap |
| 4 | 16px | 1 | Standard padding |
| 5 | 20px | 1.25 | Card padding |
| 6 | 24px | 1.5 | Section gap |
| 7 | 32px | 2 | Large section gap |
| 8 | 48px | 3 | Page section gap |
| 9 | 64px | 4 | Hero gaps |
| 10 | 96px | 6 | Major layout divisions |

### Container Widths
- `prose`: `65ch` (reading width)
- `content`: `72rem` (1152px) — main content max
- `wide`: `90rem` (1440px) — canvas/3D max
- `full`: `100vw` — full bleed

---

## 5. ELEVATION / SHADOW SYSTEM (LOCKED)

| Level | Box Shadow | Use Case |
|-------|------------|----------|
| 0 | `none` | Flat |
| 1 | `0 1px 2px -1px rgb(0 0 0 / 0.4), 0 1px 3px -1px rgb(0 0 0 / 0.3)` | Cards resting on surface |
| 2 | `0 4px 8px -2px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.4)` | Elevated cards, dropdowns |
| 3 | `0 12px 24px -4px rgb(0 0 0 / 0.6), 0 4px 8px -4px rgb(0 0 0 / 0.5)` | Modals, floating panels |
| 4 | `0 24px 48px -8px rgb(0 0 0 / 0.7), 0 8px 16px -8px rgb(0 0 0 / 0.6)` | Toasts, max elevation |
| **Glow-Ember** | `0 0 20px -4px var(--glow-ember), 0 0 40px -8px var(--glow-ember / 0.5)` | CTA hover, active magic |
| **Glow-Mystery** | `0 0 20px -4px var(--glow-mystery), 0 0 40px -8px var(--glow-mystery / 0.5)` | Mystery reveals |
| **Glow-Teal** | `0 0 20px -4px var(--glow-teal), 0 0 40px -8px var(--glow-teal / 0.5)` | Verdigris accents |

---

## 6. MOTION SYSTEM (LOCKED)

### Easing Curves (Cubic-Bezier)

| Name | Curve | Use Case |
|------|-------|----------|
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Entrance, reveals, bouncy UI |
| `ease-smooth` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Standard transitions |
| `ease-expo-out` | `cubic-bezier(0.19, 1, 0.22, 1)` | Page transitions, large moves |
| `ease-sharp` | `cubic-bezier(0.4, 0, 0.2, 1)` | Quick feedback, button press |
| `ease-elastic` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful micro-interactions |

### Duration Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `--duration-instant` | `50ms` | Ripple, press feedback |
| `--duration-fast` | `150ms` | Hover, small transitions |
| `--duration-base` | `300ms` | Standard component transitions |
| `--duration-slow` | `500ms` | Panel open/close, section reveals |
| `--duration-major` | `800ms` | Page transitions, hero animations |
| `--duration-cinematic` | `1200ms` | Intro sequence, major reveals |

### Stagger Delays
- **Micro-stagger**: `30ms` per item (lists, grids)
- **Section-stagger**: `100ms` per section
- **Hero-stagger**: `150ms` per hero element

---

## 7. 3D SCENE ARCHITECTURE (LOCKED)

### Render Pipeline
```
Canvas (R3F)
├── Scene
│   ├── Environment (HDRI + procedural)
│   ├── Camera (Perspective, FOV 50, near 0.1, far 100)
│   ├── PostProcessing (EffectComposer)
│   │   ├── RenderPass
│   │   ├── BloomPass (selective, threshold 0.85)
│   │   ├── VignettePass (subtle, 0.3)
│   │   ├── FilmPass (grain 0.15, scanlines 0.02)
│   │   └── ColorCorrection (warm LUT)
│   ├── Main Objects (Diary, Desk, Artifacts)
│   ├── Particle Systems
│   │   ├── DustMotes (GPU instanced, 2000 particles)
│   │   ├── EmberFloat (shader-driven, 500 particles)
│   │   └── InkBleed (shader, page-turn moments)
│   ├── Lighting
│   │   ├── Key Light (warm spot, 3500K, casts shadow)
│   │   ├── Fill Light (cool ambient, 6500K, no shadow)
│   │   ├── Rim Light (brass catch, 3000K)
│   │   └── Volumetric Light Shafts (god rays)
│   └── Interactive Probes
│       ├── Mouse-parallax (subtle, 0.5° max)
│       ├── Scroll-linked camera dolly
│       └── Focus/hover highlights (outline pass)
```

### Camera Behavior
- **Idle**: Slow orbital drift (0.02 rad/s), breathing FOV (50→52)
- **Scroll**: Dolly forward/back on Z, slight pitch
- **Hover Object**: Dolly to focus distance, lock orbit
- **Mobile**: Gyro parallax (reduced), touch dolly

### Performance Budgets
| Metric | Target |
|--------|--------|
| FPS | 60 (desktop), 30+ (mobile) |
| Frame Time | < 16.67ms (desktop), < 33ms (mobile) |
| Draw Calls | < 100 |
| Triangles | < 150k |
| Textures | < 20 (compressed, ASTC/KTX2) |
| Shader Complexity | < 80 ALU per fragment |

---

## 8. COMPONENT ARCHITECTURE (LOCKED)

### Layer A: Design Tokens (`src/styles/design-tokens.css`)
- CSS Custom Properties only — **source of truth**
- No Tailwind `@theme` — tokens consumed via `var(--token)`

### Layer B: UI Components (`src/ui/`)
- Pure React + Framer Motion
- Consume tokens via `style={{ color: 'var(--text-primary)' }}` or CSS Modules
- **No direct Three.js imports**

### Layer C: 3D Scene (`src/scene/`)
- React Three Fiber + Drei
- Own token namespace: `--scene-*` (mapped from Layer A at build)
- Communicates with Layer B via **Context + Events** (no prop drilling)

### Layer D: Integration (`src/app/`, `CanvasRoot.tsx`)
- Orchestrates Layer B ↔ Layer C sync
- ScrollProvider, ThemeProvider, AudioProvider

---

## 9. INTERACTION PATTERNS (LOCKED)

| Pattern | Trigger | 3D Response | UI Response |
|---------|---------|-------------|-------------|
| **Scroll Reveal** | IntersectionObserver | Camera dolly, object fade-in | Framer stagger, text reveal |
| **Hover Artifact** | PointerEnter | Outline glow, slight scale, particle burst | Tooltip, detail panel slide |
| **Click Artifact** | Click | Camera focus, orbit lock | Modal/panel open, page turn |
| **Page Turn** | Click/Touch | Diary page flip physics (VERLET) | Content swap, ink bleed FX |
| **Gyro Parallax** | DeviceOrientation | Camera micro-rotation | Subtle layer depth shift |
| **Audio Cue** | Interaction | N/A | Subtle UI SFX (paper, brass, ember) |

---

## 10. ACCESSIBILITY (LOCKED)

- **Reduced Motion**: `prefers-reduced-motion` → disable all non-essential animation, keep instant transitions
- **High Contrast**: `prefers-contrast: more` → swap to high-contrast token set (brass→white, void→black)
- **Color Blind**: Deuteranopia-safe palette (teal/mystery distinguishable)
- **Screen Reader**: All 3D objects have `aria-label`, interactive elements keyboard-navigable
- **Focus Visible**: `focus-visible` rings use `--border-glow` at 3px offset

---

## 11. TECH STACK (LOCKED)

| Category | Library | Version Constraint |
|----------|---------|-------------------|
| **3D Core** | `@react-three/fiber` | `^8.15` |
| **3D Helpers** | `@react-three/drei` | `^9.100` |
| **Post-Processing** | `@react-three/postprocessing` | `^2.16` |
| **Animation** | `gsap` + `@gsap/react` | `^3.12` |
| **UI Animation** | `framer-motion` | `^11.0` |
| **Styling** | `tailwindcss` | `^3.4` (no @theme — token-only) |
| **Fonts** | `next/font` or `@fontsource` | Latest |
| **Build** | `vite` | `^5.4` |
| **TypeScript** | `typescript` | `^5.5` |

---

## 12. FILE STRUCTURE (TARGET)

```
src/
├── styles/
│   ├── design-tokens.css      # Layer A — ONLY source of truth
│   ├── globals.css            # Reset, base, font-face
│   └── utilities.css          # Helper classes (sr-only, focus-ring, etc.)
├── ui/
│   ├── components/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Panel/
│   │   ├── Tooltip/
│   │   ├── DiaryPage/
│   │   └── SkillOrb/
│   ├── layout/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Section/
│   └── hooks/
│       ├── useScrollReveal.ts
│       ├── useReducedMotion.ts
│       └── useTheme.ts
├── scene/
│   ├── objects/
│   │   ├── Diary/
│   │   ├── Desk/
│   │   ├── Artifacts/
│   │   └── Particles/
│   ├── lighting/
│   │   ├── LightRig.tsx
│   │   ├── VolumetricLight.tsx
│   │   └── HDRIEnvironment.tsx
│   ├── postprocessing/
│   │   ├── EffectComposer.tsx
│   │   ├── BloomPass.tsx
│   │   ├── VignettePass.tsx
│   │   ├── FilmPass.tsx
│   │   └── ColorGrading.tsx
│   ├── camera/
│   │   ├── CameraRig.tsx
│   │   ├── ScrollCamera.ts
│   │   └── GyroCamera.ts
│   ├── effects/
│   │   ├── DustMotes.tsx
│   │   ├── EmberFloat.tsx
│   │   ├── InkBleed.tsx
│   │   └── HeatShimmer.tsx
│   ├── hooks/
│   │   ├── useSceneSync.ts
│   │   ├── useCamera.ts
│   │   └── useParticles.ts
│   └── CanvasRoot.tsx         # Main entry, orchestrates all
├── app/
│   ├── providers/
│   │   ├── ScrollProvider.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── AudioProvider.tsx
│   ├── sections/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Skills/
│   │   ├── Projects/
│   │   └── Contact/
│   └── layout.tsx
├── lib/
│   ├── tokens.ts              # Type-safe token access
│   ├── motion.ts              # GSAP/FM presets
│   └── utils.ts
└── main.tsx
```

---

## 13. MIGRATION CHECKLIST (FROM v1)

- [x] Fix broken imports (VolumetricLight, PostProcessing)
- [x] Install missing deps (`@react-three/postprocessing`, `gsap`, `@gsap/react`)
- [x] Create `design-tokens.css` with locked palette
- [x] Remove Tailwind `@theme` usage, migrate to CSS vars
- [x] Define missing utility classes (`.cta`, `.eyebrow-mini`, etc.)
- [x] Rebuild `CanvasRoot.tsx` with complete scene graph
- [x] Implement all particle systems (DustMotes, EmberFloat, InkBleed, HeatShimmer)
- [x] Build LightRig with volumetric shafts
- [x] Implement PostProcessing pipeline
- [x] Create CameraRig with scroll/gyro behaviors
- [x] Build UI component library (Button, Card, Panel, DiaryPage, SkillOrb, Input, Badge, Avatar, IconButton, Toast, Modal, Tooltip, Typography)
- [x] Wire ScrollProvider → CameraRig → Section reveals
- [x] Implement Diary page-turn physics (Vertelet simulation)
- [x] Add AudioProvider with subtle SFX (procedural Web Audio)
- [x] Implement Event Bus for scene↔UI communication
- [ ] Polish: reduced motion, high contrast, a11y audit
- [ ] Performance audit & optimization

---

## 14. APPROVAL GATE

**This architecture is LOCKED.** Any deviation requires:
1. Explicit user approval via `/ask` or direct confirmation
2. Update to this document with rationale
3. Update to `TASKS-v2.md` with new tasks

**Do not begin implementation until this document is acknowledged.**