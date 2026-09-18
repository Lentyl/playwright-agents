---
name: 'run check heal tests'
description: 'Run Playwright tests, check failures, and heal test-related issues until requested test cases pass or a real blocker is found.'
argument-hint: 'Provide app variant and scope. "heal if needed, all test cases should pass".'
---

Run the requested Playwright test scope, check failures, and heal tests when needed so that all requested test cases pass.

If required inputs are missing, ask only for missing essentials before continuing.

## Before executing the workflow, read and apply:

- .github/instructions/*.md
- .claude/agents/*.md
- .claude/skills/*.md

## Inputs

- Test scope: specific file, suite folder, tag, or all tests
- Optional constraints: max healing attempts, files that must not be changed, environment hints
- If needed, ask for test data

## Output expectations

- Executed tests for the requested scope and reported pass/fail outcome.
- For each failure: concise root-cause hypothesis, fix applied, and verification rerun.
- Updated tests and/or supporting files as needed to make tests deterministic and robust.
- Final status: all requested tests passed, or explicit blocker with next action.
- Brief summary of what changed and why.

## Constraints

- Stay focused on tests and directly related supporting updates only.
- Use Page Objects for locators and UI interactions; avoid raw locators in test specs.
- Stop healing when a true blocker is found (environment outage, missing access, or product defect, missing correct test data) and report it clearly.

## Workflow

1. Use dedicated agent to run and implement requested test scope and check and update failures.
2. Read instructions.md files in instructions/. directory for relevant guidance.
3. Read only the name and description of each skill file in `skills/`.
4. If description in skills files are relevant to the requested scope, read the skill and apply it to the workflow.
5. Confirm scope.
6. Run tests for that scope.
7. First check if user can be logged in to the application; if not, fix it first and then run the rest of the test cases to get the full scope of failures.
8. Check failures and classify each as flaky, test issue, data issue, environment issue, or product bug.
9. Heal what is safe and in-scope (tests, fixtures, page objects, test data) without masking real product bugs.
10. Rerun the affected tests, then rerun the full requested scope.
11. Repeat until green or blocked, then provide a clear end-state report.
