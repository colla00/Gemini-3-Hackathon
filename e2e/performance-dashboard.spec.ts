import { test, expect } from '@playwright/test';

test.describe('Performance Monitoring Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');
  });

  test('should display minimized performance button initially', async ({ page }) => {
    // Look for the performance button
    const perfButton = page.locator('button:has-text("Performance")');
    await expect(perfButton).toBeVisible();
  });

  test('should expand dashboard when clicking performance button', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Check for expanded dashboard elements
    await expect(page.locator('text=Performance Monitor')).toBeVisible();
    await expect(page.locator('text=Web Vitals')).toBeVisible();
  });

  test('should display Web Vitals metrics', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Check for Web Vitals labels
    await expect(page.locator('text=Page Load')).toBeVisible();
    await expect(page.locator('text=FCP')).toBeVisible();
    await expect(page.locator('text=TTI')).toBeVisible();
  });

  test('should toggle between Metrics and Regression tabs', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Click on Regression tab
    const regressionTab = page.locator('button[role="tab"]:has-text("Regression")');
    await regressionTab.click();
    
    // Should show regression content
    await expect(page.locator('text=Regression Detection')).toBeVisible();
    
    // Switch back to Metrics
    const metricsTab = page.locator('button[role="tab"]:has-text("Metrics")');
    await metricsTab.click();
    
    await expect(page.locator('text=Web Vitals')).toBeVisible();
  });

  test('should capture baseline when clicking capture button', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Navigate to Regression tab
    const regressionTab = page.locator('button[role="tab"]:has-text("Regression")');
    await regressionTab.click();
    
    // Click capture baseline
    const captureButton = page.locator('button:has-text("Capture Baseline")');
    await captureButton.click();
    
    // Should show baseline was captured (button text changes to Update)
    await expect(page.locator('button:has-text("Update Baseline")')).toBeVisible();
  });

  test('should minimize dashboard when clicking minimize button', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Wait for dashboard to be visible
    await expect(page.locator('text=Performance Monitor')).toBeVisible();
    
    // Click minimize button
    const minimizeButton = page.locator('button[title="Minimize"]');
    await minimizeButton.click();
    
    // Dashboard should be minimized
    await expect(page.locator('text=Performance Monitor')).not.toBeVisible();
    await expect(perfButton).toBeVisible();
  });

  test('should pause and resume monitoring', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Click pause button
    const pauseButton = page.locator('button[title="Pause monitoring"]');
    await pauseButton.click();
    
    // Should show resume button
    await expect(page.locator('button[title="Resume monitoring"]')).toBeVisible();
    
    // Click resume
    const resumeButton = page.locator('button[title="Resume monitoring"]');
    await resumeButton.click();
    
    // Should show pause button again
    await expect(page.locator('button[title="Pause monitoring"]')).toBeVisible();
  });

  test('should expand Hook Performance section', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Click on Hook Performance collapsible
    const hookSection = page.locator('button:has-text("Hook Performance")');
    await hookSection.click();
    
    // Should show hook names
    await expect(page.locator('text=usePatients')).toBeVisible();
  });

  test('should export performance report', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Listen for download
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    const exportButton = page.locator('button[title="Export report"]');
    await exportButton.click();
    
    // Verify download started
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('performance-report');
  });

  test('should clear metrics when clicking clear button', async ({ page }) => {
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Click clear button
    const clearButton = page.locator('button[title="Clear metrics"]');
    await clearButton.click();
    
    // Dashboard should still be visible after clearing
    await expect(page.locator('text=Performance Monitor')).toBeVisible();
  });

  test('should respond to keyboard shortcut Ctrl+Shift+P', async ({ page }) => {
    // Press Ctrl+Shift+P to toggle dashboard
    await page.keyboard.press('Control+Shift+KeyP');
    
    // Dashboard should expand
    await expect(page.locator('text=Performance Monitor')).toBeVisible();
    
    // Press again to minimize
    await page.keyboard.press('Control+Shift+KeyP');
    
    // Dashboard should minimize
    await expect(page.locator('text=Performance Monitor')).not.toBeVisible();
  });

  test('should capture baseline with keyboard shortcut B when focused', async ({ page }) => {
    // First expand dashboard
    await page.keyboard.press('Control+Shift+KeyP');
    await expect(page.locator('text=Performance Monitor')).toBeVisible();
    
    // Navigate to regression tab
    const regressionTab = page.locator('button[role="tab"]:has-text("Regression")');
    await regressionTab.click();
    
    // Press B to capture baseline
    await page.keyboard.press('KeyB');
    
    // Should show baseline was captured
    await expect(page.locator('button:has-text("Update Baseline")')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Performance Dashboard Accessibility', () => {
  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    const perfButton = page.locator('button:has-text("Performance")');
    await perfButton.click();
    
    // Check for accessible buttons
    await expect(page.locator('button[title="Pause monitoring"]')).toHaveAttribute('title', 'Pause monitoring');
    await expect(page.locator('button[title="Clear metrics"]')).toHaveAttribute('title', 'Clear metrics');
    await expect(page.locator('button[title="Export report"]')).toHaveAttribute('title', 'Export report');
    await expect(page.locator('button[title="Minimize"]')).toHaveAttribute('title', 'Minimize');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Tab to performance button
    await page.keyboard.press('Tab');
    
    // Keep tabbing until we find the performance button
    let found = false;
    for (let i = 0; i < 50; i++) {
      const focused = page.locator(':focus');
      const text = await focused.textContent().catch(() => '');
      if (text?.includes('Performance')) {
        found = true;
        break;
      }
      await page.keyboard.press('Tab');
    }
    
    expect(found).toBe(true);
  });
});
