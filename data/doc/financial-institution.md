# Przypadki testowe - panel instytucji finansowej

## 1. Rejestracja umowy

**Warunki wstępne:** Użytkownik jest zalogowany w panelu instytucji finansowej.

**Kroki testowe:**
1. Użytkownik naciska przycisk "Menu".
2. Użytkownik z sekcji "PPK" wybiera opcję "Rejestracja umowy PPK".
3. Użytkownik uzupełnia formularz rejestracyjny.
4. Użytkownik naciska przycisk "Akceptuj" na ostatnim kroku.

**Oczekiwany rezultat:** Nowa umowa PPK zostaje zarejestrowana. Reprezentanci lub pełnomocnicy otrzymują dane dostępu do panelu pracodawcy, a umowa jest widoczna w zakładce "Zaakceptowane".

## 2. Anulowanie umowy oczekującej

**Warunki wstępne:** Użytkownik jest zalogowany w panelu instytucji finansowej. W zakładce "Oczekujące" znajduje się co najmniej jedna umowa. Konto użytkownika ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
2. Użytkownik naciska przycisk "Zmiana" przy dowolnej umowie oczekującej.
3. Użytkownik naciska przycisk "Anuluj".
4. Użytkownik naciska przycisk "Anuluj umowę" w oknie potwierdzenia.

**Oczekiwany rezultat:** Pojawia się komunikat o pomyślnym anulowaniu. Umowa znika z listy oczekujących i pojawia się w zakładce "Anulowane".

## 3. Zweryfikowanie umowy oczekującej

**Warunki wstępne:** Użytkownik jest zalogowany w panelu instytucji finansowej. Umowa ma status "Do akceptacji IF". Konto użytkownika ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
2. Użytkownik naciska przycisk "Zmiana" przy danej umowie.
3. Użytkownik naciska przycisk "Zweryfikuj".
4. Użytkownik naciska przycisk "Zweryfikuj umowę" w oknie potwierdzenia.

**Oczekiwany rezultat:** Pojawia się komunikat o pomyślnej weryfikacji. Umowa otrzymuje status "Zweryfikowane".

## 4. Zaakceptowanie umowy oczekującej

**Warunki wstępne:** Użytkownik jest zalogowany w panelu instytucji finansowej. Umowa ma status "Do akceptacji IF" lub "Zweryfikowane". Konto użytkownika ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
2. Użytkownik naciska przycisk "Zmiana" przy danej umowie.
3. Użytkownik naciska przycisk "Akceptuj".
4. Użytkownik naciska przycisk "Zaakceptuj umowę" w oknie potwierdzenia.

**Oczekiwany rezultat:** Pojawia się komunikat o pomyślnym zaakceptowaniu. Umowa znika z listy oczekujących i pojawia się w zakładce "Zaakceptowane". Reprezentanci otrzymują e-mail z linkiem do umowy i loginem oraz SMS z hasłem jednorazowym.

## 5. Pobieranie umowy z maila

**Warunki wstępne:** Umowa złożona przez link zewnętrzny została zaakceptowana w panelu instytucji finansowej.

**Kroki testowe:**
1. Reprezentant lub pełnomocnik otwiera automatycznie wysłaną wiadomość e-mail.
2. Naciska odnośnik "Pobierz umowę".
3. Przechodzi captcha i naciska "Wyślij SMS" na automatycznie otwartej karcie.
4. Wpisuje otrzymany kod SMS.
5. Naciska "Zatwierdź".
6. Naciska odnośnik pobrania lub podglądu dokumentu.

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku PDF umowy o zarządzanie lub prowadzenie.

## 6. Podgląd informacji o firmie

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa znajduje się w dowolnej zakładce strony głównej. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik naciska kafelek "Panel Instytucji Finansowej".
2. Użytkownik naciska ikonę "+" przy nazwie firmy.

**Oczekiwany rezultat:** Rozwijają się informacje o firmie oraz pięć zakładek informacyjnych.

## 7. Dodanie notatki

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa znajduje się w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej".
2. Naciska ikonę "+" przy nazwie firmy.
3. Naciska pole "Notatka".
4. Wpisuje notatkę.
5. Naciska "Zapisz".

**Oczekiwany rezultat:** Pojawia się komunikat o aktualizacji, a wprowadzony tekst jest widoczny w informacjach o firmie.

## 8. Edycja kodu sprzedawcy

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa jest w zakładce "Oczekujące" lub "Zaakceptowane". Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska "Edytuj" przy polu "Kod sprzedawcy".
3. Wpisuje poprawny kod.
4. Naciska "Zapisz".

**Oczekiwany rezultat:** Pojawia się komunikat o poprawnej aktualizacji, a nowy kod jest widoczny.

## 9. Edycja kodu sprzedawcy - niepoprawny kod

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa jest w zakładce "Oczekujące" lub "Zaakceptowane". Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska "Edytuj" przy polu "Kod sprzedawcy".
3. Wpisuje niepoprawny kod.
4. Naciska "Zapisz".

**Oczekiwany rezultat:** Pojawia się komunikat o nieaktualizowaniu kodu, a wpisany kod nie jest widoczny.

## 10. Edycja opiekuna klienta

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa jest w zakładce "Zaakceptowane". Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska "Edytuj" przy polu "Opiekun klienta".
3. Wybiera osobę z listy.
4. Naciska "Zapisz".

**Oczekiwany rezultat:** Lista zawiera tylko użytkowników z uprawnieniem "Opiekun klienta". Pojawia się komunikat o poprawnym dodaniu opiekuna, a w panelu pracodawcy są widoczne jego zdjęcie i dane kontaktowe.

## 11. Zmiana danych firmy

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa znajduje się w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska kafelek "Dane firmy".
3. Naciska "Zmień dane".
4. Aktualizuje formularz i naciska "Dalej".
5. Naciska "Zatwierdź zmiany".
6. Naciska "Tak" w oknie dialogowym.

**Oczekiwany rezultat:** Pojawia się informacja o poprawnej zmianie danych oraz przycisk powrotu do listy umów oczekujących.

## 12. Ponowne wysłanie linku do akceptacji umowy

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa jest w zakładce "Oczekujące" i ma status "Niepotwierdzone". Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska kafelek "Reprezentanci/Pełnomocnicy".
3. Naciska "Wyślij" przy reprezentancie.
4. Naciska "Wyślij" w oknie dialogowym.

**Oczekiwany rezultat:** Pojawia się informacja o poprawnej wysyłce maila z linkiem do akceptacji.

## 13. Pobieranie dokumentów

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa jest w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska kafelek "Dokumenty".
3. Naciska nazwę dokumentu.

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku.

## 14. Dodawanie dokumentów

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa jest w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska kafelek "Dokumenty".
3. Naciska pole dodawania pliku i wybiera plik.
4. Wybiera typ dokumentu.
5. Naciska "Prześlij plik".

**Oczekiwany rezultat:** Plik pojawia się w zakładce "Dokumenty".

## 15. Podgląd historii zdarzeń

**Warunki wstępne:** Użytkownik jest zalogowany. Umowa jest w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" i rozwija firmę.
2. Naciska kafelek "Zdarzenia".

**Oczekiwany rezultat:** Historia zdarzeń firmy pojawia się w formie osi czasu.

## 16. Wyszukiwanie firmy z listy

**Warunki wstępne:** Użytkownik jest zalogowany. Wybrana zakładka zawiera umowy. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej".
2. Wybiera zakładkę do wyszukiwania.
3. Wpisuje wartości w polu "Szukaj".

**Oczekiwany rezultat:** Na liście pozostają firmy spełniające kryteria nazwy, KRS, kodu promotora, REGON-u, NIP-u lub daty rejestracji.

## 17. Dodawanie użytkownika do panelu instytucji finansowej

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej".
2. Otwiera "Menu" i z sekcji "Uprawnienia" wybiera "Użytkownicy".
3. Naciska "Dodaj użytkownika".
4. Uzupełnia formularz danymi i uprawnieniami.
5. Naciska "Zapisz użytkownika".

**Oczekiwany rezultat:** Użytkownik wraca do listy. Pojawia się komunikat o dodaniu użytkownika, a dane logowania zostają wysłane.

## 18. Edycja użytkownika panelu instytucji finansowej

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
2. Naciska "Edytuj" przy użytkowniku.
3. Aktualizuje dane i uprawnienia.
4. Naciska "Zapisz użytkownika".

**Oczekiwany rezultat:** Użytkownik wraca do listy, a nad nią pojawia się komunikat o poprawnej edycji.

## 19. Zmiana hasła użytkownika panelu instytucji finansowej

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
2. Naciska "Zmień hasło" przy użytkowniku.
3. Naciska "WYGENERUJ I WYŚLIJ HASŁO".

**Oczekiwany rezultat:** Użytkownik wraca do listy, pojawia się komunikat o resecie hasła, a nowe hasło zostaje wysłane.

## 20. Usuwanie użytkownika z panelu instytucji finansowej

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
2. Naciska "Usuń" przy użytkowniku.
3. Naciska "Usuń użytkownika".

**Oczekiwany rezultat:** Użytkownik wraca do listy, a nad nią pojawia się komunikat o usunięciu.

## 21. Odblokowanie dostępu użytkownikowi z zablokowanym kontem

**Warunki wstępne:** Istnieje co najmniej dwóch użytkowników. Jeden ma zablokowane konto, a zalogowany użytkownik ma uprawnienia administracyjne.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Użytkownicy".
2. Naciska "Odblokuj dostęp" przy zablokowanym użytkowniku.
3. Naciska "Odblokuj użytkownika".

**Oczekiwany rezultat:** Użytkownik wraca do listy, a nad nią pojawia się komunikat o odblokowaniu dostępu.

## 22. Tworzenie nowej grupy uprawnień

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Grupy uprawnień".
2. Naciska "Utwórz nową grupę uprawnień".
3. Wybiera uprawnienia i nadaje grupie nazwę.
4. Naciska "Zapisz grupę uprawnień".

**Oczekiwany rezultat:** Użytkownik wraca do listy uprawnień, a nad nią pojawia się komunikat o dodaniu grupy.

## 23. Edycja grupy uprawnień

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Grupy uprawnień".
2. Naciska "Edytuj" przy grupie.
3. Modyfikuje grupę.
4. Naciska "Zapisz grupę uprawnień".

**Oczekiwany rezultat:** Pojawia się komunikat o poprawnej edycji, a uprawnienia użytkowników przypisanych do grupy zostają zaktualizowane.

## 24. Usuwanie grupy uprawnień

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu" i "Grupy uprawnień".
2. Naciska "Usuń" przy grupie.
3. Naciska "Usuń grupę uprawnień".

**Oczekiwany rezultat:** Grupa zostaje usunięta, a nad listą pojawia się komunikat. Należy zweryfikować status użytkowników, którzy mieli przypisaną tę grupę.

## 25. Podgląd listy uczestników

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej".
2. Z "Menu" i sekcji "PPK" wybiera "Lista uczestników".
3. Naciska "Więcej".
4. Uzupełnia filtry.
5. Naciska "Wyszukaj".

**Oczekiwany rezultat:** Pojawia się lista uczestników spełniających kryteria wyszukiwania.

## 26. Pobranie raportu umów PPK

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej", "Menu", sekcję "PPK" i "Raporty".
2. W polu "Nazwa raportu" wybiera "Umowy PPK".
3. Wybiera zakres dat.
4. Naciska "Generuj raport".

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku, a zakres dat w pliku odpowiada ustawieniom strony.

## 27. Pobranie raportu użytkowników serwisu PPK

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Raporty".
2. W polu "Nazwa raportu" wybiera "Użytkownicy serwisu PPK".
3. Naciska "Generuj raport".

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku.

## 28. Pobranie raportu z informacją o linkach

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Raporty".
2. W polu "Nazwa raportu" wybiera "Raport z informacją o linkach".
3. Naciska "Generuj raport".

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku.

## 29. Pobranie raportu firm przesyłających korekty

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Raporty".
2. W polu "Nazwa raportu" wybiera "Raport firm przesyłających korekty".
3. Wybiera zakres dat.
4. Naciska "Generuj raport".

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku, a zakres dat w pliku odpowiada ustawieniom strony.

## 30. Pobranie raportu z rozliczenia składek

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik przechodzi do "Panel Instytucji Finansowej" > "Menu" > "Raporty".
2. W polu "Nazwa raportu" wybiera "Umowy z rozliczania składek".
3. Wybiera zakres dat.
4. Podaje nazwę lub REGON pracodawcy.
5. Wybiera pracodawcę z przefiltrowanej listy.
6. Naciska "Generuj raport".

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku, a zakres dat w pliku odpowiada ustawieniom strony.

## 31. Podgląd informacji i dokumentów

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej".
2. Z "Menu" i sekcji "PPK" wybiera "Informacje i dokumenty".
3. Naciska dowolny odnośnik.

**Oczekiwany rezultat:** W nowej karcie otwiera się dokument zgodny z nazwą odnośnika.

## 32. Zaakceptowanie oczekującego zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście jest co najmniej jedno oczekujące zlecenie. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Naciska "Zmiana".
3. Wybiera "Akceptuj" z listy.
4. Naciska "Akceptuj" w oknie dialogowym.

**Oczekiwany rezultat:** Pojawia się komunikat o zaakceptowaniu zlecenia. Zlecenie znika z "Oczekujące" i przechodzi do "Zaakceptowane". Należy zweryfikować wysłanie uczestnikowi maila.

## 33. Odrzucenie oczekującego zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście jest co najmniej jedno oczekujące zlecenie. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Naciska "Zmiana" i wybiera "Odrzuć".
3. Wpisuje powód odrzucenia.
4. Naciska "Odrzuć zlecenie" w oknie dialogowym.

**Oczekiwany rezultat:** Pojawia się komunikat o odrzuceniu. Zlecenie przechodzi z "Oczekujące" do "Odrzucone", a uczestnik otrzymuje maila.

## 34. Wyjaśnienie oczekującego zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście jest co najmniej jedno oczekujące zlecenie. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Naciska "Zmiana" i wybiera "Wyjaśnij".
3. Wpisuje powód wyjaśnienia.
4. Naciska "Wyjaśnij zlecenie" w oknie dialogowym.

**Oczekiwany rezultat:** Pojawia się komunikat o przekazaniu zlecenia do wyjaśnienia. Zlecenie pozostaje w "Oczekujące", a uczestnik otrzymuje maila.

## 35. Dodanie notatki do zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście jest zlecenie w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Naciska ikonę w kolumnie "Notatka".
3. Wpisuje treść notatki.
4. Naciska "Zapisz" w oknie dialogowym.
5. Ponownie otwiera notatkę przy tym samym zleceniu.

**Oczekiwany rezultat:** Notatka jest zapisana i widoczna po ponownym otwarciu, również po zmianie statusu zlecenia i przeniesieniu go do innej zakładki.

## 36. Podgląd dokumentu dołączonego do zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście jest zlecenie w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Naciska ikonę w kolumnie "Dokumenty".
3. Otwiera załącznik z listy dokumentów.

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku.

## 37. Dodanie dodatkowego dokumentu do zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście jest zlecenie w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Naciska ikonę w kolumnie "Dokumenty".
3. Naciska pole przekazywania pliku.
4. Wybiera plik.

**Oczekiwany rezultat:** Plik zostaje dodany do listy dokumentów w oknie dialogowym.

## 38. Pobranie potwierdzenia zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście jest zlecenie w dowolnej zakładce. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Naciska ikonę w kolumnie "Zlecenie".

**Oczekiwany rezultat:** Rozpoczyna się pobieranie pliku.

## 39. Podgląd powodu odrzucenia zlecenia

**Warunki wstępne:** Użytkownik jest zalogowany. Na liście "Odrzucone" jest co najmniej jedno zlecenie. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "PPK" > "Zlecenia do akceptacji".
2. Przechodzi do zakładki "Odrzucone".
3. Naciska ikonę w kolumnie "Powód odrzucenia".

**Oczekiwany rezultat:** Otwiera się okno z wcześniej wpisanym powodem odrzucenia.

## 40. Wypowiedzenie umowy o zarządzanie

**Warunki wstępne:** Użytkownik jest zalogowany. Zarejestrowana jest co najmniej jedna umowa. Konto ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Wypowiedzenie UoZ".
2. Uzupełnia filtry i naciska "Wyszukaj".
3. Wybiera firmę z listy.
4. Uzupełnia formularz wypowiedzenia.
5. Naciska "Zatwierdź wypowiedzenie".
6. Naciska "Tak" w oknie dialogowym.

**Oczekiwany rezultat:** Pojawia się komunikat o pomyślnym wypowiedzeniu UoZ, a odpowiednie osoby otrzymują wiadomość e-mail.

## 41. Zmiana hasła

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Ustawienia" > "Zmiana hasła".
2. Uzupełnia formularz.
3. Naciska "Zmień hasło".

**Oczekiwany rezultat:** Pojawia się komunikat o pomyślnej zmianie hasła oraz przycisk przejścia do strony głównej.

## 42. Próba zmiany hasła bez spełnionych wymagań bezpieczeństwa

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Ustawienia" > "Zmiana hasła".
2. Wpisuje hasło niespełniające wymagań bezpieczeństwa.

**Oczekiwany rezultat:** Pole "Nowe hasło" jest podświetlone na czerwono, a przycisk "Zmień hasło" pozostaje nieaktywny.

## 43. Usuwanie urządzenia z zaufanych

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik otwiera "Panel Instytucji Finansowej" > "Menu" > "Ustawienia" > "Zaufane urządzenia".
2. Naciska "Usuń" obok urządzenia.
3. Naciska "Usuń urządzenie".

**Oczekiwany rezultat:** Urządzenie zostaje usunięte z listy zaufanych urządzeń.

## 44. Wysyłka formularza kontaktowego

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik z sekcji "Kontakt" wybiera "Formularz kontaktowy".
2. Uzupełnia formularz.
3. Przechodzi captcha i naciska "Wyślij pytanie".

**Oczekiwany rezultat:** Nad formularzem pojawia się komunikat o pomyślnej wysyłce. Użytkownik otrzymuje wiadomość e-mail z potwierdzeniem.

## 45. Podgląd pracodawców

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik naciska kafelek "Podgląd Pracodawców".
2. Uzupełnia filtry w rozwiniętej wyszukiwarce.
3. Naciska "Wyszukaj".

**Oczekiwany rezultat:** Pojawia się lista pracodawców spełniających kryteria. Gdy brak wyników, pojawia się komunikat "Brak danych".

## 46. Wejście do panelu pracodawcy

**Warunki wstępne:** Użytkownik jest zalogowany i ma odpowiednie uprawnienia.

**Kroki testowe:**
1. Użytkownik naciska kafelek "Podgląd Pracodawców".
2. Uzupełnia filtry i naciska "Wyszukaj".
3. Naciska element listy odpowiadający wyszukiwanemu pracodawcy.

**Oczekiwany rezultat:** Otwiera się menu pracodawcy w trybie tylko do odczytu. Użytkownik nie ma dostępu do listy użytkowników ani możliwości składania dyspozycji w imieniu pracodawcy.

## 47. Wylogowanie z panelu instytucji finansowej

**Warunki wstępne:** Użytkownik jest zalogowany w panelu instytucji finansowej.

**Kroki testowe:**
1. Użytkownik naciska przycisk "Wyloguj" w prawym górnym rogu.

**Oczekiwany rezultat:** Następuje powrót do strony logowania, gdzie pojawia się komunikat "Zostałeś prawidłowo wylogowany".
