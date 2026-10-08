import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/** Shared contract for the employer disposition forms documented in the test plan. */
export default class EmployerDispositionFormPage extends BasePage {
  readonly breadcrumbs: Locator;
  readonly nextButton: Locator;
  readonly backButton: Locator;
  readonly cancelButton: Locator;
  readonly visibleFormControls: Locator;
  readonly successMessage: Locator;
  readonly confirmationPdfLink: Locator;
  readonly participantListPreviewButton: Locator;

  constructor(page: Page) {
    super(page);
    this.breadcrumbs = page.locator('nav[aria-label="breadcrumb"]');
    this.nextButton = page.getByRole('button', { name: 'Dalej' });
    this.backButton = page.getByRole('button', { name: /Wstecz|Powrót/ });
    this.cancelButton = page.getByRole('button', { name: 'Anuluj' });
    this.visibleFormControls = page.locator('form:visible input:not([type="hidden"]), form:visible select, form:visible textarea, form:visible button');
    this.successMessage = page.getByText(/dyspozycja.*złożona|złożon.*dyspozycj/i).first();
    this.confirmationPdfLink = page.getByRole('link', { name: /potwierdzenie.*PDF|PDF/i }).first();
    this.participantListPreviewButton = page
      .getByRole('button', { name: /podgląd listy uczestników|listy uczestników/i })
      .or(page.getByRole('link', { name: /podgląd listy uczestników|listy uczestników/i }))
      .first();
  }

  async open(path: string): Promise<void> {
    await this.goto(`${APP_PATH}${path}`);
  }

  async submitWithoutBusinessData(): Promise<void> {
    await this.nextButton.click();
  }

  heading(name: string): Locator {
    return this.page.getByRole('heading', { level: 1, name, exact: true });
  }

  field(name: string): Locator {
    return this.page.getByRole('textbox', { name, exact: true });
  }

  async selectFirstParticipant(): Promise<string> {
    await this.page.getByRole('button', { name: 'Szukaj' }).click();
    await this.page.getByRole('heading', { name: 'Wybierz uczestnika' }).waitFor({ state: 'visible' });

    const participantOption = this.page
      .getByRole('group')
      .filter({ hasText: 'Imię i nazwisko' })
      .first();
    const participantName = (await participantOption.innerText()).trim();
    const selectButton = participantOption.getByRole('button', { name: 'Wybierz' });
    if (await selectButton.count() > 0) {
      await selectButton.click();
    } else {
      await participantOption.click();
    }

    return participantName;
  }

  async fillDeclaredAmount(value: string): Promise<void> {
    await this.page.locator('#declaredAmount').fill(value);
  }

  async fillTransferParameters(): Promise<void> {
    await this.page.locator('#transferType').selectOption('TRANSFER_PAYMENT');
    await this.page.locator('#transferInstitution').selectOption('PKO TFI S.A.');
    await this.page.locator('#previousPpkNumber').fill('546372634');
  }
}
