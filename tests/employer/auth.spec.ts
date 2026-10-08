import { test, expect, credentials, testData } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';

test.use({ storageState: { cookies: [], origins: [] } });

// TC-AUTH — Login, Logout, Session (new app, Employer role)
test.describe('TC-AUTH — Authentication', () => {
  test('TC-AUTH-001 successful employer login reaches the dashboard', async ({ loginPage, employerDashboardPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, credentials.employer.password);

    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));
    await expect(employerDashboardPage.companyName).toHaveText(testData.employer.companyName);
  });

  test('TC-AUTH-002 invalid password shows error and does not authenticate', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, testData.invalid.password);

    await expect(page).toHaveURL(/login\?error=true/);
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC-AUTH-003 empty credentials do not navigate to the dashboard', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.submitButton.click();

    await expect(page).not.toHaveURL(new RegExp(`${APP_PATH}/employer$`));
    await expect(loginPage.identifier).toBeVisible();
  });

  test('TC-AUTH-006 logout ends the session and protects employer routes', async ({ loginPage, employerDashboardPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, credentials.employer.password);
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));

    await employerDashboardPage.logout();
    await expect(page).toHaveURL(/login\?logout/);
    await expect(loginPage.logoutMessage).toBeVisible();

    // After logout the protected dashboard is not accessible. The app does not
    // redirect to login for this route; it renders a Spring Whitelabel error
    // page instead (defect KI-3). Either way, the authenticated dashboard
    // (company header / Wyloguj) must not be rendered.
    await page.goto(`${APP_PATH}/employer`);
    await expect(employerDashboardPage.logoutButton).toBeHidden();
    await expect(employerDashboardPage.companyName).toBeHidden();
  });

  test('TC-AUTH-007 visiting /login while authenticated still renders the login form (KI-1)', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, credentials.employer.password);
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));

    // Documents the current defect: the app does not redirect an authenticated
    // user away from /login, so both the login form and the authenticated
    // header (Wyloguj) are present on the same page.
    await page.goto(`${APP_PATH}/login`);
    await expect(loginPage.identifier).toBeVisible();
    await expect(loginPage.logoutButton).toBeVisible();
  });
});
