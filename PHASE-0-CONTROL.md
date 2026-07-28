# Phase 0 Control File — Fix the Build

**Status:** IN PROGRESS  
**Started:** 2026-07-28  
**Goal:** Get `npm run build` passing with zero TypeScript errors.

## Error Categories

| # | Category | Count | Files Affected |
|---|----------|-------|----------------|
| 1 | `verbatimModuleSyntax` — `HTMLMotionProps` imported as value | ~10 | Button, Card, DiaryPage, Input, Panel, SkillOrb, Tooltip, Typography, Section, Layout |
| 2 | Unused imports/variables (`noUnusedLocals`/`noUnusedParameters`) | ~30 | Button, Card, DiaryPage, Modal, SkillOrb, Toast, Tooltip, Typography, Header, Footer, Layout, Section, useEasterEggs, useLazySection |
| 3 | Missing component files | 6 | Divider, Spinner, Tabs, Accordion, Dropdown, Progress |
| 4 | Export issues | 2 | Typography (no `Typography` export), Toast (no `Toast` export) |
| 5 | Import path issues | 2 | SkillOrb (`../../../store/` → `../../store/`), useTheme (`../app/` → `../../app/`) |
| 6 | Framer Motion type conflicts (`MotionStyle`, `HTMLMotionProps` event handlers) | ~15 | Button, Card, Input, Panel, IconButton, Typography, Layout, Section |
| 7 | Index signature errors | 2 | Card (`elevationShadows[number]`), Toast (`icons[string]`) |
| 8 | Other type errors | ~10 | Modal (`style` prop), SkillOrb (`material.color`), Footer (`gap`, `JSX`), Layout (`HTMLSectionElement`, `variants`), Section (`colGap`, `React` UMD) |

## Tasks

- [x] 0.1 — Fix `verbatimModuleSyntax` violations (add `import type` for `HTMLMotionProps`)
- [x] 0.2 — Remove all unused imports/variables
- [x] 0.3 — Create missing component files: Divider, Spinner, Tabs, Accordion, Dropdown, Progress
- [x] 0.4 — Fix `Typography` export
- [x] 0.5 — Fix `Toast` export
- [x] 0.6 — Fix `SkillOrb.tsx` import path
- [x] 0.7 — Fix Framer Motion type conflicts
- [x] 0.8 — Fix `Card.tsx` index signature error
- [x] 0.9 — Fix `Toast.tsx` index signature error
- [x] 0.10 — Fix `Modal.tsx` — `style` prop, `colors` unused
- [x] 0.11 — Fix `IconButton.tsx` — type conflict
- [x] 0.12 — Fix `SkillOrb.tsx` — `material.color` type error
- [x] 0.13 — Fix `Tooltip.tsx` — missing `useRef` import
- [x] 0.14 — Fix `Typography.tsx` — `React.ReactHTML`, motion style conflicts
- [x] 0.15 — Fix `Header.tsx` — unused imports, `scaleX` type
- [x] 0.16 — Fix `Footer.tsx` — `gap` type, `JSX` namespace
- [x] 0.17 — Fix `Layout.tsx` — `HTMLSectionElement`, variants, `<style jsx>`, `flexDirection`
- [x] 0.18 — Fix `Section.tsx` — `HTMLSectionElement`, `React` UMD, `colGap`, `<style jsx>`
- [x] 0.19 — Fix `useEasterEggs.tsx` — `isContentEditable`, unused `handleClick`
- [x] 0.20 — Fix `useLazySection.tsx` — unused `SectionSkeleton`
- [x] 0.21 — Fix `useTheme.ts` — import path, missing exports from ThemeProvider
- [x] 0.22 — Fix `index.ts` — missing module references
- [ ] 0.13 — Verify `npm run build` passes

## Verification

- [x] `npx tsc -b` exits with code 0
- [x] `npm run build` exits with code 0
- [x] `npm run typecheck` exits with code 0

**Result:** All 183 TypeScript errors resolved. Build passes with zero errors. Only warning is about chunk sizes >500KB (expected for Three.js portfolio).
