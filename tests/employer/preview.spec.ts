import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('Preview', () => {
  test('should open preview page', async ({
    employerPreviewPage,
  }) => {
    await employerPreviewPage.open();

    await employerPreviewPage.openPreview();

    await expect(
      employerPreviewPage.page.getByRole('heading')
    ).toBeVisible();
  });
});