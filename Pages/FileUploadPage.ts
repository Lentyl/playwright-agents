import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

/** Przekazanie plików — file upload and history table. */
export default class FileUploadPage extends BasePage {
  readonly heading: Locator;
  readonly historyHeading: Locator;
  readonly fileNameFilter: Locator;
  readonly searchButton: Locator;
  readonly table: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Przekazanie plików' });
    this.historyHeading = page.getByRole('heading', { level: 3, name: 'Historia przesłanych plików' });
    this.fileNameFilter = page.getByRole('textbox', { name: 'Nazwa pliku' });
    this.searchButton = page.getByRole('button', { name: 'Wyszukaj' });
    this.table = page.getByRole('table');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/fileUpload`);
  }

  columnHeader(name: string): Locator {
    return this.table.getByRole('columnheader', { name, exact: false });
  }
}
