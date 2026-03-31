import { test, expect } from '../fixtures/fixtures';

test.describe('Alerts Frame Windows -> Alerts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Alerts Frame Windows -> Alerts - handle simple alert', async ({ navigationPage, alertsPage, page }) => {
    // TC-019: Handle simple alert
    await navigationPage.goTo('Alerts, Frame & Windows', 'Alerts');
    
    // Set up alert handler
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
    
    // Trigger alert
    await alertsPage.alertButton.click();
    
    // The alert should have been handled automatically
    // Verify no JS errors and page state restored
    await expect(alertsPage.alertButton).toBeVisible();
  });

  test('Alerts Frame Windows -> Alerts - handle confirm alert dismiss and accept', async ({ navigationPage, alertsPage, page }) => {
    // TC-020: Handle confirm alert (dismiss and accept)
    await navigationPage.goTo('Alerts, Frame & Windows', 'Alerts');
    
    // Test dismissing confirm alert
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();
    });
    
    await alertsPage.confirmButton.click();
    
    // Verify result text reflects dismissed choice
    await expect(alertsPage.confirmResult).toContainText('Cancel');
    
    // Test accepting confirm alert
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();
    });
    
    await alertsPage.confirmButton.click();
    
    // Verify result text reflects accepted choice
    await expect(alertsPage.confirmResult).toContainText('Ok');
  });

  test('Alerts Frame Windows -> Alerts - handle prompt alert and verify input reflected', async ({ navigationPage, alertsPage, page }) => {
    // TC-021: Handle prompt alert and verify input reflected
    await navigationPage.goTo('Alerts, Frame & Windows', 'Alerts');
    
    // Set up prompt handler
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('prompt');
      await dialog.accept('hello');
    });
    
    // Trigger prompt
    await alertsPage.promtButton.click();
    
    // Verify entered value appears in result area
    await expect(alertsPage.promptResult).toContainText('hello');
  });
});

