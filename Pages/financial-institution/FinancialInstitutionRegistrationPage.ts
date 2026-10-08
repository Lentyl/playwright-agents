import { Locator, Page } from '@playwright/test';
import BasePage from '../BasePage';

export default class FinancialInstitutionRegistrationPage extends BasePage {
  readonly registrationHeading: Locator;
  readonly employerDataHeading: Locator;
  readonly registeredAddressHeading: Locator;
  readonly managementAgreementHeading: Locator;
  readonly conductAgreementHeading: Locator;
  readonly referrerHeading: Locator;
  readonly nextButton: Locator;
  readonly addServicePersonButton: Locator;
  readonly acceptButton: Locator;
  readonly legalForm: Locator;
  readonly noCorrespondenceAddress: Locator;
  readonly managementDocument: Locator;
  readonly conductDocument: Locator;
  readonly emptyKrsCheckbox: Locator;
  readonly emptyRegonCheckbox: Locator;
  readonly notPublicSectorRadio: Locator;
  readonly notSeparateRadio: Locator;
  readonly notPromoterCodeRadio: Locator;
  readonly uploadedFileName: Locator;
  readonly confirmationBody: Locator;
  readonly minimumCountMessage: Locator;
  readonly portalLink: Locator;
  readonly employerPreviewLink: Locator;
  readonly permissionsChoice: Locator;

  constructor(page: Page) {
    super(page);
    this.registrationHeading = page.getByRole('heading', { name: 'Rejestracja umowy PPK' });
    this.employerDataHeading = page.locator('h4').filter({ hasText: 'Dane podmiotu zatrudniającego' });
    this.registeredAddressHeading = page.getByRole('heading', { name: 'Adres siedziby podmiotu' });
    this.managementAgreementHeading = page.getByRole('heading', { name: 'Umowa o zarządzanie PPK' });
    this.conductAgreementHeading = page.getByRole('heading', { name: 'Umowa o prowadzenie PPK' });
    this.referrerHeading = page.getByRole('heading', { name: 'Sprzedawca polecający' });
    this.nextButton = page.getByRole('button', { name: 'Dalej' });
    this.addServicePersonButton = page.getByRole('button', { name: 'Dodaj osobę obsługującą' });
    this.acceptButton = page.getByRole('button', { name: 'Akceptuj' });
    this.legalForm = page.getByLabel('Forma prawna');
    this.noCorrespondenceAddress = page.getByText('Nie', { exact: true }).first();
    this.managementDocument = page.locator('#contractManagementDocument');
    this.conductDocument = page.locator('#contractConductDocument');
    this.emptyKrsCheckbox = page.locator('#allowEmptyKrsCheckbox');
    this.emptyRegonCheckbox = page.locator('#allowEmptyRegonCheckbox');
    this.notPublicSectorRadio = page.locator('#is-not-public-sector');
    this.notSeparateRadio = page.locator('#is-not-separate');
    this.notPromoterCodeRadio = page.locator('#is-not-promotorCode');
    this.uploadedFileName = page.getByText('testowyPDF.pdf').first();
    this.confirmationBody = page.locator('body');
    this.minimumCountMessage = page.getByText('Minimalna liczba');
    this.portalLink = page.getByRole('link', { name: 'Panel Instytucji Finansowej' });
    this.employerPreviewLink = page.getByRole('link', { name: 'Podgląd Pracodawców' });
    this.permissionsChoice = page.locator('div').filter({ hasText: 'Uprawnienia Operacyjne Operacyjne i administracyjne łącznie' }).nth(4);
  }

  employerField(field: 'krs' | 'regon' | 'nip' | 'companyName'): Locator {
    return this.page.locator(`#${field}`);
  }

  addressField(address: 'companyAddress' | 'correspondenceAddress', field: string): Locator {
    return this.page.locator(`[id="${address}.${field}"]`);
  }

  servicePersonField(index: number, field: 'personType' | 'name' | 'surname' | 'email' | 'cellPhone'): Locator {
    return this.page.locator(`#contractPersonList\\[${index}\\]\\.${field}`);
  }

  summaryEmployerField(field: 'krs' | 'regon' | 'nip' | 'companyName'): Locator {
    return this.page.locator(`#${field}`);
  }

  summaryAddressField(address: 'companyAddress' | 'correspondenceAddress', field: string): Locator {
    return this.addressField(address, field);
  }

  summaryServicePersonField(index: number, field: 'personType' | 'name' | 'surname' | 'email' | 'cellPhone'): Locator {
    return this.page.locator(`#contractPersonList${index}\\.${field}`);
  }

  validationMessage(field: string, message?: string): Locator {
    const selector = `//label[@for="${field}"]/following-sibling::div`;
    const locator = this.page.locator(selector);
    return message ? locator.filter({ hasText: message }) : locator;
  }

  invalidAddressMessage(field: string): Locator {
    return this.page.locator(`//input[@id="${field}"]/following-sibling::div`);
  }

  link(name: string, exact = true): Locator {
    return this.page.getByRole('link', { name, exact });
  }

  heading(name: string): Locator {
    return this.page.getByRole('heading', { name });
  }

  text(name: string, exact = false): Locator {
    return this.page.getByText(name, { exact });
  }

  button(name: string): Locator {
    return this.page.getByRole('button', { name });
  }

  allTextboxes(): Locator {
    return this.page.getByRole('textbox');
  }
}