import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Wspólne logowanie — superlogin linking screen. */
export default class EmployerRelatedUsersPage extends BasePage {
  readonly heading: Locator;
  readonly superloginInfo: Locator;
  readonly relatedUsersTable: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Wspólne logowanie' });
    this.superloginInfo = page.getByText('to Twój Superlogin');
    this.relatedUsersTable = page.locator('#relatedUsers-table');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/relatedUsers`);
  }
}
