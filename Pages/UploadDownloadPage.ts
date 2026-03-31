import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class UploadDownloadPage extends BasePage {
  readonly downloadButton: Locator;
  readonly chooseFileInput: Locator;
  readonly uploadedFilePath: Locator;

  constructor(page: Page) {
    super(page);
    this.downloadButton = page.locator('#downloadButton');
    this.chooseFileInput = page.locator('#uploadFile');
    this.uploadedFilePath = page.locator('#uploadedFilePath');
  }

  /** Clicks download and waits for a browser download to start */
  async downloadAndWait() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadButton.click()
    ]);
    return download;
  }

  /** Upload a file and return whether it appears in the UI (handles errors) */
  async uploadFile(filePath: string) {
    try {
      await this.chooseFileInput.setInputFiles(filePath);
      const text = await this.uploadedFilePath.textContent();
      return { accepted: !!text, text };
    } catch (error) {
      return { accepted: false, error };
    }
  }
}

