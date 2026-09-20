import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('TC-FI-CONVERSION - Conversion', () => {
  test('TC-FI-CONVERSION-001 displays the conversion page', async ({
    loginAsFinancialInstitution,
    financialInstitutionConversionPage: conversionPage,
  }) => {
    await loginAsFinancialInstitution();
    await conversionPage.open();

    await expect(conversionPage.heading).toBeVisible();
  });
});