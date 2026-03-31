import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LinksPage extends BasePage {
  readonly homeLink: Locator;
  readonly homeInternalLink: Locator;
  readonly createdLink: Locator;
  readonly linkResponse: Locator;

  constructor(page: Page) {
    super(page);
    this.homeLink = page.locator('#simpleLink');
    this.homeInternalLink = page.locator('a[href="https://demoqa.com"]:not([target])');
    this.createdLink = page.locator('#created');
    this.linkResponse = page.locator('#linkResponse');
  }
}

