import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Dokumenty — static contract/document download links. */
export default class EmployerDocumentsPage extends BasePage {
  readonly heading: Locator;
  readonly managementAgreementLink: Locator;
  readonly conductAgreementLink: Locator;
  readonly documentDownloadLinks: Locator;
  readonly downloadDirectory: string;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Dokumenty' });
    this.managementAgreementLink = page.getByRole('link', { name: 'Umowa o zarządzanie PPK' });
    this.conductAgreementLink = page.getByRole('link', { name: 'Umowa o prowadzenie PPK' });
    this.documentDownloadLinks = page.locator(
      'a[href*="/documents/contract/download/"], a[href$=".pdf"], a[href$=".zip"]',
    );
    this.downloadDirectory = resolve(process.cwd(), 'data/doc/download-files/dock-view-tc');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/documents`);
  }

  documentLink(name: string): Locator {
    return this.page.getByRole('link', { name, exact: false }).first();
  }

  async getDocumentLinkData(): Promise<Array<{ href: string; text: string }>> {
    return this.documentDownloadLinks.evaluateAll((links) =>
      links.map((link) => ({ href: link.getAttribute('href') ?? '', text: link.textContent?.trim() ?? '' })),
    );
  }

  documentLinkByHref(href: string): Locator {
    return this.page.locator(`a[href="${href.replace(/"/g, '\\"')}"]`).first();
  }

  async downloadDocument(documentLink: Locator, fileName: string): Promise<string> {
    const href = await documentLink.getAttribute('href');
    if (!href) {
      throw new Error('Document link has no href');
    }

    const downloadPromise = this.page.waitForEvent('download', { timeout: 5000 }).catch(() => undefined);
    const popupPromise = this.page.waitForEvent('popup', { timeout: 5000 }).catch(() => undefined);
    await documentLink.dispatchEvent('click');
    const result = await Promise.race([
      downloadPromise.then((download) => ({ download })),
      popupPromise.then((popup) => ({ popup })),
    ]);

    await mkdir(this.downloadDirectory, { recursive: true });
    const filePath = join(this.downloadDirectory, fileName);
    if ('download' in result && result.download) {
      await result.download.saveAs(filePath);
    } else {
      const requestUrl = 'popup' in result && result.popup ? result.popup.url() : new URL(href, this.page.url()).toString();
      let response;
      try {
        response = await this.page.request.get(requestUrl, { timeout: 10000 });
      } catch (error) {
        throw new Error(`Document request timed out for ${requestUrl}: ${String(error)}`);
      }
      if (!response.ok()) {
        throw new Error(`Document request failed with status ${response.status()}`);
      }
      const responseBody = await response.body();
      await writeFile(filePath, responseBody);
      if ('popup' in result && result.popup) {
        await result.popup.close();
      }
    }
    return filePath;
  }

  async clearDownloadedDocuments(): Promise<void> {
    await rm(this.downloadDirectory, { recursive: true, force: true });
    await mkdir(this.downloadDirectory, { recursive: true });
  }
}
