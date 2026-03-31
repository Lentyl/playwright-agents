import { test, expect } from '../fixtures/fixtures';

test.describe('Elements -> Text Box', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Elements -> Text Box - submit valid text box form', async ({ navigationPage, textBoxPage }) => {
    // TC-001: Submit valid text box form
    await navigationPage.goTo('Elements', 'Text Box');
    
    // Enter valid data into all fields
    await textBoxPage.fullNameInput.fill('John Doe');
    await textBoxPage.emailInput.fill('john@example.com');
    await textBoxPage.currentAddressTextarea.fill('123 Main St');
    await textBoxPage.permanentAddressTextarea.fill('456 Other St');
    
    // Submit the form
    await textBoxPage.submitButton.click();
    
    // Verify submission panel displays all entered values exactly
    await expect(textBoxPage.outputDiv).toBeVisible();
    await expect(textBoxPage.outputDiv).toContainText('Name:John Doe');
    await expect(textBoxPage.outputDiv).toContainText('Email:john@example.com');
    await expect(textBoxPage.outputDiv).toContainText('Current Address :123 Main St');
    await expect(textBoxPage.outputDiv).toContainText('Permananet Address :456 Other St');
  });

  test('Elements -> Text Box - validate email format rejection', async ({ navigationPage, textBoxPage }) => {
    // TC-002: Validate email format rejection
    await navigationPage.goTo('Elements', 'Text Box');
    
    // Enter invalid email format
    await textBoxPage.fullNameInput.fill('Jane');
    await textBoxPage.emailInput.fill('invalid-email');
    
    // Submit the form
    await textBoxPage.submitButton.click();
    
    // Verify email field shows invalid state (field border should be red)
    await expect(textBoxPage.emailInput).toHaveClass(/field-error/);
  });

  test('Elements -> Text Box - invalid input global error handling', async ({ navigationPage, textBoxPage }) => {
    // TC-050: Invalid input global error handling
    await navigationPage.goTo('Elements', 'Text Box');
    
    // Submit with mixed invalid inputs
    await textBoxPage.fullNameInput.fill(''); // Missing required field
    await textBoxPage.emailInput.fill('invalid@example'); // Invalid email
    await textBoxPage.submitButton.click();
    
    // Verify errors shown for each invalid field and no form submission
    await expect(textBoxPage.emailInput).toHaveClass(/field-error/);
    // Verify no submission occurred (output div should not be visible)
    await expect(textBoxPage.outputDiv).not.toBeVisible();
  });
});

