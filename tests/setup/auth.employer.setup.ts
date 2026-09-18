import { test as setup, expect } from '@playwright/test';
import { credentials } from '../../fixtures/pagesFixtures';
import LoginPage from '../../pages/LoginPage';
import { APP_PATH } from '../../pages/BasePage';

const storageStatePath = '.auth/employer.json';

setup('authenticate employer', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.open();
  await loginPage.login(credentials.employer.login, credentials.employer.password);
  await expect(page).toHaveURL(new RegExp(`${APP_PATH}/employer$`));
  await page.context().storageState({ path: storageStatePath });
});