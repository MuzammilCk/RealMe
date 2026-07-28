/**
 * Scene Color System — OKLCH tokens for the 3D scene layer
 *
 * All colors in src/scene/ must use these tokens instead of raw hex values.
 * OKLCH provides perceptual uniformity for lighting and material blending.
 *
 * ARCHITECTURE-v2 §2 Locked Palette
 */

// ============================================================================
// Leather Palette — Diary cover, dark furniture
// ============================================================================
export const LEATHER = {
  900: 'oklch(0.25 0.08 25)',   // #2b1810 — dark leather
  700: 'oklch(0.32 0.09 25)',   // #3a1f14 — medium leather
  500: 'oklch(0.42 0.10 25)',   // #5a3a24 — light leather
  300: 'oklch(0.55 0.11 25)',   // #7a5a34 — very light leather
} as const;

// ============================================================================
// Brass Palette — Fittings, corners, lamp, circuit flourishes
// ============================================================================
export const BRASS = {
  900: 'oklch(0.45 0.12 55)',   // #8b7343 — oxidized brass
  700: 'oklch(0.65 0.15 55)',   // #c9a15c — standard brass
  500: 'oklch(0.72 0.14 55)',   // #e8c56d — bright brass
  300: 'oklch(0.78 0.13 55)',   // #e8c56d — polished brass
} as const;

// ============================================================================
// Parchment Palette — Diary pages, paper
// ============================================================================
export const PARCHMENT = {
  900: 'oklch(0.20 0.07 25)',   // #1a0f08 — ink / dark parchment
  700: 'oklch(0.30 0.08 30)',   // #3a2a1a — aged paper edge
  500: 'oklch(0.83 0.07 70)',   // #ede0c8 — aged paper
  300: 'oklch(0.88 0.06 70)',   // #f5e8d0 — fresh paper
  100: 'oklch(0.93 0.04 70)',   // #faf4eb — bright paper
} as const;

// ============================================================================
// Walnut Palette — Desk, table, furniture
// ============================================================================
export const WALNUT = {
  900: 'oklch(0.28 0.10 25)',   // #4a2f1c — dark walnut
  700: 'oklch(0.35 0.11 25)',   // #3a2418 — medium walnut
  500: 'oklch(0.55 0.12 55)',   // #8b6914 — light walnut
} as const;

// ============================================================================
// Ember Palette — Warm orange, lamp glow, particle effects
// ============================================================================
export const EMBER = {
  500: 'oklch(0.65 0.20 30)',   // #ff7a2a — standard ember
  400: 'oklch(0.72 0.18 30)',   // #ff9d52 — bright ember
  300: 'oklch(0.78 0.16 30)',   // #ffb060 — glowing ember
  200: 'oklch(0.79 0.16 30)',   // #ffb366 — dust mote
} as const;

// ============================================================================
// Mystery Palette — Purple, AI/ML, backend
// ============================================================================
export const MYSTERY = {
  500: 'oklch(0.55 0.25 300)',  // #9b59b6 — standard mystery
  400: 'oklch(0.68 0.25 300)',  // #bb86fc — bright mystery
  300: 'oklch(0.78 0.20 300)',  // #d0bfff — glowing mystery
} as const;

// ============================================================================
// Teal Palette — DevOps, verdigris
// ============================================================================
export const TEAL = {
  500: 'oklch(0.60 0.20 190)',  // #2aa89e — standard teal
  400: 'oklch(0.72 0.18 190)',  // #4ecdc4 — bright teal
} as const;

// ============================================================================
// Lighting — Warm candlelit workshop
// ============================================================================
export const LIGHTING = {
  key: 'oklch(0.82 0.12 40)',    // #ffd4aa — 3500K warm key light
  fill: 'oklch(0.70 0.10 230)',  // #88aaff — 6500K cool fill
  rim: 'oklch(0.82 0.12 40)',    // #ffd4aa — 3000K brass rim
  ambient: 'oklch(0.20 0.06 30)', // #1c1208 — warm ambient haze
  hemiGround: 'oklch(0.30 0.08 30)', // #3a2a1a — ground bounce
  hemiSky: 'oklch(0.15 0.04 30)',   // #0a0806 — sky color
  volumetric: 'oklch(0.70 0.18 30)', // #ffaa33 — god ray color
} as const;

// ============================================================================
// Scene Environment
// ============================================================================
export const SCENE = {
  fog: 'oklch(0.18 0.06 30)',     // #140b05 — warm fog / background
  shadow: 'oklch(0.15 0.04 30)',   // #0b0a08 — shadow catcher
  coolFill: 'oklch(0.30 0.10 220)', // #0e1c2a — cool directional fill
  hemiGround: 'oklch(0.20 0.07 25)', // #1a0f08 — hemisphere ground
  hemiSky: 'oklch(0.28 0.08 30)',    // #2a1a0c — hemisphere sky
  ambient: 'oklch(0.20 0.06 30)',    // #1c1208 — ambient light
} as const;

// ============================================================================
// Accent Colors — Props and decorative elements
// ============================================================================
export const ACCENT = {
  ribbon: 'oklch(0.40 0.18 0)',     // #8b2d2d — deep red bookmark
  camera: 'oklch(0.25 0.02 250)',   // #1c1c1c — camera body
  lens: 'oklch(0.35 0.02 250)',     // #333333 — camera lens
  leaf: 'oklch(0.35 0.12 140)',     // #2e4a2e — plant leaves
  glass: 'oklch(0.80 0.04 220)',    // #cfd8dc — hourglass glass
  globe: 'oklch(0.35 0.10 190)',    // #2a4a4a — globe base
  globeAccent: 'oklch(0.55 0.10 55)', // #7a6a45 — globe land
  sticky: 'oklch(0.78 0.12 60)',    // #d8c877 — sticky note yellow
  stickyText: 'oklch(0.30 0.08 40)', // #3a2a14 — sticky note text
  bookDark: 'oklch(0.28 0.08 25)',  // #3a2418 — book spine dark
  bookTeal: 'oklch(0.28 0.10 190)', // #1c2b2b — book spine teal
} as const;

// ============================================================================
// Category Colors — Skill orb categories (mapped to locked palette)
// ============================================================================
export const CATEGORY = {
  frontend: { color: EMBER[500], emissive: EMBER[400] },
  backend: { color: MYSTERY[500], emissive: MYSTERY[400] },
  devops: { color: TEAL[500], emissive: TEAL[400] },
  ai: { color: MYSTERY[400], emissive: MYSTERY[300] },
  hardware: { color: BRASS[700], emissive: BRASS[500] },
} as const;

// ============================================================================
// Utility Colors — Procedural texture helpers (not design system)
// ============================================================================
export const UTILITY = {
  normalMap: '#808080',   // Canvas normal map base
  aoWhite: '#ffffff',     // AO map white
  emissiveBlack: '#000000', // Zero emissive
  woodGrain: 'rgba(20,12,6,', // Wood grain base
  speckleBlack: 'rgba(0,0,0,', // Speckle
  grayUtility: 'rgba(128,128,128,', // Gray utility
  whiteUtility: 'rgba(255,255,255,', // White utility
} as const;
