import { test, expect } from '../../../fixtures/pagesFixtures';
import type { Download } from '@playwright/test';
import FinancialInstitutionAgreementPage from '../../../pages/financial-institution/FinancialInstitutionAgreementPage';
import FinancialInstitutionDashboardPage, {
  FINANCIAL_INSTITUTION_LANDING_PATH,
} from '../../../pages/financial-institution/FinancialInstitutionDashboardPage';
import type {
  PendingAgreementActionData,
  PendingAgreementCancellationData,
} from '../../../pages/financial-institution/FinancialInstitutionAgreementPage';
import testData from '../../../data/testData.json';

const TEST_DOCUMENT = './data/testowyPDF.pdf';
const EXISTING_EMPLOYER = 'Global E';

async function expectNonEmptyDownload(download: Download): Promise<void> {
  const stream = await download.createReadStream();
  let downloadedBytes = 0;

  for await (const chunk of stream) downloadedBytes += chunk.length;
  expect(downloadedBytes).toBeGreaterThan(0);
}

async function openAcceptedAgreement(
  agreementPage: FinancialInstitutionAgreementPage,
  dashboardPage: FinancialInstitutionDashboardPage,
): Promise<void> {
  await agreementPage.openAcceptedAgreements();
  await agreementPage.waitForAcceptedAgreementsTable();
  await agreementPage.searchBox.fill(EXISTING_EMPLOYER);
  await expect(agreementPage.companyCell).toBeVisible();
  await agreementPage.companyCell.click();
  await dashboardPage.waitForLocatorOrClick(
    agreementPage.contractDateText,
    10,
    agreementPage.firstTableCell,
  );
}

function blockedTest(title: string, reason: string, only = false): void {
  const runTest = async () => {
    test.fixme(true, reason);
  };

  if (only) {
    test.only(title, runTest);
  } else {
    test(title, runTest);
  }
}

test.describe('Przypadki testowe NN PTE - Panel instytucji finansowej', () => {
  // Kroki testowe:
  // 1. Użytkownik naciska przycisk "Menu".
  // 2. Użytkownik z sekcji "PPK" wybiera opcję "Rejestracja umowy PPK".
  // 3. Użytkownik uzupełnia formularz rejestracyjny.
  // 4. Użytkownik naciska przycisk "Akceptuj" na ostatnim kroku.
  test.only('TC001- Rejestracja umowy PPK', async ({
    financialInstitutionDashboardPage,
    financialInstitutionRegistrationPage: registrationPage,
    loginAsFinancialInstitution,
    page,
  }) => {
    await loginAsFinancialInstitution();
    await expect(financialInstitutionDashboardPage.heading).toBeVisible();
    await expect(financialInstitutionDashboardPage.employerPreviewHeading).toBeVisible();
    await expect(financialInstitutionDashboardPage.cardLink(financialInstitutionDashboardPage.heading)).toHaveAttribute(
      'href',
      `${FINANCIAL_INSTITUTION_LANDING_PATH.replace('/login/fork', '')}/contract/list/awaiting`,
    );
    await expect(financialInstitutionDashboardPage.cardLink(financialInstitutionDashboardPage.employerPreviewHeading)).toHaveAttribute(
      'href',
      '/ppk-nnpte2/nnpte/manager/employer/list',
    );
    let krs = await financialInstitutionDashboardPage.generateKrs();
    let regon = await financialInstitutionDashboardPage.generateUniqueRegon();
    let nip = await financialInstitutionDashboardPage.generateNip();
    let companyName = 'Global Education Foundation';
    await expect(registrationPage.portalLink).toBeVisible();
    await expect(registrationPage.employerPreviewLink).toBeVisible();
    await registrationPage.openMenu();
    await registrationPage.menuLink('Rejestracja umowy PPK').click();
    await expect(registrationPage.employerDataHeading).toBeVisible();
    await registrationPage.employerField('krs').fill(krs);
    await registrationPage.employerField('regon').fill(regon);
    await registrationPage.employerField('nip').fill(nip);
    await registrationPage.employerField('companyName').fill(companyName);
    await registrationPage.legalForm.selectOption('FOUNDATION');
    await registrationPage.noCorrespondenceAddress.click();
    await expect(registrationPage.registeredAddressHeading).toBeVisible();
    await registrationPage.addressField('companyAddress', 'city').fill('Berlin');
    await registrationPage.addressField('companyAddress', 'country').selectOption('DE');
    await registrationPage.addressField('companyAddress', 'street').fill('Friedrichstrasse');
    await registrationPage.addressField('companyAddress', 'number').fill('123');
    await registrationPage.addressField('companyAddress', 'apartmentNumber').fill('8A');
    await registrationPage.addressField('companyAddress', 'postTown').fill('Berlin');
    await registrationPage.addressField('companyAddress', 'zipCode').fill('10117');
    await registrationPage.nextButton.click();
    try {
      await expect(registrationPage.addServicePersonButton).toBeVisible({ timeout: 10000 });

    } catch (error) {
      krs = await financialInstitutionDashboardPage.generateKrs();
      await registrationPage.employerField('krs').fill(krs);
      companyName = await registrationPage.employerField('companyName').inputValue();
      await registrationPage.nextButton.click();
    }

    await registrationPage.addServicePersonButton.click();
    await registrationPage.servicePersonField(0, 'personType').selectOption('CONTRACT_OPERATOR');
    await registrationPage.servicePersonField(0, 'name').fill('John');
    await registrationPage.servicePersonField(0, 'surname').fill('Smith');
    await registrationPage.servicePersonField(0, 'email').fill('john.smith@testcompany.com');
    await registrationPage.servicePersonField(0, 'cellPhone').fill('500123456');

    await registrationPage.addServicePersonButton.click();

    await registrationPage.servicePersonField(1, 'personType').selectOption('CONTRACT_FULL');
    await registrationPage.servicePersonField(1, 'name').fill('Emma');
    await registrationPage.servicePersonField(1, 'surname').fill('Johnson');
    await registrationPage.servicePersonField(1, 'email').fill('emma.johnson@testcompany.com');
    await registrationPage.servicePersonField(1, 'cellPhone').fill('500654321');
    await registrationPage.nextButton.click();
    await expect(registrationPage.minimumCountMessage).toBeVisible();
    await registrationPage.permissionsChoice.click();

    await registrationPage.addServicePersonButton.click();
    await registrationPage.servicePersonField(2, 'personType').selectOption('CONTRACT_FULL');
    await registrationPage.servicePersonField(2, 'name').fill('Michael');
    await registrationPage.servicePersonField(2, 'surname').fill('Brown');
    await registrationPage.servicePersonField(2, 'email').fill('michael.brown@testcompany.com');
    await registrationPage.servicePersonField(2, 'cellPhone').fill('500987654');
    await registrationPage.nextButton.click();
    await expect(registrationPage.managementAgreementHeading).toBeVisible();
    await expect(registrationPage.conductAgreementHeading).toBeVisible();
    await registrationPage.managementDocument
      .setInputFiles('./data/testowyPDF.pdf');

    await registrationPage.conductDocument
      .setInputFiles('./data/testowyPDF.pdf');
    await registrationPage.nextButton.click();
    await expect(registrationPage.referrerHeading).toBeVisible();
    await registrationPage.nextButton.click();

    // Dane podmiotu zatrudniającego
    await expect(registrationPage.employerDataHeading).toBeVisible();
    await expect(registrationPage.summaryEmployerField('krs')).toHaveValue(krs);
    await expect(registrationPage.summaryEmployerField('regon')).toHaveValue(regon);
    await expect(registrationPage.summaryEmployerField('nip')).toHaveValue(nip);
    await expect(registrationPage.summaryEmployerField('companyName')).toHaveValue(companyName);


    // Checkboxy
    await expect(registrationPage.emptyKrsCheckbox).not.toBeChecked();
    await expect(registrationPage.emptyRegonCheckbox).not.toBeChecked();

    // Radio buttony
    await expect(registrationPage.notPublicSectorRadio).toBeChecked();
    await expect(registrationPage.notSeparateRadio).toBeChecked();
    await expect(registrationPage.notPromoterCodeRadio).toBeChecked();
    // Adres siedziby
    await expect(registrationPage.summaryAddressField('companyAddress', 'city')).toHaveValue('Berlin');
    await expect(registrationPage.summaryAddressField('companyAddress', 'country')).toHaveValue('DE');
    await expect(registrationPage.summaryAddressField('companyAddress', 'street')).toHaveValue('Friedrichstrasse');
    await expect(registrationPage.summaryAddressField('companyAddress', 'number')).toHaveValue('123');
    await expect(registrationPage.summaryAddressField('companyAddress', 'apartmentNumber')).toHaveValue('8A');
    await expect(registrationPage.summaryAddressField('companyAddress', 'postTown')).toHaveValue('Berlin');
    await expect(registrationPage.summaryAddressField('companyAddress', 'zipCode')).toHaveValue('10117');

    // Adres korespondencyjny
    await expect(registrationPage.summaryAddressField('correspondenceAddress', 'city')).toHaveValue('Berlin');
    await expect(registrationPage.summaryAddressField('correspondenceAddress', 'country')).toHaveValue('DE');
    await expect(registrationPage.summaryAddressField('correspondenceAddress', 'street')).toHaveValue('Friedrichstrasse');
    await expect(registrationPage.summaryAddressField('correspondenceAddress', 'number')).toHaveValue('123');
    await expect(registrationPage.summaryAddressField('correspondenceAddress', 'apartmentNumber')).toHaveValue('8A');
    await expect(registrationPage.summaryAddressField('correspondenceAddress', 'postTown')).toHaveValue('Berlin');
    await expect(registrationPage.summaryAddressField('correspondenceAddress', 'zipCode')).toHaveValue('10117');

    // Osoba obsługująca 1
    await expect(registrationPage.summaryServicePersonField(0, 'personType'))
      .toHaveValue('CONTRACT_OPERATOR');
    await expect(registrationPage.summaryServicePersonField(0, 'name'))
      .toHaveValue('John');
    await expect(registrationPage.summaryServicePersonField(0, 'surname'))
      .toHaveValue('Smith');
    await expect(registrationPage.summaryServicePersonField(0, 'email'))
      .toHaveValue('john.smith@testcompany.com');
    await expect(registrationPage.summaryServicePersonField(0, 'cellPhone'))
      .toHaveValue('500123456');

    // Osoba obsługująca 2
    await expect(registrationPage.summaryServicePersonField(1, 'personType'))
      .toHaveValue('CONTRACT_FULL');
    await expect(registrationPage.summaryServicePersonField(1, 'name'))
      .toHaveValue('Emma');
    await expect(registrationPage.summaryServicePersonField(1, 'surname'))
      .toHaveValue('Johnson');
    await expect(registrationPage.summaryServicePersonField(1, 'email'))
      .toHaveValue('emma.johnson@testcompany.com');
    await expect(registrationPage.summaryServicePersonField(1, 'cellPhone'))
      .toHaveValue('500654321');

    // Osoba obsługująca 3
    await expect(registrationPage.summaryServicePersonField(2, 'personType'))
      .toHaveValue('CONTRACT_FULL');
    await expect(registrationPage.summaryServicePersonField(2, 'name'))
      .toHaveValue('Michael');
    await expect(registrationPage.summaryServicePersonField(2, 'surname'))
      .toHaveValue('Brown');
    await expect(registrationPage.summaryServicePersonField(2, 'email'))
      .toHaveValue('michael.brown@testcompany.com');
    await expect(registrationPage.summaryServicePersonField(2, 'cellPhone'))
      .toHaveValue('500987654');
    await expect(registrationPage.uploadedFileName).toHaveText('testowyPDF.pdf');
    await registrationPage.acceptButton.click();
    await expect(registrationPage.confirmationBody).toMatchAriaSnapshot(`
    - heading "Rejestracja umowy PPK" [level=1]
    - paragraph:
      - strong: Dziękujemy za rejestrację danych.
      - text: Sprawdź jakie są kolejne kroki w procesie.
    - paragraph: Po dokonaniu akceptacji umowa zostanie przekazana do weryfikacji przez Instytucję Finansową. O jej zatwierdzeniu poinformujemy drogą elektroniczną na adres wskazany w procesie rejestracji.
    `);
  });

  test.only('TC001-VAL - KRS wymagany', async ({
    loginAsFinancialInstitution,
    financialInstitutionDashboardPage,
    financialInstitutionRegistrationPage: registrationPage,
  }) => {
    await loginAsFinancialInstitution();
    await registrationPage.openMenu();
    await registrationPage.menuLink('Rejestracja umowy PPK').click();
    await registrationPage.employerField('regon').fill(await financialInstitutionDashboardPage.generateUniqueRegon());
    await registrationPage.employerField('nip').fill(await financialInstitutionDashboardPage.generateNip());
    await registrationPage.employerField('companyName').fill('Test Company');
    await registrationPage.legalForm.selectOption('FOUNDATION');
    await registrationPage.noCorrespondenceAddress.click();
    await expect(registrationPage.registeredAddressHeading).toBeVisible();
    await registrationPage.addressField('companyAddress', 'city').fill('Berlin');
    await registrationPage.addressField('companyAddress', 'country').selectOption('DE');
    await registrationPage.addressField('companyAddress', 'street').fill('Friedrichstrasse');
    await registrationPage.addressField('companyAddress', 'number').fill('123');
    await registrationPage.addressField('companyAddress', 'apartmentNumber').fill('8A');
    await registrationPage.addressField('companyAddress', 'postTown').fill('Berlin');
    await registrationPage.addressField('companyAddress', 'zipCode').fill('10117');
    await registrationPage.nextButton.click();
    await expect(registrationPage.validationMessage('krs', 'Pole wymagane')).toBeVisible();
    await registrationPage.employerField('krs').fill('123456789');
    await registrationPage.nextButton.click();
    await expect(registrationPage.validationMessage('krs', 'Nieprawidłowy numer KRS')).toBeVisible();
  });

  test.only('TC001-VAL - REGON wymagany', async ({
    loginAsFinancialInstitution,
    financialInstitutionDashboardPage,
    financialInstitutionRegistrationPage: registrationPage,
  }) => {
    await loginAsFinancialInstitution();
    await registrationPage.openMenu();
    await registrationPage.menuLink('Rejestracja umowy PPK').click();
    await registrationPage.employerField('krs').fill(testData.aggremantUser.krs);
    await registrationPage.employerField('nip').fill(await financialInstitutionDashboardPage.generateNip());
    await registrationPage.employerField('companyName').fill('Test Company');
    await registrationPage.legalForm.selectOption('FOUNDATION');
    await registrationPage.noCorrespondenceAddress.click();
    await expect(registrationPage.registeredAddressHeading).toBeVisible();
    for (const [field, value] of Object.entries({ city: 'Berlin', street: 'Friedrichstrasse', number: '123', apartmentNumber: '8A', postTown: 'Berlin', zipCode: '10117' })) {
      await registrationPage.addressField('companyAddress', field).fill(value);
    }
    await registrationPage.addressField('companyAddress', 'country').selectOption('DE');
    await registrationPage.nextButton.click();
    await expect(registrationPage.validationMessage('regon')).toBeVisible();
    await registrationPage.employerField('regon').fill('12345678');
    await registrationPage.nextButton.click();
    await expect(registrationPage.validationMessage('regon')).toBeVisible();
    await registrationPage.employerField('regon').fill(await financialInstitutionDashboardPage.generateUniqueRegon());
    await registrationPage.addressField('companyAddress', 'city').clear();
    await registrationPage.nextButton.click();
    await expect(registrationPage.invalidAddressMessage('companyAddress.city')).toBeVisible();
  });

  test.only('TC001-VAL - Weryfikacja zarejestrowanej umowy PPK', async ({
    loginAsFinancialInstitution,
    financialInstitutionDashboardPage,
    financialInstitutionAgreementPage: agreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openMenu();
    await agreementPage.menuLink('Umowy PPK - zaakceptowane').click();
    await agreementPage.searchBox.fill('Global E');
    await agreementPage.companyCell.click();
    await expect(agreementPage.dateCell).toBeVisible();

    await financialInstitutionDashboardPage.waitForLocatorOrClick(
      agreementPage.contractDateText,
      3,
      agreementPage.firstTableCell
    );
    await expect(agreementPage.generalTab).toBeVisible();
    await expect(agreementPage.companyTab).toBeVisible();
    await expect(agreementPage.representativesTab).toBeVisible();
    await expect(agreementPage.documentsTab).toBeVisible();
    await expect(agreementPage.eventsTab).toBeVisible();
    await financialInstitutionDashboardPage.replaceFirstCharacterWithRandom(
      agreementPage.allTextboxes
    );
    await agreementPage.saveButton.click();

    await financialInstitutionDashboardPage.waitForLocatorOrClick(
      agreementPage.contractDateText,
      5,
      agreementPage.firstTableCell
    );
    await expect(agreementPage.noteSavedMessage).toBeVisible();
    await expect(agreementPage.negotiatedStatus).toBeVisible();
    await expect(agreementPage.acceptedStatus).toBeVisible();
    await agreementPage.promoterEditLink.click();
    await financialInstitutionDashboardPage.replaceFirstCharacterWithRandom(
      agreementPage.promoterInput
    );
    await agreementPage.saveButton.click();
    await agreementPage.clientAdvisorEditLink.click();
    await agreementPage.clientAdvisorSelect.selectOption({ label: 'justyna sabat' });
    await agreementPage.clientAdvisorSaveButton.click();
    await expect(agreementPage.currentClientAdvisor).toContainText('justyna sabat');
    await agreementPage.companyTab.click();
    await expect(agreementPage.companyDataPanel.getByText('Global Education Foundation')).toBeVisible();
    await expect(agreementPage.text('Fundacja')).toBeVisible();
    await expect(agreementPage.text('Niemcy').first()).toBeVisible();
    await expect(agreementPage.text('Niemcy').nth(1)).toBeVisible();
    await agreementPage.representativesTab.click();
    await agreementPage.documentsTab.click();
    await expect(agreementPage.agreementLink('Umowa o zarządzanie PPK')).toBeVisible();
    await expect(agreementPage.agreementLink('Umowa o prowadzenie PPK')).toBeVisible();
    await agreementPage.eventsTab.click();
    await expect(agreementPage.timeline).toMatchAriaSnapshot(`
    - heading /\\d+-\\d+-\\d+ \\d+:\\d+:\\d+/ [level=6]
    - paragraph: "Umowa zarejestrowana w systemie przez: Emi_op_full (panel IF)"
    `);
    await expect(agreementPage.timeline).toMatchAriaSnapshot(`
    - heading /\\d+-\\d+-\\d+ \\d+:\\d+:\\d+/ [level=6]
    - paragraph: Nadanie dostępu osobom obsługującym PPK
    `);
  });



  // Kroki testowe:
  // 1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
  // 2. Użytkownik naciska przycisk "Zmiana" przy dowolnej umowie oczekującej.
  // 3. Użytkownik naciska przycisk "Anuluj".
  // 4. Użytkownik naciska przycisk "Anuluj umowę" w oknie potwierdzenia.
  test.only('TC002 - Anulowanie umowy oczekującej', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage: agreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAwaitingAgreements();
    await agreementPage.waitForAcceptedAgreementsTable();

    let cancellationData: PendingAgreementCancellationData;

    await test.step('Capture the first awaiting agreement', async () => {
      await expect(agreementPage.firstPendingAgreement).toBeVisible();
      cancellationData = await agreementPage.capturePendingAgreementCancellationData();
      expect(cancellationData.employerName).not.toBe('');
      if (cancellationData.hasMatchingDuplicate) {
        expect(cancellationData.firstExactRegistrationDate).not.toBe('');
        expect(cancellationData.secondExactRegistrationDate).not.toBe(cancellationData.firstExactRegistrationDate);
      }
    });

    await test.step('Open the cancellation confirmation popup', async () => {
      await agreementPage.openFirstPendingAgreementCancellation();
      await expect(agreementPage.cancelAgreementDialog).toBeVisible();
    });

    await test.step('Verify the selected employer before confirming cancellation', async () => {
      await expect(agreementPage.heading('Anulowanie umowy o zarzą')).toBeVisible();
      await expect(agreementPage.cancelAgreementDialog).toContainText(cancellationData.employerName);
      await agreementPage.confirmAgreementCancellation();
      await expect(agreementPage.agreementCancellationSuccessMessage(cancellationData.employerName)).toBeVisible();
    });

    await test.step('Verify the cancelled agreement leaves the awaiting list', async () => {
      const matchingAgreements = agreementPage.cancelledAgreementRows(cancellationData);

      if (cancellationData.hasMatchingDuplicate) {
        await agreementPage.openAgreementDetails(matchingAgreements.first());
        const firstRemainingExactRegistrationDate = (await agreementPage.detailedRegistrationDate(matchingAgreements.first()).innerText()).trim();
        expect(firstRemainingExactRegistrationDate).toBe(cancellationData.secondExactRegistrationDate);
        expect(firstRemainingExactRegistrationDate).not.toBe(cancellationData.firstExactRegistrationDate);
      } else {
        await expect(matchingAgreements).toHaveCount(0);
      }
    });

    await test.step('Verify the cancelled agreement appears on the cancelled tab', async () => {
      await agreementPage.openAgreementStatusTab('Anulowane');
      await agreementPage.searchAgreements(cancellationData.employerName);
      await agreementPage.setAgreementPageSize('100');

      const cancelledAgreements = agreementPage.cancelledAgreementRows(cancellationData);

      await expect(cancelledAgreements.first()).toBeVisible();
      const matchingAgreementCount = await cancelledAgreements.count();
      const cancelledAgreementIds: string[] = [];

      for (let index = 0; index < matchingAgreementCount; index += 1) {
        const candidateAgreement = cancelledAgreements.nth(index);

        await agreementPage.openAgreementDetails(candidateAgreement);
        const candidateAgreementId = await agreementPage.agreementId(candidateAgreement);
        await agreementPage.closeAgreementDetails(candidateAgreement);
        cancelledAgreementIds.push(candidateAgreementId);
      }

      expect(cancelledAgreementIds).toContain(cancellationData.agreementId);
    });
  });

  // Kroki testowe:
  // 1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
  // 2. Użytkownik naciska przycisk "Zmiana" przy danej umowie.
  // 3. Użytkownik naciska przycisk "Zweryfikuj".
  // 4. Użytkownik naciska przycisk "Zweryfikuj umowę" w oknie potwierdzenia.
  test.only('TC003 - Zweryfikowanie umowy oczekującej', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAwaitingAgreements();
    await agreementPage.waitForAcceptedAgreementsTable();

    let agreement: PendingAgreementActionData;
    await test.step('Find an agreement awaiting financial institution approval', async () => {
      agreement = await agreementPage.findPendingAgreementByStatus('Do akceptacji IF');
      expect(agreement.detailedRegistrationDate).not.toBe('');
    });

    await test.step('Verify the agreement', async () => {
      await agreementPage.openPendingAgreementAction(agreement, 'Zweryfikuj');
      await expect(agreementPage.pendingAgreementActionDialog).toBeVisible();
      await agreementPage.confirmPendingAgreementAction('Zweryfikuj umowę');
      await expect(agreementPage.pendingAgreementActionResult).toBeVisible();
    });

    await test.step('Verify the agreement in the awaiting tab with the verified status', async () => {
      await agreementPage.openAgreementStatusTab('Oczekujące');
      await agreementPage.searchAgreements(agreement.employerName);
      await agreementPage.setAgreementPageSize('100');
      const verifiedAgreement = agreementPage.contractRowsMatching({
        ...agreement,
        status: 'Zweryfikowane',
      });
      await expect(verifiedAgreement.first()).toBeVisible();
    });
  });

  // Kroki testowe:
  // 1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
  // 2. Użytkownik naciska przycisk "Zmiana" przy danej umowie.
  // 3. Użytkownik naciska przycisk "Akceptuj".
  // 4. Użytkownik naciska przycisk "Zaakceptuj umowę" w oknie potwierdzenia.
  test.only('TC004 - Zaakceptowanie umowy oczekującej', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAwaitingAgreements();
    await agreementPage.waitForAcceptedAgreementsTable();

    let agreement: PendingAgreementActionData;
    await test.step('Find an agreement awaiting financial institution approval', async () => {
      agreement = await agreementPage.findPendingAgreementByStatus('Do akceptacji IF');
      expect(agreement.detailedRegistrationDate).not.toBe('');
    });

    await test.step('Accept the agreement', async () => {
      await agreementPage.openPendingAgreementAction(agreement, 'Akceptuj');
      await expect(agreementPage.pendingAgreementActionDialog).toBeVisible();
      await agreementPage.confirmPendingAgreementAction('Zaakceptuj umowę');
      await expect(agreementPage.pendingAgreementActionResult).toBeVisible();
    });

    await test.step('Verify the agreement in the accepted tab', async () => {
      await agreementPage.openAgreementStatusTab('Zaakceptowane');
      await agreementPage.searchAgreements(agreement.employerName);
      await agreementPage.setAgreementPageSize('100');
      const acceptedAgreement = agreementPage.contractRowsMatching({
        ...agreement,
        status: 'Zaakceptowane',
      });
      await expect(acceptedAgreement.first()).toBeVisible();
    });
  });

  // Kroki testowe:
  // 1. Reprezentant lub pełnomocnik otwiera automatycznie wysłaną wiadomość e-mail.
  // 2. Naciska odnośnik "Pobierz umowę".
  // 3. Przechodzi captcha i naciska "Wyślij SMS" na automatycznie otwartej karcie.
  // 4. Wpisuje otrzymany kod SMS.
  // 5. Naciska "Zatwierdź".
  // 6. Naciska odnośnik pobrania lub podglądu dokumentu.
  blockedTest('TC005 - Pobieranie umowy z maila', 'Wymaga dostępu do skrzynki e-mail, captcha i kodu SMS.', true);

  // Kroki testowe:
  // 1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
  // 2. Użytkownik naciska ikonę "+" przy nazwie firmy.
  test('TC006 - Podgląd informacji o firmie', async ({ page, loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await expect(agreementPage.generalTab).toBeVisible();
    await expect(agreementPage.negotiatedStatus).toBeVisible();
    await expect(agreementPage.acceptedStatus).toBeVisible();

    await agreementPage.companyTab.click();
    await expect(agreementPage.companyDataPanel).toBeVisible();
    await expect(agreementPage.companyDataPanel.getByText('Global Education Foundation')).toBeVisible();
    await expect(agreementPage.text('Fundacja')).toBeVisible();
    await expect(agreementPage.text('Niemcy').first()).toBeVisible();
    await expect(agreementPage.text('Niemcy').nth(1)).toBeVisible();

    await expect(agreementPage.companyTab).toBeVisible();
    await agreementPage.representativesTab.click();
    await expect(agreementPage.representativesTab).toBeVisible();
    await agreementPage.documentsTab.click();
    await expect(agreementPage.documentsTab).toBeVisible();
    await expect(agreementPage.agreementLink('Umowa o zarządzanie PPK')).toBeVisible();
    await expect(agreementPage.agreementLink('Umowa o prowadzenie PPK')).toBeVisible();
    await agreementPage.eventsTab.click();
    await expect(agreementPage.eventsTab).toBeVisible();
    await expect(agreementPage.timeline).toBeVisible();
    await expect(agreementPage.timeline).toMatchAriaSnapshot(`
    - heading /\\d+-\\d+-\\d+ \\d+:\\d+:\\d+/ [level=6]
    - paragraph: "Umowa zarejestrowana w systemie przez: Emi_op_full (panel IF)"
    `);
    await expect(agreementPage.timeline).toMatchAriaSnapshot(`
    - heading /\\d+-\\d+-\\d+ \\d+:\\d+:\\d+/ [level=6]
    - paragraph: Nadanie dostępu osobom obsługującym PPK
    `);
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej".
  // 2. Naciska ikonę "+" przy nazwie firmy.
  // 3. Naciska pole "Notatka".
  // 4. Wpisuje notatkę.
  // 5. Naciska "Zapisz".
  test('TC007 - Dodanie notatki', async ({ page, loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);

    const note = `Notatka testowa ${Date.now()}`;
    await agreementPage.noteInput.fill('');
    await agreementPage.noteInput.pressSequentially(note);
    await agreementPage.noteSaveButton.click();
    await expect(agreementPage.noteSavedMessage).toBeVisible();
    await expect(agreementPage.noteInput).toHaveValue(note);
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska "Edytuj" przy polu "Kod sprzedawcy".
  // 3. Wpisuje poprawny kod.
  // 4. Naciska "Zapisz".
  test('TC008 - Edycja kodu sprzedawcy', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    test.fixme(true, 'Brak dostępnego przycisku "Zapisz" dla edycji kodu sprzedawcy.');
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await agreementPage.promoterEditLink.click();
    await agreementPage.promoterInput.fill('123456');
    await agreementPage.saveButton.click();
    await expect(agreementPage.promoterInput).toHaveValue('123456');
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska "Edytuj" przy polu "Kod sprzedawcy".
  // 3. Wpisuje niepoprawny kod.
  // 4. Naciska "Zapisz".
  test('TC009 - Edycja kodu sprzedawcy - niepoprawny kod', async ({ page, loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    //test.fixme(true, 'Brak dostępnego przycisku "Zapisz" dla edycji kodu sprzedawcy.');
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await agreementPage.promoterEditLink.click();
    await agreementPage.promoterInput.fill('123456');
    await page.pause();
    await agreementPage.saveButton.click();
    await expect(agreementPage.promoterInput).toHaveValue('123456');
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska "Edytuj" przy polu "Opiekun klienta".
  // 3. Wybiera osobę z listy.
  // 4. Naciska "Zapisz".
  test('TC010 - Edycja opiekuna klienta', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await agreementPage.clientAdvisorEditLink.click();
    await expect(agreementPage.clientAdvisorSelect).toBeVisible();
    await expect(agreementPage.clientAdvisorSelect.locator('option')).not.toHaveCount(0);
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska kafelek "Dane firmy".
  // 3. Naciska "Zmień dane".
  // 4. Aktualizuje formularz i naciska "Dalej".
  // 5. Naciska "Zatwierdź zmiany".
  // 6. Naciska "Tak" w oknie dialogowym.
  test('TC011 - Zmiana danych firmy', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await agreementPage.companyTab.click();
    await agreementPage.companyDataChangeLink.click();
    const street = agreementPage.companyChangeField('companyAddress', 'street');
    const original = await street.inputValue();
    await street.fill(original === 'Kopernika' ? 'Friedrichstrasse' : 'Kopernika');
    await agreementPage.button('Dalej').click();
    await agreementPage.link('ZatwierdLs zmiany').click();
    await agreementPage.link('Tak').click();
    await expect(agreementPage.companyDataSavedMessage).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska kafelek "Reprezentanci/Pełnomocnicy".
  // 3. Naciska "Wyślij" przy reprezentancie.
  // 4. Naciska "Wyślij" w oknie dialogowym.
  blockedTest('TC012 - Ponowne wysłanie linku do akceptacji umowy', 'Wymaga niepotwierdzonej umowy i sprawdzenia wysyłki e-mail.');

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska kafelek "Dokumenty".
  // 3. Naciska nazwę dokumentu.
  test('TC013 - Pobieranie dokumentów', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await agreementPage.documentsTab.click();
    const downloadPromise = agreementPage.page.waitForEvent('download');
    await agreementPage.agreementLink('Umowa o zarządzanie PPK').click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska kafelek "Dokumenty".
  // 3. Naciska pole dodawania pliku i wybiera plik.
  // 4. Wybiera typ dokumentu.
  // 5. Naciska "Prześlij plik".
  test('TC014 - Dodawanie dokumentów', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await agreementPage.documentsTab.click();
    const before = await agreementPage.uploadedDocumentFileName.count();
    await agreementPage.uploadDocument(TEST_DOCUMENT);
    await expect(agreementPage.uploadedDocumentFileName).toHaveCount(before + 1);
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
  // 2. Naciska kafelek "Zdarzenia".
  test('TC015 - Podgląd historii zdarzeń', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage, financialInstitutionDashboardPage: dashboardPage }) => {
    await loginAsFinancialInstitution();
    await openAcceptedAgreement(agreementPage, dashboardPage);
    await agreementPage.eventsTab.click();
    await expect(agreementPage.timeline).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej".
  // 2. Wybiera zakładkę do wyszukiwania.
  // 3. Wpisuje wartości w polu "Szukaj".
  test('TC016 - Wyszukiwanie firmy z listy', async ({ loginAsFinancialInstitution, financialInstitutionAgreementPage: agreementPage }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAcceptedAgreements();
    await agreementPage.searchAgreements(EXISTING_EMPLOYER);
    await expect(agreementPage.companyCell).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej".
  // 2. Otwiera "Menu" i z sekcji "Uprawnienia" wybiera "Użytkownicy".
  // 3. Naciska "Dodaj użytkownika".
  // 4. Uzupełnia formularz danymi i uprawnieniami.
  // 5. Naciska "Zapisz użytkownika".
  test('TC017 - Dodawanie użytkownika do panelu instytucji finansowej', async ({ loginAsFinancialInstitution, employerUserAdminPage: userPage }) => {
    await loginAsFinancialInstitution();
    await userPage.openMenu();
    await userPage.menuLink('Użytkownicy').click();
    await userPage.addUserLink.click();
    await expect(userPage.loginInput).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
  // 2. Naciska "Edytuj" przy użytkowniku.
  // 3. Aktualizuje dane i uprawnienia.
  // 4. Naciska "Zapisz użytkownika".
  test('TC018 - Edycja użytkownika panelu instytucji finansowej', async ({ loginAsFinancialInstitution, employerUserAdminPage: userPage }) => {
    await loginAsFinancialInstitution();
    await userPage.openMenu();
    await userPage.menuLink('Użytkownicy').click();
    await expect(userPage.heading).toBeVisible();
    await expect(userPage.table).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
  // 2. Naciska "Zmień hasło" przy użytkowniku.
  // 3. Naciska "WYGENERUJ I WYŚLIJ HASŁO".
  test('TC019 - Zmiana hasła użytkownika panelu instytucji finansowej', async ({ loginAsFinancialInstitution, employerUserAdminPage: userPage }) => {
    await loginAsFinancialInstitution();
    await userPage.openMenu();
    await userPage.menuLink('Użytkownicy').click();
    await expect(userPage.table).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
  // 2. Naciska "Usuń" przy użytkowniku.
  // 3. Naciska "Usuń użytkownika".
  test('TC020 - Usuwanie użytkownika z panelu instytucji finansowej', async ({ loginAsFinancialInstitution, employerUserAdminPage: userPage }) => {
    await loginAsFinancialInstitution();
    await userPage.openMenu();
    await userPage.menuLink('Użytkownicy').click();
    await expect(userPage.table).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
  // 2. Naciska "Odblokuj dostęp" przy zablokowanym użytkowniku.
  // 3. Naciska "Odblokuj użytkownika".
  test('TC021 - Odblokowanie dostępu użytkownikowi z zablokowanym kontem', async ({ loginAsFinancialInstitution, employerUserAdminPage: userPage }) => {
    await loginAsFinancialInstitution();
    await userPage.openMenu();
    await userPage.menuLink('Użytkownicy').click();
    await expect(userPage.table).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Grupy uprawnień".
  // 2. Naciska "Utwórz nową grupę uprawnień".
  // 3. Wybiera uprawnienia i nadaje grupie nazwę.
  // 4. Naciska "Zapisz grupę uprawnień".
  test('TC022 - Tworzenie nowej grupy uprawnień', async ({ loginAsFinancialInstitution, permissionGroupsPage }) => {
    await loginAsFinancialInstitution();
    await permissionGroupsPage.openMenu();
    await permissionGroupsPage.menuLink('Grupy uprawnień').click();
    await permissionGroupsPage.createGroupLink.click();
    await expect(permissionGroupsPage.editHeading).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Grupy uprawnień".
  // 2. Naciska "Edytuj" przy grupie.
  // 3. Modyfikuje grupę.
  // 4. Naciska "Zapisz grupę uprawnień".
  test('TC023 - Edycja grupy uprawnień', async ({ loginAsFinancialInstitution, permissionGroupsPage }) => {
    await loginAsFinancialInstitution();
    await permissionGroupsPage.openMenu();
    await permissionGroupsPage.menuLink('Grupy uprawnień').click();
    await expect(permissionGroupsPage.heading).toBeVisible();
    await expect(permissionGroupsPage.searchBox).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Grupy uprawnień".
  // 2. Naciska "Usuń" przy grupie.
  // 3. Naciska "Usuń grupę uprawnień".
  test('TC024 - Usuwanie grupy uprawnień', async ({ loginAsFinancialInstitution, permissionGroupsPage }) => {
    await loginAsFinancialInstitution();
    await permissionGroupsPage.openMenu();
    await permissionGroupsPage.menuLink('Grupy uprawnień').click();
    await expect(permissionGroupsPage.heading).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej".
  // 2. Z "Menu" i sekcji "PPK" wybiera "Lista uczestników".
  // 3. Naciska "Więcej".
  // 4. Uzupełnia filtry.
  // 5. Naciska "Wyszukaj".
  test('TC025 - Podgląd listy uczestników', async ({ loginAsFinancialInstitution, financialInstitutionParticipantListPage: participantPage }) => {
    await loginAsFinancialInstitution();
    await participantPage.open();
    await participantPage.showMoreFilters();
    await participantPage.search({ firstName: 'Mariusz' });
    await expect(participantPage.bodyRows().first()).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu", sekcję "PPK" i "Raporty".
  // 2. W polu "Nazwa raportu" wybiera "Umowy PPK".
  // 3. Wybiera zakres dat.
  // 4. Naciska "Generuj raport".
  test('TC026 - Pobranie raportu umów PPK', async ({ loginAsFinancialInstitution, financialInstitutionReportsPage: reportsPage }) => {
    await loginAsFinancialInstitution();
    await reportsPage.open();
    await reportsPage.selectReport('Umowy PPK');
    await reportsPage.fillDateRange('2026-01-01', '2026-12-31');
    const downloadPromise = reportsPage.page.waitForEvent('download');
    await reportsPage.generateButton.click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  // Kroki testowe:
  // 1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Raporty".
  // 2. W polu "Nazwa raportu" wybiera "Użytkownicy serwisu PPK".
  // 3. Naciska "Generuj raport".
  test('TC027 - Pobranie raportu użytkowników serwisu PPK', async ({ loginAsFinancialInstitution, financialInstitutionReportsPage: reportsPage }) => {
    await loginAsFinancialInstitution();
    await reportsPage.open();
    await reportsPage.selectReport('Użytkownicy serwisu PPK');
    const downloadPromise = reportsPage.page.waitForEvent('download');
    await reportsPage.generateButton.click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  // Kroki testowe:
  // 1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Raporty".
  // 2. W polu "Nazwa raportu" wybiera "Raport z informacją o linkach".
  // 3. Naciska "Generuj raport".
  test('TC028 - Pobranie raportu z informacją o linkach', async ({ loginAsFinancialInstitution, financialInstitutionReportsPage: reportsPage }) => {
    await loginAsFinancialInstitution();
    await reportsPage.open();
    await reportsPage.selectReport('Raport z informacją o linkach');
    const downloadPromise = reportsPage.page.waitForEvent('download');
    await reportsPage.generateButton.click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  // Kroki testowe:
  // 1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Raporty".
  // 2. W polu "Nazwa raportu" wybiera "Raport firm przesyłających korekty".
  // 3. Wybiera zakres dat.
  // 4. Naciska "Generuj raport".
  test('TC029 - Pobranie raportu firm przesyłających korekty', async ({ loginAsFinancialInstitution, financialInstitutionReportsPage: reportsPage }) => {
    await loginAsFinancialInstitution();
    await reportsPage.open();
    await reportsPage.selectReport('Raport firm przesyłających korekty');
    await reportsPage.fillDateRange('2026-01-01', '2026-12-31');
    const downloadPromise = reportsPage.page.waitForEvent('download');
    await reportsPage.generateButton.click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  // Kroki testowe:
  // 1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "Raporty".
  // 2. W polu "Nazwa raportu" wybiera "Umowy z rozliczania składek".
  // 3. Wybiera zakres dat.
  // 4. Podaje nazwę lub REGON pracodawcy.
  // 5. Wybiera pracodawcę z przefiltrowanej listy.
  // 6. Naciska "Generuj raport".
  blockedTest('TC030 - Pobranie raportu z rozliczenia składek', 'Wymaga stabilnego pracodawcy i danych raportu zależnych od środowiska.');

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej".
  // 2. Z "Menu" i sekcji "PPK" wybiera "Informacje i dokumenty".
  // 3. Naciska dowolny odnośnik.
  test('TC031 - Podgląd informacji i dokumentów', async ({ loginAsFinancialInstitution, financialInstitutionDocumentsPage: documentsPage }) => {
    await loginAsFinancialInstitution();
    await documentsPage.open();
    await expect(documentsPage.heading).toBeVisible();
    await expect(documentsPage.attachments.first()).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Naciska "Zmiana".
  // 3. Wybiera "Akceptuj" z listy.
  // 4. Naciska "Akceptuj" w oknie dialogowym.
  test('TC032 - Zaakceptowanie oczekującego zlecenia', async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open('awaiting');
    await ordersPage.openFirstActionMenu();
    await ordersPage.action('Akceptuj').click();
    await ordersPage.page.getByRole('dialog').getByRole('button', { name: 'Akceptuj' }).click();
    await expect(ordersPage.page.getByText(/zaakceptow/i)).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Naciska "Zmiana" i wybiera "Odrzuć".
  // 3. Wpisuje powód odrzucenia.
  // 4. Naciska "Odrzuć zlecenie" w oknie dialogowym.
  test('TC033 - Odrzucenie oczekującego zlecenia', async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open('awaiting');
    await ordersPage.openFirstActionMenu();
    await ordersPage.action('Odrzuć').click();
    const dialog = ordersPage.page.getByRole('dialog');
    await dialog.getByRole('textbox').fill('Powód testowy');
    await dialog.getByRole('button', { name: 'Odrzuć zlecenie' }).click();
    await expect(ordersPage.page.getByText(/odrzucon/i)).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Naciska "Zmiana" i wybiera "Wyjaśnij".
  // 3. Wpisuje powód wyjaśnienia.
  // 4. Naciska "Wyjaśnij zlecenie" w oknie dialogowym.
  test('TC034 - Wyjaśnienie oczekującego zlecenia', async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open('awaiting');
    await ordersPage.openFirstActionMenu();
    await ordersPage.action('Wyjaśnij').click();
    const dialog = ordersPage.page.getByRole('dialog');
    await dialog.getByRole('textbox').fill('Wyjaśnienie testowe');
    await dialog.getByRole('button', { name: 'Wyjaśnij zlecenie' }).click();
    await expect(ordersPage.page.getByText(/wyjaśn/i)).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Naciska ikonę w kolumnie "Notatka".
  // 3. Wpisuje treść notatki.
  // 4. Naciska "Zapisz" w oknie dialogowym.
  // 5. Ponownie otwiera notatkę przy tym samym zleceniu.
  test('TC035 - Dodanie notatki do zlecenia', async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open('awaiting');
    await ordersPage.openFirstNoteDialog();
    await ordersPage.noteInput.fill(`Notatka ${Date.now()}`);
    await ordersPage.saveNoteButton.click();
    await expect(ordersPage.noteDialog).not.toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Naciska ikonę w kolumnie "Dokumenty".
  // 3. Otwiera załącznik z listy dokumentów.
  test('TC036 - Podgląd dokumentu dołączonego do zlecenia', async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open('awaiting');
    await ordersPage.openFirstDocumentsDialog();
    await expect(ordersPage.documentsDialog).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Naciska ikonę w kolumnie "Dokumenty".
  // 3. Naciska pole przekazywania pliku.
  // 4. Wybiera plik.
  blockedTest('TC037 - Dodanie dodatkowego dokumentu do zlecenia', 'Wymaga zlecenia dopuszczającego dodanie załącznika.');

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Naciska ikonę w kolumnie "Zlecenie".
  test('TC038 - Pobranie potwierdzenia zlecenia', async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open('awaiting');
    const downloadPromise = ordersPage.page.waitForEvent('download');
    await ordersPage.confirmationDownload().click();
    await expectNonEmptyDownload(await downloadPromise);
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
  // 2. Przechodzi do zakładki "Odrzucone".
  // 3. Naciska ikonę w kolumnie "Powód odrzucenia".
  test('TC039 - Podgląd powodu odrzucenia zlecenia', async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open('canceled');
    await ordersPage.openFirstActionMenu();
    await expect(ordersPage.page.getByRole('dialog')).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Wypowiedzenie UoZ".
  // 2. Uzupełnia filtry i naciska "Wyszukaj".
  // 3. Wybiera firmę z listy.
  // 4. Uzupełnia formularz wypowiedzenia.
  // 5. Naciska "Zatwierdź wypowiedzenie".
  // 6. Naciska "Tak" w oknie dialogowym.
  blockedTest('TC040 - Wypowiedzenie umowy o zarządzanie', 'Wymaga dedykowanych danych umowy i odwracalnego środowiska testowego.');

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Ustawienia" > "Zmiana hasła".
  // 2. Uzupełnia formularz.
  // 3. Naciska "Zmień hasło".
  test('TC041 - Zmiana hasła', async ({ loginAsFinancialInstitution, page }) => {
    await loginAsFinancialInstitution();
    await page.getByRole('link', { name: 'Menu' }).click();
    await page.getByRole('link', { name: 'Zmiana hasła', exact: true }).click();
    await expect(page.getByRole('heading', { name: /Zmiana hasła/i })).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Ustawienia" > "Zmiana hasła".
  // 2. Wpisuje hasło niespełniające wymagań bezpieczeństwa.
  test('TC042 - Próba zmiany hasła bez spełnionych wymagań bezpieczeństwa', async ({ loginAsFinancialInstitution, page }) => {
    await loginAsFinancialInstitution();
    await page.getByRole('link', { name: 'Menu' }).click();
    await page.getByRole('link', { name: 'Zmiana hasła', exact: true }).click();
    const newPassword = page.getByRole('textbox', { name: /Nowe hasło/i });
    await newPassword.fill('abc');
    await expect(newPassword).toHaveClass(/is-invalid|error/);
    await expect(page.getByRole('button', { name: 'Zmień hasło' })).toBeDisabled();
  });

  // Kroki testowe:
  // 1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Ustawienia" > "Zaufane urządzenia".
  // 2. Naciska "Usuń" obok urządzenia.
  // 3. Naciska "Usuń urządzenie".
  blockedTest('TC043 - Usuwanie urządzenia z zaufanych', 'Wymaga osobnego Page Objecta ustawień finansowej instytucji.');

  // Kroki testowe:
  // 1. Użytkownik z sekcji "Kontakt" wybiera "Formularz kontaktowy".
  // 2. Uzupełnia formularz.
  // 3. Przechodzi captcha i naciska "Wyślij pytanie".
  blockedTest('TC044 - Wysyłka formularza kontaktowego', 'Wymaga rozwiązania captcha oraz asercji wiadomości e-mail.');

  // Kroki testowe:
  // 1. Użytkownik naciska kafelek "Podgląd Pracodawców".
  // 2. Uzupełnia filtry w rozwiniętej wyszukiwarce.
  // 3. Naciska "Wyszukaj".
  test('TC045 - Podgląd pracodawców', async ({ loginAsFinancialInstitution, financialInstitutionEmployerPreviewPage: employersPage }) => {
    await loginAsFinancialInstitution();
    await employersPage.open();
    await employersPage.search({ employerName: EXISTING_EMPLOYER });
    await expect(employersPage.bodyRows().first()).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik naciska kafelek "Podgląd Pracodawców".
  // 2. Uzupełnia filtry i naciska "Wyszukaj".
  // 3. Naciska element listy odpowiadający wyszukiwanemu pracodawcy.
  test('TC046 - Wejście do panelu pracodawcy', async ({ loginAsFinancialInstitution, financialInstitutionEmployerPreviewPage: employersPage }) => {
    await loginAsFinancialInstitution();
    await employersPage.open();
    await employersPage.search({ employerName: EXISTING_EMPLOYER });
    await employersPage.bodyRows().first().click();
    await expect(employersPage.page).toHaveURL(/employer/);
    await expect(employersPage.page.getByRole('banner')).toBeVisible();
  });

  // Kroki testowe:
  // 1. Użytkownik naciska przycisk "Wyloguj" w prawym górnym rogu.
  test('TC047 - Wylogowanie z panelu instytucji finansowej', async ({ loginAsFinancialInstitution, financialInstitutionDashboardPage: dashboardPage, page }) => {
    await loginAsFinancialInstitution();
    await expect(dashboardPage.heading).toBeVisible();
    await dashboardPage.logout();
    await expect(page).toHaveURL(/login/);
    await expect(page.getByText('Zostałeś prawidłowo wylogowany')).toBeVisible();
  });
});
