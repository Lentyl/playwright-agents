import { test, expect } from '../fixtures/fixtures';

test.describe('Widgets -> Slider', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Widgets -> Slider - drag slider to value by offset', async ({ navigationPage, sliderPage, page }) => {
    // TC-029: Drag slider to value by offset
    await navigationPage.goTo('Widgets', 'Slider');
    
    // Get slider bounds for calculation
    const sliderBounds = await sliderPage.sliderHandle.boundingBox();
    const sliderTrack = await sliderPage.sliderTrack.boundingBox();
    
    if (sliderBounds && sliderTrack) {
      // Calculate 75% and delegate to page helper
      await sliderPage.setToPercentage(75);
      // Verify slider value displays ~75 (within tolerance)
      const sliderValue = await sliderPage.sliderValue.textContent();
      const currentValue = parseInt(sliderValue || '0');
      expect(currentValue).toBeGreaterThan(70);
      expect(currentValue).toBeLessThan(80);
    }
  });

  test('Widgets -> Slider - adjust slider with keyboard', async ({ navigationPage, sliderPage, page }) => {
    // TC-030: Adjust slider with keyboard
    await navigationPage.goTo('Widgets', 'Slider');
    
    // Get initial value
    const initialValue = parseInt(await sliderPage.sliderValue.textContent() || '0');
    
    // Use page helper to increment slider via keyboard
    await sliderPage.incrementByKeys(5);
    // Verify slider value increased by expected increments
    const finalValue = parseInt(await sliderPage.sliderValue.textContent() || '0');
    expect(finalValue).toBeGreaterThan(initialValue);
  });
});

