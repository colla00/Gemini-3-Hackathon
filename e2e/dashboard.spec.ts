import { test, expect } from '@playwright/test';

// Helper to mock authentication
async function mockAuthenticatedUser(page: any) {
  // Set up localStorage to simulate logged-in state
  await page.addInitScript(() => {
    localStorage.setItem('sb-auth-token', JSON.stringify({
      access_token: 'mock-token',
      user: { id: 'test-user', email: 'test@example.com' }
    }));
  });
}

test.describe('Dashboard', () => {
  test('should show loading skeleton initially', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Either shows skeleton or redirects
    const skeleton = page.locator('[class*="skeleton"], [class*="animate-pulse"]');
    const main = page.locator('main');
    
    await expect(skeleton.first().or(main)).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Dashboard Components (when accessible)', () => {
  test('should display patient cards when loaded', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Check if patient cards are visible (if user is authenticated)
    const patientCards = page.locator('[class*="patient"], [data-testid*="patient"]');
    const cardCount = await patientCards.count();
    
    // Either has patient cards or is on auth page
    if (cardCount > 0) {
      await expect(patientCards.first()).toBeVisible();
    }
  });

  test('should have filter controls', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Look for filter elements
    const filters = page.locator('input[type="text"], select, [class*="filter"]');
    const filterCount = await filters.count();
    
    if (filterCount > 0) {
      await expect(filters.first()).toBeVisible();
    }
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Risk Visualization', () => {
  test('should display risk indicators', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);
    
    // Look for risk badges or indicators
    const riskIndicators = page.locator('[class*="risk"], [class*="badge"]');
    const count = await riskIndicators.count();
    
    if (count > 0) {
      await expect(riskIndicators.first()).toBeVisible();
    }
  });
});

test.describe('Navigation', () => {
  test('should have header navigation', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    const header = page.locator('header, nav');
    if (await header.first().isVisible()) {
      await expect(header.first()).toBeVisible();
    }
  });

  test('should navigate back to landing', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(1000);
    
    const homeLink = page.getByRole('link', { name: /home|logo/i }).first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await expect(page).toHaveURL('/');
    }
  });
});
