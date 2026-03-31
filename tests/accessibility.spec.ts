import { test, expect } from '../fixtures/fixtures';

test.describe('Cross-cutting -> Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Cross-cutting -> Accessibility - focus states on interactive elements visual', async ({ navigationPage, practiceFormPage, page }) => {
    // TC-044: Focus states on interactive elements (visual)
    await navigationPage.goTo('Forms', 'Practice Form');
    
    // Focus the first input then use PracticeFormPage helpers to inspect focus state
    await practiceFormPage.firstNameInput.focus();

    // Check first input has focus
    let focusedElement = await practiceFormPage.tabN(0);
    await expect(focusedElement).toBeVisible();

    // Verify focus indicator present (should have outline or focus styling)
    const focusedStyles = await practiceFormPage.getFocusedElementStyles();
    const hasFocusIndicator = !!focusedStyles && (
      focusedStyles.outline !== 'none' ||
      focusedStyles.outlineWidth !== '0px' ||
      focusedStyles.boxShadow !== 'none' ||
      (typeof focusedStyles.border === 'string' && (focusedStyles.border.includes('blue') || focusedStyles.border.includes('rgb')))
    );
    expect(hasFocusIndicator).toBeTruthy();

    // Continue through several more interactive elements using tab helper
    for (let i = 0; i < 5; i++) {
      focusedElement = await practiceFormPage.tabN(1);
      await expect(focusedElement).toBeVisible();
    }
  });
});

