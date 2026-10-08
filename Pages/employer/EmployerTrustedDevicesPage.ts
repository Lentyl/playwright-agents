import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Zaufane urządzenia — trusted devices table. */
export default class EmployerTrustedDevicesPage extends BasePage {
  readonly heading: Locator;
  readonly pageSizeSelect: Locator;
  readonly tableSearch: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly deleteLinks: Locator;
  readonly confirmDeleteLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zaufane urządzenia' });
    this.pageSizeSelect = page.getByRole('combobox', { name: 'Pokaż pozycji' });
    this.tableSearch = page.getByRole('searchbox', { name: 'Szukaj:' });
    this.table = page.getByRole('table');
    this.rows = this.table.locator('tbody tr');
    this.deleteLinks = this.rows.getByRole('link', { name: 'Usuń' });
    this.confirmDeleteLink = page.getByRole('link', { name: 'Usuń urządzenie' });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/trusted-devices`);
  }
}
