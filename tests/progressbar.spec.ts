import { test, expect } from '../fixtures/fixtures';

test.describe('Widgets -> Progress Bar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Widgets -> Progress Bar - start progress, stop and reset', async ({ navigationPage, progressBarPage, page }) => {
    // TC-038: Start progress, stop and reset
    await navigationPage.goTo('Widgets', 'Progress Bar');
    
    // Pause to inspect before starting progress (helps debug failures)
    await page.pause();

    // Click Start and wait until progress begins
    await progressBarPage.startStopButton.click();
    
    // Wait for progress to start and advance
    await expect(progressBarPage.progressBar).toHaveAttribute('aria-valuenow', /[1-9]/);
    
    // Click Stop mid-progress
    await progressBarPage.startStopButton.click();
    
    // Get current progress value
    const progressValue = await progressBarPage.progressBar.getAttribute('aria-valuenow');
    
    // Wait briefly and verify progress paused (value shouldn't change)
    await page.waitForTimeout(1000);
    const pausedValue = await progressBarPage.progressBar.getAttribute('aria-valuenow');
    expect(pausedValue).toBe(progressValue);
    
    // Click Reset
    await progressBarPage.resetButton.click();
    
    // Verify progress resets to initial state
    await expect(progressBarPage.progressBar).toHaveAttribute('aria-valuenow', '0');
  });
});

