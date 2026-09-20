import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

export default class FinancialInstitutionReportsPage extends BasePage {
  readonly heading: Locator;
  readonly reportSelect: Locator;
  readonly fromDate: Locator;
  readonly toDate: Locator;
  readonly generateButton: Locator;
  readonly employerFilter: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Raporty' });
    this.reportSelect = page.getByLabel('Nazwa raportu:');
    this.fromDate = page.getByLabel('Data od:');
    this.toDate = page.getByLabel('Data do:');
    this.generateButton = page.getByRole('button', { name: 'Generuj raport' });
    this.employerFilter = page.locator('#companyName');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/report`);
  }

  async selectReport(name: string): Promise<void> {
    await this.reportSelect.selectOption({ label: name });
  }
}