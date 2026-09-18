# Test Plan — N-Portal PPK dla firm (ppk-nnpte2)

**Base URL:** `https://test.moventum.com.pl/ppk-nnpte2/nnpte/login`
**Environment:** TEST (`test.moventum.com.pl`)
**Date:** 2026-09-09
**Account investigated:**
- `curka_employer` — the Employer (`Panel pracodawcy`) account for legal entity "INTERFOOD-IDEA" SP. Z O.O.

Scope confirmed with requester: investigate only the application reachable from the configured `baseURL`, exercise every screen and feature reachable by the Employer account above, and produce an automation-ready regression plan.

---

## 1. Application Overview

N-Portal PPK dla firm is the Employer web portal for managing Employee Capital Plans (PPK). This plan covers only the application configured through `use.baseURL` in [playwright.config.ts](../playwright.config.ts): `https://test.moventum.com.pl/ppk-nnpte2/nnpte/login`.

The Employer portal (`curka_employer`) exposes participant management, file-based bulk registration/contribution submission, individual "Dyspozycje" (order) wizards, reporting, returned-files download, contract/document data, and account administration (users, shared login, password, trusted devices).

---

## 2. Page Inventory

| # | Page (Menu label) | URL | Role | Notes |
|---|---|---|---|---|
| 1 | Logowanie (Login) | `/ppk-nnpte2/nnpte/login` | Public | Identyfikator + Hasło |
| 2 | Panel pracodawcy (Dashboard) | `/ppk-nnpte2/nnpte/employer` | Employer | Card grid |
| 3 | Menu (flyout) | n/a (JS overlay on any page) | Employer | Full site map |
| 4 | Lista użytkowników | `/ppk-nnpte2/nnpte/employer/admin` | Employer | Admin table |
| 5 | Dodaj użytkownika | `/ppk-nnpte2/nnpte/employer/admin/users/edit/new` | Employer | Not filled/submitted (state-mutating) |
| 6 | Przekazanie plików | `/ppk-nnpte2/nnpte/employer/fileUpload` | Employer | Upload + history table |
| 7 | Podgląd Uczestników | `/ppk-nnpte2/nnpte/employer/customer/list` | Employer | Filters + table |
| 8 | Raporty | `/ppk-nnpte2/nnpte/employer/report` | Employer | Dropdown → `Generuj raport` |
| 9 | Dokumenty | `/ppk-nnpte2/nnpte/documents` | Employer | Static download links |
| 10 | Dane dotyczące umowy i wpłat do PPK | `/ppk-nnpte2/nnpte/employer/data` | Employer | Read-only contract data |
| 11 | Wspólne logowanie | `/ppk-nnpte2/nnpte/employer/relatedUsers` | Employer | Superlogin linking table |
| 12 | Zmiana hasła | `/ppk-nnpte2/nnpte/passwordChange` | Employer | Password policy form |
| 13 | Zaufane urządzenia | `/ppk-nnpte2/nnpte/trusted-devices` | Employer | Device table |
| 14 | Pliki zwrotne od Nationale-Nederlanden | `/ppk-nnpte2/nnpte/employer/documentsReport/` | Employer | 7 report cards; JS error present (KI-2) |
| 15 | Zgłoszenie pracownika | `/ppk-nnpte2/nnpte/employer/registration?mode=init` | Employer | Multi-step wizard, step 1 mapped in full |
| 16 | Zgłoszenie wpłat | `/ppk-nnpte2/nnpte/employer/contributions?mode=init` | Employer | Accessible |
| 17 | Zgłoszenie korekt do wpłat | `/ppk-nnpte2/nnpte/employer/corrections?mode=init` | Employer | Accessible |
| 18 | Rezygnacja z odprowadzania wpłat | `/ppk-nnpte2/nnpte/employer/contributioncancel/` | Employer | **HTTP 403 "Brak dostępu!"** (KI-5) |
| 19 | Wznowienie odprowadzania wpłat | `/ppk-nnpte2/nnpte/employer/contributionrenewal` | Employer | Accessible |
| 20 | Zmiana wysokości wpłaty podstawowej Pracownika | `/ppk-nnpte2/nnpte/employer/contribution/primary` | Employer | Accessible |
| 21 | Deklaracja wpłaty dodatkowej Pracownika | `/ppk-nnpte2/nnpte/employer/contribution/secondary` | Employer | Accessible |
| 22 | Zmiana danych | `/ppk-nnpte2/nnpte/employer/dataChange` | Employer | Accessible |
| 23 | Wypłata transferowa do Nationale-Nederlanden | `/ppk-nnpte2/nnpte/employer/transfer` | Employer | Accessible |
| 24 | Zakończenie lub wznowienie zatrudnienia | `/ppk-nnpte2/nnpte/employer/employmentChange` | Employer | Accessible |
| 25 | Dyspozycje (breadcrumb link) | `/ppk-nnpte2/nnpte/employer/dashboard?orders=1` | Employer | Broken route → Whitelabel Error Page even with a fresh session (KI-6) |
| 26 | Bezpieczeństwo / Polityka cookies / Kontakt / Regulamin | footer links | Public | Static/legal pages, present on every screen |
| 27 | Panel Instytucji Finansowej | `/ppk-nnpte2/nnpte/manager/login/fork` | Financial Institution | No SMS OTP observed; two landing cards |

---

## 3. Test Data

| ID | Description | Value |
|----|-------------|-------|
| U1 | Employer valid login | `curka_employer` |
| P1 | Employer valid password | `Start.123` |
| INV1 | Invalid password for U1 | `WrongPassword1` |
| INV2 | Empty credentials | `""` / `""` |
| ERR1 | Expected invalid-login message | `Nieprawidłowy identyfikator lub hasło` |
| ERR2 | Expected invalid-login query flag | `?error=true` |
| MSG1 | Expected logout confirmation | `Zostałeś prawidłowo wylogowany` |
| PW1 | New password — valid (meets policy) | `Nn2026!Secure` |
| PW2 | Too short (11 chars) | `Nn2026!Secu` |
| PW3 | Too long (21 chars) | `Nn2026!SecureExtra11` |
| PW4 | Missing special character | `Nn20261234567` |
| PW5 | Missing digit (only 1 digit) | `NnSecure!Pass2` |
| PW6 | Missing uppercase | `nn2026!secure` |
| PW7 | 3+ identical consecutive chars (violates policy) | `Nn2026!!!Secure` |
| PW8 | Confirm mismatch | `PW1` in "Nowe hasło", `PW2` in "Powtórz hasło" |
| PESEL1 | Valid-format PESEL (11 digits) | `44051401359` |
| PESEL2 | Too short (10 digits) | `4405140135` |
---

| PESEL3 | Too long (12 digits) | `440514013599` |

| PESEL4 | Non-numeric | `4405140135A` |

| DATE1 | Valid birth date | `1990-05-01` |

| DATE2 | Future date (invalid) | `2099-01-01` |
| DATE3 | Malformed date | `01-05-1990` |
| EMAIL1 | Valid email | `jan.kowalski@example.com` |
| EMAIL2 | Missing `@` | `jan.kowalskiexample.com` |
| EMAIL3 | Missing domain | `jan.kowalski@` |
| PHONE1 | Valid PL mobile | `500600700` |
| REPORT1..5 | Report names in `Nazwa raportu` dropdown | `Raport Uczestników`, `Raport z rozliczenia skladek`, `Raport z historii zleceń Uczestników`, `Raport z historii wpłat Uczestników`, `Raport uczestnictwa w funduszach` |

> Do not store passwords as plaintext in new test files. Read them from the `PPK_EMPLOYER_LOGIN` and `PPK_EMPLOYER_PASSWORD` environment variables.

---

## 4. TC-AUTH — Login, Logout, Session



### TC-AUTH-001 — Successful employer login
**Priority:** P1 — Critical
**Preconditions:** Logged out, browser at `/ppk-nnpte2/nnpte/login`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Fill "Identyfikator" with `curka_employer` (Test data: U1) | Value entered |
| 2 | Fill "Hasło" with `Start.123` (Test data: P1) | Value entered (masked) |
| 3 | Click "Zaloguj się" | Redirected to `/ppk-nnpte2/nnpte/employer`, page title "Panel pracodawcy" |
| 4 | Assert dashboard shows company name | `"INTERFOOD-IDEA" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ` visible in the header |

### TC-AUTH-002 — Invalid password shows error and does not authenticate

**Priority:** P1 — Critical


| # | Step | Expected Result |
|---|------|------------------|
| 1 | Fill "Identyfikator" with `curka_employer` (Test data: U1) | Value entered |
| 2 | Fill "Hasło" with `WrongPassword1` (Test data: INV1) | Value entered |
| 3 | Click "Zaloguj się" | URL becomes `...login?error=true` (Test data: ERR2) |
| 4 | Assert error text | `Nieprawidłowy identyfikator lub hasło` is visible (Test data: ERR1) |

### TC-AUTH-003 — Empty credentials submit
**Priority:** P2 — High
**Type:** Boundary / negative

| # | Step | Expected Result |
|---|------|------------------|

| 1 | Leave "Identyfikator" and "Hasło" empty | — |

| 2 | Click "Zaloguj się" | Client- or server-side validation blocks submission, or the same `Nieprawidłowy identyfikator lub hasło` error is shown; page does not navigate to `/employer` |

### TC-AUTH-006 — Logout
**Priority:** P1 — Critical
**Preconditions:** Authenticated as U1/P1.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Click "Wyloguj" | Redirected to `...login?logout` |
| 2 | Assert confirmation text | `Zostałeś prawidłowo wylogowany` visible (Test data: MSG1) |
| 3 | Navigate back to `/ppk-nnpte2/nnpte/employer` directly | User is redirected to the login page, not shown the dashboard |



### TC-AUTH-007 — Visiting `/login` while already authenticated (defect KI-1)
**Priority:** P3 — Medium
**Type:** Negative / UI defect confirmation
**Preconditions:** Authenticated as U1/P1.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Navigate directly to `/ppk-nnpte2/nnpte/login` while still logged in | **Current (defective) behavior:** both the authenticated header (with "Menu"/"Wyloguj") and the public login form/banner render on the same page. **Expected:** the app should redirect the authenticated user straight to `/employer` instead of re-rendering the login form. |

### TC-AUTH-008 — Session expiry mid-navigation (defect KI-3)
**Priority:** P2 — High
**Type:** Negative / recovery
**Preconditions:** Authenticated session older than the "Koniec sesji za" countdown shown in the header (~15 min).


| # | Step | Expected Result |

|---|------|------------------|
| 1 | Log in as U1/P1 and remain idle until the "Koniec sesji za" countdown reaches 0 | Session expires |
| 2 | Navigate to any protected employer URL (e.g. `/employer/customer/list`) | **Expected:** consistent redirect to the login page with a session-expired message. **Currently observed:** inconsistent responses — a styled "Brak dostępu!" page on some routes and an unstyled Spring "Whitelabel Error Page" (`type=null, status=null`) on others (e.g. `/employer`, `/employer/dashboard?orders=1`). Record actual behavior per route. |

---

## 5. TC-NAV — Navigation & Access Control

### TC-NAV-001 — Dashboard exposes all expected feature cards
**Priority:** P1 — Critical
**Preconditions:** Authenticated as U1/P1, on `/employer`.

| # | Step | Expected Result |

|---|------|------------------|

| 1 | Assert dashboard cards | "Przekazanie plików", "Dyspozycje", "Podgląd Uczestników", "Raporty", "Pliki zwrotne od Nationale-Nederlanden", "Dokumenty", "Materiały informacyjne", "Dane dotyczące umowy i wpłat do PPK", "Uprawnienia", "Szkolenia" are all visible |

### TC-NAV-002 — Full "Menu" flyout lists every section
**Priority:** P2 — High

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Click "Menu" in the top banner | Flyout expands with sections "Panel administracyjny", "PPK", "Ustawienia", "Dyspozycje" |
| 2 | Assert "Panel administracyjny" links | "Lista użytkowników" |
| 3 | Assert "PPK" links | "Przekazanie plików", "Podgląd Uczestników", "Raporty", "Dokumenty" |
| 4 | Assert "Ustawienia" links | "Dane dotyczące umowy i wpłat do PPK", "Wspólne logowanie", "Zmiana hasła", "Zaufane urządzenia" |
| 5 | Assert "Dyspozycje" links (10 items) | "Zgłoszenie pracownika", "Zgłoszenie wpłat", "Zgłoszenie korekt do wpłat", "Rezygnacja z odprowadzania wpłat", "Wznowienie odprowadzania wpłat", "Zmiana wysokości wpłaty podstawowej Pracownika", "Deklaracja wpłaty dodatkowej Pracownika", "Zmiana danych", "Wypłata transferowa do Nationale-Nederlanden", "Zakończenie lub wznowienie zatrudnienia" |


### TC-NAV-003 — Access-control matrix for Dyspozycje entry points

**Priority:** P1 — Critical
**Type:** Security / authorization
**Preconditions:** Authenticated as U1/P1 with a **fresh** session (re-login immediately before this test — session-expiry gives false negatives, see KI-3).

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Navigate to `/employer/registration?mode=init` | Page loads, heading "Zgłoszenie pracownika" |
| 2 | Navigate to `/employer/contributions?mode=init` | Page loads, heading "Zgłoszenie wpłat" |
| 3 | Navigate to `/employer/corrections?mode=init` | Page loads, heading "Zgłoszenie korekt do wpłat" |
| 4 | Navigate to `/employer/contributioncancel/` | **HTTP 403**, page title "Błąd", heading "Brak dostępu!" |
| 5 | Navigate to `/employer/contributionrenewal` | Page loads, heading "Wznowienie odprowadzania wpłat" |
| 6 | Navigate to `/employer/contribution/primary` | Page loads, heading "Zmiana wysokości wpłaty podstawowej Pracownika" |
| 7 | Navigate to `/employer/contribution/secondary` | Page loads, heading "Deklaracja wpłaty dodatkowej Pracownika" |
| 8 | Navigate to `/employer/dataChange` | Page loads, heading "Zmiana danych" |
| 9 | Navigate to `/employer/transfer` | Page loads, heading "Wypłata transferowa do Nationale-Nederlanden" |
| 10 | Navigate to `/employer/employmentChange` | Page loads, heading "Zakończenie lub wznowienie zatrudnienia" |



**Notes:** Step 4 is the only genuine 403 found for this role; flag to the product owner whether "Rezygnacja z odprowadzania wpłat" should instead be hidden/disabled on the dashboard and Menu flyout for accounts without this permission, since the app currently advertises the link and then blocks it (KI-5).

### TC-NAV-004 — Breadcrumb "Dyspozycje" link is broken
**Priority:** P2 — High
**Type:** Bug confirmation

| # | Step | Expected Result |
|---|------|------------------|
| 1 | From "Zgłoszenie pracownika", click the "Dyspozycje" breadcrumb link (`/employer/dashboard?orders=1`) | **Expected:** an orders/dispositions overview page. **Actual (defect KI-6):** unstyled "Whitelabel Error Page" (`This application has no explicit mapping for /error`). Reproduce with a fresh session to rule out KI-3. |

---

## 6. TC-LIST — Tables, Filters, Sorting, Pagination

### TC-LIST-001 — Podgląd Uczestników default filters
**Priority:** P2 — High
**Preconditions:** Authenticated, on `/employer/customer/list`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Observe default filter state | "Rezygnacja" = `Wszystkie`, "Zatrudniony" = `TAK` |
| 2 | Assert table columns | Imię, Nazwisko, PESEL, Numer kadrowy, Dokument, Adres email, Numer Telefonu, Rezygnacja, Zatrudniony, Wypłata po 60 r., Zlecenie |
| 3 | Assert pagination status text | `Pozycji X z Y dostępnych` reflects the filtered count |

### TC-LIST-002 — Filter by Imię / Nazwisko / PESEL
**Priority:** P2 — High

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Fill "Imię" with a non-existent value, e.g. `Zzzznieistniejacy` | — |
| 2 | Click "Wyszukaj" | Table shows `Pozycji 0 z 0 dostępnych` |
| 3 | Clear "Imię" and set "Zatrudniony" = `Wszystkie` | — |
| 4 | Click "Wyszukaj" | Table refreshes; result count may differ from step 2 |

### TC-LIST-003 — Sortable column headers
**Priority:** P3 — Medium

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Click the "Imię" column sort button | Table re-orders by first name (or shows "Wczytywanie..." then updates) |
| 2 | Click again | Sort order toggles (ascending/descending) |

### TC-LIST-004 — "Pokaż pozycji" page-size selector
**Priority:** P3 — Medium

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Change "Pokaż pozycji" from `10` to `25` | Table shows up to 25 rows per page; pagination control updates accordingly |

### TC-LIST-005 — Historia przesłanych plików (file upload history)
**Priority:** P2 — High
**Preconditions:** Authenticated, on `/employer/fileUpload`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Assert history table columns | Lp, Nazwa pliku, Osoba przesyłająca plik, Data przesłania pliku, Plik źródłowy, Akcje |
| 2 | Fill "Nazwa pliku" filter with an existing filename fragment and click "Wyszukaj" | Table narrows to matching rows |
| 3 | Fill "Data przesłania pliku OD"/"DO" with `DATE1` / a later date | Table narrows to the date range |
| 4 | Click a row's file-name download link under "Akcje" | File download starts (`/historyFileUpload/download/fileId/{id}`) |

### TC-LIST-006 — Lista użytkowników (admin) table
**Priority:** P2 — High
**Preconditions:** Authenticated, on `/employer/admin`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Assert table columns | Id, Nazwa użytkownika, Login, Adres e-mail, Aktywny, Data ostatniego logowania |
| 2 | Assert pagination status | `Pozycji od 1 do 10 z 12 łącznie` (adjust to live count) |
| 3 | Click "Next" pagination control | Page 2 of users loads |
| 4 | Use "Szukaj:" box to search for the current session's own login `curka_employer` (Test data: U1) | Table filters to the matching row |

---

## 7. TC-FORM — Data-Entry Wizards

### TC-FORM-001 — Zgłoszenie pracownika: required fields present (step 1)
**Priority:** P1 — Critical
**Preconditions:** Authenticated, on `/employer/registration?mode=init`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Assert "Dane uczestnika" fields | Imię, Drugie imię, Nazwisko, PESEL, Data urodzenia (RRRR-MM-DD), Obywatelstwo (defaults to `Polska`), Płeć, Rodzaj dokumentu, Numer dokumentu, Numer kadrowy, Email, Telefon |
| 2 | Assert "Adres zamieszkania" fields | Ulica, Nr domu, Nr mieszkania, Miejscowość, Kod pocztowy, Państwo |
| 3 | Assert "Adres korespondencyjny" toggle | "Tak"/"Nie" options present |
| 4 | Assert "Rejestracja" fields | Data obowiązku (RRRR-MM), Data zatrudnienia (RRRR-MM-DD), Procent składki dodatkowej pracodawcy, Opis składki dodatkowej pracodawcy |
| 5 | Assert primary action | "Dalej" button present |

### TC-FORM-002 — PESEL boundary values
**Priority:** P2 — High
**Type:** Boundary
**Preconditions:** On the registration wizard, other required fields filled with valid placeholder data.

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Fill "PESEL" | `4405140135` (10 digits, Test data: PESEL2) | Validation error on "Dalej" — PESEL must be 11 digits |
| 2 | Fill "PESEL" | `44051401359` (11 digits, Test data: PESEL1) | Accepted, no length error |
| 3 | Fill "PESEL" | `440514013599` (12 digits, Test data: PESEL3) | Validation error — too long |
| 4 | Fill "PESEL" | `4405140135A` (non-numeric, Test data: PESEL4) | Validation error — digits only |

### TC-FORM-003 — Data urodzenia boundary/format values
**Priority:** P3 — Medium
**Type:** Boundary

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Fill "Data urodzenia" | `1990-05-01` (Test data: DATE1) | Accepted |
| 2 | Fill "Data urodzenia" | `2099-01-01` (Test data: DATE2) | Validation error — future date not allowed |
| 3 | Fill "Data urodzenia" | `01-05-1990` (Test data: DATE3) | Validation error — wrong format, expects `RRRR-MM-DD` |

### TC-FORM-004 — Email / Telefon format validation
**Priority:** P3 — Medium

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Fill "Email" | `jan.kowalskiexample.com` (Test data: EMAIL2) | Validation error — invalid email format |
| 2 | Fill "Email" | `jan.kowalski@example.com` (Test data: EMAIL1) | Accepted |
| 3 | Leave "Telefon" empty and click "Dalej" | — | Depends on whether phone is mandatory for this flow — record actual behavior |

### TC-FORM-005 — Required-field validation on empty submit
**Priority:** P1 — Critical

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Click "Dalej" with all "Dane uczestnika" fields empty | Inline validation errors appear for at least Imię, Nazwisko, PESEL, Data urodzenia; wizard does not advance to step 2 |

### TC-FORM-006..014 — Remaining Dyspozycje wizards
**Priority:** P2 — High
**Type:** Positive, negative, boundary, and recovery coverage
**Preconditions:** Fresh authenticated session. A disposable participant and disposable payroll data are available for any successful final submission.

The following are separate cases, not smoke tests. Apply the full-form rule below to every visible control before marking a case complete.

| Test ID | Wizard | URL | Entry-screen evidence | Positive path | Negative, boundary, and recovery path | Cleanup |
|---|---|---|---|---|---|---|
| TC-FORM-006 | Zgłoszenie wpłat | `/employer/contributions?mode=init` | Heading; `Wpłata za okres (RRRR-MM)`; contribution-table headers; `Dodaj kolejną wpłatę`; `Dalej` | Select a valid period and add a disposable participant contribution; continue through confirmation and verify the resulting contribution/history entry. | Submit an empty, malformed, past/future, and unavailable period; test required and numeric contribution fields at min−1, min, min+1, max−1, max, max+1; correct every invalid value and continue. | Remove/reverse the disposable contribution and confirm no pending row remains. |
| TC-FORM-007 | Zgłoszenie korekt do wpłat | `/employer/corrections?mode=init` | Heading, breadcrumbs, first input group, table, and all actions | Select a disposable participant and valid source period; complete a permitted correction and verify its history/status. | Test empty participant search, unmatched `Imię`/`Nazwisko`/`PESEL`, invalid period and every correction amount boundary; correct values and verify progress resumes. | Reverse the correction or delete the disposable data. |
| TC-FORM-008 | Wznowienie odprowadzania wpłat | `/employer/contributionrenewal` | Heading, breadcrumbs, participant search and all visible actions | Search/select a disposable eligible participant, enter valid effective data, and verify the confirmation/history result. | Test empty and unmatched search values, each `Zatrudniony` option, required fields, dates, and available selections at their boundaries; correct the error and verify the next action becomes available. | Restore the participant's prior contribution status. |
| TC-FORM-009 | Zmiana wysokości wpłaty podstawowej Pracownika | `/employer/contribution/primary` | Heading, breadcrumbs, participant search, rate fields, and actions | Select a disposable participant and submit a valid allowed rate; verify the new rate in confirmation/history. | Test empty/unmatched participant searches, missing effective date, non-numeric rate, and every displayed rate boundary; correct the value and verify progression. | Restore the original contribution rate. |
| TC-FORM-010 | Deklaracja wpłaty dodatkowej Pracownika | `/employer/contribution/secondary` | Heading, breadcrumbs, participant search, additional-rate controls, and actions | Select a disposable participant and submit a valid additional-rate declaration; verify confirmation/history. | Test empty/unmatched searches, blank rate, non-numeric rate, and all displayed rate boundaries; correct each invalid value and verify progression. | Remove or restore the additional-rate declaration. |
| TC-FORM-011 | Zmiana danych | `/employer/dataChange` | Heading, breadcrumbs, participant search, editable controls, and actions | Select a disposable participant, change one permitted field with valid data, submit, and verify the saved value. | Test empty/unmatched search, each required editable field empty/whitespace/invalid format, and every length/date/select boundary; correct each value and verify saving can continue. | Restore the participant's original data. |
| TC-FORM-012 | Wypłata transferowa do Nationale-Nederlanden | `/employer/transfer` | Heading, breadcrumbs, participant search, transfer controls, and actions | Use a disposable eligible participant and complete a valid transfer request only in an approved sandbox; verify confirmation/history. | Test empty/unmatched search, every required control empty, invalid date/account/selection values, and documented boundaries; correct errors without submitting live business data. | Cancel/delete the disposable transfer request or verify reversal. |
| TC-FORM-013 | Zakończenie lub wznowienie zatrudnienia | `/employer/employmentChange` | Heading; breadcrumbs; `Imię`, `Nazwisko`, `PESEL`, `Zatrudniony` (default `TAK`); `Szukaj` | Search/select a disposable participant and complete one permitted employment-status change; verify confirmation/history. | Search with empty and unmatched values, select `Wszystkie`, `TAK`, and `NIE`, and validate all resulting required date/status controls at their boundaries; correct errors and verify the flow resumes. | Restore the original employment status. |
| TC-FORM-014 | Rezygnacja z odprowadzania wpłat | `/employer/contributioncancel/` | Menu link and route response | Not available for the investigated role. | Open the route with a fresh session and verify HTTP 403, title `Błąd`, and `Brak dostępu!`; verify the Menu still shows the link. | None; record KI-5. |

#### Mandatory full-form coverage rule

For TC-FORM-001 through TC-FORM-013, capture every displayed input, select, radio button, checkbox, date control, table action, upload, primary action, secondary action, and validation message in the case implementation. For each applicable control, execute and record:

1. A positive path using valid data, with each milestone and the final saved/advanced result asserted.
2. A required-empty and whitespace-only path.
3. Invalid-format and invalid-selection paths.
4. Exact boundary values: min−1, min, min+1, max−1, max, and max+1 for numeric or length-limited fields; valid, empty, malformed, reversed, future, and historical values for date controls; first, last, empty, disabled, and unavailable options for selections.
5. A recovery step that replaces the invalid value with valid data and proves the form can advance or save.

Do not claim a form is covered merely because its route and heading load. A final positive submission may run only against disposable data with the listed cleanup completed; otherwise execute non-mutating validation paths and record the missing data prerequisite as a blocked automation dependency.

---

## 8. TC-PWD — Password Change

### Boundary Value Table (policy: min 12, max 20 chars; ≥1 special char; ≥2 digits; upper+lower case; ≥3 letters total; no more than 2 identical consecutive characters)

| Parameter | Min−1 (invalid) | Min BV (valid) | Min+1 | Max−1 | Max BV (valid) | Max+1 (invalid) | Notes |
|---|---|---|---|---|---|---|---|
| Password length | 11 chars (PW2) | 12 chars | 13 chars | 19 chars | 20 chars | 21 chars (PW3) | Must still satisfy the other rules at every length |

### TC-PWD-001 — Successful password change (state-mutating — requires cleanup)
**Priority:** P1 — Critical
**Preconditions:** Authenticated as U1/P1.
**Cleanup:** Immediately change the password back to `P1` in an `afterEach`/teardown step so the shared test account remains usable.

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Fill "Stare hasło" | `Start.123` (Test data: P1) | — |
| 2 | Fill "Nowe hasło" | `Nn2026!Secure` (Test data: PW1) | — |
| 3 | Fill "Powtórz hasło" | `Nn2026!Secure` (Test data: PW1) | — |
| 4 | Click "Zmień hasło" | — | Success confirmation shown |
| 5 | Log out and log back in with `curka_employer` / `Nn2026!Secure` | — | Login succeeds |
| 6 | **Cleanup:** repeat steps 1–4 with old=`Nn2026!Secure`, new=`Start.123` | — | Password restored |

### TC-PWD-002 — Password policy violations (no submission required to reach "Zmień hasło" — validate client-side messaging where present)
**Priority:** P2 — High
**Type:** Boundary / negative

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Fill "Nowe hasło" | `Nn2026!Secu` (11 chars, Test data: PW2) | Error — below minimum 12 characters |
| 2 | Fill "Nowe hasło" | `Nn2026!SecureExtra11` (21 chars, Test data: PW3) | Error — exceeds maximum 20 characters |
| 3 | Fill "Nowe hasło" | `Nn20261234567` (no special char, Test data: PW4) | Error — missing special character |
| 4 | Fill "Nowe hasło" | `NnSecure!Pass2` (1 digit, Test data: PW5) | Error — fewer than 2 digits |
| 5 | Fill "Nowe hasło" | `nn2026!secure` (no uppercase, Test data: PW6) | Error — missing uppercase letter |
| 6 | Fill "Nowe hasło" | `Nn2026!!!Secure` (3 identical consecutive chars, Test data: PW7) | Error — more than 2 identical consecutive characters |
| 7 | Fill "Nowe hasło"/"Powtórz hasło" with mismatching values (Test data: PW8) | — | Error — passwords do not match |
| 8 | Click "Powrót" | — | Returns to the previous screen without changing the password |

---

## 9. TC-REPORT — Reports & Returned Files

### TC-REPORT-001 — Report type selection reveals the generate action
**Priority:** P2 — High
**Preconditions:** Authenticated, on `/employer/report`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Assert dropdown options | `Raport Uczestników`, `Raport z rozliczenia skladek`, `Raport z historii zleceń Uczestników`, `Raport z historii wpłat Uczestników`, `Raport uczestnictwa w funduszach` |
| 2 | Select "Raport Uczestników" | URL changes to `/employer/report/0`; "Generuj raport" button appears |
| 3 | Click "Generuj raport" | A file download is triggered / a success/result state is shown (verify actual behavior; not executed during exploration to avoid unnecessary load) |

### TC-REPORT-002 — Repeat TC-REPORT-001 for each remaining report type
**Priority:** P3 — Medium (data-driven — one case per option in REPORT1..5)

### TC-REPORT-003 — Pliki zwrotne cards are present
**Priority:** P2 — High
**Preconditions:** Authenticated, on `/employer/documentsReport/`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Assert the 7 report cards | "Raport Id EPPK Uczestników", "Raport wypłata transferowa", "Raport Wypłata 60 lat", "Raport nierozliczonych wpłat", "Raport z korekt", "Raport z błędnym stosunkiem wpłat", "Raport rozliczonych wpłat z rezygnacją" |
| 2 | Click any report card | A date-range picker modal should open |

### TC-REPORT-004 — Datetimepicker initialization defect (KI-2)
**Priority:** P2 — High
**Type:** Bug confirmation

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Load `/employer/documentsReport/` and capture the browser console | **Expected:** no JS errors. **Actual (defect):** `$(...).datetimepicker is not a function` is thrown, meaning the date-range widget used to filter/generate returned-file reports fails to initialize. |
| 2 | Click a report card and attempt to pick a date range | Confirm whether the date inputs are unusable as a result of step 1's error |

---

## 10. TC-DOCS — Documents

### TC-DOCS-001 — Static document downloads are present and resolve
**Priority:** P3 — Medium
**Preconditions:** Authenticated, on `/documents`.

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Assert "Umowa" section links | "Umowa o zarządzanie PPK", "Umowa o prowadzenie PPK" present with `/documents/contract/download/filetype/...` hrefs |
| 2 | Click "Umowa o zarządzanie PPK" | File download starts, non-empty response, content-type is a document type (e.g. PDF) |
| 3 | Assert annex/attachment links load without 404 | e.g. `ANEKS_UOZ_1.pdf`, `ANEKS_UOZ_2.pdf`, `ANEKS_UOZ_3.pdf` |

---

## 11. TC-SETTINGS — Account Settings

### TC-SETTINGS-001 — Dane dotyczące umowy i wpłat do PPK is readable
**Priority:** P3 — Medium

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Navigate to `/employer/data` | "Dane ogólne" section shows Nazwa podmiotu zatrudniającego, Numer pracodawcy w systemie AT, dates, and addresses (values are read-only) |

> Repo memory previously recorded this screen as returning "Brak dostępu!" for the investigated employer account. With a fresh `curka_employer` session it rendered successfully — retest before removing/updating that historical note, since access may depend on account or on session freshness (KI-3).

### TC-SETTINGS-002 — Wspólne logowanie shows the current Superlogin
**Priority:** P3 — Medium

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Navigate to `/employer/relatedUsers` | Text confirms `curka_employer` is the Superlogin; a linked-logins table is present (empty by default) |

### TC-SETTINGS-003 — Zaufane urządzenia table controls
**Priority:** P4 — Low

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Navigate to `/trusted-devices` | "Pokaż pozycji" selector and "Szukaj:" box are present alongside the device table |

---

## 12. Full Flow Scenarios

### TC-FLOW-001 — Employer login → dashboard → logout → protected page blocked
**Type:** End-to-end flow
**Priority:** P1 — Critical
**Preconditions:** No prior session.
**Cleanup:** None (read-only flow).

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Navigate to `/ppk-nnpte2/nnpte/login` | — | Login form displayed |
| 2 | Fill and submit credentials | U1/P1 | Redirected to `/employer`, dashboard loaded |
| 3 | Click "Podgląd Uczestników" card | — | Navigates to `/employer/customer/list`, heading "Podgląd Uczestników" |
| 4 | Click "Wyloguj" | — | Redirected to `...login?logout`, `Zostałeś prawidłowo wylogowany` shown |
| 5 | Attempt to navigate directly to `/employer/customer/list` | — | Redirected back to the login page (protected route not reachable post-logout) |

### TC-FLOW-002 — Invalid login then successful recovery
**Type:** End-to-end flow / error recovery
**Priority:** P1 — Critical

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Submit login with wrong password | U1 / INV1 | `Nieprawidłowy identyfikator lub hasło`, `?error=true` |
| 2 | Correct the password and resubmit | U1 / P1 | Redirected to `/employer`, dashboard loaded |

### TC-FLOW-003 — Password change round-trip
**Type:** End-to-end flow
**Priority:** P2 — High
**Preconditions:** Authenticated as U1/P1.
**Cleanup:** Password must be restored to `P1` even if an assertion fails mid-test (wrap in `try/finally` or a dedicated teardown step).

| # | Step | Data | Expected Result |
|---|------|------|------------------|
| 1 | Navigate to "Zmiana hasła" | — | Password policy text and form visible |
| 2 | Submit a valid new password | P1 → PW1 | Success confirmation |
| 3 | Log out and log back in with the new password | U1 / PW1 | Login succeeds, dashboard loads |
| 4 | Navigate to "Zmiana hasła" again and revert | PW1 → P1 | Success confirmation; original credentials restored |
| 5 | Log out and log back in with the original password | U1 / P1 | Login succeeds — confirms cleanup worked |

### TC-FLOW-005 — Access-control probe across all Dyspozycje entry points (fresh session)
**Type:** End-to-end flow / security
**Priority:** P1 — Critical
**Preconditions:** Fresh login as U1/P1 (session age < 5 minutes to avoid KI-3 false negatives).

| # | Step | Expected Result |
|---|------|------------------|
| 1 | Log in | Dashboard loads |
| 2 | Visit each of the 10 Dyspozycje URLs listed in TC-NAV-003, in order, without delays between requests | 9 load their respective forms; `contributioncancel/` alone returns HTTP 403 "Brak dostępu!" |

---

## 13. Known Issues & Observations

| ID | Severity | Area | Description | Evidence |
|----|----------|------|-------------|----------|
| KI-1 | Low/Medium | Auth / session hygiene | Visiting `/ppk-nnpte2/nnpte/login` while authenticated renders both the authenticated header and the login form on the same page instead of redirecting to the dashboard. | Reproduced live 2026-09-04. |
| KI-2 | Medium | Pliki zwrotne | Console error `$(...).datetimepicker is not a function` on `/employer/documentsReport/`; the date-range picker plugin fails to initialize, likely breaking date-filtered report downloads from this screen. | Console log captured live 2026-09-04. |
| KI-3 | Medium/High | Session management | Session timeout (~15 min, shown as "Koniec sesji za") produces **inconsistent** failure pages when it expires mid-navigation: a styled "Brak dostępu!" page on some routes, an unstyled Spring "Whitelabel Error Page" (`type=null, status=null`) on others (e.g. `/employer`, `/employer/dashboard?orders=1`). Neither redirects to login. | Reproduced live — same URLs succeeded after re-login and failed after an idle period. |
| KI-5 | Medium | Authorization | "Rezygnacja z odprowadzania wpłat" (`/employer/contributioncancel/`) is advertised in the Dyspozycje menu for `curka_employer` but returns HTTP 403 "Brak dostępu!" when opened — the link is not hidden/disabled for a role that cannot use it. | Reproduced live with a fresh session (rules out KI-3). |
| KI-6 | Medium | Navigation | The "Dyspozycje" breadcrumb link (`/employer/dashboard?orders=1`), reachable from every Dyspozycje wizard, has no working route and always renders the Spring "Whitelabel Error Page". | Reproduced live, including immediately after a fresh login. |
| KI-8 | Medium | Navigation | Clicking `Menu` a second time does not close the expanded Menu overlay. | Reproduced by TC-NAV-002 on 2026-09-09. |
| KI-7 | Medium | Test-suite hygiene (not an app defect) | Shared test data still includes an Employer-password fallback; CI must supply `PPK_EMPLOYER_LOGIN` and `PPK_EMPLOYER_PASSWORD` through its secret store. | Static review of [data/testData.json](../data/testData.json). |

---

## 14. Automation Candidates & Implementation Notes

Following [.github/instructions/copilot-instructions.md](../.github/instructions/copilot-instructions.md) conventions:

- **Page Objects to create under `pages/`:** `BasePage.ts` (does not exist yet — create first), `LoginPage.ts`, `EmployerDashboardPage.ts`, `ParticipantListPage.ts`, `FileUploadPage.ts`, `ReportsPage.ts`, `ReturnedFilesPage.ts`, `DocumentsPage.ts`, `PasswordChangePage.ts`, `UserAdminPage.ts`, `RegistrationWizardPage.ts`.
- **Fixtures:** add page-object wiring to `fixtures/pagesFixtures.ts` (create if missing) rather than constructing page objects inline in specs.
- **Test data:** extend `data/testData.json` (or split into `data/employerTestData.json`) with the IDs from Section 3; keep passwords out of the repo where possible by preferring environment variables, matching the existing `PPK_LOGIN`/`PPK_PASSWORD` pattern.
- **Suggested spec files:** `tests/auth.spec.ts` (TC-AUTH), `tests/navigation-access.spec.ts` (TC-NAV), `tests/participant-list.spec.ts` and `tests/file-upload.spec.ts` (TC-LIST), `tests/registration-wizard.spec.ts` (TC-FORM), `tests/password-change.spec.ts` (TC-PWD), `tests/reports.spec.ts` (TC-REPORT), `tests/documents.spec.ts` (TC-DOCS), `tests/settings.spec.ts` (TC-SETTINGS).

**Ready to automate now (stable, non-mutating, or self-cleaning):**
TC-AUTH-001..008, TC-NAV-001..004, TC-LIST-001..004/006, TC-REPORT-001/003/004 (assertion-only, no "Generuj raport" click), TC-DOCS-001 (link presence, skip actually downloading in CI), TC-SETTINGS-001..003, TC-FLOW-001/002/005.

**Automate with care / needs a disposable data plan first:**
TC-FORM-001..005 (registration wizard mutates the participant list for a real employer — either find/request a disposable test PESEL range, or stop each test at the first client-side validation error without ever reaching "Dalej" successfully), TC-PWD-001/TC-FLOW-003 (must reliably restore the original password even on failure), TC-LIST-005 file upload with a real file (needs a disposable sample file and awareness that uploads "can only be deleted within an hour" per the on-page notice).

**Manual / exploratory only for now:**
TC-FORM-006..014 full submissions (each mutates live payroll/contribution data for a real employer — confirm with the product owner whether a disposable sandbox employer exists before automating beyond the smoke-load checks already listed).

---

## 15. TC-MENU — Complete Menu and Screen Coverage

**Scope:** Run each case in a fresh Employer session. Assert the Polish UI labels exactly as displayed. Do not perform a final state-changing submission without disposable data and the listed cleanup.

### TC-MENU-001 — Authenticated shell and Menu overlay

- **Priority:** P1 — Critical
- **Test ID:** TC-MENU-001
- **Title:** Verify the authenticated shell and every Menu entry
- **Objective:** Verify the global header, menu groups, support details, and logout action.
- **Preconditions:** Authenticated as U1/P1 on `/employer`.
- **Steps:**
	1. Verify the company name, `Koniec sesji za`, last successful-login message, and `Wyloguj`.
	2. Click `Menu`; verify sections `Panel administracyjny`, `PPK`, `Ustawienia`, and `Dyspozycje`.
	3. Verify every displayed menu link and its route against Section 2.
	4. Verify the adviser name, phone, email, customer-service phone, service hours, and last failed-login message.
	5. Click `Menu` again and verify it closes without navigation.
- **Expected result:** All global controls and all current menu routes are visible and usable.
- **Cleanup:** None.

### TC-MENU-002 — Dashboard cards and destinations

- **Priority:** P2 — High
- **Test ID:** TC-MENU-002
- **Title:** Verify each dashboard card and destination
- **Objective:** Verify labels, descriptions, and internal/external navigation from the dashboard.
- **Preconditions:** Authenticated as U1/P1 on `/employer`.
- **Steps:**
	1. Verify cards `Przekazanie plików`, `Dyspozycje`, `Podgląd Uczestników`, `Raporty`, `Pliki zwrotne od Nationale-Nederlanden`, `Dokumenty`, `Materiały informacyjne`, `Dane dotyczące umowy i wpłat do PPK`, `Uprawnienia`, and `Szkolenia`.
	2. Open every internal card; verify its URL and level-1 heading, then return to the dashboard.
	3. Open `Dyspozycje`; verify the same ten entries as in `Menu` without a broken navigation.
	4. Open `Materiały informacyjne` and `Szkolenia`; verify a non-empty external page or document opens in a separate tab.
- **Expected result:** Each card has the expected description and working destination.
- **Cleanup:** Close external tabs.

### TC-MENU-003 — Administration, file upload, and participant list

- **Priority:** P1 — Critical
- **Test ID:** TC-MENU-003
- **Title:** Verify list screens, filters, tables, and safe actions
- **Objective:** Verify all list-screen controls without creating or changing business data.
- **Preconditions:** Authenticated as U1/P1.
- **Steps:**
	1. Open `Lista użytkowników`; verify its six columns, `Dodaj użytkownika`, `Pokaż pozycji`, `Szukaj:`, and enabled pagination. Change page size, search U1, clear search, and use `Next`/`Previous`.
	2. Open `Dodaj użytkownika`; verify every displayed field, select, checkbox, and action, then leave without submitting.
	3. Open `Przekazanie plików`; verify the upload input, instructions, action, history heading, six history columns, `Nazwa pliku`, date filters, `Wyszukaj`, row actions, and downloads. Test a name filter, valid/reversed dates, and a non-empty history download.
	4. In a disposable environment, upload one supported file, assert its result/history entry, then delete it if the UI permits.
	5. Open `Podgląd Uczestników`; verify defaults `Rezygnacja = Wszystkie` and `Zatrudniony = TAK`, filters `Imię`, `Nazwisko`, `PESEL`, both dropdowns, `Wyszukaj`, every table header, `Pokaż pozycji`, `Szukaj:`, pagination, and each `Zlecenie` action.
	6. For every text filter, test an unmatched value and clearing it. For each dropdown, test first, last, and `Wszystkie`; click each sortable column twice; open and cancel every row action.
- **Expected result:** Filters, sort, search, pagination, downloads, and cancellation paths show observable correct states without persisting unintended data.
- **Cleanup:** Clear all filters; delete the disposable upload.

### TC-MENU-004 — Reports, documents, footer, and settings

- **Priority:** P2 — High
- **Test ID:** TC-MENU-004
- **Title:** Verify reports, static resources, and account settings
- **Objective:** Verify every report selection, returned-file card, document/footer destination, and settings control.
- **Preconditions:** Authenticated as U1/P1.
- **Steps:**
	1. Open `Raporty`; verify `Nazwa raportu:`, each REPORT1..5 option, dependent state/route, and `Generuj raport`. Generate only with disposable data and validate non-empty downloads.
	2. Open `Pliki zwrotne od Nationale-Nederlanden`; verify every `returnedFileReports` card. Open each, verify date inputs, actions, close/cancel behavior, and valid, empty, reversed, and future ranges.
	3. Open `Dokumenty`; verify every section and document link. Verify each response is successful, non-empty, and has an appropriate content type.
	4. Verify `Bezpieczeństwo`, `Polityka cookies`, `Kontakt`, and `Regulamin` from authenticated and logged-out pages. Each must show content or a non-empty PDF without an error response.
	5. Open `Dane dotyczące umowy i wpłat do PPK` and verify every visible label/value is read-only; open `Wspólne logowanie` and verify Superlogin text, table, and controls.
	6. Open `Zmiana hasła`; verify all three fields, both buttons, and every policy rule. Run PW2..PW8 and assert visible validation, then use `Powrót` without changing credentials.
	7. Open `Zaufane urządzenia`; verify columns, `Pokaż pozycji`, `Szukaj:`, pagination, and every device action without confirming a destructive action.
- **Expected result:** All resources resolve, selections open the expected controls, settings are correctly read-only or validated, and no change is persisted by cancel paths.
- **Cleanup:** Close dialogs/tabs, clear searches, and do not alter password or trusted devices.

### TC-MENU-005 — Registration wizard and every Dispositions screen

- **Priority:** P1 — Critical
- **Test ID:** TC-MENU-005
- **Title:** Verify all disposition forms and safe validation paths
- **Objective:** Verify fields, default values, validation, breadcrumbs, and cancel/back behavior for every Dispositions menu item.
- **Preconditions:** Fresh session as U1/P1; no final submission without disposable participant/payroll data.
- **Steps:**
	1. Open `Zgłoszenie pracownika`; verify `Home`/`Dyspozycje` breadcrumbs, information message, `Dalej`, and all controls under `Dane uczestnika`, `Adres zamieszkania`, correspondence-address choice, and `Rejestracja`.
	2. Verify dropdown defaults plus empty, first, and last options. Submit empty fields and then test PESEL1..4, DATE1..3, EMAIL1..3, PHONE1, whitespace, and max-length boundaries. After each invalid value, correct it and verify the error clears without advancing.
	3. Open `Zgłoszenie wpłat`; verify `Wpłata za okres (RRRR-MM)`, every contribution-table header, `Dodaj kolejną wpłatę`, and `Dalej`. Test empty/invalid period; add an editable row and cancel/remove it before submission.
	4. Open `Zgłoszenie korekt do wpłat`, `Wznowienie odprowadzania wpłat`, `Zmiana wysokości wpłaty podstawowej Pracownika`, `Deklaracja wpłaty dodatkowej Pracownika`, `Zmiana danych`, `Wypłata transferowa do Nationale-Nederlanden`, and `Zakończenie lub wznowienie zatrudnienia`.
	5. On each screen verify its level-1 heading, both breadcrumbs, every visible input/select/radio/checkbox/table/button, required-field validation, and `Dalej`, `Wstecz`, `Anuluj`, or `Powrót` behavior without final submission.
	6. Open `Rezygnacja z odprowadzania wpłat`; verify the documented HTTP 403 and `Brak dostępu!`, while confirming the menu still advertises the link (KI-5).
	7. Click `Dyspozycje` breadcrumb on each disposition screen and record the current Whitelabel error as KI-6 until an overview route exists.
- **Expected result:** Permitted forms show all expected controls and block invalid data. The denied route and broken breadcrumb remain explicit defects, not passing automation.
- **Cleanup:** Cancel or leave every wizard before final submit; create no participant or payroll data.

---

## 16. TC-FI — Financial Institution

**Scope:** The Financial Institution role uses the same configured `baseURL`; valid credentials open the landing page without SMS OTP. Continue inventory-driven implementation one case at a time; do not infer controls or routes that have not been observed in a live session.

### TC-FI-001 — Valid Financial Institution login opens the landing page without OTP

- **Priority:** P1 — Critical
- **Type:** Positive authentication
- **Preconditions:** No active session; open `/ppk-nnpte2/nnpte/login`.
- **Test data:** Financial Institution login and password supplied through `PPK_FINANCIAL_INSTITUTION_LOGIN` and `PPK_FINANCIAL_INSTITUTION_PASSWORD`.

| # | Step | Expected Result |
|---|------|-----------------|
| 1 | Fill `Identyfikator` and `Hasło` with valid Financial Institution credentials. | Both values are accepted by the login form. |
| 2 | Click `Zaloguj się`. | Browser navigates directly to `/ppk-nnpte2/nnpte/manager/login/fork`; no SMS OTP screen appears. |
| 3 | Verify the landing page. | Page title and visible card heading are `Panel Instytucji Finansowej`. |
| 4 | Verify the second landing card. | `Podgląd Pracodawców` is visible. |
| 5 | Verify card destinations without navigating. | `Panel Instytucji Finansowej` links to `/manager/contract/list/awaiting`; `Podgląd Pracodawców` links to `/manager/employer/list`. |

- **Expected result:** Valid Financial Institution credentials create an authenticated session and show both documented landing cards without OTP.
- **Cleanup:** Log out when the test session is shared with subsequent tests.
- **Notes / Observations:** Observed live on 2026-09-09; `Menu` exposes `Uprawnienia`, `PPK`, `Dyspozycje`, `Ustawienia`, and `Kontakt`. These areas require separate inventory and test cases.

