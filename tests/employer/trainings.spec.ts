import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('Trainings', () => {
  test('should open trainings page', async ({
    employerTrainingsPage,
  }) => {
    await employerTrainingsPage.open();

    await employerTrainingsPage.openTrainings();

    await expect(
      employerTrainingsPage.page
    ).toHaveURL(/szkol/i);
  });
});