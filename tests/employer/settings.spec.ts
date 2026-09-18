import { test, expect, credentials } from '../../fixtures/pagesFixtures';

// TC-SETTINGS — Account Settings (Employer role)
test.describe('TC-SETTINGS — Account Settings', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-SETTINGS-001 contract data screen is readable', async ({ contractDataPage }) => {
    await contractDataPage.open();
    await expect(contractDataPage.heading).toBeVisible();
    await expect(contractDataPage.generalDataSection).toBeVisible();
    await expect(contractDataPage.employerNameLabel).toBeVisible();
  });

  test('TC-SETTINGS-002 related users screen shows the current Superlogin', async ({ relatedUsersPage }) => {
    await relatedUsersPage.open();
    await expect(relatedUsersPage.heading).toBeVisible();
    await expect(relatedUsersPage.superloginInfo).toContainText(credentials.employer.login);
  });

  test('TC-SETTINGS-003 trusted devices screen exposes table controls', async ({ trustedDevicesPage }) => {
    await trustedDevicesPage.open();
    await expect(trustedDevicesPage.heading).toBeVisible();
    await expect(trustedDevicesPage.pageSizeSelect).toBeVisible();
    await expect(trustedDevicesPage.tableSearch).toBeVisible();
  });
});
