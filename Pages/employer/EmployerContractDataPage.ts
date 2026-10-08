import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Dane dotyczące umowy i wpłat do PPK — read-only contract data. */
export default class EmployerContractDataPage extends BasePage {
  readonly heading: Locator;
  readonly generalDataSection: Locator;
  readonly employerNameLabel: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Dane dotyczące umowy i wpłat do PPK' });
    this.generalDataSection = page.getByRole('heading', { level: 3, name: 'Dane ogólne' });
    this.employerNameLabel = page.getByText('Nazwa podmiotu zatrudniającego');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/data`);
  }
}
