import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

export default class FinancialInstitutionTerminationPage extends BasePage {
  readonly heading: Locator;
  readonly employerNameFilter: Locator;
  readonly krsFilter: Locator;
  readonly regonFilter: Locator;
  readonly nipFilter: Locator;
  readonly searchButton: Locator;
  readonly table: Locator;
  readonly validationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Wypowiedzenie UoZ' });
    this.employerNameFilter = page.getByRole('textbox', { name: 'Nazwa Pracodawcy' });
    this.krsFilter = page.getByRole('spinbutton', { name: 'KRS' });
    this.regonFilter = page.getByRole('spinbutton', { name: 'REGON' });
    this.nipFilter = page.getByRole('spinbutton', { name: 'NIP' });
    this.searchButton = page.getByRole('button', { name: 'Wyszukaj' });
    this.table = page.locator('#employer-table');
    this.validationMessage = page.getByText('Proszę wprowadzić dane pracodawcy', { exact: true });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/contract/termination/search`);
  }

  rows(): Locator {
    return this.table.locator('tbody > tr');
  }

  sortButton(columnIndex: number): Locator {
    return this.table.locator(`thead th:nth-child(${columnIndex}) .dt-column-order`);
  }

  columnHeader(name: string): Locator {
    return this.table.getByRole('columnheader', { name, exact: false });
  }

  async search(): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/manager/contract/termination/search') &&
        response.status() === 200,
      ),
      this.searchButton.click(),
    ]);
  }
}