import { Page, TestInfo } from '@playwright/test';

export async function captureScreenshot(page: Page, testInfo: TestInfo): Promise<void> {
  const filename = `${testInfo.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()}.png`;
  const screenshotPath = testInfo.outputPath(filename);

  await page.screenshot({ path: screenshotPath, fullPage: true });
  await testInfo.attach('screenshot', { path: screenshotPath, contentType: 'image/png' });
}