import { test, expect } from '../fixtures/fixtures';

test.describe('Alerts Frame Windows -> Browser Windows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Alerts Frame Windows -> Browser Windows - open new tab and validate content', async ({ navigationPage, browserWindowsPage, page }) => {
    // TC-022: Open new tab and validate content
    await navigationPage.goTo('Alerts, Frame & Windows', 'Browser Windows');
    
    // Start waiting for new page before clicking
    const pagePromise = page.context().waitForEvent('page');
    
    // Click control to open new tab
    await browserWindowsPage.tabButton.click();
    
    // Switch to new tab and verify content
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    // Verify new tab shows expected content
    await expect(newPage.locator('h1')).toContainText('This is a sample page');
    
    // Close new tab and return to original
    await newPage.close();
    
    // Verify focus returned to original tab
    await expect(browserWindowsPage.tabButton).toBeVisible();
  });
});

