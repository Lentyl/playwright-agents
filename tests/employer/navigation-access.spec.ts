import { test, expect } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';
import { DISPOSITION_ENTRIES, CONTRIBUTION_CANCEL_PATH } from '../../pages/employer/EmployerDispositionsPage';

// TC-NAV — Navigation & Access Control (Employer role)
test.describe('TC-NAV — Navigation & Access Control', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-NAV-001 dashboard exposes all expected feature cards', async ({ employerDashboardPage }) => {
    const cards = [
      'Przekazanie plików',
      'Dyspozycje',
      'Podgląd Uczestników',
      'Raporty',
      'Pliki zwrotne od Nationale-Nederlanden',
      'Dokumenty',
      'Materiały informacyjne',
      'Dane dotyczące umowy i wpłat do PPK',
      'Uprawnienia',
      'Szkolenia',
    ];
    for (const name of cards) {
      await expect(employerDashboardPage.card(name)).toBeVisible();
    }

    await expect(employerDashboardPage.companyName).toBeVisible();
    await expect(employerDashboardPage.sessionCountdown).toBeVisible();
    await expect(employerDashboardPage.lastSuccessfulLogin).toBeVisible();
    await expect(employerDashboardPage.logoutButton).toBeVisible();
  });

  test('TC-NAV-002 Menu flyout lists every section and its links', async ({ employerDashboardPage }) => {
    await employerDashboardPage.openMenu();

    for (const section of ['Panel administracyjny', 'PPK', 'Ustawienia', 'Dyspozycje']) {
      await expect(employerDashboardPage.menuSection(section)).toBeVisible();
    }

    await expect(employerDashboardPage.menuLink('Lista użytkowników')).toBeVisible();

    for (const link of ['Przekazanie plików', 'Podgląd Uczestników', 'Raporty', 'Dokumenty']) {
      await expect(employerDashboardPage.menuLink(link)).toBeVisible();
    }

    for (const link of ['Dane dotyczące umowy i wpłat do PPK', 'Wspólne logowanie', 'Zmiana hasła', 'Zaufane urządzenia']) {
      await expect(employerDashboardPage.menuLink(link)).toBeVisible();
    }

    const dyspozycjeLinks = DISPOSITION_ENTRIES.map((e) => e.label).concat('Rezygnacja z odprowadzania wpłat');
    expect(dyspozycjeLinks).toHaveLength(10);
    for (const link of dyspozycjeLinks) {
      await expect(employerDashboardPage.menuLink(link)).toBeVisible();
    }

    await expect(employerDashboardPage.advisorName).toBeVisible();
    await expect(employerDashboardPage.advisorPhone).toBeVisible();
    await expect(employerDashboardPage.advisorEmail).toBeVisible();
    await expect(employerDashboardPage.customerServicePhone).toBeVisible();
    await expect(employerDashboardPage.customerServiceHours).toBeVisible();
    await expect(employerDashboardPage.lastFailedLogin).toBeVisible();

    await employerDashboardPage.toggleMenu();
    // Confirms KI-8: clicking Menu a second time does not close the flyout.
    await expect(employerDashboardPage.menuSection('Dyspozycje')).toBeVisible();
  });

  test('TC-MENU-002 internal dashboard cards lead to their documented routes', async ({ employerDashboardPage, page }) => {
    const internalCards = [
      ['Przekazanie plików', '/employer/fileUpload'],
      ['Podgląd Uczestników', '/employer/customer/list'],
      ['Raporty', '/employer/report/'],
      ['Pliki zwrotne od Nationale-Nederlanden', '/employer/documentsReport/'],
      ['Dokumenty', '/documents'],
      ['Dane dotyczące umowy i wpłat do PPK', '/employer/data/'],
      ['Uprawnienia', '/employer/admin'],
    ] as const;

    for (const [name, expectedPath] of internalCards) {
      await expect(employerDashboardPage.cardLink(name)).toHaveAttribute('href', `${APP_PATH}${expectedPath}`);
    }

    await expect(employerDashboardPage.cardLink('Dyspozycje')).toHaveAttribute('href', '#');
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));
  });

  for (const entry of DISPOSITION_ENTRIES) {
    test(`TC-NAV-003 Dyspozycje entry point loads: ${entry.label}`, async ({ employerDispositionsPage }) => {
      const response = await employerDispositionsPage.gotoDisposition(entry.path);
      expect(response?.status()).toBeLessThan(400);
      await expect(employerDispositionsPage.heading(entry.heading)).toBeVisible();
    });
  }

  test('TC-NAV-003 Rezygnacja z odprowadzania wpłat returns HTTP 403 (KI-5)', async ({ employerDispositionsPage, page }) => {
    const response = await employerDispositionsPage.gotoDisposition(CONTRIBUTION_CANCEL_PATH);
    expect(response?.status()).toBe(403);
    await expect(page).toHaveTitle('Błąd');
    await expect(employerDispositionsPage.accessDeniedHeading).toBeVisible();
  });

  test('TC-NAV-004 breadcrumb Dyspozycje link is broken (KI-6)', async ({ employerRegistrationWizardPage, employerDispositionsPage, page }) => {
    await employerRegistrationWizardPage.open();
    await expect(employerRegistrationWizardPage.heading).toBeVisible();

    await employerDispositionsPage.openDispositionsBreadcrumb();
    await expect(page).toHaveURL(/dashboard\?orders=1/);
    // Confirms the defect: no valid route, an error page is shown instead of an
    // orders overview.
    await expect(employerDispositionsPage.errorPageBody).toContainText(/Whitelabel Error Page|Brak dostępu|error/i);
  });
});
