# The Diary of Me — Portfolio Build

> A narrative, spatial portfolio: a desk in the dark, a lamp, and a diary that opens into a life's work.

This folder is the full spec set I'd hand to an agentic coding IDE (Antigravity, Claude Code, Cursor) before writing a single line of application code. Each file is scoped so an agent can execute against it without re-deriving decisions mid-task — that's the whole point of writing these first.

## Reading order for the agent

1. **01-ARCHITECTURE.md** — the two-layer system, state shape, folder structure. Read this first; every other doc assumes it.
2. **02-DESIGN-SYSTEM.md** — color, type, the 3D asset spec for every object on the table.
3. **03-CONTENT-STORYLINE.md** — the actual words. Every chapter, every project card, final copy.
4. **04-COMPONENTS.md** — component-by-component behavior spec: props, states, transitions.
5. **05-BUILD-WORKFLOW.md** — the task sequence I'd actually run, in order, with checkpoints.
6. **architecture-diagram.mermaid** — the system diagram in one picture.

## What "done" means for v1

- Diary click → camera dolly → cover opens → chapter spread renders. All real content, no lorem ipsum.
- Works with WebGL. Degrades to a flat, content-identical build when it can't (no WebGL, low GPU tier, `prefers-reduced-motion`).
- Every project card links out to real work: AI Invoice Studio, the RIMS Shop WhatsApp Assistant, Echo.
- Loads in under ~3s on a cold cache, mobile data.

## What v1 explicitly does not include

Sound design, custom Blender-sculpted assets (v1 ships with stylized primitive geometry — see 02-DESIGN-SYSTEM.md's note on this), WebGPU renderer, page-turn shader effects. These are Phase 7+ per the original build plan — adding them later shouldn't require touching Layer B at all, which is the point of the architecture.

## The one-line pitch, if someone asks what this is

"My portfolio is a desk in the dark. You open the diary to read it."
