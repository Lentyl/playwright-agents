import { test, expect } from '../../fixtures/pagesFixtures';
  
  // TC-LIST — Tables, Filters, Pagination (Employer role)
  test.describe('TC-FU — File upload page test', () => {
    test.beforeEach(async ({ loginAsEmployer }) => {
      await loginAsEmployer();
    });
  
  test('TC-LIST-005 file upload history table exposes expected columns', async ({ page, employerFileUploadPage }) => {
    await employerFileUploadPage.open();
    await expect(employerFileUploadPage.heading).toBeVisible();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();

    const columns = ['Lp', 'Nazwa pliku', 'Osoba przesyłająca plik', 'Data przesłania pliku', 'Plik źródłowy', 'Akcje'];
    for (const column of columns) {
      await expect(employerFileUploadPage.columnHeader(column).first()).toBeVisible();
    }

  });

})