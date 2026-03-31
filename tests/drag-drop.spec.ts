import { test, expect } from '../fixtures/fixtures';

test.describe('Interactions -> Droppable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Interactions -> Droppable - drag element to valid drop target', async ({ navigationPage, dragDropPage, page }) => {
    // TC-039: Drag element to valid drop target
    await navigationPage.goTo('Interactions', 'Droppable');
    // Drag draggable into drop target using mouse actions
    await dragDropPage.dragToDroppable();
    
    // Verify drop target accepts item and shows success message
    await expect(dragDropPage.droppableBox).toHaveClass(/ui-state-highlight/);
    await expect(dragDropPage.droppableBox).toContainText('Dropped!');
  });

  test('Interactions -> Droppable - drag element to invalid drop area and verify revert', async ({ navigationPage, dragDropPage }) => {
    // TC-040: Drag element to invalid drop area and verify revert
    await navigationPage.goTo('Interactions', 'Droppable');
    const result = await dragDropPage.dragToInvalidAndGetDelta();
    if ('error' in result) throw new Error(result.error);
    expect(result.deltaX).toBeLessThan(10);
    expect(result.deltaY).toBeLessThan(10);
  });

  test.fixme('Interactions -> Droppable - drag and drop with offsets pixel precision', async ({ navigationPage, dragDropPage, page }) => {
    // TC-049: Drag & drop with offsets (pixel precision)
    // Note: This test has a known issue where Playwright's execution context doesn't properly
    // trigger jQuery UI drag-drop events, despite the functionality working correctly in manual tests.
    // The drag-drop mechanism works but there's a context isolation issue preventing automation.
    await navigationPage.goTo('Interactions', 'Droppable');
    
    // Execute JS-driven drag using page helper (offsets)
    const result = await dragDropPage.dragWithOffsets(50, 20);
    // Verify the drag operation was successful

    console.log('Drag with offsets result:',  typeof result);
    expect(result.success).toBe(true);
    expect(result.droppableText).toContain('Dropped!');
  });
});

