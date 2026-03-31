import { test, expect } from '../fixtures/fixtures';

test.describe('Widgets -> Auto Complete', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Widgets -> Auto Complete - single-value auto-complete selection', async ({ navigationPage, autoCompletePage }) => {
    // TC-027: Single-value auto-complete selection
    await navigationPage.goTo('Widgets', 'Auto Complete');
    
    // Type "Re" into single auto-complete
    await autoCompletePage.singleColorNameInput.type('Re');
    
    // Wait for suggestions and select "Red"
    await expect(autoCompletePage.suggestionsList).toBeVisible();
    await autoCompletePage.redSuggestion.click();
    
    // Verify displayed value becomes "Red"
    await expect(autoCompletePage.singleValue).toHaveText('Red');
  });

  test('Widgets -> Auto Complete - multi auto-complete add/remove tags', async ({ navigationPage, autoCompletePage }) => {
    // TC-028: Multi auto-complete add/remove tags
    await navigationPage.goTo('Widgets', 'Auto Complete');
    
    // Type and add "Blue" to multi field
    await autoCompletePage.multiColorNamesInput.type('Blue');
    await autoCompletePage.blueSuggestion.click();
    
    // Add "Green" 
    await autoCompletePage.multiColorNamesInput.type('Green');
    await autoCompletePage.greenSuggestion.click();
    
    // Verify both tags show
    await expect(autoCompletePage.blueTag).toBeVisible();
    await expect(autoCompletePage.greenTag).toBeVisible();
    
    // Remove "Blue" tag
    await autoCompletePage.blueTagRemove.click();
    
    // Verify only "Green" remains
    await expect(autoCompletePage.blueTag).not.toBeVisible();
    await expect(autoCompletePage.greenTag).toBeVisible();
  });
});

