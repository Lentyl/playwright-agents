import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SliderPage extends BasePage {
  readonly sliderHandle: Locator;
  readonly sliderValue: Locator;
  readonly sliderTrack: Locator;

  constructor(page: Page) {
    super(page);
    this.sliderHandle = page.locator('.range-slider__wrap input[type="range"]');
    this.sliderValue = page.locator('#sliderValue');
    this.sliderTrack = page.locator('.range-slider');
  }

  /** Set slider to a percentage value (0-100) by updating the range input and dispatching events */
  async setToPercentage(percent: number) {
    await this.sliderHandle.focus();
    await this.sliderHandle.evaluate((el, p) => {
      const input = el as HTMLInputElement;
      const min = parseFloat(input.min || '0');
      const max = parseFloat(input.max || '100');
      const value = Math.round(min + ((max - min) * (p / 100)));
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, percent);
    // small pause to let UI update
    await this.page.waitForTimeout(80);
  }

  /** Increment slider via keyboard ArrowRight presses */
  async incrementByKeys(times: number) {
    await this.sliderHandle.focus();
    for (let i = 0; i < times; i++) {
      await this.page.keyboard.press('ArrowRight');
      await this.page.waitForTimeout(40);
    }
  }
}

