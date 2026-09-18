import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Raporty — report generation screen. */
export default class ReportsPage extends BasePage {
  readonly heading: Locator;
  readonly reportSelect: Locator;
  readonly generateButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Raporty' });
    this.reportSelect = page.getByRole('combobox', { name: 'Nazwa raportu:' });
    this.generateButton = page.getByRole('button', { name: 'Generuj raport' });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/report`);
  }

  async selectReport(name: string): Promise<void> {
    await this.reportSelect.selectOption({ label: name });
  }
}
