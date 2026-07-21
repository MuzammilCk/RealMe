# Build Workflow — How I'd Actually Run This in an Agentic IDE

The docs before this one are what I'd write *before* opening Antigravity. An agent working from a clear spec produces something very different from one working from "build me a cool 3D diary portfolio" — the difference is entirely in whether decisions were made in advance or improvised mid-generation. This file is the task sequence itself: what I'd feed the agent, in what order, and where I stop to look at the actual result before letting it continue.

## Ground rules I'd give the agent up front

1. Read `01-ARCHITECTURE.md` before generating anything. Do not restructure the two-layer split or the store shape without flagging it first.
2. Layer A and Layer B are separate task batches. Never generate code touching both in the same turn.
3. After any task that produces camera movement, object rotation, or positioning numbers: stop and describe what should be visible, so I can verify against the design doc before the next task starts. Numbers that compile are not the same as numbers that are correct — this is the single most common failure mode of agent-generated 3D code, and it's silent unless someone actually looks.

## Task sequence

**Task 1 — Scaffold.** Vite + React 19 + TypeScript. Install the full stack from `01-ARCHITECTURE.md`. Empty `App.tsx` that mounts an empty `<Canvas>` and an empty overlay `<div>`. *Checkpoint: builds and runs, blank dark page.*

**Task 2 — Store + data files.** `usePortfolioStore.ts` exactly as specced. `data/projects.ts`, `data/chapters.ts`, `data/skills.ts` populated from `03-CONTENT-STORYLINE.md` verbatim — no placeholder copy, the real content goes in now, not later. *Checkpoint: read the data files back, confirm nothing was paraphrased or invented.*

**Task 3 — Layer B only, no Canvas.** Every chapter component, `ChapterNav`, `ChapterDots`, `ProjectCard`, `ProjectDetail`, `Contact`, wired to the store, styled per `02-DESIGN-SYSTEM.md`. Fake the diary-open state with a boolean toggle for now — Layer A doesn't exist yet. *Checkpoint: this is deployable. Ship it. This is the Phase 2 safety-net build from the original plan, and it's done in the first three tasks.*

**Task 4 — Table + static diary, no interaction.** Primitive geometry per `02-DESIGN-SYSTEM.md`'s 3D asset spec, procedural textures, lighting recipe. Fixed camera, no click handling yet. *Checkpoint: screenshot it. Does the composition match the mockup's camera angle? If not, fix framing before adding a single line of interaction code — it's much harder to debug camera math once GSAP timelines are layered on top.*

**Task 5 — Interaction.** Raycaster click detection on the diary, `CameraRig`'s `openSequence()` / `closeSequence()` timelines, cover hinge rotation. Wire to the real store (`openDiary()`/`closeDiary()`), replacing Task 3's boolean toggle. *Checkpoint: click through the full open/close cycle myself, more than once. Half-broken hinge pivots and cameras that end up looking at the wrong point are easy to miss on the first click and obvious by the fifth.*

**Task 6 — Remaining props.** Lamp (+ light), globe, books, mug, hourglass, camera, plant, nameplate — in that order, lamp first since it's the key light everything else is judged against. *Checkpoint: full composition screenshot against the mockup, side by side.*

**Task 7 — Device tiering.** `detect-gpu` wrapper, boot-time tier detection, conditional Canvas mount, `prefers-reduced-motion` check. *Checkpoint: force tier 1 manually and confirm Layer B renders standalone, correctly — this path gets tested far less than the happy path and is exactly where regressions hide.*

**Task 8 — Polish pass.** URL sync, loading screen, page-turn transition on chapter switches, keyboard/focus states. *Checkpoint: full click-through on a throttled network profile, not just localhost.*

## What I would not hand to the agent at all

Blender modeling. An agent can write code; it can't sculpt a diary cover that reads as leather instead of a beveled box. The primitive-geometry v1 in `02-DESIGN-SYSTEM.md` is deliberately scoped to what procedural code can actually achieve well — the real asset pass is a separate, human-driven task with a different toolchain entirely.

## Definition of done for this draft

Everything in `00-README.md`'s "what done means for v1" section, plus: every checkpoint above was actually looked at, not just assumed to have worked because nothing threw an error. That distinction is the whole reason checkpoints exist in this sequence instead of one long uninterrupted generation.
