import { mkdir } from 'node:fs/promises';
import { extname, join, parse, resolve } from 'node:path';
import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Pliki zwrotne od Nationale-Nederlanden — returned-file report cards. */
export default class EmployerReturnedFilesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/documentsReport/`);
  }

  reportCard(name: string): Locator {
    return this.page.getByRole('heading', { name, exact: true });
  }

  reportLink(name: string): Locator {
    return this.page.getByRole('link').filter({ has: this.reportCard(name) }).first();
  }

  reportDownload(name: string): Locator {
    return this.page.getByRole('table').getByRole('row').nth(1).getByRole('link').first();
  }

  async downloadReport(name: string): Promise<{
    download: import('@playwright/test').Download;
    filePath: string;
  }> {
    await this.reportLink(name).click();
    const downloadPromise = this.page.waitForEvent('download');
    await this.reportDownload(name).click();
    const download = await downloadPromise;
    const downloadDirectory = resolve(process.cwd(), 'data/doc/download-files');
    await mkdir(downloadDirectory, { recursive: true });
    const suggestedFilename = download.suggestedFilename();
    const parsedFilename = parse(suggestedFilename);
    const fileName = `${parsedFilename.name}-${Date.now()}${extname(suggestedFilename)}`;
    const filePath = join(downloadDirectory, fileName);
    await download.saveAs(filePath);
    return { download, filePath };
  }
}
