import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate from home page to a specific card and optionally a left-nav item
   * @param cardName - The card name on the home page (e.g., 'Elements', 'Forms')
   * @param itemName - Optional left-nav item name (e.g., 'Text Box', 'Web Tables')
   */
  async goTo(cardName: string, itemName?: string) {
    // Click on the card
    const card = this.page.locator('.card-body').filter({ hasText: cardName });
    await card.click();

    // If itemName is provided, click on the left-nav item
    if (itemName) {
      // Use more specific selector to avoid partial matches
      const navItem = this.page.locator('.left-pannel .menu-list li').filter({ hasText: new RegExp(`^${itemName}$`) });
      await navItem.click();
    }
  }

  /** Scroll the page vertically using mouse wheel */
  async scrollBy(deltaY: number) {
    await this.page.mouse.wheel(0, deltaY);
    // small pause to let layout settle
    await this.page.waitForTimeout(120);
  }
}

