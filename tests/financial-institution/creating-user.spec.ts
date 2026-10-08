import { test, expect } from '../../fixtures/pagesFixtures';
import testData from '../../data/testData.json';

const ALL_PERMISSIONS = [
    'Przeglądanie listy użytkownik',
    'Dodawanie użytkowników',
    'Edycja danych użytkowników',
    'Dezaktywacja użytkowników',
    'Resetowanie haseł użytkowników',
    'Lista umów zaakceptowanych',
    'Lista umów oczekujących',
    'Lista umów anulowanych',
    'Wyświetlenie szczegółów umowy',
    'Raport z bieżącym stanem umów',
    'Raport administratorów i uż',
    'Składanie dyspozycji',
    'Tworzenie grup uprawnień',
    'Weryfikacja umowy',
    'Akceptacja umowy',
    'Anulowanie umowy',
    'Dodanie notatek',
    'Obsługa umów niestandardowych',
    'Dodanie kodu promotora',
    'Przekazanie umowy do',
    'Raport informacji o linkach',
    'Zmiana danych pracodawcy',
    'Raport przesłanych korekt',
    'Zmiana danych reprezentacji',
    'Raport z rozliczenia składek',
    'Rozwiązywanie umów',
    'Dostęp do Podglądu Pracodawców',
    'Akceptowanie zleceń Uczestnik',
    'Opiekun klienta',
];

test.describe('TC-FI — Financial Institution authentication', () => {

    test('TC001-PG - Create Permission Group', async ({
        loginAsFinancialInstitution,
        permissionGroupsPage,
    }) => {

        await loginAsFinancialInstitution();

        await permissionGroupsPage.openMenu();
        await permissionGroupsPage.menuLink('Grupy uprawnień').click();

        await expect(
            permissionGroupsPage.heading
        ).toBeVisible();

        await permissionGroupsPage.createGroupLink.click();

        await expect(
            permissionGroupsPage.editHeading
        ).toBeVisible();

        const groupName = `automation-group-${Date.now()}`;

        await permissionGroupsPage.groupNameInput.fill(groupName);

        for (const permission of ALL_PERMISSIONS) {
            await permissionGroupsPage.permission(permission).click();
        }

        await permissionGroupsPage.saveGroupButton.click();

        await permissionGroupsPage.searchBox.fill(groupName);

        await expect(
            permissionGroupsPage.groupCell(groupName)
        ).toBeVisible();
    });

    test('TC002-PG - Validate Required Permission Group Name', async ({
        loginAsFinancialInstitution,
        permissionGroupsPage,
    }) => {

        await loginAsFinancialInstitution();

        await permissionGroupsPage.openMenu();
        await permissionGroupsPage.menuLink('Grupy uprawnień').click();


        await permissionGroupsPage.createGroupLink.click();
        await permissionGroupsPage.permission('Dodawanie użytkowników').click();
        await permissionGroupsPage.saveGroupButton.click();

        await permissionGroupsPage.groupNameInput.fill('6354');
        await permissionGroupsPage.saveGroupButton.click();
        await expect(permissionGroupsPage.descriptionError).toBeVisible();
        await permissionGroupsPage.permission('Dodawanie użytkowników').click();
        await permissionGroupsPage.groupNameInput.fill('6354ABC');
        await permissionGroupsPage.saveGroupButton.click();
        await expect(permissionGroupsPage.missingPermissionError).toBeVisible();
    });

    test('TC004-PG - Create Permission Group If Not Exists', async ({
        loginAsFinancialInstitution,
        permissionGroupsPage,
    }) => {

        const groupName = 'automation-group';

        await loginAsFinancialInstitution();

        await permissionGroupsPage.openMenu();
        await permissionGroupsPage.menuLink('Grupy uprawnień').click();

        await permissionGroupsPage.searchBox.fill(groupName);

        const groupExists = await permissionGroupsPage.groupCell(groupName)
            .isVisible()
            .catch(() => false);

        if (!groupExists) {

            await permissionGroupsPage.createGroupLink.click();

            await permissionGroupsPage.groupNameInput.fill(groupName);

            for (const permission of ALL_PERMISSIONS) {
                await permissionGroupsPage.permission(permission).click();
            }

            await permissionGroupsPage.saveGroupButton.click();

            await permissionGroupsPage.searchBox.fill(groupName);
        }

        await expect(
            permissionGroupsPage.groupCell(groupName)
        ).toBeVisible();
    });


    test('TC006-CU - Create User', async ({
        loginAsFinancialInstitution,
        employerUserAdminPage,
    }) => {

        await loginAsFinancialInstitution();

        await employerUserAdminPage.openMenu();
        await employerUserAdminPage.menuLink('Użytkownicy').click();
        await employerUserAdminPage.addUserLink.click();

        await employerUserAdminPage.loginInput.fill('test.user');

        await employerUserAdminPage.nameInput.fill('Jan Kowalski');

        await employerUserAdminPage.emailInput.fill('jan.kowalski@test.pl');

        await employerUserAdminPage.phoneInput.fill('500123456');

        await employerUserAdminPage.permissionGroupSelect.selectOption('automation-group');

        await expect(employerUserAdminPage.permissionsList).toMatchAriaSnapshot(`
    - list:
      - listitem: Akceptacja umowy
      - listitem: Dezaktywacja użytkowników
      - listitem: Resetowanie haseł użytkowników
      - listitem: Raport administratorów i użytkowników aplikacji
      - listitem: Zmiana danych pracodawcy
      - listitem: Składanie dyspozycji pracowników
      - listitem: Dostęp do Podglądu Pracodawców
      - listitem: Lista umów anulowanych
      - listitem: Dodanie kodu promotora
      - listitem: Zmiana danych reprezentacji
      - listitem: Tworzenie grup uprawnień
      - listitem: Przekazanie umowy do akceptacji PZ
      - listitem: Raport przesłanych korekt
      - listitem: Rozwiązywanie umów
      - listitem: Raport z bieżącym stanem umów
      - listitem: Weryfikacja umowy
      - listitem: Lista umów oczekujących
      - listitem: Obsługa umów niestandardowych
      - listitem: Raport informacji o linkach
      - listitem: Dodawanie użytkowników
      - listitem: Edycja danych użytkowników
      - listitem: Akceptowanie zleceń Uczestników
      - listitem: Przeglądanie listy użytkowników
      - listitem: Lista umów zaakceptowanych
      - listitem: Anulowanie umowy
      - listitem: Wyświetlenie szczegółów umowy
      - listitem: Opiekun klienta
      - listitem: Raport z rozliczenia składek
      - listitem: Dodanie notatek
    `);
        await expect(
            employerUserAdminPage.permissionsList.getByText(
                'Brakuje pasujacej grupy uprawnień? Utwórz nową grupę uprawnień'
            )
        ).toBeVisible();

        await employerUserAdminPage.saveUserButton.click();
        await employerUserAdminPage.tableSearch.fill('Jan Kowalski');
        await expect(employerUserAdminPage.userCell('Jan Kowalski')).toBeVisible();
        await expect(employerUserAdminPage.userCell('test.user')).toBeVisible();
        await expect(employerUserAdminPage.userCell('jan.kowalski@test.pl')).toBeVisible();
        await employerUserAdminPage.deleteLink.click();
        await expect(employerUserAdminPage.deletionPrompt).toBeVisible();
        await expect(employerUserAdminPage.deletionHeading).toBeVisible();
        await employerUserAdminPage.deleteUserButton.click();
        await expect(employerUserAdminPage.userDeletedMessage).toBeVisible();
    });


});