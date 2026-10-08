import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Employer dashboard (Panel pracodawcy) with the feature card grid. */
export default class EmployerDashboardPage extends BasePage {
  readonly heading: Locator;
  readonly lastSuccessfulLogin: Locator;
  readonly lastFailedLogin: Locator;
  readonly advisorName: Locator;
  readonly advisorPhone: Locator;
  readonly advisorEmail: Locator;
  readonly customerServicePhone: Locator;
  readonly customerServiceHours: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 5 });
    this.lastSuccessfulLogin = page.getByText('Ostatnia udana próba logowania:').first();
    this.lastFailedLogin = page.getByText('Ostatnia nieudana próba logowania:');
    this.advisorName = page.getByText('testowy_opiekun_1');
    this.advisorPhone = page.getByText('501 000 000');
    this.advisorEmail = page.getByText('dawid.wrobel.test.test.test@psfinteco.pl');
    this.customerServicePhone = page.getByText('22 541 77 57');
    this.customerServiceHours = page.getByText('dostępna pn. - pt., godz. 9:00-17:00');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer`);
  }

  /** Feature card on the dashboard, identified by its level-5 heading. */
  card(name: string): Locator {
    return this.page.getByRole('heading', { level: 5, name, exact: true });
  }

  cardLink(name: string): Locator {
    return this.page.getByRole('link').filter({ has: this.card(name) });
  }

  async cardNames(): Promise<string[]> {
    return (await this.page
      .getByRole('heading', { level: 5 })
      .allTextContents())
      .map((cardName) => cardName.trim())
      .filter(Boolean);
  }

  async cardHref(name: string): Promise<string | null> {
    return this.cardLink(name).getAttribute('href');
  }
}
