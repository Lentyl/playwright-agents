import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export default class FinancialInstitutionDocumentsPage extends BasePage {
  readonly heading: Locator;
  readonly attachments: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Dokumenty' });
    this.attachments = page.locator('a[href*=".pdf" i]');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/documents`);
  }

  attachment(index: number): Locator {
    return this.attachments.nth(index);
  }
}
