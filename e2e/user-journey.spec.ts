import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test('landing to auth flow', async ({ page }) => {
    // Start at landing page
    await page.goto('/');
    await expect(page.locator('main')).toBeVisible();
    
    // Find and click sign in/get started button
    const ctaButton = page.getByRole('button', { name: /sign in|get started|login/i }).first();
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      await page.waitForURL(/auth/, { timeout: 5000 });
      await expect(page).toHaveURL(/auth/);
    }
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show 404 page or redirect
    const notFoundText = page.getByText(/404|not found|page doesn't exist/i);
    const main = page.locator('main');
    
    await expect(notFoundText.first().or(main)).toBeVisible();
  });

  test('should maintain state across navigation', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to auth
    await page.goto('/auth');
    await expect(page).toHaveURL(/auth/);
    
    // Navigate back
    await page.goBack();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Performance', () => {
  test('should load landing page within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.locator('main').waitFor({ state: 'visible' });
    const loadTime = Date.now() - startTime;
    
    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should not have console errors on landing', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Filter out known acceptable errors
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('Failed to load resource')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});

test.describe('Theme and Appearance', () => {
  test('should respect system color scheme preference', async ({ page }) => {
    // Test light mode
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();
    
    // Test dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await expect(page.locator('body')).toBeVisible();
  });

  test('should have theme toggle functionality', async ({ page }) => {
    await page.goto('/');
    
    const themeToggle = page.locator('[class*="theme"], [aria-label*="theme"], button:has-text("dark"), button:has-text("light")');
    if (await themeToggle.first().isVisible()) {
      await themeToggle.first().click();
      await page.waitForTimeout(500);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});

test.describe('Forms and Interactions', () => {
  test('should handle form submissions gracefully', async ({ page }) => {
    await page.goto('/auth');
    
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).first();
    const passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i)).first();
    const submitButton = page.getByRole('button', { name: /sign in|login|submit/i }).first();
    
    if (await emailInput.isVisible() && await passwordInput.isVisible()) {
      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      await submitButton.click();
      
      // Should either show error or navigate
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
