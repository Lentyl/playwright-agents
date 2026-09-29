import { test, expect, credentials, testData } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';
import { DISPOSITION_ENTRIES, CONTRIBUTION_CANCEL_PATH } from '../../pages/DispositionsPage';

// TC-FLOW — End-to-end scenarios (Employer role)
test.describe('TC-FLOW — Full flows', () => {
  test('TC-FLOW-001 login → dashboard → participant list → logout → protected route blocked', async ({ loginPage, dashboardPage, participantListPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, credentials.employer.password);
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));

    await dashboardPage.cardLink('Podgląd Uczestników').click();
    await expect(participantListPage.heading).toBeVisible();

    await dashboardPage.logout();
    await expect(loginPage.logoutMessage).toBeVisible();

    // Protected route is not accessible after logout: the participant list is
    // not rendered (app shows an error page rather than redirecting — KI-3).
    await page.goto(`${APP_PATH}/employer/customer/list`);
    await expect(participantListPage.heading).toBeHidden();
    await expect(dashboardPage.logoutButton).toBeHidden();
  });

  test.only('TC-FLOW-002 invalid login then successful recovery', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, testData.invalid.password);
    await expect(page).toHaveURL(/login\?error=true/);
    await expect(loginPage.errorMessage).toBeVisible();

    await loginPage.login(credentials.employer.login, credentials.employer.password);
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));
    await expect(dashboardPage.companyName).toHaveText(testData.employer.companyName);
  });

  test('TC-FLOW-005 access-control probe across all Dyspozycje entry points (fresh session)', async ({ loginAsEmployer, dispositionsPage, page }) => {
    await loginAsEmployer();

    for (const entry of DISPOSITION_ENTRIES) {
      const response = await dispositionsPage.gotoDisposition(entry.path);
      expect(response?.status(), `expected ${entry.label} to load`).toBeLessThan(400);
      await expect(dispositionsPage.heading(entry.heading)).toBeVisible();
    }

    const denied = await dispositionsPage.gotoDisposition(CONTRIBUTION_CANCEL_PATH);
    expect(denied?.status()).toBe(403);
    await expect(dispositionsPage.accessDeniedHeading).toBeVisible();
  });
});
