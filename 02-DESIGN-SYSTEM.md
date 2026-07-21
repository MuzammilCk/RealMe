# Design System

## Why this direction, not a default one

Near-black-plus-single-warm-accent is one of the three patterns that AI-generated design clusters around by default — which would normally be a reason to steer away from it. Here it isn't a default: it's what the brief itself specifies (the uploaded mockup is explicitly a dark desk lit by one warm lamp). Where a brief pins down a direction, follow it. The risk to actually take is in the signature element below, not in the palette.

## Color — 6 named values

| Token | Hex | Used for |
|---|---|---|
| `void` | `#0b0a08` | Background. Near-black with a warm undertone, never blue-black. |
| `walnut` | `#4a2f1c` | Table wood, mid-tone surfaces. |
| `leather` | `#2b1810` | Diary cover, darkest wood, shadow surfaces. |
| `brass` | `#c9a15c` | UI accents, embossed text, borders, active states, chapter numerals. Structure, not glow. |
| `parchment` | `#ede0c8` | Diary pages, body text on dark, card backgrounds in Layer B. |
| `ember` | `#ff9d52` | Reserved *only* for actual light sources — the lamp glow, hover-glow on the diary. Never used for static UI chrome. |

Keeping `brass` and `ember` as two distinct accents (rather than one do-everything gold) is deliberate: `brass` reads as tooled metal and structure, `ember` reads as heat and light. Mixing them makes every glow effect ambiguous with every button.

## Type — 3 roles, each earning its place

| Role | Face | Why this one, not the obvious pairing |
|---|---|---|
| Display | **Fraunces** (700–900, variable optical size) | Soft, slightly irregular serif — reads as engraved/hand-tooled rather than corporate-editorial. Used with restraint: diary cover, chapter titles, the hero line only. |
| Body / reading | **Lora** (400–500, italic for asides) | A book-page serif, not the display face — reading a chapter should feel like reading a printed page, not a poster. |
| UI / chrome / labels | **JetBrains Mono** (400–500) | Not "a mono font because tech portfolios use mono fonts" — a specific nod to the fact that this person writes code for a living. Chapter numerals, nav labels, skill tags, the nameplate prop's texture. |

Fallback stack (fonts load from Google Fonts; degrade gracefully if blocked):
`Fraunces, Georgia, 'Iowan Old Style', serif` · `Lora, Georgia, serif` · `'JetBrains Mono', 'SF Mono', Consolas, monospace`

## Layout concept

```
INTRO STATE
┌──────────────────────────────────────────────────┐
│ SOFTWARE ENGINEER · KTU              (mono, quiet) │
│                                                     │
│                 [ 3D desk scene ]                  │
│         lamp-lit diary, faint pulse on hover        │
│                                                     │
│              click the diary to begin              │
└──────────────────────────────────────────────────┘

DIARY OPEN — SPREAD
┌───────────────────────┬───────────────────────────┐
│ LEFT PAGE              │ RIGHT PAGE                 │
│ "My Story" — short bio │ 01  About                  │
│ blurb, Lora italic     │ 02  Skills                  │
│                         │ 03  Projects                │
│                         │ 04  Experience               │
│                         │ 05  Contact                   │
└───────────────────────┴───────────────────────────┘
                                              • • • • •  ← chapter dots, right edge

DIARY OPEN — PROJECTS CHAPTER
┌───────────────────────┬───────────────────────────┐
│ LEFT: project card      │ RIGHT: project card(s)      │
│ (polaroid-style photo    │ stacked, tap to expand       │
│  + brass tech tags)      │                               │
└───────────────────────┴───────────────────────────┘
  ← chapters                                  close ✕
```

The `01 / 02 / 03` chapter numerals are the one place numbered markers are justified in this design — chapters genuinely are an ordered sequence (a life story read start to end), not decoration bolted onto unordered content.

## Signature element

The diary cover art: a canvas-generated texture that fuses tooled-leather border flourish with circuit-trace nodes and junctions, rendered in `brass` on `leather`. It's the one place the two halves of this person's actual work — software and physical electronics (RIMS Shop) — show up in the same object, literally. Everything else in the scene stays quiet so this reads as the one deliberate flourish, not one of several competing ideas.

## 3D asset spec

v1 ships with **stylized primitive geometry**, not custom-sculpted Blender assets — see `00-README.md`. This section specs both what v1 actually builds (achievable with box/cylinder/sphere primitives + procedural canvas textures) and what the Phase 5 Blender/Spline pass replaces it with later. Nothing in Layer B or the store needs to change when that swap happens — only the `.glb` imports in `scene/`.

### Table
Flat box, 6 × 0.15 × 3.4 units, four cylinder legs. Material: `walnut`, procedural wood-grain canvas texture (streaked noise lines, low contrast), roughness 0.55, near-zero metalness. Receives shadow.

### Diary — the hero object
- Back cover + pages block: stacked boxes, `leather` back / `parchment` page-edge visible as a thin exposed band.
- Front cover: separate box, parented to a pivot group positioned at the spine edge (not the cover's own center) — this is what makes it swing open like a real hinge instead of rotating around its middle.
- Cover face material: the signature canvas texture (leather grain + brass circuit-flourish border + "MY JOURNEY" in Fraunces + a small mono subtitle).
- Closed state: flat, catching lamp light on the embossed brass linework. Open state: cover rotated ~165° around the spine pivot, pages block visible, then Layer B's DOM spread fades in on top.

### Lamp
Cone (shade, `leather`-adjacent dark metal tone) + cylinder (arm) + small cylinder (base). A `PointLight` in `ember`, positioned at the shade opening, is the scene's dominant light source — everything else stays dim so this one light source does the emotional work.

### Props (all stylized, low detail — supporting cast, not the lead)
- **Globe**: sphere + procedural continent-noise texture + thin torus stand.
- **Book stack**: 3 boxes, varied size, canvas-texture spine labels ("SKILLS", "DESIGN", "DEVELOPMENT").
- **Mug**: cylinder + torus-segment handle.
- **Hourglass**: two cones apex-to-apex + thin cylinder frame.
- **Camera**: boxes + cylinders assembled into a simplified vintage-camera silhouette.
- **Plant**: cylinder pot + clustered flattened-sphere foliage.
- **Nameplate**: thin box, canvas-texture "Hello, I'm — YOUR NAME" in mono, sits front-of-table.

### Lighting recipe
Very dim warm `AmbientLight` (keeps the room readable but dark) + the lamp `PointLight` as key + a faint, cool `DirectionalLight` from behind at low intensity as a rim light for edge separation against the void background. `FogExp2` in `void` for soft depth falloff instead of a hard horizon line.
