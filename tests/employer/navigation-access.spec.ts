import { test, expect } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';
import { DISPOSITION_ENTRIES, CONTRIBUTION_CANCEL_PATH } from '../../pages/DispositionsPage';

// TC-NAV — Navigation & Access Control (Employer role)
test.describe('TC-NAV — Navigation & Access Control', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-NAV-001 dashboard exposes all expected feature cards', async ({ dashboardPage }) => {
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
      await expect(dashboardPage.card(name)).toBeVisible();
    }

    await expect(dashboardPage.companyName).toBeVisible();
    await expect(dashboardPage.sessionCountdown).toBeVisible();
    await expect(dashboardPage.lastSuccessfulLogin).toBeVisible();
    await expect(dashboardPage.logoutButton).toBeVisible();
  });

  test('TC-NAV-002 Menu flyout lists every section and its links', async ({ dashboardPage }) => {
    await dashboardPage.openMenu();

    for (const section of ['Panel administracyjny', 'PPK', 'Ustawienia', 'Dyspozycje']) {
      await expect(dashboardPage.menuSection(section)).toBeVisible();
    }

    await expect(dashboardPage.menuLink('Lista użytkowników')).toBeVisible();

    for (const link of ['Przekazanie plików', 'Podgląd Uczestników', 'Raporty', 'Dokumenty']) {
      await expect(dashboardPage.menuLink(link)).toBeVisible();
    }

    for (const link of ['Dane dotyczące umowy i wpłat do PPK', 'Wspólne logowanie', 'Zmiana hasła', 'Zaufane urządzenia']) {
      await expect(dashboardPage.menuLink(link)).toBeVisible();
    }

    const dyspozycjeLinks = DISPOSITION_ENTRIES.map((e) => e.label).concat('Rezygnacja z odprowadzania wpłat');
    expect(dyspozycjeLinks).toHaveLength(10);
    for (const link of dyspozycjeLinks) {
      await expect(dashboardPage.menuLink(link)).toBeVisible();
    }

    await expect(dashboardPage.advisorName).toBeVisible();
    await expect(dashboardPage.advisorPhone).toBeVisible();
    await expect(dashboardPage.advisorEmail).toBeVisible();
    await expect(dashboardPage.customerServicePhone).toBeVisible();
    await expect(dashboardPage.customerServiceHours).toBeVisible();
    await expect(dashboardPage.lastFailedLogin).toBeVisible();

    await dashboardPage.toggleMenu();
    // Confirms KI-8: clicking Menu a second time does not close the flyout.
    await expect(dashboardPage.menuSection('Dyspozycje')).toBeVisible();
  });

  test('TC-MENU-002 internal dashboard cards lead to their documented routes', async ({ dashboardPage, page }) => {
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
      await expect(dashboardPage.cardLink(name)).toHaveAttribute('href', `${APP_PATH}${expectedPath}`);
    }

    await expect(dashboardPage.cardLink('Dyspozycje')).toHaveAttribute('href', '#');
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));
  });

  for (const entry of DISPOSITION_ENTRIES) {
    test(`TC-NAV-003 Dyspozycje entry point loads: ${entry.label}`, async ({ dispositionsPage }) => {
      const response = await dispositionsPage.gotoDisposition(entry.path);
      expect(response?.status()).toBeLessThan(400);
      await expect(dispositionsPage.heading(entry.heading)).toBeVisible();
    });
  }

  test('TC-NAV-003 Rezygnacja z odprowadzania wpłat returns HTTP 403 (KI-5)', async ({ dispositionsPage, page }) => {
    const response = await dispositionsPage.gotoDisposition(CONTRIBUTION_CANCEL_PATH);
    expect(response?.status()).toBe(403);
    await expect(page).toHaveTitle('Błąd');
    await expect(dispositionsPage.accessDeniedHeading).toBeVisible();
  });

  test('TC-NAV-004 breadcrumb Dyspozycje link is broken (KI-6)', async ({ registrationWizardPage, dispositionsPage, page }) => {
    await registrationWizardPage.open();
    await expect(registrationWizardPage.heading).toBeVisible();

    await dispositionsPage.openDispositionsBreadcrumb();
    await expect(page).toHaveURL(/dashboard\?orders=1/);
    // Confirms the defect: no valid route, an error page is shown instead of an
    // orders overview.
    await expect(dispositionsPage.errorPageBody).toContainText(/Whitelabel Error Page|Brak dostępu|error/i);
  });
});
