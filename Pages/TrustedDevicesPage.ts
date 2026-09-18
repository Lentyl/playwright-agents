import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Zaufane urządzenia — trusted devices table. */
export default class TrustedDevicesPage extends BasePage {
  readonly heading: Locator;
  readonly pageSizeSelect: Locator;
  readonly tableSearch: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zaufane urządzenia' });
    this.pageSizeSelect = page.getByRole('combobox', { name: 'Pokaż pozycji' });
    this.tableSearch = page.getByRole('searchbox', { name: 'Szukaj:' });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/trusted-devices`);
  }
}
