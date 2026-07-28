# Phase 15 Control File — E2E Testing with Playwright

**Status:** COMPLETE  
**Started:** 2026-07-28  
**Goal:** Set up E2E testing with Playwright for critical user flows.

## Tasks

- [x] 15.1 — Install `@playwright/test` as dev dependency
  - Added to `devDependencies` in `package.json`
- [x] 15.2 — Create `playwright.config.ts`
  - Test directory: `./e2e`
  - Base URL: `http://localhost:5173`
  - Projects: Chromium, Firefox, WebKit, Mobile Chrome
  - Web server: `npm run preview` with 60s timeout
  - Trace on first retry
  - Parallel execution in CI
- [x] 15.3 — Create `e2e/basic.spec.ts` with 10 test cases
  1. Page loads with correct title
  2. Hero section is visible with title
  3. Hero subtitle is displayed
  4. "Open Diary" CTA button is present
  5. Navigation to about section works
  6. 3D toggle button is present
  7. Contact section with form is present
  8. Skip link for accessibility is present
  9. Reduced motion preference is respected
  10. All section elements are visible
- [x] 15.4 — Add test scripts to `package.json`
  - `test:e2e` — Run all E2E tests
  - `test:e2e:ui` — Run tests with UI mode
  - `test:e2e:debug` — Run tests in debug mode

## Verification

- [x] `npm run typecheck` exits with code 0
- [x] `npm run build` exits with code 0
- [x] Playwright configuration created
- [x] E2E test suite created with 10 test cases
- [x] Test scripts added to `package.json`
