import { test, expect, testData } from '../../fixtures/pagesFixtures';

// TC-REPORT — Reports & Returned Files (Employer role)
test.describe('TC-REPORT — Reports', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-REPORT-001 selecting a report reveals the generate action', async ({ reportsPage, page }) => {
    await reportsPage.open();
    await expect(reportsPage.heading).toBeVisible();

    for (const name of testData.reports) {
      await expect(reportsPage.reportSelect.getByRole('option', { name })).toHaveCount(1);
    }

    await reportsPage.selectReport('Raport Uczestników');
    await expect(page).toHaveURL(/employer\/report\/0/);
    await expect(reportsPage.generateButton).toBeVisible();
  });

  for (let i = 0; i < 5; i++) {
    test(`TC-REPORT-002 generate action appears for report option index ${i}`, async ({ reportsPage }) => {
      await reportsPage.open();
      await reportsPage.selectReport(testData.reports[i]);
      await expect(reportsPage.generateButton).toBeVisible();
    });
  }

  test('TC-REPORT-003 returned-files cards are all present', async ({ returnedFilesPage }) => {
    await returnedFilesPage.open();
    for (const name of testData.returnedFileReports) {
      await expect(returnedFilesPage.reportCard(name)).toBeVisible();
    }
  });

  test('TC-REPORT-004 returned-files page throws the datetimepicker JS error (KI-2)', async ({ returnedFilesPage, page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await returnedFilesPage.open();
    await expect(returnedFilesPage.reportCard(testData.returnedFileReports[0])).toBeVisible();

    // Confirms the known defect: the date-range widget fails to initialize.
    expect(errors.some((m) => m.includes('datetimepicker is not a function'))).toBe(true);
  });
});
