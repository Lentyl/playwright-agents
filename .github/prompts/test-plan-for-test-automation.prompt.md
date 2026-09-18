---
name: 'test plan for test automation'
description: 'Create an automation-ready test plan for a scoped feature, application variant, or bug fix. Use when you need prioritized scenarios, test data, automation candidates, and coverage gaps before writing Playwright tests.'
argument-hint: 'Provide app variant, feature/scope, source of truth, and constraints.'
---


Create an automation-ready test plan for the requested scope.

## Before executing the workflow, read and apply:

- .github/instructions/*.md
- .claude/agents/*.md
- .claude/skills/*.md

## Workflow

1. Use dedicated agent to run and implement requested test scope and check and update failures.
2. Read instructions.md files in instructions/. directory for relevant guidance.
3. Read only the name and description of each skill file in `skills/`.
4. If description in skills files are relevant to the requested scope, read the skill and apply it to the workflow.
5. Confirm scope.
6. Create the test plan document in `ai-output/` for the requested scope, ensuring all relevant scenarios, test data, and automation candidates are captured.
7. create copy of the test-plan.md file in polish for upload to confluence. Ensure the translated file maintains the same structure and content as the original.



