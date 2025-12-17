import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the landing page', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have navigation elements', async ({ page }) => {
    const nav = page.locator('nav, header');
    await expect(nav.first()).toBeVisible();
  });

  test('should have call-to-action buttons', async ({ page }) => {
    const buttons = page.getByRole('button');
    await expect(buttons.first()).toBeVisible();
  });

  test('should navigate to auth page when clicking sign in', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: /sign in|login|get started/i }).first();
    if (await signInButton.isVisible()) {
      await signInButton.click();
      await expect(page).toHaveURL(/auth/);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have proper page title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
  });
});

test.describe('Accessibility', () => {
  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('all images should have alt text', async ({ page }) => {
    await page.goto('/');
    const images = page.locator('img');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
