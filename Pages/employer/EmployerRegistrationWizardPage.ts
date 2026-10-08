import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/**
 * Zgłoszenie pracownika — participant registration wizard (step 1).
 * The form inputs have no associated accessible names (labels are not linked),
 * so fields are located by their stable `id`/`name` attributes.
 */
export default class EmployerRegistrationWizardPage extends BasePage {
  readonly heading: Locator;
  readonly participantSection: Locator;
  readonly residenceSection: Locator;
  readonly registrationSection: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly pesel: Locator;
  readonly birthDate: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly nextButton: Locator;
  readonly invalidFeedback: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zgłoszenie pracownika' });
    this.participantSection = page.getByRole('heading', { level: 2, name: 'Dane uczestnika' });
    this.residenceSection = page.getByRole('heading', { level: 4, name: 'Adres zamieszkania' });
    this.registrationSection = page.getByRole('heading', { level: 4, name: 'Rejestracja' });
    this.firstName = page.locator('[name="customer.person.name"]');
    this.lastName = page.locator('[name="customer.person.surname"]');
    this.pesel = page.locator('[name="customer.person.pesel"]');
    this.birthDate = page.locator('[name="customer.person.birthDate"]');
    this.email = page.locator('[name="customer.email"]');
    this.phone = page.locator('[name="customer.phone"]');
    this.nextButton = page.getByRole('button', { name: 'Dalej' });
    this.invalidFeedback = page.locator('.invalid-feedback:visible');
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/employer/registration?mode=init`);
  }

  async submitStep(): Promise<void> {
    await this.nextButton.click();
  }

  async fillParticipantData(data: {
    firstName: string;
    lastName: string;
    pesel: string;
    birthDate: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await this.firstName.fill(data.firstName);
    await this.lastName.fill(data.lastName);
    await this.pesel.fill(data.pesel);
    await this.birthDate.fill(data.birthDate);
    await this.email.fill(data.email);
    await this.phone.fill(data.phone);
  }

  async fillRequiredEmployeeData(data: {
    firstName: string;
    lastName: string;
    pesel: string;
    birthDate: string;
    email: string;
    phone: string;
  }): Promise<void> {
    await this.fillParticipantData(data);
    await this.controlByLabel('Obywatelstwo').selectOption({ label: 'Polska' });
    await this.controlByLabel('Płeć').selectOption({ label: 'Mężczyzna' });
    await this.controlByLabel('Rodzaj dokumentu').selectOption({ label: 'Dowód osobisty' });
    await this.controlByLabel('Numer dokumentu').fill('ABC123456');
    await this.controlByLabel('Ulica').fill('Testowa');
    await this.controlByLabel('Nr domu').fill('1');
    await this.controlByLabel('Miejscowość').fill('Warszawa');
    await this.controlByLabel('Kod pocztowy').fill('00-001');
    await this.controlByLabel('Państwo').selectOption({ label: 'Polska' });
    await this.controlByLabel('Data obowiązku (RRRR-MM)').fill('2026-10');
    await this.controlByLabel('Data zatrudnienia (RRRR-MM-DD)').fill('2026-10-01');
  }

  private controlByLabel(label: string): Locator {
    return this.page.getByText(label, { exact: true }).locator('..').locator('input, select').first();
  }
}
