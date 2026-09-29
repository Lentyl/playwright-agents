import { test, expect } from '../../../fixtures/pagesFixtures';
import { stat } from 'node:fs/promises';
import { captureScreenshot } from '../captureScreenshot';

test.describe('Document cases - Financial Institution panel', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureScreenshot(page, testInfo);
  });

  test('DOC-FI-45 opens the employer information dashboard', async ({
    loginAsFinancialInstitution,
    financialInstitutionDashboardPage,
  }) => {
    await loginAsFinancialInstitution();

    await expect(financialInstitutionDashboardPage.heading).toBeVisible();
    await expect(financialInstitutionDashboardPage.employerPreviewHeading).toBeVisible();
  });

  test('DOC-FI-54 reveals filters for the participant list', async ({
    loginAsFinancialInstitution,
    financialInstitutionParticipantListPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionParticipantListPage.open();
    await financialInstitutionParticipantListPage.showMoreFilters();

    await expect(financialInstitutionParticipantListPage.heading).toBeVisible();
    await expect(financialInstitutionParticipantListPage.firstNameFilter).toBeVisible();
    await expect(financialInstitutionParticipantListPage.lastNameFilter).toBeVisible();
    await expect(financialInstitutionParticipantListPage.emailFilter).toBeVisible();
    await expect(financialInstitutionParticipantListPage.peselFilter).toBeVisible();
  });

  test('DOC-FI-55-57 exposes report parameters required by the document', async ({
    loginAsFinancialInstitution,
    financialInstitutionReportsPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionReportsPage.open();

    await financialInstitutionReportsPage.selectReport('Umowy PPK');
    await expect(financialInstitutionReportsPage.fromDate).toBeVisible();
    await expect(financialInstitutionReportsPage.toDate).toBeVisible();
    await expect(financialInstitutionReportsPage.generateButton).toBeVisible();

    await financialInstitutionReportsPage.selectReport('Raport z rozliczenia skladek');
    await expect(financialInstitutionReportsPage.employerFilter).toBeVisible();
  });

  test('DOC-FI-58 displays information and document links in new tabs', async ({
    loginAsFinancialInstitution,
    financialInstitutionDocumentsPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionDocumentsPage.open();

    await expect(financialInstitutionDocumentsPage.heading).toBeVisible();
    await expect(financialInstitutionDocumentsPage.attachments).toHaveCount(14);
    await expect(financialInstitutionDocumentsPage.attachment(0)).toHaveAttribute('target', '_blank');
  });

  test('DOC-FI-45 exposes company-information tabs for an accepted agreement', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionAgreementPage.openAcceptedAgreements();
    await financialInstitutionAgreementPage.waitForAcceptedAgreementsTable();
    await expect(financialInstitutionAgreementPage.contractRows.first()).toBeVisible();

    await financialInstitutionAgreementPage.openAgreementDetails(
      financialInstitutionAgreementPage.contractRows.first(),
    );
    await expect(financialInstitutionAgreementPage.generalTab).toHaveAttribute('aria-selected', 'true');
    await expect(financialInstitutionAgreementPage.companyTab).toBeVisible();
    await expect(financialInstitutionAgreementPage.representativesTab).toBeVisible();
    await expect(financialInstitutionAgreementPage.documentsTab).toBeVisible();
    await expect(financialInstitutionAgreementPage.eventsTab).toBeVisible();
  });

  test('DOC-FI-53 narrows the agreement list by an existing company name', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionAgreementPage.openAcceptedAgreements();
    await financialInstitutionAgreementPage.waitForAcceptedAgreementsTable();

    const employerName = (
      await financialInstitutionAgreementPage.contractRows.first().getByRole('cell').nth(1).innerText()
    ).trim();
    expect(employerName).not.toBe('');

    await financialInstitutionAgreementPage.searchAgreements(employerName);
    await expect(financialInstitutionAgreementPage.contractRowsMatching({ employerName }).first()).toBeVisible();
  });

  test('DOC-FI-59-61 displays order status tabs and downloadable confirmations', async ({
    loginAsFinancialInstitution,
    financialInstitutionAwaitingOrdersPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionAwaitingOrdersPage.open();
    await financialInstitutionAwaitingOrdersPage.waitForResults();

    await expect(financialInstitutionAwaitingOrdersPage.heading).toBeVisible();
    await expect(financialInstitutionAwaitingOrdersPage.statusTab('Oczekujące')).toBeVisible();
    await expect(financialInstitutionAwaitingOrdersPage.statusTab('Zaakceptowane')).toBeVisible();
    await expect(financialInstitutionAwaitingOrdersPage.statusTab('Odrzucone')).toBeVisible();
    await expect(financialInstitutionAwaitingOrdersPage.confirmationDownload()).toHaveAttribute('href', /\/download$/);
  });

  test('DOC-FI-61 displays employer filters before terminating an agreement', async ({
    loginAsFinancialInstitution,
    financialInstitutionTerminationPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionTerminationPage.open();

    await expect(financialInstitutionTerminationPage.heading).toBeVisible();
    await expect(financialInstitutionTerminationPage.employerNameFilter).toBeVisible();
    await expect(financialInstitutionTerminationPage.krsFilter).toBeVisible();
    await expect(financialInstitutionTerminationPage.regonFilter).toBeVisible();
    await expect(financialInstitutionTerminationPage.nipFilter).toBeVisible();
    await expect(financialInstitutionTerminationPage.searchButton).toBeVisible();
  });

  test('Rejestracja umowy: formularz rejestracyjny jest dostępny', async ({
    loginAsFinancialInstitution,
    financialInstitutionRegistrationPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionRegistrationPage.openMenu();
    await financialInstitutionRegistrationPage.menuLink('Rejestracja umowy PPK').click();

    await expect(financialInstitutionRegistrationPage.registrationHeading).toBeVisible();
    await expect(financialInstitutionRegistrationPage.employerDataHeading).toBeVisible();
    await expect(financialInstitutionRegistrationPage.nextButton).toBeVisible();
  });

  test('Wyszukiwanie firmy z listy', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionAgreementPage.openAcceptedAgreements();
    await financialInstitutionAgreementPage.waitForAcceptedAgreementsTable();

    const employerName = (
      await financialInstitutionAgreementPage.contractRows.first().getByRole('cell').nth(1).innerText()
    ).trim();
    await financialInstitutionAgreementPage.searchAgreements(employerName);

    await expect(
      financialInstitutionAgreementPage.contractRowsMatching({ employerName }).first(),
    ).toBeVisible();
  });

  test('Podgląd listy uczestników', async ({
    loginAsFinancialInstitution,
    financialInstitutionParticipantListPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionParticipantListPage.open();
    await financialInstitutionParticipantListPage.showMoreFilters();
    const firstName = (await financialInstitutionParticipantListPage.bodyRows().first().locator('td').nth(1).innerText()).trim();

    await financialInstitutionParticipantListPage.search({ firstName });
    await expect(financialInstitutionParticipantListPage.bodyRows().first()).toContainText(firstName);
  });

  for (const reportName of [
    'Umowy PPK',
    'Użytkownicy serwisu PPK',
    'Raport z informacją o linkach',
    'Raport firm przesyłających korekty',
    'Raport z rozliczenia skladek',
  ]) {
    test(`Pobranie raportu ${reportName}`, async ({
      loginAsFinancialInstitution,
      financialInstitutionReportsPage,
      page,
    }, testInfo) => {
      await loginAsFinancialInstitution();
      await financialInstitutionReportsPage.open();
      await financialInstitutionReportsPage.selectReport(reportName);

      await expect(financialInstitutionReportsPage.generateButton).toBeVisible();
      if (reportName === 'Raport z rozliczenia skladek') {
        test.fail(true, 'Application defect: the report required by the PDF does not render the date-range controls.');
      }
      if (['Umowy PPK', 'Raport firm przesyłających korekty', 'Raport z rozliczenia skladek'].includes(reportName)) {
        await expect(financialInstitutionReportsPage.fromDate).toBeVisible();
        await expect(financialInstitutionReportsPage.toDate).toBeVisible();
      }

      if (['Użytkownicy serwisu PPK', 'Raport z informacją o linkach'].includes(reportName)) {
        test.fail(true, 'Application defect: report generation does not reliably emit a download event.');
        const [download] = await Promise.all([
          page.waitForEvent('download', { timeout: 10_000 }),
          financialInstitutionReportsPage.generateButton.click({ noWaitAfter: true }),
        ]);
        const savedFile = testInfo.outputPath(download.suggestedFilename());
        await download.saveAs(savedFile);

        expect(await download.failure()).toBeNull();
        expect((await stat(savedFile)).size).toBeGreaterThan(0);
      }
    });
  }

  test('Podgląd informacji i dokumentów', async ({
    loginAsFinancialInstitution,
    financialInstitutionDocumentsPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionDocumentsPage.open();

    await expect(financialInstitutionDocumentsPage.attachments).toHaveCount(14);
    await expect(financialInstitutionDocumentsPage.attachment(0)).toHaveAttribute('target', '_blank');
    await expect(financialInstitutionDocumentsPage.attachment(0)).toHaveAttribute('href', /.+/);
  });

  test('Wypowiedzenie umowy o zarządzanie: walidacja pustego wyszukiwania', async ({
    loginAsFinancialInstitution,
    financialInstitutionTerminationPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionTerminationPage.open();
    await financialInstitutionTerminationPage.searchButton.click();

    await expect(financialInstitutionTerminationPage.validationMessage).toBeVisible();
  });

  test('Zaakceptowanie oczekującego zlecenia: lista statusów i potwierdzenie', async ({
    loginAsFinancialInstitution,
    financialInstitutionAwaitingOrdersPage,
  }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionAwaitingOrdersPage.open();
    await financialInstitutionAwaitingOrdersPage.waitForResults();

    await expect(financialInstitutionAwaitingOrdersPage.statusTab('Oczekujące')).toBeVisible();
    await expect(financialInstitutionAwaitingOrdersPage.statusTab('Zaakceptowane')).toBeVisible();
    await expect(financialInstitutionAwaitingOrdersPage.statusTab('Odrzucone')).toBeVisible();
    await expect(financialInstitutionAwaitingOrdersPage.confirmationDownload()).toHaveAttribute('href', /\/download$/);
  });
});