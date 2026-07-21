# Architecture

## The core decision: two rendering layers, one store

Everything else in this doc set follows from this. Read the diagram (`architecture-diagram.mermaid`) alongside this section.

**Layer A — The World.** `<Canvas>` (React Three Fiber), mounted once, `position: fixed`, always behind everything. Contains the table, diary, lamp, and props. Never renders real paragraph text as 3D geometry — that's a performance and accessibility dead end. The only DOM-in-3D is `<Html>` from drei, used sparingly, for in-scene hints like "click to open."

**Layer B — The Content.** Plain React + Tailwind, `position: absolute`, sits on top of the canvas. Chapter text, project cards, skill tags, the contact page. Ordinary DOM: accessible, responsive, indexable, easy to iterate on independent of 3D work.

**The bridge.** They talk only through one Zustand store. Nothing else — no prop drilling from `<Canvas>` into overlay components, no imperative DOM queries from inside `useFrame`. If a 3D object needs to react to app state, it subscribes to the store. If overlay content needs to react to the diary's physical state, same.

Why this is the decision that matters most: Layer B can be built, content-complete, before Layer A exists at all. That's Phase 2 in 05-BUILD-WORKFLOW.md — a real, deployable, content-complete site with zero 3D, built in days because it's a stack already known cold. It isn't thrown away when Layer A comes online. It's the same components, and it becomes the low-GPU-tier and no-WebGL fallback for free (see the tiering block below).

## State shape

```ts
type DiaryState = 'closed' | 'opening' | 'open' | 'closing'
type ChapterId = 'about' | 'skills' | 'projects' | 'experience' | 'contact'

interface PortfolioStore {
  diaryState: DiaryState
  activeChapter: ChapterId | null
  activeProject: string | null      // 'ai-invoice-studio' | 'whatsapp-bot' | 'echo'
  deviceTier: 1 | 2 | 3
  reducedMotion: boolean

  openDiary: () => void
  closeDiary: () => void
  goToChapter: (c: ChapterId) => void
  openProject: (id: string) => void
  closeProject: () => void
  setDeviceTier: (t: 1 | 2 | 3) => void
}
```

`deviceTier` and `reducedMotion` are set once at boot (see the tiering block) and read by both layers — Layer A decides whether to mount the Canvas at all; Layer B decides whether to render its own idle-state visual in Canvas's place.

## URL sync

`activeChapter` and `activeProject` mirror to query params (`?chapter=projects&project=ai-invoice-studio`) via a thin `useEffect` that watches the store and calls `history.replaceState`, plus a boot-time read that seeds the store from `location.search`. This is a small addition with real payoff: a direct link to a specific project case study for a recruiter, instead of "click around to find it."

## Folder structure

```
src/
  scene/                   # Layer A — R3F only, nothing else may import from here
    Canvas.tsx
    Table.tsx
    Diary.tsx
    Props/
      Lamp.tsx  Globe.tsx  Books.tsx  Mug.tsx  Hourglass.tsx  Camera.tsx  Plant.tsx  Nameplate.tsx
    CameraRig.tsx           # every GSAP timeline that touches camera or diary lives here, nowhere else
    textures/                # canvas-generated procedural textures (wood grain, cover art, spines)
  content/                  # Layer B — DOM overlay
    ChapterNav.tsx
    ChapterDots.tsx
    chapters/
      About.tsx  Skills.tsx  Projects.tsx  Experience.tsx  Contact.tsx
    ProjectCard.tsx
    ProjectDetail.tsx
  data/
    projects.ts              # content only, no JSX — see 03-CONTENT-STORYLINE.md
    chapters.ts
    skills.ts
  store/
    usePortfolioStore.ts
  lib/
    deviceTier.ts            # detect-gpu wrapper, runs once at boot
    urlSync.ts
  App.tsx                    # mounts Canvas (Layer A) + Overlay (Layer B), nothing else
```

## Tech stack (see 02-DESIGN-SYSTEM.md for the "why" on each)

React 19 + Vite + TypeScript · Three.js + `@react-three/fiber@9` + `@react-three/drei` · GSAP + `@gsap/react` (`useGSAP`) · Motion (`motion/react`) · `lenis` + `lenis/react` · Zustand · Tailwind CSS v4 · `detect-gpu` · `gltfjsx` for the asset compression pipeline once real 3D assets replace the v1 primitives · Vercel (Hobby) for hosting.

## Device tiering — the fallback isn't a degraded 3D scene, it's Layer B alone

| Tier | Detection | What renders |
|---|---|---|
| 3 — high | `detect-gpu` tier 3, desktop | Full Layer A + Layer B, post-processing on |
| 2 — mid | tier 2, or mobile on tier 3 hardware | Layer A + Layer B, no post-fx, pre-compressed textures |
| 1 — low / no WebGL / `prefers-reduced-motion` | tier 1, WebGL unsupported, or the media query | **Layer B only.** No Canvas mounted at all. |

This table is the actual reason the two-layer split exists. A recruiter opening this on a locked-down corporate laptop should never see a stuttering half-loaded 3D scene — they should see the same content, instantly, with no 3D.
