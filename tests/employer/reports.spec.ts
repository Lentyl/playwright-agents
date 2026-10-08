import { test, expect, testData } from '../../fixtures/pagesFixtures';

// TC-REPORT — Reports & Returned Files (Employer role)
test.describe('TC-REPORT — Reports', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-REPORT-001 selecting a report reveals the generate action', async ({ employerReportsPage, page }) => {
    await employerReportsPage.open();
    await expect(employerReportsPage.heading).toBeVisible();

    for (const name of testData.reports) {
      await expect(employerReportsPage.reportSelect.getByRole('option', { name })).toHaveCount(1);
    }

    await employerReportsPage.selectReport('Raport Uczestników');
    await expect(page).toHaveURL(/employer\/report\/0/);
    await expect(employerReportsPage.generateButton).toBeVisible();
  });

  for (let i = 0; i < 5; i++) {
    test(`TC-REPORT-002 generate action appears for report option index ${i}`, async ({ employerReportsPage }) => {
      await employerReportsPage.open();
      await employerReportsPage.selectReport(testData.reports[i]);
      await expect(employerReportsPage.generateButton).toBeVisible();
    });
  }

  test('TC-REPORT-003 returned-files cards are all present', async ({ employerReturnedFilesPage }) => {
    await employerReturnedFilesPage.open();
    for (const name of testData.returnedFileReports) {
      await expect(employerReturnedFilesPage.reportCard(name)).toBeVisible();
    }
  });

  test('TC-REPORT-004 returned-files page throws the datetimepicker JS error (KI-2)', async ({ employerReturnedFilesPage, page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await employerReturnedFilesPage.open();
    await expect(employerReturnedFilesPage.reportCard(testData.returnedFileReports[0])).toBeVisible();

    // Confirms the known defect: the date-range widget fails to initialize.
    expect(errors.some((m) => m.includes('datetimepicker is not a function'))).toBe(true);
  });
});
