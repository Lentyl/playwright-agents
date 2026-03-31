import { test, expect } from '../fixtures/fixtures';

test.describe('Elements -> Web Tables', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Elements -> Web Tables - add new web table record', async ({ navigationPage, webTablesPage, page }) => {
    // TC-011: Add new web table record
    await navigationPage.goTo('Elements', 'Web Tables');
    
    // Pause to inspect before adding new row (helps debug failures)
    await page.pause();

    // Add a new record using the page object method
    await webTablesPage.addRow({
      firstName: 'Alice',
      lastName: 'Wong',
      email: 'alice.w@ex.com',
      age: 30,
      salary: 50000,
      department: 'QA'
    });
    
    // Verify new row appears with entered data
    await expect(webTablesPage.getCellByText('Alice')).toBeVisible();
    await expect(webTablesPage.getCellByText('Wong')).toBeVisible();
    await expect(webTablesPage.getCellByText('alice.w@ex.com')).toBeVisible();
    await expect(webTablesPage.getCellByText('30')).toBeVisible();
    await expect(webTablesPage.getCellByText('50000')).toBeVisible();
    await expect(webTablesPage.getCellByText('QA')).toBeVisible();
  });

  test('Elements -> Web Tables - search existing web table record', async ({ navigationPage, webTablesPage, page }) => {
    // TC-012: Search existing web table record
    await navigationPage.goTo('Elements', 'Web Tables');
    
    // Pause to inspect before adding/searching rows (helps debug failures)
    await page.pause();

    // First add a record (prerequisite)
    await webTablesPage.addRow({
      firstName: 'Alice',
      lastName: 'Wong',
      email: 'alice.w@ex.com',
      age: 30,
      salary: 50000,
      department: 'QA'
    });
    
    // Search for the unique email
    await webTablesPage.page.locator('#searchBox').fill('alice.w@ex.com');
    
    // Verify matching text is visible
    await expect(webTablesPage.getCellByText('alice.w@ex.com')).toBeVisible();
  });

  test('Elements -> Web Tables - edit web table record', async ({ navigationPage, webTablesPage, page }) => {
    // TC-013: Edit web table record
    await navigationPage.goTo('Elements', 'Web Tables');
    
    // Pause to inspect before adding/editing rows (helps debug failures)
    await page.pause();

    // Add a record first (prerequisite)
    await webTablesPage.addRow({
      firstName: 'Alice',
      lastName: 'Wong',
      email: 'alice.w@ex.com',
      age: 30,
      salary: 50000,
      department: 'QA'
    });
    
    // Edit the record using the page object method
    await webTablesPage.editRowByEmail('alice.w@ex.com', { salary: 60000 });
    
    // Verify row updated with new salary
    await expect(webTablesPage.getCellByText('60000')).toBeVisible();
  });

  test('Elements -> Web Tables - delete web table record', async ({ navigationPage, webTablesPage, page }) => {
    // TC-014: Delete web table record
    await navigationPage.goTo('Elements', 'Web Tables');
    
    // Pause to inspect before adding/deleting rows (helps debug failures)
    await page.pause();

    // Add a record first
    await webTablesPage.addRow({
      firstName: 'ToDelete',
      lastName: 'User',
      email: 'todelete@test.com',
      age: 25,
      salary: 30000,
      department: 'HR'
    });
    
    // Delete the record using the page object method
    await webTablesPage.deleteRowByEmail('todelete@test.com');
    
    // Verify row is removed
    await expect(webTablesPage.getCellByText('todelete@test.com')).not.toBeVisible();
  });


  test('Elements -> Web Tables - pagination and rows per page', async ({ navigationPage, webTablesPage, page }) => {
    // TC-048: Web table pagination and rows per page
    await navigationPage.goTo('Elements', 'Web Tables');
    
    // Pause to inspect before bulk adding rows/pagination steps (helps debug failures)
    await page.pause();

    // Add multiple records to exceed page size
   /*  for (let i = 1; i <= 12; i++) {
        firstName: `User${i}`,
        lastName: `Last${i}`,
        email: `user${i}@test.com`,
        age: 25,
        salary: 40000,
        department: 'IT'
      });
    } */
    
    // Change rows per page to 5
    await webTablesPage.page.locator('select[aria-label="rows per page"]').selectOption('5');
    
    // Verify rows are displayed (allowing for default rows)
    const visibleRows = webTablesPage.page.locator('.rt-tbody .rt-tr-group').filter({ hasNot: webTablesPage.page.locator('.rt-tr.-padRow') });
    await expect(visibleRows.first()).toBeVisible();
    
    // Navigate to next page if pagination exists
    const nextButton = webTablesPage.page.locator('button:has-text("Next")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await expect(visibleRows.first()).toBeVisible();
    }
  });
});

