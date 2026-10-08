import { test as setup, expect } from '@playwright/test';
import { credentials } from '../../fixtures/pagesFixtures';
import LoginPage from '../../pages/LoginPage';
import { APP_PATH } from '../../pages/BasePage';

const storageStatePath = '.auth/financial-institution.json';

setup('authenticate financial institution', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(credentials.financialInstitution.login, credentials.financialInstitution.password);
  await expect(page).toHaveURL(new RegExp(`${APP_PATH}/manager/login/fork$`));
  await page.context().storageState({ path: storageStatePath });
});