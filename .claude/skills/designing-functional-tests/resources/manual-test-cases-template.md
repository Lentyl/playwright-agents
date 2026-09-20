# Manual Test Cases

Each manual case belongs to one scenario from the functional test plan. Keep the plan's `High`, `Medium`, and `Low` priority scale; do not introduce a second scale.

## MTC-001 - [Short title]

- **Source scenario:** SCN-001
- **Area:** [feature area]
- **Priority:** High / Medium / Low
- **Type:** happy / negative / boundary / permission / recovery / a11y-smoke
- **Automation candidate:** high / medium / low

**Preconditions:**

- [required starting state]

**Test data:**

- [label]: [exact value] ([data ID, if applicable])

| # | Step | Expected result |
| - | ---- | --------------- |
| 1 | [action using concrete data] | [observable outcome] |
| 2 | [action using concrete data] | [observable outcome] |

**Cleanup:**

- [restore state or `None`]

**Notes:**

- [assumption, open question, or relevant evidence]

## Case register

| ID | Source scenario | Area | Priority | Type | Automation candidate |
| -- | --------------- | ---- | -------- | ---- | -------------------- |
| MTC-001 | SCN-001 | [Feature area] | High | happy | high |
| MTC-002 | SCN-001 | [Feature area] | High | negative | medium |
| MTC-003 | SCN-002 | [Feature area] | Medium | boundary | low |

## Suggested type tags

- `happy`
- `negative`
- `boundary`
- `permission`
- `recovery`
- `a11y-smoke`
