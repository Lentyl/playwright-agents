import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ModalDialogsPage extends BasePage {
  readonly smallModalButton: Locator;
  readonly largeModalButton: Locator;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly modalBody: Locator;
  readonly closeButton: Locator;
  readonly closeXButton: Locator;

  constructor(page: Page) {
    super(page);
    this.smallModalButton = page.locator('#showSmallModal');
    this.largeModalButton = page.locator('#showLargeModal');
    this.modal = page.locator('.modal-content');
    this.modalTitle = page.locator('.modal-title');
    this.modalBody = page.locator('.modal-body');
    this.closeButton = page.locator('#closeSmallModal, #closeLargeModal');
    this.closeXButton = page.locator('.close');
  }
}

