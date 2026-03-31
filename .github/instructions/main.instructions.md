---
description: General project instructions for the ai-presentation Playwright test suite. Load for any task involving tests, page objects, fixtures, or test plans.
applyTo: "**/*.ts,**/*.spec.ts,**/Pages/**,**/fixtures/**,**/tests/**,**/specs/**"
---

# ai-presentation — Playwright Test Suite

## Project Overview

End-to-end test automation project targeting **https://demoqa.com/** using Playwright + TypeScript. Follows the Page Object Model (POM) pattern with custom fixtures.

## Tech Stack

- **Language**: TypeScript
- **Test framework**: `@playwright/test`
- **Target app**: `https://demoqa.com/`
- **Browser**: Chrome (headless: false by default)

## Commands

```bash
# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/textbox.spec.ts

# Show HTML report
npx playwright show-report
```

No npm `scripts` are defined in `package.json` — always use `npx playwright test` directly.

## Directory Structure

```
tests/          # Spec files (.spec.ts) — one file per demoqa section
Pages/          # Page Object classes, all extending BasePage
  BasePage.ts   # Base class with shared dynamic locator helpers
  NavigationPage.ts # NavigationPage — card/left-nav navigation
fixtures/
  fixtures.ts   # Custom test fixture — extends base `test`, each page object is its own named fixture
specs/          # Markdown test plans (not executed — used for planning)
ai-output/      # AI-generated test scenario/case documents
```


## Playwright Config

- `testDir`: `./tests`
- `baseURL`: `https://demoqa.com/`
- `headless`: `false`
- `reporter`: `html`
- `retries`: 2 on CI, 0 locally
- Single project: **chrome** (Desktop Chrome channel)

## Key Conventions

### Imports
Always import `test` and `expect` from the fixtures file, not directly from Playwright:
```ts
import { test, expect } from '../fixtures/fixtures';
```

### Test structure
- Each test file corresponds to one demoqa section (e.g. `tests/textbox.spec.ts`)
- `test.beforeEach` navigates to `/` to reset state
- Test name pattern: `'[Card] -> [Section] - [scenario description]'`

```ts
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Elements -> Text Box - happy path', async ({ navigation, textBox }) => {
  await navigation.goTo('Elements', 'Text Box');
  // ...
});
```

### Methods invocation
- Use `await` for all Playwright actions and assertions
- for donamic locators, always `await` the locator before performing actions or assertions:
```ts
  await (await buttons.buttonDynamic('You have done a double click')).click();
  await expect(await buttons.buttonDynamic('You have done a double click')).toBeVisible();

```

### Navigation
Use `NavigationPage.goTo(cardName, itemName?)` to navigate from the home page:
```ts
await navigation.goTo('Elements', 'Text Box');   // home → card → left nav item
await navigation.goTo('Forms');                  // home → card only
```

### Page Objects
- All page classes extend `BasePage` (`Pages/BasePage.ts`)
- `BasePage` provides dynamic locator helpers using ARIA roles:
  - e.g.`buttonDynamic(text)`, `inputDynamic(text)`, `radioDynamic(text)`,`checkboxDynamic(text)`, `linkDynamic(text)`, `headingDynamic(text)`
- firstly will attempt dynamic locator from BasePage and use it
- If dynamic locator fails, then define a dynamic locator in the specific inherited page class (e.g. `TextBoxPage`, `ButtonsPage`) using the same pattern but different body of the function
```ts
checkboxDynamic = async (text: string, tag: string = 'div'): Promise<Locator> => this.page.locator(`//${tag}[normalize-space()="${text}"]`);
```
ivocation in test files is the same regardless of where the dynamic locator is defined:
```ts
await (await ChexBoxPage.buttonDynamic('Home', 'span')).click();
```
adjust
- If we use a dynamic locator that is defined in either BasePage or the specific inherited page class, then we define static locators in the page class and use those in the test files
- Methods that are only applicable to a given page of a class should be defined in that class
- Never define locators directly in the test files — always use page object methods and dynamic locator helpers or define static locators in the page classes
- Page objects are available as named fixtures in tests (e.g. `textBoxPage`, `buttonsPage`, etc.) — never import page classes directly into test files

### Fixtures
All page objects are available as named fixture parameters in tests. Each fixture is a direct instance of the corresponding page class — there is no aggregator object.

naming convantion e.g. all fixtures should be named after the page they represent, (e.g. `textBoxPage`, `navigationPage`, etc.)

```ts
type pages = {
    textBoxPage: TextBoxPage;
}

const testPages = pageTest.extend<pages>({

    textBoxPage: async ({ page }, use) => {
        await use(new TextBoxPage(page))
    },
});

export const test = testPages;
```
to be invoked in test files like this:
```ts
test('Elements -> Text Box - happy path', async ({ navigationPage, textBoxPage }) => {
  await (await navigationPage.DynamicButton('text')).click();

});
```

### Adding a new page object
1. Create `Pages/MyFeaturePage.ts` extending `BasePage`
2. Export it from `Pages/index.ts`
3. Add a fixture entry in `fixtures/fixtures.ts` (type declaration + `base.extend` entry)

### Test plans
Markdown test plans live in `specs/`. Use `specs/website.testplan.md` as the canonical reference for what scenarios should be covered. AI-generated test case documents go in `ai-output/`.

### Test data
- For simple data (e.g. form input values), include inline in the test case steps or expected result alwas create them in the data folder and reference them in the test cases
- The data that will be used is the `expect('')` assertion and dynamic locators. We've hard-coded these and kept their values ​​in the test case. If we want to change the data, we can change it in the test case and it will be reflected in the tests without needing to change the test code.

## Anti-Patterns to Avoid

- Do **not** import from `@playwright/test` directly in spec files — use the fixtures wrapper
- Do **not** use `'../fixture/fixtures'` as the import path — the correct path is `'../fixtures/fixtures'` (folder is plural)
- Do **not** use raw CSS selectors when a `BasePage` dynamic helper (`buttonDynamic`, etc.) covers the need
- Do **not** hardcode slow `page.waitForTimeout()` delays — use `expect(...).toBeVisible()` or action-based waits
- Do **not** add `page.goto(...)` inside tests when `test.beforeEach` already handles navigation reset
- Do **not** define locators in test files `checks.page.locator('#result')` — always use page object methods and dynamic locator helpers or define static locators in the page classes
- Do **not** use logic in test files — any necessary logic should be encapsulated in page object methods or fixtures
- Do **not** use hardcoded `await page.waitForTimeout(500);` — use proper Playwright waiting mechanisms like `await expect(locator).toBeVisible()` or `await locator.waitFor()`
- Do **not** defin any methods outside the scope of the class 
- Do **not** create aggregator fixtures that bundle multiple page objects — each page object should be its own fixture for clarity and flexibility


