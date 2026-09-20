import { test, expect } from '../../fixtures/pagesFixtures';
import { stat } from 'node:fs/promises';

test.describe('TC-FI-REPORTS - Reports', () => {
  test.beforeEach(async ({ loginAsFinancialInstitution, financialInstitutionReportsPage: reportsPage }) => {
    await loginAsFinancialInstitution();
    await reportsPage.open();
    await expect(reportsPage.heading).toBeVisible();
  });

  test('TC-FI-REPORTS-001 exposes all available report types', async ({ financialInstitutionReportsPage: reportsPage }) => {
    await expect(reportsPage.reportSelect).toHaveText(/Umowy PPK/);
    await expect(reportsPage.reportSelect).toHaveText(/Użytkownicy serwisu PPK/);
    await expect(reportsPage.reportSelect).toHaveText(/Raport z informacją o linkach/);
    await expect(reportsPage.reportSelect).toHaveText(/Raport firm przesyłających korekty/);
    await expect(reportsPage.reportSelect).toHaveText(/Raport z rozliczenia skladek/);
  });

  test('TC-FI-REPORTS-002 shows the correct parameters for dated reports', async ({ financialInstitutionReportsPage: reportsPage, page }) => {
    await reportsPage.selectReport('Umowy PPK');
    await expect(page).toHaveURL(/\/manager\/report\/0$/);
    await expect(reportsPage.fromDate).toBeVisible();
    await expect(reportsPage.toDate).toBeVisible();
    await expect(reportsPage.generateButton).toBeVisible();

    await reportsPage.selectReport('Raport z rozliczenia skladek');
    await expect(page).toHaveURL(/\/manager\/report\/4$/);
    await expect(reportsPage.employerFilter).toBeVisible();
  });

  test('TC-FI-REPORTS-003 downloads a nonempty users report file', async ({
    financialInstitutionReportsPage: reportsPage,
    page,
  }, testInfo) => {
    test.setTimeout(90_000);
    await reportsPage.selectReport('Użytkownicy serwisu PPK');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      reportsPage.generateButton.click({ noWaitAfter: true }),
    ]);
    const savedFile = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(savedFile);

    expect(download.suggestedFilename()).toMatch(/^\d+_PPK_RaportUzytkownicyPPK\.xlsm\.xls$/);
    expect(await download.failure()).toBeNull();
    expect((await stat(savedFile)).size).toBeGreaterThan(0);
  });

  test('TC-FI-REPORTS-004 downloads a nonempty links report file', async ({
    financialInstitutionReportsPage: reportsPage,
    page,
  }, testInfo) => {
    test.setTimeout(90_000);
    await reportsPage.selectReport('Raport z informacją o linkach');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      reportsPage.generateButton.click({ noWaitAfter: true }),
    ]);
    const savedFile = testInfo.outputPath(download.suggestedFilename());
    await download.saveAs(savedFile);

    expect(download.suggestedFilename()).toMatch(/^\d+_RaportLinkiPPK\.xls\.xls$/);
    expect(await download.failure()).toBeNull();
    expect((await stat(savedFile)).size).toBeGreaterThan(0);
  });

  test('TC-FI-REPORTS-005 validates missing dates for PPK agreements', async () => {
    test.fixme(true, 'The application returns a Whitelabel Error Page instead of validation feedback when dates are empty.');
  });
});