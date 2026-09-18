import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Dokumenty — static contract/document download links. */
export default class DocumentsPage extends BasePage {
  readonly heading: Locator;
  readonly managementAgreementLink: Locator;
  readonly conductAgreementLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Dokumenty' });
    this.managementAgreementLink = page.getByRole('link', { name: 'Umowa o zarządzanie PPK' });
    this.conductAgreementLink = page.getByRole('link', { name: 'Umowa o prowadzenie PPK' });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/documents`);
  }

  documentLink(name: string): Locator {
    return this.page.getByRole('link', { name, exact: false });
  }
}
