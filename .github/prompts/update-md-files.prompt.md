---
name: 'update .md files'
description: 'Update a reusable Markdown file under .github or .claude without adding project-specific assumptions.'
argument-hint: 'Provide the Markdown file path and the exact update you need.'
agent: 'agent'
---

Update the requested Markdown file under `.github/` or `.claude/` according to this request:

${input:Update request}

## Requirements

- Read the target file and any directly relevant instruction files before editing.
- Preserve the file's purpose, frontmatter, structure, formatting, and language unless the requested update requires a change.
- Keep the content reusable across projects. Do not introduce repository names, application names, environment URLs, user credentials, role-specific details, test-case IDs, fixed local paths, or assumptions about a particular project layout.
- Replace unavoidable project-specific values with clear placeholders and explain only when an assumption is needed.
- When a complex special case helps define the requirement accurately, use it as a clearly labelled illustrative example while keeping the rule itself generic.
- When updating instructions for test files, require colliding filenames in different directories to include a meaningful directory-derived term before `.spec.ts`, and require direct path references to be updated.
- Keep agent, instruction, and prompt Markdown files at 200 lines or fewer. When the requested update would exceed the limit, propose placing the requirement in the most relevant existing `SKILL.md` or its `resources/` directory; if none is suitable, propose creating a new skill.
- Keep the edit minimal and update only files necessary for this request.
- Validate the Markdown frontmatter when it exists and report the changed files with a concise summary.