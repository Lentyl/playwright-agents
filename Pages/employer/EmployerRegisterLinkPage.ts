import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/**
 * Zgłoszenie pracownika — participant registration wizard (step 1).
 * The form inputs have no associated accessible names (labels are not linked),
 * so fields are located by their stable `id`/`name` attributes.
 */
export default class EmployerRegisterLinkPage extends BasePage {


  constructor(page: Page) {
    super(page);

  }




}
