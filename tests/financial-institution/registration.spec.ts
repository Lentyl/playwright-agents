import { test, expect } from '../../fixtures/pagesFixtures';
import testData from '../../data/testData.json';
import { FINANCIAL_INSTITUTION_LANDING_PATH } from '../../pages/FinancialInstitutionDashboardPage';

test.describe('TC-FI — Financial Institution authentication', () => {

    test('TC001-FI - Create PPK agreement', async ({
        financialInstitutionDashboardPage,
        financialInstitutionRegistrationPage: registrationPage,
        loginAsFinancialInstitution,
        page,
    }) => {
        await loginAsFinancialInstitution();
        await page.pause();
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
      - text: SprawdLs jakie są kolejne kroki w procesie.
    - paragraph: Po dokonaniu akceptacji umowa zostanie przekazana do weryfikacji przez Instytucję Finansową. O jej zatwierdzeniu poinformujemy drogą elektroniczną na adres wskazany w procesie rejestracji.
    `);
    });

    test('TC002-VAL - KRS wymagany', async ({
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


    test('TC003-VAL - REGON wymagany', async ({
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

});