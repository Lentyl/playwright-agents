import { test, expect } from '../../fixtures/pagesFixtures';
import { APP_PATH } from '../../pages/BasePage';

// TC-FORM — Registration wizard (Employer role)
//  non-mutating cases are automated: field presence and required-field
// validation on an empty submit (which never creates a participant).
// PESEL/date/email boundary cases (TC-FORM-002..004) need a disposable test
// PESEL before they can be automated safely — see plan Section 14.
test.describe('TC-FORM — Registration wizard', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-FORM-001 step 1 exposes the expected participant fields', async ({ employerRegistrationWizardPage }) => {
    await employerRegistrationWizardPage.open();
    await expect(employerRegistrationWizardPage.heading).toBeVisible();
    await expect(employerRegistrationWizardPage.participantSection).toBeVisible();
    await expect(employerRegistrationWizardPage.residenceSection).toBeVisible();
    await expect(employerRegistrationWizardPage.registrationSection).toBeVisible();

    for (const field of [
      employerRegistrationWizardPage.firstName,
      employerRegistrationWizardPage.lastName,
      employerRegistrationWizardPage.pesel,
      employerRegistrationWizardPage.birthDate,
      employerRegistrationWizardPage.email,
      employerRegistrationWizardPage.phone,
    ]) {
      await expect(field).toBeVisible();
    }
    await expect(employerRegistrationWizardPage.nextButton).toBeVisible();
  });

  test('TC-FORM-005 empty submit shows required-field errors and does not advance', async ({ employerRegistrationWizardPage, page }) => {
    await employerRegistrationWizardPage.open();
    await employerRegistrationWizardPage.submitStep();
    await expect(employerRegistrationWizardPage.invalidFeedback.first()).toBeVisible();
    await expect(employerRegistrationWizardPage.invalidFeedback.first()).toHaveText('To pole jest wymagane');
    // Wizard stays on the registration screen (no step 2 reached).
    await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer/registration`));
    await expect(employerRegistrationWizardPage.heading).toBeVisible();
  });
});
