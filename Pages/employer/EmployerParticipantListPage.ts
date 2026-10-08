import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Podgląd Uczestników — participant list with filters, table and pagination. */
export default class EmployerParticipantListPage extends BasePage {
  readonly heading: Locator;
  readonly firstNameFilter: Locator;
  readonly lastNameFilter: Locator;
  readonly peselFilter: Locator;
  readonly resignationFilter: Locator;
  readonly employedFilter: Locator;
  readonly searchButton: Locator;
  readonly pageSizeSelect: Locator;
  readonly tableSearch: Locator;
  readonly table: Locator;
  readonly paginationStatus: Locator;
  readonly noMatchingRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Podgląd Uczestników' });
    this.firstNameFilter = page.getByRole('textbox', { name: 'Imię' });
    this.lastNameFilter = page.getByRole('textbox', { name: 'Nazwisko' });
    this.peselFilter = page.getByRole('textbox', { name: 'PESEL' });
    this.resignationFilter = page.getByRole('combobox', { name: 'Rezygnacja' });
    this.employedFilter = page.getByRole('combobox', { name: 'Zatrudniony' });
    this.searchButton = page.getByRole('button', { name: 'Wyszukaj' });
    this.pageSizeSelect = page.getByRole('combobox', { name: 'Pokaż pozycji' });
    this.tableSearch = page.getByRole('searchbox', { name: 'Szukaj:' });
    this.table = page.getByRole('table');
    this.paginationStatus = page.locator('#customer-table_info');
    this.noMatchingRows = this.table.getByText('Nie znaleziono pasujących pozycji');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/customer/list`);
  }

  columnHeader(name: string): Locator {
    return this.table.getByRole('columnheader', { name, exact: false });
  }

  bodyRows(): Locator {
    return this.table.locator('tbody > tr:has(td:nth-child(2))');
  }

  firstParticipantRow(): Locator {
    return this.bodyRows().first();
  }

  async openFirstParticipantOrder(): Promise<void> {
    const participantRow = this.firstParticipantRow();
    await participantRow.waitFor({ state: 'visible' });
    await participantRow.getByRole('button', { name: 'Zlecenie' }).click();
  }

  firstParticipantOrderAction(name: string): Locator {
    return this.firstParticipantRow()
      .locator('.dropdown-menu')
      .getByRole('link', { name, exact: true });
  }

  async search(filters: {
    firstName?: string;
    lastName?: string;
    pesel?: string;
    resignation?: '' | 'YES' | 'NO';
    employed?: '' | 'YES' | 'NO';
  }): Promise<void> {
    if (filters.firstName !== undefined) {
      await this.firstNameFilter.fill(filters.firstName);
    }
    if (filters.lastName !== undefined) {
      await this.lastNameFilter.fill(filters.lastName);
    }
    if (filters.pesel !== undefined) {
      await this.peselFilter.fill(filters.pesel);
    }
    if (filters.resignation !== undefined) {
      await this.resignationFilter.selectOption(filters.resignation);
    }
    if (filters.employed !== undefined) {
      await this.employedFilter.selectOption(filters.employed);
    }
    await this.searchButton.click();
    await this.paginationStatus.waitFor({ state: 'visible' });
  }

  async filterByFirstName(value: string): Promise<void> {
    await this.search({ firstName: value });
  }

  sortButton(column: string): Locator {
    return this.table.getByRole('button', { name: new RegExp(`^${column}:`) });
  }
}
