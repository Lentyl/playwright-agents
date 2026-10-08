import { test, expect } from '../../fixtures/pagesFixtures';
test.describe('Returned files', () => {
  test('should open returned files page', async ({
    employerReturnedFilesPage,
  }) => {
    await employerReturnedFilesPage.open();

    await employerReturnedFilesPage.openReturnedFiles();

    await expect(
      employerReturnedFilesPage.page.getByRole('heading')
    ).toBeVisible();
  });
});