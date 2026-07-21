# Component Spec

Layer A components take no content props — they only read `diaryState` and `activeChapter` from the store to decide their own animation state. Layer B components take content from `data/` — never hardcoded strings.

## Layer A

### `<Table>`
No props. Static geometry, receives shadow. No state reactivity — it's the one thing on stage that never moves.

### `<Diary>`
Reads: `diaryState`, `activeChapter` (only to know whether to stay in the "open" pose).
Emits: `openDiary()` on click (raycast-detected), only when `diaryState === 'closed'`.
Internal structure: `pivot` group (whole diary) → `coverPivot` group (offset to spine edge) → `cover` mesh. Rotating `coverPivot.rotation` is the entire "opening" animation; nothing else about the diary moves.
Hover state (`closed` only): subtle `ember` glow pulse + slight scale-up (1.0 → 1.02), signals "clickable" without a cursor-style affordance that doesn't exist in a 3D scene.

### `<CameraRig>`
No visual output — owns the camera object and every GSAP timeline that touches `camera.position` or `diaryPivot`. This is the only component allowed to call `gsap.timeline()` against scene objects; keeping that in one place is what makes the animation choreography debuggable instead of scattered across a dozen files.
Two named timelines: `openSequence()` and `closeSequence()`. Chapter switches within the open state do **not** re-trigger a camera move — only Layer B content changes. Keeps the experience from feeling twitchy once you're inside the diary.

### `<Props>` (Lamp, Globe, Books, Mug, Hourglass, Camera, Plant, Nameplate)
No props, no state reactivity except `<Lamp>`, which reads `diaryState` to decide light intensity (dims slightly as ambiance when the diary opens, so the DOM overlay's parchment tones pop against a darker background).

## Layer B

### `<ChapterNav>`
Props: none (reads store directly).
Renders the `01–05` chapter list. Active chapter gets a `brass` underline via Motion's `layoutId` shared-element transition — the underline slides between items instead of popping, which is the one Motion flourish this component earns.

### `<ChapterDots>`
Fixed, right-edge vertical dot stack, one per chapter, visible whenever `diaryState !== 'closed'`. Click jumps directly via `goToChapter()`. This is the fast-travel affordance for someone who already knows what they want to see — a recruiter revisiting the site doesn't need to walk the story again.

### Chapter content components (`About`, `Skills`, `Projects`, `Experience`, `Contact`)
Each takes its content from `data/chapters.ts` / `data/projects.ts` / `data/skills.ts` — no copy lives in the component itself. Swapping between them on `activeChapter` change uses a short fade + 8px translate (the "page turn" feel), not a hard cut.

### `<ProjectCard>`
Props: `project: Project`.
Closed state: polaroid-framed thumbnail, title, one-line tagline, tech tags as `brass`-bordered mono pills.
Click → `openProject(id)` → expands to `<ProjectDetail>` in place (not a route change, not a modal overlay — stays anchored in the diary spread so the "reading a page" feeling holds).

### `<ProjectDetail>`
Props: `project: Project`.
Full description paragraph (Lora), tag list, repo/demo links. Close (`✕`) calls `closeProject()`, returning to the `Projects` chapter's card grid.

### `<Contact>`
Not a form. Static "letter" layout per `03-CONTENT-STORYLINE.md` — a `mailto:` link and two external links. No input fields, no validation logic, no backend — a form is friction between a recruiter and your inbox that this design doesn't need.

## Shared behavior across all Layer B components

- Respect `prefers-reduced-motion`: fades replace slides/scales, durations halve.
- Keyboard: chapter nav and dots are real `<button>` elements, tab-reachable, visible focus ring in `brass`.
- Nothing in Layer B ever imports from `scene/`. If that import ever seems necessary, it's a sign the two-layer boundary is being violated and the design needs to route through the store instead.
