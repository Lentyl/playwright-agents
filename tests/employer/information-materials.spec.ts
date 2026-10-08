import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('Information materials', () => {
  test('should open information materials page', async ({
    employerInformationMaterialsPage,
  }) => {
    await employerInformationMaterialsPage.open();

    await employerInformationMaterialsPage.openInformationMaterials();

    await expect(
      employerInformationMaterialsPage.page
    ).toHaveURL(/inform/i);
  });
});