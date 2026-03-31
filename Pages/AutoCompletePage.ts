import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class AutoCompletePage extends BasePage {
  readonly multiColorNamesInput: Locator;
  readonly singleColorNameInput: Locator;

  constructor(page: Page) {
    super(page);
    this.multiColorNamesInput = page.locator('#autoCompleteMultipleInput');
    this.singleColorNameInput = page.locator('#autoCompleteSingleInput');
  }

  get suggestionsList() {
    return this.page.locator('.auto-complete__menu');
  }

  get redSuggestion() {
    return this.page.locator('.auto-complete__option:has-text("Red")');
  }

  get blueSuggestion() {
    return this.page.locator('.auto-complete__option:has-text("Blue")');
  }

  get greenSuggestion() {
    return this.page.locator('.auto-complete__option:has-text("Green")');
  }

  get blueTag() {
    return this.page.locator('.auto-complete__multi-value:has-text("Blue")');
  }

  get greenTag() {
    return this.page.locator('.auto-complete__multi-value:has-text("Green")');
  }

  get blueTagRemove() {
    return this.page.locator('.auto-complete__multi-value:has-text("Blue") .auto-complete__multi-value__remove');
  }

  get singleValue() {
    return this.page.locator('.auto-complete__single-value');
  }
}

