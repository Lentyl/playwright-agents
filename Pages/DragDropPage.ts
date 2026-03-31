import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class DragDropPage extends BasePage {
  readonly draggableBox: Locator;
  readonly droppableBox: Locator;

  constructor(page: Page) {
    super(page);
    // Target elements in the active tab panel only
    this.draggableBox = page.locator('[role="tabpanel"][aria-hidden="false"] #draggable, [role="tabpanel"]:not([aria-hidden="true"]) #draggable').first();
    this.droppableBox = page.locator('[role="tabpanel"][aria-hidden="false"] #droppable, [role="tabpanel"]:not([aria-hidden="true"]) #droppable').first();
  }

  async dragToDroppable(): Promise<void> {
    // Wait for both elements to be visible first
    await this.draggableBox.waitFor({ state: 'visible' });
    await this.droppableBox.waitFor({ state: 'visible' });
    // Use low-level mouse actions to perform a realistic drag sequence that
    // jQuery UI's droppable handler recognizes (move, down, move, up).
    const dragBox = await this.draggableBox.boundingBox();
    const dropBox = await this.droppableBox.boundingBox();
    if (!dragBox || !dropBox) throw new Error('Unable to determine element positions for drag-drop');

    // Try Playwright's high-level dragAndDrop first; if it doesn't trigger
    // the jQuery UI handlers, fall back to an incremental mouse-based
    // simulation that dispatches natural mouse events.
    try {
      await this.page.dragAndDrop('#draggable', '#droppable');
      await this.page.waitForTimeout(150);
      // quick check: if droppable shows dropped state, return early
      const hasDropped = await this.droppableBox.evaluate((el) => el.textContent?.includes('Dropped!'));
      if (hasDropped) return;
    } catch (e) {
      // ignore and fall back to mouse sequence
    }

    // Move to draggable, press down, then perform incremental moves toward
    // the droppable with short pauses so jQuery UI receives a natural sequence
    // of mousemove events and recognizes the drop.
    const startX = dragBox.x + dragBox.width / 2;
    const startY = dragBox.y + dragBox.height / 2;
    const endX = dropBox.x + dropBox.width / 2;
    const endY = dropBox.y + dropBox.height / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();

    const steps = 12;
    for (let i = 1; i <= steps; i++) {
      const x = startX + ((endX - startX) * i) / steps;
      const y = startY + ((endY - startY) * i) / steps;
      await this.page.mouse.move(x, y);
      // small pause to let UI react progressively
      await this.page.waitForTimeout(40);
    }

    await this.page.mouse.up();
    // wait a short while for droppable handlers to update the DOM
    await this.page.waitForTimeout(200);
  }

  /**
   * Switch to "Revert Draggable" tab and drag the revertable element to an invalid location,
   * returning the pixel delta between initial and final position.
   */
  async dragToInvalidAndGetDelta(): Promise<{ deltaX: number; deltaY: number } | { error: string }> {
    // Switch to revert tab
    await this.page.click('text=Revert Draggable');

    // Prefer the active tab panel but fall back to global selector
    const revertable = this.page.locator('[role="tabpanel"][aria-hidden="false"] #revertable, #revertable').first();
    if (!(await revertable.count())) return { error: 'Element not found' };

    const initialBox = await revertable.boundingBox();
    if (!initialBox) return { error: 'Unable to get element bounding box' };

    const startX = initialBox.x + initialBox.width / 2;
    const startY = initialBox.y + initialBox.height / 2;

    // Move to an invalid drop location (near top-left)
    const endX = 50;
    const endY = 50;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    // small incremental moves
    const steps = 6;
    for (let i = 1; i <= steps; i++) {
      const x = startX + ((endX - startX) * i) / steps;
      const y = startY + ((endY - startY) * i) / steps;
      await this.page.mouse.move(x, y);
      await this.page.waitForTimeout(80);
    }
    await this.page.mouse.up();

    // wait for revert animation
    await this.page.waitForTimeout(800);

    const finalBox = await revertable.boundingBox();
    if (!finalBox) return { error: 'Unable to get final bounding box' };

    return { deltaX: Math.abs(finalBox.x - initialBox.x), deltaY: Math.abs(finalBox.y - initialBox.y) };
  }

  /** Perform a JS-driven drag sequence with pixel offsets and return droppable result */
  async dragWithOffsets(offsetX: number, offsetY: number) {
    return this.page.evaluate(async (ox, oy) => {
      const draggable = document.querySelector('[role="tabpanel"]:not([hidden]) #draggable');
      const droppable = document.querySelector('[role="tabpanel"]:not([hidden]) #droppable');
      if (!draggable || !droppable) return { success: false, error: 'Elements not found' };
      droppable.classList.remove('ui-state-highlight');
      droppable.innerHTML = '<p>Drop Here</p>';
      const dragRect = draggable.getBoundingClientRect();
      const dropRect = droppable.getBoundingClientRect();
      const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        clientX: dragRect.x + dragRect.width / 2,
        clientY: dragRect.y + dragRect.height / 2,
        button: 0
      });
      const mouseMoveEvent = new MouseEvent('mousemove', {
        bubbles: true,
        cancelable: true,
        clientX: dropRect.x + dropRect.width / 2 + ox,
        clientY: dropRect.y + dropRect.height / 2 + oy,
        button: 0
      });
      const mouseUpEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        clientX: dropRect.x + dropRect.width / 2 + ox,
        clientY: dropRect.y + dropRect.height / 2 + oy,
        button: 0
      });
      draggable.dispatchEvent(mouseDownEvent);
      await new Promise(resolve => setTimeout(resolve, 100));
      document.dispatchEvent(mouseMoveEvent);
      droppable.dispatchEvent(mouseMoveEvent);
      await new Promise(resolve => setTimeout(resolve, 100));
      droppable.dispatchEvent(mouseUpEvent);
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: droppable.textContent?.includes('Dropped!'),
        droppableText: droppable.textContent,
        droppableClasses: droppable.className
      };
    }, offsetX, offsetY);
  }
}

