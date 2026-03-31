import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class RadioButtonsPage extends BasePage {
  readonly yesRadio: Locator;
  readonly impressiveRadio: Locator;
  readonly noRadio: Locator;
  readonly resultText: Locator;

  constructor(page: Page) {
    super(page);
    this.yesRadio = page.locator('label[for="yesRadio"]');
    this.impressiveRadio = page.locator('label[for="impressiveRadio"]');
    this.noRadio = page.locator('label[for="noRadio"]');
    this.resultText = page.locator('.text-success');
  }
}

