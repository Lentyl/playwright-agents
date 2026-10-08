import { test, expect, credentials, testData } from '../../../fixtures/pagesFixtures';

test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Authentication and external registration cases', () => {
  // Krok 1: Wpisz identyfikator otrzymany w wiadomości e-mail.
  // Krok 2: Wpisz hasło otrzymane w wiadomości SMS.
  // Krok 3: Naciśnij Zaloguj się.
  // Krok 4: Wpisz kod SMS i naciśnij Potwierdź.
  // Krok 5: Naciśnij Pomiń dodawanie urządzenia.
  // Krok 6: Ustaw własne hasło i naciśnij Ustaw hasło.
  // Krok 7: Naciśnij Przejdź do strony głównej.
  test('TC001 - Pierwsze logowanie do panelu bez dodawania urządzenia zaufanego', async ({ loginPage }) => {
    test.fixme(true, 'Wymaga nowo utworzonego konta, kodu SMS oraz kontrolowanego hasła jednorazowego; repozytorium nie ma integracji z SMS ani skrzynką e-mail.');
    await loginPage.open();
    await expect(loginPage.identifier).toBeVisible();
    await expect(loginPage.password).toBeVisible();
  });

  // Krok 1: Wpisz identyfikator i hasło aktywnego konta.
  // Krok 2: Naciśnij Zaloguj się.
  // Krok 3: Wpisz kod SMS i naciśnij Potwierdź.
  // Krok 4: Naciśnij Pomiń na ekranie zaufanego urządzenia.
  test('TC002 - Poprawne logowanie bez dodania zaufanego urządzenia', async ({ loginPage }) => {
    test.fixme(true, 'Wymaga kodu SMS i interakcji z ekranem zaufanego urządzenia; środowisko nie udostępnia kontrolowanego kodu.');
    await loginPage.open();
    await expect(loginPage.identifier).toBeVisible();
    await expect(loginPage.password).toBeVisible();
  });

  // Krok 1: Wpisz identyfikator i hasło aktywnego konta.
  // Krok 2: Naciśnij Zaloguj się.
  // Krok 3: Wpisz kod SMS i naciśnij Potwierdź.
  // Krok 4: Naciśnij Dodaj urządzenie.
  // Krok 5: Sprawdź urządzenie na liście zaufanych urządzeń.
  test('TC003 - Dodawanie zaufanego urządzenia', async ({ loginPage }) => {
    test.fixme(true, 'Wymaga kodu SMS, utworzenia urządzenia oraz późniejszej weryfikacji bez ponownego kodu; test zmieniałby współdzielony stan konta.');
    await loginPage.open();
    await expect(loginPage.identifier).toBeVisible();
    await expect(loginPage.password).toBeVisible();
  });

  // Krok 1: Wpisz błędny identyfikator lub hasło.
  // Krok 2: Naciśnij Zaloguj się.
  // Oczekiwany rezultat: komunikat Nieprawidłowy identyfikator lub hasło.
  test('TC004 - Niepoprawne logowanie', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.login(credentials.employer.login, testData.invalid.password);

    await expect(page).toHaveURL(/login\?error=true/);
    await expect(loginPage.errorMessage).toHaveText(testData.messages.invalidLogin);
  });

  // Krok 1: Naciśnij Nie pamiętam hasła.
  // Krok 2: Uzupełnij formularz przypomnienia hasła.
  // Krok 3: Naciśnij Resetuj hasło.
  // Oczekiwany rezultat: komunikat o wysłaniu nowego hasła SMS-em.
  test('TC005 - Przypomnienie hasła', async ({ loginPage }) => {
    test.fixme(true, 'Wymaga kontrolowanego numeru telefonu, wysłania SMS i potwierdzenia treści komunikatu poza aplikacją.');
    await loginPage.open();
    await expect(loginPage.identifier).toBeVisible();
  });

  // Krok 1: Uzupełnij formularz rejestracji z linku zewnętrznego.
  // Krok 2: Naciśnij Akceptuj na ostatnim kroku.
  // Oczekiwany rezultat: umowa ma status Niepotwierdzone w panelu instytucji finansowej.
  test('TC006 - Rejestracja umowy z linku zewnętrznego', async ({ openRegistrationLink }) => {
    test.fixme(true, 'Wymaga danych jednorazowej umowy, wysłania linku do osób obsługujących i sprzątania utworzonej umowy.');
    await openRegistrationLink();
  });

  // Krok 1: Otwórz Umowy z wiadomości e-mail.
  // Krok 2: Przejdź captcha, wyślij SMS i potwierdź kod.
  // Krok 3: Zaakceptuj oświadczenia, ponownie potwierdź SMS i naciśnij Akceptuj.
  // Oczekiwany rezultat: status umowy zmienia się na Do akceptacji IF.
  test('TC007 - Akceptacja umowy z linku zewnętrznego', async () => {
    test.fixme(true, 'Wymaga wiadomości e-mail, captcha, dwóch kodów SMS oraz kontrolowanych osób obsługujących umowę.');
  });
});
