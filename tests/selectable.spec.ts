import { test, expect } from '../fixtures/fixtures';

test.describe('Widgets -> Selectable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Widgets -> Selectable - select single item in selectable list', async ({ navigationPage, selectablePage, page }) => {
    // TC-031: Select single item in selectable list
    await navigationPage.goTo('Interactions', 'Selectable');
    
    // Select item 2 via Page helper
    await selectablePage.selectListItem(1);
    
    // Verify item 2 receives active class and others unselected
    await expect(selectablePage.listItem2).toHaveClass(/active/);
    await expect(selectablePage.listItem1).not.toHaveClass(/active/);
    await expect(selectablePage.listItem3).not.toHaveClass(/active/);
    await expect(selectablePage.listItem4).not.toHaveClass(/active/);
  });

  test('Widgets -> Selectable - select multiple items in grid mode', async ({ navigationPage, selectablePage, page }) => {
    // TC-032: Select multiple items in grid mode
    await navigationPage.goTo('Interactions', 'Selectable');
    
    // Switch to grid mode and perform a range select using the Page helper
    await selectablePage.gridTab.click();
    await selectablePage.selectGridRange(0, 3);
    
    // Verify items A through D show selected states
    await expect(selectablePage.gridItemA).toHaveClass(/active/);
    await expect(selectablePage.gridItemB).toHaveClass(/active/);
    await expect(selectablePage.gridItemC).toHaveClass(/active/);
    await expect(selectablePage.gridItemD).toHaveClass(/active/);
  });
});

