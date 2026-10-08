import { test, expect } from '../../fixtures/pagesFixtures';

// TC-LIST — Tables, Filters, Pagination (Employer role)
test.describe('TC-LIST — Tables & Filters', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-LIST-001 participant list default filters and columns', async ({ page, employerParticipantListPage }) => {
    await employerParticipantListPage.open();
    await expect(employerParticipantListPage.heading).toBeVisible();
    await expect(employerParticipantListPage.resignationFilter.locator('option:checked')).toHaveText('Wszystkie');
    await expect(employerParticipantListPage.employedFilter.locator('option:checked')).toHaveText('TAK');

    const columns = [
      'Imię', 'Nazwisko', 'PESEL', 'Numer kadrowy', 'Dokument',
      'Adres email', 'Numer Telefonu', 'Rezygnacja', 'Zatrudniony',
      'Wypłata po 60 r.', 'Zlecenie',
    ];
    for (const column of columns) {
      await expect(employerParticipantListPage.columnHeader(column).first()).toBeVisible();
    }
    await expect(page.locator('#searchForm')).toMatchAriaSnapshot(`
    - text: Imię
    - textbox "Imię"
    - text: Nazwisko
    - textbox "Nazwisko"
    - text: PESEL
    - textbox "PESEL"
    - text: Rezygnacja
    - combobox "Rezygnacja":
      - option "Wszystkie" [selected]
      - option "TAK"
      - option "NIE"
    - text: Zatrudniony
    - combobox "Zatrudniony":
      - option "Wszystkie"
      - option "TAK" [selected]
      - option "NIE"
    - button "Wyszukaj"
    `);
    await expect(page.locator('#customer-table_wrapper')).toMatchAriaSnapshot(`
    - text: Pokaż
    - combobox "Pokaż pozycji":
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
      - option /\\d+/
    - text: "pozycji Szukaj:"
    - searchbox "Szukaj:"
    - table:
      - rowgroup:
        - 'row /Lp\\. Imię Imię: Activate to sort Nazwisko Nazwisko: Activate to sort PESEL PESEL: Activate to sort Numer kadrowy Numer kadrowy: Activate to sort Dokument Dokument: Activate to sort Adres email Adres email: Activate to sort Numer Telefonu Numer Telefonu: Activate to sort Rezygnacja Zatrudniony Wypłata po \\d+ r\\. Zlecenie/':
          - columnheader
          - columnheader "Lp."
          - 'columnheader "Imię Imię: Activate to sort"':
            - text: ""
            - 'button "Imię: Activate to sort"'
          - 'columnheader "Nazwisko Nazwisko: Activate to sort"':
            - text: ""
            - 'button "Nazwisko: Activate to sort"'
          - 'columnheader "PESEL PESEL: Activate to sort"':
            - text: ""
            - 'button "PESEL: Activate to sort"'
          - 'columnheader "Numer kadrowy Numer kadrowy: Activate to sort"':
            - text: ""
            - 'button "Numer kadrowy: Activate to sort"'
          - 'columnheader "Dokument Dokument: Activate to sort"':
            - text: ""
            - 'button "Dokument: Activate to sort"'
          - 'columnheader "Adres email Adres email: Activate to sort"':
            - text: ""
            - 'button "Adres email: Activate to sort"'
          - 'columnheader "Numer Telefonu Numer Telefonu: Activate to sort"':
            - text: ""
            - 'button "Numer Telefonu: Activate to sort"'
          - columnheader "Rezygnacja"
          - columnheader "Zatrudniony"
          - columnheader /Wypłata po \\d+ r\\./
          - columnheader "Zlecenie"
      - rowgroup:
        - row "Wczytywanie...":
          - cell "Wczytywanie..."
    - status: Pozycji 0 z 0 dostępnych
    - navigation "pagination":
      - list:
        - listitem:
          - link "Previous" [disabled]: Poprzednia
        - listitem:
          - link "Next" [disabled]: Następna
    `);
    await page.getByRole('textbox', { name: 'Imię' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).fill('Mariusz');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).fill('');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).fill('Ala');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.locator('tbody')).toContainText('ALA');
    await expect(page.locator('tbody')).toContainText('ALA');
    await page.getByRole('button', { name: 'Zlecenie' }).click();
    await expect(employerParticipantListPage.bodyRows().first()).toBeVisible();
    await expect(employerParticipantListPage.paginationStatus).toContainText(/Pozycji .* dostępnych/);
  });

  test('TC-LIST-002 filtering check', async ({ employerParticipantListPage, page }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.filterByFirstName('Zzzznieistniejacy');
    await page.getByRole('textbox', { name: 'Imię' }).fill('Anna');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Joanna' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'testowa' })).toBeVisible();
    await expect(page.locator('tbody')).toMatchAriaSnapshot(`- cell "AFY720307"`);
    await expect(page.locator('tbody')).toContainText('AFY720307');
    await expect(page.locator('i').nth(1)).toBeVisible();
    await page.getByRole('textbox', { name: 'Nazwisko' }).fill('testowa');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByLabel('Zatrudniony').selectOption('NO');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Nie znaleziono pasujących' })).toBeVisible();
    await page.getByLabel('Zatrudniony').selectOption('YES');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'AFY720307' })).toBeVisible();
    await page.getByLabel('Rezygnacja').selectOption('YES');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Nie znaleziono pasujących' })).toBeVisible();
    await page.getByLabel('Rezygnacja').selectOption('NO');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Joanna' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'testowa' })).toBeVisible();
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Nazwisko' }).fill('Ala');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).clear();
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'ALA' }).nth(1)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'XKALA' })).toBeVisible();
    await page.getByRole('textbox', { name: 'PESEL' }).click();
    await page.getByRole('textbox', { name: 'PESEL' }).fill('39052278808');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'NOCCCCHYT' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'XKALA' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '39052278808' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'VZQCMVUFSSNEC' })).toBeVisible();
    await expect(page.getByText('Pozycje od 1 do 1 z 1 łącznie')).toBeVisible();
  });

  // do naprawy
  test('TC-LIST-003 sortable column header toggles ordering', async ({ page, employerParticipantListPage, financialInstitutionParticipantListPage }) => {
    await employerParticipantListPage.open();
    const sortButton = employerParticipantListPage.table.getByRole('button', { name: /^Imię/ });

    await expect(sortButton).toBeVisible();
    await page.pause();
    const sortableColumns = [
      { name: 'Imię', index: 2 },
      { name: 'Nazwisko', index: 3 },
      { name: 'PESEL', index: 4 },
    ];

    for (const column of sortableColumns) {
      const initialValues = await financialInstitutionParticipantListPage.columnValues(column.index);
      await financialInstitutionParticipantListPage.sortButton(column.name).click();
      await expect(financialInstitutionParticipantListPage.columnHeader(column.name)).toHaveAttribute('aria-sort', 'ascending');
      await expect.poll(() => financialInstitutionParticipantListPage.columnValues(column.index)).not.toEqual(initialValues);
      const ascendingValues = await financialInstitutionParticipantListPage.columnValues(column.index);
      expect(ascendingValues).toEqual([...ascendingValues].sort((left, right) => left.localeCompare(right, 'pl')));

      await financialInstitutionParticipantListPage.sortButton(column.name).click();
      await expect(financialInstitutionParticipantListPage.columnHeader(column.name)).toHaveAttribute('aria-sort', 'descending');
      await expect.poll(() => financialInstitutionParticipantListPage.columnValues(column.index)).not.toEqual(ascendingValues);
      const descendingValues = await financialInstitutionParticipantListPage.columnValues(column.index);
      expect(descendingValues).toEqual([...descendingValues].sort((left, right) => right.localeCompare(left, 'pl')));
    }
    await sortButton.click();
    await expect(employerParticipantListPage.table).toBeVisible();
  });

  test('TC-LIST-004 page-size selector accepts a larger value', async ({ page, employerParticipantListPage }) => {
    await employerParticipantListPage.open();
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByText('Pozycje od 1 do 10 z')).toBeVisible();
    await employerParticipantListPage.pageSizeSelect.selectOption('25');
    await expect(employerParticipantListPage.bodyRows()).toHaveCount(25);
    await expect(page.getByText('brakuje numeru telefonu lub adresu e-mail. Uzupełnij dane, a dzięki temu uczestnicy łatwiej aktywują dostęp do Moje NN.')).toBeVisible();
    await expect(employerParticipantListPage.pageSizeSelect).toHaveValue('25');
  });

//do zrobienia
  test('TC-LIST-006 admin user table columns and search', async ({ employerUserAdminPage, page }) => {
    await page.pause();
    await employerUserAdminPage.open();
    await expect(employerUserAdminPage.heading).toBeVisible();

    const columns = ['Id', 'Nazwa użytkownika', 'Login', 'Adres e-mail', 'Aktywny', 'Data ostatniego logowania'];
    for (const column of columns) {
      await expect(employerUserAdminPage.columnHeader(column).first()).toBeVisible();
    }

    await expect(employerUserAdminPage.bodyRows().first()).toBeVisible();

    // Search is data-driven off the first row's login so it does not assume a
    // specific account exists in the table.
    const firstLogin = (await employerUserAdminPage.bodyRows().first().locator('td').nth(2).innerText()).trim();
    await employerUserAdminPage.search(firstLogin);
    await expect(employerUserAdminPage.bodyRows()).toHaveCount(1);
    await expect(employerUserAdminPage.bodyRows().first()).toContainText(firstLogin);
  });




  // TC-PROC — Actions available from "Zlecenie" menu

  test.describe('TC-PROC — Participant processes', () => {
    test.beforeEach(async ({ loginAsEmployer }) => {
      await loginAsEmployer();
    });

    test('TC-PROC-001 should display all process options in order menu', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await expect(page.getByText('Rezygnacja z odprowadzania wpłat')).toBeVisible();
      await expect(page.getByText('Zmiana wysokości wpłaty podstawowej Pracownika')).toBeVisible();
      await expect(page.getByText('Deklaracja wpłaty dodatkowej Pracownika')).toBeVisible();
      await expect(page.getByText('Zmiana danych')).toBeVisible();
      await expect(page.getByText('Wznowienie odprowadzania wpłat')).toBeVisible();
      await expect(page.getByText('Wypłata transferowa do Nationale-Nederlanden')).toBeVisible();
      await expect(page.getByText('Zakończenie lub wznowienie zatrudnienia')).toBeVisible();
    });

    test('TC-PROC-002 should open resignation process', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await page
        .getByText('Rezygnacja z odprowadzania wpłat')
        .click();

      // TODO:
      // await expect(page).toHaveURL(/rezygnacja/i);
      // await expect(page.getByRole('heading')).toContainText('Rezygnacja');

      await expect(page).not.toHaveURL(/customer\/list$/);
    });

    test('TC-PROC-003 should open basic contribution change process', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await page
        .getByText('Zmiana wysokości wpłaty podstawowej Pracownika')
        .click();

      // TODO:
      // URL
      // nagłówek formularza
      // dane uczestnika

      await expect(page).not.toHaveURL(/customer\/list$/);
    });

    test('TC-PROC-004 should open additional contribution declaration process', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await page
        .getByText('Deklaracja wpłaty dodatkowej Pracownika')
        .click();

      await expect(page).not.toHaveURL(/customer\/list$/);
    });

    test('TC-PROC-005 should open participant data change process', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await page
        .getByText('Zmiana danych')
        .click();

      await expect(page).not.toHaveURL(/customer\/list$/);
    });

    test('TC-PROC-006 should open contribution resumption process', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await page
        .getByText('Wznowienie odprowadzania wpłat')
        .click();

      await expect(page).not.toHaveURL(/customer\/list$/);
    });

    test('TC-PROC-007 should open transfer to NN process', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await page
        .getByText('Wypłata transferowa do Nationale-Nederlanden')
        .click();

      await expect(page).not.toHaveURL(/customer\/list$/);
    });

    test('TC-PROC-008 should open employment status change process', async ({
      page,
      employerParticipantListPage,
    }) => {
      await employerParticipantListPage.open();

      await page.getByRole('button', { name: 'Zlecenie' }).first().click();

      await page
        .getByText('Zakończenie lub wznowienie zatrudnienia')
        .click();

      await expect(page).not.toHaveURL(/customer\/list$/);
    });
  });
});
