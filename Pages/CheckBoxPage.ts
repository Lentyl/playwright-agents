import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckBoxPage extends BasePage {
  readonly resultDiv: Locator;

  constructor(page: Page) {
    super(page);
    this.resultDiv = page.locator('#result');
  }

  checkboxDynamic = async (text: string, tag: string = 'checkbox'): Promise<Locator> => this.page.locator(`//${tag}[normalize-space()="${text}"]`);

  async selectCheckbox(nodeName: string) {
    await this.page.waitForSelector('.rc-tree-checkbox', { state: 'visible' });
    await this.page.locator('.rc-tree-checkbox').click();
  }

  async isCheckboxChecked(nodeName: string): Promise<boolean> {
    const checkbox = this.page.locator('.rc-tree-checkbox');
    return await checkbox.getAttribute('aria-checked') === 'true';
  }
}

