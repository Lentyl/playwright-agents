import { Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export class EmployerTrainingsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.getByRole('link', {
      name: /Szkolenia/i,
    }).click();
  }
}

export default EmployerTrainingsPage;