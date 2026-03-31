import { test, expect } from '../fixtures/fixtures';
import path from 'path';

test.describe('Forms -> Practice Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Forms -> Practice Form - submit practice form valid input', async ({ navigationPage, practiceFormPage }) => {
    // TC-015: Submit practice form valid input
    await navigationPage.goTo('Forms', 'Practice Form');
    
    // Fill all required fields
    await practiceFormPage.firstNameInput.fill('Test');
    await practiceFormPage.lastNameInput.fill('User');
    await practiceFormPage.emailInput.fill('test.user@ex.com');
    await practiceFormPage.genderMaleRadio.click();
    await practiceFormPage.mobileInput.fill('5551234567');
    
    // Set date of birth
    await practiceFormPage.dateOfBirthInput.click();
    await practiceFormPage.monthSelect.selectOption('March');
    await practiceFormPage.yearSelect.selectOption('1990');
    await practiceFormPage.daySelect.click();
    
    // Select subjects
    await practiceFormPage.subjectsInput.type('Maths');
    await practiceFormPage.subjectsInput.press('Enter');
    
    // Select hobbies
    await practiceFormPage.sportsHobby.click();
    
    // Skip file upload for now (image file not available)
    // const picturePath = path.join(__dirname, '../data/test-image.png');
    // await practiceFormPage.pictureInput.setInputFiles(picturePath);
    
    // Enter address
    await practiceFormPage.currentAddressTextarea.fill('123 Test Street');
    
    // Skip state and city selection (optional fields, React Select components)
    // await practiceFormPage.stateSelect.click();
    // await practiceFormPage.stateNCR.click();
    // await practiceFormPage.citySelect.click();
    // await practiceFormPage.cityDelhi.click();
    
    // Submit form
    await practiceFormPage.submitButton.click();
    
    // Verify submission modal displays all provided values
    await expect(practiceFormPage.modal).toBeVisible();
    await expect(practiceFormPage.modalBody).toContainText('Test User');
    await expect(practiceFormPage.modalBody).toContainText('test.user@ex.com');
    await expect(practiceFormPage.modalBody).toContainText('Male');
    await expect(practiceFormPage.modalBody).toContainText('5551234567');
  });

  test('Forms -> Practice Form - validate required field behavior missing mobile', async ({ navigationPage, practiceFormPage }) => {
    // TC-016: Validate required field behavior (missing mobile)
    await navigationPage.goTo('Forms', 'Practice Form');
    
    // Fill all required fields except Mobile
    await practiceFormPage.firstNameInput.fill('Test');
    await practiceFormPage.lastNameInput.fill('User');
    await practiceFormPage.emailInput.fill('test.user@ex.com');
    await practiceFormPage.genderMaleRadio.click();
    // Intentionally skip mobile field
    
    // Try to submit
    await practiceFormPage.submitButton.click();
    
    // Verify form prevents submission using HTML5 validation (no custom error classes)
    // Check that mobile input is invalid and form didn't submit (no modal appears)
    const isValid = await practiceFormPage.isMobileValid();
    expect(isValid).toBe(false);
    await expect(practiceFormPage.modal).not.toBeVisible();
  });

  test('Forms -> Practice Form - keyboard navigation through form elements', async ({ navigationPage, practiceFormPage, page }) => {
    // TC-043: Keyboard navigation through form elements
    await navigationPage.goTo('Forms', 'Practice Form');
    
    // Start with first input
    await practiceFormPage.firstNameInput.focus();
    
    // Tab through form elements
    await page.keyboard.press('Tab');
    await expect(practiceFormPage.lastNameInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(practiceFormPage.emailInput).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(practiceFormPage.genderMaleRadio).toBeFocused();
    
    // Test activating radio with keyboard
    await page.keyboard.press('Space');
    await expect(practiceFormPage.genderMaleRadio).toBeChecked();
    
    // Continue tabbing through other elements
    await page.keyboard.press('Tab');
    await expect(practiceFormPage.mobileInput).toBeFocused();
  });

  test('Forms -> Practice Form - large form data submission performance', async ({ navigationPage, practiceFormPage }) => {
    // TC-046: Large form data submission performance (smoke)
    await navigationPage.goTo('Forms', 'Practice Form');
    
    // Fill form with long strings
    const longString = 'A'.repeat(500);
    
    await practiceFormPage.firstNameInput.fill(longString);
    await practiceFormPage.lastNameInput.fill(longString);
    await practiceFormPage.emailInput.fill('test@example.com');
    await practiceFormPage.genderMaleRadio.click();
    await practiceFormPage.mobileInput.fill('5551234567');
    await practiceFormPage.currentAddressTextarea.fill(longString);
    
    // Measure submission time
    const startTime = Date.now();
    await practiceFormPage.submitButton.click();
    
    // Wait for modal to appear and measure time
    await expect(practiceFormPage.modal).toBeVisible();
    const endTime = Date.now();
    
    // Verify submission completes within acceptable threshold (5s)
    const submissionTime = endTime - startTime;
    expect(submissionTime).toBeLessThan(5000);
  });
});

