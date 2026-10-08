import { test, expect, credentials } from '../../fixtures/pagesFixtures';

// TC-SETTINGS — Account Settings (Employer role)
test.describe('TC-SETTINGS — Account Settings', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-SETTINGS-001 contract data screen is readable', async ({ employerContractDataPage }) => {
    await employerContractDataPage.open();
    await expect(employerContractDataPage.heading).toBeVisible();
    await expect(employerContractDataPage.generalDataSection).toBeVisible();
    await expect(employerContractDataPage.employerNameLabel).toBeVisible();
  });

  test('TC-SETTINGS-002 related users screen shows the current Superlogin', async ({ employerRelatedUsersPage }) => {
    await employerRelatedUsersPage.open();
    await expect(employerRelatedUsersPage.heading).toBeVisible();
    await expect(employerRelatedUsersPage.superloginInfo).toContainText(credentials.employer.login);
  });

  test('TC-SETTINGS-003 trusted devices screen exposes table controls', async ({ employerTrustedDevicesPage }) => {
    await employerTrustedDevicesPage.open();
    await expect(employerTrustedDevicesPage.heading).toBeVisible();
    await expect(employerTrustedDevicesPage.pageSizeSelect).toBeVisible();
    await expect(employerTrustedDevicesPage.tableSearch).toBeVisible();
  });
});
