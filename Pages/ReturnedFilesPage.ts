import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Pliki zwrotne od Nationale-Nederlanden — returned-file report cards. */
export default class ReturnedFilesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/documentsReport/`);
  }

  reportCard(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }
}
