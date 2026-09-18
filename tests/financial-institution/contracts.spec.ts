import { test, expect } from '../../fixtures/pagesFixtures';

test.describe('TC-FI - Contract management', () => {

    test('TC001-VAL - Agreement registration verification general tab', async ({
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

    test('TC002-VAL - Agreement registration verification data tab', async ({
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
            10,
            agreementPage.firstTableCell,
        );
        await agreementPage.companyTab.click();
        await expect(agreementPage.companyDataPanel).toContainText('Global Education Foundation');
        await agreementPage.companyDataChangeLink.click();
        const streetField = agreementPage.companyChangeField('companyAddress', 'street');
        const originalStreet = await streetField.inputValue();
        const updatedStreet = originalStreet === 'Kopernika' ? 'Friedrichstrasse' : 'Kopernika';
        await streetField.fill(updatedStreet);
        await agreementPage.button('Dalej').click();
        await expect(streetField).toHaveValue(updatedStreet);
        await agreementPage.link('ZatwierdLs zmiany').click();
        await expect(agreementPage.heading('Potwierdzenie zmiany danych')).toBeVisible();
        await expect(agreementPage.text('Czy na pewno chcesz wprowadzi')).toBeVisible();
        await agreementPage.link('Tak').click();
        await expect(agreementPage.companyDataSavedMessage).toBeVisible();
        await agreementPage.link('PowrAlt').click();
        await agreementPage.openAcceptedAgreements();
        await expect(agreementPage.searchBox).toBeEnabled();
        await agreementPage.searchBox.fill('Global E');
        await expect(agreementPage.companyCell).toBeVisible();
        await agreementPage.companyCell.click();
        await financialInstitutionDashboardPage.waitForLocatorOrClick(
            agreementPage.contractDateText,
            10,
            agreementPage.firstTableCell,
        );
        await agreementPage.companyTab.click();
        await expect(agreementPage.companyDataPanel).toContainText(updatedStreet);
        await agreementPage.companyDataChangeLink.click();
        const streetFieldForCleanup = agreementPage.companyChangeField('companyAddress', 'street');
        await streetFieldForCleanup.fill(originalStreet);
        await agreementPage.button('Dalej').click();
        await expect(streetFieldForCleanup).toHaveValue(originalStreet);
        await agreementPage.link('ZatwierdLs zmiany').click();
        await expect(agreementPage.heading('Potwierdzenie zmiany danych')).toBeVisible();
        await agreementPage.link('Tak').click();
        await expect(agreementPage.companyDataSavedMessage).toBeVisible();
        await agreementPage.link('PowrAlt').click();
        await agreementPage.openAcceptedAgreements();
        await agreementPage.waitForAcceptedAgreementsTable();
        await agreementPage.searchBox.fill('Global E');
        await expect(agreementPage.companyCell).toBeVisible();
        await agreementPage.companyCell.click();
        await financialInstitutionDashboardPage.waitForLocatorOrClick(
            agreementPage.contractDateText,
            10,
            agreementPage.firstTableCell,
        );
        await agreementPage.companyTab.click();
        await expect(agreementPage.companyDataPanel).toContainText(originalStreet);


    });

    test('TC003-VAL - Company address required and invalid values', async ({
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
            agreementPage.firstTableCell,
        );
        await agreementPage.companyTab.click();
        await agreementPage.companyDataChangeLink.click();

        const streetField = agreementPage.companyChangeField('companyAddress', 'street');
        const zipCodeField = agreementPage.companyChangeField('companyAddress', 'zipCode');
        const countryField = agreementPage.companyChangeField('companyAddress', 'country');
        const originalStreet = await streetField.inputValue();
        const originalZipCode = await zipCodeField.inputValue();
        const originalCountry = await countryField.inputValue();

        await streetField.fill('');
        await countryField.selectOption('PL');
        await zipCodeField.fill('ABCDE');
        await agreementPage.button('Dalej').click();
        await expect(agreementPage.companyChangeValidation('Niepoprawna wartość')).toBeVisible();

        await streetField.fill(originalStreet);
        await countryField.selectOption(originalCountry);
        await zipCodeField.fill(originalZipCode);
        await agreementPage.button('Dalej').click();
        await expect(streetField).toHaveValue(originalStreet);
        await expect(zipCodeField).toHaveValue(originalZipCode);
        await agreementPage.link('PowrAlt').click();
    });

    test('TC004-VAL - Correspondence address boundary and invalid postal code', async ({
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
            agreementPage.firstTableCell,
        );
        await agreementPage.companyTab.click();
        await agreementPage.companyDataChangeLink.click();
        await agreementPage.differentCorrespondenceAddressOption.click();
        const correspondenceZipCode = agreementPage.companyChangeField('correspondenceAddress', 'zipCode');
        const originalZipCode = await correspondenceZipCode.inputValue();
        const correspondenceCountry = agreementPage.companyChangeField('correspondenceAddress', 'country');
        const originalCountry = await correspondenceCountry.inputValue();

        await correspondenceCountry.selectOption('PL');
        await correspondenceZipCode.fill('00-000');
        await expect(correspondenceZipCode).toHaveValue('00-000');

        await correspondenceZipCode.fill('ABCDE');
        await agreementPage.button('Dalej').click();
        await expect(agreementPage.companyChangeValidation('Niepoprawna wartość')).toBeVisible();

        await correspondenceCountry.selectOption(originalCountry);
        await correspondenceZipCode.fill(originalZipCode);
        await agreementPage.button('Dalej').click();
        await expect(correspondenceCountry).toHaveValue(originalCountry);
        await expect(correspondenceZipCode).toHaveValue(originalZipCode);
        await agreementPage.link('PowrAlt').click();
    });

    test('TC005-VAL - Company identifiers invalid values', async ({
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
            agreementPage.firstTableCell,
        );
        await agreementPage.companyTab.click();
        await agreementPage.companyDataChangeLink.click();

        const identifiers = [
            { field: 'krs' as const, invalidValue: '123456789' },
            { field: 'regon' as const, invalidValue: '12345678' },
            { field: 'nip' as const, invalidValue: '123456789' },
        ];

        const originalValues = new Map(
            await Promise.all(
                identifiers.map(async ({ field }) => [
                    field,
                    await agreementPage.companyIdentifierField(field).inputValue(),
                ] as const),
            ),
        );

        for (const { field, invalidValue } of identifiers) {
            const identifierField = agreementPage.companyIdentifierField(field);
            await identifierField.fill(invalidValue);
            await agreementPage.button('Dalej').click();
            await expect(agreementPage.companyChangeValidation()).toBeVisible();
            await identifierField.fill(originalValues.get(field)!);
        }

        await agreementPage.button('Dalej').click();
        await expect(agreementPage.companyIdentifierField('krs')).toHaveValue(originalValues.get('krs')!);
        await expect(agreementPage.companyIdentifierField('regon')).toHaveValue(originalValues.get('regon')!);
        await expect(agreementPage.companyIdentifierField('nip')).toHaveValue(originalValues.get('nip')!);
        await agreementPage.link('PowrAlt').click();
    });

    test('TC006-DOC - Documents tab shows and uploads contract files', async ({
        loginAsFinancialInstitution,
        financialInstitutionDashboardPage,
        financialInstitutionAgreementPage: agreementPage,
        page,
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
            agreementPage.firstTableCell,
        );

        await agreementPage.documentsTab.click();
        await expect(agreementPage.agreementLink('Umowa o zarządzanie PPK')).toBeVisible();
        await expect(agreementPage.agreementLink('Umowa o prowadzenie PPK')).toBeVisible();

        const existingTestPdfCount = await agreementPage.uploadedDocumentFileName.count();
        await agreementPage.uploadDocument('./data/testowyPDF.pdf');
        await expect(agreementPage.uploadedDocumentFileName).toHaveCount(existingTestPdfCount + 1);
    });

    test('TC007-EVENTS - Agreement events show expected titles and dates', async ({
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
            agreementPage.firstTableCell,
        );

        await agreementPage.eventsTab.click();

        const today = new Date().toISOString().slice(0, 10);
        const datedEvents = [
            'Umowa zarejestrowana w systemie przez: Emi_op_full (panel IF)',
            'Zmiana danych pracodawcy wykonana w systemie przez: Emi_op_full',
            'Dokument testowyPDF.pdf zaktualizowany w systemie przez: Emi_op_full',
        ];

        for (const title of datedEvents) {
            await expect(agreementPage.eventItem(title)).toBeVisible();
            await expect(agreementPage.eventDate(title)).toContainText(today);
        }

        await expect(
            agreementPage.eventItem('Nadanie dostępu osobom obsługującym PPK'),
        ).toBeVisible();
    });

    const agreementStatusTabs = [
        { id: 'TC008', name: 'Oczekujące', sortColumn: 'Data rejestracji', needsInvestigation: false },
        { id: 'TC009', name: 'Zaakceptowane', sortColumn: 'Data rejestracji', needsInvestigation: false },
        { id: 'TC010', name: 'Anulowane', sortColumn: 'Nazwa Pracodawcy', needsInvestigation: true },
        { id: 'TC011', name: 'Rozwiązane', sortColumn: 'Nazwa Pracodawcy', needsInvestigation: true },
    ] as const;
    const employerNameSortingIssue =
        'Błąd aplikacji do wyjaśnienia: na zakładkach Anulowane i Rozwiązane po kliknięciu ' +
        'kolumny „Nazwa Pracodawcy” wartości nie układają się ani rosnąco, ani malejąco. ' +
        'Sortowanie kolumny „Data rejestracji” działa poprawnie na zakładkach Oczekujące i Zaakceptowane.';

    for (const { id, name: statusTab, sortColumn, needsInvestigation } of agreementStatusTabs) {
        test(`${id}-LIST - ${sortColumn.toLowerCase()} sorting works on ${statusTab.toLowerCase()} agreements`, async ({
            loginAsFinancialInstitution,
            financialInstitutionAgreementPage: agreementPage,
        }) => {
            test.fixme(needsInvestigation, employerNameSortingIssue);
            await loginAsFinancialInstitution();
            await agreementPage.openAcceptedAgreements();
            await agreementPage.openAgreementStatusTab(statusTab);

            const columnIndex = await agreementPage.columnIndex(sortColumn);
            const nonEmptyValues = (await agreementPage.columnValues(columnIndex)).filter(Boolean);
            expect(new Set(nonEmptyValues).size).toBeGreaterThan(1);

            const sortButton = agreementPage.sortButton(sortColumn);
            await sortButton.click();
            await expect.poll(() => agreementPage.columnSortDirection(columnIndex)).not.toBeNull();
        });
    }

    test('TC012-LIST - accepted agreements pagination and page size update visible records', async ({
        loginAsFinancialInstitution,
        financialInstitutionAgreementPage: agreementPage,
        page,
    }) => {
        await loginAsFinancialInstitution();
        await agreementPage.openAcceptedAgreements();
        await agreementPage.waitForAcceptedAgreementsTable();
        await expect(agreementPage.paginationStatus).toContainText(/^Pozycje od 1 do 10 z \d+ łącznie$/);
        await expect(agreementPage.contractRows).toHaveCount(10);

        await agreementPage.paginationPage(2).click();
        await expect(agreementPage.paginationStatus).toContainText(/^Pozycje od 11 do 20 z \d+ łącznie$/);
        await expect(agreementPage.contractRows).toHaveCount(10);

        await agreementPage.previousPageLink.click();
        await expect(agreementPage.paginationStatus).toContainText(/^Pozycje od 1 do 10 z \d+ łącznie$/);

        await agreementPage.nextPageLink.click();
        await expect(agreementPage.paginationStatus).toContainText(/^Pozycje od 11 do 20 z \d+ łącznie$/);

        await agreementPage.previousPageLink.click();
        await expect(agreementPage.paginationStatus).toContainText(/^Pozycje od 1 do 10 z \d+ łącznie$/);

        await agreementPage.pageSizeSelect.selectOption('25');
        await expect(agreementPage.paginationStatus).toContainText(/^Pozycje od 1 do 25 z \d+ łącznie$/);
        await expect(agreementPage.contractRows).toHaveCount(25);
    });

    test('TC013-LIST - cancels the first awaiting agreement', async ({
        loginAsFinancialInstitution,
        financialInstitutionAgreementPage: agreementPage,
    page,
    }) => {
        await loginAsFinancialInstitution();
        await agreementPage.openAwaitingAgreements();
        await agreementPage.waitForAcceptedAgreementsTable();

        let employerName: string;
        let krs: string | undefined;
        let regon: string | undefined;
        let nip: string | undefined;
        let registrationDate: string | undefined;
        let firstExactRegistrationDate: string | undefined;
        let secondExactRegistrationDate: string | undefined;
        let hasMatchingDuplicate: boolean;
        let agreementId: string;

        await test.step('Capture the first awaiting agreement', async () => {
            await expect(agreementPage.firstPendingAgreement).toBeVisible();
            employerName = (await agreementPage.firstPendingAgreementEmployerName.innerText()).trim();
            krs = (await agreementPage.firstPendingAgreementKrs.innerText()).trim() || undefined;
            regon = (await agreementPage.firstPendingAgreementRegon.innerText()).trim() || undefined;
            nip = (await agreementPage.firstPendingAgreementNip.innerText()).trim() || undefined;
            registrationDate = (await agreementPage.firstPendingAgreementRegistrationDate.innerText()).trim() || undefined;

            expect(employerName).not.toBe('');
            const matchingAgreements = agreementPage.contractRowsMatching({
                employerName,
                krs,
                regon,
                nip,
                registrationDate,
            });

            hasMatchingDuplicate = await matchingAgreements.nth(1).isVisible();

            await agreementPage.openAgreementDetails(agreementPage.firstPendingAgreement);
            agreementId = await agreementPage.agreementId(agreementPage.firstPendingAgreement);
            await agreementPage.closeAgreementDetails(agreementPage.firstPendingAgreement);
await page.pause();
            if (hasMatchingDuplicate) {
                await agreementPage.openAgreementDetails(agreementPage.firstPendingAgreement);
                firstExactRegistrationDate = (await agreementPage.detailedRegistrationDate(agreementPage.firstPendingAgreement).innerText()).trim();
                expect(firstExactRegistrationDate).not.toBe('');
                await agreementPage.closeAgreementDetails(agreementPage.firstPendingAgreement);

                await agreementPage.openAgreementDetails(matchingAgreements.nth(1));
                secondExactRegistrationDate = (await agreementPage.detailedRegistrationDate(matchingAgreements.nth(1)).innerText()).trim();
                expect(secondExactRegistrationDate).not.toBe(firstExactRegistrationDate);
                await agreementPage.closeAgreementDetails(matchingAgreements.nth(1));
            }
        });

        await test.step('Open the cancellation confirmation popup', async () => {
            await agreementPage.firstPendingAgreementActionsButton.click();
            await agreementPage.firstPendingAgreementCancelLink.click();
            await expect(agreementPage.cancelAgreementDialog).toBeVisible();
        });

        await test.step('Verify the selected employer before confirming cancellation', async () => {
            await expect(agreementPage.heading('Anulowanie umowy o zarzą')).toBeVisible();
            await expect(agreementPage.cancelAgreementDialog).toContainText(employerName!);
            await agreementPage.confirmAgreementCancellationLink.click();
            await expect(agreementPage.agreementCancellationSuccessMessage(employerName!)).toBeVisible();
        });

        await test.step('Verify the cancelled agreement leaves the awaiting list', async () => {
            const matchingAgreements = agreementPage.contractRowsMatching({
                employerName: employerName!,
                krs,
                regon,
                nip,
                registrationDate,
            });

            if (hasMatchingDuplicate) {
                await agreementPage.openAgreementDetails(matchingAgreements.first());
                const firstRemainingExactRegistrationDate = (await agreementPage.detailedRegistrationDate(matchingAgreements.first()).innerText()).trim();
                expect(firstRemainingExactRegistrationDate).toBe(secondExactRegistrationDate);
                expect(firstRemainingExactRegistrationDate).not.toBe(firstExactRegistrationDate);
            } else {
                await expect(matchingAgreements).toHaveCount(0);
            }
        });

        await test.step('Verify the cancelled agreement appears on the cancelled tab', async () => {
            await agreementPage.openAgreementStatusTab('Anulowane');
            await agreementPage.searchAgreements(employerName!);
            await agreementPage.setAgreementPageSize('100');

            const cancelledAgreements = agreementPage.contractRowsMatching({
                employerName: employerName!,
                krs,
                regon,
                nip,
                registrationDate,
            });

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

            expect(cancelledAgreementIds).toContain(agreementId);
        });
    });




});
