import { Page, Locator } from '@playwright/test';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import BasePage, { APP_PATH } from '../BasePage';

type FileReplacement = {
  search: string;
  replace: string;
};

/** Przekazanie plików — file upload and history table. */
export default class EmployerFileUploadPage extends BasePage {
  readonly heading: Locator;
  readonly historyHeading: Locator;
  readonly fileInput: Locator;
  readonly uploadButton: Locator;
  readonly fileNameFilter: Locator;
  readonly dateFromFilter: Locator;
  readonly dateToFilter: Locator;
  readonly searchButton: Locator;
  readonly table: Locator;
  readonly noMatchingRows: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Przekazanie plików' });
    this.historyHeading = page.getByRole('heading', { level: 3, name: 'Historia przesłanych plików' });
    this.fileInput = page.locator('input[type="file"]');
    this.uploadButton = page.getByRole('button', { name: 'Prześlij plik' });
    this.fileNameFilter = page.getByRole('textbox', { name: 'Nazwa pliku' });
    this.dateFromFilter = page.getByRole('textbox', { name: 'Data przesłania pliku OD (RRRR-MM-DD)' });
    this.dateToFilter = page.getByRole('textbox', { name: 'Data przesłania pliku DO (RRRR-MM-DD)' });
    this.searchButton = page.getByRole('button', { name: 'Wyszukaj' });
    this.table = page.getByRole('table');
    this.noMatchingRows = this.table.getByText('Nie znaleziono pasujących pozycji');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/fileUpload`);
  }

  columnHeader(name: string): Locator {
    return this.table.getByRole('columnheader', { name, exact: false });
  }

  async searchHistory(filters: { fileName?: string; dateFrom?: string; dateTo?: string }): Promise<void> {
    if (filters.fileName !== undefined) await this.fileNameFilter.fill(filters.fileName);
    if (filters.dateFrom !== undefined) await this.dateFromFilter.fill(filters.dateFrom);
    if (filters.dateTo !== undefined) await this.dateToFilter.fill(filters.dateTo);
    await this.searchButton.click();
  }

  async uploadFile(filePath: string): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
    await Promise.all([
      this.page.waitForResponse((response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/employer/fileUpload') &&
        response.status() < 500,
      ),
      this.uploadButton.click(),
    ]);
  }

  async downloadFileContent(fileName: string): Promise<string> {
    await this.confirmUploadNoticeIfVisible();
    const fileLink = this.uploadedFileRow(fileName).locator('a').first();
    await fileLink.waitFor({ state: 'visible' });
    const downloadPromise = this.page.waitForEvent('download');
    await fileLink.click();
    const download = await downloadPromise;
    const downloadPath = await download.path();

    if (!downloadPath) {
      throw new Error(`Downloaded file has no accessible path: ${fileName}`);
    }

    return readFile(downloadPath, 'utf8');
  }

  async confirmUploadNoticeIfVisible(): Promise<void> {
    const confirmationButton = this.page
      .getByRole('dialog')
      .getByRole('button', { name: 'Potwierdzam' });

    if (await confirmationButton.isVisible().catch(() => false)) {
      await confirmationButton.click();
    }
  }

  async deleteUploadedFile(fileName: string): Promise<void> {
    const fileRow = this.uploadedFileRow(fileName);
    const deleteLink = fileRow.getByRole('link', { name: 'Usuń', exact: true });
    await deleteLink.click();
    await this.page
      .locator('#removeFileModal')
      .getByRole('link', { name: 'Usuń plik', exact: true })
      .click();
    await this.page.reload();
    await fileRow.waitFor({ state: 'hidden' });
  }

  async updateFileContent(filePath: string, replacements: FileReplacement[]): Promise<string> {
    const absolutePath = this.absolutePath(filePath);
    let content = await readFile(absolutePath, 'utf8');

    for (const replacement of replacements) {
      if (!content.includes(replacement.search)) {
        throw new Error(`Text not found in upload file: ${replacement.search}`);
      }
      content = content.replace(replacement.search, replacement.replace);
    }

    await writeFile(absolutePath, content, 'utf8');
    return absolutePath;
  }

  async renameAndPlaceFile(filePath: string, destinationDirectory: string, fileName: string): Promise<string> {
    const sourcePath = this.absolutePath(filePath);
    const destinationPath = join(this.absolutePath(destinationDirectory), fileName);
    await mkdir(dirname(destinationPath), { recursive: true });
    await copyFile(sourcePath, destinationPath);
    return destinationPath;
  }

  async prepareFileForUpload(options: {
    sourcePath: string;
    destinationDirectory: string;
    fileName: string;
    replacements?: FileReplacement[];
  }): Promise<string> {
    const preparedPath = await this.renameAndPlaceFile(
      options.sourcePath,
      options.destinationDirectory,
      options.fileName,
    );

    if (options.replacements?.length) {
      await this.updateFileContent(preparedPath, options.replacements);
    }

    return preparedPath;
  }

  uploadedFileRow(fileName: string): Locator {
    return this.table.locator('tbody tr').filter({ hasText: fileName });
  }

  xmlFileLinks(): Locator {
    return this.table.locator('tbody tr a').filter({ hasText: /\.xml$/i });
  }

  private absolutePath(filePath: string): string {
    return isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
  }
}
