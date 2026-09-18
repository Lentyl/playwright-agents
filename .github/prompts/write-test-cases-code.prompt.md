---
name: 'write or update test cases code'
description: 'Generate or refine comprehensive, relevant test cases in tests/ based on test plan in ai-output/ and related Page Objects in pages/.'
argument-hint: 'Provide target file(s), feature/scope, app variant, and expected behavior.'
---

Create or update comprehensive and relevant test suites and test cases in `tests/` for the requested scope.
If required inputs are missing, ask only for the missing essentials before continuing.

## Inputs

- if needed ask for test data 

## Versioning

- This prompt file is version 1.0.

## Before executing the workflow, read and apply:

- .github/instructions/*.md
- .claude/agents/*.md
- .claude/skills/*.md
- ai-output/*.md

## Output expectations

- Updated or new test specs under `tests/` with clear scenario names and deterministic assertions.
- Brief summary of what was added/changed and why.
- List of remaining gaps or assumptions that still need confirmation.

## Constraints

- Stay focused on tests and related supporting updates only.
- Stick to relevant test plan and Page Object guidance.
- Do not add raw locators directly in test files when the behavior belongs in Page Objects.

## Workflow

1. Use dedicated agent to run and implement requested test scope and check and update failures.
2. Read instructions.md files in instructions/. directory for relevant guidance.
3. Read only the name and description of each skill file in `skills/`.
4. If description in skills files are relevant to the requested scope, read the skill and apply it to the workflow.
5. Confirm scope.
6. Investigate test plan document that is defined in `ai-output/` for the requested scope and identify missing or incomplete test cases.
7. Based on test plan and Page Objects, generate or update test cases in `tests/` for the requested scope.
8. Run test suites and check if all tests have passed status.

