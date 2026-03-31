import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TabsPage extends BasePage {
  readonly whatTab: Locator;
  readonly originTab: Locator;
  readonly useTab: Locator;
  readonly tabContent: Locator;

  constructor(page: Page) {
    super(page);
    this.whatTab = page.locator('#demo-tab-what');
    this.originTab = page.locator('#demo-tab-origin');
    this.useTab = page.locator('#demo-tab-use');
    this.tabContent = page.locator('.tab-content');
  }
}

