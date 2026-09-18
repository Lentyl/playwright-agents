# Plan testów — N-Portal PPK dla firm (ppk-nnpte2)

**Bazowy URL:** `https://test.moventum.com.pl/ppk-nnpte2/nnpte/login`  
**Środowisko:** TEST (`test.moventum.com.pl`)  
**Data:** 2026-09-09  
**Zbadane konto:**
- `curka_employer` — konto pracodawcy („Panel pracodawcy”) dla podmiotu „INTERFOOD-IDEA” SP. Z O.O.

Zakres uzgodniony z osobą zgłaszającą: zbadanie wyłącznie aplikacji dostępnej pod skonfigurowanym `baseURL`, przejście przez wszystkie ekrany i funkcje dostępne dla powyższego konta pracodawcy oraz przygotowanie planu regresji gotowego do automatyzacji.

---

## 1. Przegląd aplikacji

N-Portal PPK dla firm jest portalem pracodawcy do zarządzania Pracowniczymi Planami Kapitałowymi (PPK). Plan obejmuje wyłącznie aplikację skonfigurowaną przez `use.baseURL` w [playwright.config.ts](../playwright.config.ts): `https://test.moventum.com.pl/ppk-nnpte2/nnpte/login`.

Portal pracodawcy (`curka_employer`) udostępnia: zarządzanie uczestnikami, masowe zgłoszenia i przekazywanie wpłat z plików, indywidualne kreatory „Dyspozycji”, raporty, pobieranie plików zwrotnych, dane umowy i dokumentów oraz administrację kontem (użytkownicy, wspólne logowanie, hasło i zaufane urządzenia).

---

## 2. Rejestr stron

| Nr | Strona (etykieta menu) | URL | Rola | Uwagi |
|---|---|---|---|---|
| 1 | Logowanie | `/ppk-nnpte2/nnpte/login` | Publiczna | Identyfikator + Hasło |
| 2 | Panel pracodawcy | `/ppk-nnpte2/nnpte/employer` | Pracodawca | Siatka kart |
| 3 | Menu | brak (nakładka JavaScript na każdej stronie) | Pracodawca | Mapa serwisu |
| 4 | Lista użytkowników | `/ppk-nnpte2/nnpte/employer/admin` | Pracodawca | Tabela administracyjna |
| 5 | Dodaj użytkownika | `/ppk-nnpte2/nnpte/employer/admin/users/edit/new` | Pracodawca | Nie wypełniać ani nie wysyłać (zmienia stan) |
| 6 | Przekazanie plików | `/ppk-nnpte2/nnpte/employer/fileUpload` | Pracodawca | Przesyłanie + historia |
| 7 | Podgląd Uczestników | `/ppk-nnpte2/nnpte/employer/customer/list` | Pracodawca | Filtry + tabela |
| 8 | Raporty | `/ppk-nnpte2/nnpte/employer/report` | Pracodawca | Lista wyboru → `Generuj raport` |
| 9 | Dokumenty | `/ppk-nnpte2/nnpte/documents` | Pracodawca | Statyczne linki pobierania |
| 10 | Dane dotyczące umowy i wpłat do PPK | `/ppk-nnpte2/nnpte/employer/data` | Pracodawca | Tylko odczyt |
| 11 | Wspólne logowanie | `/ppk-nnpte2/nnpte/employer/relatedUsers` | Pracodawca | Tabela powiązanych logowań |
| 12 | Zmiana hasła | `/ppk-nnpte2/nnpte/passwordChange` | Pracodawca | Formularz zasad hasła |
| 13 | Zaufane urządzenia | `/ppk-nnpte2/nnpte/trusted-devices` | Pracodawca | Tabela urządzeń |
| 14 | Pliki zwrotne od Nationale-Nederlanden | `/ppk-nnpte2/nnpte/employer/documentsReport/` | Pracodawca | 7 kart raportów; występuje błąd JS (KI-2) |
| 15 | Zgłoszenie pracownika | `/ppk-nnpte2/nnpte/employer/registration?mode=init` | Pracodawca | Kreator wieloetapowy, w pełni zmapowany krok 1 |
| 16 | Zgłoszenie wpłat | `/ppk-nnpte2/nnpte/employer/contributions?mode=init` | Pracodawca | Dostępne |
| 17 | Zgłoszenie korekt do wpłat | `/ppk-nnpte2/nnpte/employer/corrections?mode=init` | Pracodawca | Dostępne |
| 18 | Rezygnacja z odprowadzania wpłat | `/ppk-nnpte2/nnpte/employer/contributioncancel/` | Pracodawca | **HTTP 403 „Brak dostępu!”** (KI-5) |
| 19 | Wznowienie odprowadzania wpłat | `/ppk-nnpte2/nnpte/employer/contributionrenewal` | Pracodawca | Dostępne |
| 20 | Zmiana wysokości wpłaty podstawowej Pracownika | `/ppk-nnpte2/nnpte/employer/contribution/primary` | Pracodawca | Dostępne |
| 21 | Deklaracja wpłaty dodatkowej Pracownika | `/ppk-nnpte2/nnpte/employer/contribution/secondary` | Pracodawca | Dostępne |
| 22 | Zmiana danych | `/ppk-nnpte2/nnpte/employer/dataChange` | Pracodawca | Dostępne |
| 23 | Wypłata transferowa do Nationale-Nederlanden | `/ppk-nnpte2/nnpte/employer/transfer` | Pracodawca | Dostępne |
| 24 | Zakończenie lub wznowienie zatrudnienia | `/ppk-nnpte2/nnpte/employer/employmentChange` | Pracodawca | Dostępne |
| 25 | Dyspozycje (link w okruszkach nawigacji) | `/ppk-nnpte2/nnpte/employer/dashboard?orders=1` | Pracodawca | Uszkodzona ścieżka → Whitelabel Error Page nawet w świeżej sesji (KI-6) |
| 26 | Bezpieczeństwo / Polityka cookies / Kontakt / Regulamin | linki w stopce | Publiczna | Statyczne strony prawne, obecne na każdym ekranie |
| 27 | Panel Instytucji Finansowej | `/ppk-nnpte2/nnpte/manager/login/fork` | Instytucja Finansowa | Nie zaobserwowano SMS OTP; dwie karty startowe |

---

## 3. Dane testowe

| ID | Opis | Wartość |
|----|------|---------|
| U1 | Poprawny login pracodawcy | `curka_employer` |
| P1 | Poprawne hasło pracodawcy | `Start.123` |
| INV1 | Niepoprawne hasło U1 | `WrongPassword1` |
| INV2 | Puste dane logowania | `""` / `""` |
| ERR1 | Oczekiwany komunikat błędu logowania | `Nieprawidłowy identyfikator lub hasło` |
| ERR2 | Oczekiwana flaga w adresie | `?error=true` |
| MSG1 | Oczekiwane potwierdzenie wylogowania | `Zostałeś prawidłowo wylogowany` |
| PW1 | Nowe hasło poprawne | `Nn2026!Secure` |
| PW2 | Zbyt krótkie (11 znaków) | `Nn2026!Secu` |
| PW3 | Zbyt długie (21 znaków) | `Nn2026!SecureExtra11` |
| PW4 | Brak znaku specjalnego | `Nn20261234567` |
| PW5 | Brak wymaganej liczby cyfr | `NnSecure!Pass2` |
| PW6 | Brak wielkiej litery | `nn2026!secure` |
| PW7 | Co najmniej 3 identyczne znaki z rzędu | `Nn2026!!!Secure` |
| PW8 | Niezgodne potwierdzenie | `PW1` w „Nowe hasło”, `PW2` w „Powtórz hasło” |
| PESEL1 | PESEL poprawnego formatu (11 cyfr) | `44051401359` |
| PESEL2 | Za krótki (10 cyfr) | `4405140135` |
| PESEL3 | Za długi (12 cyfr) | `440514013599` |
| PESEL4 | Niealfanumeryczny | `4405140135A` |
| DATE1 | Poprawna data urodzenia | `1990-05-01` |
| DATE2 | Data przyszła (niepoprawna) | `2099-01-01` |
| DATE3 | Data w niepoprawnym formacie | `01-05-1990` |
| EMAIL1 | Poprawny adres e-mail | `jan.kowalski@example.com` |
| EMAIL2 | Brak `@` | `jan.kowalskiexample.com` |
| EMAIL3 | Brak domeny | `jan.kowalski@` |
| PHONE1 | Poprawny polski telefon komórkowy | `500600700` |
| REPORT1..5 | Nazwy raportów na liście `Nazwa raportu` | `Raport Uczestników`, `Raport z rozliczenia skladek`, `Raport z historii zleceń Uczestników`, `Raport z historii wpłat Uczestników`, `Raport uczestnictwa w funduszach` |

> Nie zapisuj haseł w postaci jawnej w nowych plikach testowych. Odczytuj je ze zmiennych środowiskowych `PPK_EMPLOYER_LOGIN` i `PPK_EMPLOYER_PASSWORD`.

---

## 4. TC-AUTH — Logowanie, wylogowanie i sesja

### TC-AUTH-001 — Poprawne logowanie pracodawcy
**Priorytet:** P1 — Krytyczny  
**Warunki wstępne:** Użytkownik wylogowany, przeglądarka na `/ppk-nnpte2/nnpte/login`.

| Nr | Krok | Oczekiwany rezultat |
|---|------|---------------------|
| 1 | Wpisz `curka_employer` w „Identyfikator” (U1) | Wartość zostaje wpisana |
| 2 | Wpisz `Start.123` w „Hasło” (P1) | Wartość zostaje wpisana i jest ukryta |
| 3 | Kliknij „Zaloguj się” | Przekierowanie do `/ppk-nnpte2/nnpte/employer`, tytuł strony „Panel pracodawcy” |
| 4 | Sprawdź nazwę firmy | Nagłówek zawiera `"INTERFOOD-IDEA" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ` |

### TC-AUTH-002 — Niepoprawne hasło pokazuje błąd i nie uwierzytelnia
**Priorytet:** P1 — Krytyczny

| Nr | Krok | Oczekiwany rezultat |
|---|------|---------------------|
| 1 | Wpisz `curka_employer` (U1) | Wartość zostaje wpisana |
| 2 | Wpisz `WrongPassword1` (INV1) | Wartość zostaje wpisana |
| 3 | Kliknij „Zaloguj się” | URL zmienia się na `...login?error=true` (ERR2) |
| 4 | Sprawdź komunikat | Widoczny jest `Nieprawidłowy identyfikator lub hasło` (ERR1) |

### TC-AUTH-003 — Wysłanie pustego formularza logowania
**Priorytet:** P2 — Wysoki  
**Typ:** Graniczny / negatywny

| Nr | Krok | Oczekiwany rezultat |
|---|------|---------------------|
| 1 | Pozostaw pola „Identyfikator” i „Hasło” puste | — |
| 2 | Kliknij „Zaloguj się” | Walidacja klienta lub serwera blokuje wysłanie albo pokazuje ten sam błąd; strona nie przechodzi do `/employer` |

### TC-AUTH-006 — Wylogowanie
**Priorytet:** P1 — Krytyczny  
**Warunek wstępny:** Uwierzytelnienie jako U1/P1.

| Nr | Krok | Oczekiwany rezultat |
|---|------|---------------------|
| 1 | Kliknij „Wyloguj” | Przekierowanie do `...login?logout` |
| 2 | Sprawdź potwierdzenie | Widoczny jest komunikat `Zostałeś prawidłowo wylogowany` (MSG1) |
| 3 | Przejdź bezpośrednio do `/ppk-nnpte2/nnpte/employer` | Przekierowanie do logowania, bez widoku panelu |

### TC-AUTH-007 — Wejście na `/login` podczas aktywnej sesji (defekt KI-1)
**Priorytet:** P3 — Średni  
**Typ:** Negatywny / potwierdzenie defektu

| Nr | Krok | Oczekiwany rezultat |
|---|------|---------------------|
| 1 | Podczas aktywnej sesji przejdź do `/ppk-nnpte2/nnpte/login` | **Aktualnie:** jednocześnie renderowany jest uwierzytelniony nagłówek („Menu”/„Wyloguj”) i publiczny formularz logowania. **Oczekiwane:** przekierowanie do `/employer`. |

### TC-AUTH-008 — Wygaśnięcie sesji podczas nawigacji (defekt KI-3)
**Priorytet:** P2 — Wysoki  
**Typ:** Negatywny / odzyskiwanie

| Nr | Krok | Oczekiwany rezultat |
|---|------|---------------------|
| 1 | Zaloguj się jako U1/P1 i czekaj, aż licznik „Koniec sesji za” dojdzie do zera | Sesja wygasa |
| 2 | Przejdź do chronionego URL, np. `/employer/customer/list` | **Oczekiwane:** spójne przekierowanie do logowania z komunikatem o wygaśnięciu. **Obecnie:** zależnie od ścieżki pojawia się „Brak dostępu!” albo nieostylowana strona Spring „Whitelabel Error Page” (`type=null, status=null`). Zapisz wynik dla każdej ścieżki. |

---

## 5. TC-NAV — Nawigacja i kontrola dostępu

### TC-NAV-001 — Panel pokazuje wszystkie oczekiwane karty
**Priorytet:** P1 — Krytyczny  
**Warunek wstępny:** U1/P1, `/employer`.

Sprawdź widoczność kart: „Przekazanie plików”, „Dyspozycje”, „Podgląd Uczestników”, „Raporty”, „Pliki zwrotne od Nationale-Nederlanden”, „Dokumenty”, „Materiały informacyjne”, „Dane dotyczące umowy i wpłat do PPK”, „Uprawnienia” oraz „Szkolenia”.

### TC-NAV-002 — Rozwinięte „Menu” zawiera wszystkie sekcje
**Priorytet:** P2 — Wysoki

Po kliknięciu „Menu” sprawdź sekcje „Panel administracyjny”, „PPK”, „Ustawienia” i „Dyspozycje”. Zweryfikuj odpowiednio linki: „Lista użytkowników”; „Przekazanie plików”, „Podgląd Uczestników”, „Raporty”, „Dokumenty”; „Dane dotyczące umowy i wpłat do PPK”, „Wspólne logowanie”, „Zmiana hasła”, „Zaufane urządzenia”; oraz wszystkie 10 pozycji Dyspozycji: „Zgłoszenie pracownika”, „Zgłoszenie wpłat”, „Zgłoszenie korekt do wpłat”, „Rezygnacja z odprowadzania wpłat”, „Wznowienie odprowadzania wpłat”, „Zmiana wysokości wpłaty podstawowej Pracownika”, „Deklaracja wpłaty dodatkowej Pracownika”, „Zmiana danych”, „Wypłata transferowa do Nationale-Nederlanden”, „Zakończenie lub wznowienie zatrudnienia”.

### TC-NAV-003 — Macierz kontroli dostępu dla punktów wejścia Dyspozycji
**Priorytet:** P1 — Krytyczny  
**Typ:** Bezpieczeństwo / autoryzacja  
**Warunek wstępny:** Świeża sesja U1/P1.

| Nr | URL | Oczekiwany rezultat |
|---|-----|---------------------|
| 1 | `/employer/registration?mode=init` | Strona ładuje się, nagłówek „Zgłoszenie pracownika” |
| 2 | `/employer/contributions?mode=init` | Strona ładuje się, nagłówek „Zgłoszenie wpłat” |
| 3 | `/employer/corrections?mode=init` | Strona ładuje się, nagłówek „Zgłoszenie korekt do wpłat” |
| 4 | `/employer/contributioncancel/` | **HTTP 403**, tytuł „Błąd”, nagłówek „Brak dostępu!” |
| 5 | `/employer/contributionrenewal` | Strona ładuje się, nagłówek „Wznowienie odprowadzania wpłat” |
| 6 | `/employer/contribution/primary` | Strona ładuje się, nagłówek „Zmiana wysokości wpłaty podstawowej Pracownika” |
| 7 | `/employer/contribution/secondary` | Strona ładuje się, nagłówek „Deklaracja wpłaty dodatkowej Pracownika” |
| 8 | `/employer/dataChange` | Strona ładuje się, nagłówek „Zmiana danych” |
| 9 | `/employer/transfer` | Strona ładuje się, nagłówek „Wypłata transferowa do Nationale-Nederlanden” |
| 10 | `/employer/employmentChange` | Strona ładuje się, nagłówek „Zakończenie lub wznowienie zatrudnienia” |

Jedyny rzeczywisty błąd 403 dotyczy rezygnacji z odprowadzania wpłat. Należy ustalić z właścicielem produktu, czy link dla kont bez tego uprawnienia powinien być ukryty lub wyłączony, ponieważ obecnie jest reklamowany, a następnie blokowany (KI-5).

### TC-NAV-004 — Uszkodzony link „Dyspozycje” w okruszkach nawigacji
**Priorytet:** P2 — Wysoki  
**Typ:** Potwierdzenie błędu

Z kreatora „Zgłoszenie pracownika” kliknij link „Dyspozycje” (`/employer/dashboard?orders=1`). Oczekiwany jest ekran przeglądu dyspozycji; aktualnie (KI-6) pojawia się nieostylowana strona Spring „Whitelabel Error Page” (`This application has no explicit mapping for /error`). Powtórz w świeżej sesji, aby wykluczyć KI-3.

---

## 6. TC-LIST — Tabele, filtry, sortowanie i paginacja

### TC-LIST-001 — Domyślne filtry „Podgląd Uczestników"
**Priorytet:** P2 — Wysoki

Na `/employer/customer/list` sprawdź, czy „Rezygnacja” = `Wszystkie`, „Zatrudniony” = `TAK`, kolumny to: Imię, Nazwisko, PESEL, Numer kadrowy, Dokument, Adres email, Numer Telefonu, Rezygnacja, Zatrudniony, Wypłata po 60 r., Zlecenie, a tekst `Pozycji X z Y dostępnych` odpowiada liczbie wyników.

### TC-LIST-002 — Filtrowanie po imieniu, nazwisku i PESEL
**Priorytet:** P2 — Wysoki

Wpisz nieistniejące imię, np. `Zzzznieistniejacy`, kliknij „Wyszukaj” i sprawdź `Pozycji 0 z 0 dostępnych`. Następnie wyczyść imię, ustaw „Zatrudniony” = `Wszystkie`, kliknij „Wyszukaj” i potwierdź odświeżenie wyników.

### TC-LIST-003 — Sortowalne nagłówki kolumn
**Priorytet:** P3 — Średni

Kliknij przycisk sortowania kolumny „Imię”. Tabela powinna zmienić kolejność (ewentualnie po „Wczytywanie...”); drugie kliknięcie powinno przełączyć kierunek sortowania.

### TC-LIST-004 — Selektor liczby pozycji
**Priorytet:** P3 — Średni

Zmień „Pokaż pozycji” z `10` na `25`. Tabela powinna pokazywać do 25 wierszy, a kontrolka paginacji powinna się zaktualizować.

### TC-LIST-005 — Historia przesłanych plików
**Priorytet:** P2 — Wysoki

Na `/employer/fileUpload` sprawdź kolumny: Lp, Nazwa pliku, Osoba przesyłająca plik, Data przesłania pliku, Plik źródłowy, Akcje. Wypełnij filtr nazwy istniejącym fragmentem i kliknij „Wyszukaj”; następnie ustaw daty OD/DO z użyciem DATE1 i późniejszej daty. Kliknięcie linku pobierania powinno rozpocząć pobieranie z `/historyFileUpload/download/fileId/{id}`.

### TC-LIST-006 — Tabela „Lista użytkowników”
**Priorytet:** P2 — Wysoki

Na `/employer/admin` sprawdź kolumny: Id, Nazwa użytkownika, Login, Adres e-mail, Aktywny, Data ostatniego logowania; status paginacji `Pozycji od 1 do 10 z 12 łącznie` (dostosuj do aktualnej liczby); przejście „Next” ładuje drugą stronę; pole „Szukaj:” filtruje do bieżącego loginu `curka_employer`.

---

## 7. TC-FORM — Kreatory wprowadzania danych

### TC-FORM-001 — „Zgłoszenie pracownika”: wymagane pola, krok 1
**Priorytet:** P1 — Krytyczny

Na `/employer/registration?mode=init` sprawdź pola sekcji „Dane uczestnika”: Imię, Drugie imię, Nazwisko, PESEL, Data urodzenia (RRRR-MM-DD), Obywatelstwo (domyślnie `Polska`), Płeć, Rodzaj dokumentu, Numer dokumentu, Numer kadrowy, Email, Telefon. Sprawdź także pola „Adres zamieszkania”: Ulica, Nr domu, Nr mieszkania, Miejscowość, Kod pocztowy, Państwo; przełącznik adresu korespondencyjnego „Tak”/„Nie”; pola „Rejestracja”: Data obowiązku (RRRR-MM), Data zatrudnienia (RRRR-MM-DD), Procent składki dodatkowej pracodawcy, Opis składki dodatkowej pracodawcy; oraz obecność przycisku „Dalej”.

### TC-FORM-002 — Wartości graniczne PESEL
**Priorytet:** P2 — Wysoki  
**Typ:** Graniczny

| Wartość | Oczekiwany rezultat |
|---|---|
| `4405140135` (PESEL2) | Błąd walidacji, wymagane 11 cyfr |
| `44051401359` (PESEL1) | Wartość zaakceptowana, brak błędu długości |
| `440514013599` (PESEL3) | Błąd walidacji, wartość za długa |
| `4405140135A` (PESEL4) | Błąd walidacji, dozwolone tylko cyfry |

### TC-FORM-003 — Graniczne wartości i format daty urodzenia
**Priorytet:** P3 — Średni

`1990-05-01` powinno być zaakceptowane; `2099-01-01` powinno dać błąd daty przyszłej; `01-05-1990` powinno dać błąd formatu, ponieważ wymagane jest `RRRR-MM-DD`.

### TC-FORM-004 — Walidacja formatu e-mail i telefonu
**Priorytet:** P3 — Średni

`jan.kowalskiexample.com` powinno dać błąd; `jan.kowalski@example.com` powinno być zaakceptowane; po pozostawieniu telefonu pustego i kliknięciu „Dalej” zapisz, czy telefon jest wymagany w tym przepływie.

### TC-FORM-005 — Walidacja wymaganych pól przy pustym wysłaniu
**Priorytet:** P1 — Krytyczny

Kliknij „Dalej” przy pustych danych uczestnika. Powinny pojawić się błędy co najmniej dla Imienia, Nazwiska, PESEL i Daty urodzenia, a kreator nie powinien przejść do kroku 2.

### TC-FORM-006..014 — Pozostałe kreatory Dyspozycji
**Priorytet:** P2 — Wysoki
**Typ:** Ścieżki pozytywne, negatywne, graniczne i odzyskanie
**Warunki wstępne:** Świeża sesja uwierzytelniona. Dane jednorazowego uczestnika i danych płacowych są dostępne dla każdej końcowej operacji zapisu.

Poniższe pozycje są odrębnymi przypadkami, a nie testami smoke. Dla każdej widocznej kontrolki należy zastosować pełne pokrycie opisane poniżej.

| ID testu | Kreator | URL | Potwierdzone elementy ekranu wejściowego | Ścieżka pozytywna | Ścieżki negatywne, graniczne i odzyskanie | Sprzątanie |
|---|---|---|---|---|---|---|
| TC-FORM-006 | Zgłoszenie wpłat | `/employer/contributions?mode=init` | Nagłówek; `Wpłata za okres (RRRR-MM)`; nagłówki tabeli wpłat; `Dodaj kolejną wpłatę`; `Dalej` | Wybierz poprawny okres, dodaj wpłatę uczestnika jednorazowego, przejdź potwierdzenie i sprawdź wpis historii. | Sprawdź pusty, błędny, przeszły, przyszły i niedostępny okres oraz granice wszystkich pól liczbowych wpłat; popraw każdą błędną wartość i przejdź dalej. | Usuń lub odwróć wpłatę jednorazową. |
| TC-FORM-007 | Zgłoszenie korekt do wpłat | `/employer/corrections?mode=init` | Nagłówek, breadcrumbs, pierwsza grupa pól, tabela i wszystkie akcje | Wybierz uczestnika jednorazowego oraz poprawny okres źródłowy; wykonaj dozwoloną korektę i sprawdź historię/status. | Sprawdź puste i niedopasowane `Imię`/`Nazwisko`/`PESEL`, błędny okres oraz granice każdej kwoty korekty; popraw dane i potwierdź wznowienie przepływu. | Odwróć korektę lub usuń dane jednorazowe. |
| TC-FORM-008 | Wznowienie odprowadzania wpłat | `/employer/contributionrenewal` | Nagłówek, breadcrumbs, wyszukiwanie uczestnika i wszystkie akcje | Wyszukaj/wybierz kwalifikującego się uczestnika jednorazowego, podaj poprawne dane skuteczności i sprawdź potwierdzenie/historię. | Sprawdź puste i niedopasowane wyszukiwanie, każdą opcję `Zatrudniony`, wymagane pola, daty i wartości graniczne list; popraw dane i sprawdź dostępność kolejnej akcji. | Przywróć poprzedni status wpłat uczestnika. |
| TC-FORM-009 | Zmiana wysokości wpłaty podstawowej Pracownika | `/employer/contribution/primary` | Nagłówek, breadcrumbs, wyszukiwanie uczestnika, pola stawki i akcje | Wybierz uczestnika jednorazowego, zapisz poprawną dozwoloną stawkę i sprawdź potwierdzenie/historię. | Sprawdź puste/niedopasowane wyszukiwanie, brak daty skuteczności, nienumeryczną stawkę i każdą widoczną granicę stawki; popraw wartość i sprawdź przejście dalej. | Przywróć pierwotną stawkę. |
| TC-FORM-010 | Deklaracja wpłaty dodatkowej Pracownika | `/employer/contribution/secondary` | Nagłówek, breadcrumbs, wyszukiwanie uczestnika, kontrolki wpłaty dodatkowej i akcje | Wybierz uczestnika jednorazowego, zapisz poprawną deklarację wpłaty dodatkowej i sprawdź potwierdzenie/historię. | Sprawdź puste/niedopasowane wyszukiwanie, pustą i nienumeryczną stawkę oraz wszystkie widoczne granice; popraw dane i sprawdź przejście dalej. | Usuń lub przywróć deklarację wpłaty dodatkowej. |
| TC-FORM-011 | Zmiana danych | `/employer/dataChange` | Nagłówek, breadcrumbs, wyszukiwanie uczestnika, edytowalne kontrolki i akcje | Wybierz uczestnika jednorazowego, zmień jedno dozwolone pole poprawną wartością, zapisz i sprawdź wartość. | Sprawdź puste/niedopasowane wyszukiwanie, wszystkie wymagane pola puste/białe znaki/błędny format oraz granice długości/dat/list; popraw dane i sprawdź możliwość zapisu. | Przywróć pierwotne dane uczestnika. |
| TC-FORM-012 | Wypłata transferowa do Nationale-Nederlanden | `/employer/transfer` | Nagłówek, breadcrumbs, wyszukiwanie uczestnika, kontrolki transferu i akcje | Tylko na zatwierdzonym sandboxie: wykonaj poprawny wniosek transferowy dla uczestnika jednorazowego i sprawdź potwierdzenie/historię. | Sprawdź puste/niedopasowane wyszukiwanie, wszystkie wymagane pola puste, błędne daty/rachunki/listy oraz udokumentowane granice; popraw błędy bez wysłania danych produkcyjnych. | Anuluj/usuń wniosek jednorazowy albo potwierdź odwrócenie. |
| TC-FORM-013 | Zakończenie lub wznowienie zatrudnienia | `/employer/employmentChange` | Nagłówek; breadcrumbs; `Imię`, `Nazwisko`, `PESEL`, `Zatrudniony` (domyślnie `TAK`); `Szukaj` | Wyszukaj/wybierz uczestnika jednorazowego, wykonaj dozwoloną zmianę statusu i sprawdź potwierdzenie/historię. | Wyszukaj pustymi i niedopasowanymi danymi, wybierz `Wszystkie`, `TAK`, `NIE`; sprawdź wymagane daty/statusy na granicach, popraw błędy i sprawdź wznowienie przepływu. | Przywróć pierwotny status zatrudnienia. |
| TC-FORM-014 | Rezygnacja z odprowadzania wpłat | `/employer/contributioncancel/` | Link Menu i odpowiedź trasy | Niedostępna dla badanego uprawnienia. | Otwórz trasę w świeżej sesji i sprawdź HTTP 403, tytuł `Błąd` i `Brak dostępu!`; sprawdź, że Menu nadal pokazuje link. | Brak; odnotuj KI-5. |

#### Obowiązkowa reguła pełnego pokrycia formularzy

Dla TC-FORM-001 do TC-FORM-013 należy uwzględnić każdą widoczną kontrolkę: input, listę, radio, checkbox, datę, akcję tabeli, upload, akcję główną/poboczną oraz komunikat walidacji. Dla każdej mającej zastosowanie kontrolki wykonaj i zapisz:

1. Ścieżkę pozytywną z poprawnymi danymi, kamieniami milowymi i końcowym wynikiem zapisu/przejścia.
2. Wartość pustą wymaganą oraz wartość z samych białych znaków.
3. Błędny format i błędny wybór.
4. Dokładne wartości graniczne: min−1, min, min+1, max−1, max, max+1 dla pól liczbowych i długości; wartości poprawne, puste, błędne, odwrócone, przyszłe i historyczne dla dat; pierwszą, ostatnią, pustą, zablokowaną i niedostępną opcję listy.
5. Odzyskanie: popraw błędną wartość i potwierdź możliwość przejścia dalej lub zapisu.

Nie uznawaj formularza za pokryty tylko dlatego, że ładuje się jego URL i nagłówek. Końcowa operacja pozytywna może zostać wykonana wyłącznie na danych jednorazowych po zakończeniu wskazanego sprzątania; w przeciwnym razie wykonaj niestanowe ścieżki walidacji i odnotuj brak danych jako blokadę automatyzacji.

---

## 8. TC-PWD — Zmiana hasła

**Zasady:** minimum 12 i maksimum 20 znaków; co najmniej 1 znak specjalny, 2 cyfry, wielka i mała litera, łącznie co najmniej 3 litery; nie więcej niż 2 identyczne znaki z rzędu.

| Parametr | Min−1 (błędny) | Min. (poprawny) | Min+1 | Max−1 | Max. (poprawny) | Max+1 (błędny) |
|---|---|---|---|---|---|---|
| Długość hasła | 11 znaków (PW2) | 12 znaków | 13 znaków | 19 znaków | 20 znaków | 21 znaków (PW3) |

### TC-PWD-001 — Poprawna zmiana hasła (zmienia stan, wymaga sprzątania)
**Priorytet:** P1 — Krytyczny

Użyj starego hasła P1, ustaw PW1 w polach „Nowe hasło” i „Powtórz hasło”, kliknij „Zmień hasło” i sprawdź potwierdzenie. Wyloguj się, zaloguj jako `curka_employer` z PW1, a następnie **zawsze** przywróć P1, także po niepowodzeniu asercji (teardown lub `try/finally`).

### TC-PWD-002 — Naruszenia zasad hasła
**Priorytet:** P2 — Wysoki  
**Typ:** Graniczny / negatywny

Sprawdź kolejno: PW2 — błąd poniżej minimum; PW3 — błąd powyżej maksimum; PW4 — brak znaku specjalnego; PW5 — mniej niż 2 cyfry; PW6 — brak wielkiej litery; PW7 — więcej niż 2 identyczne znaki z rzędu; PW8 — niezgodne hasła. Kliknięcie „Powrót” powinno wrócić do poprzedniego ekranu bez zmiany hasła.

---

## 9. TC-REPORT — Raporty i pliki zwrotne

### TC-REPORT-001 — Wybór raportu pokazuje akcję generowania
**Priorytet:** P2 — Wysoki

Na `/employer/report` sprawdź wszystkie opcje REPORT1..5. Po wybraniu „Raport Uczestników” URL powinien zmienić się na `/employer/report/0`, a przycisk „Generuj raport” powinien się pojawić. Kliknięcie powinno uruchomić pobieranie lub pokazać stan wyniku; rzeczywiste generowanie zweryfikuj ostrożnie, aby nie obciążać środowiska.

### TC-REPORT-002 — Pozostałe typy raportów
**Priorytet:** P3 — Średni

Powtórz TC-REPORT-001 dla każdego typu raportu, najlepiej jako przypadki data-driven.

### TC-REPORT-003 — Obecność kart plików zwrotnych
**Priorytet:** P2 — Wysoki

Na `/employer/documentsReport/` sprawdź 7 kart: „Raport Id EPPK Uczestników”, „Raport wypłata transferowa”, „Raport Wypłata 60 lat”, „Raport nierozliczonych wpłat”, „Raport z korekt”, „Raport z błędnym stosunkiem wpłat”, „Raport rozliczonych wpłat z rezygnacją”. Kliknięcie dowolnej karty powinno otworzyć modal wyboru zakresu dat.

### TC-REPORT-004 — Defekt inicjalizacji datetimepickera (KI-2)
**Priorytet:** P2 — Wysoki  
**Typ:** Potwierdzenie błędu

Załaduj stronę i przechwyć konsolę. Oczekiwany jest brak błędów JavaScript; aktualnie występuje `$(...).datetimepicker is not a function`, przez co widget zakresu dat może nie działać. Kliknij kartę i sprawdź, czy pola daty są używalne.

---

## 10. TC-DOCS — Dokumenty

### TC-DOCS-001 — Statyczne pobieranie dokumentów
**Priorytet:** P3 — Średni

Na `/documents` sprawdź obecność linków „Umowa o zarządzanie PPK” i „Umowa o prowadzenie PPK” z adresami `/documents/contract/download/filetype/...`. Pobranie pierwszego pliku powinno rozpocząć się, odpowiedź powinna być niepusta i mieć typ dokumentu (np. PDF). Sprawdź również brak 404 dla załączników, np. `ANEKS_UOZ_1.pdf`, `ANEKS_UOZ_2.pdf`, `ANEKS_UOZ_3.pdf`.

---

## 11. TC-SETTINGS — Ustawienia konta

### TC-SETTINGS-001 — Dane umowy i wpłat są dostępne w trybie odczytu

Na `/employer/data` sekcja „Dane ogólne” powinna pokazywać nazwę podmiotu zatrudniającego, numer pracodawcy w systemie AT, daty i adresy. Wartości są tylko do odczytu. Historyczna notatka mówiła o „Brak dostępu!”; w świeżej sesji `curka_employer` ekran działał, więc należy ponownie zweryfikować zależność od konta lub świeżości sesji.

### TC-SETTINGS-002 — Wspólne logowanie pokazuje bieżący Superlogin

Na `/employer/relatedUsers` tekst powinien potwierdzać, że `curka_employer` jest Superloginem, a tabela powiązanych loginów powinna być obecna i domyślnie pusta.

### TC-SETTINGS-003 — Elementy tabeli zaufanych urządzeń

Na `/trusted-devices` sprawdź obecność selektora „Pokaż pozycji”, pola „Szukaj:” i tabeli urządzeń.

---

## 12. Scenariusze pełnych przepływów

### TC-FLOW-001 — Logowanie pracodawcy → panel → wylogowanie → blokada strony chronionej
**Typ:** End-to-end  
**Priorytet:** P1 — Krytyczny

Przejdź do logowania, zaloguj się U1/P1, potwierdź panel, otwórz kartę „Podgląd Uczestników”, wyloguj się i spróbuj wejść bezpośrednio na `/employer/customer/list`. Po wylogowaniu powinno nastąpić przekierowanie do logowania.

### TC-FLOW-002 — Niepoprawne logowanie i poprawne odzyskanie
**Typ:** End-to-end / obsługa błędu  
**Priorytet:** P1 — Krytyczny

Wyślij U1/INV1 i sprawdź ERR1 oraz `?error=true`. Następnie popraw hasło na P1 i potwierdź przekierowanie do panelu.

### TC-FLOW-003 — Pełny cykl zmiany hasła
**Typ:** End-to-end  
**Priorytet:** P2 — Wysoki

Zmień P1 na PW1, wyloguj się i zaloguj PW1, następnie zmień PW1 z powrotem na P1. Wyloguj się i zaloguj P1, aby potwierdzić skuteczne sprzątanie. Przywrócenie hasła musi nastąpić także po błędzie testu.

### TC-FLOW-005 — Kontrola dostępu wszystkich punktów Dyspozycji
**Typ:** End-to-end / bezpieczeństwo  
**Priorytet:** P1 — Krytyczny

Zaloguj się świeżo jako U1/P1 (sesja młodsza niż 5 minut), odwiedź kolejno 10 URL-i z TC-NAV-003 bez przerw. Dziewięć stron powinno załadować właściwe formularze, a tylko `contributioncancel/` powinno zwrócić HTTP 403 „Brak dostępu!”.

---

## 13. Znane problemy i obserwacje

| ID | Priorytet | Obszar | Opis | Dowód |
|----|-----------|--------|------|-------|
| KI-1 | Niski/Średni | Uwierzytelnianie / sesja | Wejście na login podczas aktywnej sesji renderuje jednocześnie nagłówek użytkownika i formularz logowania zamiast przekierować do panelu. | Odtworzono 2026-09-04. |
| KI-2 | Średni | Pliki zwrotne | Na `/employer/documentsReport/` występuje `$(...).datetimepicker is not a function`; widget zakresu dat może blokować filtrowanie i pobieranie raportów. | Błąd konsoli zarejestrowany 2026-09-04. |
| KI-3 | Średni/Wysoki | Zarządzanie sesją | Wygaśnięcie sesji (~15 min, „Koniec sesji za”) daje niespójne strony błędów: „Brak dostępu!” lub nieostylowany Spring „Whitelabel Error Page” (`type=null, status=null`), zamiast logowania. | Odtworzono na żywo; po ponownym logowaniu te same URL-e działały. |
| KI-5 | Średni | Autoryzacja | Link „Rezygnacja z odprowadzania wpłat” jest widoczny dla `curka_employer`, ale zwraca HTTP 403; powinien być ukryty lub wyłączony dla roli bez uprawnienia. | Odtworzono w świeżej sesji. |
| KI-6 | Średni | Nawigacja | Link „Dyspozycje” (`/employer/dashboard?orders=1`) prowadzi zawsze do Spring „Whitelabel Error Page”. | Odtworzono także bezpośrednio po świeżym logowaniu. |
| KI-8 | Średni | Nawigacja | Ponowne kliknięcie `Menu` nie zamyka rozwiniętej nakładki Menu. | Odtworzono testem TC-NAV-002 2026-09-09. |
| KI-7 | Średni | Higiena zestawu testów | Wspólne dane testowe nadal zawierają zapasowe hasło konta pracodawcy; CI powinno przekazywać `PPK_EMPLOYER_LOGIN` i `PPK_EMPLOYER_PASSWORD` przez bezpieczny magazyn sekretów. | Przegląd statyczny [data/testData.json](../data/testData.json). |

---

## 14. Kandydaci do automatyzacji i uwagi implementacyjne

Zgodnie z konwencją [.github/instructions/copilot-instructions.md](../.github/instructions/copilot-instructions.md):

- **Page Objecty do utworzenia w `pages/`:** `BasePage.ts` (najpierw), `LoginPage.ts`, `EmployerDashboardPage.ts`, `ParticipantListPage.ts`, `FileUploadPage.ts`, `ReportsPage.ts`, `ReturnedFilesPage.ts`, `DocumentsPage.ts`, `PasswordChangePage.ts`, `UserAdminPage.ts`, `RegistrationWizardPage.ts`.
- **Fixtures:** dodać obsługę Page Objectów w `fixtures/pagesFixtures.ts` zamiast tworzyć obiekty bezpośrednio w specyfikacjach.
- **Dane testowe:** rozszerzyć `data/testData.json` lub wydzielić `data/employerTestData.json`; hasła preferencyjnie pobierać ze zmiennych środowiskowych, tak jak `PPK_LOGIN`/`PPK_PASSWORD`.
- **Proponowane pliki specyfikacji:** `tests/auth.spec.ts`, `tests/navigation-access.spec.ts`, `tests/participant-list.spec.ts`, `tests/file-upload.spec.ts`, `tests/registration-wizard.spec.ts`, `tests/password-change.spec.ts`, `tests/reports.spec.ts`, `tests/documents.spec.ts`, `tests/settings.spec.ts`.

**Gotowe do automatyzacji teraz:** TC-AUTH-001..008, TC-NAV-001..004, TC-LIST-001..004/006, TC-REPORT-001/003/004 (bez klikania „Generuj raport”), TC-DOCS-001 (obecność linków; faktyczne pobieranie można pominąć w CI), TC-SETTINGS-001..003, TC-FLOW-001/002/005.

**Automatyzować ostrożnie, po przygotowaniu danych jednorazowych:** TC-FORM-001..005 (rejestracja zmienia listę uczestników — potrzebny jednorazowy zakres PESEL albo zatrzymywanie testów na pierwszym błędzie walidacji); TC-PWD-001/TC-FLOW-003 (niezawodne przywracanie hasła nawet po błędzie); TC-LIST-005 (potrzebny jednorazowy plik i uwzględnienie, że przesłane pliki można usuwać tylko w ciągu godziny).

**Obecnie tylko manualnie/eksploracyjnie:** pełne wysyłanie TC-FORM-006..014 (zmienia dane płacowe i dane uczestników rzeczywistego pracodawcy). Przed automatyzacją należy potwierdzić z właścicielem produktu dostępność jednorazowego pracodawcy testowego; na teraz automatyzować wyłącznie opisane testy smoke sprawdzające ładowanie ekranów.

---

## 15. TC-MENU — Pełne pokrycie Menu i ekranów

**Zakres:** Każdy przypadek uruchamiaj w świeżej sesji Pracodawcy. Weryfikuj dokładne polskie etykiety UI. Nie wykonuj końcowego wysłania zmieniającego dane bez danych jednorazowych i opisanego sprzątania.

### TC-MENU-001 — Powłoka uwierzytelniona i rozwinięte Menu

- **Priorytet:** P1 — Krytyczny
- **Test ID:** TC-MENU-001
- **Tytuł:** Weryfikacja powłoki uwierzytelnionej i wszystkich pozycji Menu
- **Cel:** Weryfikacja nagłówka globalnego, grup Menu, danych wsparcia i wylogowania.
- **Warunki wstępne:** Uwierzytelnienie jako U1/P1, strona `/employer`.
- **Kroki:**
	1. Sprawdź nazwę firmy, `Koniec sesji za`, komunikat ostatniego poprawnego logowania oraz `Wyloguj`.
	2. Kliknij `Menu`; sprawdź sekcje `Panel administracyjny`, `PPK`, `Ustawienia` i `Dyspozycje`.
	3. Sprawdź każdą widoczną pozycję Menu oraz jej ścieżkę zgodnie z sekcją 2.
	4. Sprawdź dane opiekuna, telefon, e-mail, telefon obsługi klienta, godziny dostępności i komunikat ostatniego nieudanego logowania.
	5. Kliknij `Menu` ponownie i potwierdź zamknięcie nakładki bez nawigacji.
- **Oczekiwany wynik:** Widoczne i używalne są wszystkie kontrolki globalne oraz aktualne ścieżki Menu.
- **Sprzątanie:** Brak.

### TC-MENU-002 — Karty panelu i ich cele

- **Priorytet:** P2 — Wysoki
- **Test ID:** TC-MENU-002
- **Tytuł:** Weryfikacja każdej karty panelu i jej celu
- **Cel:** Weryfikacja etykiet, opisów oraz nawigacji wewnętrznej i zewnętrznej z panelu.
- **Warunki wstępne:** Uwierzytelnienie jako U1/P1, strona `/employer`.
- **Kroki:**
	1. Sprawdź karty: `Przekazanie plików`, `Dyspozycje`, `Podgląd Uczestników`, `Raporty`, `Pliki zwrotne od Nationale-Nederlanden`, `Dokumenty`, `Materiały informacyjne`, `Dane dotyczące umowy i wpłat do PPK`, `Uprawnienia`, `Szkolenia`.
	2. Otwórz każdą kartę wewnętrzną, sprawdź URL oraz nagłówek poziomu 1 i wróć do panelu.
	3. Otwórz `Dyspozycje` i sprawdź te same dziesięć pozycji co w `Menu`, bez błędnej nawigacji.
	4. Otwórz `Materiały informacyjne` i `Szkolenia`; sprawdź otwarcie niepustej strony lub dokumentu zewnętrznego w osobnej karcie.
- **Oczekiwany wynik:** Każda karta ma oczekiwany opis i działający cel.
- **Sprzątanie:** Zamknij zewnętrzne karty.

### TC-MENU-003 — Administracja, pliki i lista uczestników

- **Priorytet:** P1 — Krytyczny
- **Test ID:** TC-MENU-003
- **Tytuł:** Weryfikacja list, filtrów, tabel i bezpiecznych akcji
- **Cel:** Weryfikacja wszystkich kontrolek ekranów list bez tworzenia lub zmiany danych biznesowych.
- **Warunki wstępne:** Uwierzytelnienie jako U1/P1.
- **Kroki:**
	1. Otwórz `Lista użytkowników`; sprawdź sześć kolumn, `Dodaj użytkownika`, `Pokaż pozycji`, `Szukaj:` i aktywną paginację. Zmień rozmiar strony, wyszukaj U1, wyczyść filtr, użyj `Next`/`Previous`.
	2. Otwórz `Dodaj użytkownika`; sprawdź każde widoczne pole, listę, checkbox i akcję, następnie wyjdź bez wysłania.
	3. Otwórz `Przekazanie plików`; sprawdź input uploadu, instrukcje, akcję, nagłówek historii, sześć kolumn historii, `Nazwa pliku`, filtry dat, `Wyszukaj`, akcje wiersza i pobrania. Sprawdź filtr nazwy, poprawny/odwrócony zakres dat i niepuste pobranie historii.
	4. Wyłącznie w środowisku z danymi jednorazowymi prześlij obsługiwany plik, potwierdź rezultat/wpis historii i usuń go, jeżeli UI na to pozwala.
	5. Otwórz `Podgląd Uczestników`; sprawdź wartości domyślne, filtry `Imię`, `Nazwisko`, `PESEL`, obie listy, `Wyszukaj`, wszystkie nagłówki tabeli, `Pokaż pozycji`, `Szukaj:`, paginację i każdą akcję `Zlecenie`.
	6. Dla każdego filtra tekstowego sprawdź brak wyników i czyszczenie. Dla każdej listy wybierz pierwszą, ostatnią oraz `Wszystkie` opcję; dwukrotnie kliknij każdą sortowalną kolumnę; otwórz i anuluj każdą akcję wiersza.
- **Oczekiwany wynik:** Filtry, sortowanie, wyszukiwanie, paginacja, pobrania i anulowanie pokazują prawidłowy stan bez niezamierzonego zapisu danych.
- **Sprzątanie:** Wyczyść filtry; usuń plik jednorazowy.

### TC-MENU-004 — Raporty, dokumenty, stopka i ustawienia

- **Priorytet:** P2 — Wysoki
- **Test ID:** TC-MENU-004
- **Tytuł:** Weryfikacja raportów, zasobów statycznych i ustawień konta
- **Cel:** Weryfikacja wszystkich wyborów raportów, kart plików zwrotnych, dokumentów/stopki i kontrolek ustawień.
- **Warunki wstępne:** Uwierzytelnienie jako U1/P1.
- **Kroki:**
	1. Otwórz `Raporty`; sprawdź `Nazwa raportu:`, każdą opcję REPORT1..5, stan/URL zależny od wyboru i `Generuj raport`. Generuj wyłącznie z danymi jednorazowymi i sprawdź niepuste pobrania.
	2. Otwórz `Pliki zwrotne od Nationale-Nederlanden`; sprawdź każdą kartę `returnedFileReports`. Otwórz każdą, sprawdź pola dat, akcje, zamykanie/anulowanie oraz poprawne, puste, odwrócone i przyszłe zakresy.
	3. Otwórz `Dokumenty`; sprawdź każdą sekcję i link dokumentu. Sprawdź powodzenie odpowiedzi, niepustą treść i odpowiedni content type.
	4. Sprawdź `Bezpieczeństwo`, `Polityka cookies`, `Kontakt` i `Regulamin` na stronach po zalogowaniu i po wylogowaniu. Każda pozycja musi wyświetlić treść albo niepusty PDF bez błędu odpowiedzi.
	5. Otwórz dane umowy oraz `Wspólne logowanie`; sprawdź wszystkie widoczne pary etykieta/wartość jako tylko do odczytu, tekst Superlogin, tabelę i kontrolki.
	6. Otwórz `Zmiana hasła`; sprawdź trzy pola, oba przyciski i wszystkie zasady. Wykonaj PW2..PW8, sprawdź widoczną walidację, a następnie użyj `Powrót` bez zmiany danych logowania.
	7. Otwórz `Zaufane urządzenia`; sprawdź kolumny, `Pokaż pozycji`, `Szukaj:`, paginację i każdą akcję urządzenia bez potwierdzania akcji niszczącej.
- **Oczekiwany wynik:** Zasoby działają, wybory otwierają oczekiwane kontrolki, ustawienia są tylko do odczytu albo walidowane, a ścieżki anulowania nie zapisują zmian.
- **Sprzątanie:** Zamknij modale/karty, wyczyść wyszukiwanie, nie zmieniaj hasła ani urządzeń.

### TC-MENU-005 — Kreator rejestracji i wszystkie ekrany Dyspozycji

- **Priorytet:** P1 — Krytyczny
- **Test ID:** TC-MENU-005
- **Tytuł:** Weryfikacja wszystkich formularzy Dyspozycji i bezpiecznej walidacji
- **Cel:** Weryfikacja pól, wartości domyślnych, walidacji, breadcrumbs oraz anulowania/powrotu dla każdej pozycji Dyspozycji.
- **Warunki wstępne:** Świeża sesja U1/P1; bez końcowego wysłania bez jednorazowych danych uczestnika/płac.
- **Kroki:**
	1. Otwórz `Zgłoszenie pracownika`; sprawdź breadcrumbs `Home`/`Dyspozycje`, komunikat, `Dalej` oraz wszystkie kontrolki w `Dane uczestnika`, `Adres zamieszkania`, wyborze adresu korespondencyjnego i `Rejestracja`.
	2. Sprawdź wartości domyślne list oraz pustą, pierwszą i ostatnią opcję. Wyślij puste pola, następnie sprawdź PESEL1..4, DATE1..3, EMAIL1..3, PHONE1, białe znaki i maksymalne długości. Po każdej błędnej wartości popraw ją i sprawdź zniknięcie błędu bez przejścia dalej.
	3. Otwórz `Zgłoszenie wpłat`; sprawdź `Wpłata za okres (RRRR-MM)`, wszystkie nagłówki tabeli wpłat, `Dodaj kolejną wpłatę` i `Dalej`. Sprawdź pusty/błędny okres, dodaj edytowalny wiersz i anuluj/usuń go przed wysłaniem.
	4. Otwórz kolejno: `Zgłoszenie korekt do wpłat`, `Wznowienie odprowadzania wpłat`, `Zmiana wysokości wpłaty podstawowej Pracownika`, `Deklaracja wpłaty dodatkowej Pracownika`, `Zmiana danych`, `Wypłata transferowa do Nationale-Nederlanden`, `Zakończenie lub wznowienie zatrudnienia`.
	5. Na każdym ekranie sprawdź nagłówek poziomu 1, oba breadcrumbs, każde widoczne pole/listę/radio/checkbox/tabelę/przycisk, walidację wymaganych pól oraz działanie `Dalej`, `Wstecz`, `Anuluj` lub `Powrót` bez końcowego wysłania.
	6. Otwórz `Rezygnacja z odprowadzania wpłat`; sprawdź HTTP 403 i `Brak dostępu!`, jednocześnie potwierdzając widoczność linku w Menu (KI-5).
	7. Na każdym ekranie Dyspozycji kliknij breadcrumb `Dyspozycje` i odnotuj aktualny Whitelabel Error jako KI-6, dopóki nie będzie strony przeglądu.
- **Oczekiwany wynik:** Dozwolone formularze pokazują wszystkie oczekiwane kontrolki i blokują błędne dane. Brak dostępu i uszkodzony breadcrumb pozostają jawnymi defektami, a nie zaliczonymi testami.
- **Sprzątanie:** Anuluj lub opuść każdy kreator przed końcowym wysłaniem; nie twórz danych uczestników ani płac.

---

## 16. TC-FI — Instytucja Finansowa

**Zakres:** Rola Instytucji Finansowej korzysta z tego samego skonfigurowanego `baseURL`; poprawne dane otwierają stronę startową bez SMS OTP. Kontynuuj implementację po jednym przypadku na podstawie obserwacji na żywo; nie zakładaj niezweryfikowanych kontrolek ani tras.

### TC-FI-001 — Poprawne logowanie Instytucji Finansowej otwiera stronę startową bez OTP

- **Priorytet:** P1 — Krytyczny
- **Typ:** Uwierzytelnienie pozytywne
- **Warunki wstępne:** Brak aktywnej sesji; otwórz `/ppk-nnpte2/nnpte/login`.
- **Dane testowe:** Login i hasło Instytucji Finansowej przekazane przez `PPK_FINANCIAL_INSTITUTION_LOGIN` i `PPK_FINANCIAL_INSTITUTION_PASSWORD`.

| Nr | Krok | Oczekiwany rezultat |
|---|------|---------------------|
| 1 | Wpisz poprawne dane Instytucji Finansowej w `Identyfikator` i `Hasło`. | Formularz przyjmuje obie wartości. |
| 2 | Kliknij `Zaloguj się`. | Przeglądarka przechodzi bezpośrednio do `/ppk-nnpte2/nnpte/manager/login/fork`; ekran SMS OTP nie pojawia się. |
| 3 | Sprawdź stronę startową. | Tytuł strony i widoczny nagłówek karty to `Panel Instytucji Finansowej`. |
| 4 | Sprawdź drugą kartę startową. | Widoczna jest karta `Podgląd Pracodawców`. |
| 5 | Sprawdź cele kart bez nawigacji. | `Panel Instytucji Finansowej` prowadzi do `/manager/contract/list/awaiting`, a `Podgląd Pracodawców` do `/manager/employer/list`. |

- **Oczekiwany wynik:** Poprawne dane Instytucji Finansowej tworzą sesję uwierzytelnioną i pokazują obie udokumentowane karty bez OTP.
- **Sprzątanie:** Wyloguj się, gdy sesja testowa jest współdzielona z kolejnymi testami.
- **Uwagi / Obserwacje:** Potwierdzono na żywo 2026-09-09; `Menu` zawiera `Uprawnienia`, `PPK`, `Dyspozycje`, `Ustawienia` i `Kontakt`. Każdy obszar wymaga odrębnego rejestru i przypadków testowych.

