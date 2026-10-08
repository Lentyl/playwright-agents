import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('Contract data', () => {

    test.beforeEach(async ({ loginAsEmployer }) => {
        await loginAsEmployer();
    });

    test('should open contract data page', async ({
        employerContractDataPage,
    }) => {
        await employerContractDataPage.open();


        await expect(
            employerContractDataPage.page.getByRole('heading')
        ).toBeVisible();
    });
});