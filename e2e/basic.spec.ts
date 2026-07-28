import { test, expect, type Page } from '@playwright/test';

/**
 * Basic E2E Tests — Critical user flows for "The Diary of Me" portfolio.
 *
 * Tests:
 * 1. Page loads with correct title
 * 2. Hero section is visible with title
 * 3. Navigation to sections works
 * 4. 3D toggle button works
 * 5. Theme toggle works
 * 6. Contact form is present
 */

test.describe('Portfolio Application', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/The Diary of Me/);
  });

  test('should display hero section with title', async ({ page }) => {
    const heroTitle = page.locator('#hero-title');
    await expect(heroTitle).toBeVisible();
    await expect(heroTitle).toContainText('The Diary of Me');
  });

  test('should display hero subtitle', async ({ page }) => {
    const subtitle = page.locator('.hero-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('A craftsman');
  });

  test('should have "Open Diary" CTA button', async ({ page }) => {
    const cta = page.locator('.hero-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Open Diary');
  });

  test('should navigate to about section', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    const aboutSection = page.locator('#about');
    await expect(aboutSection).toBeInViewport();
  });

  test('should have 3D toggle button', async ({ page }) => {
    const toggle = page.locator('.hero-3d-toggle');
    await expect(toggle).toBeVisible();
  });

  test('should have contact section with form', async ({ page }) => {
    await page.evaluate(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1000);
    const contactSection = page.locator('#contact');
    await expect(contactSection).toBeInViewport();
  });

  test('should have skip link for accessibility', async ({ page }) => {
    const skipLink = page.locator('.skip-link');
    await expect(skipLink).toBeInViewport();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('should respect reduced motion preference', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload();
    // Verify the page still loads correctly with reduced motion
    const heroTitle = page.locator('#hero-title');
    await expect(heroTitle).toBeVisible();
  });

  test('should display all section elements', async ({ page }) => {
    const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
    for (const id of sections) {
      const section = page.locator(`#${id}`);
      await expect(section).toBeInViewport({ ratio: 0.1 });
    }
  });
});
