# Mandatory Common Component Coverage

Apply every rule relevant to the feature under test. A required check that is not designed or implemented is a coverage gap, not optional extra coverage. Record unavailable data states, inaccessible actions, or missing expected results as explicit limitations or assumptions.

## Any User Action

After every meaningful action, assert the expected success, state change, displayed result, validation message, or explicitly expected absence of a result. Do not chain filtering, sorting, form submission, link navigation, or record actions without proving each action's outcome.

## Filterable Table

- Detect and use every available table-filter field in scope.
- Exercise each filter through representative methods supported by its control: exact and partial text, individual and combined filters, alternative selectable values, date or numeric ranges, clearing, and no-match input.
- After every filter action or changed filter value, assert that every non-empty displayed column of every returned row matches all active filters.
- Assert that the expected record is included or excluded.
- Cover clearing the full filter set and, where supported, the empty-result state.

## Sortable Table

- Keep ascending and descending checks for all sortable columns of one table in one test. When an screen has more than one table, create a separate sorting test for each table.
- Verify ascending and descending sorting for every sortable column in scope.
- Assert that displayed rows are in the expected order using deliberately distinguishable test data; do not only assert that a sort control changed state.
- Cover duplicate values and empty or single-row results where the data state is supported.

## Expandable Table Row

When a table record offers expandable details:

- Expand the record and assert every available detail value against the relevant source data or documented expected result.
- Verify that expanded content belongs to the selected record and is complete for the displayed state.
- Verify that the record can be collapsed when that action is available.

## Table-Row Actions

- Discover every action available for a record, including visible buttons, menus, contextual actions, and row-level links.
- Execute each action in scope with controlled test data and assert its specific result, such as navigation, displayed details, state change, download, validation, or error handling.
- For destructive or irreversible actions, use an isolated record with cleanup or obtain the user's approval before execution.
- Opening an action menu is not verification.

## Form

- Keep validation, invalid-input, required-state, and boundary checks for all fields in one visible form section in one test. When an screen has separate sections, such as address, correspondence, or user details, create one test per section.
- Cover one valid submission with representative data.
- A valid submission may span several screens. When materially different valid data combinations exist, design and implement up to six valid-submission cases; each case may complete the full multi-screen path with a distinct combination of selected fields or entered test data.
- If more than six valid variations are available, list the additional proposed cases and ask the user which, if any, should be added before implementing them.
- For every form screen and field in scope, cover validation, invalid data, required-state behaviour, and relevant boundary values.
- Assert accepted or rejected data and the resulting business state.

## Link

Activate every link in scope and assert its destination: the expected page, document, download, external target, or explicit error state. Do not treat a successful click alone as verification.

## Document Download

Download every document available in scope to the configured `data/doc` directory. Assert that the download completes, the file exists with the expected name and non-zero size, and its type or format is valid. Verify its content against the relevant source data, such as visible UI values, generated input, or documented expected text; do not treat successful download alone as verification.

## File Upload

When an upload control is in scope:

- Add the deterministic fixture `testowyPDF.pdf` when PDF is an accepted type and assert that the file is accepted, displayed, persisted, or otherwise handled as specified.
- Create a synthetic, non-sensitive fixture with every other file extension required to cover supported or rejected types.
- Assert the resulting file state, validation, and business outcome after each upload action; do not only assert that the file picker accepted a path.

## Other Interactive Elements

When the page contains an interactive element a user can select, click, or otherwise operate, but no rule in this resource covers it:

- List the element, its visible label or purpose, and the action it makes available.
- Ask the operator whether the element should be included in this coverage resource and whether it should be added to a test for the related page or feature.
- The operator decides which existing or new test should cover the element. Do not silently add the element to a test or expand the resource without that decision.
- Record the operator's decision or an unanswered question as a scope limitation.
