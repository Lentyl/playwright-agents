---
name: 'create context summary'
description: 'Summarize the current conversation and relevant repository state into ai-output/context-summary.md for session handoff.'
argument-hint: 'Optionally provide a focus area, task identifier, or additional context to include.'
agent: 'agent'
---

Create or update `ai-output/context-summary.md` with a concise, actionable summary of the current work context.

## Scope

Use the current conversation as the primary source. Read only the repository files and instruction files needed to verify the active task, implementation state, open issues, and validation results.

If an optional focus is provided, prioritize it:

${input:Focus or additional context}

## Required content

Include these sections when applicable:

1. **Objective** - the user's current goal and success criteria.
2. **Repository context** - relevant files, modules, tools, and commands.
3. **Completed work** - changes already made and their purpose.
4. **Current state** - verified behavior, test results, and known environment constraints.
5. **Open tasks** - remaining work in priority order.
6. **Important decisions** - decisions that must not be reversed without confirmation.
7. **Next action** - the single most useful next step.

## Requirements

- Write the output in English unless the user explicitly requests another language.
- Use repository-relative Markdown links for relevant files.
- Include exact commands only when they are safe and relevant.
- Distinguish verified facts from assumptions and unresolved issues.
- Do not include passwords, tokens, API keys, personal data, full environment values, or other secrets. Redact them as `[REDACTED]`.
- Do not invent requirements, test results, file contents, or completed work.
- Keep the document concise and suitable for handing the task to another agent.
- Create the `ai-output/` directory if it does not exist.
- Write the final document to exactly `ai-output/context-summary.md`.
- After writing, validate that the file exists and briefly report its path and the main topics captured.