import { test, expect } from '../fixtures/fixtures';

test.describe('Elements -> Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Elements -> Links - validate link opens new tab with expected URL', async ({ navigationPage, linksPage, page }) => {
    // TC-007: Validate link opens new tab with expected URL
    await navigationPage.goTo('Elements', 'Links');
    
    // Start waiting for new page before clicking
    const pagePromise = page.context().waitForEvent('page');
    
    // Click Home link that opens in new tab
    await linksPage.homeLink.click();
    
    // Switch to new tab
    const newPage = await pagePromise;
    await newPage.waitForLoadState();
    
    // Verify new tab URL and title
    expect(newPage.url()).toBe('https://demoqa.com/');
    // Check for the main content area with specific home page element
    await expect(newPage.locator('h5').first()).toBeVisible();
    await expect(newPage.locator('text=Elements')).toBeVisible(); // Verify home page content
    
    // Close new tab
    await newPage.close();
  });

  test('Elements -> Links - verify broken/no-content link response', async ({ navigationPage, linksPage }) => {
    // TC-008: Verify broken/no-content link response
    await navigationPage.goTo('Elements', 'Links');
    
    // Click Created or No Content API-style link
    await linksPage.createdLink.click();
    
    // Verify status message appears
    await expect(linksPage.linkResponse).toBeVisible();
    await expect(linksPage.linkResponse).toContainText('201');
  });

  test('Elements -> Links - verify link that opens same tab behaves correctly', async ({ navigationPage, linksPage, page }) => {
    // TC-045: Verify link that opens same tab behaves correctly
    await navigationPage.goTo('Elements', 'Links');
    
    // Click link that navigates in same tab
    await linksPage.homeInternalLink.click();
    
    // Verify current tab navigated (URL should change)
    await expect(page).toHaveURL('https://demoqa.com/');
    
    // Use back button to return to Links page
    await page.goBack();
    await expect(page).toHaveURL(/links/);
  });
});

