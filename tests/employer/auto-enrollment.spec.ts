import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('Auto enrollment', () => {

    test.beforeEach(async ({ loginAsEmployer }) => {
        await loginAsEmployer();
    });

    test('should open auto enrollment page', async ({
        employerAutoEnrollmentPage,
    }) => {
        await employerAutoEnrollmentPage.open();

        await employerAutoEnrollmentPage.openAutoEnrollment();

        await expect(
            employerAutoEnrollmentPage.page
        ).toHaveURL(/auto/i);
    });
});