import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class WebTablesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async addRow(data: { firstName: string; lastName: string; email: string; age: number; salary: number; department: string }) {
    await this.page.click('#addNewRecordButton');
    await this.page.fill('#firstName', data.firstName);
    await this.page.fill('#lastName', data.lastName);
    await this.page.fill('#userEmail', data.email);
    await this.page.fill('#age', String(data.age));
    await this.page.fill('#salary', String(data.salary));
    await this.page.fill('#department', data.department);
    await this.page.click('#submit');
  }

  async editRowByEmail(email: string, updates: Partial<{ salary: number }>) {
    // Find the row container that contains the email, then click the first button (Edit)
    const row = this.page.locator(`.rt-tr-group:has-text("${email}")`).first();
    await row.waitFor({ state: 'visible', timeout: 5000 });
    const btns = row.locator('button');
    if (await btns.count() === 0) {
      // fallback: try an XPath-based fallback
      await this.page.locator(`//span[text()="${email}"]/ancestor::div[contains(@class,'rt-tr')]/div/button[1]`).click();
    } else {
      await btns.first().click();
    }
    if (updates.salary !== undefined) {
      await this.page.fill('#salary', String(updates.salary));
    }
    await this.page.click('#submit');
  }

  async deleteRowByEmail(email: string) {
    const row = this.page.locator(`.rt-tr-group:has-text("${email}")`).first();
    await row.waitFor({ state: 'visible', timeout: 5000 });
    const btns = row.locator('button');
    if (await btns.count() > 1) {
      await btns.nth(1).click();
    } else {
      await this.page.locator(`//span[text()="${email}"]/ancestor::div[contains(@class,'rt-tr')]/div/button[2]`).click();
    }
  }

  getCellByText(text: string) { return this.page.getByText(text); }
}
