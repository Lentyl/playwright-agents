import { test, expect } from '../fixtures/fixtures';

test.describe('Elements -> Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Elements -> Buttons - double, right and single click button behaviors', async ({ navigationPage, buttonsPage }) => {
    // TC-006: Double, right and single click button behaviors
    await navigationPage.goTo('Elements', 'Buttons');
    
    // Perform double-click on double-click button
    await (await buttonsPage.buttonDynamic('Double Click Me')).dblclick();
    await expect(await buttonsPage.textDynamic('You have done a double click')).toBeVisible();
    
    // Perform right-click on right-click button
    await (await buttonsPage.buttonDynamic('Right Click Me')).click({ button: 'right' });
    await expect(await buttonsPage.textDynamic('You have done a right click')).toBeVisible();
    
    // Single-click on dynamic click button
    await (await buttonsPage.buttonDynamic('Click Me')).click();
    await expect(await buttonsPage.textDynamic('You have done a dynamic click')).toBeVisible();
  });
});
