---
name: designing-functional-tests
description: 'Designs risk-based functional test plans, scenarios, manual test cases, regression slices, test data, and automation handoff packs from requirements, URLs, or exploratory notes. Applies equivalence partitioning, boundary-value analysis, state and flow coverage, and case-quality review. When asked to write automated tests, designs missing cases and implements them before updating a test plan only on explicit user request.'
argument-hint: 'Feature scope, requirements or URL, roles, environment, and whether you need a plan, cases, regression scope, or automated test implementation'
user-invocable: true
---

# Designing Functional Tests

Use this skill to turn product intent into tester-ready coverage and, when requested, into automated tests.
It produces plans and cases that are clear enough for manual execution and stable enough to implement in automation.

This skill is the source of truth for functional-test artifacts: their scope, priorities, scenario IDs, manual-case IDs, test data, and automation handoff. Use `planning-exploratory-testing` to discover unknown behaviour first.

## When to Use

- create a risk-based functional test plan
- turn acceptance criteria into manual test cases
- convert exploratory notes into reusable scenario packs
- prepare a regression slice for a bug fix or small feature
- identify which scenarios should move into automated tests first
- write automated tests for a feature, page, or flow that lacks documented cases
- apply equivalence partitions, boundary values, state transitions, or flow coverage to selected cases
- review existing scenarios or manual cases for missing test-design coverage

## Core Rules

- **No silent invention** - missing behavior becomes a question or an explicit assumption.
- **Risk decides depth** - high-risk flows deserve positive, negative, boundary, permission, and recovery coverage.
- **One case proves one bounded behavior** - avoid giant cases that validate unrelated behaviors. Group checks of the same interaction type when they apply to one bounded UI surface, such as all sorting directions for one table or all field validation in one form section.
- **Stable IDs matter** - use durable IDs for scenarios and cases so they can be referenced later.
- **Design before implementation** - derive stable, observable cases before writing automated tests, even when those cases are not yet recorded in the test plan.
- **One artifact owner** - use this skill's templates and conventions; do not create a parallel plan or priority model elsewhere.
- **Plan updates need consent** - do not add cases to a test plan after implementing automation unless the user explicitly asks for that update.

## Workflow

### Phase 0: Frame the deliverable

Decide which artifact is needed:

- **Full plan** - scope, priorities, scenario catalog, risks, open questions
- **Manual cases** - detailed steps and expected results
- **Regression slice** - the smallest believable retest pack after a change
- **Design and implement** - derive missing cases, implement automated tests, validate them, then ask the user about verification or debugging

If the user did not specify the artifact, choose the lightest format that still solves the task.

### Phase 1: Run the test-readiness gate

Before writing cases, confirm the test basis gives enough signal to work with.

Minimum signal:

- the feature or flow being tested
- the actor or user role
- the starting state or preconditions
- an observable success outcome

If any of these are missing:

1. Ask targeted questions.
2. When the behaviour itself is unknown, route the area to `planning-exploratory-testing` for a chartered session.
3. If the user wants to move fast, proceed with an **Assumptions** section instead of inventing hidden requirements.
4. Tag affected scenarios or cases with `ASSUMPTION`.

Do not write confident-looking expected results for behavior that is still unknown.

### Phase 2: Map the coverage lenses and design techniques

For each high-value flow, check these lenses:

| Lens | What to cover |
| --- | --- |
| Happy path | Baseline success path |
| Negative | Invalid inputs, rejected actions, failures |
| Boundary | Empty, min, max, off-by-one, format edges |
| Permissions | Wrong role, wrong state, missing access |
| Recovery | Retry, refresh, session loss, partial failure |
| Data / State | Persistence, deduplication, conflicting updates |
| Accessibility smoke | Keyboard reachability, labels, error visibility |

Not every flow needs the same depth.
Apply full coverage to risky flows and lighter smoke coverage to low-risk areas.

For each relevant lens, choose the smallest useful test-design technique:

| Situation | Technique | Coverage to derive |
| --------- | --------- | ------------------ |
| Input accepts values | Equivalence partitioning | Valid classes plus each meaningfully invalid class |
| Input has a documented limit | Boundary-value analysis | Minimum minus one, minimum, minimum plus one; maximum minus one, maximum, maximum plus one |
| Input is required or formatted | Validation analysis | Empty, whitespace, malformed, valid, and correction after an error |
| Flow changes state | State-transition analysis | Valid transitions, forbidden transitions, cancel, retry, refresh, and duplicate submission where relevant |
| Multiple roles or access states exist | Permission analysis | Authorized action, unauthorized attempt, and loss of permission during the flow where relevant |
| User goal spans screens | End-to-end flow analysis | Known start state, observable milestones, final business result, and recovery from one realistic failure |

Use end-to-end cases only when their business value lies in the integration of steps. Do not force every form control or product context into a flow; extend coverage where risk, a documented rule, changed code, or exploratory evidence justifies it.

### Mandatory common component coverage

Read and apply `./resources/common-component-coverage.md` whenever its component is in scope. Its rules are mandatory: a required check that is not designed or implemented is a coverage gap, not optional extra coverage. Apply only relevant rules and record unavailable data states, inaccessible actions, or missing expected results as explicit limitations or assumptions.

### Test grouping boundaries

Group automated checks by interaction type and one bounded UI surface:

- **Table sorting** - keep ascending and descending checks for every sortable column of one table in one test. When an screen has multiple tables, create one sorting test per table; do not combine their sorting checks.
- **Form validation and boundaries** - keep validation, invalid input, required-state, and boundary checks for all fields in one visible form section in one test. When an screen has separate sections, such as address, correspondence, or user details, create one test per section; do not combine their field validation or boundaries.
- **Other interaction types** - apply the same boundary: group checks only when they prove the same behavior on the same table, form section, or comparable UI component. Create a separate test when the component or behavior changes.

Within a grouped test, assert the result after every individual action so a failing step still identifies the affected control.

### Phase 3: Prioritize before expanding

Use a simple three-level priority scale:

- **High** - critical business path, security-sensitive area, money/data movement, or frequent user action
- **Medium** - important supporting workflow or high-change area
- **Low** - secondary behavior, visual polish, or low-impact option

High-priority flows should include at least:

- one happy path
- one negative case
- one boundary or permission case
- one recovery or state-handling case

### Phase 4: Produce the requested artifact

#### Full plan

Use `./resources/test-plan-template.md` when possible.
A good plan includes:

- scope and exclusions
- risks and priorities
- scenario catalog with IDs like `SCN-001`
- assumptions and open questions
- automation handoff notes

#### Manual test cases

Use `./resources/manual-test-cases-template.md` when possible.

Case rules:

- Use IDs like `MTC-001`
- Link every manual case to one source scenario, for example `SCN-001`
- Keep steps observable and short
- Write specific expected results, not "works correctly"
- Include case type tags such as `happy`, `negative`, `boundary`, `permission`, `recovery`, `a11y-smoke`
- Add an **Automation Candidate** value: `high`, `medium`, or `low`
- Include exact test data and cleanup for state-changing cases

When expanding a case, write exact, realistic, non-sensitive values and distinguish their purpose, for example `valid`, `empty`, `max`, or `max+1`.

| Data type | Suggested partitions or boundaries |
| --------- | ---------------------------------- |
| Number | Negative, zero, valid range, minimum, maximum, and one outside each limit |
| Text length | Empty, one character, maximum minus one, maximum, maximum plus one |
| Date range | Valid range, same start/end date, reversed range, and relevant past/future limits |
| Enumeration | First option, last option, no selection, and unavailable option |
| Text content | Leading/trailing whitespace, ordinary special characters, non-Latin text, and a long unbroken word when layout matters |

Keep happy, negative, boundary, permission, and recovery outcomes separate when combining them would make a failure ambiguous. Expected results must describe observable product behaviour, not implementation detail.

#### Regression slice

For small changes or bug fixes, produce:

- changed surface
- must-retest scenarios
- adjacent risk areas
- optional "do later" scenarios if time is tight

### Phase 5: Design and implement automated tests

Use this phase when the user asks to write, add, or automate tests for a feature, page, or flow.

1. Inspect the current test plan and existing automated tests for the requested surface.
2. Identify cases already documented and implemented. Derive only the missing, high-value cases needed to prove the requested behaviour.
3. Keep the derived cases as implementation working notes unless the user explicitly asks to update the test plan. Do not create `SCN-*` or `MTC-*` entries in a plan by default.
4. Implement the tests in the repository's established structure. Use page objects, fixtures, data, and test-file placement already used by the suite.
5. Apply the case-design rules in this skill: one behaviour per test, exact data, observable results, appropriate boundaries, permissions, recovery, and cleanup.
6. Run the narrowest relevant automated-test command. Fix implementation defects in the same slice and rerun the check.
7. After implementation and validation, report the cases implemented and ask the user whether they want to verify a specific test manually or debug any failing or uncertain case. Stop for the user's response.

Only after the user explicitly asks to add the cases to the test plan, update the plan with exactly the derived and implemented cases that were previously missing. Preserve existing plan content and do not add speculative or unimplemented cases.

### Phase 6: Prepare the handoff

Before finishing, decide what should happen next:

- send risky edge cases into the `/qa-strategy` prompt for adversarial expansion
- send stable, repeatable scenarios into the `/test-generator` or `/playwright-generate-test` prompts
- send requirements-heavy work into `requirements-test-coverage-mapper` when traceability matters more than step-by-step execution

For code implementation, use `playwright-page-fixtures` for the Page Object and fixture structure, `api-playwright-test-developer` for API coverage, and `unslop-tests` to review the generated tests.

## Output Standards

Always include:

- clear scope
- priority or risk signal
- explicit assumptions or open questions
- scenario or case IDs
- enough detail for another tester to execute without a live explanation

Good output is handoff-ready, not just impressive-looking.

## Common Failure Modes

- writing a plan that only covers happy paths
- burying critical assumptions inside prose
- mixing multiple assertions into one giant test case
- using vague expected results such as "data saved successfully"
- generating every possible case without prioritization

## Resource Map

- `./resources/test-plan-template.md` - structure for full plans and regression slices
- `./resources/manual-test-cases-template.md` - table format for detailed manual execution
- `./resources/common-component-coverage.md` - mandatory checks for all functional components: tables, forms, links, downloads, and uploads

## Related Skills

- `requirements-test-coverage-mapper` - when traceability to PRD, stories, or AC is the main deliverable
- `planning-exploratory-testing` - when the behaviour or risks must be discovered before structured cases can be designed
- `playwright-page-fixtures` - when implementing UI automation with Page Objects and fixtures
- `api-playwright-test-developer` - when implementing API or hybrid UI/API automation
- `unslop-tests` - when reviewing generated or changed automated tests
- `reporting-bugs` - when the task has shifted from planning to documenting a defect
- `auditing-accessibility` - when coverage needs a deeper accessibility pass instead of smoke checks

## Definition of Done

This skill is complete when:

- the requested artifact type is clear
- missing information is either answered or listed as assumptions
- high-risk flows have deeper coverage than low-risk flows
- each case or scenario has a stable ID
- every manual case links to its source scenario
- applicable partitions, boundaries, states, permissions, and recovery paths are covered
- the output can be executed or handed off without extra explanation

When automated tests were requested, this skill is additionally complete when:

- missing cases were designed before implementation without silently updating the test plan
- the corresponding automated tests were implemented and validated with the narrowest relevant command
- the user was asked whether to verify a test manually or debug a failing or uncertain case
- the test plan was updated only after an explicit user request, and only with the implemented cases missing from that plan
