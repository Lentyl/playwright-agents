import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Employer contribution-correction disposition wizard. */
export default class EmployerCorrectionsPage extends BasePage {
  readonly heading: Locator;
  readonly addCorrectionButton: Locator;
  readonly searchButton: Locator;
  readonly selectParticipantButton: Locator;
  readonly correctionTable: Locator;
  readonly nextButton: Locator;
  readonly ratioWarningDialog: Locator;
  readonly successMessage: Locator;
  readonly returnToMainMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zgłoszenie korekt do wpłat' });
    this.addCorrectionButton = page.getByRole('button', { name: 'Dodaj kolejną korektę' });
    this.searchButton = page.getByRole('button', { name: 'Szukaj' });
    this.selectParticipantButton = page.getByRole('button', { name: 'Wybierz' }).first();
    this.correctionTable = page.getByRole('table');
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
    await this.goto(`${APP_PATH}/employer/corrections?mode=init`);
  }

  async addFirstParticipant(): Promise<void> {
    await this.addCorrectionButton.click();
    await this.searchButton.click();
    await this.selectParticipantButton.click();
  }

  async fillCorrectionAmounts(index: number, value: string): Promise<void> {
    const row = this.correctionTable.locator('tbody tr').filter({
      has: this.page.locator('input:visible:not([type="checkbox"])'),
    }).nth(index);
    for (const input of await row.locator('input:visible:not([type="checkbox"])').all()) {
      await input.fill(value);
    }
  }

  participantPesel(index: number): Locator {
    return this.correctionTable
      .locator('tbody tr')
      .filter({ has: this.page.locator('input:visible:not([type="checkbox"])') })
      .nth(index)
      .locator('td')
      .nth(1);
  }

  async confirmIfVisible(): Promise<void> {
    const confirmButton = this.page.getByRole('button', { name: 'Tak', exact: true });
    if (await confirmButton.isVisible().catch(() => false)) {
      await confirmButton.click();
    }
  }
}
