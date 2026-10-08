import { test, expect, credentials, testData } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';

// TC-PWD — Password Change (Employer role)
// SAFETY: every automated case below submits a password that is guaranteed to
// FAIL the password policy, so the change is always rejected and the shared
// account password is never mutated. A valid password must NEVER be submitted
// here. TC-PWD-001 (successful change round-trip) is intentionally excluded — it
// mutates a shared account and the original password cannot be restored via the
// self-service form (it predates the min-12 policy). See plan Section 14.
test.describe('TC-PWD — Password Change', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-PWD form fields and policy requirements are present', async ({ employerPasswordChangePage }) => {
    await employerPasswordChangePage.open();
    await expect(employerPasswordChangePage.heading).toBeVisible();
    await expect(employerPasswordChangePage.oldPassword).toBeVisible();
    await expect(employerPasswordChangePage.newPassword).toBeVisible();
    await expect(employerPasswordChangePage.repeatPassword).toBeVisible();
    await expect(employerPasswordChangePage.submitButton).toBeVisible();
    await expect(employerPasswordChangePage.requirementsHeading).toBeVisible();
  });

  const violations: Array<{ id: string; password: string }> = [
    { id: 'too short (11 chars)', password: testData.passwords.tooShort },
    { id: 'too long (26 chars)', password: testData.passwords.tooLong },
    { id: 'missing special character', password: testData.passwords.noSpecial },
    { id: 'fewer than 2 digits', password: testData.passwords.oneDigit },
    { id: 'missing uppercase letter', password: testData.passwords.noUppercase },
    { id: '3 identical consecutive chars', password: testData.passwords.tripleRepeat },
  ];

  for (const { id, password } of violations) {
    test(`TC-PWD-002 policy violation is rejected: ${id}`, async ({ employerPasswordChangePage, page }) => {
      await employerPasswordChangePage.open();
      await employerPasswordChangePage.attemptChange(credentials.employer.password, password);

      // The invalid password is rejected: still on the change screen with an
      // inline error, so the account password is unchanged.
      await expect(page).toHaveURL(new RegExp(`${APP_PATH}/passwordChange`));
      await expect(employerPasswordChangePage.invalidFeedback.first()).toBeVisible();
    });
  }
});
