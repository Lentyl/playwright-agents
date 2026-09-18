import { Locator, Page } from '@playwright/test';
import BasePage from './BasePage';

export default class PermissionGroupsPage extends BasePage {
  readonly heading: Locator;
  readonly createGroupLink: Locator;
  readonly editHeading: Locator;
  readonly groupNameInput: Locator;
  readonly saveGroupButton: Locator;
  readonly searchBox: Locator;
  readonly descriptionError: Locator;
  readonly missingPermissionError: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Lista grup uprawnień' });
    this.createGroupLink = page.getByRole('link', { name: 'Utwórz nową grupę uprawnień' });
    this.editHeading = page.getByRole('heading', { name: 'Edycja grupy uprawnień' });
    this.groupNameInput = page.getByRole('textbox', { name: 'Nazwa' });
    this.saveGroupButton = page.getByRole('button', { name: 'Zapisz grupę uprawnień' });
    this.searchBox = page.getByRole('searchbox', { name: 'Szukaj:' });
    this.descriptionError = page.locator('#description-error');
    this.missingPermissionError = page.getByText('Należy wybrać przynajmniej');
  }

  permission(name: string): Locator {
    return this.page.getByText(name);
  }

  groupCell(name: string): Locator {
    return this.page.getByRole('cell', { name }).first();
  }
}