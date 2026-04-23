## ADDED Requirements

### Requirement: Paint by dragging
The application SHALL fill hex grid cells with lambdas as the user paints by pressing and dragging the pointer across the canvas.

#### Scenario: Single click stamps one lambda
- **WHEN** user clicks on the canvas
- **THEN** the hex cell under the pointer is filled with a lambda in the active color

#### Scenario: Drag paints a stroke of lambdas
- **WHEN** user presses and drags across the canvas
- **THEN** all hex cells along the pointer path are filled with lambdas in the active color

#### Scenario: Already-filled cells are not overwritten during paint
- **WHEN** the pointer crosses a cell that is already filled
- **THEN** that cell retains its existing color and rotation (no double-stamp)

### Requirement: Erase mode
The application SHALL provide an erase mode that removes lambdas from hex cells.

#### Scenario: Erase by dragging
- **WHEN** erase mode is active and user drags across filled cells
- **THEN** those cells are cleared (lambdas removed)

### Requirement: Clear canvas
The application SHALL provide a way to clear all lambdas from the canvas.

#### Scenario: Clear all
- **WHEN** user activates "Clear" action
- **THEN** all filled cells are removed and the canvas is empty
