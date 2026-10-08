# Panel pracodawcy - przypadki testowe

## TC001 - Wgrywanie pliku - poprawna próba

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Przekazanie plików".
2. Użytkownik naciska przycisk "Wybierz plik".
3. Użytkownik wybiera plik do przekazania.
4. Użytkownik naciska przycisk "Prześlij plik".

### Oczekiwany rezultat

Pojawia się komunikat "Przesyłanie pliku zakończone powodzeniem".

Dodatkowo:

- dla pliku zawierającego składkę pracownika pojawia się suma składek zawarta w pliku;
- dla pliku rejestracyjnego bez adresu e-mail lub numeru telefonu pojawia się komunikat: "W przypadku X uczestników brakuje numeru telefonu lub adresu e-mail. Uzupełnij dane, a dzięki temu uczestnicy łatwiej aktywują dostęp do Moje NN.";
- dla pliku ze składkami o nieprawidłowej proporcji pojawia się komunikat z informacją, że stosunek wpłaty pracodawcy do wpłaty pracownika powinien wynosić 0,75, numerem kadrowym uczestnika oraz przyciskami potwierdzenia lub odrzucenia przesłania pliku.

## TC002 - Wgrywanie pliku - niepoprawna próba

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Przekazanie plików".
2. Użytkownik naciska przycisk "Wybierz plik".
3. Użytkownik wybiera plik do przekazania.
4. Użytkownik naciska przycisk "Prześlij plik".

### Oczekiwany rezultat

Pojawia się komunikat informujący o błędach rozszerzenia lub zawartości pliku. Plik nie zostaje przesłany.

## TC003 - Usuwanie przesłanego pliku

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy. Wybrany plik został przesłany nie później niż 60 minut temu.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Przekazanie plików".
2. Użytkownik naciska przycisk "Usuń" obok wybranego pliku na liście pod wyszukiwarką.
3. Użytkownik naciska przycisk "Usuń plik" w oknie pop-up.

### Oczekiwany rezultat

Pod wyszukiwarką pojawia się komunikat informujący o usunięciu pliku.

## TC004 - Podgląd uczestników

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Podgląd uczestników".
2. Użytkownik uzupełnia filtry w rozwiniętej wyszukiwarce.
3. Użytkownik naciska przycisk "Wyszukaj".

### Oczekiwany rezultat

Pojawia się lista uczestników spełniających kryteria wyszukiwania. Każdy element listy zawiera przycisk "Zlecenie", po którego kliknięciu rozwija się lista dyspozycji możliwych do wykonania dla danego uczestnika.

Jeżeli żaden uczestnik nie spełnia kryteriów, zamiast listy pojawia się komunikat "Nie znaleziono pasujących pozycji".

## TC005 - Dyspozycja zgłoszenia pracownika

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Dyspozycje".
2. Użytkownik naciska kafelek "Zgłoszenie pracownika".
3. Użytkownik uzupełnia formularz danymi pracownika.
4. Użytkownik naciska przycisk "Dalej".
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji oraz przycisk powrotu do menu głównego. Dane pracownika zostają zapisane jako plik XML w historii przekazanych plików.

## TC006 - Dyspozycja zgłoszenia wpłat - jeden uczestnik

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Dyspozycje".
2. Użytkownik naciska kafelek "Zgłoszenie wpłat".
3. Użytkownik naciska przycisk "Dodaj kolejną wpłatę".
4. Użytkownik wprowadza kryteria uczestnika w wyszukiwarce lub pozostawia pola puste.
5. Użytkownik naciska przycisk "Szukaj".
6. Użytkownik naciska przycisk "Wybierz" na elemencie listy.
7. Użytkownik uzupełnia formularz.
8. Użytkownik naciska przycisk "Dalej".
9. Użytkownik naciska przycisk "Tak" w komunikacie pop-up, jeżeli taki komunikat się pojawi.
10. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji oraz przycisk powrotu do menu głównego. Dane składkowe zostają zapisane jako plik XML w historii przekazanych plików.

Jeżeli proporcja składek jest nieprawidłowa, pojawia się komunikat z numerem PESEL uczestnika oraz przyciskami potwierdzenia lub odrzucenia przesłania dyspozycji.

## TC007 - Dyspozycja zgłoszenia wpłat - kilku uczestników jednocześnie

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Dyspozycje".
2. Użytkownik naciska kafelek "Zgłoszenie wpłat".
3. Użytkownik naciska przycisk "Dodaj kolejną wpłatę".
4. Użytkownik wyszukuje pierwszego uczestnika i naciska "Wybierz".
5. Użytkownik naciska przycisk "Dodaj kolejną wpłatę".
6. Użytkownik wyszukuje drugiego uczestnika i naciska "Wybierz".
7. Użytkownik uzupełnia formularz.
8. Użytkownik naciska przycisk "Dalej".
9. Użytkownik naciska przycisk "Tak" w komunikacie pop-up, jeżeli taki komunikat się pojawi.
10. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji oraz przycisk powrotu do menu głównego. Dane składkowe uczestników zostają zapisane jako plik XML w historii przekazanych plików.

## TC008 - Dyspozycja zgłoszenia wpłat - uczestnik z obniżoną wpłatą

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Zgłoszenie wpłat".
2. Użytkownik dodaje uczestnika do formularza.
3. Użytkownik uzupełnia formularz.
4. Użytkownik zaznacza checkbox "Uczestnik z obniżoną wpłatą".
5. Użytkownik naciska przycisk "Dalej".
6. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Dla uczestnika z zaznaczonym checkboxem nie pojawia się komunikat o nieprawidłowej proporcji składek. Dyspozycja zostaje złożona, a dane zapisują się jako plik XML w historii przekazanych plików.

## TC009 - Dyspozycja zgłoszenia korekt do wpłat - jeden uczestnik

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Zgłoszenie korekt do wpłat".
2. Użytkownik naciska przycisk "Dodaj kolejną korektę".
3. Użytkownik wyszukuje uczestnika i naciska "Wybierz".
4. Użytkownik uzupełnia formularz.
5. Użytkownik naciska przycisk "Dalej".
6. Użytkownik naciska przycisk "Tak" w komunikacie pop-up, jeżeli taki komunikat się pojawi.
7. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, a dane składkowe zostają zapisane jako plik XML w historii przekazanych plików. Przy nieprawidłowej proporcji pojawia się komunikat z numerem PESEL uczestnika oraz opcją potwierdzenia lub odrzucenia wysłania.

## TC010 - Dyspozycja zgłoszenia korekt do wpłat - kilku uczestników jednocześnie

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Zgłoszenie korekt do wpłat".
2. Użytkownik dodaje pierwszego uczestnika przez "Dodaj kolejną korektę", wyszukiwarkę i "Wybierz".
3. Użytkownik dodaje drugiego uczestnika w ten sam sposób.
4. Użytkownik uzupełnia formularz.
5. Użytkownik naciska przycisk "Dalej".
6. Użytkownik naciska przycisk "Tak" w komunikacie pop-up, jeżeli taki komunikat się pojawi.
7. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, a dane uczestników zostają zapisane jako plik XML w historii przekazanych plików.

## TC011 - Dyspozycja zgłoszenia korekt do wpłat - uczestnik z obniżoną wpłatą

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Zgłoszenie korekt do wpłat".
2. Użytkownik dodaje uczestnika i uzupełnia formularz.
3. Użytkownik zaznacza checkbox "Uczestnik z obniżoną wpłatą".
4. Użytkownik naciska przycisk "Dalej".
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Dla uczestnika z zaznaczonym checkboxem nie pojawia się komunikat o nieprawidłowej proporcji składek. Dyspozycja zostaje złożona, a dane zapisują się jako plik XML w historii przekazanych plików.

## TC012 - Dyspozycja zmiany danych uczestnika

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Dyspozycje".
2. Użytkownik naciska kafelek "Zmiana danych".
3. Użytkownik wyszukuje uczestnika i wybiera go z listy.
4. Użytkownik uzupełnia formularz nowymi danymi.
5. Użytkownik naciska przycisk "Dalej".
6. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, odnośnik do pobrania potwierdzenia PDF oraz przycisk przejścia do podglądu listy uczestników.

## TC013 - Dyspozycja wypłaty transferowej do Nationale-Nederlanden

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Wypłata transferowa do Nationale-Nederlanden".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik uzupełnia formularz parametrami wypłaty transferowej.
4. Użytkownik naciska przycisk "Dalej".
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, odnośnik do pobrania potwierdzenia PDF oraz przycisk przejścia do podglądu listy uczestników.

## TC014 - Dyspozycja wypłaty transferowej na obecny numer rachunku

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera formularz "Wypłata transferowa do Nationale-Nederlanden".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik uzupełnia formularz parametrami wypłaty transferowej.
4. W polu "Nr rachunku PPK w poprzedniej instytucji finansowej" użytkownik wpisuje obecny numer rachunku uczestnika.
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pod polem pojawia się komunikat "Rachunek PPK w poprzedniej instytucji finansowej powinien być różny od obecnego".

## TC015 - Dyspozycja zakończenia lub wznowienia zatrudnienia

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Zakończenie lub wznowienie zatrudnienia".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik uzupełnia formularz.
4. Użytkownik naciska przycisk "Dalej".
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, odnośnik do pobrania potwierdzenia PDF oraz przycisk przejścia do podglądu listy uczestników.

## TC016 - Dyspozycja rezygnacji z dokonywania wpłat

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Rezygnacja z odprowadzania wpłat".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, odnośnik do pobrania potwierdzenia PDF oraz przycisk przejścia do podglądu listy uczestników.

## TC017 - Dyspozycja wznowienia odprowadzania wpłat

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Wznowienie odprowadzania wpłat".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, odnośnik do pobrania potwierdzenia PDF oraz przycisk przejścia do podglądu listy uczestników.

## TC018 - Dyspozycja deklaracji wpłaty dodatkowej pracownika

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Deklaracja wpłaty dodatkowej Pracownika".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik wpisuje w polu "Deklarowana wpłata dodatkowa" wartość mniejszą lub równą 2.
4. Użytkownik naciska przycisk "Dalej".
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, odnośnik do pobrania potwierdzenia PDF oraz przycisk przejścia do podglądu listy uczestników.

## TC019 - Dyspozycja deklaracji wpłaty dodatkowej - nieprawidłowa wysokość

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera formularz "Deklaracja wpłaty dodatkowej Pracownika".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik wpisuje w polu "Deklarowana wpłata dodatkowa" wartość większą niż 2.
4. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pod polem pojawia się komunikat "Wpłata dodatkowa nie może przekroczyć 2% wynagrodzenia".

## TC020 - Dyspozycja zmiany wysokości wpłaty podstawowej pracownika - wartość poprawna

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Dyspozycje" > "Zmiana wysokości wpłaty podstawowej Pracownika".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik wpisuje w polu "Deklarowana wpłata podstawowa" wartość mniejszą lub równą 2.
4. Użytkownik naciska przycisk "Dalej".
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pojawia się informacja o poprawnie złożonej dyspozycji, odnośnik do pobrania potwierdzenia PDF oraz przycisk przejścia do podglądu listy uczestników.

## TC021 - Dyspozycja zmiany wysokości wpłaty podstawowej - wartość niepoprawna

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera formularz "Zmiana wysokości wpłaty podstawowej Pracownika".
2. Użytkownik wyszukuje uczestnika i wybiera go z listy.
3. Użytkownik wpisuje w polu "Deklarowana wpłata podstawowa" wartość większą niż 2.
4. Użytkownik naciska przycisk "Dalej".
5. Użytkownik naciska przycisk "Dalej".

### Oczekiwany rezultat

Pod polem pojawia się komunikat "Wpłata podstawowa nie może przekroczyć 2% wynagrodzenia".

## TC022 - Podgląd danych dotyczących umowy i wpłat do PPK

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Dane dotyczące umowy i wpłat do PPK".

### Oczekiwany rezultat

Pojawia się ekran z informacjami o podmiocie zatrudniającym i uczestnictwie w PPK.

## TC023 - Pobranie raportu Id EPPK uczestników

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik naciska kafelek "Raport Id EPPK uczestników".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC024 - Pobranie raportu wypłaty transferowej

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik wybiera "Raport wypłata transferowa".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC025 - Pobranie raportu wypłaty po 60 roku życia

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik wybiera "Raport wypłata 60 lat".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC026 - Pobranie raportu dotyczącego nierozliczonych wpłat

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik wybiera "Raport nierozliczonych wpłat".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC027 - Pobranie raportu z korekt

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik wybiera "Raport z korekt".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC028 - Pobranie raportu z błędnym stosunkiem wpłat

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik wybiera "Raport z błędnym stosunkiem wpłat".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC029 - Pobranie raportu z odrzuconych zleceń niefinansowych

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik wybiera "Raport z odrzuconych zleceń niefinansowych".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC030 - Pobranie raportu z rozliczonych wpłat z rezygnacją

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Pliki zwrotne od Nationale-Nederlanden".
2. Użytkownik wybiera "Raport z rozliczonych wpłat z rezygnacją".
3. Użytkownik naciska ikonę pobierania obok wybranego raportu.

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku w formacie przedstawionym na liście.

## TC031 - Brak plików do pobrania raportu

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Raporty błędów w zleceniach".
2. Użytkownik naciska dowolny kafelek z nazwą raportu.

### Oczekiwany rezultat

Pod kafelkami pojawia się komunikat "Brak plików do wyświetlenia".

## TC032 - Pobranie raportu uczestników

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Raporty".
2. Użytkownik wybiera z listy "Raport Uczestników".
3. Użytkownik naciska przycisk "Generuj raport".

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku.

## TC033 - Pobranie raportu z rozliczania składek

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Raporty".
2. Użytkownik wybiera "Raport z rozliczania składek".
3. Użytkownik wybiera zakres dat.
4. Użytkownik naciska przycisk "Generuj raport".

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku.

## TC034 - Pobranie raportu z historii zleceń uczestników

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Raporty".
2. Użytkownik wybiera "Raport z historii zleceń Uczestników".
3. Użytkownik wybiera zakres dat.
4. Użytkownik naciska przycisk "Generuj raport".

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku.

## TC035 - Pobranie raportu z historii wpłat uczestników

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Raporty".
2. Użytkownik wybiera "Raport z historii wpłat Uczestników".
3. Użytkownik wybiera zakres dat.
4. Użytkownik naciska przycisk "Generuj raport".

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku.

## TC036 - Pobranie raportu z uczestnictwa w funduszach

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik otwiera "Raporty".
2. Użytkownik wybiera "Raport z uczestnictwa w funduszach".
3. Użytkownik wybiera zakres dat.
4. Użytkownik naciska przycisk "Generuj raport".

### Oczekiwany rezultat

Rozpoczyna się pobieranie pliku.

## TC037 - Podgląd dokumentów

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Dokumenty".
2. Użytkownik pobiera dowolny dokument lub otwiera jego odnośnik.

### Oczekiwany rezultat

W zależności od dokumentu rozpoczyna się pobieranie pliku, dokument otwiera się w nowej karcie albo następuje przekierowanie do strony z informacjami.

## TC038 - Podgląd materiałów informacyjnych

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Materiały informacyjne".

### Oczekiwany rezultat

Otwiera się dokument PDF zawierający informacje dotyczące udziału nowego pracownika w PPK.

## TC039 - Otwarcie strony ze szkoleniami

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Szkolenia" albo otwiera "Autozapis" i naciska kafelek "Szkolenia".

### Oczekiwany rezultat

Otwiera się zewnętrzna strona z terminami i opisem szkoleń Nationale-Nederlanden: https://www.nn.pl/dla-firmy/ppk-dla-pracodawcy/szkolenia-z-ppk.

## TC040 - Dodawanie użytkownika do panelu pracodawcy

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy i ma uprawnienia administracyjne.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Uprawnienia".
2. Użytkownik naciska przycisk "Dodaj użytkownika".
3. Użytkownik uzupełnia formularz danymi i uprawnieniami nowego użytkownika.
4. Użytkownik naciska przycisk "Zapisz użytkownika".

### Oczekiwany rezultat

Następuje powrót do listy użytkowników. Nad listą pojawia się komunikat o prawidłowym dodaniu użytkownika. Dane logowania zostają wysłane do dodanego użytkownika.

## TC041 - Edycja użytkownika panelu pracodawcy

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy i ma uprawnienia administracyjne.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Uprawnienia".
2. Użytkownik naciska przycisk "Edytuj" przy wybranym użytkowniku.
3. Użytkownik uzupełnia formularz aktualnymi danymi i uprawnieniami.
4. Użytkownik naciska przycisk "Zapisz użytkownika".

### Oczekiwany rezultat

Następuje powrót do listy użytkowników. Nad listą pojawia się komunikat o prawidłowej edycji użytkownika.

## TC042 - Zmiana hasła użytkownika panelu pracodawcy

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy i ma uprawnienia administracyjne.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Uprawnienia".
2. Użytkownik naciska przycisk "Zmień hasło" przy wybranym użytkowniku.
3. Użytkownik naciska przycisk "WYŚLIJ HASŁO".

### Oczekiwany rezultat

Następuje powrót do listy użytkowników. Nad listą pojawia się komunikat o prawidłowym zresetowaniu hasła. Nowe tymczasowe hasło zostaje wysłane do użytkownika.

## TC043 - Usuwanie użytkownika z panelu pracodawcy

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy i ma uprawnienia administracyjne.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Uprawnienia".
2. Użytkownik naciska przycisk "Usuń" przy wybranym użytkowniku.
3. Użytkownik naciska przycisk "Usuń użytkownika".

### Oczekiwany rezultat

Następuje powrót do listy użytkowników. Nad listą pojawia się komunikat o prawidłowym usunięciu użytkownika.

## TC044 - Odblokowanie dostępu użytkownikowi z zablokowanym kontem

**Warunki wstępne:** W portalu pracodawcy są zarejestrowani co najmniej dwaj użytkownicy. Jeden ma zablokowane konto, a drugi jest zalogowany i ma uprawnienia administracyjne.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Uprawnienia".
2. Użytkownik naciska przycisk "Odblokuj dostęp" obok zablokowanego użytkownika.
3. Użytkownik naciska przycisk "Odblokuj użytkownika".

### Oczekiwany rezultat

Następuje powrót do listy użytkowników. Nad listą pojawia się komunikat o prawidłowym odblokowaniu dostępu.

## TC045 - Wspólne logowanie

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Ustawienia".
2. Użytkownik naciska kafelek "Wspólne logowanie".

### Oczekiwany rezultat

Otwiera się ekran wspólnego logowania z listą powiązanych użytkowników.

## TC046 - Zmiana hasła

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Ustawienia".
2. Użytkownik naciska kafelek "Zmiana hasła".
3. Użytkownik uzupełnia formularz.
4. Użytkownik naciska przycisk "Zmień hasło".

### Oczekiwany rezultat

Pojawia się komunikat o pomyślnej zmianie hasła oraz przycisk umożliwiający przejście do strony głównej.

## TC047 - Próba zmiany hasła bez spełnionych wymagań bezpieczeństwa

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Ustawienia".
2. Użytkownik naciska kafelek "Zmiana hasła".
3. Użytkownik uzupełnia formularz nowym hasłem niespełniającym wymagań bezpieczeństwa.

### Oczekiwany rezultat

Pole "Nowe hasło" zostaje podświetlone na czerwono, a przycisk "Zmień hasło" jest nieaktywny.

## TC048 - Usuwanie urządzenia zaufanego

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy. Na liście znajduje się co najmniej jedno zaufane urządzenie.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Ustawienia".
2. Użytkownik naciska kafelek "Zaufane urządzenia".
3. Użytkownik naciska przycisk "Usuń" obok urządzenia.
4. Użytkownik naciska przycisk "Usuń urządzenie".

### Oczekiwany rezultat

Zaufane urządzenie zostaje usunięte.

## TC049 - Podgląd uczestników objętych autozapisem

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Autozapis".
2. Użytkownik naciska kafelek "Podgląd Uczestników objętych autozapisem".
3. Użytkownik uzupełnia filtry w rozwiniętej wyszukiwarce.
4. Użytkownik naciska przycisk "Wyszukaj".

### Oczekiwany rezultat

Pojawia się lista uczestników spełniających kryteria. Każdy element listy zawiera przycisk "Zlecenie", który rozwija listę dyspozycji. Dla braku wyników pojawia się komunikat "Nie znaleziono pasujących pozycji".

## TC050 - Podgląd przewodnika po autozapisie

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Autozapis".
2. Użytkownik naciska kafelek "Podgląd Uczestników objętych autozapisem".

### Oczekiwany rezultat

Następuje przekierowanie na zewnętrzną stronę: https://www.nn.pl/dla-firmy/ppk-dla-pracodawcy/przewodnik-po-autozapisie.

## TC051 - Podgląd materiałów do pobrania

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Autozapis".
2. Użytkownik naciska kafelek "Materiały do pobrania".
3. Użytkownik pobiera dowolny dokument lub otwiera jego odnośnik.

### Oczekiwany rezultat

W zależności od dokumentu rozpoczyna się pobieranie pliku, dokument otwiera się w nowej karcie albo następuje przekierowanie do strony z informacjami.

## TC052 - Zamówienie plakatów i ulotek

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska kafelek "Autozapis".
2. Użytkownik naciska kafelek "Materiały do pobrania".
3. Użytkownik naciska przycisk "Zamów plakaty i ulotki".
4. Użytkownik uzupełnia formularz.
5. Użytkownik naciska przycisk "Dalej".
6. Użytkownik naciska przycisk "Złóż zamówienie" na kroku z podsumowaniem.

### Oczekiwany rezultat

Pojawia się pop-up z podziękowaniem za złożenie zamówienia oraz przycisk "Zamknij". Po jego kliknięciu następuje powrót do strony głównej. Administrator otrzymuje wiadomość e-mail ze szczegółami zamówienia.

## TC053 - Wylogowanie z panelu pracodawcy

**Warunki wstępne:** Użytkownik jest zalogowany w portalu pracodawcy.

### Kroki reprodukcji

1. Użytkownik naciska przycisk "Wyloguj" w prawym górnym rogu.

### Oczekiwany rezultat

Następuje powrót do strony logowania. Na formularzu logowania pojawia się komunikat "Zostałeś prawidłowo wylogowany".
