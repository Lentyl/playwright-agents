import { test, expect } from '../../fixtures/pagesFixtures';

// TC-FI-PLIST — Participant List (Financial Institution role)
test.describe('TC-FI-PLIST — Participant List, Financial Institution role', () => {
  test.beforeEach(async ({ loginAsFinancialInstitution, financialInstitutionParticipantListPage }) => {
    await loginAsFinancialInstitution();
    await financialInstitutionParticipantListPage.open();
    await expect(financialInstitutionParticipantListPage.heading).toBeVisible();
  });

  test('TC-FI-PLIST-001 shows participant columns, the default first page, and correctly sorted values', async ({ financialInstitutionParticipantListPage }) => {
    await expect(financialInstitutionParticipantListPage.columnHeader('Imię')).toBeVisible();
    await expect(financialInstitutionParticipantListPage.columnHeader('Nazwisko')).toBeVisible();
    await expect(financialInstitutionParticipantListPage.columnHeader('PESEL')).toBeVisible();
    await expect(financialInstitutionParticipantListPage.columnHeader('Zlecenie')).toBeVisible();
    await expect(financialInstitutionParticipantListPage.paginationStatus).toContainText(/Pozycje od 1 do 10 z/);
    await expect(financialInstitutionParticipantListPage.bodyRows()).toHaveCount(10);

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
  });

  test('TC-FI-PLIST-002 reveals the advanced participant filters', async ({ financialInstitutionParticipantListPage }) => {
    await financialInstitutionParticipantListPage.showMoreFilters();
    await expect(financialInstitutionParticipantListPage.firstNameFilter).toBeVisible();
    await expect(financialInstitutionParticipantListPage.lastNameFilter).toBeVisible();
    await expect(financialInstitutionParticipantListPage.emailFilter).toBeVisible();
    await expect(financialInstitutionParticipantListPage.peselFilter).toBeVisible();
  });

  test('TC-FI-PLIST-003 filters and validates each participant field independently', async ({ financialInstitutionParticipantListPage }) => {
    await expect(financialInstitutionParticipantListPage.bodyRows().first()).toBeVisible();
    const firstRowCells = await financialInstitutionParticipantListPage.bodyRows().first().locator('td').allTextContents();
    const validFilters = {
      firstName: firstRowCells[1].trim(),
      lastName: firstRowCells[2].trim(),
      email: '',
      pesel: firstRowCells[3].trim(),
    };
    const emptyFilters = {
      firstName: '',
      lastName: '',
      email: '',
      pesel: '',
    };

    await test.step('filters by first name', async () => {
      await financialInstitutionParticipantListPage.search({
        ...emptyFilters,
        firstName: validFilters.firstName,
      });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).not.toBeVisible();
      await expect(financialInstitutionParticipantListPage.bodyRows().first()).toContainText(validFilters.firstName);
    });

    await test.step('filters by last name', async () => {
      await financialInstitutionParticipantListPage.search({
        ...emptyFilters,
        lastName: validFilters.lastName,
      });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).not.toBeVisible();
      await expect(financialInstitutionParticipantListPage.bodyRows().first()).toContainText(validFilters.lastName);
    });

    await test.step('filters by PESEL', async () => {
      await financialInstitutionParticipantListPage.search({
        ...emptyFilters,
        pesel: validFilters.pesel,
      });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).not.toBeVisible();
      await expect(financialInstitutionParticipantListPage.bodyRows().first()).toContainText(validFilters.pesel);
    });

    await test.step('filters by email and shows the complete participant record', async () => {
      await financialInstitutionParticipantListPage.search({
        ...emptyFilters,
        email: 'mariusz',
      });

      await expect(financialInstitutionParticipantListPage.emailFilter).toHaveValue('mariusz');
      await expect(financialInstitutionParticipantListPage.bodyRows()).toHaveCount(1);
      await expect(financialInstitutionParticipantListPage.paginationStatus).toContainText('Pozycje od 1 do 1 z 1');
      await expect(financialInstitutionParticipantListPage.participantCell(1)).toHaveText('1');
      await expect(financialInstitutionParticipantListPage.participantCell(2)).toHaveText('TAJPKFR');
      await expect(financialInstitutionParticipantListPage.participantCell(3)).toHaveText('DRFUW');
      await expect(financialInstitutionParticipantListPage.participantCell(4)).toHaveText('95091225597');
      await expect(financialInstitutionParticipantListPage.participantCell(5)).toHaveText('');
      await expect(financialInstitutionParticipantListPage.participantCell(6)).toHaveText('');
      await expect(financialInstitutionParticipantListPage.participantCell(7).locator('.fa-check-circle')).toBeVisible();
      await expect(financialInstitutionParticipantListPage.participantCell(8).locator('.fa-check-circle')).toBeVisible();
      await expect(financialInstitutionParticipantListPage.participantCell(9)).toHaveText('Zlecenie');
    });

    await test.step('rejects an unknown first name while remaining filters are valid', async () => {
      await financialInstitutionParticipantListPage.search({
        ...validFilters,
        firstName: 'ZZZ_NONEXISTENT_PARTICIPANT',
      });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).toBeVisible();
      await expect(financialInstitutionParticipantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
    });

    await test.step('rejects an unknown last name while remaining filters are valid', async () => {
      await financialInstitutionParticipantListPage.search({
        ...validFilters,
        lastName: 'ZZZ_NONEXISTENT_SURNAME',
      });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).toBeVisible();
      await expect(financialInstitutionParticipantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
    });

    await test.step('blocks a malformed email while remaining filters are valid', async () => {
      await financialInstitutionParticipantListPage.fillFilters({
        ...validFilters,
        email: 'invalid-email',
      });
      await financialInstitutionParticipantListPage.searchButton.click();

      expect(await financialInstitutionParticipantListPage.emailValidationMessage()).toContain('@');
    });

    await test.step('rejects an alphanumeric PESEL while remaining filters are valid', async () => {
      await financialInstitutionParticipantListPage.search({
        ...validFilters,
        pesel: '4405140135A',
      });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).toBeVisible();
      await expect(financialInstitutionParticipantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
    });
  });

  test('TC-FI-PLIST-004 narrows results when first name and surname identify a displayed participant', async ({ financialInstitutionParticipantListPage }) => {
    await expect(financialInstitutionParticipantListPage.bodyRows().first()).toBeVisible();
    const firstRowCells = await financialInstitutionParticipantListPage.bodyRows().first().locator('td').allTextContents();
    const firstName = firstRowCells[1].trim();
    const lastName = firstRowCells[2].trim();
    await financialInstitutionParticipantListPage.search({ firstName, lastName });

    await expect(financialInstitutionParticipantListPage.noMatchingRows).not.toBeVisible();
    await expect(financialInstitutionParticipantListPage.bodyRows().first()).toContainText(firstName);
    await expect(financialInstitutionParticipantListPage.bodyRows().first()).toContainText(lastName);
  });

  test('TC-FI-PLIST-005 returns an empty state for invalid PESEL values', async ({ financialInstitutionParticipantListPage }) => {
    await test.step('returns an empty state for a 10-digit PESEL', async () => {
      await financialInstitutionParticipantListPage.search({ pesel: '4405140135' });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).toBeVisible();
    });

    await test.step('returns an empty state for a 12-digit PESEL', async () => {
      await financialInstitutionParticipantListPage.search({ pesel: '440514013599' });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).toBeVisible();
    });

    await test.step('returns an empty state for an alphanumeric PESEL', async () => {
      await financialInstitutionParticipantListPage.search({ pesel: '4405140135A' });

      await expect(financialInstitutionParticipantListPage.noMatchingRows).toBeVisible();
    });
  });

  test('TC-FI-PLIST-006 supports page-size changes and toggles first-name sorting', async ({ financialInstitutionParticipantListPage, page }) => {
    await financialInstitutionParticipantListPage.pageSizeSelect.selectOption('25');
    await expect(financialInstitutionParticipantListPage.pageSizeSelect).toHaveValue('25');
    await expect(financialInstitutionParticipantListPage.bodyRows()).toHaveCount(25);
    await financialInstitutionParticipantListPage.sortButton('Imię').click();
    await expect(financialInstitutionParticipantListPage.columnHeader('Imię')).toHaveAttribute('aria-sort', 'ascending');
    await financialInstitutionParticipantListPage.sortButton('Imię').click();
    await expect(financialInstitutionParticipantListPage.columnHeader('Imię')).toHaveAttribute('aria-sort', 'descending');
  });
});