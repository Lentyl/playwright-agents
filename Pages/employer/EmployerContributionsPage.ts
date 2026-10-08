import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Employer contribution declaration wizard. */
export default class EmployerContributionsPage extends BasePage {
  readonly heading: Locator;
  readonly periodInput: Locator;
  readonly addContributionButton: Locator;
  readonly searchButton: Locator;
  readonly selectParticipantButton: Locator;
  readonly contributionTable: Locator;
  readonly nextButton: Locator;
  readonly ratioWarningDialog: Locator;
  readonly successMessage: Locator;
  readonly returnToMainMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zgłoszenie wpłat' });
    this.periodInput = page
      .getByText('Wpłata za okres (RRRR-MM)', { exact: true })
      .locator('..')
      .locator('input');
    this.addContributionButton = page.getByRole('button', { name: 'Dodaj kolejną wpłatę' });
    this.searchButton = page.getByRole('button', { name: 'Szukaj' });
    this.selectParticipantButton = page.getByRole('button', { name: 'Wybierz' }).first();
    this.contributionTable = page.getByRole('table');
    this.nextButton = page.getByRole('button', { name: 'Dalej' });
    this.ratioWarningDialog = page.locator('.modal.show, [role="dialog"]:visible').filter({
      hasText: /proporcj|stosunek|PESEL/i,
    }).first();
    this.successMessage = page.getByText(/poprawnie złożon.*dyspozycj|dyspozycja została złożona/i).first();
    this.returnToMainMenuButton = page
      .getByRole('link', { name: /powrót do menu głównego|menu głównego/i })
      .or(page.getByRole('button', { name: /powrót do menu głównego|menu głównego/i }))
      .first();
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/contributions?mode=init`);
  }

  async addFirstParticipant(): Promise<void> {
    await this.addContributionButton.click();
    await this.searchButton.click();
    await this.selectParticipantButton.click();
  }

  async fillContributionAmounts(value: string): Promise<void> {
    const amountInputs = this.contributionTable.locator(
      'tbody tr input:visible:not([type="checkbox"])',
    );
    for (const input of await amountInputs.all()) {
      await input.fill(value);
    }
  }

  async fillParticipantAmounts(index: number, value: string): Promise<void> {
    for (const field of [
      'basicCustomerContribution',
      'additionalCustomerContribution',
      'basicEmployerContribution',
      'additionalEmployerContribution',
    ]) {
      await this.page
        .locator(`input[name="customerContributions[${index}].${field}"]`)
        .fill(value);
    }
  }

  participantPesel(index: number): Locator {
    return this.page
      .locator(`input[name="customerContributions[${index}].basicCustomerContribution"]`)
      .locator('xpath=ancestor::tr')
      .locator('td')
      .nth(1);
  }

  async markReducedContribution(index: number): Promise<void> {
    const row = this.page
      .locator(`input[name="customerContributions[${index}].basicCustomerContribution"]`)
      .locator('xpath=ancestor::tr');
    await row.locator('input[type="checkbox"]').check();
  }

  async confirmIfVisible(): Promise<void> {
    const confirmButton = this.page.getByRole('button', { name: 'Tak', exact: true });
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }
}
