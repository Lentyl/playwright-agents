import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

export default class FinancialInstitutionConversionPage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Konwersja' });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/exchange`);
  }
}