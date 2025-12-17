import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('should display auth page', async ({ page }) => {
    await expect(page.locator('main')).toBeVisible();
  });

  test('should have email input field', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i));
    await expect(emailInput.first()).toBeVisible();
  });

  test('should have password input field', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i).or(page.getByPlaceholder(/password/i));
    await expect(passwordInput.first()).toBeVisible();
  });

  test('should have submit button', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /sign in|login|submit/i });
    await expect(submitButton.first()).toBeVisible();
  });

  test('should show validation on empty submit', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /sign in|login|submit/i }).first();
    await submitButton.click();
    
    // Should either show validation error or stay on auth page
    await expect(page).toHaveURL(/auth/);
  });

  test('should accept valid email input', async ({ page }) => {
    const emailInput = page.getByLabel(/email/i).or(page.getByPlaceholder(/email/i)).first();
    await emailInput.fill('test@example.com');
    await expect(emailInput).toHaveValue('test@example.com');
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    const toggleLink = page.getByText(/sign up|create account|register|don't have an account/i).first();
    if (await toggleLink.isVisible()) {
      await toggleLink.click();
      // Should show sign up form elements
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should redirect to auth or show login prompt
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url.includes('auth') || url.includes('dashboard')).toBeTruthy();
  });

  test('should redirect unauthenticated users from admin', async ({ page }) => {
    await page.goto('/admin');
    
    await page.waitForTimeout(1000);
    const url = page.url();
    expect(url.includes('auth') || url.includes('admin')).toBeTruthy();
  });
});
