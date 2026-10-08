import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Participant list available to the Financial Institution role. */
export default class FinancialInstitutionParticipantListPage extends BasePage {
  readonly heading: Locator;
  readonly globalSearch: Locator;
  readonly moreFiltersButton: Locator;
  readonly firstNameFilter: Locator;
  readonly lastNameFilter: Locator;
  readonly emailFilter: Locator;
  readonly peselFilter: Locator;
  readonly searchButton: Locator;
  readonly pageSizeSelect: Locator;
  readonly tableSearch: Locator;
  readonly table: Locator;
  readonly paginationStatus: Locator;
  readonly noMatchingRows: Locator;
  readonly loadingRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Podgląd Uczestników' });
    this.globalSearch = page.getByRole('textbox', { name: 'Wyszukiwanie Uczestników' });
    this.moreFiltersButton = page.getByRole('button', { name: 'Więcej' });
    this.firstNameFilter = page.getByRole('textbox', { name: 'Imię' });
    this.lastNameFilter = page.getByRole('textbox', { name: 'Nazwisko' });
    this.emailFilter = page.getByRole('textbox', { name: 'Email' });
    this.peselFilter = page.getByRole('textbox', { name: 'PESEL' });
    this.searchButton = page.getByRole('button', { name: 'Wyszukaj' });
    this.pageSizeSelect = page.getByRole('combobox', { name: 'Pokaż pozycji' });
    this.tableSearch = page.getByRole('searchbox', { name: 'Szukaj:' });
    this.table = page.getByRole('table');
    this.paginationStatus = page.locator('#customer-table_info');
    this.noMatchingRows = this.table.getByText('Nie znaleziono pasujących pozycji');
    this.loadingRows = this.table.getByText('Wczytywanie...');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/customer/list`);
  }

  async showMoreFilters(): Promise<void> {
    if (await this.moreFiltersButton.getAttribute('aria-expanded') !== 'true') {
      await this.moreFiltersButton.click();
    }
  }

  async fillFilters(filters: {
    firstName?: string;
    lastName?: string;
    email?: string;
    pesel?: string;
  }): Promise<void> {
    await this.showMoreFilters();

    if (filters.firstName !== undefined) await this.firstNameFilter.fill(filters.firstName);
    if (filters.lastName !== undefined) await this.lastNameFilter.fill(filters.lastName);
    if (filters.email !== undefined) await this.emailFilter.fill(filters.email);
    if (filters.pesel !== undefined) await this.peselFilter.fill(filters.pesel);
  }

  async emailValidationMessage(): Promise<string> {
    return this.emailFilter.evaluate((input: HTMLInputElement) => input.validationMessage);
  }

  async search(filters: {
    firstName?: string;
    lastName?: string;
    email?: string;
    pesel?: string;
  }): Promise<void> {
    await this.fillFilters(filters);

    await Promise.all([
      this.page.waitForResponse((response) =>
        response.request().method() === 'POST' &&
        response.url().endsWith('/manager/customer/list') &&
        response.status() === 200,
      ),
      this.searchButton.click(),
    ]);
  }

  bodyRows(): Locator {
    return this.table.locator('tbody > tr:has(td:nth-child(2))');
  }

  async columnValues(columnIndex: number): Promise<string[]> {
    return this.bodyRows().locator(`td:nth-child(${columnIndex})`).allTextContents();
  }

  participantCell(columnIndex: number): Locator {
    return this.bodyRows().first().locator(`td:nth-child(${columnIndex})`);
  }

  columnHeader(name: string): Locator {
    return this.table.getByRole('columnheader', { name, exact: false });
  }

  sortButton(column: string): Locator {
    return this.table.getByRole('button', { name: new RegExp(`^${column}:`) });
  }
}