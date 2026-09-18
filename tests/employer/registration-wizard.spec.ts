import { test, expect } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';

// TC-FORM — Registration wizard (Employer role)
// Only non-mutating cases are automated: field presence and required-field
// validation on an empty submit (which never creates a participant).
// PESEL/date/email boundary cases (TC-FORM-002..004) need a disposable test
// PESEL before they can be automated safely — see plan Section 14.
test.describe('TC-FORM — Registration wizard', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-FORM-001 step 1 exposes the expected participant fields', async ({ registrationWizardPage }) => {
    await registrationWizardPage.open();
    await expect(registrationWizardPage.heading).toBeVisible();
    await expect(registrationWizardPage.participantSection).toBeVisible();
    await expect(registrationWizardPage.residenceSection).toBeVisible();
    await expect(registrationWizardPage.registrationSection).toBeVisible();

    for (const field of [
      registrationWizardPage.firstName,
      registrationWizardPage.lastName,
      registrationWizardPage.pesel,
      registrationWizardPage.birthDate,
      registrationWizardPage.email,
      registrationWizardPage.phone,
    ]) {
      await expect(field).toBeVisible();
    }
    await expect(registrationWizardPage.nextButton).toBeVisible();
  });

  test('TC-FORM-005 empty submit shows required-field errors and does not advance', async ({ registrationWizardPage, page }) => {
    await registrationWizardPage.open();
    await registrationWizardPage.submitStep();

    await expect(registrationWizardPage.invalidFeedback.first()).toBeVisible();
    await expect(registrationWizardPage.invalidFeedback.first()).toHaveText('To pole jest wymagane');
    // Wizard stays on the registration screen (no step 2 reached).
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer/registration`));
    await expect(registrationWizardPage.heading).toBeVisible();
  });
});
