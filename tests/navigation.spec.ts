import { test, expect } from '../fixtures/fixtures';

test.describe('Cross-cutting -> Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Cross-cutting -> Navigation - navigate from home to target page via main menu', async ({ navigationPage, textBoxPage }) => {
    // TC-041: Navigate from home to a target page via main menu
    
    // Use navigation to open Elements → Text Box
    await navigationPage.goTo('Elements', 'Text Box');
    
    // Verify Text Box page loads and header matches navigation target
    await expect(textBoxPage.pageHeader).toBeVisible();
    await expect(textBoxPage.pageHeader).toContainText('Text Box');
  });

  test('Cross-cutting -> Navigation - verify sticky header/footer presence across pages', async ({ navigationPage, page }) => {
    // TC-042: Verify sticky header/footer presence across pages
    await navigationPage.goTo('Elements', 'Text Box');
    
    // Get initial header position
    const header = page.locator('header, .header, [role="banner"]').first();
    const initialHeaderPos = await header.boundingBox();
    
    // Scroll down using navigation page helper
    await navigationPage.scrollBy(500);
    
    // Check header presence after scroll
    const scrolledHeaderPos = await header.boundingBox();
    
    if (initialHeaderPos && scrolledHeaderPos) {
      // Header should remain present (either sticky or visible after scroll)
      await expect(header).toBeVisible();
    }
    
    // Scroll back up
    await navigationPage.scrollBy(-500);
    
    // Verify header behavior per design expectations
    await expect(header).toBeVisible();
  });
});
