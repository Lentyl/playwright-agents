import { test, expect } from '../fixtures/fixtures';

test.describe('Widgets -> Sortable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

    test('Widgets -> Sortable - reorder sortable list', async ({ navigationPage, sortablePage, page }) => {
    // TC-033: Reorder sortable list
    await navigationPage.goTo('Interactions', 'Sortable');
    
    // Wait for list items to be visible and get initial order
    await expect(sortablePage.listItems.first()).toBeVisible();
    const initialOrder = await sortablePage.listItems.allTextContents();
    const firstItemText = initialOrder[0] ?? 'One';
    
    // Drag using page method that encapsulates fallbacks
    const newOrder = await sortablePage.dragListItemTo('One', 'Four');

    // Verify order reflects new position
    expect(newOrder).not.toEqual(initialOrder);
    expect(newOrder[3]).toBe(firstItemText); // First item moved to 4th position
  });

  test('Widgets -> Sortable - reorder sortable grid', async ({ navigationPage, sortablePage, page }) => {
    // TC-034: Reorder sortable grid
    await navigationPage.goTo('Interactions', 'Sortable');
    
    // Switch to grid mode
    await sortablePage.gridTab.click();
    
    // Get initial grid arrangement
    const initialOrder = await sortablePage.gridItems.allTextContents();

    // Delegate robust grid reordering to the page object (handles fallbacks)
    const newOrder = await sortablePage.dragGridItemIndex(0, 5);

    // Verify grid reorders producing new arrangement
    expect(newOrder).not.toEqual(initialOrder);
  });
});


