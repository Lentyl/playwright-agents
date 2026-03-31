import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DatePickerPage extends BasePage {
  readonly datePickerMonthYearInput: Locator;

  constructor(page: Page) {
    super(page);
    this.datePickerMonthYearInput = page.locator('#datePickerMonthYearInput');
  }

  get monthDropdown() {
    return this.page.locator('.react-datepicker__month-select');
  }

  get yearDropdown() {
    return this.page.locator('.react-datepicker__year-select');
  }

  get day15() {
    return this.page.locator('.react-datepicker__day--015:not(.react-datepicker__day--outside-month)');
  }
}

