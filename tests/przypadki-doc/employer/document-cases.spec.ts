import { test, expect, testData } from '../../../fixtures/pagesFixtures';
import { CONTRIBUTION_CANCEL_PATH, DISPOSITION_ENTRIES } from '../../../pages/DispositionsPage';
import { captureScreenshot } from '../captureScreenshot';

test.describe('Document cases - Employer panel', () => {
  test.afterEach(async ({ page }, testInfo) => {
    await captureScreenshot(page, testInfo);
  });

  test('Podgląd danych dotyczących umowy i wpłat do PPK', async ({
    loginAsEmployer,
    contractDataPage,
  }) => {
    await loginAsEmployer();
    await contractDataPage.open();

    await expect(contractDataPage.heading).toBeVisible();
    await expect(contractDataPage.generalDataSection).toBeVisible();
    await expect(contractDataPage.employerNameLabel).toBeVisible();
  });

  test('Wgrywanie pliku - poprawna próba: ekran przekazania plików', async ({
    loginAsEmployer,
    fileUploadPage,
  }) => {
    await loginAsEmployer();
    await fileUploadPage.open();

    await expect(fileUploadPage.heading).toBeVisible();
    await expect(fileUploadPage.historyHeading).toBeVisible();
    await expect(fileUploadPage.fileNameFilter).toBeVisible();
    await expect(fileUploadPage.searchButton).toBeVisible();
  });

  test('Usuwanie przesłanego pliku: historia przekazanych plików', async ({
    loginAsEmployer,
    fileUploadPage,
  }) => {
    await loginAsEmployer();
    await fileUploadPage.open();

    for (const columnName of ['Lp', 'Nazwa pliku', 'Osoba przesyłająca plik', 'Data przesłania pliku', 'Plik źródłowy', 'Akcje']) {
      await expect(fileUploadPage.columnHeader(columnName).first()).toBeVisible();
    }
  });

  test('Podgląd uczestników', async ({
    loginAsEmployer,
    participantListPage,
  }) => {
    await loginAsEmployer();
    await participantListPage.open();
    await participantListPage.search({ firstName: 'ZZZ_NONEXISTENT_PARTICIPANT' });

    await expect(participantListPage.noMatchingRows).toBeVisible();
    await expect(participantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
  });

  test('Podgląd uczestników: filtrowanie istniejącego uczestnika', async ({
    loginAsEmployer,
    participantListPage,
  }) => {
    await loginAsEmployer();
    await participantListPage.open();
    await participantListPage.search({ employed: 'YES' });
    await expect(participantListPage.bodyRows().first()).toBeVisible();

    const cells = await participantListPage.bodyRows().first().locator('td').allTextContents();
    const firstName = cells[3].trim();
    const lastName = cells[4].trim();
    expect(firstName).not.toBe('');
    expect(lastName).not.toBe('');

    await participantListPage.search({ firstName, lastName });
    await expect(participantListPage.bodyRows().first()).toContainText(firstName);
    await expect(participantListPage.bodyRows().first()).toContainText(lastName);
  });

  test('Podgląd dokumentów', async ({ loginAsEmployer, documentsPage }) => {
    await loginAsEmployer();
    await documentsPage.open();

    await expect(documentsPage.heading).toBeVisible();
    await expect(documentsPage.managementAgreementLink).toBeVisible();
    await expect(documentsPage.conductAgreementLink).toBeVisible();
  });

  test('Podgląd materiałów informacyjnych: dokument umowy jest dostępny', async ({
    loginAsEmployer,
    documentsPage,
    page,
  }) => {
    await loginAsEmployer();
    await documentsPage.open();
    const href = await documentsPage.managementAgreementLink.getAttribute('href');
    expect(href).not.toBeNull();

    const response = await page.request.get(new URL(href!, page.url()).toString());
    expect(response.status()).toBeLessThan(400);
    expect((await response.body()).byteLength).toBeGreaterThan(0);
  });

  test.describe('Public authentication cases', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('Niepoprawne logowanie', async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login(testData.employer.login, testData.invalid.password);

      await expect(page).toHaveURL(/login\?error=true/);
      await expect(loginPage.errorMessage).toBeVisible();
    });

    test('Przypomnienie hasła', async ({ passwordResetPage }) => {
      await passwordResetPage.open();

      await expect(passwordResetPage.heading).toBeVisible();
      await expect(passwordResetPage.identifier).toBeVisible();
      await expect(passwordResetPage.phone).toBeVisible();
      await expect(passwordResetPage.requiredFieldsMessage).toBeVisible();
      await expect(passwordResetPage.resetButton).toBeVisible();
    });
  });

  for (const reportName of testData.returnedFileReports) {
    test(`Pobranie ${reportName.toLocaleLowerCase('pl-PL')}: wybór raportu`, async ({
      loginAsEmployer,
      returnedFilesPage,
    }) => {
      await loginAsEmployer();
      await returnedFilesPage.open();

      await expect(returnedFilesPage.reportCard(reportName)).toBeVisible();
    });
  }

  for (const reportName of testData.reports) {
    test(`Pobranie ${reportName.toLocaleLowerCase('pl-PL')}: generowanie raportu`, async ({
      loginAsEmployer,
      reportsPage,
    }) => {
      await loginAsEmployer();
      await reportsPage.open();

      await expect(reportsPage.heading).toBeVisible();
      await reportsPage.selectReport(reportName);
      await expect(reportsPage.generateButton).toBeVisible();
    });
  }

  test('Wspólne logowanie', async ({
    loginAsEmployer,
    relatedUsersPage,
  }) => {
    await loginAsEmployer();
    await relatedUsersPage.open();

    await expect(relatedUsersPage.heading).toBeVisible();
    await expect(relatedUsersPage.superloginInfo).toBeVisible();
  });

  test('Usuwanie urządzenia z zaufanych: lista urządzeń', async ({
    loginAsEmployer,
    trustedDevicesPage,
  }) => {
    await loginAsEmployer();
    await trustedDevicesPage.open();

    await expect(trustedDevicesPage.heading).toBeVisible();
    await expect(trustedDevicesPage.pageSizeSelect).toBeVisible();
    await expect(trustedDevicesPage.tableSearch).toBeVisible();
  });

  test('Dodawanie użytkownika do panelu pracodawcy: lista użytkowników', async ({
    loginAsEmployer,
    userAdminPage,
  }) => {
    await loginAsEmployer();
    await userAdminPage.open();

    await expect(userAdminPage.heading).toBeVisible();
    await expect(userAdminPage.addUserLink).toBeVisible();
    await expect(userAdminPage.pageSizeSelect).toBeVisible();
    await expect(userAdminPage.tableSearch).toBeVisible();
  });

  test('Dyspozycja zgłoszenia pracownika: wymagane pola', async ({
    loginAsEmployer,
    registrationWizardPage,
    page,
  }) => {
    test.fail(true, 'Application defect: an empty registration submit renders a Whitelabel Error Page instead of required-field feedback.');
    await loginAsEmployer();
    await registrationWizardPage.open();
    await registrationWizardPage.submitStep();

    await expect(registrationWizardPage.invalidFeedback.first()).toHaveText('To pole jest wymagane');
    await expect(page).toHaveURL(/\/employer\/registration/);
  });

  test('Dyspozycja rezygnacji z dokonywania wpłat: brak dostępu', async ({
    loginAsEmployer,
    dispositionsPage,
  }) => {
    await loginAsEmployer();
    const response = await dispositionsPage.gotoDisposition(CONTRIBUTION_CANCEL_PATH);

    expect(response?.status()).toBe(403);
    await expect(dispositionsPage.accessDeniedHeading).toBeVisible();
  });

  test('Próba zmiany hasła bez spełnionych wymagań bezpieczeństwa', async ({
    loginAsEmployer,
    passwordChangePage,
  }) => {
    test.fail(true, 'Application defect: the password-change submit button remains enabled for an 11-character password.');
    await loginAsEmployer();
    await passwordChangePage.open();
    await passwordChangePage.newPassword.fill(testData.passwords.tooShort);

    await expect(passwordChangePage.requirementsHeading).toBeVisible();
    await expect(passwordChangePage.submitButton).toBeDisabled();
  });

  for (const entry of DISPOSITION_ENTRIES) {
    test(`DOC-EMP disposition opens its documented form: ${entry.label}`, async ({
      loginAsEmployer,
      dispositionsPage,
    }) => {
      await loginAsEmployer();
      const response = await dispositionsPage.gotoDisposition(entry.path);

      expect(response?.status(), `Expected ${entry.label} to load`).toBeLessThan(400);
      await expect(dispositionsPage.heading(entry.heading)).toBeVisible();
    });
  }
});