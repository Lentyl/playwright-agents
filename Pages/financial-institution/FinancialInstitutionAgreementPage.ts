import { expect, Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export type AgreementIdentifier = {
  employerName: string;
  krs?: string;
  regon?: string;
  nip?: string;
  registrationDate?: string;
  status?: string;
};

export type PendingAgreementCancellationData = AgreementIdentifier & {
  agreementId: string;
  hasMatchingDuplicate: boolean;
  firstExactRegistrationDate?: string;
  secondExactRegistrationDate?: string;
};

export type PendingAgreementActionData = AgreementIdentifier & {
  agreementId: string;
  status: string;
  detailedRegistrationDate: string;
};

export default class FinancialInstitutionAgreementPage extends BasePage {
  readonly searchBox: Locator;
  readonly contractsTable: Locator;
  readonly contractRows: Locator;
  readonly pageSizeSelect: Locator;
  readonly paginationStatus: Locator;
  readonly pagination: Locator;
  readonly previousPageLink: Locator;
  readonly nextPageLink: Locator;
  readonly companyCell: Locator;
  readonly dateCell: Locator;
  readonly contractDateText: Locator;
  readonly firstTableCell: Locator;
  readonly generalTab: Locator;
  readonly companyTab: Locator;
  readonly representativesTab: Locator;
  readonly documentsTab: Locator;
  readonly eventsTab: Locator;
  readonly saveButton: Locator;
  readonly noteInput: Locator;
  readonly noteSaveButton: Locator;
  readonly noteSavedMessage: Locator;
  readonly negotiatedStatus: Locator;
  readonly acceptedStatus: Locator;
  readonly companyDataPanel: Locator;
  readonly eventsPanel: Locator;
  readonly companyDataChangeLink: Locator;
  readonly companyDataSavedMessage: Locator;
  readonly promoterEditLink: Locator;
  readonly promoterInput: Locator;
  readonly clientAdvisorEditLink: Locator;
  readonly clientAdvisorSelect: Locator;
  readonly clientAdvisorSaveButton: Locator;
  readonly differentCorrespondenceAddressOption: Locator;
  readonly acceptedAgreementsLink: Locator;
  readonly contractsTableProcessing: Locator;
  readonly firstPendingAgreement: Locator;
  readonly firstPendingAgreementEmployerName: Locator;
  readonly firstPendingAgreementKrs: Locator;
  readonly firstPendingAgreementRegon: Locator;
  readonly firstPendingAgreementNip: Locator;
  readonly firstPendingAgreementRegistrationDate: Locator;
  readonly firstPendingAgreementActionsButton: Locator;
  readonly firstPendingAgreementCancelLink: Locator;
  readonly cancelAgreementDialog: Locator;
  readonly confirmAgreementCancellationLink: Locator;
  readonly pendingAgreementActionDialog: Locator;
  readonly pendingAgreementActionResult: Locator;
  readonly currentClientAdvisor: Locator;
  readonly timeline: Locator;
  readonly allTextboxes: Locator;
  readonly documentUploadInput: Locator;
  readonly documentTypeSelect: Locator;
  readonly uploadDocumentButton: Locator;
  readonly uploadedDocumentFileName: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBox = page.getByRole('searchbox', { name: 'Szukaj:' });
    this.contractsTable = page.locator('#contracts-table');
    this.contractRows = this.contractsTable.locator('tbody tr');
    this.pageSizeSelect = page.getByRole('combobox', { name: 'Pokaż pozycji' });
    this.paginationStatus = page.locator('#contracts-table_info');
    this.pagination = page.getByRole('navigation', { name: 'pagination' });
    this.previousPageLink = this.pagination.getByRole('link', { name: 'Previous' });
    this.nextPageLink = this.pagination.getByRole('link', { name: 'Next' });
    this.companyCell = page.getByRole('cell', { name: 'Global Education Foundation' }).first();
    this.dateCell = page.getByRole('cell', { name: '-09-10' }).first();
    this.contractDateText = page.getByText('Data zawarcia umowy o zarzą');
    this.firstTableCell = page.getByRole('cell').first();
    this.generalTab = page.getByRole('tab', { name: ' Ogólne' });
    this.companyTab = page.getByRole('tab', { name: ' Dane firmy' });
    this.representativesTab = page.getByRole('tab', { name: ' Reprezentanci/Pełnomocnicy' });
    this.documentsTab = page.getByRole('tab', { name: ' Dokumenty' });
    this.eventsTab = page.getByRole('tab', { name: ' Zdarzenia' });
    this.saveButton = page.getByRole('button', { name: 'Zapisz' });
    this.noteInput = page.locator('textarea.editable-note').last();
    this.noteSaveButton = this.noteInput.locator('xpath=..').locator('button[onclick^="editContract("]');
    this.noteSavedMessage = page.getByText('Notatka została poprawnie');
    this.negotiatedStatus = page.getByText('Umowa negocjowana');
    this.acceptedStatus = page.getByLabel('Ogólne').getByText('Zaakceptowane');
    this.companyDataPanel = page.getByLabel('Dane firmy');
    this.eventsPanel = page.locator('#timeline__items_0');
    this.companyDataChangeLink = page.getByRole('link', { name: 'Zmień dane' });
    this.companyDataSavedMessage = page.getByRole('alert').filter({ hasText: 'Zmiana danych pracodawcy przebiegła pomyślnie.' });
    this.promoterEditLink = page.locator('#promotorCode_0').getByRole('link', { name: '  Edytuj' });
    this.promoterInput = page.locator('input[name="promotorCode_0"]');
    this.clientAdvisorEditLink = page.locator('#clientAdvisor_0').getByRole('link', { name: '  Edytuj' });
    this.clientAdvisorSelect = page.locator('select[name="clientAdvisor_0"]');
    this.clientAdvisorSaveButton = this.clientAdvisorSelect.locator('xpath=../..').getByRole('button', { name: 'Zapisz' });
    this.differentCorrespondenceAddressOption = page.locator('#companyDataChangeForm').getByText('Nie', { exact: true });
    this.acceptedAgreementsLink = page.locator('a[href$="/manager/contract/list/accepted"]').first();
    this.contractsTableProcessing = page.locator('#contracts-table_processing');
    this.firstPendingAgreement = this.contractRows.first();
    this.firstPendingAgreementEmployerName = this.firstPendingAgreement.getByRole('cell').nth(1);
    this.firstPendingAgreementKrs = this.firstPendingAgreement.getByRole('cell').nth(2);
    this.firstPendingAgreementRegon = this.firstPendingAgreement.getByRole('cell').nth(4);
    this.firstPendingAgreementNip = this.firstPendingAgreement.getByRole('cell').nth(5);
    this.firstPendingAgreementRegistrationDate = this.firstPendingAgreement.getByRole('cell').nth(7);
    this.firstPendingAgreementActionsButton = this.firstPendingAgreement.getByRole('button', { name: 'Zmiana' });
    this.firstPendingAgreementCancelLink = this.firstPendingAgreement.getByRole('link', { name: 'Anuluj' });
    this.cancelAgreementDialog = page.getByRole('dialog');
    this.confirmAgreementCancellationLink = this.cancelAgreementDialog.getByRole('link', { name: 'Anuluj umowę' });
    this.pendingAgreementActionDialog = page.getByRole('dialog');
    this.pendingAgreementActionResult = page.getByRole('alert');
    this.currentClientAdvisor = page.locator('#currentClientAdvisor_0');
    this.timeline = page.locator('#timeline__items_0');
    this.allTextboxes = page.getByRole('textbox');
    this.documentUploadInput = page.locator('#fileupload0');
    this.documentTypeSelect = page.locator('#documentTypeSelect');
    this.uploadDocumentButton = page.locator('#uploadFileWithTypeBtn');
    this.uploadedDocumentFileName = page.getByRole('link', { name: 'testowyPDF.pdf' });
  }

  tabPanel(name: string): Locator {
    return this.page.getByLabel(name);
  }

  agreementLink(name: 'Umowa o zarządzanie PPK' | 'Umowa o prowadzenie PPK'): Locator {
    return this.page.getByRole('link', { name });
  }

  async openFirstPendingActions(): Promise<void> {
    await this.firstPendingAgreementActionsButton.click();
  }

  async readAgreementIdentifier(agreementRow: Locator = this.firstPendingAgreement): Promise<AgreementIdentifier> {
    return {
      employerName: (await agreementRow.getByRole('cell').nth(1).innerText()).trim(),
      krs: (await agreementRow.getByRole('cell').nth(2).innerText()).trim() || undefined,
      regon: (await agreementRow.getByRole('cell').nth(4).innerText()).trim() || undefined,
      nip: (await agreementRow.getByRole('cell').nth(5).innerText()).trim() || undefined,
      registrationDate: (await agreementRow.getByRole('cell').nth(7).innerText()).trim() || undefined,
    };
  }

  async capturePendingAgreementCancellationData(): Promise<PendingAgreementCancellationData> {
    const identifier = await this.readAgreementIdentifier();
    const matchingAgreements = this.contractRowsMatching(identifier);
    const hasMatchingDuplicate = await matchingAgreements.nth(1).isVisible();

    await this.openAgreementDetails(this.firstPendingAgreement);
    const agreementId = await this.agreementId(this.firstPendingAgreement);
    await this.closeAgreementDetails(this.firstPendingAgreement);

    if (!hasMatchingDuplicate) {
      return { ...identifier, agreementId, hasMatchingDuplicate };
    }

    await this.openAgreementDetails(this.firstPendingAgreement);
    const firstExactRegistrationDate = (await this.detailedRegistrationDate(this.firstPendingAgreement).innerText()).trim();
    await this.closeAgreementDetails(this.firstPendingAgreement);

    const duplicateAgreement = matchingAgreements.nth(1);
    await this.openAgreementDetails(duplicateAgreement);
    const secondExactRegistrationDate = (await this.detailedRegistrationDate(duplicateAgreement).innerText()).trim();
    await this.closeAgreementDetails(duplicateAgreement);

    return {
      ...identifier,
      agreementId,
      hasMatchingDuplicate,
      firstExactRegistrationDate,
      secondExactRegistrationDate,
    };
  }

  async openFirstPendingAgreementCancellation(): Promise<void> {
    await this.firstPendingAgreementActionsButton.click();
    await this.firstPendingAgreementCancelLink.click();
  }

  async confirmAgreementCancellation(): Promise<void> {
    await this.confirmAgreementCancellationLink.click();
  }

  async findPendingAgreementByStatus(status: string): Promise<PendingAgreementActionData> {
    const statusSortButton = this.sortButton('Status');
    let matchingRows = this.contractRows.filter({ hasText: status });

    for (let attempt = 0; attempt < 3 && await matchingRows.count() === 0; attempt += 1) {
      await statusSortButton.click();
      await this.contractsTableProcessing.waitFor({ state: 'visible', timeout: 1000 }).catch(() => undefined);
      await this.contractsTableProcessing.waitFor({ state: 'hidden' });
      matchingRows = this.contractRows.filter({ hasText: status });
    }

    if (await matchingRows.count() === 0) {
      throw new Error(`No agreement with status "${status}" was found after sorting.`);
    }

    const agreementRow = matchingRows.first();
    const identifier = await this.readAgreementIdentifier(agreementRow);
    await this.openAgreementDetails(agreementRow);
    const detailedRegistrationDate = (await this.detailedRegistrationDate(agreementRow).innerText()).trim();
    const agreementId = await this.agreementId(agreementRow);
    await this.closeAgreementDetails(agreementRow);

    return {
      ...identifier,
      agreementId,
      status,
      detailedRegistrationDate,
    };
  }

  async openPendingAgreementAction(
    agreement: AgreementIdentifier,
    action: 'Zweryfikuj' | 'Akceptuj',
  ): Promise<void> {
    const agreementRow = this.contractRowsMatching(agreement).first();
    await agreementRow.getByRole('button', { name: 'Zmiana' }).click();
    await agreementRow.getByRole('link', { name: new RegExp(action) }).click();
  }

  async confirmPendingAgreementAction(action: 'Zweryfikuj umowę' | 'Zaakceptuj umowę'): Promise<void> {
    await this.pendingAgreementActionDialog.getByRole('link', { name: action }).click();
  }

  cancelledAgreementRows(identifier: AgreementIdentifier): Locator {
    return this.contractRowsMatching(identifier);
  }

  pendingAction(name: 'Anuluj' | 'Zweryfikuj' | 'Akceptuj'): Locator {
    return this.firstPendingAgreement.getByRole('link', { name: new RegExp(name) });
  }

  async uploadDocument(filePath: string, documentType = 'OTHER'): Promise<void> {
    await this.documentUploadInput.setInputFiles(filePath);
    await this.documentTypeSelect.selectOption(documentType);
    await this.uploadDocumentButton.click();
  }

  eventItem(title: string): Locator {
    return this.timeline.getByText(title, { exact: true }).first();
  }

  eventDate(title: string): Locator {
    return this.eventItem(title).locator('xpath=preceding-sibling::h6[1]');
  }

  tab(name: string): Locator {
    return this.page.getByRole('tab', { name });
  }

  text(name: string, exact = false): Locator {
    return this.page.getByText(name, { exact });
  }

  link(name: string, exact = true): Locator {
    return this.page.getByRole('link', { name, exact });
  }

  heading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }

  button(name: string): Locator {
    return this.page.getByRole('button', { name });
  }

  agreementStatusTab(name: 'Oczekujące' | 'Zaakceptowane' | 'Anulowane' | 'Rozwiązane'): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  async searchAgreements(employerName: string): Promise<void> {
    await this.searchBox.fill(employerName);
    await this.contractsTableProcessing.waitFor({ state: 'visible', timeout: 1000 }).catch(() => undefined);
    await this.contractsTableProcessing.waitFor({ state: 'hidden' });
  }

  async setAgreementPageSize(pageSize: '10' | '25' | '50' | '100'): Promise<void> {
    await this.pageSizeSelect.selectOption(pageSize);
    await this.contractsTableProcessing.waitFor({ state: 'visible', timeout: 1000 }).catch(() => undefined);
    await this.contractsTableProcessing.waitFor({ state: 'hidden' });
  }

  paginationPage(pageNumber: number): Locator {
    return this.pagination.getByRole('link', { name: String(pageNumber), exact: true });
  }

  contractRowsMatching(identifier: AgreementIdentifier): Locator {
    const values = [
      identifier.employerName,
      identifier.krs,
      identifier.regon,
      identifier.nip,
      identifier.registrationDate,
    ].filter((value): value is string => Boolean(value));

    const matchingRows = values.reduce(
      (rows, value) => rows.filter({ has: this.page.getByRole('cell', { name: value, exact: true }) }),
      this.contractRows,
    );

    return identifier.status ? matchingRows.filter({ hasText: identifier.status }) : matchingRows;
  }

  async agreementId(agreementRow: Locator): Promise<string> {
    const detailsRow = agreementRow.locator('xpath=following-sibling::tr[contains(@class, "details-row")][1]');
    const companyDataLink = detailsRow.locator('a[href*="/manager/companyDataChange"]');
    const href = await companyDataLink.getAttribute('href');
    const contractId = href ? new URL(href, this.page.url()).searchParams.get('contract') : null;

    if (!contractId) {
      throw new Error('Unable to determine the agreement ID from its company-data link.');
    }

    return contractId;
  }

  detailedRegistrationDate(agreementRow: Locator): Locator {
    return agreementRow
      .locator('xpath=following-sibling::tr[contains(@class, "details-row")][1]')
      .locator('[id^="registerDate_"]');
  }

  agreementCancellationSuccessMessage(employerName: string): Locator {
    return this.page.getByText('Umowa o zarządzanie PPK dla').filter({ hasText: employerName });
  }

  async openAgreementDetails(agreementRow: Locator): Promise<void> {
    const agreementCell = agreementRow.getByRole('cell').first();

    await agreementCell.click();
    await this.waitForLocatorOrClick(this.generalTab, 3, agreementCell);
    await this.generalTab.click();
    await this.detailedRegistrationDate(agreementRow).waitFor({ state: 'visible' });
  }

  async closeAgreementDetails(agreementRow: Locator): Promise<void> {
    await agreementRow.getByRole('cell').first().click();
    await this.detailedRegistrationDate(agreementRow).waitFor({ state: 'hidden' });
  }

  sortButton(columnName: string): Locator {
    return this.contractsTable.getByRole('button', { name: new RegExp(`^${columnName}:`) });
  }

  async columnIndex(columnName: string): Promise<number> {
    const headers = await this.contractsTable.locator('thead th, thead td').allInnerTexts();
    const index = headers.findIndex((header) => header.trim().startsWith(columnName));

    if (index === -1) {
      throw new Error(`Column "${columnName}" was not found in the agreements table.`);
    }

    return index + 1;
  }

  async columnValues(columnIndex: number): Promise<string[]> {
    return (await this.contractRows.locator(`td:nth-child(${columnIndex})`).allInnerTexts())
      .map((value) => value.trim());
  }

  async isColumnSorted(columnIndex: number, direction: 'ascending' | 'descending'): Promise<boolean> {
    const values = (await this.columnValues(columnIndex)).filter(Boolean);
    const orderedValues = [...values].sort((left, right) => left.localeCompare(right, 'pl'));

    if (direction === 'descending') {
      orderedValues.reverse();
    }

    return JSON.stringify(values) === JSON.stringify(orderedValues);
  }

  async columnSortDirection(columnIndex: number): Promise<'ascending' | 'descending' | null> {
    if (await this.isColumnSorted(columnIndex, 'ascending')) {
      return 'ascending';
    }

    if (await this.isColumnSorted(columnIndex, 'descending')) {
      return 'descending';
    }

    return null;
  }

  body(): Locator {
    return this.page.locator('body');
  }

  companyChangeField(address: 'companyAddress' | 'correspondenceAddress', field: string): Locator {
    return this.page.locator(`[id="${address}.${field}"]`);
  }

  companyIdentifierField(field: 'krs' | 'regon' | 'nip'): Locator {
    return this.page.locator(`#${field}`);
  }

  companyChangeFormText(name: string): Locator {
    return this.page.locator('#companyDataChangeForm').getByText(name, { exact: true });
  }

  navigationTabContent(): Locator {
    return this.page.locator('#nav-tabContent');
  }

  companyChangeValidation(message?: string): Locator {
    const validation = this.page.locator('.invalid-feedback:visible');
    return message ? validation.filter({ hasText: message }) : validation;
  }

  async openAcceptedAgreements(): Promise<void> {
    await this.page.goto(`${APP_PATH}/manager/contract/list/accepted`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
    await this.page.waitForURL(/\/manager\/contract\/list\/accepted/);
  }

  async openAwaitingAgreements(): Promise<void> {
    await this.page.goto(`${APP_PATH}/manager/contract/list/awaiting`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
    await this.page.waitForURL(/\/manager\/contract\/list\/awaiting/);
  }

  async waitForAcceptedAgreementsTable(): Promise<void> {
    try {
      await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
      await expect(this.searchBox).toBeEnabled({ timeout: 10000 });
    } catch {
      await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 10000 });
      await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
      await expect(this.searchBox).toBeEnabled({ timeout: 10000 });
    }
  }

  async openAgreementStatusTab(name: 'Oczekujące' | 'Zaakceptowane' | 'Anulowane' | 'Rozwiązane'): Promise<void> {
    await this.agreementStatusTab(name).click();
    await this.waitForAcceptedAgreementsTable();
  }
}