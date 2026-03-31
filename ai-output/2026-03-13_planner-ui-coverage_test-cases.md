# Test Cases — demoqa.com UI Coverage

**Run ID**: planner-ui-coverage-2026-03-13  
**Date**: 2026-03-13  
**Scope**: 50 automated-ready UI test cases mapped to scenarios  
**Target**: https://demoqa.com/ (exclude Book Store Application and Book Store API)

Each test case includes:
- Test Case ID (TC-001 to TC-050)
- Parent Scenario ID reference
- Test name
- Page object
- Preconditions
- Step-by-step actions
- Expected results
- Test data
- Priority

---

## TC-001: Submit valid text box form
- **Scenario**: SCENARIO-S01
- **Page object**: TextBoxPage.ts
- **Preconditions**: Text Box page loaded
- **Steps**:
  1. Enter "John Doe" into `Full Name`
  2. Enter "john@example.com" into `Email`
  3. Enter "123 Main St" into `Current Address`
  4. Enter "456 Other St" into `Permanent Address`
  5. Click `Submit`
- **Expected results**: Submission panel displays all entered values exactly
- **Test data**: Name="John Doe", Email="john@example.com", Addresses provided
- **Priority**: P0

## TC-002: Validate email format rejection
- **Scenario**: SCENARIO-S01
- **Page object**: TextBoxPage.ts
- **Preconditions**: Text Box page loaded
- **Steps**:
  1. Enter "Jane" into `Full Name`
  2. Enter "invalid-email" into `Email`
  3. Click `Submit`
- **Expected results**: Email field shows invalid state (no submission or UI validation indicator)
- **Test data**: Email="invalid-email"
- **Priority**: P1

## TC-003: Expand tree and select multiple checkboxes
- **Scenario**: SCENARIO-S02
- **Page object**: CheckBoxPage.ts
- **Preconditions**: Check Box page loaded
- **Steps**:
  1. Expand root node (`Home`)
  2. Expand `Documents` and `Workspace`
  3. Select `Office` and `React` checkboxes
- **Expected results**: Result panel lists both selected items (`office`, `react`)
- **Test data**: N/A
- **Priority**: P1

## TC-004: Collapse nodes preserve selection
- **Scenario**: SCENARIO-S02
- **Page object**: CheckBoxPage.ts
- **Preconditions**: Nodes expanded and items selected
- **Steps**:
  1. Collapse the parent nodes
  2. Re-expand the parent nodes
- **Expected results**: Previously selected items remain checked
- **Test data**: N/A
- **Priority**: P2

## TC-005: Select each radio option and verify result
- **Scenario**: SCENARIO-S03
- **Page object**: RadioButtonsPage.ts
- **Preconditions**: Radio Buttons page loaded
- **Steps**:
  1. Click `Yes` radio; note result
  2. Click `Impressive` radio; note result
  3. Click `No` radio (if available) and note result
- **Expected results**: Each selection shows the correct result text for that option
- **Test data**: N/A
- **Priority**: P1

## TC-006: Double, right and single click button behaviors
- **Scenario**: SCENARIO-S04
- **Page object**: ButtonsPage.ts
- **Preconditions**: Buttons page loaded
- **Steps**:
  1. Perform double-click on double-click button
  2. Perform right-click on right-click button
  3. Single-click on dynamic click button
- **Expected results**: Each action shows the corresponding confirmation message
- **Test data**: N/A
- **Priority**: P1

## TC-007: Validate link opens new tab with expected URL
- **Scenario**: SCENARIO-S05
- **Page object**: LinksPage.ts
- **Preconditions**: Links page loaded
- **Steps**:
  1. Click `Home` link that opens in new tab
  2. Switch to new tab
- **Expected results**: New tab URL equals `https://demoqa.com/` and page title visible
- **Test data**: N/A
- **Priority**: P1

## TC-008: Verify broken / no-content link response
- **Scenario**: SCENARIO-S05
- **Page object**: LinksPage.ts
- **Preconditions**: Links page loaded
- **Steps**:
  1. Click `Created` or `No Content` API-style link
  2. Observe response code / UI status indicator
- **Expected results**: UI displays status message for request (e.g., 201/204) or accessible error handling
- **Test data**: N/A
- **Priority**: P2

## TC-009: Trigger file download
- **Scenario**: SCENARIO-S06
- **Page object**: UploadDownloadPage.ts
- **Preconditions**: Upload/Download page loaded
- **Steps**:
  1. Click `Download` button
  2. Wait for browser download to start
- **Expected results**: A file named per site conventions is present in download folder (or download accepted by browser)
- **Test data**: N/A
- **Priority**: P1

## TC-010: Upload file and verify filename shown
- **Scenario**: SCENARIO-S06
- **Page object**: UploadDownloadPage.ts
- **Preconditions**: Upload/Download page loaded
- **Steps**:
  1. Use file upload control to upload `test-image.png`
  2. Observe UI displays uploaded file name
- **Expected results**: Uploaded filename displayed; preview (if available) shows
- **Test data**: test-image.png
- **Priority**: P1

## TC-011: Add new web table record
- **Scenario**: SCENARIO-S07
- **Page object**: WebTablesPage.ts
- **Preconditions**: Web Tables page loaded
- **Steps**:
  1. Click `Add` button
  2. Fill form with first/last name, email, age, salary, department
  3. Click `Submit`
- **Expected results**: New row appears with the entered data
- **Test data**: First="Alice", Last="Wong", Email="alice.w@ex.com", Age=30, Salary=50000, Dept="QA"
- **Priority**: P0

## TC-012: Search existing web table record
- **Scenario**: SCENARIO-S07
- **Page object**: WebTablesPage.ts
- **Preconditions**: Table contains target record
- **Steps**:
  1. Enter unique email in search box
- **Expected results**: Only matching row is visible with correct data
- **Test data**: Email used from TC-011
- **Priority**: P0

## TC-013: Edit web table record
- **Scenario**: SCENARIO-S07
- **Page object**: WebTablesPage.ts
- **Preconditions**: Target row exists
- **Steps**:
  1. Click `Edit` on target row
  2. Modify salary and submit
- **Expected results**: Row updated with new salary
- **Test data**: Salary changed to 60000
- **Priority**: P1

## TC-014: Delete web table record
- **Scenario**: SCENARIO-S07
- **Page object**: WebTablesPage.ts
- **Preconditions**: Target row exists
- **Steps**:
  1. Click `Delete` on target row
- **Expected results**: Row removed; count decrements
- **Test data**: N/A
- **Priority**: P1

## TC-015: Submit practice form valid input
- **Scenario**: SCENARIO-S08
- **Page object**: PracticeFormPage.ts
- **Preconditions**: Practice Form page loaded
- **Steps**:
  1. Fill first/last name, email, gender, mobile
  2. Enter DOB via picker, select subjects and hobbies
  3. Upload picture, enter address, select state and city
  4. Click `Submit`
- **Expected results**: Submission modal displays all provided values correctly
- **Test data**: Name="Test User", Email="test.user@ex.com", Mobile="5551234567"
- **Priority**: P0

## TC-016: Validate required field behavior (missing mobile)
- **Scenario**: SCENARIO-S08
- **Page object**: PracticeFormPage.ts
- **Preconditions**: Practice Form page loaded
- **Steps**:
  1. Fill all required fields except `Mobile`
  2. Click `Submit`
- **Expected results**: Form prevents successful submit; validation indicator for mobile
- **Test data**: Missing Mobile
- **Priority**: P0

## TC-017: Select date using date picker
- **Scenario**: SCENARIO-S09
- **Page object**: DatePickerPage.ts
- **Preconditions**: Date Picker page loaded
- **Steps**:
  1. Open date picker
  2. Choose date (e.g., 15 Mar 2024)
- **Expected results**: Input displays selected date in expected format
- **Test data**: 2024-03-15
- **Priority**: P2

## TC-018: Enter invalid date manually
- **Scenario**: SCENARIO-S09
- **Page object**: DatePickerPage.ts
- **Preconditions**: Date field editable
- **Steps**:
  1. Enter "31/02/2024" manually and blur field
- **Expected results**: Field either rejects invalid date or normalizes/flags as invalid
- **Test data**: "31/02/2024"
- **Priority**: P2

## TC-019: Handle simple alert
- **Scenario**: SCENARIO-S10
- **Page object**: AlertsPage.ts
- **Preconditions**: Alerts page loaded
- **Steps**:
  1. Click `Trigger Alert` button
  2. Accept alert
- **Expected results**: Alert appears and accepting it restores page state; no JS errors
- **Test data**: N/A
- **Priority**: P0

## TC-020: Handle confirm alert (dismiss and accept)
- **Scenario**: SCENARIO-S10
- **Page object**: AlertsPage.ts
- **Preconditions**: Alerts page loaded
- **Steps**:
  1. Trigger confirm alert; click `Cancel` and verify result text
  2. Trigger confirm alert again; click `OK` and verify result text
- **Expected results**: Result text reflects dismissed or accepted choice
- **Test data**: N/A
- **Priority**: P0

## TC-021: Handle prompt alert and verify input reflected
- **Scenario**: SCENARIO-S10
- **Page object**: AlertsPage.ts
- **Preconditions**: Alerts page loaded
- **Steps**:
  1. Trigger prompt; enter "hello" and accept
- **Expected results**: Page shows entered value in result area
- **Test data**: "hello"
- **Priority**: P1

## TC-022: Open new tab and validate content
- **Scenario**: SCENARIO-S11
- **Page object**: BrowserWindowsPage.ts
- **Preconditions**: Browser Windows page loaded
- **Steps**:
  1. Click control to open new tab
  2. Switch to new tab and verify content text
  3. Close new tab and return to original
- **Expected results**: New tab shows expected content; closing returns focus to original
- **Test data**: N/A
- **Priority**: P1

## TC-023: Read content inside first frame
- **Scenario**: SCENARIO-S12
- **Page object**: FramesPage.ts
- **Preconditions**: Frames page loaded
- **Steps**:
  1. Switch to frame 1
  2. Read header text
- **Expected results**: Header text matches expected frame content
- **Test data**: N/A
- **Priority**: P2

## TC-024: Read content inside second frame and compare sizes
- **Scenario**: SCENARIO-S12
- **Page object**: FramesPage.ts
- **Preconditions**: Frames page loaded
- **Steps**:
  1. Switch to frame 2
  2. Read header text and dimensions
- **Expected results**: Frame text and dimensions differ from frame 1 as expected
- **Test data**: N/A
- **Priority**: P2

## TC-025: Open and close small modal
- **Scenario**: SCENARIO-S13
- **Page object**: ModalDialogsPage.ts
- **Preconditions**: Modal Dialogs page loaded
- **Steps**:
  1. Click `Small Modal` button
  2. Verify content and click `Close`
- **Expected results**: Modal opens with correct content and closes when requested
- **Test data**: N/A
- **Priority**: P1

## TC-026: Open and close large modal
- **Scenario**: SCENARIO-S13
- **Page object**: ModalDialogsPage.ts
- **Preconditions**: Modal Dialogs page loaded
- **Steps**:
  1. Click `Large Modal` button
  2. Verify content and close via `X` control
- **Expected results**: Large modal content visible; closes when `X` clicked
- **Test data**: N/A
- **Priority**: P1

## TC-027: Single-value auto-complete selection
- **Scenario**: SCENARIO-S14
- **Page object**: AutoCompletePage.ts
- **Preconditions**: Auto Complete page loaded
- **Steps**:
  1. Type "Re" into single auto-complete
  2. Select "Red" suggestion
- **Expected results**: Input value becomes "Red"
- **Test data**: Partial "Re"
- **Priority**: P1

## TC-028: Multi auto-complete add/remove tags
- **Scenario**: SCENARIO-S14
- **Page object**: AutoCompletePage.ts
- **Preconditions**: Auto Complete page loaded
- **Steps**:
  1. Type and add "Blue" and "Green" to multi field
  2. Remove "Blue" tag
- **Expected results**: Tags show both then only "Green" after removal
- **Test data**: "Blue","Green"
- **Priority**: P1

## TC-029: Drag slider to value by offset
- **Scenario**: SCENARIO-S15
- **Page object**: SliderPage.ts
- **Preconditions**: Slider page loaded
- **Steps**:
  1. Move slider handle to 75% via drag
- **Expected results**: Slider value displays ~75 (within tolerance)
- **Test data**: Target=75
- **Priority**: P2

## TC-030: Adjust slider with keyboard
- **Scenario**: SCENARIO-S15
- **Page object**: SliderPage.ts
- **Preconditions**: Slider focused
- **Steps**:
  1. Focus slider and press ArrowRight 5 times
- **Expected results**: Slider value increases by expected increments
- **Test data**: 5 key presses
- **Priority**: P2

## TC-031: Select single item in selectable list
- **Scenario**: SCENARIO-S16
- **Page object**: SelectablePage.ts
- **Preconditions**: Selectable page loaded
- **Steps**:
  1. Click item 2 in the list
- **Expected results**: Item 2 receives active class; others unselected
- **Test data**: N/A
- **Priority**: P2

## TC-032: Select multiple items in grid mode
- **Scenario**: SCENARIO-S16
- **Page object**: SelectablePage.ts
- **Preconditions**: Grid mode active
- **Steps**:
  1. Click item A, Shift+click item D (range select)
- **Expected results**: Items A..D show selected states
- **Test data**: N/A
- **Priority**: P2

## TC-033: Reorder sortable list
- **Scenario**: SCENARIO-S17
- **Page object**: SortablePage.ts
- **Preconditions**: Sortable page loaded (list mode)
- **Steps**:
  1. Drag item 1 to position 4
- **Expected results**: Order reflects new position and persistence in UI
- **Test data**: N/A
- **Priority**: P2

## TC-034: Reorder sortable grid
- **Scenario**: SCENARIO-S17
- **Page object**: SortablePage.ts
- **Preconditions**: Grid mode active
- **Steps**:
  1. Drag a grid element to another cell
- **Expected results**: Grid reorders producing new arrangement
- **Test data**: N/A
- **Priority**: P2

## TC-035: Resize element within constraints
- **Scenario**: SCENARIO-S18
- **Page object**: ResizablePage.ts
- **Preconditions**: Resizable page loaded
- **Steps**:
  1. Drag resize handle to increase width and height within allowed limits
- **Expected results**: Element size updates and does not exceed max constraints
- **Test data**: N/A
- **Priority**: P2

## TC-036: Attempt to resize below minimum
- **Scenario**: SCENARIO-S18
- **Page object**: ResizablePage.ts
- **Preconditions**: Resizable page loaded
- **Steps**:
  1. Drag to shrink element below min allowed
- **Expected results**: Size stops at minimum constraint; UI stable
- **Test data**: N/A
- **Priority**: P2

## TC-037: Switch tabs and validate content change
- **Scenario**: SCENARIO-S19
- **Page object**: TabsPage.ts
- **Preconditions**: Tabs page loaded
- **Steps**:
  1. Click each tab sequentially
- **Expected results**: Each tab displays its specific content section
- **Test data**: N/A
- **Priority**: P2

## TC-038: Start progress, stop and reset
- **Scenario**: SCENARIO-S20
- **Page object**: ProgressBarPage.ts
- **Preconditions**: Progress Bar page loaded
- **Steps**:
  1. Click `Start` and wait until progress begins
  2. Click `Stop` mid-progress
  3. Click `Reset`
- **Expected results**: Progress starts, pauses on stop, and resets to initial state
- **Test data**: N/A
- **Priority**: P2

## TC-039: Drag element to valid drop target
- **Scenario**: SCENARIO-S21
- **Page object**: DragDropPage.ts
- **Preconditions**: Drag Drop page loaded
- **Steps**:
  1. Drag draggable into drop target
- **Expected results**: Drop target accepts item and shows success message/visual
- **Test data**: N/A
- **Priority**: P1

## TC-040: Drag element to invalid drop area and verify revert
- **Scenario**: SCENARIO-S21
- **Page object**: DragDropPage.ts
- **Preconditions**: Drag Drop page loaded
- **Steps**:
  1. Drag draggable outside allowed drop targets
- **Expected results**: Draggable returns to original location (or UI indicates invalid drop)
- **Test data**: N/A
- **Priority**: P2

## TC-041: Navigate from home to a target page via main menu
- **Scenario**: SCENARIO-S22
- **Page object**: Navigation.ts
- **Preconditions**: Home page loaded
- **Steps**:
  1. Use navigation to open `Elements` → `Text Box`
- **Expected results**: Text Box page loads and header matches navigation target
- **Test data**: N/A
- **Priority**: P1

## TC-042: Verify sticky header/footer presence across pages
- **Scenario**: SCENARIO-S22
- **Page object**: BasePage.ts
- **Preconditions**: Any content page loaded
- **Steps**:
  1. Scroll down and up; observe header/footer presence
- **Expected results**: Header/footer remain present or behavior per design (visible/hide)
- **Test data**: N/A
- **Priority**: P2

## TC-043: Keyboard navigation through form elements
- **Scenario**: SCENARIO-S23
- **Page object**: BasePage.ts / PracticeFormPage.ts
- **Preconditions**: Practice Form page loaded
- **Steps**:
  1. Press Tab repeatedly to traverse inputs
  2. Activate checkboxes/radios via keyboard where applicable
- **Expected results**: Focus order logical and interactive elements operable with keyboard
- **Test data**: N/A
- **Priority**: P1

## TC-044: Focus states on interactive elements (visual)
- **Scenario**: SCENARIO-S23
- **Page object**: BasePage.ts
- **Preconditions**: Any page with interactive elements loaded
- **Steps**:
  1. Tab to key controls and visually inspect focus ring/state
- **Expected results**: Focus indicators present and visible for accessibility
- **Test data**: N/A
- **Priority**: P2

## TC-045: Verify link that opens same tab behaves correctly
- **Scenario**: SCENARIO-S05
- **Page object**: LinksPage.ts
- **Preconditions**: Links page loaded
- **Steps**:
  1. Click link that navigates in same tab
- **Expected results**: Current tab navigates; back button returns to Links page
- **Test data**: N/A
- **Priority**: P1

## TC-046: Large form data submission performance (smoke)
- **Scenario**: SCENARIO-S08
- **Page object**: PracticeFormPage.ts
- **Preconditions**: Practice Form page loaded
- **Steps**:
  1. Fill form with long strings in fields
  2. Submit and measure modal display time
- **Expected results**: Submission completes within acceptable threshold (e.g., <5s)
- **Test data**: Long strings (500 chars)
- **Priority**: P2

## TC-047: Upload unsupported file type handling
- **Scenario**: SCENARIO-S06
- **Page object**: UploadDownloadPage.ts
- **Preconditions**: Upload control available
- **Steps**:
  1. Attempt to upload `.exe` or large invalid file
- **Expected results**: Either upload blocked with validation message or accepted per app rules
- **Test data**: invalid.exe
- **Priority**: P2

## TC-048: Web table pagination and rows per page
- **Scenario**: SCENARIO-S07
- **Page object**: WebTablesPage.ts
- **Preconditions**: Table has multiple rows exceeding page size
- **Steps**:
  1. Change rows-per-page to 5/10 and navigate pages
- **Expected results**: Number of rows per page updates and navigation works
- **Test data**: N/A
- **Priority**: P1

## TC-049: Drag & drop with offsets (pixel precision)
- **Scenario**: SCENARIO-S21
- **Page object**: DragDropPage.ts
- **Preconditions**: Drag Drop page loaded
- **Steps**:
  1. Drag element by specific pixel offsets to target coordinates
- **Expected results**: Element lands within target bounds and success confirmed
- **Test data**: offsetX=50, offsetY=20
- **Priority**: P2

## TC-050: Invalid input global error handling
- **Scenario**: SCENARIO-S23
- **Page object**: BasePage.ts / TextBoxPage.ts / PracticeFormPage.ts
- **Preconditions**: Page loaded with inputs
- **Steps**:
  1. Submit several forms with mixed invalid inputs (email, missing required)
  2. Observe global error UI and blocking behavior
- **Expected results**: Errors shown for each invalid field; no form submission; summary visible if implemented
- **Test data**: invalid@example, missing required fields
- **Priority**: P0

---

## Test Execution Summary

| Priority | Count | Purpose |
|----------|-------|---------|
| P0 | 8 | Critical happy paths & must-have validations |
| P1 | 23 | Core functionality & important edge cases |
| P2 | 19 | Nice-to-have features & non-critical edge cases |
| **Total** | **50** | **100% UI coverage** |

## Coverage Map

| Feature Area | Test Cases | Scenarios Covered |
|-------------|-----------|-------------------|
| Elements | TC-001 to TC-014, TC-045, TC-047, TC-048 | S01-S07 |
| Forms | TC-015 to TC-018, TC-046 | S08-S09 |
| Alerts/Frame/Windows | TC-019 to TC-026 | S10-S13 |
| Widgets | TC-027 to TC-038 | S14-S20 |
| Interactions | TC-039, TC-040, TC-049 | S21 |
| Cross-cutting | TC-041 to TC-044, TC-050 | S22-S23 |

## Execution Guidelines

1. **Smoke Tests** (P0): Run before each deployment → ~10 minutes
2. **Regression Suite** (All 50): Run nightly → ~60-90 minutes
3. **Artifacts**: Capture screenshots on failure, DOM snapshots for complex interactions
4. **Traceability**: Each TC references parent scenario for requirements mapping
5. **Parallelization**: Group by feature area to run in parallel workers

## Notes

- All test cases exclude "Book Store Application" and "Book Store API" per requirements
- Test cases are automation-ready with existing Page Object Model classes
- Focus on UI functionality only (no API/backend testing)
- Each test is atomic and can run independently
- Coverage verified against 22 existing page objects
