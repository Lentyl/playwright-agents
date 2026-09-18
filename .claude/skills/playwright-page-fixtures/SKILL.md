---
name: playwright-page-fixtures
description: 'Use when creating or refactoring Playwright tests that should use a fixtures folder, a pagesFixtures.ts file, page objects from tests/pages, and shared test data encapsulation.'
user-invocable: true
---

# Playwright Page Fixtures

## When to Use
- Create or refactor Playwright tests that should use page object instances instead of inline selectors.
- Add a fixtures folder when the project does not already have one.
- Create or extend a `pagesFixtures.ts` file when page object instances need to be shared across tests.
- Keep test data, page object construction, and test logic separated.

## Core Rule
Tests should not construct page objects repeatedly inside each spec when a fixture can provide them.
The goal is to encapsulate setup, keep specs readable, and make page interactions reusable.
Define fixtures only in the fixture file. Specs should import the fixture-backed test and use the provided fixture methods or instances only.

## Required Workflow
1. Inspect the existing Playwright structure.
2. If there is no `fixtures/` folder at the project root, create it.
3. If `pagesFixtures.ts` does not exist, create it inside `fixtures/`.
4. Import page classes from the root `pages/` directory and instantiate them once in the fixture layer.
5. Expose those instances through typed Playwright fixtures.
6. Import `test` and `expect` from the local fixtures module in spec files.
7. Keep assertions and scenario steps in the spec, while keeping repeated page setup in fixtures or page objects.
8. Do not define fixtures inside spec files.

## Preferred Project Layout
```text
fixtures/
  pagesFixtures.ts
  authFixture.ts     ← authentication session setup (if needed separately)
helpers/
  mailhog.ts         ← generic reusable helpers
pages/
  BasePage.ts
  LoginPage.ts
  EmployerPage.ts
  OtpPage.ts
tests/
  *.spec.ts
data/
  testData.json
```

## Example pagesFixtures.ts
```ts
import { test as pageTest } from "@playwright/test";
import LogInPage from "../pages/LogInPage";
import MainPage from "../pages/MainPage";
import MailHogPage from "../pages/MailHogPage";
import HistoryPage from "../pages/HistoryPage";
import ProfilePage from "../pages/ProfilePage";
import LoginUniqaPage from "../pages/LoginUniqaPage"


type pages = {
  loginUniqaPage: LoginUniqaPage;
  utils: Utils;
  mailHogPage: MailHogPage;
  logInPage: LogInPage;
  mainPage: MainPage;
}

const testPages = pageTest.extend<pages>({

    loginUniqaPage: async ({ page }, use) => {
    await use(new LoginUniqaPage(page))
  },

  mailHogPage: async ({ page }, use) => {
    await use(new MailHogPage(page))
  },

  utils: async ({ page }, use) => {
    await use(new Utils(page))
  },

  logInPage: async ({ page }, use) => {
    await use(new LogInPage(page))
  },

  mainPage: async ({ page }, use) => {
    await use(new MainPage(page))
  },

});

export const test = testPages;
```

## Fixture Design Rules
- Keep all fixture-related files in the root `fixtures/` directory. This includes `pagesFixtures.ts`, any authentication fixture files, and any other shared fixture modules. Never place fixture files inside `tests/` or any subdirectory.
- Keep authentication or session setup separate from page-object construction when both exist.
- Build page objects once per test context and pass the same instances to the spec.
- Use explicit names for fixture properties, such as `loginPage`, `employerPage`, `otpPage`, and `documentsPage`.
- Prefer one fixture module that aggregates shared page instances over duplicated setup inside multiple specs.
- If the project already has a `tests/fixtures.ts`, migrate it to `fixtures/authFixture.ts` and update all imports.

## Page Object Rules
- Put selectors and page actions in classes under the root `pages/` directory.
- Let page objects extend a shared base class (`BasePage`) when navigation helpers are reusable.
- Keep selectors stable and semantic, using roles, labels, and accessible names before brittle CSS paths.
- Expose behavior through methods such as `login()`, `goto()`, or `searchEmployee()` instead of repeating locator chains in tests.

## Test Writing Rules
- Import the fixture-backed `test` from the local fixtures module.
- Use the provided page object instances directly in the test body.
- Call only the fixture-backed methods and instances exposed by the fixture module.
- Keep the spec focused on behavior, assertions, and data variations.
- Avoid creating page objects with `new` inside every test unless the fixture cannot reasonably provide them.
- Use shared test data from the project data layer instead of hardcoding values in the spec.

## Example Pattern
```ts
import { test, expect } from '../fixtures/pagesFixtures';

test('employer dashboard loads', async ({ page, employerPage }) => {
  await employerPage.goto();
  await expect(page.getByRole('heading', { level: 2, name: 'Wyszukaj pracownika' })).toBeVisible();
  await expect(employerPage.searchInput).toBeVisible();
});
```

## Validation Checklist
- Confirm the fixtures module exports the page objects used by the specs.
- Confirm `pages/` at the project root contains the page classes referenced by the fixture.
- Confirm specs import the local fixture module instead of `@playwright/test` directly.
- Confirm the fixture file is the single place where repeated page construction and fixture definitions live.