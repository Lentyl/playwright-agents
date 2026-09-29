import { test, expect, testData } from '../../fixtures/pagesFixtures';

// TC-EMP-PLIST — Participant List (Employer role)
test.describe('TC-EMP-PLIST — Participant List', () => {
  test.beforeEach(async ({ loginAsEmployer, participantListPage }) => {
    await loginAsEmployer();
    await participantListPage.open();
    await expect(participantListPage.heading).toBeVisible();
  });

  test('TC-EMP-PLIST-001 shows default filters, columns, and an empty initial state', async ({ participantListPage }) => {
    await expect(participantListPage.resignationFilter).toHaveValue('');
    await expect(participantListPage.employedFilter).toHaveValue('YES');
    await expect(participantListPage.columnHeader('Imię')).toBeVisible();
    await expect(participantListPage.columnHeader('Nazwisko')).toBeVisible();
    await expect(participantListPage.columnHeader('PESEL')).toBeVisible();
    await expect(participantListPage.columnHeader('Rezygnacja')).toBeVisible();
    await expect(participantListPage.columnHeader('Zatrudniony')).toBeVisible();
    await expect(participantListPage.columnHeader('Zlecenie')).toBeVisible();
    await expect(participantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
  });

  test('TC-EMP-PLIST-002 returns an explicit empty state for an unknown first name', async ({ participantListPage }) => {
    await participantListPage.search({ firstName: 'ZZZ_NONEXISTENT_PARTICIPANT' });

    await expect(participantListPage.noMatchingRows).toBeVisible();
    await expect(participantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
  });

  test('TC-EMP-PLIST-003 returns employed participants after submitting default filter values', async ({ participantListPage }) => {
    await participantListPage.search({
      firstName: '', lastName: '', pesel: '', resignation: '', employed: 'YES',
    });

    await expect(participantListPage.paginationStatus).toContainText(/łącznie/);
    await expect(participantListPage.bodyRows().first()).toBeVisible();
  });

  test('TC-EMP-PLIST-004 narrows results when first name and surname identify a displayed participant', async ({ participantListPage }) => {
    await participantListPage.search({
      firstName: '', lastName: '', pesel: '', resignation: '', employed: 'YES',
    });
    await expect(participantListPage.bodyRows().first()).toBeVisible();

    const cells = await participantListPage.bodyRows().first().locator('td').allTextContents();
    const firstName = cells[3].trim();
    const lastName = cells[4].trim();

    await participantListPage.search({ firstName, lastName });

    await expect(participantListPage.noMatchingRows).not.toBeVisible();
    await expect(participantListPage.bodyRows().first()).toContainText(firstName);
    await expect(participantListPage.bodyRows().first()).toContainText(lastName);
  });

  test('TC-EMP-PLIST-005 returns an empty state for a 10-digit PESEL', async ({ participantListPage }) => {
    await participantListPage.search({ pesel: testData.pesel.tooShort });

    await expect(participantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');


    await expect(participantListPage.noMatchingRows).toBeVisible();
  });

  test('TC-EMP-PLIST-006 returns an empty state for a 12-digit PESEL', async ({ participantListPage }) => {
    await participantListPage.search({ pesel: testData.pesel.tooLong });

    await expect(participantListPage.noMatchingRows).toBeVisible();
  });

  test('TC-EMP-PLIST-007 returns an empty state for an alphanumeric PESEL', async ({ participantListPage }) => {
    await participantListPage.search({ pesel: testData.pesel.nonNumeric });

    await expect(participantListPage.noMatchingRows).toBeVisible();
  });

  test('TC-EMP-PLIST-008 supports page-size changes and toggles first-name sorting', async ({ participantListPage }) => {
    await participantListPage.search({
      firstName: '', lastName: '', pesel: '', resignation: '', employed: 'YES',
    });
    await expect(participantListPage.bodyRows().first()).toBeVisible();

    await participantListPage.pageSizeSelect.selectOption('25');
    await expect(participantListPage.pageSizeSelect).toHaveValue('25');
    await expect(participantListPage.bodyRows()).toHaveCount(25);

    await participantListPage.sortButton('Imię').click();
    await expect(participantListPage.columnHeader('Imię')).toHaveAttribute('aria-sort', 'ascending');

    await participantListPage.sortButton('Imię').click();
    await expect(participantListPage.columnHeader('Imię')).toHaveAttribute('aria-sort', 'descending');
  });
});