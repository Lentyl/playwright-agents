import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('Dispositions', () => {

    test.beforeEach(async ({ loginAsEmployer }) => {
        await loginAsEmployer();
    });

    test('should open dispositions page', async ({
        employerDispositionsPage,
    }) => {
        await employerDispositionsPage.open();

        await employerDispositionsPage.openDispositions();

        await expect(
            employerDispositionsPage.page
        ).toHaveURL(/disposition/i);
    });
});