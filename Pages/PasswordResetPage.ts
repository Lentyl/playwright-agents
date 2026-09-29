import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Public password-reminder form. Submission requires a CAPTCHA and is not automated against shared accounts. */
export default class PasswordResetPage extends BasePage {
  readonly heading: Locator;
  readonly identifier: Locator;
  readonly phone: Locator;
  readonly resetButton: Locator;
  readonly requiredFieldsMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 2, name: 'Przypomnienie hasła' });
    this.identifier = page.getByRole('textbox').first();
    this.phone = page.getByRole('textbox').nth(1);
    this.resetButton = page.getByRole('button', { name: 'Resetuj hasło' });
    this.requiredFieldsMessage = page.getByText('* Pole wymagane');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/passwordReset`);
  }
}