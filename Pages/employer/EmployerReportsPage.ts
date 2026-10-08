import { mkdir } from 'node:fs/promises';
import { extname, join, parse, resolve } from 'node:path';
import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Raporty — report generation screen. */
export default class EmployerReportsPage extends BasePage {
  readonly heading: Locator;
  readonly reportSelect: Locator;
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly generateButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Raporty' });
    this.reportSelect = page.getByRole('combobox', { name: 'Nazwa raportu:' });
    this.dateFromInput = page.getByRole('textbox').nth(0);
    this.dateToInput = page.getByRole('textbox').nth(1);
    this.generateButton = page.getByRole('button', { name: 'Generuj raport' });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/report`);
  }

  async selectReport(name: string): Promise<void> {
    await this.reportSelect.selectOption({ label: name });
  }

  async setDateRange(dateFrom: string, dateTo: string): Promise<void> {
    await this.dateFromInput.waitFor({ state: 'visible' });
    await this.dateFromInput.fill(dateFrom);
    await this.dateFromInput.press('Tab');
    await this.dateToInput.fill(dateTo);
    await this.dateToInput.press('Tab');
    await this.dateToInput.press('Escape');
  }

  async generateReport(): Promise<import('@playwright/test').Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.generateButton.click();
    return downloadPromise;
  }

  async generateReportToFile(): Promise<{
    download: import('@playwright/test').Download;
    filePath: string;
  }> {
    const download = await this.generateReport();
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
