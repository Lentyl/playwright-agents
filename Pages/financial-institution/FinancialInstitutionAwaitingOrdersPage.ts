import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export default class FinancialInstitutionAwaitingOrdersPage extends BasePage {
  readonly heading: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly tableSearch: Locator;
  readonly actionButtons: Locator;
  readonly documentLinks: Locator;
  readonly confirmationLinks: Locator;
  readonly noteControls: Locator;
  readonly documentsDialog: Locator;
  readonly noteDialog: Locator;
  readonly noteInput: Locator;
  readonly saveNoteButton: Locator;
  readonly uploadInput: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zlecenia do akceptacji' });
    this.table = page.getByRole('table');
    this.rows = this.table.locator('tbody tr');
    this.tableSearch = page.getByRole('searchbox', { name: 'Szukaj:' });
    this.actionButtons = this.rows.getByRole('button', { name: 'Zmiana' });
    this.documentLinks = this.rows.locator('td:nth-child(8) a');
    this.confirmationLinks = this.rows.locator('td:nth-child(9) a');
    this.noteControls = this.rows.locator('td:nth-child(10) > *');
    this.documentsDialog = page.getByRole('dialog', { name: /Lista dokumentów/ });
    this.noteDialog = page.getByRole('dialog', { name: /Notatka/ });
    this.noteInput = this.noteDialog.getByRole('textbox', { name: 'Treść' });
    this.saveNoteButton = this.noteDialog.getByRole('button', { name: 'Zapisz' });
    this.uploadInput = this.documentsDialog.locator('input[type="file"]');
  }

  async open(status: 'awaiting' | 'accepted' | 'canceled' = 'awaiting'): Promise<void> {
    await this.goto(`${APP_PATH}/manager/reqtrade/list/${status}`);
  }

  statusTab(name: 'Oczekujące' | 'Zaakceptowane' | 'Odrzucone'): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  confirmationDownload(index = 0): Locator {
    return this.confirmationLinks.nth(index);
  }

  async openFirstActionMenu(): Promise<void> {
    await this.actionButtons.first().click();
  }

  action(name: 'Akceptuj' | 'Odrzuć' | 'Wyjaśnij'): Locator {
    return this.page.getByRole('link', { name: new RegExp(name) });
  }

  async openFirstDocumentsDialog(): Promise<void> {
    await this.documentLinks.first().click();
  }

  async openFirstNoteDialog(): Promise<void> {
    await this.rows.first().locator('td').nth(9).click();
  }

  async waitForResults(): Promise<void> {
    await this.heading.waitFor({ state: 'visible' });
    await this.table.waitFor({ state: 'visible' });
  }
}
