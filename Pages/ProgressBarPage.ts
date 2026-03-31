import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProgressBarPage extends BasePage {
  readonly startStopButton: Locator;
  readonly resetButton: Locator;
  readonly progressBar: Locator;

  constructor(page: Page) {
    super(page);
    this.startStopButton = page.locator('#startStopButton');
    this.resetButton = page.locator('#resetButton');
    this.progressBar = page.locator('[role="progressbar"]');
  }
}

