import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export default class FinancialInstitutionReportsPage extends BasePage {
  readonly heading: Locator;
  readonly reportSelect: Locator;
  readonly generateButton: Locator;
  readonly noEmployerResults: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Raporty' });
    this.reportSelect = page.getByRole('combobox', { name: 'Nazwa raportu:' });
    this.generateButton = page.getByRole('button', { name: 'Generuj raport' });
    this.noEmployerResults = page.getByText('No search results.', { exact: true });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/report`);
  }

  async selectReport(name: string): Promise<void> {
    await this.reportSelect.selectOption({ label: name });
  }

  reportParameter(index: number): Locator {
    return this.page.getByRole('textbox').nth(index);
  }

  async fillDateRange(from: string, to: string): Promise<void> {
    await this.reportParameter(0).fill(from);
    await this.reportParameter(1).fill(to);
  }
}
