/**
 * Type-safe Design Token Access
 * "The Diary of Me" v2 Premium 3D Portfolio
 *
 * Usage:
 *   import { tokens } from '@/lib/tokens';
 *   tokens.color.brass[500]     // 'oklch(0.72 0.14 85)'
 *   tokens.space[4]             // '1rem'
 *   tokens.font.display         // '"Cinzel Decorative", "Cinzel", Georgia, serif'
 *   tokens.easing.spring        // 'cubic-bezier(0.34, 1.56, 0.64, 1)'
 */

// ============================================================================
// COLOR TOKENS (OKLCH)
// ============================================================================

export const color = {
  void: {
    950: 'oklch(0.08 0.005 240)',
    900: 'oklch(0.12 0.008 240)',
    800: 'oklch(0.18 0.01 240)',
  },
  walnut: {
    900: 'oklch(0.15 0.04 35)',
    700: 'oklch(0.28 0.06 35)',
    500: 'oklch(0.45 0.08 35)',
  },
  leather: {
    900: 'oklch(0.18 0.03 25)',
    700: 'oklch(0.32 0.05 25)',
    500: 'oklch(0.52 0.07 25)',
  },
  brass: {
    900: 'oklch(0.35 0.08 75)',
    700: 'oklch(0.52 0.12 75)',
    500: 'oklch(0.72 0.14 85)',
    300: 'oklch(0.88 0.1 90)',
  },
  parchment: {
    900: 'oklch(0.35 0.02 45)',
    700: 'oklch(0.55 0.03 45)',
    500: 'oklch(0.75 0.04 50)',
    300: 'oklch(0.92 0.03 55)',
  },
  ember: {
    500: 'oklch(0.62 0.18 40)',
    400: 'oklch(0.75 0.16 45)',
    300: 'oklch(0.88 0.12 50)',
  },
  mystery: {
    500: 'oklch(0.48 0.15 285)',
    400: 'oklch(0.62 0.18 285)',
    300: 'oklch(0.78 0.14 285)',
  },
  teal: {
    500: 'oklch(0.52 0.12 185)',
    400: 'oklch(0.68 0.14 185)',
    300: 'oklch(0.82 0.1 185)',
  },
} as const;

// ============================================================================
// SEMANTIC COLOR MAPPINGS (Layer B)
// ============================================================================

export const semanticColor = {
  // Backgrounds
  bg: {
    scene: 'var(--bg-scene)',
    canvas: 'var(--bg-canvas)',
    card: 'var(--bg-card)',
    input: 'var(--bg-input)',
    paper: 'var(--bg-paper)',
  },
  // Text
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-muted)',
    inverse: 'var(--text-inverse)',
    accent: 'var(--text-accent)',
    mystery: 'var(--text-mystery)',
    teal: 'var(--text-teal)',
  },
  // Borders
  border: {
    subtle: 'var(--border-subtle)',
    default: 'var(--border-default)',
    strong: 'var(--border-strong)',
    glow: 'var(--border-glow)',
  },
  // Interactive
  interactive: {
    default: 'var(--interactive-default)',
    hover: 'var(--interactive-hover)',
    active: 'var(--interactive-active)',
    glow: 'var(--interactive-glow)',
    mystery: 'var(--interactive-mystery)',
  },
  // Glows
  glow: {
    ember: 'var(--glow-ember)',
    mystery: 'var(--glow-mystery)',
    teal: 'var(--glow-teal)',
    brass: 'var(--glow-brass)',
  },
} as const;

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const space = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.5rem',    // 40px
  10: '3rem',     // 48px
  12: '4rem',     // 64px
  16: '6rem',     // 96px
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const font = {
  display: '"Cinzel Decorative", "Cinzel", Georgia, serif',
  heading: '"Cinzel", "Cinzel Decorative", Georgia, serif',
  eyebrow: '"IM Fell English SC", "Cinzel", Georgia, serif',
  body: '"Crimson Pro", Georgia, serif',
  caption: '"IBM Plex Sans", system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
} as const;

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export const fontSize = {
  xs: 'clamp(0.625rem, 0.5vw + 0.5rem, 0.75rem)',
  sm: 'clamp(0.75rem, 0.5vw + 0.625rem, 0.875rem)',
  base: 'clamp(1rem, 0.5vw + 0.875rem, 1.125rem)',
  lg: 'clamp(1.125rem, 0.75vw + 0.875rem, 1.25rem)',
  xl: 'clamp(1.25rem, 1vw + 1rem, 1.5rem)',
  '2xl': 'clamp(1.5rem, 1.5vw + 1rem, 2rem)',
  '3xl': 'clamp(1.875rem, 2vw + 1.25rem, 2.5rem)',
  '4xl': 'clamp(2.25rem, 3vw + 1.5rem, 3.5rem)',
  '5xl': 'clamp(3rem, 4vw + 2rem, 5rem)',
} as const;

export const lineHeight = {
  tight: 1.1,
  snug: 1.2,
  normal: 1.5,
  relaxed: 1.7,
  loose: 2,
} as const;

export const letterSpacing = {
  tight: '-0.02em',
  normal: '0',
  wide: '0.05em',
  wider: '0.1em',
  widest: '0.12em',
} as const;

// ============================================================================
// ELEVATION / SHADOW TOKENS
// ============================================================================

export const shadow = {
  0: 'none',
  1: '0 1px 2px -1px rgb(0 0 0 / 0.4), 0 1px 3px -1px rgb(0 0 0 / 0.3)',
  2: '0 4px 8px -2px rgb(0 0 0 / 0.5), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
  3: '0 12px 24px -4px rgb(0 0 0 / 0.6), 0 4px 8px -4px rgb(0 0 0 / 0.5)',
  4: '0 24px 48px -8px rgb(0 0 0 / 0.7), 0 8px 16px -8px rgb(0 0 0 / 0.6)',
  glow: {
    ember: '0 0 20px -4px var(--glow-ember), 0 0 40px -8px var(--glow-ember / 0.5)',
    mystery: '0 0 20px -4px var(--glow-mystery), 0 0 40px -8px var(--glow-mystery / 0.5)',
    teal: '0 0 20px -4px var(--glow-teal), 0 0 40px -8px var(--glow-teal / 0.5)',
    brass: '0 0 20px -4px var(--glow-brass), 0 0 40px -8px var(--glow-brass / 0.5)',
  },
} as const;

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const radius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  full: '9999px',
} as const;

// ============================================================================
// MOTION TOKENS
// ============================================================================

export const duration = {
  instant: '50ms',
  fast: '150ms',
  base: '300ms',
  slow: '500ms',
  major: '800ms',
  cinematic: '1200ms',
} as const;

export const easing = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  expoOut: 'cubic-bezier(0.19, 1, 0.22, 1)',
  sharp: 'cubic-bezier(0.4, 0, 0.2, 1)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const stagger = {
  micro: '30ms',
  section: '100ms',
  hero: '150ms',
} as const;

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  max: 9999,
} as const;

// ============================================================================
// BREAKPOINTS (for reference - use Tailwind media queries)
// ============================================================================

export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// CONTAINER WIDTHS
// ============================================================================

export const container = {
  prose: '65ch',
  content: '72rem',  // 1152px
  wide: '90rem',     // 1440px
  full: '100vw',
} as const;

// ============================================================================
// COMPOSITE TOKEN OBJECT
// ============================================================================

export const tokens = {
  color,
  semanticColor,
  space,
  font,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  shadow,
  radius,
  duration,
  easing,
  stagger,
  zIndex,
  breakpoint,
  container,
} as const;

// Type helpers
export type ColorScale = typeof color.void;
export type SpaceScale = typeof space;
export type FontFamily = typeof font;
export type FontSize = typeof fontSize;
export type ShadowScale = typeof shadow;
export type RadiusScale = typeof radius;
export type DurationScale = typeof duration;
export type EasingMap = typeof easing;