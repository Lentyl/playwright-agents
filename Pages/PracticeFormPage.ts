import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PracticeFormPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly genderMaleRadio: Locator;
  readonly mobileInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly daySelect: Locator;
  readonly subjectsInput: Locator;
  readonly sportsHobby: Locator;
  readonly pictureInput: Locator;
  readonly currentAddressTextarea: Locator;
  readonly submitButton: Locator;
  readonly modal: Locator;
  readonly modalBody: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#userEmail');
    this.genderMaleRadio = page.locator('#gender-radio-1');
    this.mobileInput = page.locator('#userNumber');
    this.dateOfBirthInput = page.locator('#dateOfBirthInput');
    this.monthSelect = page.locator('.react-datepicker__month-select');
    this.yearSelect = page.locator('.react-datepicker__year-select');
    this.daySelect = page.locator('.react-datepicker__day--selected, .react-datepicker__day:not(.react-datepicker__day--disabled)').first();
    this.subjectsInput = page.locator('#subjectsInput');
    this.sportsHobby = page.locator('#hobbies-checkbox-1');
    this.pictureInput = page.locator('#uploadPicture');
    this.currentAddressTextarea = page.locator('#currentAddress');
    this.submitButton = page.locator('#submit');
    this.modal = page.locator('.modal-content');
    this.modalBody = page.locator('.modal-body');
  }

  /** Return computed focus-related styles for the currently focused element */
  async getFocusedElementStyles() {
    const focusedHandle = this.page.locator(':focus').first();
    if (!(await focusedHandle.count())) return null;
    return focusedHandle.evaluate((el: Element) => {
      const styles = window.getComputedStyle(el as Element);
      return {
        outline: styles.outline,
        outlineWidth: styles.outlineWidth,
        boxShadow: styles.boxShadow,
        border: styles.border
      };
    });
  }

  /** Press Tab n times and return the currently focused element locator */
  async tabN(n: number) {
    for (let i = 0; i < n; i++) {
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(30);
    }
    return this.page.locator(':focus').first();
  }

  /** Return whether the mobile input currently passes HTML5 validity checks */
  async isMobileValid() {
    return this.mobileInput.evaluate((el: Element) => {
      const input = el as HTMLInputElement;
      return !!(input && input.validity && input.validity.valid);
    });
  }
}

