import { test, expect } from '../fixtures/fixtures';

test.describe('Forms -> Date Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Forms -> Date Picker - select date using date picker', async ({ navigationPage, datePickerPage }) => {
    // TC-017: Select date using date picker
    await navigationPage.goTo('Widgets', 'Date Picker');
    
    // Open date picker
    await datePickerPage.datePickerMonthYearInput.click();
    
    // Navigate to March 2024
    await datePickerPage.monthDropdown.selectOption('March');
    await datePickerPage.yearDropdown.selectOption('2024');
    
    // Select day 15
    await datePickerPage.day15.click();
    
    // Verify input displays selected date in expected format
    const inputValue = await datePickerPage.datePickerMonthYearInput.inputValue();
    expect(inputValue).toContain('03/15/2024');
  });

  test('Forms -> Date Picker - enter invalid date manually', async ({ navigationPage, datePickerPage }) => {
    // TC-018: Enter invalid date manually
    await navigationPage.goTo('Widgets', 'Date Picker');
    
    // Clear field and enter invalid date
    await datePickerPage.datePickerMonthYearInput.clear();
    await datePickerPage.datePickerMonthYearInput.fill('31/02/2024');
    
    // Blur field to trigger validation
    await datePickerPage.datePickerMonthYearInput.blur();
    
    // Verify field handles invalid date (rejects, normalizes, or flags as invalid)
    const inputValue = await datePickerPage.datePickerMonthYearInput.inputValue();
    
    // Should either be empty, corrected, or show validation styling
    if (inputValue === '31/02/2024') {
      // If still showing invalid date, check for validation styling
      await expect(datePickerPage.datePickerMonthYearInput).toHaveClass(/invalid/);
    } else {
      // Date was normalized or rejected (both acceptable behaviors)
      expect(inputValue).not.toBe('31/02/2024');
    }
  });
});

