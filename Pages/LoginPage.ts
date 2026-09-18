import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Public login screen for the new N-Portal PPK app. */
export default class LoginPage extends BasePage {
  readonly identifier: Locator;
  readonly password: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly logoutMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.identifier = page.getByRole('textbox', { name: 'Identyfikator' });
    this.password = page.getByRole('textbox', { name: 'Hasło' });
    this.submitButton = page.getByRole('button', { name: 'Zaloguj się' });
    this.errorMessage = page.getByText('Nieprawidłowy identyfikator lub hasło');
    this.logoutMessage = page.getByText('Zostałeś prawidłowo wylogowany');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/login`);
  }

  async login(user: string, pass: string): Promise<void> {
    await this.identifier.fill(user);
    await this.password.fill(pass);
    await this.submitButton.click();
  }
}
