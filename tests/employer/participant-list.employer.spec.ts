import { test, expect, testData } from '../../fixtures/pagesFixtures';

// TC-EMP-PLIST — Participant List (Employer role)
test.describe('TC-EMP-PLIST — Participant List', () => {
  test.beforeEach(async ({ loginAsEmployer, employerParticipantListPage }) => {
    await loginAsEmployer();
    await employerParticipantListPage.open();
    await expect(employerParticipantListPage.heading).toBeVisible();
  });

  test('TC-EMP-PLIST-001 shows default filters, columns, and an empty initial state', async ({ employerParticipantListPage }) => {
    await expect(employerParticipantListPage.resignationFilter).toHaveValue('');
    await expect(employerParticipantListPage.employedFilter).toHaveValue('YES');
    await expect(employerParticipantListPage.columnHeader('Imię')).toBeVisible();
    await expect(employerParticipantListPage.columnHeader('Nazwisko')).toBeVisible();
    await expect(employerParticipantListPage.columnHeader('PESEL')).toBeVisible();
    await expect(employerParticipantListPage.columnHeader('Rezygnacja')).toBeVisible();
    await expect(employerParticipantListPage.columnHeader('Zatrudniony')).toBeVisible();
    await expect(employerParticipantListPage.columnHeader('Zlecenie')).toBeVisible();
    await expect(employerParticipantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
  });

  test('TC-EMP-PLIST-002 returns an explicit empty state for an unknown first name', async ({ employerParticipantListPage }) => {
    await employerParticipantListPage.search({ firstName: 'ZZZ_NONEXISTENT_PARTICIPANT' });

    await expect(employerParticipantListPage.noMatchingRows).toBeVisible();
    await expect(employerParticipantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
  });

  test('TC-EMP-PLIST-003 returns employed participants after submitting default filter values', async ({ employerParticipantListPage }) => {
    await employerParticipantListPage.search({
      firstName: '', lastName: '', pesel: '', resignation: '', employed: 'YES',
    });

    await expect(employerParticipantListPage.paginationStatus).toContainText(/łącznie/);
    await expect(employerParticipantListPage.bodyRows().first()).toBeVisible();
  });

  test('TC-EMP-PLIST-004 narrows results when first name and surname identify a displayed participant', async ({ employerParticipantListPage }) => {
    await employerParticipantListPage.search({
      firstName: '', lastName: '', pesel: '', resignation: '', employed: 'YES',
    });
    await expect(employerParticipantListPage.bodyRows().first()).toBeVisible();

    const cells = await employerParticipantListPage.bodyRows().first().locator('td').allTextContents();
    const firstName = cells[3].trim();
    const lastName = cells[4].trim();

    await employerParticipantListPage.search({ firstName, lastName });

    await expect(employerParticipantListPage.noMatchingRows).not.toBeVisible();
    await expect(employerParticipantListPage.bodyRows().first()).toContainText(firstName);
    await expect(employerParticipantListPage.bodyRows().first()).toContainText(lastName);
  });

  test('TC-EMP-PLIST-005 returns an empty state for a 10-digit PESEL', async ({ employerParticipantListPage }) => {
    await employerParticipantListPage.search({ pesel: testData.pesel.tooShort });

    await expect(employerParticipantListPage.noMatchingRows).toBeVisible();
  });

  test('TC-EMP-PLIST-006 returns an empty state for a 12-digit PESEL', async ({ employerParticipantListPage }) => {
    await employerParticipantListPage.search({ pesel: testData.pesel.tooLong });

    await expect(employerParticipantListPage.noMatchingRows).toBeVisible();
  });

  test('TC-EMP-PLIST-007 returns an empty state for an alphanumeric PESEL', async ({ employerParticipantListPage }) => {
    await employerParticipantListPage.search({ pesel: testData.pesel.nonNumeric });

    await expect(employerParticipantListPage.noMatchingRows).toBeVisible();
  });

  test('TC-EMP-PLIST-008 supports page-size changes and toggles first-name sorting', async ({ employerParticipantListPage }) => {
    await employerParticipantListPage.search({
      firstName: '', lastName: '', pesel: '', resignation: '', employed: 'YES',
    });
    await expect(employerParticipantListPage.bodyRows().first()).toBeVisible();

    await employerParticipantListPage.pageSizeSelect.selectOption('25');
    await expect(employerParticipantListPage.pageSizeSelect).toHaveValue('25');
    await expect(employerParticipantListPage.bodyRows()).toHaveCount(25);

    await employerParticipantListPage.sortButton('Imię').click();
    await expect(employerParticipantListPage.columnHeader('Imię')).toHaveAttribute('aria-sort', 'ascending');

    await employerParticipantListPage.sortButton('Imię').click();
    await expect(employerParticipantListPage.columnHeader('Imię')).toHaveAttribute('aria-sort', 'descending');
  });
});