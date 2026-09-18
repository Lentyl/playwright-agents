import { test, expect } from '../../fixtures/pagesFixtures';

// TC-LIST — Tables, Filters, Pagination (Employer role)
test.describe('TC-LIST — Tables & Filters', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-LIST-001 participant list default filters and columns', async ({ participantListPage }) => {
    await participantListPage.open();
    await expect(participantListPage.heading).toBeVisible();

    await expect(participantListPage.resignationFilter.locator('option:checked')).toHaveText('Wszystkie');
    await expect(participantListPage.employedFilter.locator('option:checked')).toHaveText('TAK');

    const columns = [
      'Imię', 'Nazwisko', 'PESEL', 'Numer kadrowy', 'Dokument',
      'Adres email', 'Numer Telefonu', 'Rezygnacja', 'Zatrudniony',
      'Wypłata po 60 r.', 'Zlecenie',
    ];
    for (const column of columns) {
      await expect(participantListPage.columnHeader(column).first()).toBeVisible();
    }

    await expect(participantListPage.paginationStatus).toContainText(/Pozycji .* dostępnych/);
  });

  test('TC-LIST-002 filtering by a non-existent name returns zero rows', async ({ participantListPage }) => {
    await participantListPage.open();
    await participantListPage.filterByFirstName('Zzzznieistniejacy');

    await expect(participantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
  });

  test('TC-LIST-003 sortable column header toggles ordering', async ({ participantListPage }) => {
    await participantListPage.open();
    const sortButton = participantListPage.table.getByRole('button', { name: /^Imię/ });

    await expect(sortButton).toBeVisible();
    await sortButton.click();
    await expect(participantListPage.table).toBeVisible();
  });

  test('TC-LIST-004 page-size selector accepts a larger value', async ({ participantListPage }) => {
    await participantListPage.open();
    await participantListPage.pageSizeSelect.selectOption('25');

    await expect(participantListPage.pageSizeSelect).toHaveValue('25');
  });

  test('TC-LIST-005 file upload history table exposes expected columns', async ({ fileUploadPage }) => {
    await fileUploadPage.open();
    await expect(fileUploadPage.heading).toBeVisible();
    await expect(fileUploadPage.historyHeading).toBeVisible();

    const columns = ['Lp', 'Nazwa pliku', 'Osoba przesyłająca plik', 'Data przesłania pliku', 'Plik źródłowy', 'Akcje'];
    for (const column of columns) {
      await expect(fileUploadPage.columnHeader(column).first()).toBeVisible();
    }
  });

  test('TC-LIST-006 admin user table columns and search', async ({ userAdminPage }) => {
    await userAdminPage.open();
    await expect(userAdminPage.heading).toBeVisible();

    const columns = ['Id', 'Nazwa użytkownika', 'Login', 'Adres e-mail', 'Aktywny', 'Data ostatniego logowania'];
    for (const column of columns) {
      await expect(userAdminPage.columnHeader(column).first()).toBeVisible();
    }

    await expect(userAdminPage.bodyRows().first()).toBeVisible();

    // Search is data-driven off the first row's login so it does not assume a
    // specific account exists in the table.
    const firstLogin = (await userAdminPage.bodyRows().first().locator('td').nth(2).innerText()).trim();
    await userAdminPage.search(firstLogin);
    await expect(userAdminPage.bodyRows()).toHaveCount(1);
    await expect(userAdminPage.bodyRows().first()).toContainText(firstLogin);
  });
});
