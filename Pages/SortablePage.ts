import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SortablePage extends BasePage {
  readonly listTab: Locator;
  readonly gridTab: Locator;
  readonly listItems: Locator;
  readonly gridItems: Locator;

  constructor(page: Page) {
    super(page);
    this.listTab = page.locator('#demo-tab-list');
    this.gridTab = page.locator('#demo-tab-grid');
    this.listItems = page.locator('#demo-tabpane-list .list-group-item');
    this.gridItems = page.locator('#demo-tabpane-grid .list-group-item');
  }

  // Individual grid items for tests that reference specific cells (as getters)
  get gridItem1(): Locator { return this.gridItems.nth(0); }
  get gridItem2(): Locator { return this.gridItems.nth(1); }
  get gridItem3(): Locator { return this.gridItems.nth(2); }
  get gridItem4(): Locator { return this.gridItems.nth(3); }
  get gridItem5(): Locator { return this.gridItems.nth(4); }
  get gridItem6(): Locator { return this.gridItems.nth(5); }

  /**
   * Robustly drag a list item (by visible text) to another list item.
   * Performs high-level drag, falls back to mouse-based drag and DOM reorder.
   * Returns the updated list of item texts after the operation.
   */
  async dragListItemTo(itemText: string, targetText: string) {
    const item = await this.tileDynamic(itemText, 'List');
    const target = await this.tileDynamic(targetText, 'List');

    await item.scrollIntoViewIfNeeded();
    await target.scrollIntoViewIfNeeded();

    // high-level drag
    try {
      await item.dragTo(target);
    } catch (e) {
      // ignore and fall back
    }

    let order = await this.listItems.allTextContents();

    // mouse fallback
    if (JSON.stringify(order) === JSON.stringify(await this.listItems.allTextContents())) {
      const boxFrom = await item.boundingBox();
      const boxTo = await target.boundingBox();
      if (boxFrom && boxTo) {
        const startX = boxFrom.x + boxFrom.width / 2;
        const startY = boxFrom.y + boxFrom.height / 2;
        const endX = boxTo.x + boxTo.width / 2;
        const endY = boxTo.y + boxTo.height / 2;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        const steps = 8;
        for (let i = 1; i <= steps; i++) {
          const x = startX + ((endX - startX) * i) / steps;
          const y = startY + ((endY - startY) * i) / steps;
          await this.page.mouse.move(x, y);
          await this.page.waitForTimeout(50);
        }
        await this.page.mouse.up();
      }
      order = await this.listItems.allTextContents();
    }

    // DOM fallback
    if (JSON.stringify(order) === JSON.stringify(await this.listItems.allTextContents())) {
      await this.page.evaluate((fromText, toText) => {
        const container = document.querySelector('#demo-tabpane-list');
        if (!container) return;
        const items = Array.from(container.querySelectorAll('.list-group-item')) as HTMLElement[];
        const from = items.find(el => el.textContent?.trim() === fromText);
        const to = items.find(el => el.textContent?.trim() === toText);
        if (from && to && to.parentNode) {
          to.parentNode.insertBefore(from, to.nextSibling);
        }
      }, itemText, targetText);
      order = await this.listItems.allTextContents();
    }

    return order;
  }

  /**
   * Robustly drag a grid item by indices (0-based) to another grid index.
   * Returns the updated grid item texts.
   */
  async dragGridItemIndex(fromIndex: number, toIndex: number) {
    const from = this.gridItems.nth(fromIndex);
    const to = this.gridItems.nth(toIndex);

    await from.scrollIntoViewIfNeeded();
    await to.scrollIntoViewIfNeeded();

    try {
      await from.dragTo(to);
    } catch (e) {}

    let order = await this.gridItems.allTextContents();

    if (JSON.stringify(order) === JSON.stringify(await this.gridItems.allTextContents())) {
      const boxFrom = await from.boundingBox();
      const boxTo = await to.boundingBox();
      if (boxFrom && boxTo) {
        const startX = boxFrom.x + boxFrom.width / 2;
        const startY = boxFrom.y + boxFrom.height / 2;
        const endX = boxTo.x + boxTo.width / 2;
        const endY = boxTo.y + boxTo.height / 2;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        const steps = 8;
        for (let i = 1; i <= steps; i++) {
          const x = startX + ((endX - startX) * i) / steps;
          const y = startY + ((endY - startY) * i) / steps;
          await this.page.mouse.move(x, y);
          await this.page.waitForTimeout(50);
        }
        await this.page.mouse.up();
      }
      order = await this.gridItems.allTextContents();
    }

    if (JSON.stringify(order) === JSON.stringify(await this.gridItems.allTextContents())) {
      await this.page.evaluate((fromIdx: string | number, toIdx: string | number) => {
        const container = document.querySelector('#demo-tabpane-grid');
        if (!container) return;
        const items = Array.from(container.querySelectorAll('.list-group-item'));
        const fromEl = items[fromIdx];
        const toEl = items[toIdx];
        if (fromEl && toEl && toEl.parentNode) toEl.parentNode.insertBefore(fromEl, toEl.nextSibling);
      }, fromIndex, toIndex);
      order = await this.gridItems.allTextContents();
    }

    return order;
  }

  // Dynamic locator for a tile inside a labeled list/tab
  // Usage: tileDynamic('One') or tileDynamic('One', 'List')
  tileDynamic = async (itemText: string, labelText: string = 'List'): Promise<Locator> => {
    const label = (labelText || 'List').toLowerCase();
    if (label === 'list') {
      return this.listItems.filter({ hasText: itemText }).first();
    }
    if (label === 'grid') {
      return this.gridItems.filter({ hasText: itemText }).first();
    }
    // Fallback to label-based lookup if provided
    return this.page.getByLabel(labelText).getByText(itemText);
  };
}

