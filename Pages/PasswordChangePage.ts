import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Zmiana hasła — password change form with policy requirements. */
export default class PasswordChangePage extends BasePage {
  readonly heading: Locator;
  readonly oldPassword: Locator;
  readonly newPassword: Locator;
  readonly repeatPassword: Locator;
  readonly submitButton: Locator;
  readonly backButton: Locator;
  readonly requirementsHeading: Locator;
  readonly invalidFeedback: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zmiana hasła' });
    this.oldPassword = page.getByRole('textbox', { name: 'Stare hasło' });
    this.newPassword = page.getByRole('textbox', { name: 'Nowe hasło' });
    this.repeatPassword = page.getByRole('textbox', { name: 'Powtórz hasło' });
    this.submitButton = page.getByRole('button', { name: 'Zmień hasło' });
    this.backButton = page.getByRole('button', { name: 'Powrót' });
    this.requirementsHeading = page.getByRole('heading', { name: 'Wymagania bezpieczeństwa:' });
    this.invalidFeedback = page.locator('.invalid-feedback:visible');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/passwordChange`);
  }

  async attemptChange(oldPass: string, newPass: string, repeatPass = newPass): Promise<void> {
    await this.oldPassword.fill(oldPass);
    await this.newPassword.fill(newPass);
    await this.repeatPassword.fill(repeatPass);
    await this.submitButton.click();
  }
}
