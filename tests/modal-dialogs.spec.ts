import { test, expect } from '../fixtures/fixtures';

test.describe('Alerts Frame Windows -> Modal Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.fixme('Alerts Frame Windows -> Modal Dialogs - open and close small modal', async ({ navigationPage, modalDialogsPage }) => {
    // TC-025: Open and close small modal
    // FIXME: Small modal button click does not create modal DOM elements on current version of demoqa.com  
    // Body gets 'modal-open' class but no actual modal content appears despite button onclick function executing
    await navigationPage.goTo('Alerts, Frame & Windows', 'Modal Dialogs');
    
    // Click Small Modal button
    await modalDialogsPage.smallModalButton.click();
    
    // Verify modal opens with correct content
    await expect(modalDialogsPage.modal).toBeVisible();
    await expect(modalDialogsPage.modalTitle).toContainText('Small Modal');
    await expect(modalDialogsPage.modalBody).toContainText('small modal');
    
    // Close modal
    await modalDialogsPage.closeButton.click();
    
    // Verify modal closes
    await expect(modalDialogsPage.modal).not.toBeVisible();
  });

  test.fixme('Alerts Frame Windows -> Modal Dialogs - open and close large modal', async ({ navigationPage, modalDialogsPage }) => {
    // TC-026: Open and close large modal  
    // FIXME: Large modal button click does not create modal DOM elements on current version of demoqa.com
    // Body gets 'modal-open' class but no actual modal content appears despite button onclick function executing
    await navigationPage.goTo('Alerts, Frame & Windows', 'Modal Dialogs');
    
    // Click Large Modal button
    await modalDialogsPage.largeModalButton.click();
    
    // Verify large modal content visible
    await expect(modalDialogsPage.modal).toBeVisible();
    await expect(modalDialogsPage.modalTitle).toContainText('Large Modal');
    await expect(modalDialogsPage.modalBody).toContainText('large modal');
    
    // Close via X control
    await modalDialogsPage.closeXButton.click();
    
    // Verify modal closes
    await expect(modalDialogsPage.modal).not.toBeVisible();
  });
});

