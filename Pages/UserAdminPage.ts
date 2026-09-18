import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Lista użytkowników — employer admin user table. */
export default class UserAdminPage extends BasePage {
  readonly heading: Locator;
  readonly addUserLink: Locator;
  readonly pageSizeSelect: Locator;
  readonly tableSearch: Locator;
  readonly table: Locator;
  readonly nextPage: Locator;
  readonly previousPage: Locator;
  readonly loginInput: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly permissionGroupSelect: Locator;
  readonly permissionsList: Locator;
  readonly saveUserButton: Locator;
  readonly deleteLink: Locator;
  readonly deleteUserButton: Locator;
  readonly userDeletedMessage: Locator;
  readonly deletionHeading: Locator;
  readonly deletionPrompt: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Lista użytkowników' });
    this.addUserLink = page.getByRole('link', { name: 'Dodaj użytkownika' });
    this.pageSizeSelect = page.getByRole('combobox', { name: 'Pokaż pozycji' });
    this.tableSearch = page.getByRole('searchbox', { name: 'Szukaj:' });
    this.table = page.getByRole('table');
    this.nextPage = page.getByRole('link', { name: 'Next' });
    this.previousPage = page.getByRole('link', { name: 'Previous' });
    this.loginInput = page.getByRole('textbox', { name: 'Login' });
    this.nameInput = page.getByRole('textbox', { name: 'Nazwa użytkownika' });
    this.emailInput = page.getByRole('textbox', { name: 'Adres e-mail' });
    this.phoneInput = page.getByRole('textbox', { name: 'Telefon komórkowy' });
    this.permissionGroupSelect = page.getByLabel('Grupa uprawnień');
    this.permissionsList = page.locator('#editForm');
    this.saveUserButton = page.getByRole('button', { name: 'Zapisz użytkownika' });
    this.deleteLink = page.getByRole('link', { name: 'Usuń' });
    this.deleteUserButton = page.getByRole('link', { name: 'Usuń użytkownika' });
    this.userDeletedMessage = page.getByText('Użytkownik test.user został');
    this.deletionHeading = page.getByRole('heading', { name: 'Usunięcie użytkownika' });
    this.deletionPrompt = page.getByText('Czy na pewno chcesz usunąć uż');
  }

  userCell(name: string): Locator {
    return this.page.getByRole('cell', { name });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/admin`);
  }

  columnHeader(name: string): Locator {
    return this.table.getByRole('columnheader', { name, exact: false });
  }

  bodyRows(): Locator {
    return this.table.locator('tbody tr');
  }

  async search(value: string): Promise<void> {
    await this.tableSearch.fill(value);
  }
}
