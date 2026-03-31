import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BrowserWindowsPage extends BasePage {
  readonly tabButton: Locator;

  constructor(page: Page) {
    super(page);
    this.tabButton = page.locator('#tabButton');
  }
}

