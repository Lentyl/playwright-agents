import { test, expect } from '../../fixtures/pagesFixtures';

// TC-DOCS — Documents (Employer role)
test.describe('TC-DOCS — Documents', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });

  test('TC-DOCS-001 contract download links are present and resolve', async ({ documentsPage, page }) => {
    await documentsPage.open();
    await expect(documentsPage.heading).toBeVisible();

    await expect(documentsPage.managementAgreementLink).toBeVisible();
    await expect(documentsPage.conductAgreementLink).toBeVisible();
    await expect(documentsPage.managementAgreementLink).toHaveAttribute(
      'href',
      /\/documents\/contract\/download\/filetype\/CONTRACT_MANAGEMENT_AGREEMENT/,
    );

    // Verify the download target resolves without a 404 (HEAD-style check via request).
    const href = await documentsPage.managementAgreementLink.getAttribute('href');
    const response = await page.request.get(new URL(href!, page.url()).toString());
    expect(response.status()).toBeLessThan(400);
  });
});
