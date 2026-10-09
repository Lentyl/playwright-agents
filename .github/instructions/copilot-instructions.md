# Uniqa-FI Test Automation - Repository Instructions

## Project context

This repository contains Playwright automation for the application configured through the `baseURL` parameter in `playwright.config.ts`.

## Testing target

- Always use the URL configured in `playwright.config.ts` under `use.baseURL` as the application-under-test URL for browser exploration, test planning, Page Objects, and automated tests.
- Do not substitute a different URL, application path, environment, or legacy portal based only on account names, existing tests, comments, or assumptions.
- When the configured `baseURL` is missing, ambiguous, inaccessible, or conflicts with the requested scope, stop and ask the user to confirm the intended target URL before continuing.
- Use an explicitly different URL only after the user has confirmed that it is in scope; document that exception in the relevant test plan and test code.


## Core rules

- For shared changes, keep test and documentation structure consistent across both scopes.
- For app-specific changes, update only the relevant scope and clearly mark it.

## Repository structure

- data/
  - Store test data and constants for applications.
  - Example: testData.json

- pages/
  - Store Page Object classes and base page classes.
  - Example: BasePage.ts, LoginPage.ts, DashboardPage.ts.

- fixtures/
  - Store Playwright fixtures and shared test context extensions.
  - Example: pagesFixtures.ts in fixtures/ directory.

- tests/
  - Store test specifications.

- ai-output/
  - Store documentation artifacts generated during QA work.
  - This includes test plans and other analysis materials.
  - Example: test-plan.md.

- playwright-report/ and test-results/
  - Store run outputs and Playwright reports.

## Test plan guidance


- For creating test-plan documents, follow the guidelines using SKILLS.md files and relevant resources files.
- Maintain a separate test plan for each application.
- Keep section structure and TC identifiers aligned across plans where scope is shared.
- Test plan should be dropped in the ai-output/ directory.

## Naming and placement

- Test data: data/*TestData.json.
- Page classes: pages/*Page.ts.
- Tests: tests/**/**.spec.ts.
- When test files in different directories would otherwise have the same filename, add one distinctive, meaningful directory-derived term to each colliding filename before `.spec.ts`. Apply the convention to every file in that collision group and update direct path references.
- Test plans: ai-output/*test-plan*.md.

## Documentation language

- Write all files and documentation artifacts in English by default. Test plans should also be written both in English and Polish, two separate versions.
- Exceptions: test data values and application-specific elements (for example: proper names, UI labels, product names, domain-specific names) may remain in their original wording.

## Page Object rules

- Keep locators (selectors) in Page Object classes under pages/.
- Keep UI-oriented methods (actions, reads) in Page Object classes.
- In tests (tests/**/*.spec.ts), call methods from Page Objects instead of working with locators directly.
- Avoid defining new locators and complex UI logic directly inside test files.
- All Assertions should be performed in relevant test files (tests/**/*.spec.ts) rather than in Page Object classes.

## Downloaded files

- Save every file downloaded from the application to `data/doc/download-files/`.
- Use Playwright's `Download.saveAs()` with the filename returned by `download.suggestedFilename()` (or the application-provided filename); do not leave application downloads only in Playwright's temporary directory.
- Keep download handling in Page Objects or shared helpers. Tests should assert the download and the saved file path/content through those APIs.
- Do not commit downloaded files unless the task explicitly requires a fixture or evidence artifact.

## Change hygiene

- For structural changes, update tests, data, and documentation together.
- Do not move Page Object classes outside pages/ without architectural justification.
- Do not store sensitive data in test data files or reports.

## Shared customization portability

- Treat Markdown files under `.github/` and `.claude/` as reusable across projects unless the user explicitly requests project-specific content.
- Keep reusable files free of repository names, application names, environment URLs, roles, test-case IDs, local paths, and assumptions about a particular project structure.
- Use neutral terms such as "workspace", "application", "test suite", "source of truth", and "relevant files". Keep project-specific details only as explicit placeholders or user-provided inputs.
- When updating a reusable Markdown file, preserve its existing intent, frontmatter, structure, and language unless the requested change requires otherwise.

