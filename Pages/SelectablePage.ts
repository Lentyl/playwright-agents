import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SelectablePage extends BasePage {
  readonly gridTab: Locator;
  readonly listItem1: Locator;
  readonly listItem2: Locator;
  readonly listItem3: Locator;
  readonly listItem4: Locator;
  readonly gridItemA: Locator;
  readonly gridItemB: Locator;
  readonly gridItemC: Locator;
  readonly gridItemD: Locator;

  constructor(page: Page) {
    super(page);
    this.gridTab = page.locator('#demo-tab-grid');
    // List mode items (vertical list)
    this.listItem1 = page.locator('[role="tabpanel"][aria-hidden="false"] #verticalListContainer li').nth(0);
    this.listItem2 = page.locator('[role="tabpanel"][aria-hidden="false"] #verticalListContainer li').nth(1);
    this.listItem3 = page.locator('[role="tabpanel"][aria-hidden="false"] #verticalListContainer li').nth(2);
    this.listItem4 = page.locator('[role="tabpanel"][aria-hidden="false"] #verticalListContainer li').nth(3);

    // Grid mode items (A-D)
    this.gridItemA = page.locator('[role="tabpanel"][aria-hidden="false"] #gridContainer li').nth(0);
    this.gridItemB = page.locator('[role="tabpanel"][aria-hidden="false"] #gridContainer li').nth(1);
    this.gridItemC = page.locator('[role="tabpanel"][aria-hidden="false"] #gridContainer li').nth(2);
    this.gridItemD = page.locator('[role="tabpanel"][aria-hidden="false"] #gridContainer li').nth(3);
  }

  /** Click a list-mode item by 0-based index */
  async selectListItem(index: number) {
    const item = this.page.locator('[role="tabpanel"][aria-hidden="false"] #verticalListContainer li').nth(index);
    await item.click();
    return item;
  }

  /** Select a range in grid mode using Shift+click between two indices */
  async selectGridRange(startIndex: number, endIndex: number) {
    const start = this.page.locator('[role="tabpanel"][aria-hidden="false"] #gridContainer li').nth(startIndex);
    const end = this.page.locator('[role="tabpanel"][aria-hidden="false"] #gridContainer li').nth(endIndex);
    await start.click();
    await this.page.keyboard.down('Shift');
    await end.click();
    await this.page.keyboard.up('Shift');
  }
}

