import { test, expect } from '../fixtures/fixtures';

test.describe('Widgets -> Tabs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Widgets -> Tabs - switch tabs and validate content change', async ({ navigationPage, tabsPage, page }) => {
    // TC-037: Switch tabs and validate content change
    await navigationPage.goTo('Widgets', 'Tabs');
    
    // Pause to inspect before clicking tabs (helps debug failures)
    await page.pause();

    // Click What tab and verify content
    await tabsPage.whatTab.click();
    await expect(tabsPage.tabContent).toContainText('Lorem Ipsum');
    
    // Click Origin tab and verify content
    await tabsPage.originTab.click();
    await expect(tabsPage.tabContent).toContainText('Contrary to popular belief');
    
    // Click Use tab and verify content  
    await tabsPage.useTab.click();
    await expect(tabsPage.tabContent).toContainText('It is a long established fact');
    
    // Return to What tab to verify consistency
    await tabsPage.whatTab.click();
    await expect(tabsPage.tabContent).toContainText('Lorem Ipsum');
  });
});

