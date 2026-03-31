# Test Scenarios — demoqa.com UI Coverage

**Run ID**: planner-ui-coverage-2026-03-13  
**Date**: 2026-03-13  
**Scope**: UI-only test scenarios for https://demoqa.com/ (exclude Book Store Application and Book Store API)  
**Total scenarios**: 23  
**Mapping**: Uses existing page objects in `Pages/`

---

## SCENARIO-S01: Text Box Input
- **Feature area**: Elements / Text Box
- **Goal**: Verify text input, validation indicators and persisted output for single-page text box form
- **Preconditions**: Browser open to Text Box page
- **Happy path**: User fills all fields, submits, and the page displays submitted values
- **Priority**: P0
- **Mapped page object**: TextBoxPage.ts

## SCENARIO-S02: Check Box Tree Selection
- **Feature area**: Elements / Check Box
- **Goal**: Verify expanding/collapsing tree, selecting multiple nodes, and output reflects selections
- **Preconditions**: Browser open to Check Box page
- **Happy path**: Expand nodes, select checkboxes, verify result list matches selections
- **Priority**: P1
- **Mapped page object**: CheckBoxPage.ts

## SCENARIO-S03: Radio Button Selection
- **Feature area**: Elements / Radio Buttons
- **Goal**: Verify exclusive selection behavior and result text updates accordingly
- **Preconditions**: Browser open to Radio Buttons page
- **Happy path**: Select each radio option and validate displayed result
- **Priority**: P1
- **Mapped page object**: RadioButtonsPage.ts

## SCENARIO-S04: Buttons Click Types
- **Feature area**: Elements / Buttons
- **Goal**: Verify single, double and right-click actions trigger expected responses
- **Preconditions**: Browser open to Buttons page
- **Happy path**: Perform click types, validate visible feedback
- **Priority**: P1
- **Mapped page object**: ButtonsPage.ts

## SCENARIO-S05: Links Navigation & Response
- **Feature area**: Elements / Links
- **Goal**: Validate navigation, link targets, and broken link behavior (open/new tab/response)
- **Preconditions**: Browser open to Links page
- **Happy path**: Click each link type and validate outcome (open, status)
- **Priority**: P1
- **Mapped page object**: LinksPage.ts

## SCENARIO-S06: Upload / Download
- **Feature area**: Elements / Upload and Download
- **Goal**: Verify file download starts and file upload accepts and displays filename
- **Preconditions**: Browser open to Upload/Download page
- **Happy path**: Trigger download and upload a small test file, validate UI feedback
- **Priority**: P1
- **Mapped page object**: UploadDownloadPage.ts

## SCENARIO-S07: Web Tables CRUD
- **Feature area**: Elements / Web Tables
- **Goal**: Verify add, edit, delete, search, and pagination behaviors on web tables
- **Preconditions**: Browser open to Web Tables page
- **Happy path**: Create a record, search it, edit, and delete; verify counts/contents
- **Priority**: P0
- **Mapped page object**: WebTablesPage.ts

## SCENARIO-S08: Practice Form End-to-End
- **Feature area**: Forms / Practice Form
- **Goal**: Validate form field input, validation, file upload (picture), and submission confirmation
- **Preconditions**: Browser open to Practice Form page
- **Happy path**: Fill fields with valid data, submit, and confirm submission modal shows data
- **Priority**: P0
- **Mapped page object**: PracticeFormPage.ts

## SCENARIO-S09: Date Picker Input
- **Feature area**: Forms / Date Picker
- **Goal**: Verify date/time selection, manual input, and correct formatted output
- **Preconditions**: Browser open to Date Picker page
- **Happy path**: Select/enter dates and times; validate field values
- **Priority**: P2
- **Mapped page object**: DatePickerPage.ts

## SCENARIO-S10: Alerts Handling
- **Feature area**: Alerts / Frame / Windows
- **Goal**: Verify alert, confirm, and prompt handling and their effects on page
- **Preconditions**: Browser open to Alerts page
- **Happy path**: Trigger alert types, accept/dismiss, and validate page text changes
- **Priority**: P0
- **Mapped page object**: AlertsPage.ts

## SCENARIO-S11: Browser Windows / New Tabs
- **Feature area**: Alerts / Frame / Windows
- **Goal**: Verify opening new tabs/windows and ability to switch and validate content
- **Preconditions**: Browser open to Browser Windows page
- **Happy path**: Click new window/tab controls and validate new context content and closure
- **Priority**: P1
- **Mapped page object**: BrowserWindowsPage.ts

## SCENARIO-S12: Frame Content Validation
- **Feature area**: Alerts / Frame / Windows
- **Goal**: Verify content within single and nested frames is accessible and correct
- **Preconditions**: Browser open to Frames page
- **Happy path**: Switch to frames, read content, and validate expected text and sizes
- **Priority**: P2
- **Mapped page object**: FramesPage.ts

## SCENARIO-S13: Modal Dialogs (Small/Large)
- **Feature area**: Alerts / Frame / Windows
- **Goal**: Verify small and large modal open, content, and close interactions
- **Preconditions**: Browser open to Modal Dialogs page
- **Happy path**: Open each modal, validate content, and close with close button and X
- **Priority**: P1
- **Mapped page object**: ModalDialogsPage.ts

## SCENARIO-S14: AutoComplete Multi/Single
- **Feature area**: Widgets / AutoComplete
- **Goal**: Verify single and multi auto-complete entry behaviors and suggestions filtering
- **Preconditions**: Browser open to Auto Complete page
- **Happy path**: Enter partial values, choose suggestions, and validate tags/values
- **Priority**: P1
- **Mapped page object**: AutoCompletePage.ts

## SCENARIO-S15: Slider Movement
- **Feature area**: Widgets / Slider
- **Goal**: Verify slider value change via drag and keyboard and validate numeric output
- **Preconditions**: Browser open to Slider page
- **Happy path**: Move slider and verify displayed value changes accurately
- **Priority**: P2
- **Mapped page object**: SliderPage.ts

## SCENARIO-S16: Selectable Items
- **Feature area**: Widgets / Selectable
- **Goal**: Verify single and multiple selection modes and visual active state
- **Preconditions**: Browser open to Selectable page
- **Happy path**: Select items in list/grid and confirm selected states
- **Priority**: P2
- **Mapped page object**: SelectablePage.ts

## SCENARIO-S17: Sortable Lists / Grids
- **Feature area**: Widgets / Sortable
- **Goal**: Verify drag reorder behavior for lists and grids and persist order in UI
- **Preconditions**: Browser open to Sortable page
- **Happy path**: Reorder elements and verify new order reflected
- **Priority**: P2
- **Mapped page object**: SortablePage.ts

## SCENARIO-S18: Resizable Elements
- **Feature area**: Widgets / Resizable
- **Goal**: Verify element resize interaction and minimum/maximum constraints
- **Preconditions**: Browser open to Resizable page
- **Happy path**: Resize element to various sizes and verify visible size updates and constraints
- **Priority**: P2
- **Mapped page object**: ResizablePage.ts

## SCENARIO-S19: Tabs Navigation
- **Feature area**: Widgets / Tabs
- **Goal**: Verify tab switching and content visibility per tab
- **Preconditions**: Browser open to Tabs page
- **Happy path**: Click each tab and validate visible content changes
- **Priority**: P2
- **Mapped page object**: TabsPage.ts

## SCENARIO-S20: Progress Bar Controls
- **Feature area**: Widgets / Progress Bar
- **Goal**: Verify progress start/stop/reset behavior and final states
- **Preconditions**: Browser open to Progress Bar page
- **Happy path**: Start progress, stop mid-way, reset, and validate displayed percentage and button states
- **Priority**: P2
- **Mapped page object**: ProgressBarPage.ts

## SCENARIO-S21: Drag and Drop Interactions
- **Feature area**: Interactions / Drag & Drop
- **Goal**: Verify draggable elements can be moved to valid drop targets and revert on invalid drops
- **Preconditions**: Browser open to Drag Drop page
- **Happy path**: Drag element to target, validate target content change or success state
- **Priority**: P1
- **Mapped page object**: DragDropPage.ts

## SCENARIO-S22: Navigation & Base Page Controls
- **Feature area**: Utilities / Navigation
- **Goal**: Verify global navigation menu, landing links and page header/footer presence
- **Preconditions**: Browser open to home or any page
- **Happy path**: Use navigation to reach target pages; validate header/footer elements load
- **Priority**: P1
- **Mapped page object**: Navigation.ts / BasePage.ts

## SCENARIO-S23: Web Accessibility & Edge Cases
- **Feature area**: Cross-cutting / Accessibility & Edge Cases
- **Goal**: Verify basic focusability, keyboard navigation, and invalid input handling across pages
- **Preconditions**: Browser open to target pages
- **Happy path**: Tab through interactive elements, attempt invalid inputs, and verify ARIA/keyboard responses
- **Priority**: P1
- **Mapped page object**: BasePage.ts (applies to all pages)

---

## Coverage Summary

| Feature Area | Scenarios | Priority Breakdown |
|-------------|-----------|-------------------|
| Elements | 7 | P0: 2, P1: 5 |
| Forms | 2 | P0: 1, P2: 1 |
| Alerts/Frame/Windows | 4 | P0: 1, P1: 2, P2: 1 |
| Widgets | 7 | P1: 2, P2: 5 |
| Interactions | 1 | P1: 1 |
| Cross-cutting | 2 | P1: 2 |
| **Total** | **23** | **P0: 4, P1: 12, P2: 7** |

## Traceability Notes

Each scenario above will have corresponding test cases (TC-xxx) defined in the test-cases document. All scenarios map to existing Page Object Model classes, ensuring automation readiness.
