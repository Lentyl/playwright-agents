import { test, expect } from '../fixtures/fixtures';

test.describe('Widgets -> Resizable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Widgets -> Resizable - resize element within constraints', async ({ navigationPage, resizablePage, page }) => {
    // TC-035: Resize element within constraints
    await navigationPage.goTo('Interactions', 'Resizable');
    
    // Get initial size
    const initialBox = await resizablePage.resizableBox.boundingBox();
    
    // Calculate absolute target coordinates (within allowed area)
    if (initialBox) {
      const targetX = initialBox.x + 300;
      const targetY = initialBox.y + 200;
      // Perform robust resize via Page helper
      await resizablePage.resizeTo(targetX, targetY);
    }
    
    // Get new size
    const newBox = await resizablePage.resizableBox.boundingBox();
    
    // Verify element size updated and does not exceed max constraints
    if (initialBox && newBox) {
      expect(newBox.width).toBeGreaterThan(initialBox.width);
      expect(newBox.height).toBeGreaterThan(initialBox.height);
      expect(newBox.width).toBeLessThanOrEqual(500); // Max constraint
      expect(newBox.height).toBeLessThanOrEqual(300); // Max constraint
    }
  });

  test('Widgets -> Resizable - attempt to resize below minimum', async ({ navigationPage, resizablePage, page }) => {
    // TC-036: Attempt to resize below minimum
    await navigationPage.goTo('Interactions', 'Resizable');
    
    // Determine a shrink target and perform resize via Page helper
    const box = await resizablePage.resizableBox.boundingBox();
    if (box) {
      const shrinkX = box.x + 50;
      const shrinkY = box.y + 50;
      await resizablePage.resizeTo(shrinkX, shrinkY);
    }
    
    // Get final size
    const finalBox = await resizablePage.resizableBox.boundingBox();
    
    // Verify size stops at minimum constraint
    if (finalBox) {
      expect(finalBox.width).toBeGreaterThanOrEqual(150); // Min constraint
      expect(finalBox.height).toBeGreaterThanOrEqual(150); // Min constraint
    }
    
    // Verify UI remains stable
    await expect(resizablePage.resizableBox).toBeVisible();
  });
});


