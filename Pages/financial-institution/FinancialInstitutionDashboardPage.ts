import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export const FINANCIAL_INSTITUTION_LANDING_PATH = `${APP_PATH}/manager/login/fork`;

/** Landing screen for the Financial Institution role. */
export default class FinancialInstitutionDashboardPage extends BasePage {
  readonly heading: Locator;
  readonly employerPreviewHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 5, name: 'Panel Instytucji Finansowej' });
    this.employerPreviewHeading = page.getByRole('heading', { level: 5, name: 'Podgląd Pracodawców' });
  }

  cardLink(heading: Locator): Locator {
    return this.page.getByRole('link').filter({ has: heading });
  }
}