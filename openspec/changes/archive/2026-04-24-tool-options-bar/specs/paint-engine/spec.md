## MODIFIED Requirements

### Requirement: Paint by dragging
The application SHALL fill hex grid cells with lambdas as the user paints by pressing and dragging the pointer across the canvas. Paint mode is selectable from the side toolbar. Pointer position SHALL be converted to SVG coordinates using the native `getScreenCTM()` transform for exact mapping at all zoom levels.

#### Scenario: Single click stamps one lambda
- **WHEN** user clicks on the canvas in paint mode with brush width 1
- **THEN** the hex cell under the pointer is filled with a lambda in the active color (or next cycle color if in Cycle mode)

#### Scenario: Drag paints a stroke of lambdas
- **WHEN** user presses and drags across the canvas in paint mode
- **THEN** all hex cells along the pointer path are filled with lambdas, expanding to the configured brush width

#### Scenario: Already-filled cells are not overwritten during paint
- **WHEN** the pointer crosses a cell that is already filled
- **THEN** that cell retains its existing color and rotation (no double-stamp)

#### Scenario: No coordinate drift during extended painting
- **WHEN** user paints continuously for an extended session with panning and zooming interspersed
- **THEN** lambdas SHALL always appear exactly under the pointer with no accumulated drift

## ADDED Requirements

### Requirement: Brush width
The paint tool SHALL support a configurable brush width (radius in hex cells). Width 1 fills a single cell. Width 2 fills the center cell and its 6 neighbors. Width 3 fills 2 rings of neighbors.

#### Scenario: Brush width 2
- **WHEN** brush width is 2 and user clicks a cell
- **THEN** the clicked cell and all 6 adjacent cells SHALL be filled

### Requirement: Paint or stamp mode
The paint tool SHALL support two sub-modes: paint (drag to fill) and stamp (click to place single lambda).

#### Scenario: Stamp mode ignores drag
- **WHEN** stamp mode is active and user drags
- **THEN** only the initial click position SHALL be filled (no stroke)

### Requirement: Paint rotation mode
The paint tool SHALL support a rotation mode: auto-cycle (default, rotation from hex position) or a fixed angle (0°, 60°, 120°, 180°, 240°, 300°).

#### Scenario: Fixed rotation paint
- **WHEN** paint rotation is set to 60°
- **THEN** all lambdas placed by the paint tool SHALL use 60° rotation regardless of hex position

### Requirement: Eraser width
The erase tool SHALL support a configurable eraser size (radius in hex cells), matching brush width behavior.

#### Scenario: Eraser width 2
- **WHEN** eraser width is 2 and user clicks a filled cell
- **THEN** the clicked cell and all 6 adjacent cells SHALL be erased

### Requirement: Erase mode
The application SHALL provide an erase mode, selectable from the side toolbar, that removes lambdas from hex cells. Pointer position SHALL use the same `getScreenCTM()` coordinate conversion as painting.

#### Scenario: Erase by dragging
- **WHEN** erase mode is active and user drags across filled cells
- **THEN** those cells are cleared (lambdas removed), expanding to the configured eraser width
