import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('TC-FI-DOCUMENTS - Information and documents', () => {
  test.beforeEach(async ({ loginAsFinancialInstitution, financialInstitutionDocumentsPage: documentsPage }) => {
    await loginAsFinancialInstitution();
    await documentsPage.open();
    await expect(documentsPage.heading).toBeVisible();
  });

  test('TC-FI-DOCUMENTS-001 displays all document categories', async ({ financialInstitutionDocumentsPage: documentsPage }) => {
    for (const category of ['Manual', 'Formularze', 'Regulamin', 'Zasady zrównoważonego rozwoju']) {
      await expect(documentsPage.category(category)).toBeVisible();
    }
  });

  test('TC-FI-DOCUMENTS-002 exposes all fourteen document resources in new tabs', async ({ financialInstitutionDocumentsPage: documentsPage }) => {
    await expect(documentsPage.attachments).toHaveCount(14);
    for (let index = 0; index < 14; index += 1) {
      await expect(documentsPage.attachment(index)).toHaveAttribute('target', '_blank');
      await expect(documentsPage.attachment(index)).toHaveAttribute('href', /.+/);
    }
  });

  test('TC-FI-DOCUMENTS-003 exposes representative manual and contact documents', async ({ financialInstitutionDocumentsPage: documentsPage }) => {
    await expect(documentsPage.documentLink('Manual')).toHaveAttribute('href', /\.pdf$/);
    await expect(documentsPage.documentLink('Dane kontaktowe PPK')).toHaveAttribute('href', /\.pdf$/);
  });
});