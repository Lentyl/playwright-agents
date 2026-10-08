import { Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export class EmployerInformationMaterialsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.getByRole('link', {
      name: /Materiały informacyjne/i,
    }).click();
  }

  async openInformationMaterials(): Promise<void> {
    await this.open();
  }
}

export default EmployerInformationMaterialsPage;