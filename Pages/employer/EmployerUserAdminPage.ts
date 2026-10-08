import { expect, Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Lista użytkowników — employer admin user table. */
export default class EmployerUserAdminPage extends BasePage {
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
  readonly unlockHeading: Locator;
  readonly unlockUserButton: Locator;
  readonly userUnlockedMessage: Locator;

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
    this.unlockHeading = page.getByRole('heading', { name: /odblokowanie użytkownika/i });
    this.unlockUserButton = page.getByRole('button', { name: 'Odblokuj użytkownika' });
    this.userUnlockedMessage = page.getByText(/użytkownik .* został odblokowany/i);
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

  async fillUserForm(user: {
    login: string;
    name: string;
    email: string;
    phone: string;
    permissionGroup: string;
    contributionList: string;
  }): Promise<void> {
    await this.loginInput.fill(user.login);
    await this.nameInput.fill(user.name);
    await this.emailInput.fill(user.email);
    await this.phoneInput.fill(user.phone);
    await this.page.getByText(user.permissionGroup, { exact: true }).click();
    await this.page.getByText(user.contributionList, { exact: false }).click();
  }

  async createUser(user: {
    login: string;
    name: string;
    email: string;
    phone: string;
    permissionGroup: string;
    contributionList: string;
  }): Promise<void> {
    await this.addUserLink.click();
    await this.fillUserForm(user);
    await this.saveUserButton.click();
  }

  userRow(login: string): Locator {
    return this.table.locator('tbody tr').filter({ hasText: login }).first();
  }

  async editUser(login: string, name: string): Promise<void> {
    await this.search(login);
    await this.userRow(login).getByRole('link', { name: 'Edytuj' }).click();
    await this.nameInput.fill(name);
    await this.saveUserButton.click();
  }

  async requestPasswordChange(login: string): Promise<void> {
    await this.search(login);
    await this.userRow(login).getByRole('link', { name: 'Zmień hasło' }).click();
  }

  async deleteUser(login: string): Promise<void> {
    await this.search(login);
    await this.userRow(login).getByRole('link', { name: 'Usuń' }).click();
    await expect(this.deletionHeading).toBeVisible();
    await this.deleteUserButton.click();
  }

  async unlockFirstBlockedUser(): Promise<void> {
    const blockedUserRow = this.table
      .locator('tbody tr')
      .filter({ has: this.page.locator('td').nth(4).getByText('\uF00D') })
      .first();
    await blockedUserRow.getByRole('link', { name: 'Odblokuj dostęp' }).click();
    await expect(this.unlockHeading).toBeVisible();
    await this.unlockUserButton.click();
  }
}
