import { test, expect } from '../../fixtures/pagesFixtures';

// TC-DOCS — Documents (Employer role)
test.describe('TC-DOCS — Documents', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-DOCS-001 contract download links are present and resolve', async ({ employerDocumentsPage, page }) => {
    await employerDocumentsPage.open();

    await expect(employerDocumentsPage.heading).toBeVisible();
    await expect(employerDocumentsPage.managementAgreementLink).toBeVisible();
    await expect(employerDocumentsPage.conductAgreementLink).toBeVisible();
    await expect(employerDocumentsPage.managementAgreementLink).toHaveAttribute(
      'href',
      /\/documents\/contract\/download\/filetype\/CONTRACT_MANAGEMENT_AGREEMENT/,
    );

    // Verify the download target resolves without a 404 (HEAD-style check via request).
    const href = await employerDocumentsPage.managementAgreementLink.getAttribute('href');
    const response = await page.request.get(new URL(href!, page.url()).toString());
    expect(response.status()).toBeLessThan(400);
  });

    test('TC-DOCS-001 contract download  ', async ({ employerDocumentsPage }) => {
    await employerDocumentsPage.open();

    await expect(employerDocumentsPage.heading).toBeVisible();
  });
});
