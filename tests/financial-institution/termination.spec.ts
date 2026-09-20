import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('TC-FI-TERMINATION - UoZ termination', () => {
  test.beforeEach(async ({ loginAsFinancialInstitution, financialInstitutionTerminationPage: terminationPage }) => {
    await loginAsFinancialInstitution();
    await terminationPage.open();
    await expect(terminationPage.heading).toBeVisible();
  });

  test('TC-FI-TERMINATION-001 displays every employer search filter', async ({ financialInstitutionTerminationPage: terminationPage }) => {
    await expect(terminationPage.employerNameFilter).toBeVisible();
    await expect(terminationPage.krsFilter).toBeVisible();
    await expect(terminationPage.regonFilter).toBeVisible();
    await expect(terminationPage.nipFilter).toBeVisible();
    await expect(terminationPage.searchButton).toBeVisible();
  });

  test('TC-FI-TERMINATION-002 validates a search without employer criteria', async ({ financialInstitutionTerminationPage: terminationPage }) => {
    await terminationPage.searchButton.click();

    await expect(terminationPage.validationMessage).toBeVisible();
  });

  test('TC-FI-TERMINATION-003 finds an employer with an exact KRS number', async ({ financialInstitutionTerminationPage: terminationPage }) => {
    await terminationPage.krsFilter.fill('4246552615');
    await terminationPage.search();

    await expect(terminationPage.rows()).toHaveCount(1);
    await expect(terminationPage.rows().first()).toContainText('Global Education Foundation');
  });

  test('TC-FI-TERMINATION-004 sorts search results by KRS', async ({ financialInstitutionTerminationPage: terminationPage }) => {
    await terminationPage.employerNameFilter.fill('Global Education Foundation');
    await terminationPage.search();
    await expect(terminationPage.rows()).toHaveCount(8);

    await terminationPage.sortButton(3).click();
    await expect(terminationPage.columnHeader('KRS')).toHaveAttribute('aria-sort', 'ascending');
    await terminationPage.sortButton(3).click();
    await expect(terminationPage.columnHeader('KRS')).toHaveAttribute('aria-sort', 'descending');
  });
});