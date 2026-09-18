---
name: test-plan
description: "Test plan creation. Use when: creating a test plan for a web application; analysing an application to identify test cases; applying boundary value analysis or equivalence partitioning; defining test groups, priorities, and test data; writing step-by-step test cases in Markdown; reviewing test coverage; deciding what to test first."
---

# Test Plan Creation — Methodology & Best Practices

> **Purpose:** this skill helps create a reusable test plan structure for any project.

## When to Use This Skill

- A new application or feature needs a structured test plan
- Exploratory testing is needed to map all pages and interactions before writing tests
- Test cases need boundary value analysis applied
- An existing test plan needs reviewing or extending

---

## Step 1 — Explore the Application

Before writing any test cases, map the application's pages and interactions using the
`playwright-cli` skill. For each page capture:

- **URL** — exact path and query parameters
- **Page heading** — confirms the right page loaded
- **Interactive elements** — inputs, dropdowns, buttons, checkboxes, links
- **Navigation structure** — menus, tabs, breadcrumbs
- **Validation messages** — required-field text, error labels
- **Default values** — pre-filled fields, selected options

Repeat for every page reachable from the main navigation and from key action links.

---

## Step 2 — Define the Test Plan Structure

Use this Markdown template as the skeleton:

```markdown
# Test Plan — <Application Name>
**URL:** <base URL>
**Environment:** <env name>
**Date:** <YYYY-MM-DD>

## 1. Application Overview
<What the app does, who uses it, key features>

## 2. Page Inventory
| # | Page | URL |
|---|------|-----|

## 3. Test Data
| ID | Description | Value |
|----|-------------|-------|

## 4. TC-<GROUP> — <Feature Name>
### TC-<GROUP>-001 — <Short title>
**Priority:** P1 — Critical
**Preconditions:** <state before the test>

| # | Step | Expected Result |
|---|------|-----------------|
| 1 | ... | ... |
```

### Example Test Case Structure

When you need to show how a single test case should look inside the plan or in external documentation, use this structure:

```markdown
### TC-<GROUP>-001 — <Short title>

**Module / Feature:** <feature or area>
**Priority:** P1 — Critical
**Type:** <happy path / negative / boundary / recovery>
**Author / Prepared by:** <name>

**Preconditions:**
- <state that must exist before execution>
- <optional second precondition>

**Test Data:**
- <label>: <exact value>
- <label>: <exact value>

| # | Step | Expected Result |
|---|------|-----------------|
| 1 | <action with concrete value> | <observable result> |
| 2 | <action with concrete value> | <observable result> |
| 3 | <action with concrete value> | <observable result> |

**Cleanup:**
- <what must be reverted after the test, if anything>

**Notes / Observations:**
- <console errors, ambiguities, product-specific notes, or "None">
```

Use this example as the model for individual cases written later in the project's documentation tool, while keeping the rest of the document as the broader test plan foundation.

---

## Step 3 — Assign Test Groups and Priorities

Group test cases by functional area with a consistent prefix.

| Priority | Label    | Meaning                                      |
|----------|----------|----------------------------------------------|
| P1       | Critical | Core user journey — must pass before release |
| P2       | High     | Important feature, high business value        |
| P3       | Medium   | Secondary feature or edge case                |
| P4       | Low      | Cosmetic, nice-to-have                        |

**Suggested groups for web applications:**

| Group prefix | Typical coverage                        |
|--------------|-----------------------------------------|
| TC-AUTH      | Login, logout, session, forgot password |
| TC-DASH      | Dashboard / home page after login       |
| TC-FORM      | Any data-entry form                     |
| TC-LIST      | Tables, filters, sorting, pagination    |
| TC-DETAIL    | Detail / edit / view pages              |
| TC-NAV       | Navigation, routing, access control     |
| TC-PROFILE   | User settings and profile management    |
| TC-PWD       | Password change flow                    |
| TC-DOCS      | Document downloads, static content      |

---

## Step 4 — Cover Full User Flows

Beyond isolated test cases, every test plan must include **end-to-end flow scenarios** that
verify that distinct features work together as a complete user journey.

### What is a full flow?

A full flow starts from an entry point (e.g. unauthenticated state or empty form) and walks
through every step a real user would take to complete a business goal — including prerequisite
steps, the main action, and the verification of the final outcome (e.g., PDF content verification).

### Required flow categories

| Category              | Example scenario                                                  |
|-----------------------|-------------------------------------------------------------------|
| **Registration**      | New user opens registration form → fills in all data → submits → receives confirmation → can log in |
| **Authentication**    | User logs in → lands on dashboard → session persists → logs out → cannot access protected page |
| **Purchase / Order**  | Authenticated user selects a product → enters amount and fund → confirms order → order appears in history |
| **Edit / Update**     | User navigates to profile → clicks Edit → changes a field → saves → sees updated value on the page |
| **Filtering / Search**| User opens list view → applies filters → results narrow → clears filter → full list restores |
| **PDF document**      | User triggers a document download or generation → PDF opens or is saved → key summary fields (title, date, totals, participant name) are verified against known data → file is not empty and is a valid PDF |
| **Error recovery**    | User submits invalid data → sees validation error → corrects it → resubmits successfully |

### Rules for full flow test cases

- **Start from a known, clean state** — state preconditions explicitly (e.g. "No prior session. No existing account for this email.").
- **Chain steps without jumps** — each step must follow naturally from the previous one; do not skip navigation or loading states.
- **Assert at every milestone and screen** — do not only assert the final outcome and display of a new screen; assert intermediate states (e.g. form submitted → spinner shown → success page loaded).
- **Include the negative path** — for every happy-path flow, add at least one scenario where one step fails (wrong data, timeout, permission denied) and verify the user can recover.
- **Cover every encountered form completely** — design and document both a positive path that completes the form with valid data and negative paths that validate every interactive element. For each input, select, checkbox, radio button, date control, upload, and action, verify required-field, invalid-format, invalid-selection, and recovery behavior where applicable.
- **Apply boundary-value coverage to every applicable control** — test the documented minimum, minimum minus one, minimum plus one, maximum minus one, maximum, and maximum plus one values for numeric and length-limited inputs. For dates, test valid, empty, malformed, reversed-range, future, and historical boundary values where applicable. For selections, test the first option, last option, no selection, and any disabled or unavailable option.
- **Keep positive and negative paths separate and observable** — a positive path must prove the form advances or saves the expected business result; a negative path must prove the exact validation message or blocked state, then correct the value and verify the form can continue.
- **Cleanup after state-mutating flows** — restore created accounts, orders, or changed data in a `afterEach` / teardown step.
- **PDF verification** — when a flow produces a PDF document, assert: (1) the download/response is not empty; (2) the MIME type is `application/pdf`; (3) key summary fields visible in the UI (totals, dates, participant name, document title) match the values extracted from the PDF text layer. Use a library such as `pdf-parse` or `pdfjs-dist` for text extraction in Playwright tests.
- **Use realistic data** — test data in flow tests should mirror real user input (valid names, realistic amounts, actual file types).

### Product-specific coverage for shared actions

When the application exposes the same process or action across multiple distinct products or product families, write **separate test cases for each context** instead of one combined case with a generic placeholder.

Typical contexts can include named products such as `IKE`, `IKZE`, `PSO`, `PITO`, `PIRO`, robo variants, or any other product family exposed in the UI, if available and possible.

For each relevant context, cover the process both from the main product surface and from any row-level or table-level entry point when the UI offers both paths.

The action set that should usually be split this way includes:

- `Kup`
- `Zamień/Konwertuj`
- `Wypłata`
- `Zmień sposób wypłaty`
- `Uprawnieni`
- `Wypłata transferowa`
- `Zwrot`
- `Zmień na Portfel Modelowy`

If a given context does not expose one of these actions in the UI, record that as an explicit observation rather than inheriting coverage from another context.

### Flow test case template

```markdown
### TC-<GROUP>-FLOW-001 — <Full flow title>

- **Priority:** P1 — Critical
- **Test ID:** TC-<GROUP>-FLOW-001
- **Title:** <Short, action-oriented title>
- **Objective:** Verify that <business outcome> can be completed through the user interface.
- **Preconditions:**
  - <Application URL and environment are available.>
  - <Required user account, permissions, and initial state.>
- **Test data:**
  - <Data label 1>: <exact valid value> (Test data: <ID>)
  - <Data label 2>: <exact invalid or boundary value> (Test data: <ID>)
  - <Data label 3>: <exact value needed for cleanup> (Test data: <ID>)
- **Steps:**
  1. Open <application URL>.
  2. Navigate to <entry point>.
  3. Verify that <page heading or other observable milestone> is visible.
  4. Enter <exact valid value> in the "<field label>" field.
  5. Select "<option>" from "<control label>".
  6. Click "<primary action>".
  7. Verify that <intermediate loading, confirmation, or validation state> is displayed.
  8. Verify that <next page, dialog, or completed state> is displayed.
  9. Submit <exact invalid or boundary value> in "<field label>" and move focus away from the field.
  10. Verify that the specific validation message "<expected message>" is visible.
  11. Replace the invalid value with <exact valid value> and repeat the action.
  12. Verify that the flow completes and <final business result> is visible.
- **Expected result:**
  - <The entry point loads with the expected heading and controls.>
  - <Valid data is accepted and the primary action advances the flow.>
  - <The intermediate state is visible before the final result.>
  - <Invalid or boundary data is rejected with the exact expected message.>
  - <After correction, the user can complete the flow and the final business result is visible.>
- **Cleanup:**
  - <Delete, revert, or otherwise restore any data created or changed by the test.>
- **Notes / Observations:**
  - <Record console errors, ambiguous behavior, blocked steps, or "None".>
```

---

## Step 5 — Apply Boundary Value Analysis

For every numeric, date, text-length, or selection input, test:

| Boundary type      | Values to test                                    |
|--------------------|---------------------------------------------------|
| Numeric amount     | min−1 (invalid), min (valid), min+1, max−1, max, max+1 (invalid) |
| String length      | 0 chars (empty), 1, max−1, max, max+1             |
| Date range         | start > end, start = end, valid range, future date, past-epoch date |
| Enumeration select | first option, last option, none selected          |
| Required field     | empty + submit, whitespace-only + submit           |

Always note the **exact boundary value** in the test step, not just "a valid amount".

---

## Step 6 — Write Test Data


Rules for good test data:
- **Credentials** — include valid, invalid, and boundary accounts
- **Passwords** — cover: too short, missing digit, missing uppercase, missing special char, matching confirmation, non-matching confirmation, same-as-current
- **Amounts** — cover: min boundary, min−1, domain-specific limit (e.g. annual cap), above limit, non-numeric, negative, zero
- **Dates** — cover: valid range, reversed range (start > end), future, past epoch
- **Emails** — cover: valid, missing `@`, missing domain, empty
- **Text fields** — cover: valid, empty, max+1 characters, special characters / XSS probe strings
- **Cleanup** — any test that mutates state (password, profile, data) must have a cleanup step restoring the original state

---

## Step 7 — Write Test Steps

Each test case step must include:

1. **Action** — what to do (navigate to, click, fill, select, assert)
2. **Data** — the exact value being entered or selected (not just the ID)
3. **Expected result** — what the UI should show or do

When a value comes from Section 3 (Test Data), include the test-data ID next to the value.
Preferred format: `<value> (Test data: <ID>)`.

**Bad step:** `Enter the password`
**Good step:** `Enter password (\`Start.123\`) in the "Password" field`

For assertions, be specific:
- ✓ `Assert "Field is required" text is visible below the login field`
- ✗ `Assert an error appears`

Write low-level test cases from a **human user perspective**. Use the application’s real labels, field names, button texts, menu items, and visible control names exactly as they appear in the UI. Do not rename them into generic variable-style wording when the app already provides a clear name such as "Numer uczestnika", "Hasło", "Zaloguj", or "Kwota nabycia (PLN)".

Keep the narrative and section text in English, but preserve the application's visible labels verbatim in the test steps and expected results. If the UI label is Polish, the test case should still cite the Polish label exactly as shown to the user.

Low-Level Test Cases Document (test-plan.md)
The Planner MUST produce a test-plan.md file alongside every test-plan.md. This document provides step-by-step instructions precise enough for ui-subagent and api-subagent to directly implement and execute as Playwright TypeScript tests without further clarification.

Rules:

Steps must be granular enough for automated execution — no ambiguous verbs.
Include at least one negative / edge test case per scenario.
When a scenario exists for multiple products, duplicate the case per product so that each product is verified independently.
ui-subagent and api-subagent consume this file directly; no re-interpretation needed.
Archive to ai-output/ using naming convention YYYY-MM-DD_<runId>_test-plan.md
Write the low-level TC in the same human-facing language a tester would use in the browser, keeping the application field/control names intact.

---

## Step 8 — Document Known Issues and Observations

Add an appendix for:

- **Console errors** observed during exploration that are not test failures (e.g. blocked 3rd-party analytics)
- **Security observations** (e.g. missing headers, tokens in URLs, mixed content)
- **Ambiguous requirements** — anything where expected behavior is unclear and needs confirmation

---

## Test Case Quality Checklist

Before finalising a test case, verify:

- [ ] Preconditions fully stated (authenticated? on which page?)
- [ ] Each step has a concrete value, not a reference to a variable alone
- [ ] Steps using values from Section 3 include explicit Test Data ID references (e.g., U1, P1, D1)
- [ ] Happy path tested before edge cases
- [ ] Both valid and invalid inputs covered
- [ ] Boundary values identified and included
- [ ] Cleanup step added for any state-mutating test
- [ ] Priority assigned (P1–P4)
- [ ] Expected results are observable UI states, not implementation details

---

## Appendix — Boundary Value Table Template

| Parameter       | Min−1 | Min BV | Min+1 | Max−1 | Max BV | Max+1 | Notes |
|-----------------|-------|--------|-------|-------|--------|-------|-------|
| Amount          |       |        |       |       |        |       |       |
| String length   |       |        |       |       |        |       |       |
| Date range      |       |        |       |       |        |       |       |
| Password length |       |        |       |       |        |       |       |
