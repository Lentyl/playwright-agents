import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export default class FinancialInstitutionEmployerPreviewPage extends BasePage {
  readonly heading: Locator;
  readonly employerNameFilter: Locator;
  readonly krsFilter: Locator;
  readonly regonFilter: Locator;
  readonly nipFilter: Locator;
  readonly searchButton: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly paginationStatus: Locator;
  readonly processingIndicator: Locator;
  readonly dispositionsCardHeading: Locator;
  readonly permissionsCardHeading: Locator;
  readonly dispositionsLink: Locator;
  readonly permissionsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Podgląd Pracodawców' });
    this.employerNameFilter = page.getByRole('textbox', { name: 'Nazwa Pracodawcy' });
    this.krsFilter = page.getByRole('spinbutton', { name: 'KRS' });
    this.regonFilter = page.getByRole('spinbutton', { name: 'REGON' });
    this.nipFilter = page.getByRole('spinbutton', { name: 'NIP' });
    this.searchButton = page.getByRole('button', { name: 'Wyszukaj' });
    this.table = page.getByRole('table');
    this.rows = this.table.locator('tbody tr');
    this.paginationStatus = page.locator('#employer-table_info');
    this.processingIndicator = page.locator('#employer-table_processing');
    this.dispositionsCardHeading = page.getByRole('heading', { level: 5, name: 'Dyspozycje' });
    this.permissionsCardHeading = page.getByRole('heading', { level: 5, name: 'Uprawnienia' });
    this.dispositionsLink = page.getByRole('link', { name: /Dyspozycje/ });
    this.permissionsLink = page.getByRole('link', { name: /Uprawnienia/ });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/employer/list`);
  }

  async search(filters: { employerName?: string; krs?: string; regon?: string; nip?: string }): Promise<void> {
    if (filters.employerName !== undefined) await this.employerNameFilter.fill(filters.employerName);
    if (filters.krs !== undefined) await this.krsFilter.fill(filters.krs);
    if (filters.regon !== undefined) await this.regonFilter.fill(filters.regon);
    if (filters.nip !== undefined) await this.nipFilter.fill(filters.nip);
    await this.searchButton.click();
    await this.processingIndicator.waitFor({ state: 'visible', timeout: 1000 }).catch(() => undefined);
    await this.processingIndicator.waitFor({ state: 'hidden' });
  }

  bodyRows(): Locator {
    return this.rows.filter({ has: this.page.locator('td:nth-child(2)') });
  }
}
