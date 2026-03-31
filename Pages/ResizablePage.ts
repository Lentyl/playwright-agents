import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ResizablePage extends BasePage {
  readonly resizableBox: Locator;
  readonly resizeHandle: Locator;

  constructor(page: Page) {
    super(page);
    this.resizableBox = page.locator('#resizableBoxWithRestriction');
    this.resizeHandle = this.resizableBox.locator('.react-resizable-handle');
  }

  /**
   * Resize the box by moving the resize handle to an absolute page coordinate.
   * Accepts absolute target page coordinates (x,y).
   */
  async resizeTo(targetX: number, targetY: number) {
    const handleBox = await this.resizeHandle.boundingBox();
    if (!handleBox) throw new Error('Resize handle not available');

    const startX = handleBox.x + handleBox.width / 2;
    const startY = handleBox.y + handleBox.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();

    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      const x = startX + ((targetX - startX) * i) / steps;
      const y = startY + ((targetY - startY) * i) / steps;
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(30);
    }

    await this.page.mouse.up();
    await this.page.waitForTimeout(120);
  }
}

