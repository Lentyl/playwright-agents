import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('Permissions', () => {
  test('should open permissions page', async ({
    permissionGroupsPage,
  }) => {
    await permissionGroupsPage.open();

    await permissionGroupsPage.openPermissions();

    await expect(
      permissionGroupsPage.page
    ).toHaveURL(/admin/i);
  });
});