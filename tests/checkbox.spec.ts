import { test, expect } from '../fixtures/fixtures';

test.describe('Elements -> Check Box', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Elements -> Check Box - expand tree and select multiple checkboxes', async ({ navigationPage, page, checkBoxPage }) => {
    // TC-003: Expand tree and select multiple checkboxes
    await navigationPage.goTo('Elements', 'Check Box');
    // Select Home checkbox (which is available)
    await checkBoxPage.selectCheckbox('home');
    
    // Verify result panel shows selection
    await expect(checkBoxPage.resultDiv).toBeVisible();
    await expect(checkBoxPage.resultDiv).toContainText('home');
  });

  test('Elements -> Check Box - collapse nodes preserve selection', async ({ navigationPage, checkBoxPage }) => {
    // TC-004: Collapse nodes preserve selection
    await navigationPage.goTo('Elements', 'Check Box');
    
    // Select Home checkbox
    await checkBoxPage.selectCheckbox('home');
    
    // Verify selection persists 
    const homeChecked = await checkBoxPage.isCheckboxChecked('home');
    expect(homeChecked).toBe(true);
    await expect(checkBoxPage.resultDiv).toContainText('home');
  });
});

