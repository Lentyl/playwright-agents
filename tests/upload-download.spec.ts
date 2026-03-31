import { test, expect } from '../fixtures/fixtures';
import path from 'path';

test.describe('Elements -> Upload and Download', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Elements -> Upload and Download - trigger file download', async ({ navigationPage, uploadDownloadPage, page }) => {
    // TC-009: Trigger file download
    await navigationPage.goTo('Elements', 'Upload and Download');
    
    // Start download via Page helper and verify filename
    const download = await uploadDownloadPage.downloadAndWait();
    expect(download.suggestedFilename()).toBeTruthy();
  });

  test('Elements -> Upload and Download - upload file and verify filename shown', async ({ navigationPage, uploadDownloadPage }) => {
    // TC-010: Upload file and verify filename shown
    await navigationPage.goTo('Elements', 'Upload and Download');
    
    // Create a test file path
    const testFilePath = path.join(__dirname, '../data/test-image.png');
    
    // Upload file using file input
    await uploadDownloadPage.chooseFileInput.setInputFiles(testFilePath);
    
    // Verify uploaded filename is displayed
    await expect(uploadDownloadPage.uploadedFilePath).toBeVisible();
    await expect(uploadDownloadPage.uploadedFilePath).toContainText('test-image.png');
  });

  test('Elements -> Upload and Download - upload unsupported file type handling', async ({ navigationPage, uploadDownloadPage }) => {
    // TC-047: Upload unsupported file type handling
    await navigationPage.goTo('Elements', 'Upload and Download');
    
    // Create path to invalid file type
    const invalidFilePath = path.join(__dirname, '../data/invalid.exe');
    
    const result = await uploadDownloadPage.uploadFile(invalidFilePath);
    if (result.accepted) {
      await expect(uploadDownloadPage.uploadedFilePath).toContainText('invalid.exe');
    }
  });
});

