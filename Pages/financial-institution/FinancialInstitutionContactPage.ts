import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export default class FinancialInstitutionContactPage extends BasePage {
  readonly heading: Locator;
  readonly name: Locator;
  readonly employerName: Locator;
  readonly subject: Locator;
  readonly email: Locator;
  readonly message: Locator;
  readonly captcha: Locator;
  readonly sendButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 2 }).filter({ hasText: 'Kontakt' });
    const textboxes = page.getByRole('textbox');
    this.name = textboxes.nth(0);
    this.employerName = textboxes.nth(1);
    this.subject = textboxes.nth(2);
    this.email = textboxes.nth(3);
    this.message = page.getByRole('textbox', { name: 'Treść wiadomości' });
    this.captcha = page.locator('iframe[title="reCAPTCHA"]').contentFrame().getByRole('checkbox', { name: 'Nie jestem robotem' });
    this.sendButton = page.getByRole('button', { name: 'Wyślij pytanie' });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/contact`);
  }
}
