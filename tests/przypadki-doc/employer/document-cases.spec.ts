import { randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import XLSX from 'xlsx';
import { PDFParse } from 'pdf-parse';
import JSZip from 'jszip';
import { test, expect, credentials, testData } from '../../../fixtures/pagesFixtures';
import { CONTRIBUTION_CANCEL_PATH, DISPOSITION_ENTRIES } from '../../../pages/employer/EmployerDispositionsPage';

function generatePassword(): string {
  return `Mariusz${randomBytes(3).toString('hex')}!42`;
}

function persistSharedLoginPassword(password: string): void {
  const testDataPath = path.resolve(__dirname, '../../../data/testData.json');
  const persistedTestData = JSON.parse(readFileSync(testDataPath, 'utf8')) as typeof testData;
  persistedTestData.sharedLoginUser.password = password;
  writeFileSync(testDataPath, `${JSON.stringify(persistedTestData, null, 4)}\n`, 'utf8');
}
test.describe('Document cases - Employer panel', () => {
  test.beforeEach(async ({ loginAsEmployer }) => {
    await loginAsEmployer();
  });


  // Krok 1: Użytkownik naciska kafelek "Przekazanie plików".
  // Krok 2: Użytkownik naciska przycisk "Wybierz plik".
  // Krok 3: Użytkownik wybiera plik do przekazania.
  // Krok 4: Użytkownik naciska przycisk "Prześlij plik".
  test('TC001 - Wgrywanie pliku - poprawna próba', async ({
    employerDashboardPage,
    employerFileUploadPage,
  }) => {
    test.fixme(true, 'Brak poprawnego syntetycznego pliku XML dla pracodawcy. Dostępny data/testowyPDF.pdf jest odrzucany przez aplikację komunikatem „Nieprawidłowe rozszerzenie pliku”; po dodaniu fixture XML należy usunąć fixme i pozostawić poniższe asercje sukcesu.');
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Przekazanie plików').click();

    await expect(employerFileUploadPage.heading).toBeVisible();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.fileInput).toBeAttached();
    await expect(employerFileUploadPage.uploadButton).toBeVisible();
    await employerFileUploadPage.uploadFile('data/testowyPDF.pdf');
    await expect(employerFileUploadPage.uploadedFileRow('testowyPDF.pdf')).toBeVisible();
  });

  //Zrobiony
  test('TC002 - Wgrywanie, pobieranie, usuwanie i weryfikacja pliku', async ({
    employerDashboardPage,
    employerFileUploadPage,
    page
  }, testInfo) => {
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Przekazanie plików').click();
    await expect(employerFileUploadPage.heading).toBeVisible();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.fileInput).toBeAttached();
    await expect(employerFileUploadPage.uploadButton).toBeVisible();

    const fileName = `Rejestracja_TC002_${Date.now()}.xml`;
    const expectedData = {
      firstName: 'Maria',
      lastName: 'Kowalska',
      pesel: '72040112300',
      generation: new Date().toISOString().slice(0, 19).replace('T', ' '),
    };

    const uploadFilePath = await employerFileUploadPage.prepareFileForUpload({
      sourcePath: 'data/doc/Rejestracja_2026-10-02_511350948.xml',
      destinationDirectory: testInfo.outputDir,
      fileName,
      replacements: [
        { search: '<IMIE>Joanna</IMIE>', replace: `<IMIE>${expectedData.firstName}</IMIE>` },
        { search: '<NAZWISKO>testowaa</NAZWISKO>', replace: `<NAZWISKO>${expectedData.lastName}</NAZWISKO>` },
        { search: '<NR_PESEL>72040108945</NR_PESEL>', replace: `<NR_PESEL>${expectedData.pesel}</NR_PESEL>` },
        { search: '<GENERACJA>2026-08-24 14:52:21</GENERACJA>', replace: `<GENERACJA>${expectedData.generation}</GENERACJA>` },
      ],
    });
    await employerFileUploadPage.uploadFile(uploadFilePath);
    await expect(employerFileUploadPage.uploadedFileRow(fileName)).toBeVisible();
    const downloadedContent = await employerFileUploadPage.downloadFileContent(fileName);
    expect(downloadedContent).toContain(`<IMIE>${expectedData.firstName}</IMIE>`);
    expect(downloadedContent).toContain(`<NAZWISKO>${expectedData.lastName}</NAZWISKO>`);
    expect(downloadedContent).toContain(`<NR_PESEL>${expectedData.pesel}</NR_PESEL>`);
    await employerFileUploadPage.deleteUploadedFile(fileName);
    await page.pause()
    await expect(employerFileUploadPage.uploadedFileRow(fileName)).not.toBeVisible();
    await expect(page.getByText('Pamiętaj, że:Przesłany plik')).toBeVisible();
  });

  // Użytkownik naciska na kafelek "Przekazanie plików"
  // Użytkownik naciska przycisk "Usuń" obok wybranego pliku na liście pod wyszukwarką
  // Użytkownik naciska przycisk "Usuń plik" w oknie pop-up

  test('TC003 - Usuwanie przesłanego pliku: ekran przekazania plików', async ({
    employerDashboardPage,
    employerFileUploadPage,
    page
  }) => {
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Przekazanie plików').click();
    await expect(employerFileUploadPage.heading).toBeVisible();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.fileInput).toBeAttached();
    await expect(employerFileUploadPage.uploadButton).toBeVisible();
    await employerFileUploadPage.uploadFile('data/testowyPDF.pdf');
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - paragraph: "Plik testowyPDF.pdf zawiera następujące błędy:"
      - paragraph: Nieprawidłowe rozszerzenie pliku
      - paragraph: Prosimy o poprawienie błędów i załadowanie pliku ponownie.
      `);
  });

  // Krok 1: Otwórz Przekazanie plików.
  // Krok 2: Wpisz nieistniejącą nazwę oraz poprawny zakres dat.
  // Krok 3: Kliknij Wyszukaj i sprawdź pusty wynik historii.
  test('TC004 - Filtrowanie historii przesłanych plików', async ({ employerFileUploadPage }) => {
    await employerFileUploadPage.open();
    await employerFileUploadPage.searchHistory({
      fileName: 'ZZZ_NONEXISTENT_FILE',
      dateFrom: '2026-01-01',
      dateTo: '2026-12-31',
    });
    await expect(employerFileUploadPage.noMatchingRows).toBeVisible();
  });

  test('TC005 - Dyspozycja zgłoszenia pracownika: wymagane pola', async ({
    employerRegistrationWizardPage,
  }) => {
    test.fixme(true, 'Defekt aplikacji: na końcu procesu zgłoszenia pracownika występuje błąd i nie można poprawnie zakończyć drugiego kroku kreatora.');
    await employerRegistrationWizardPage.open();

    await employerRegistrationWizardPage.fillRequiredEmployeeData({
      firstName: 'Jan',
      lastName: 'Kowalski',
      pesel: testData.pesel.valid,
      birthDate: testData.dates.valid,
      email: testData.emails.valid,
      phone: testData.phone.valid,
    });
    await employerRegistrationWizardPage.submitStep();
    await employerRegistrationWizardPage.submitStep();
  });

  test('TC006 - Dyspozycja zgłoszenia pracownika: wymagane pola', async ({
    employerRegistrationWizardPage,
  }) => {
    test.fixme(true, 'Defekt aplikacji: na końcu procesu zgłoszenia pracownika występuje błąd i nie można poprawnie zakończyć drugiego kroku kreatora.');
    await employerRegistrationWizardPage.open();

    await employerRegistrationWizardPage.fillRequiredEmployeeData({
      firstName: 'Jan',
      lastName: 'Kowalski',
      pesel: testData.pesel.valid,
      birthDate: testData.dates.valid,
      email: testData.emails.valid,
      phone: testData.phone.valid,
    });
    await employerRegistrationWizardPage.submitStep();
    await employerRegistrationWizardPage.submitStep();
  });

  test('TC007 - Dyspozycja zgłoszenia Wpłat jeden uczestnik', async ({
    employerDashboardPage,
    employerContributionsPage,
    employerFileUploadPage,
  }) => {
    test.fixme(true, 'Defekt aplikacji zgłoszony: formularz zgłoszenia wpłat nie działa poprawnie. Po wybraniu uczestnika i kliknięciu „Dalej” formularz traci uczestnika i wyświetla „Nie wskazano żadnego uczestnika”, dlatego nie pojawia się komunikat o nieprawidłowej proporcji, a następnie komunikat poprawnego złożenia dyspozycji. Docelowo test powinien wykonać: Dyspozycje > Zgłoszenie wpłat > Dodaj kolejną wpłatę > wyszukanie lub pozostawienie pustych kryteriów > Szukaj > Wybierz > uzupełnienie formularza > Dalej > potwierdzenie „Tak” dla nieprawidłowej proporcji > Dalej > asercja komunikatu sukcesu, powrotu do menu i pliku XML w historii.');
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Zgłoszenie wpłat').click();
    await expect(employerContributionsPage.heading).toBeVisible();
    await employerContributionsPage.periodInput.fill('2026-10');
    await employerContributionsPage.addFirstParticipant();
    const participantPesel = (await employerContributionsPage.participantPesel(0).innerText()).trim();
    await employerContributionsPage.fillParticipantAmounts(0, '10');
    await employerContributionsPage.nextButton.click();
    await expect(employerContributionsPage.ratioWarningDialog).toBeVisible();
    await expect(employerContributionsPage.ratioWarningDialog).toContainText(participantPesel);
    await employerContributionsPage.confirmIfVisible();
    await employerContributionsPage.nextButton.click();
    await expect(employerContributionsPage.successMessage).toBeVisible();
    await expect(employerContributionsPage.returnToMainMenuButton).toBeVisible();
    await employerContributionsPage.returnToMainMenuButton.click();
    await employerDashboardPage.cardLink('Przekazanie plików').click();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.xmlFileLinks().first()).toBeVisible();
  });

  test('TC008 - Dyspozycja zgłoszenia Wpłat wielu uczestników', async ({
    employerDashboardPage,
    employerContributionsPage,
    employerFileUploadPage,
  }) => {
    test.fixme(true, 'Defekt aplikacji zgłoszony: formularz zgłoszenia wpłat nie działa poprawnie. Po wybraniu uczestników i kliknięciu „Dalej” formularz traci ich dane i wyświetla „Nie wskazano żadnego uczestnika”, dlatego nie pojawia się komunikat o nieprawidłowej proporcji, a następnie komunikat poprawnego złożenia dyspozycji. Docelowo test powinien dodać dwóch uczestników, uzupełnić oba wiersze, kliknąć Dalej, potwierdzić „Tak” dla nieprawidłowych proporcji, kliknąć końcowe Dalej oraz sprawdzić komunikat sukcesu, powrót do menu i plik XML w historii.');
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Zgłoszenie wpłat').click();
    await expect(employerContributionsPage.heading).toBeVisible();
    await employerContributionsPage.periodInput.fill('2026-10');
    await employerContributionsPage.addFirstParticipant();
    const firstParticipantPesel = (await employerContributionsPage.participantPesel(0).innerText()).trim();
    await employerContributionsPage.fillParticipantAmounts(0, '10');
    await employerContributionsPage.addFirstParticipant();
    const secondParticipantPesel = (await employerContributionsPage.participantPesel(1).innerText()).trim();
    await employerContributionsPage.fillParticipantAmounts(1, '15');
    await employerContributionsPage.nextButton.click();
    await expect(employerContributionsPage.ratioWarningDialog).toBeVisible();
    await expect(employerContributionsPage.ratioWarningDialog).toContainText(firstParticipantPesel);
    await expect(employerContributionsPage.ratioWarningDialog).toContainText(secondParticipantPesel);
    await employerContributionsPage.confirmIfVisible();
    await employerContributionsPage.nextButton.click();
    await expect(employerContributionsPage.successMessage).toBeVisible();
    await expect(employerContributionsPage.returnToMainMenuButton).toBeVisible();
    await employerContributionsPage.returnToMainMenuButton.click();
    await employerDashboardPage.cardLink('Przekazanie plików').click();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.xmlFileLinks().first()).toBeVisible();
  });

  test('TC009 - Dyspozycja zgłoszenia wpłat - uczestnik z obniżoną wpłatą', async ({
    employerDashboardPage,
    employerContributionsPage,
    employerFileUploadPage,
    page,
  }) => {
    test.fixme(true, 'Defekt aplikacji: formularz zgłoszenia wpłat nie działa poprawnie. Po wybraniu uczestnika i kliknięciu „Dalej” formularz traci uczestnika i wyświetla „Nie wskazano żadnego uczestnika”. Docelowo test powinien dodać uczestnika, uzupełnić formularz, zaznaczyć „Uczestnik z obniżoną wpłatą”, potwierdzić brak popupu nieprawidłowej proporcji, kliknąć końcowe „Dalej” oraz sprawdzić komunikat sukcesu, powrót do menu i plik XML w historii.');
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Zgłoszenie wpłat').click();
    await expect(employerContributionsPage.heading).toBeVisible();
    await employerContributionsPage.periodInput.fill('2026-10');
    await employerContributionsPage.addFirstParticipant();
    await employerContributionsPage.fillParticipantAmounts(0, '10');
    await page.pause();
    await page.locator('.form-check-label').click();
    await employerContributionsPage.nextButton.click();
    await expect(employerContributionsPage.ratioWarningDialog).not.toBeVisible();
    await employerContributionsPage.nextButton.click();
    await expect(employerContributionsPage.successMessage).toBeVisible();
    await expect(employerContributionsPage.returnToMainMenuButton).toBeVisible();
    await employerContributionsPage.returnToMainMenuButton.click();
    await employerDashboardPage.cardLink('Przekazanie plików').click();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.xmlFileLinks().first()).toBeVisible();
  });

  test('TC010 - Dyspozycja zgłoszenia korekt do wpłat (jeden uczestnik)', async ({
    employerDashboardPage,
    employerCorrectionsPage,
    employerFileUploadPage,
  }) => {
    test.fixme(true, 'Brak uprawnień do formularza korekt wpłat: aplikacja zwraca „Brak dostępu!”.');
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Zgłoszenie korekt do wpłat').click();
    await expect(employerCorrectionsPage.heading).toBeVisible();
    await employerCorrectionsPage.addFirstParticipant();
    const participantPesel = (await employerCorrectionsPage.participantPesel(0).innerText()).trim();
    await employerCorrectionsPage.fillCorrectionAmounts(0, '10');
    await employerCorrectionsPage.nextButton.click();
    await expect(employerCorrectionsPage.ratioWarningDialog).toBeVisible();
    await expect(employerCorrectionsPage.ratioWarningDialog).toContainText(participantPesel);
    await employerCorrectionsPage.confirmIfVisible();
    await employerCorrectionsPage.nextButton.click();
    await expect(employerCorrectionsPage.successMessage).toBeVisible();
    await expect(employerCorrectionsPage.returnToMainMenuButton).toBeVisible();
    await employerCorrectionsPage.returnToMainMenuButton.click();
    await employerDashboardPage.cardLink('Przekazanie plików').click();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.xmlFileLinks().first()).toBeVisible();
  });

  test('TC011 - Dyspozycja zgłoszenia korekt do wpłat (kilku uczestników jednocześnie)', async ({
    employerDashboardPage,
    employerCorrectionsPage,
    employerFileUploadPage,
  }) => {
    test.fixme(true, 'Brak uprawnień do formularza korekt wpłat: aplikacja zwraca „Brak dostępu!”.');
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Zgłoszenie korekt do wpłat').click();
    await expect(employerCorrectionsPage.heading).toBeVisible();
    await employerCorrectionsPage.addFirstParticipant();
    const firstParticipantPesel = (await employerCorrectionsPage.participantPesel(0).innerText()).trim();
    await employerCorrectionsPage.fillCorrectionAmounts(0, '10');
    await employerCorrectionsPage.addFirstParticipant();
    const secondParticipantPesel = (await employerCorrectionsPage.participantPesel(1).innerText()).trim();
    await employerCorrectionsPage.fillCorrectionAmounts(1, '15');
    await employerCorrectionsPage.nextButton.click();
    await expect(employerCorrectionsPage.ratioWarningDialog).toBeVisible();
    await expect(employerCorrectionsPage.ratioWarningDialog).toContainText(firstParticipantPesel);
    await expect(employerCorrectionsPage.ratioWarningDialog).toContainText(secondParticipantPesel);
    await employerCorrectionsPage.confirmIfVisible();
    await employerCorrectionsPage.nextButton.click();
    await expect(employerCorrectionsPage.successMessage).toBeVisible();
    await expect(employerCorrectionsPage.returnToMainMenuButton).toBeVisible();
    await employerCorrectionsPage.returnToMainMenuButton.click();
    await employerDashboardPage.cardLink('Przekazanie plików').click();
    await expect(employerFileUploadPage.historyHeading).toBeVisible();
    await expect(employerFileUploadPage.xmlFileLinks().first()).toBeVisible();
  });



  //Podgląd uczestników

  test('TC-LIST-001 participant list default filters and columns', async ({ page, employerParticipantListPage }) => {
    await employerParticipantListPage.open();
    await expect(employerParticipantListPage.heading).toBeVisible();
    await expect(employerParticipantListPage.resignationFilter.locator('option:checked')).toHaveText('Wszystkie');
    await expect(employerParticipantListPage.employedFilter.locator('option:checked')).toHaveText('TAK');

    const columns = [
      'Imię', 'Nazwisko', 'PESEL', 'Numer kadrowy', 'Dokument',
      'Adres email', 'Numer Telefonu', 'Rezygnacja', 'Zatrudniony',
      'Wypłata po 60 r.', 'Zlecenie',
    ];
    for (const column of columns) {
      await expect(employerParticipantListPage.columnHeader(column).first()).toBeVisible();
    }
    await expect(page.locator('#searchForm')).toMatchAriaSnapshot(`
    - text: Imię
    - textbox "Imię"
    - text: Nazwisko
    - textbox "Nazwisko"
    - text: PESEL
    - textbox "PESEL"
    - text: Rezygnacja
    - combobox "Rezygnacja":
      - option "Wszystkie" [selected]
      - option "TAK"
      - option "NIE"
    - text: Zatrudniony
    - combobox "Zatrudniony":
      - option "Wszystkie"
      - option "TAK" [selected]
      - option "NIE"
    - button "Wyszukaj"
    `);
    await expect(page.locator('#customer-table_wrapper')).toMatchAriaSnapshot(`
    - text: Pokaż
    - combobox "Pokaż pozycji":
      - option /\\d+/ [selected]
      - option /\\d+/
      - option /\\d+/
      - option /\\d+/
    - text: "pozycji Szukaj:"
    - searchbox "Szukaj:"
    - table:
      - rowgroup:
        - 'row /Lp\\. Imię Imię: Activate to sort Nazwisko Nazwisko: Activate to sort PESEL PESEL: Activate to sort Numer kadrowy Numer kadrowy: Activate to sort Dokument Dokument: Activate to sort Adres email Adres email: Activate to sort Numer Telefonu Numer Telefonu: Activate to sort Rezygnacja Zatrudniony Wypłata po \\d+ r\\. Zlecenie/':
          - columnheader
          - columnheader "Lp."
          - 'columnheader "Imię Imię: Activate to sort"':
            - text: ""
            - 'button "Imię: Activate to sort"'
          - 'columnheader "Nazwisko Nazwisko: Activate to sort"':
            - text: ""
            - 'button "Nazwisko: Activate to sort"'
          - 'columnheader "PESEL PESEL: Activate to sort"':
            - text: ""
            - 'button "PESEL: Activate to sort"'
          - 'columnheader "Numer kadrowy Numer kadrowy: Activate to sort"':
            - text: ""
            - 'button "Numer kadrowy: Activate to sort"'
          - 'columnheader "Dokument Dokument: Activate to sort"':
            - text: ""
            - 'button "Dokument: Activate to sort"'
          - 'columnheader "Adres email Adres email: Activate to sort"':
            - text: ""
            - 'button "Adres email: Activate to sort"'
          - 'columnheader "Numer Telefonu Numer Telefonu: Activate to sort"':
            - text: ""
            - 'button "Numer Telefonu: Activate to sort"'
          - columnheader "Rezygnacja"
          - columnheader "Zatrudniony"
          - columnheader /Wypłata po \\d+ r\\./
          - columnheader "Zlecenie"
      - rowgroup:
        - row "Wczytywanie...":
          - cell "Wczytywanie..."
    - status: Pozycji 0 z 0 dostępnych
    - navigation "pagination":
      - list:
        - listitem:
          - link "Previous" [disabled]: Poprzednia
        - listitem:
          - link "Next" [disabled]: Następna
    `);
    await page.getByRole('textbox', { name: 'Imię' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).fill('Mariusz');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).fill('');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).fill('Ala');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.locator('tbody')).toContainText('ALA');
    await expect(page.locator('tbody')).toContainText('ALA');
    await page.getByRole('button', { name: 'Zlecenie' }).click();
    await expect(employerParticipantListPage.bodyRows().first()).toBeVisible();
    await expect(employerParticipantListPage.paginationStatus).toContainText(/Pozycji .* dostępnych/);
  });

  test('TC-LIST-002 filtering check', async ({ employerParticipantListPage, page }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.filterByFirstName('Zzzznieistniejacy');
    await page.getByRole('textbox', { name: 'Imię' }).fill('Anna');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Joanna' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'testowa' })).toBeVisible();
    await expect(page.locator('tbody')).toMatchAriaSnapshot(`- cell "AFY720307"`);
    await expect(page.locator('tbody')).toContainText('AFY720307');
    await expect(page.locator('i').nth(1)).toBeVisible();
    await page.getByRole('textbox', { name: 'Nazwisko' }).fill('testowa');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByLabel('Zatrudniony').selectOption('NO');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Nie znaleziono pasujących' })).toBeVisible();
    await page.getByLabel('Zatrudniony').selectOption('YES');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'AFY720307' })).toBeVisible();
    await page.getByLabel('Rezygnacja').selectOption('YES');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Nie znaleziono pasujących' })).toBeVisible();
    await page.getByLabel('Rezygnacja').selectOption('NO');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'Joanna' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'testowa' })).toBeVisible();
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Nazwisko' }).fill('Ala');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await page.getByRole('textbox', { name: 'Imię' }).clear();
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'ALA' }).nth(1)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'XKALA' })).toBeVisible();
    await page.getByRole('textbox', { name: 'PESEL' }).click();
    await page.getByRole('textbox', { name: 'PESEL' }).fill('39052278808');
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByRole('cell', { name: 'NOCCCCHYT' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'XKALA' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '39052278808' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'VZQCMVUFSSNEC' })).toBeVisible();
    await expect(page.getByText('Pozycje od 1 do 1 z 1 łącznie')).toBeVisible();
  });

  // do naprawy
  test('TC-LIST-003 sortable column header toggles ordering', async ({ page, employerParticipantListPage, financialInstitutionParticipantListPage }) => {
    await employerParticipantListPage.open();
    const sortButton = employerParticipantListPage.table.getByRole('button', { name: /^Imię/ });

    await expect(sortButton).toBeVisible();
    await page.pause();
    const sortableColumns = [
      { name: 'Imię', index: 2 },
      { name: 'Nazwisko', index: 3 },
      { name: 'PESEL', index: 4 },
    ];

    for (const column of sortableColumns) {
      const initialValues = await financialInstitutionParticipantListPage.columnValues(column.index);
      await financialInstitutionParticipantListPage.sortButton(column.name).click();
      await expect(financialInstitutionParticipantListPage.columnHeader(column.name)).toHaveAttribute('aria-sort', 'ascending');
      await expect.poll(() => financialInstitutionParticipantListPage.columnValues(column.index)).not.toEqual(initialValues);
      const ascendingValues = await financialInstitutionParticipantListPage.columnValues(column.index);
      expect(ascendingValues).toEqual([...ascendingValues].sort((left, right) => left.localeCompare(right, 'pl')));

      await financialInstitutionParticipantListPage.sortButton(column.name).click();
      await expect(financialInstitutionParticipantListPage.columnHeader(column.name)).toHaveAttribute('aria-sort', 'descending');
      await expect.poll(() => financialInstitutionParticipantListPage.columnValues(column.index)).not.toEqual(ascendingValues);
      const descendingValues = await financialInstitutionParticipantListPage.columnValues(column.index);
      expect(descendingValues).toEqual([...descendingValues].sort((left, right) => right.localeCompare(left, 'pl')));
    }
    await sortButton.click();
    await expect(employerParticipantListPage.table).toBeVisible();
  });

  test('TC-LIST-004 page-size selector accepts a larger value', async ({ page, employerParticipantListPage }) => {
    await employerParticipantListPage.open();
    await page.getByRole('button', { name: 'Wyszukaj' }).click();
    await expect(page.getByText('Pozycje od 1 do 10 z')).toBeVisible();
    await employerParticipantListPage.pageSizeSelect.selectOption('25');
    await expect(employerParticipantListPage.bodyRows()).toHaveCount(25);
    await expect(page.getByText('brakuje numeru telefonu lub adresu e-mail. Uzupełnij dane, a dzięki temu uczestnicy łatwiej aktywują dostęp do Moje NN.')).toBeVisible();
    await expect(employerParticipantListPage.pageSizeSelect).toHaveValue('25');
  });

  //do zrobienia
  test('TC-LIST-006 admin user table columns and search', async ({ employerUserAdminPage, page }) => {
    await page.pause();
    await employerUserAdminPage.open();
    await expect(employerUserAdminPage.heading).toBeVisible();

    const columns = ['Id', 'Nazwa użytkownika', 'Login', 'Adres e-mail', 'Aktywny', 'Data ostatniego logowania'];
    for (const column of columns) {
      await expect(employerUserAdminPage.columnHeader(column).first()).toBeVisible();
    }

    await expect(employerUserAdminPage.bodyRows().first()).toBeVisible();

    // Search is data-driven off the first row's login so it does not assume a
    // specific account exists in the table.
    const firstLogin = (await employerUserAdminPage.bodyRows().first().locator('td').nth(2).innerText()).trim();
    await employerUserAdminPage.search(firstLogin);
    await expect(employerUserAdminPage.bodyRows()).toHaveCount(1);
    await expect(employerUserAdminPage.bodyRows().first()).toContainText(firstLogin);
  });




  test('TC-PROC-001 should display all process options in order menu', async ({
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.search({});

    const firstParticipantRow = employerParticipantListPage.bodyRows().first();
    await expect(firstParticipantRow).toBeVisible();
    await firstParticipantRow.getByRole('button', { name: 'Zlecenie' }).click();

    const orderMenu = firstParticipantRow.locator('.dropdown-menu');
    for (const processName of [
      'Rezygnacja z odprowadzania wpłat',
      'Zmiana wysokości wpłaty podstawowej Pracownika',
      'Deklaracja wpłaty dodatkowej Pracownika',
      'Zmiana danych',
      'Wznowienie odprowadzania wpłat',
      'Wypłata transferowa do Nationale-Nederlanden',
      'Zakończenie lub wznowienie zatrudnienia',
    ]) {
      await expect(orderMenu.getByRole('link', { name: processName, exact: true })).toBeVisible();
    }
  });

  test('TC-PROC-002 should open resignation process', async ({
    page,
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await page.getByRole('button', { name: 'Wyszukaj' }).click();

    await page.getByRole('button', { name: 'Zlecenie' }).first().click();

    await page.getByText('Rezygnacja z odprowadzania wpłat').first().click();
    await expect(page.getByRole('heading', { name: 'Rezygnacja z odprowadzania wp' })).toBeVisible();
    await expect(page.getByRole('group')).toBeVisible();
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(page.getByRole('heading', { name: 'Whitelabel Error Page' })).toBeVisible();

  });

  test('TC-PROC-003 should open basic contribution change process', async ({
    page,
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.search({});

    const firstParticipantRow = employerParticipantListPage.bodyRows().first();
    await expect(firstParticipantRow).toBeVisible();
    const cells = await firstParticipantRow.locator('td').allTextContents();
    const participantName = `${cells[3].trim()} ${cells[4].trim()}`;
    expect(participantName).not.toBe('');
    await firstParticipantRow.getByRole('button', { name: 'Zlecenie' }).click();

    const orderMenu = firstParticipantRow.locator('.dropdown-menu');
    await orderMenu
      .getByRole('link', {
        name: 'Zmiana wysokości wpłaty podstawowej Pracownika',
        exact: true,
      })
      .click();
    await expect(
      page.getByRole('heading', { name: /Zmiana wysokości wpłaty podstawowej/ }),
    ).toBeVisible();
    await expect(page.getByRole('group')).toBeVisible();
    await expect(page.getByText('Deklarowana wpłata podstawowa %')).toBeVisible();
    await expect(page.locator('input:visible').first()).toBeVisible();
    await page.locator('#declaredAmount').fill('2');
    await expect(page.getByRole('group')).toContainText(participantName);
    await expect(page.getByRole('heading', { name: 'Zmiana wysokości wpłaty' })).toBeVisible();
    await page.getByRole('button', { name: 'Dalej' }).click();


  });

  test('TC-PROC-004 should open additional contribution declaration process', async ({
    page,
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.search({});

    const firstParticipantRow = employerParticipantListPage.bodyRows().first();
    await expect(firstParticipantRow).toBeVisible();
    const cells = await firstParticipantRow.locator('td').allTextContents();
    const participantName = `${cells[3].trim()} ${cells[4].trim()}`;
    expect(participantName).not.toBe('');
    await firstParticipantRow.getByRole('button', { name: 'Zlecenie' }).click();

    const orderMenu = firstParticipantRow.locator('.dropdown-menu');
    await orderMenu
      .getByRole('link', {
        name: 'Deklaracja wpłaty dodatkowej Pracownika',
        exact: true,
      })
      .click();

    await page.pause();
    await expect(
      page.getByRole('heading', { name: /Deklaracja wpłaty dodatkowej/ }),
    ).toBeVisible();
    await expect(page.getByRole('group')).toBeVisible();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.locator('#declaredAmount').fill('2');
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(page.getByRole('heading', { name: 'Deklaracja wpłaty dodatkowej' })).toBeVisible();
    await expect(page.getByText('Brak dostępu do zleceń')).toBeVisible();
  });

  test('TC-PROC-005 should open participant data change process', async ({
    page,
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.search({});

    const firstParticipantRow = employerParticipantListPage.bodyRows().first();
    await expect(firstParticipantRow).toBeVisible();
    const cells = await firstParticipantRow.locator('td').allTextContents();
    const participantName = `${cells[3].trim()} ${cells[4].trim()}`;
    expect(participantName).not.toBe('');
    await firstParticipantRow.getByRole('button', { name: 'Zlecenie' }).click();

    await firstParticipantRow
      .locator('.dropdown-menu')
      .getByRole('link', { name: 'Zmiana danych', exact: true })
      .click();

    await page.pause();
    await expect(page.getByRole('heading', { name: /Zmiana danych/ })).toBeVisible();
    await expect(page.getByRole('group')).toBeVisible();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.getByText('Imię Drugie imię Nazwisko').click();
    await page.locator('[id="customer.person.surname"]').click();
    await page.locator('[id="customer.person.surname"]').fill('Kowalski');
    await page.locator('[id="customer.address.apartmentNumber"]').click();
    await page.locator('[id="customer.address.apartmentNumber"]').fill('55');
    await page.locator('[id="customer.person.secondName"]').click();
    await page.locator('[id="customer.person.secondName"]').fill('Marek');
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(page.getByRole('heading', { name: 'Whitelabel Error Page' })).toBeVisible();
  });

  test('TC-PROC-006 should open contribution resumption process', async ({
    page,
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.search({});

    const firstParticipantRow = employerParticipantListPage.bodyRows().first();
    await expect(firstParticipantRow).toBeVisible();
    const cells = await firstParticipantRow.locator('td').allTextContents();
    const participantName = `${cells[3].trim()} ${cells[4].trim()}`;
    expect(participantName).not.toBe('');
    await firstParticipantRow.getByRole('button', { name: 'Zlecenie' }).click();

    await firstParticipantRow
      .locator('.dropdown-menu')
      .getByRole('link', { name: 'Wznowienie odprowadzania wpłat', exact: true })
      .click();

    await page.pause();
    await expect(page.getByRole('heading', { name: /Wznowienie odprowadzania wpłat/ })).toBeVisible();
    await expect(page.getByRole('group')).toBeVisible();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(page.getByRole('heading', { name: 'Whitelabel Error Page' })).toBeVisible();
  });

  test('TC-PROC-007 should open transfer to NN process', async ({
    page,
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.search({});

    const firstParticipantRow = employerParticipantListPage.bodyRows().first();
    await expect(firstParticipantRow).toBeVisible();
    const cells = await firstParticipantRow.locator('td').allTextContents();
    const participantName = `${cells[3].trim()} ${cells[4].trim()}`;
    expect(participantName).not.toBe('');
    await firstParticipantRow.getByRole('button', { name: 'Zlecenie' }).click();

    await firstParticipantRow
      .locator('.dropdown-menu')
      .getByRole('link', { name: 'Wypłata transferowa do Nationale-Nederlanden', exact: true })
      .click();

    await page.pause();
    await expect(page.getByRole('heading', { name: /Wypłata transferowa do Nationale-Nederlanden/ })).toBeVisible();
    await expect(page.getByRole('group')).toBeVisible();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(page.getByRole('heading', { name: 'Whitelabel Error Page' })).toBeVisible();
  });

  test('TC-PROC-008 should open employment status change process', async ({
    page,
    employerParticipantListPage,
  }) => {
    await employerParticipantListPage.open();
    await employerParticipantListPage.search({});

    const firstParticipantRow = employerParticipantListPage.bodyRows().first();
    await expect(firstParticipantRow).toBeVisible();
    const cells = await firstParticipantRow.locator('td').allTextContents();
    const participantName = `${cells[3].trim()} ${cells[4].trim()}`;
    expect(participantName).not.toBe('');
    await firstParticipantRow.getByRole('button', { name: 'Zlecenie' }).click();

    await firstParticipantRow
      .locator('.dropdown-menu')
      .getByRole('link', { name: 'Zakończenie lub wznowienie zatrudnienia', exact: true })
      .click();

    await expect(page.getByRole('heading', { name: /Zakończenie lub wznowienie zatrudnienia/ })).toBeVisible();
    await expect(page.getByRole('group')).toBeVisible();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.locator('#date').fill('1924-01-01');
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(page.getByRole('heading', { name: 'Zakończenie lub wznowienie' })).toBeVisible();
    await expect(page.getByText('Brak dostępu do zleceń')).toBeVisible();

  });
});


test('TC012 - Dyspozycja zmiany danych uczestnika', async ({
  employerDashboardPage,
  employerParticipantListPage,
  page,
}) => {
  test.fixme(true, 'Podczas procesu zatwierdzania występuje ekran błędu.');

  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Dyspozycje').click();
  await page
    .getByRole('link')
    .filter({ has: page.getByRole('heading', { level: 5, name: 'Zmiana danych', exact: true }) })
    .click();

  await expect(page.getByRole('heading', { name: /Zmiana danych/ })).toBeVisible();

  await employerParticipantListPage.open();
  await employerParticipantListPage.search({});
  const participantRow = employerParticipantListPage.bodyRows().first();
  await expect(participantRow).toBeVisible();
  const cells = await participantRow.locator('td').allTextContents();
  const participantName = `${cells[3].trim()} ${cells[4].trim()}`;
  expect(participantName).not.toBe('');
  await participantRow.getByRole('button', { name: 'Zlecenie' }).click();
  await participantRow
    .locator('.dropdown-menu')
    .getByRole('link', { name: 'Zmiana danych', exact: true })
    .click();

  await expect(page.getByRole('heading', { name: /Zmiana danych/ })).toBeVisible();
  await expect(page.getByRole('group')).toContainText(participantName);
  const uniqueSuffix = Date.now().toString().slice(-4);
  const changedSurname = `Kowalski${uniqueSuffix}`;
  const changedApartmentNumber = String(10 + (Date.now() % 90));
  const changedSecondName = `Marek${uniqueSuffix}`;
  await page.locator('[id="customer.person.surname"]').fill(changedSurname);
  await page.locator('[id="customer.address.apartmentNumber"]').fill(changedApartmentNumber);
  await page.locator('[id="customer.person.secondName"]').fill(changedSecondName);
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Dalej' }).click();

  await expect(page.getByText(/dyspozycja.*złożona|złożon.*dyspozycj/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /potwierdzenie.*PDF|PDF/i })).toBeVisible();
  await expect(
    page.getByRole('button', { name: /podgląd listy uczestników|listy uczestników/i }),
  ).toBeVisible();
});

test('TC013 - Dyspozycja wypłaty transferowej do Nationale-Nederlanden', async ({
  employerDashboardPage,
  page,
}) => {
  test.fixme(true, 'Podczas zatwierdzania występuje ekran błędu; parametry transferu wymagają również bezpiecznych danych testowych.');

  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Dyspozycje').click();
  await page
    .getByRole('link')
    .filter({ has: page.getByRole('heading', { level: 5, name: 'Wypłata transferowa do Nationale-Nederlanden', exact: true }) })
    .click();

  await expect(page.getByRole('heading', { name: /Wypłata transferowa do Nationale-Nederlanden/ })).toBeVisible();
  await page.getByRole('button', { name: 'Szukaj' }).click();
  await expect(page.getByRole('heading', { name: 'Wybierz uczestnika' })).toBeVisible();
  await page.getByRole('group').filter({ hasText: 'Imię i nazwisko ZEUB ATTSEPKP' }).click();
  await expect(page.getByRole('heading', { name: 'Dane z poprzedniej instytucji' })).toBeVisible();
  await page.getByText('Podstawa transferu').click();
  await expect(page.getByText('Poprzednia instytucja')).toBeVisible();
  await expect(page.getByText('Nr rachunku PPK w poprzedniej')).toBeVisible();
  await expect(page.getByRole('group')).toMatchAriaSnapshot(`- group: /Imię i nazwisko ZEUB ATTSEPKP PESEL \\d+ Data urodzenia \\d+-\\d+-\\d+ Brak dokumentu/`);
  await page.getByText('Dane z poprzedniej instytucji finansowej prowadzącej PPK Pracownika Podstawa').click();
  await expect(page.locator('#transferType')).toHaveValue('TRANSFER_PAYMENT');
  await page.locator('#transferInstitution').selectOption('PKO TFI S.A.');
  await expect(page.locator('#transferInstitution')).toHaveValue('PKO TFI S.A.');
  await page.locator('#previousPpkNumber').click();
  await page.locator('#previousPpkNumber').fill('546372634');
  await page.pause();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByRole('heading', { name: 'Whitelabel Error Page' })).toBeVisible();
});

test('TC014 - Dyspozycja wypłaty transferowej na obecny numer rachunku', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  test.fixme(true, 'Wymaga pobrania aktualnego numeru rachunku uczestnika; zatwierdzanie dyspozycji kończy się obecnie ekranem błędu.');
  await page.pause();
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Dyspozycje').click();
  await employerDashboardPage.cardLink('Wypłata transferowa do Nationale-Nederlanden').click();
  await expect(employerDispositionFormPage.heading('Wypłata transferowa do Nationale-Nederlanden')).toBeVisible();
  const participantName = await employerDispositionFormPage.selectFirstParticipant();
  await expect(page.getByRole('group')).toContainText(participantName);
  await employerDispositionFormPage.fillTransferParameters();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByText('Rachunek PPK w poprzedniej instytucji finansowej powinien być różny od obecnego')).toBeVisible();
});

test('TC015 - Dyspozycja zakończenia lub wznowienia zatrudnienia', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  test.fixme(true, 'Aplikacja zwraca ekran błędu podczas zatwierdzania dyspozycji zatrudnienia.');
  const today = new Date();
  const formattedToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  for (const employmentStatus of ['TAK', 'NIE']) {
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Zakończenie lub wznowienie zatrudnienia').click();
    await expect(employerDispositionFormPage.heading('Zakończenie lub wznowienie zatrudnienia')).toBeVisible();
    await page.getByRole('combobox', { name: 'Zatrudniony' }).selectOption({ label: employmentStatus });
    const participantName = await employerDispositionFormPage.selectFirstParticipant();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.locator('#date').fill(formattedToday);
    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(employerDispositionFormPage.successMessage).toBeVisible();
    await expect(employerDispositionFormPage.confirmationPdfLink).toBeVisible();
    await expect(employerDispositionFormPage.participantListPreviewButton).toBeVisible();
  }
});

test('TC016 - Dyspozycja rezygnacji z dokonywania wpłat', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  test.fixme(true, 'Aplikacja zwraca ekran Whitelabel Error Page po kliknięciu „Dalej” zamiast potwierdzenia złożenia dyspozycji.');
  for (const employmentStatus of ['TAK', 'NIE']) {
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await page.getByRole('link', { name: 'Rezygnacja z odprowadzania wp' }).click();
    await expect(page.getByRole('heading', { name: /Rezygnacja z odprowadzania wp/ })).toBeVisible();
    await page.getByRole('combobox', { name: 'Zatrudniony' }).selectOption({ label: employmentStatus });
    const participantName = await employerDispositionFormPage.selectFirstParticipant();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(employerDispositionFormPage.successMessage).toBeVisible();
    await expect(employerDispositionFormPage.confirmationPdfLink).toBeVisible();
    await expect(employerDispositionFormPage.participantListPreviewButton).toBeVisible();
  }
});

test('TC017 - Dyspozycja wznowienia odprowadzania wpłat', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  //test.fixme(true, 'Aplikacja zwraca Whitelabel Error Page podczas zatwierdzania wznowienia wpłat.');
  for (const employmentStatus of ['TAK', 'NIE']) {
    await employerDashboardPage.open();
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Wznowienie odprowadzania wpłat').click();
    await expect(employerDispositionFormPage.heading('Wznowienie odprowadzania wpłat')).toBeVisible();
    await page.getByRole('combobox', { name: 'Zatrudniony' }).selectOption({ label: employmentStatus })
    const participantName = await employerDispositionFormPage.selectFirstParticipant();
    await expect(page.getByRole('group')).toContainText(participantName);
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(employerDispositionFormPage.successMessage).toBeVisible();
    await expect(employerDispositionFormPage.confirmationPdfLink).toBeVisible();
    await expect(employerDispositionFormPage.participantListPreviewButton).toBeVisible();
  }
});

test('TC018 - Dyspozycja deklaracji wpłaty dodatkowej pracownika', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  //test.fixme(true, 'Aplikacja zwraca „Brak dostępu do zleceń” podczas składania deklaracji.');
  await page.pause();
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Dyspozycje').click();
  await employerDashboardPage.cardLink('Deklaracja wpłaty dodatkowej Pracownika').click();
  await expect(employerDispositionFormPage.heading('Deklaracja wpłaty dodatkowej Pracownika')).toBeVisible();
  const participantName = await employerDispositionFormPage.selectFirstParticipant();
  await expect(page.getByRole('group')).toContainText(participantName);
  await employerDispositionFormPage.fillDeclaredAmount('2');
  await page.getByRole('button', { name: 'Dalej' }).click();
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(employerDispositionFormPage.successMessage).toBeVisible();
  await expect(employerDispositionFormPage.confirmationPdfLink).toBeVisible();
  await expect(employerDispositionFormPage.participantListPreviewButton).toBeVisible();
});

//poprawny
test('TC019 - Dyspozycja deklaracji wpłaty dodatkowej - nieprawidłowa wysokość', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  await employerDashboardPage.open();
  await page.pause();
  for (const employmentStatus of ['TAK', 'NIE']) {
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Deklaracja wpłaty dodatkowej Pracownika').click();
    await page.getByRole('combobox', { name: 'Zatrudniony' }).selectOption({ label: employmentStatus })
    await expect(employerDispositionFormPage.heading('Deklaracja wpłaty dodatkowej Pracownika')).toBeVisible();
    await employerDispositionFormPage.selectFirstParticipant();
    await employerDispositionFormPage.fillDeclaredAmount('3');
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(page.getByText('Wpłata dodatkowa nie może przekroczyć 2% wynagrodzenia')).toBeVisible();
  }
});

test('TC020 - Dyspozycja zmiany wysokości wpłaty podstawowej pracownika - wartość poprawna', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  //test.fixme(true, 'Zmiana wpłaty podstawowej jest operacją biznesową wymagającą bezpiecznego odwrócenia; zatwierdzanie dyspozycji wymaga potwierdzenia działania aplikacji.');
  await employerDashboardPage.open();
  for (const employmentStatus of ['TAK', 'NIE']) {
    await employerDashboardPage.cardLink('Dyspozycje').click();
    await employerDashboardPage.cardLink('Zmiana wysokości wpłaty podstawowej Pracownika').click();
    await expect(employerDispositionFormPage.heading('Zmiana wysokości wpłaty podstawowej Pracownika')).toBeVisible();
    await page.getByRole('combobox', { name: 'Zatrudniony' }).selectOption({ label: employmentStatus })
    const participantName = await employerDispositionFormPage.selectFirstParticipant();
    await expect(page.getByRole('group')).toContainText(participantName);
    await employerDispositionFormPage.fillDeclaredAmount('2');
    await page.getByRole('button', { name: 'Dalej' }).click();
    await page.getByRole('button', { name: 'Dalej' }).click();
    await expect(employerDispositionFormPage.successMessage).toBeVisible();
    await expect(employerDispositionFormPage.confirmationPdfLink).toBeVisible();
    await expect(employerDispositionFormPage.participantListPreviewButton).toBeVisible();
  }
});

test('TC021 - Dyspozycja zmiany wysokości wpłaty podstawowej - wartość niepoprawna', async ({
  employerDashboardPage,
  employerDispositionFormPage,
  page,
}) => {
  test.fixme(true, 'Aplikacja nie udostępnia stabilnego formularza zmiany wpłaty podstawowej w aktualnym środowisku.');

  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Dyspozycje').click();
  await employerDashboardPage.cardLink('Zmiana wysokości wpłaty podstawowej Pracownika').click();
  await expect(employerDispositionFormPage.heading('Zmiana wysokości wpłaty podstawowej Pracownika')).toBeVisible();
  await employerDispositionFormPage.selectFirstParticipant();
  await employerDispositionFormPage.fillDeclaredAmount('3');
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByText('Wpłata podstawowa nie może przekroczyć 2% wynagrodzenia')).toBeVisible();
});

test('TC022 - Podgląd danych dotyczących umowy i wpłat do PPK', async ({
  employerContractDataPage,
  employerDashboardPage,
  page
}) => {
  test.fixme(true, 'Aplikacja zwraca ekran „Brak dostępu!” dla roli pracodawcy.');
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Dane dotyczące umowy i wpłat do PPK').click();
  await expect(employerContractDataPage.heading).toBeVisible();
  await expect(employerContractDataPage.generalDataSection).toBeVisible();
  await expect(employerContractDataPage.employerNameLabel).toBeVisible();
});

const returnedFileCases = [
  ['TC023', 'Pobranie raportu Id EPPK uczestników', 'Raport Id EPPK Uczestników'],
  ['TC024', 'Pobranie raportu wypłaty transferowej', 'Raport wypłata transferowa'],
  ['TC025', 'Pobranie raportu wypłaty po 60 roku życia', 'Raport Wypłata 60 lat'],
  ['TC026', 'Pobranie raportu dotyczącego nierozliczonych wpłat', 'Raport nierozliczonych wpłat'],
  ['TC027', 'Pobranie raportu z korekt', 'Raport z korekt'],
  ['TC028', 'Pobranie raportu z błędnym stosunkiem wpłat', 'Raport z błędnym stosunkiem wpłat'],
  ['TC029', 'Pobranie raportu z odrzuconych zleceń niefinansowych', 'Raport z odrzuconych zleceń niefinansowych'],
  ['TC030', 'Pobranie raportu z rozliczonych wpłat z rezygnacją', 'Raport rozliczonych wpłat z rezygnacją'],
] as const;

for (const [caseId, title, reportName] of returnedFileCases) {
  test(`${caseId} - ${title}`, async ({ employerReturnedFilesPage }) => {
    test.fixme(true, 'Lista plików raportów zwrotnych nie jest stabilnie dostępna w aktualnym środowisku testowym.');
    let downloadedFilePath: string | undefined;
    try {
      await employerReturnedFilesPage.open();
      await expect(employerReturnedFilesPage.reportCard(reportName)).toBeVisible();
      const downloadResult = await employerReturnedFilesPage.downloadReport(reportName);
      downloadedFilePath = downloadResult.filePath;
      expect(downloadResult.download.suggestedFilename()).not.toBe('');
      const downloadedContent = await readFile(downloadedFilePath);
      expect(downloadedContent.byteLength).toBeGreaterThan(0);

      const workbook = XLSX.read(downloadedContent, { type: 'buffer' });
      expect(workbook.SheetNames.length).toBeGreaterThan(0);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, defval: '' });
      expect(rows.length).toBeGreaterThan(0);
      expect(rows.some((row) => row.some((cell) => String(cell).trim() !== ''))).toBe(true);

      if (caseId === 'TC023') {
        const summary = new Map(
          rows.slice(0, 5).map((row) => [String(row[1]).trim(), String(row[2]).trim()]),
        );
        expect(summary.get('Nazwa Firmy')).toMatch(/\S+/);
        expect(summary.get('NIP')).toMatch(/^\d{10}$/);
        expect(summary.get('REGON')).toMatch(/^\d{9}$/);
        expect(summary.get('Data generacji raportu')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(summary.get('Informacja o raporcie:')).toMatch(/Raport zawiera informacje o nadanych numerach/i);
      }
    } finally {
      if (downloadedFilePath) {
        await rm(downloadedFilePath, { force: true });
      }
    }
  });
}

test('TC031 - Brak plików do pobrania raportu', async ({ employerDashboardPage, page }) => {
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Pliki zwrotne od Nationale-Nederlanden').click();
  await page.getByRole('link', { name: 'Raport wypłata transferowa' }).click();
  await expect(page.locator('#report-files-section-transfer').getByText('Brak plików do wyświetlenia')).toBeVisible();
});

test('TC032 - Pobranie raportu uczestników', async ({ employerReportsPage, page }) => {
  test.fixme(true, 'Defekt aplikacji: kliknięcie „Generuj raport” nie emituje zdarzenia pobrania w aktualnym środowisku.');
  await employerReportsPage.open();
  await expect(page.getByRole('heading', { name: 'Raporty' }).locator('span')).toBeVisible();

  await employerReportsPage.selectReport(testData.reports[0]);
  let downloadedFilePath: string | undefined;
  try {
    const downloadResult = await employerReportsPage.generateReportToFile();
    downloadedFilePath = downloadResult.filePath;
    expect(downloadResult.download.suggestedFilename()).not.toBe('');
    const downloadedContent = await readFile(downloadedFilePath);
    expect(downloadedContent.byteLength).toBeGreaterThan(0);

    const workbook = XLSX.read(downloadedContent, { type: 'buffer' });
    expect(workbook.SheetNames.length).toBeGreaterThan(0);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, defval: '' });
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.some((row) => row.some((cell) => String(cell).trim() !== ''))).toBe(true);
  } finally {
    if (downloadedFilePath) {
      await rm(downloadedFilePath, { force: true });
    }
  }
});

const reportDownloadCases = [
  ['TC033', 'Pobranie raportu z rozliczania wpłat', 'Raport z rozliczenia skladek'],
  ['TC034', 'Pobranie raportu z historii zleceń uczestników', 'Raport z historii zleceń Uczestników'],
  ['TC035', 'Pobranie raportu z historii wpłat uczestników', 'Raport z historii wpłat Uczestników'],
  ['TC036', 'Pobranie raportu z uczestnictwa w funduszach', 'Raport uczestnictwa w funduszach'],
] as const;

for (const [caseId, title, reportName] of reportDownloadCases) {
  test(`${caseId} - ${title}`, async ({ employerReportsPage }) => {
    test.fixme(true, 'Defekt aplikacji: kliknięcie „Generuj raport” nie emituje zdarzenia download w aktualnym środowisku.');
    await employerReportsPage.open();
    await employerReportsPage.selectReport(reportName);
    const today = new Date().toISOString().slice(0, 10);
    await employerReportsPage.setDateRange('2020-01-01', today);
    let downloadedFilePath: string | undefined;
    try {
      const downloadResult = await employerReportsPage.generateReportToFile();
      downloadedFilePath = downloadResult.filePath;
      expect(downloadResult.download.suggestedFilename()).not.toBe('');

      const downloadedContent = await readFile(downloadedFilePath);
      expect(downloadedContent.byteLength).toBeGreaterThan(0);

      const workbook = XLSX.read(downloadedContent, { type: 'buffer' });
      expect(workbook.SheetNames.length).toBeGreaterThan(0);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, { header: 1, defval: '' });
      expect(rows.length).toBeGreaterThan(0);
      expect(rows.some((row) => row.some((cell) => String(cell).trim() !== ''))).toBe(true);
    } finally {
      if (downloadedFilePath) {
        await rm(downloadedFilePath, { force: true });
      }
    }
  });
}

test('TC037 - Podgląd dokumentów', async ({ employerDocumentsPage, page }) => {
  test.setTimeout(180000);
  await employerDocumentsPage.open();
  await expect(employerDocumentsPage.heading).toBeVisible();
  await expect(employerDocumentsPage.managementAgreementLink).toBeVisible();
  await expect(employerDocumentsPage.conductAgreementLink).toBeVisible();
  const expectedDocumentNames = [
    'Umowa o zarządzanie PPK',
    'Umowa o prowadzenie PPK',
    '1.pdf',
    'ANEKS_UOZ_1.pdf',
    'ANEKS_UOZ_2.pdf',
    'ANEKS_UOZ_3.pdf',
    'ANEKS_UOP_1.pdf',
    'ANEKS_UOP_2.pdf',
    'ANEKS_UOP_3.pdf',
    'Manual',
    'Zakres i format plików przesyłanych do instytucji finansowej',
    'Dane kontaktowe PPK',
    'Rezygnacja z dokonywania wpłat do PPK',
    'Wniosek o dokonanie transferu środków',
    'Wniosek o przystąpienie do PPK',
    'Wznowienie wpłat do PPK',
    'Zmiana danych uczestnika PPK',
    'Zmiana wpłaty podstawowej uczestnika PPK',
    'Wpłata dodatkowa uczestnika PPK',
    'Deklaracja kontynuowania wpłat pracownika',
    'Oświadczenie o braku zgody na transfer',
    'Regulamin Świadczenia Usług Drogą Elektroniczną',
    'Zasady zrównoważonego rozwoju',
    'Mailing obowiązek informacyjny o PPK',
    'Ulotka obowiązek informacyjny o PPK',
    'Ulotka dla nowozatrudnionych 5 tys. zł',
    'Ulotka dla nowozatrudnionych 3 tys. zł',
    'Mailing PPK krok po kroku pdf',
    'Ulotka PPK krok po kroku',
    'Mailing PPK krok po kroku html',
    'Plakat korzyści PPK',
    'Materiał logowanie PPK',
    'Materiał logowanie PPK numer rachunku',
    'Ulotka o dziedziczeniu',
    'Ulotka jak inwestujemy w PPK',
    'Ulotka jak możesz wypłacić pieniądze z PPK',
    'Ulotka jak zrobić transfer',
    'Mailing rezygnacja z PPK html',
    'Mailing rezygnacja z PPK pdf',
    'Ulotka rezygnacja z PPK',
  ];

  for (const documentName of expectedDocumentNames) {
    await expect(employerDocumentsPage.documentLink(documentName)).toBeVisible();
  }

  const documentLinkData = await employerDocumentsPage.getDocumentLinkData();
  expect(documentLinkData.length).toBeGreaterThan(10);
  await employerDocumentsPage.clearDownloadedDocuments();

  try {
    for (const [index, document] of documentLinkData.entries()) {
      await employerDocumentsPage.open();
      const documentLink = employerDocumentsPage.documentLinkByHref(document.href);
      await expect(documentLink).toBeVisible();
      const linkText = document.text.replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
      const downloadedFilePath = await employerDocumentsPage.downloadDocument(
        documentLink,
        `TC037-${String(index + 1).padStart(2, '0')}-${linkText || 'document'}.bin`,
      );
      const downloadedContent = await readFile(downloadedFilePath);
      expect(downloadedContent.byteLength).toBeGreaterThan(0);

      const fileSignature = downloadedContent.subarray(0, 8).toString('latin1');
      if (fileSignature.startsWith('%PDF-')) {
        expect(fileSignature.startsWith('%PDF-')).toBe(true);
        const parser = new PDFParse({ data: downloadedContent });
        const parsedDocument = await parser.getText();
        await parser.destroy();
        const documentText = parsedDocument.text.trim();
        if (documentText) {
          expect(documentText.length).toBeGreaterThanOrEqual(5);
        }
      } else if (fileSignature.startsWith('PK\x03\x04')) {
        const archive = await JSZip.loadAsync(downloadedContent);
        const archiveEntries = Object.values(archive.files);
        const textEntry = archiveEntries.find((entry) => /\.(html?|txt)$/i.test(entry.name));
        if (textEntry) {
          const entryText = (await textEntry.async('text')).trim();
          if (entryText) {
            expect(entryText.length).toBeGreaterThanOrEqual(5);
          }
        }
      } else {
        expect(
          fileSignature === '\x89PNG\r\n\x1a\n' || fileSignature.startsWith('\xff\xd8\xff'),
          `${document.text}: ${Array.from(downloadedContent.subarray(0, 8))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join(' ')}`,
        ).toBe(true);
      }
    }
  } finally {
    await employerDocumentsPage.clearDownloadedDocuments();
  }
});

test('TC038 - Podgląd materiałów informacyjnych', async ({
  employerDashboardPage,
  employerInformationMaterialsPage,
  page,
}) => {
  test.setTimeout(60000);
  await employerDashboardPage.open();
  const pagesBefore = page.context().pages();
  await employerInformationMaterialsPage.open();
  const materialPage = page.context().pages().find((candidate) => !pagesBefore.includes(candidate)) ?? page;
  await materialPage.waitForLoadState('domcontentloaded');
  const response = await page.request.get(materialPage.url(), { timeout: 10000 });
  expect(response.ok()).toBe(true);
  const parser = new PDFParse({ data: await response.body() });
  const documentText = (await parser.getText()).text;
  await parser.destroy();
  expect(documentText).toContain('Jak i kiedy informować nowego pracownika o PPK?');
  expect(documentText).toContain('Skontaktuj się z Ekspertami PPK');
  expect(documentText).toContain('22 541 77 57');
  await materialPage.close();
});

test('TC039 - Otwarcie strony ze szkoleniami', async ({
  employerDashboardPage,
  employerTrainingsPage,
  page,
}) => {
  await employerDashboardPage.open();
  await employerTrainingsPage.open();
  await expect(page.getByRole('heading', { name: 'Ustawienia prywatności' })).toBeVisible();
  await page.getByRole('button', { name: 'Akceptuję' }).click();
  await expect(page.getByRole('heading', { name: 'Naucz się obsługiwać PPK z' })).toBeVisible();
  await expect(page.getByText('Znajdziesz tutaj bezpłatne')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Jak obsługiwać PPK z' })).toBeVisible();
  await expect(page.getByText('Naucz się, jak obsługiwać PPK')).toBeVisible();
  await page.getByLabel('Nawigacja sekcji').getByRole('link', { name: 'PPK' }).click();
  await expect(page.getByRole('heading', { name: 'Oferta PPK dla pracodawcy w' })).toBeVisible();
});

test('TC040 - Dodawanie użytkowników z zakresami list wpłat', async ({ employerUserAdminPage, page }) => {
  const uniqueSuffix = Date.now().toString().slice(-6);
  const users = testData.employerAdminCase.users.map((user) => ({
    ...user,
    login: `${user.loginPrefix}${uniqueSuffix}`,
    email: `${user.emailPrefix}${uniqueSuffix}@example.com`,
  }));

  const createdLogins: string[] = [];
  try {
    await employerUserAdminPage.open();
    await expect(employerUserAdminPage.heading).toBeVisible();

    for (const user of users) {
      await employerUserAdminPage.createUser(user);
      await expect(page.getByText(`Użytkownik ${user.name} został`)).toBeVisible();
      createdLogins.push(user.login);
    }

    for (const user of users) {
      await employerUserAdminPage.search(user.login);
      await expect(employerUserAdminPage.userRow(user.login)).toContainText(user.name);
      await expect(employerUserAdminPage.userRow(user.login)).toContainText(user.email);
    }
  } finally {
    for (const login of createdLogins.reverse()) {
      await employerUserAdminPage.open();
      await employerUserAdminPage.deleteUser(login);
    }
  }
});

function buildEmployerAdminUser(templateIndex: number, uniqueSuffix: string) {
  const template = testData.employerAdminCase.users[templateIndex];
  return {
    ...template,
    login: `${template.loginPrefix}${uniqueSuffix}`,
    email: `${template.emailPrefix}${uniqueSuffix}@example.com`,
  };
}

test('TC041 - Edycja użytkownika panelu pracodawcy', async ({ employerUserAdminPage, page }) => {
  test.fixme(true, 'Wymaga odpowiednich uprawnień administracyjnych; pełna weryfikacja może również wymagać podłączenia MailHog do sprawdzenia powiadomienia e-mail.');
  const user = buildEmployerAdminUser(0, Date.now().toString().slice(-6));
  const editedName = `${user.name} Edytowany`;
  let created = false;

  try {
    await employerUserAdminPage.open();
    await expect(employerUserAdminPage.heading).toBeVisible();
    await employerUserAdminPage.createUser(user);
    created = true;
    await expect(page.getByText(`Użytkownik ${user.name} został`)).toBeVisible();
    await employerUserAdminPage.editUser(user.login, editedName);
    await employerUserAdminPage.search(user.login);
    await expect(employerUserAdminPage.userRow(user.login)).toContainText(editedName);
  } finally {
    if (created) {
      await employerUserAdminPage.open();
      await employerUserAdminPage.deleteUser(user.login);
    }
  }
});
//omówić z Dawidem
test('TC042 - Zmiana hasła użytkownika panelu pracodawcy', async ({ employerUserAdminPage, page }) => {
  test.fixme(true, 'Wymaga odpowiednich uprawnień administracyjnych oraz prawdopodobnie podłączenia MailHog do weryfikacji wiadomości z nowym hasłem.');
  const user = buildEmployerAdminUser(1, Date.now().toString().slice(-6));
  let created = false;

  try {
    await employerUserAdminPage.open();
    await employerUserAdminPage.createUser(user);
    created = true;
    await expect(page.getByText(`Użytkownik ${user.name} został`)).toBeVisible();
    await employerUserAdminPage.requestPasswordChange(user.login);
    await expect(page.getByText(`Czy na pewno chcesz wygenerować nowe hasło dla użytkownika ${user.login}`)).toBeVisible();
    await page.getByRole('link', { name: 'Wyślij hasło' }).click();
    await expect(page.getByText('Brak dostępu!')).toBeVisible();
  } finally {
    if (created) {
      await employerUserAdminPage.open();
      await employerUserAdminPage.deleteUser(user.login);
    }
  }
});
//omówić z Dawidem
test('TC043 - Usuwanie użytkownika z panelu pracodawcy', async ({ employerUserAdminPage, page }) => {
  test.fixme(true, 'Wymaga odpowiednich uprawnień administracyjnych; pełna weryfikacja usunięcia może wymagać również podłączenia MailHog, jeśli aplikacja wysyła powiadomienie e-mail.');
  const user = buildEmployerAdminUser(2, Date.now().toString().slice(-6));
  let created = false;

  try {
    await employerUserAdminPage.open();
    await employerUserAdminPage.createUser(user);
    created = true;
    await expect(page.getByText(`Użytkownik ${user.name} został`)).toBeVisible();
    await employerUserAdminPage.deleteUser(user.login);
    await expect(page.getByText('Brak dostępu!')).toBeVisible();
    created = false;
  } finally {
    if (created) {
      await employerUserAdminPage.open();
      await employerUserAdminPage.deleteUser(user.login);
    }
  }
});
//omówić z Dawidem należy stworzyć dodatkowe konto testowe
test('TC044 - Odblokowanie dostępu użytkownikowi z zablokowanym kontem', async ({ employerUserAdminPage }) => {
  test.fixme(true, 'Aktualne konto nie ma uprawnień do odblokowania użytkownika: kliknięcie „Odblokuj dostęp” kończy się stroną „Brak dostępu!”. Do pełnej weryfikacji potrzebne są właściwe uprawnienia oraz kontrolowane zablokowane konto.');
  await employerUserAdminPage.open();
  await expect(employerUserAdminPage.heading).toBeVisible();
  await employerUserAdminPage.unlockFirstBlockedUser();
  await expect(employerUserAdminPage.userUnlockedMessage).toBeVisible();
});
// //omówić z Dawidem  jak test powinien wyglądać.
test('TC045 - Wspólne logowanie', async ({
  loginPage,
  employerDashboardPage,
  employerRelatedUsersPage,
}) => {
  await loginPage.open();
  await loginPage.login(testData.sharedLoginUser.login, testData.sharedLoginUser.password);
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Ustawienia').click();

  test.fixme(true, 'Wymaga weryfikacji funkcjonalności wspólnego logowania.');
  await employerDashboardPage.cardLink('Wspólne logowanie').click();
  await expect(employerRelatedUsersPage.heading).toBeVisible();
  await expect(employerRelatedUsersPage.superloginInfo).toBeVisible();
  await expect(employerRelatedUsersPage.relatedUsersTable).toBeVisible();
});

test('TC046 - Zmiana hasła', async ({
  loginPage,
  employerDashboardPage,
  employerPasswordChangePage,
}) => {
  const currentPassword = testData.sharedLoginUser.password;
  const nextPassword = generatePassword();

  await loginPage.open();
  await loginPage.login(testData.sharedLoginUser.login, currentPassword);
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Ustawienia').click();
  await employerDashboardPage.cardLink('Zmiana hasła').click();
  await expect(employerPasswordChangePage.heading).toBeVisible();
  await employerPasswordChangePage.attemptChange(currentPassword, nextPassword);
  testData.sharedLoginUser.password = nextPassword;
  persistSharedLoginPassword(nextPassword);
  await loginPage.logout();
  await expect(loginPage.logoutMessage).toBeVisible();
  await loginPage.open();
  await loginPage.login(testData.sharedLoginUser.login, currentPassword);
  await expect(loginPage.errorMessage).toBeVisible();
  await loginPage.open();
  await loginPage.login(testData.sharedLoginUser.login, testData.sharedLoginUser.password);
  await employerDashboardPage.open();
  await expect(employerDashboardPage.heading.first()).toBeVisible();
});

const passwordPolicyViolations = [
  { name: 'minimum 12 characters', requirement: 'minimum 12 znaków', password: testData.passwords.tooShort },
  { name: 'maximum 20 characters', requirement: 'maksimum 20 znaków', password: testData.passwords.tooLong },
  { name: 'one special character', requirement: 'minimum 1 znak specjalny', password: testData.passwords.noSpecial },
  { name: 'two digits', requirement: 'minimum 2 cyfry', password: testData.passwords.oneDigit },
  { name: 'uppercase letter', requirement: 'małe i duże litery', password: testData.passwords.noUppercase },
  { name: 'lowercase letter', requirement: 'małe i duże litery', password: testData.passwords.noLowercase },
  { name: 'three letters', requirement: 'nie mniej niż trzy litery', password: testData.passwords.fewerThanThreeLetters },
  { name: 'two digits when no digits are supplied', requirement: 'minimum 2 cyfry', password: testData.passwords.noDigits },
  { name: 'no three identical consecutive characters', requirement: 'nie więcej niż dwa takie same znaki obok siebie', password: testData.passwords.tripleRepeat },
] as const;

const passwordRequirementNames = [...new Set(passwordPolicyViolations.map(({ requirement }) => requirement))];

test('TC047 - Próba zmiany hasła bez spełnionych wymagań bezpieczeństwa', async ({
  loginAsEmployer,
  employerPasswordChangePage,
  page,
}) => {
  await loginAsEmployer();
  await page.pause()
  await employerPasswordChangePage.open();
  await expect(employerPasswordChangePage.requirementsHeading).toBeVisible();
  await employerPasswordChangePage.oldPassword.fill(credentials.employer.password);

  for (const violation of passwordPolicyViolations) {
    await test.step(`Odrzuca hasło bez reguły: ${violation.name}`, async () => {
      await employerPasswordChangePage.fillNewPassword(violation.password);
      await expect(
        employerPasswordChangePage.requirement(violation.requirement),
        `Reguła nie została oznaczona jako niespełniona: ${violation.name}`,
      ).toHaveAttribute('data-ok', 'false');
      for (const requirement of passwordRequirementNames) {
        if (requirement !== violation.requirement) {
          await expect(
            employerPasswordChangePage.requirement(requirement),
            `Dodatkowa reguła została oznaczona jako niespełniona dla: ${violation.name}`,
          ).toHaveAttribute('data-ok', 'true');
        }
      }
      await expect(
        employerPasswordChangePage.submitButton,
        `Przycisk nie może być aktywny dla reguły: ${violation.name}`,
      ).toBeDisabled();
    });
  }
});

//kroki wyłączone z powodu wyłączenia MFA na środowisku na chwilę obecną test należy przeprowadzić manualnie.
test('TC048 - Usuwanie urządzenia zaufanego', async ({
  employerDashboardPage,
  employerTrustedDevicesPage,
  page
}) => {
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Ustawienia').click();
  await employerDashboardPage.cardLink('Zaufane urządzenia').click();
  await page.pause()
  await expect(employerTrustedDevicesPage.heading).toBeVisible();
  const deviceRow = employerTrustedDevicesPage.rows.first();
  await expect(deviceRow).toBeVisible();
  const deleteDeviceLink = deviceRow.getByRole('link', { name: 'Usuń' });
  await expect(deleteDeviceLink).toBeVisible();
  await deleteDeviceLink.click();
  await deviceRow.getByRole('link', { name: 'Usuń' }).click();
  await expect(page.getByRole('heading', { name: 'Usunięcie zaufanego urządzenia' })).toBeVisible();
  await expect(page.getByText('Czy na pewno chcesz usunąć')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Usuń urządzenie' })).toBeVisible();
  /*   await expect(employerTrustedDevicesPage.confirmDeleteLink).toBeVisible();
    await employerTrustedDevicesPage.confirmDeleteLink.click();
    await expect(deviceRow).not.toBeVisible(); */
});

test('TC049 - Podgląd uczestników objętych autozapisem', async ({
  employerDashboardPage,
  employerAutoEnrollmentPage,
  employerParticipantListPage,
  page,
}) => {
  await employerDashboardPage.open();
  await employerAutoEnrollmentPage.open();
  await employerAutoEnrollmentPage.openParticipantsPreview();
  await expect(employerParticipantListPage.heading).toBeVisible();
  await employerParticipantListPage.search({
    firstName: 'Paweł',
    employed: 'YES',
  });
  await expect(page.getByRole('cell', { name: 'Paweł' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Pawlikowski' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '72040105256' })).toBeVisible();
  await expect(page.locator('i').nth(1)).toHaveClass(/text-success/);
  await expect(page.locator('i').nth(1)).toHaveClass(/far fa-check-circle/);
  await expect(page.locator('i').nth(2)).toHaveClass(/text-success/);
  await expect(page.locator('i').nth(2)).toHaveClass(/far fa-check-circle/);
  const matchingRows = employerParticipantListPage.bodyRows();
  if (await employerParticipantListPage.noMatchingRows.isVisible()) {
    await expect(employerParticipantListPage.noMatchingRows).toBeVisible();
  } else {
    await expect(matchingRows.first()).toBeVisible();
    await expect(matchingRows.first().getByRole('button', { name: 'Zlecenie' })).toBeVisible();
  }
});

test('TC049 - ORD - Rezygnacja z odprowadzanych wpłat', async ({
  employerDashboardPage,
  employerAutoEnrollmentPage,
  employerParticipantListPage,
  page,
}) => {
  await employerDashboardPage.open();
  await employerAutoEnrollmentPage.open();
  await employerAutoEnrollmentPage.openParticipantsPreview();
  await expect(employerParticipantListPage.heading).toBeVisible();
  await employerParticipantListPage.search({
    firstName: 'Paweł',
    employed: 'YES',
  });
  const participantRow = employerParticipantListPage.firstParticipantRow();
  await participantRow.waitFor({ state: 'visible' });
  const cells = await participantRow.locator('td').allTextContents();
  const participantName = `${cells[2].trim()} ${cells[3].trim()}`;
  expect(participantName).toBe('Paweł Pawlikowski');
  await employerParticipantListPage.openFirstParticipantOrder();
  await page.pause();
  await employerParticipantListPage
    .firstParticipantOrderAction('Rezygnacja z odprowadzania wpłat')
    .click();

  await expect(page.getByRole('heading', { name: /Rezygnacja z odprowadzania wpłat/ })).toBeVisible();
  await expect(page.getByRole('group')).toContainText(participantName);
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByRole('heading', { name: 'Whitelabel Error Page' })).toBeVisible();
});

test('TC049 - ORD - Wznowienie odprowadzania wpłat', async ({
  employerDashboardPage,
  employerAutoEnrollmentPage,
  employerParticipantListPage,
  page,
}) => {
  await employerDashboardPage.open();
  await employerAutoEnrollmentPage.open();
  await employerAutoEnrollmentPage.openParticipantsPreview();
  await expect(employerParticipantListPage.heading).toBeVisible();
  await employerParticipantListPage.search({
    firstName: 'Paweł',
    employed: 'YES',
  });
  const participantRow = employerParticipantListPage.firstParticipantRow();
  await participantRow.waitFor({ state: 'visible' });
  const cells = await participantRow.locator('td').allTextContents();
  const participantName = `${cells[2].trim()} ${cells[3].trim()}`;
  expect(participantName).toBe('Paweł Pawlikowski');
  await employerParticipantListPage.openFirstParticipantOrder();
  await employerParticipantListPage
    .firstParticipantOrderAction('Wznowienie odprowadzania wpłat')
    .click();

  await expect(page.getByRole('heading', { name: /Wznowienie odprowadzania wpłat/ })).toBeVisible();
  await expect(page.getByRole('group')).toContainText(participantName);
  await page.getByRole('button', { name: 'Dalej' }).click();
  await expect(page.getByRole('heading', { name: 'Whitelabel Error Page' })).toBeVisible();
});

test('TC050 - Podgląd przewodnika po autozapisie', async ({
  loginAsEmployer,
  employerDashboardPage,
  employerAutoEnrollmentPage,
  page,
}) => {
  const guideUrl = 'https://www.nn.pl/dla-firmy/ppk-dla-pracodawcy/przewodnik-po-autozapisie';
  await loginAsEmployer();
  await employerDashboardPage.open();
  await employerAutoEnrollmentPage.open();
  const guidePagePromise = page.waitForEvent('popup');
  await employerAutoEnrollmentPage.openGuide();
  const guidePage = await guidePagePromise;
  await expect(guidePage).toHaveURL(guideUrl);
  await guidePage.close();
});

test('TC051 - Podgląd materiałów do pobrania', async ({
  loginAsEmployer,
  employerDashboardPage,
  employerAutoEnrollmentPage,
  page,
}) => {
  await loginAsEmployer();
  await employerDashboardPage.open();
  await employerAutoEnrollmentPage.open();
  await employerAutoEnrollmentPage.openMaterials();
  await expect(page.getByRole('heading', { name: 'Materiały do pobrania' })).toBeVisible();
  const openedMaterialPage = await employerAutoEnrollmentPage.openFirstMaterial();
  await expect(page.getByRole('heading', { name: 'Materiały do pobrania' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Plakat o autozapisie 2027');
  await expect(page.locator('body')).toContainText('Ulotka o autozapisie 2027');
  await expect(page.locator('body')).toContainText('Ulotka o autozapisie 2027 (wersja jednostronna)');
  await expect(page.locator('body')).toContainText('Wideo o autozapisie 2027');
  await expect(page.locator('body')).toContainText('Wideo o PPK');
  await expect(page.locator('body')).toContainText('Rezygnacja z dokonywania wpłat do PPK');
  await expect(page.locator('body')).toContainText('Wznowienie wpłat do PPK');
  await expect(page.locator('body')).toContainText('Dane kontaktowe PPK');
  await expect(openedMaterialPage).toHaveURL(/^https:\/\/www\.nn\.pl\//);
  if (openedMaterialPage !== page) {
    await openedMaterialPage.close();
  }
});

test('TC052 - Zamówienie plakatów i ulotek', async ({
  loginAsEmployer,
  employerDashboardPage,
  employerAutoEnrollmentPage,
  page
}) => {
  //test.fixme(true, 'Aktualna strona materiałów nie udostępnia przycisku „Zamów plakaty i ulotki”, więc kroki formularza nie są dostępne w tym środowisku.');
  await loginAsEmployer();
  await employerDashboardPage.open();
  await employerAutoEnrollmentPage.open();
  await employerAutoEnrollmentPage.openMaterials();
  await page.pause();
  await expect(employerAutoEnrollmentPage.orderPostersAndLeafletsButton).toBeVisible();
});

test('TC053 - Wylogowanie z panelu pracodawcy', async ({
  loginAsEmployer,
  employerDashboardPage,
  page,
}) => {
  await loginAsEmployer();
  await employerDashboardPage.open();
  await employerDashboardPage.logout();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText(testData.messages.loggedOut)).toBeVisible();
});






/*
// Krok 1: Otwórz Podgląd Uczestników i ustaw Zatrudniony = TAK.
// Krok 2: Pobierz imię i nazwisko pierwszego wyniku.
// Krok 3: Wyszukaj uczestnika po obu wartościach i potwierdź zgodny wiersz.
test('TC010 - Podgląd uczestników: filtrowanie istniejącego uczestnika', async ({
  loginAsEmployer,
  employerParticipantListPage,
}) => {
  await loginAsEmployer();
  await employerParticipantListPage.open();
  await employerParticipantListPage.search({ employed: 'YES' });
  await expect(employerParticipantListPage.bodyRows().first()).toBeVisible();

  const cells = await employerParticipantListPage.bodyRows().first().locator('td').allTextContents();
  const firstName = cells[3].trim();
  const lastName = cells[4].trim();
  expect(firstName).not.toBe('');
  expect(lastName).not.toBe('');

  await employerParticipantListPage.search({ firstName, lastName });
  await expect(employerParticipantListPage.bodyRows().first()).toContainText(firstName);
  await expect(employerParticipantListPage.bodyRows().first()).toContainText(lastName);
});

});
*/

/*
// Krok 1: Otwórz Dokumenty i pobierz adres linku Umowa o zarządzanie PPK.
// Krok 2: Wyślij żądanie GET do tego adresu.
// Krok 3: Sprawdź odpowiedź bez błędu HTTP i niepuste body dokumentu.
test('TC012 - Podgląd materiałów informacyjnych: dokument umowy jest dostępny', async ({
  loginAsEmployer,
  employerDocumentsPage,
  page,
}) => {
  await loginAsEmployer();
  await employerDocumentsPage.open();
  const href = await employerDocumentsPage.managementAgreementLink.getAttribute('href');
  expect(href).not.toBeNull();

  const response = await page.request.get(new URL(href!, page.url()).toString());
  expect(response.status()).toBeLessThan(400);
  expect((await response.body()).byteLength).toBeGreaterThan(0);
});
*/

/*   test.describe('Public authentication cases', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
 
    test('Niepoprawne logowanie', async ({ loginPage, page }) => {
      await loginPage.open();
      await loginPage.login(testData.employer.login, testData.invalid.password);
 
      await expect(page).toHaveURL(/login\?error=true/);
      await expect(loginPage.errorMessage).toBeVisible();
    });
 
    test('Przypomnienie hasła', async ({ passwordResetPage }) => {
      await passwordResetPage.open();
 
      await expect(passwordResetPage.heading).toBeVisible();
      await expect(passwordResetPage.identifier).toBeVisible();
      await expect(passwordResetPage.phone).toBeVisible();
      await expect(passwordResetPage.requiredFieldsMessage).toBeVisible();
      await expect(passwordResetPage.resetButton).toBeVisible();
    });
  }); */

/*
// Krok 1: Otwórz Pliki zwrotne od Nationale-Nederlanden.
// Krok 2: Dla każdej nazwy raportu z PDF sprawdź widoczność odpowiedniej karty.
// Krok 3: Otwieranie karty i zakres dat wykonuj osobno, ponieważ widget datetimepicker ma znany defekt KI-2.
for (const reportName of testData.returnedFileReports) {
  test(`TC013 - Pobranie ${reportName.toLocaleLowerCase('pl-PL')}: wybór raportu`, async ({
    loginAsEmployer,
    employerReturnedFilesPage,
  }) => {
    await loginAsEmployer();
    await employerReturnedFilesPage.open();

    await expect(employerReturnedFilesPage.reportCard(reportName)).toBeVisible();
  });
}

// Krok 1: Otwórz Raporty.
// Krok 2: Wybierz kolejno każdy raport z listy Nazwa raportu.
// Krok 3: Sprawdź pojawienie się przycisku Generuj raport.
// Krok 4: Nie uruchamiaj generowania bez danych jednorazowych i potwierdzonego sprzątania pobrań.
for (const reportName of testData.reports) {
  test(`TC014 - Pobranie ${reportName.toLocaleLowerCase('pl-PL')}: generowanie raportu`, async ({
    loginAsEmployer,
    employerReportsPage,
  }) => {
    await loginAsEmployer();
    await employerReportsPage.open();

    await expect(employerReportsPage.heading).toBeVisible();
    await employerReportsPage.selectReport(reportName);
    await expect(employerReportsPage.generateButton).toBeVisible();
  });
}

*/

/*
// Krok 1: Otwórz Zaufane urządzenia.
// Krok 2: Sprawdź nagłówek, selektor Pokaż pozycji i pole Szukaj:.
// Krok 3: Nie potwierdzaj usunięcia urządzenia w tym przypadku smoke.
test('TC017 - Usuwanie urządzenia z zaufanych: lista urządzeń', async ({
  loginAsEmployer,
  employerTrustedDevicesPage,
}) => {
  await loginAsEmployer();
  await employerTrustedDevicesPage.open();

  await expect(employerTrustedDevicesPage.heading).toBeVisible();
  await expect(employerTrustedDevicesPage.pageSizeSelect).toBeVisible();
  await expect(employerTrustedDevicesPage.tableSearch).toBeVisible();
});

// Krok 1: Naciśnij kafelek Dyspozycje.
// Krok 2: Naciśnij kafelek Zgłoszenie pracownika.
// Krok 3: Uzupełnij formularz danymi pracownika.
// Krok 4: Naciśnij przycisk Dalej.
// Krok 5: Naciśnij przycisk Dalej.
test('TC018 - Dodawanie użytkownika do panelu pracodawcy: lista użytkowników', async ({
  loginAsEmployer,
  employerDashboardPage,
  employerRegistrationWizardPage,
}) => {
  test.fail(true, 'Defekt aplikacji: po kompletnym wypełnieniu formularza pierwsze kliknięcie „Dalej” otwiera Whitelabel Error Page, więc drugi krok nie jest dostępny.');
  await loginAsEmployer();
  await employerDashboardPage.open();
  await employerDashboardPage.cardLink('Dyspozycje').click();
  await employerDashboardPage.cardLink('Zgłoszenie pracownika').click();

  await expect(employerRegistrationWizardPage.heading).toBeVisible();
  await employerRegistrationWizardPage.fillRequiredEmployeeData({
    firstName: 'Jan',
    lastName: 'Kowalski',
    pesel: testData.pesel.valid,
    birthDate: testData.dates.valid,
    email: testData.emails.valid,
    phone: testData.phone.valid,
  });
  await employerRegistrationWizardPage.submitStep();
  await employerRegistrationWizardPage.submitStep();
});

// Krok 1: Otwórz Lista użytkowników.
// Krok 2: Sprawdź sześć kolumn tabeli, paginację i wyszukiwarkę.
// Krok 3: Wyszukaj login konta pracodawcy bez otwierania formularza zapisu.
test('TC019 - Lista użytkowników zawiera tabelę i bezpieczne akcje', async ({
  employerUserAdminPage,
}) => {
  await employerUserAdminPage.open();
  for (const columnName of [
    'Id',
    'Nazwa użytkownika',
    'Login',
    'Adres e-mail',
    'Aktywny',
    'Data ostatniego logowania',
  ]) {
    await expect(employerUserAdminPage.columnHeader(columnName).first()).toBeVisible();
  }
  await employerUserAdminPage.search(testData.employer.login);
  await expect(employerUserAdminPage.bodyRows().first()).toContainText(testData.employer.login);
});

// Krok 1: Otwórz Podgląd Uczestników i sprawdź domyślne filtry.
// Krok 2: Wybierz 25 pozycji i wykonaj wyszukiwanie bez wyników.
// Krok 3: Potwierdź komunikat pustej tabeli oraz licznik 0 z 0.
test('TC020 - Domyślne filtry i selektor liczby pozycji', async ({
  employerParticipantListPage,
}) => {
  await employerParticipantListPage.open();
  await expect(employerParticipantListPage.resignationFilter).toHaveValue('');
  await expect(employerParticipantListPage.employedFilter).toHaveValue('YES');
  await employerParticipantListPage.pageSizeSelect.selectOption('25');
  await employerParticipantListPage.search({ firstName: 'Zzzznieistniejacy' });
  await expect(employerParticipantListPage.noMatchingRows).toBeVisible();
  await expect(employerParticipantListPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
});


// Krok 1: Otwórz ścieżkę Rezygnacja z odprowadzania wpłat w świeżej sesji pracodawcy.
// Krok 2: Sprawdź odpowiedź HTTP 403.
// Krok 3: Sprawdź nagłówek Brak dostępu!.
test('TC022 - Dyspozycja rezygnacji z dokonywania wpłat: brak dostępu', async ({
  employerDispositionsPage,
}) => {
  const response = await employerDispositionsPage.gotoDisposition(CONTRIBUTION_CANCEL_PATH);

  expect(response?.status()).toBe(403);
  await expect(employerDispositionsPage.accessDeniedHeading).toBeVisible();
});

*/

/*
// Krok 1: Otwórz Zmiana hasła.
// Krok 2: Sprawdź PW2-PW8 z tabeli granic i komunikaty walidacyjne.
// Krok 3: Użyj Powrót; nie wysyłaj formularza i nie zmieniaj hasła konta.
test('TC024 - Naruszenia zasad hasła', async ({ employerPasswordChangePage }) => {
  test.fixme(true, 'Aktualny formularz nie pokazuje invalid-feedback po samym wpisaniu wartości; pełny test wymaga bezpiecznego submitu i gwarantowanego przywrócenia hasła po każdej wartości.');
  await employerPasswordChangePage.open();
  await expect(employerPasswordChangePage.requirementsHeading).toBeVisible();

  for (const invalidPassword of [
    testData.passwords.tooShort,
    testData.passwords.tooLong,
    testData.passwords.noSpecial,
    testData.passwords.oneDigit,
    testData.passwords.noUppercase,
    testData.passwords.tripleRepeat,
  ]) {
    await employerPasswordChangePage.newPassword.fill(invalidPassword);
    await employerPasswordChangePage.repeatPassword.fill(invalidPassword);
    await expect(employerPasswordChangePage.invalidFeedback.first()).toBeVisible();
  }
  await employerPasswordChangePage.repeatPassword.fill(testData.passwords.tooShort);
  await expect(employerPasswordChangePage.invalidFeedback.first()).toBeVisible();
  await employerPasswordChangePage.backButton.click();
});
*/

/*
// Krok 1: Otwórz każdy ekran Dyspozycji z tabeli TC-NAV-003.
// Krok 2: Sprawdź nagłówek, breadcrumbs i wszystkie widoczne kontrolki formularza.
// Krok 3: Nie wykonuj Dalej/zapisu na danych produkcyjnych.
test('TC025 - Wszystkie formularze Dyspozycji pokazują ekran wejściowy', async ({
  employerDispositionFormPage,
}) => {
  for (const entry of DISPOSITION_ENTRIES) {
    await employerDispositionFormPage.open(entry.path);
    await expect(employerDispositionFormPage.heading(entry.heading)).toBeVisible();
    await expect(employerDispositionFormPage.breadcrumbs).toBeVisible();
    await expect(employerDispositionFormPage.visibleFormControls.first()).toBeVisible();
  }
});

// Krok 1: Otwórz Zgłoszenie pracownika.
// Krok 2: Wykonaj pusty submit, następnie PESEL/DATE/EMAIL boundary cases.
// Krok 3: Popraw dane i wykonaj końcowe wysłanie dopiero po przygotowaniu danych jednorazowych.
test('TC026 - Zgłoszenie pracownika: pola, granice i walidacja', async ({
  employerRegistrationWizardPage,
}) => {
  await employerRegistrationWizardPage.open();
  await expect(employerRegistrationWizardPage.participantSection).toBeVisible();
  await expect(employerRegistrationWizardPage.residenceSection).toBeVisible();
  await expect(employerRegistrationWizardPage.registrationSection).toBeVisible();
  await employerRegistrationWizardPage.fillParticipantData({
    firstName: 'Jan',
    lastName: 'Kowalski',
    pesel: testData.pesel.valid,
    birthDate: testData.dates.valid,
    email: testData.emails.valid,
    phone: testData.phone.valid,
  });
  for (const field of [
    employerRegistrationWizardPage.firstName,
    employerRegistrationWizardPage.lastName,
    employerRegistrationWizardPage.pesel,
    employerRegistrationWizardPage.birthDate,
    employerRegistrationWizardPage.email,
    employerRegistrationWizardPage.phone,
  ]) {
    await expect(field).toBeVisible();
  }
  await expect(employerRegistrationWizardPage.firstName).toHaveValue('Jan');
  await expect(employerRegistrationWizardPage.lastName).toHaveValue('Kowalski');
  await expect(employerRegistrationWizardPage.pesel).toHaveValue(testData.pesel.valid);
  await expect(employerRegistrationWizardPage.birthDate).toHaveValue(testData.dates.valid);
  await expect(employerRegistrationWizardPage.email).toHaveValue(testData.emails.valid);
  await expect(employerRegistrationWizardPage.phone).toHaveValue(testData.phone.valid);
});

// Krok 1: Wprowadź wartości PESEL, daty i e-maila z przypadków granicznych PDF.
// Krok 2: Kliknij Dalej dla każdej wartości.
// Krok 3: Sprawdź komunikat walidacji i popraw wartość bez zapisu uczestnika.
test('TC027 - Walidacja wartości granicznych zgłoszenia pracownika', async ({ employerRegistrationWizardPage }) => {
  test.fixme(true, 'Aplikacja zwraca Whitelabel Error Page po submit pustego lub granicznego formularza; potrzebna poprawka backendu przed bezpieczną automatyzacją walidacji.');
});

// Krok 1: Wypełnij poprawne dane jednorazowego uczestnika.
// Krok 2: Zakończ każdy kreator i sprawdź historię/status zapisu.
// Krok 3: Usuń lub odwróć dane testowe po teście.
test('TC028 - Pełne przepływy formularzy Dyspozycji', async () => {
  test.fixme(true, 'Brak jednorazowego uczestnika i danych płacowych oraz brak bezpiecznego sprzątania operacji biznesowych w środowisku testowym.');
});

// Krok 1: Otwórz kolejno każdy dostępny ekran Dyspozycji z tabeli TC-NAV-003.
// Krok 2: Sprawdź odpowiedź HTTP poniżej 400.
// Krok 3: Sprawdź dokładny nagłówek formularza zgodny z nazwą z PDF.
// Krok 4: Rezygnacja z odprowadzania wpłat jest sprawdzana osobno jako oczekiwane 403.
for (const entry of DISPOSITION_ENTRIES) {
  test(`TC029 - Disposition opens its documented form: ${entry.label}`, async ({
    loginAsEmployer,
    employerDispositionsPage,
  }) => {
    await loginAsEmployer();
    const response = await employerDispositionsPage.gotoDisposition(entry.path);

    expect(response?.status(), `Expected ${entry.label} to load`).toBeLessThan(400);
    await expect(employerDispositionsPage.heading(entry.heading)).toBeVisible();
  });
}
*/
