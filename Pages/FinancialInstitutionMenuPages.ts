import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

export default class FinancialInstitutionMenuPages extends BasePage {
  readonly reportsHeading: Locator;
  readonly reportSelect: Locator;
  readonly reportFromDate: Locator;
  readonly reportToDate: Locator;
  readonly generateReportButton: Locator;
  readonly documentsHeading: Locator;
  readonly awaitingOrdersHeading: Locator;
  readonly terminationHeading: Locator;
  readonly employerNameFilter: Locator;
  readonly krsFilter: Locator;
  readonly regonFilter: Locator;
  readonly nipFilter: Locator;
  readonly searchButton: Locator;
  readonly conversionHeading: Locator;
  readonly reportValidationMessage: Locator;
  readonly reportAttachments: Locator;
  readonly orderPageSizeSelect: Locator;
  readonly orderPaginationStatus: Locator;
  readonly orderNoData: Locator;
  readonly terminationTable: Locator;
  readonly terminationPaginationStatus: Locator;
  readonly terminationValidationMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.reportsHeading = page.getByRole('heading', { level: 1, name: 'Raporty' });
    this.reportSelect = page.getByLabel('Nazwa raportu:');
    this.reportFromDate = page.getByLabel('Data od:');
    this.reportToDate = page.getByLabel('Data do:');
    this.generateReportButton = page.getByRole('button', { name: 'Generuj raport' });
    this.documentsHeading = page.getByRole('heading', { level: 1, name: 'Dokumenty' });
    this.awaitingOrdersHeading = page.getByRole('heading', { level: 1, name: 'Zlecenia do akceptacji' });
    this.terminationHeading = page.getByRole('heading', { level: 1, name: 'Wypowiedzenie UoZ' });
    this.employerNameFilter = page.getByRole('textbox', { name: 'Nazwa Pracodawcy' });
    this.krsFilter = page.getByRole('spinbutton', { name: 'KRS' });
    this.regonFilter = page.getByRole('spinbutton', { name: 'REGON' });
    this.nipFilter = page.getByRole('spinbutton', { name: 'NIP' });
    this.searchButton = page.getByRole('button', { name: 'Wyszukaj' });
    this.conversionHeading = page.getByRole('heading', { level: 1, name: 'Konwersja' });
    this.reportValidationMessage = page.getByRole('alert');
    this.reportAttachments = page.locator('a.attachment');
    this.orderPageSizeSelect = page.locator('#dt-length-0');
    this.orderPaginationStatus = page.locator('#reqTrade-table_info');
    this.orderNoData = page.getByText('Brak danych', { exact: true });
    this.terminationTable = page.locator('#employer-table');
    this.terminationPaginationStatus = page.locator('#employer-table_info');
    this.terminationValidationMessage = page.getByText('Proszę wprowadzić dane pracodawcy', { exact: true });
  }

  async openReports(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/report`);
  }

  async openDocuments(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/documents`);
  }

  async openAwaitingOrders(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/reqtrade/list/awaiting`);
  }

  async openTermination(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/contract/termination/search`);
  }

  async openConversion(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/exchange`);
  }

  documentLink(name: string): Locator {
    return this.page.getByRole('link', { name, exact: false });
  }

  documentCategory(name: string): Locator {
    return this.page.locator('strong', { hasText: name }).filter({ hasText: new RegExp(`^${name}$`) });
  }

  documentAttachment(index: number): Locator {
    return this.reportAttachments.nth(index);
  }

  reportEmployerFilter(): Locator {
    return this.page.locator('#companyName');
  }

  orderStatusTab(name: 'Oczekujące' | 'Zaakceptowane' | 'Odrzucone'): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  table(): Locator {
    return this.page.getByRole('table');
  }

  tableSearch(): Locator {
    return this.page.getByRole('searchbox', { name: 'Szukaj:' });
  }

  orderRows(): Locator {
    return this.table().locator('tbody > tr');
  }

  orderColumnValues(columnIndex: number): Locator {
    return this.orderRows().locator(`td:nth-child(${columnIndex})`);
  }

  orderSortButton(name: string): Locator {
    return this.table().getByRole('button', { name: new RegExp(`^${name}:`) });
  }

  orderNextPage(): Locator {
    return this.page.locator('.dt-paging .next');
  }

  orderPreviousPage(): Locator {
    return this.page.locator('.dt-paging .previous');
  }

  orderConfirmationDownload(): Locator {
    return this.table().locator('a[href*="/reqtrade/confirmation/"][href$="/download"]').first();
  }

  terminationRows(): Locator {
    return this.terminationTable.locator('tbody > tr');
  }

  terminationSortButton(columnIndex: number): Locator {
    return this.terminationTable.locator(`thead th:nth-child(${columnIndex}) .dt-column-order`);
  }

  async searchTerminations(): Promise<void> {
    await Promise.all([
      this.page.waitForResponse((response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/manager/contract/termination/search') &&
        response.status() === 200,
      ),
      this.searchButton.click(),
    ]);
  }
}