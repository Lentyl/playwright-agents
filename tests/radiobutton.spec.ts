import { test, expect } from '../fixtures/fixtures';

test.describe('Elements -> Radio Button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Elements -> Radio Button - select each radio option and verify result', async ({ navigationPage, radioPage }) => {
    // TC-005: Select each radio option and verify result
    await navigationPage.goTo('Elements', 'Radio Button');
    
    // Click Yes radio and verify result
    await radioPage.yesRadio.click();
    await expect(radioPage.resultText).toBeVisible();
    await expect(radioPage.resultText).toContainText('Yes');
    
    // Click Impressive radio and verify result
    await radioPage.impressiveRadio.click();
    await expect(radioPage.resultText).toContainText('Impressive');
    
    // Try to click No radio (if available) - usually disabled
    if (await radioPage.noRadio.isEnabled()) {
      await radioPage.noRadio.click();
      await expect(radioPage.resultText).toContainText('No');
    } else {
      // Verify No radio is disabled
      await expect(radioPage.noRadio).toBeDisabled();
    }
  });
});

