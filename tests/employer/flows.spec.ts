import { test, expect, credentials, testData } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';
import { DISPOSITION_ENTRIES, CONTRIBUTION_CANCEL_PATH } from '../../pages/employer/EmployerDispositionsPage';

// TC-FLOW — End-to-end scenarios (Employer role)
test.describe('TC-FLOW — Full flows', () => {
  test('TC-FLOW-001 login → dashboard → participant list → logout → protected route blocked', async ({ loginPage, employerDashboardPage, employerParticipantListPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, credentials.employer.password);
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));

    await employerDashboardPage.cardLink('Podgląd Uczestników').click();
    await expect(employerParticipantListPage.heading).toBeVisible();

    await employerDashboardPage.logout();
    await expect(loginPage.logoutMessage).toBeVisible();

    // Protected route is not accessible after logout: the participant list is
    // not rendered (app shows an error page rather than redirecting — KI-3).
    await page.goto(`${APP_PATH}/employer/customer/list`);
    await expect(employerParticipantListPage.heading).toBeHidden();
    await expect(employerDashboardPage.logoutButton).toBeHidden();
  });

  test('TC-FLOW-002 invalid login then successful recovery', async ({ loginPage, employerDashboardPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, testData.invalid.password);
    await expect(page).toHaveURL(/login\?error=true/);
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.login(credentials.employer.login, credentials.employer.password);
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));
    await expect(employerDashboardPage.companyName).toHaveText(testData.employer.companyName);
  });

  test('TC-FLOW-005 access-control probe across all Dyspozycje entry points (fresh session)', async ({ loginAsEmployer, employerDispositionsPage, page }) => {
    await loginAsEmployer();

    for (const entry of DISPOSITION_ENTRIES) {
      const response = await employerDispositionsPage.gotoDisposition(entry.path);
      expect(response?.status(), `expected ${entry.label} to load`).toBeLessThan(400);
      await expect(employerDispositionsPage.heading(entry.heading)).toBeVisible();
    }

    const denied = await employerDispositionsPage.gotoDisposition(CONTRIBUTION_CANCEL_PATH);
    expect(denied?.status()).toBe(403);
    await expect(employerDispositionsPage.accessDeniedHeading).toBeVisible();
  });
});
