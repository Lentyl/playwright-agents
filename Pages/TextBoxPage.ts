import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class TextBoxPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly currentAddressTextarea: Locator;
  readonly permanentAddressTextarea: Locator;
  readonly submitButton: Locator;
  readonly outputDiv: Locator;
  readonly pageHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.fullNameInput = page.locator('#userName');
    this.emailInput = page.locator('#userEmail');
    this.currentAddressTextarea = page.locator('#currentAddress');
    this.permanentAddressTextarea = page.locator('#permanentAddress');
    this.submitButton = page.locator('#submit');
    this.outputDiv = page.locator('#output');
    this.pageHeader = page.locator('.main-header, h1, .text-center');
  }

  async fillForm(data: { fullName: string; email: string; currentAddress: string; permanentAddress: string }) {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.currentAddressTextarea.fill(data.currentAddress);
    await this.permanentAddressTextarea.fill(data.permanentAddress);
  }

  async submitForm() {
    await this.submitButton.click();
  }
}

