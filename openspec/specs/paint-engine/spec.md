# paint-engine Specification

## Purpose
TBD - created by archiving change project-setup. Update Purpose after archive.
## Requirements
### Requirement: Paint by dragging
The application SHALL fill hex grid cells with lambdas as the user paints by pressing and dragging the pointer across the canvas. Paint mode is selectable from the side toolbar. Pointer position SHALL be converted to SVG coordinates using the native `getScreenCTM()` transform for exact mapping at all zoom levels.

#### Scenario: Single click stamps one lambda
- **WHEN** user clicks on the canvas in paint mode
- **THEN** the hex cell under the pointer is filled with a lambda in the active color (or next cycle color if in Cycle mode)

#### Scenario: Drag paints a stroke of lambdas
- **WHEN** user presses and drags across the canvas in paint mode
- **THEN** all hex cells along the pointer path are filled with lambdas

#### Scenario: Already-filled cells are not overwritten during paint
- **WHEN** the pointer crosses a cell that is already filled
- **THEN** that cell retains its existing color and rotation (no double-stamp)

#### Scenario: No coordinate drift during extended painting
- **WHEN** user paints continuously for an extended session with panning and zooming interspersed
- **THEN** lambdas SHALL always appear exactly under the pointer with no accumulated drift

### Requirement: Erase mode
The application SHALL provide an erase mode, selectable from the side toolbar, that removes lambdas from hex cells. Pointer position SHALL use the same `getScreenCTM()` coordinate conversion as painting.

#### Scenario: Erase by dragging
- **WHEN** erase mode is active and user drags across filled cells
- **THEN** those cells are cleared (lambdas removed)

### Requirement: Clear canvas
The application SHALL provide a way to clear all lambdas from the canvas.

#### Scenario: Clear all
- **WHEN** user activates "Clear" action
- **THEN** all filled cells are removed and the canvas is empty

### Requirement: Pan mode
The application SHALL provide a pan mode, selectable from the side toolbar, that pans the canvas with left-click drag.

#### Scenario: Pan mode does not paint
- **WHEN** pan mode is active and user clicks or drags on the canvas
- **THEN** no cells SHALL be filled or erased

