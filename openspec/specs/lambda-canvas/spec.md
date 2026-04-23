# lambda-canvas Specification

## Purpose
TBD - created by archiving change project-setup. Update Purpose after archive.
## Requirements
### Requirement: Infinite SVG canvas
The application SHALL render an SVG canvas that supports panning and zooming with no fixed boundaries. The canvas SHALL use `preserveAspectRatio="none"` to fill its container without letterboxing. All screen-to-SVG coordinate conversions SHALL use the SVG's native `getScreenCTM()` transform matrix.

#### Scenario: Pan the canvas
- **WHEN** user middle-click-drags or two-finger-drags on the canvas
- **THEN** the viewBox shifts to follow the drag, revealing previously off-screen areas

#### Scenario: Pan with pan tool
- **WHEN** pan mode is active and user left-click-drags on the canvas
- **THEN** the viewBox shifts to follow the drag, identical to middle-click panning

#### Scenario: Zoom the canvas
- **WHEN** user scrolls the mouse wheel or pinch-zooms
- **THEN** the viewBox scales around the pointer position, zooming in or out smoothly

#### Scenario: Zoom in via button
- **WHEN** user clicks the Zoom In button in the top toolbar
- **THEN** the viewBox SHALL zoom in by a factor of 1.25x centered on the viewport center

#### Scenario: Zoom out via button
- **WHEN** user clicks the Zoom Out button in the top toolbar
- **THEN** the viewBox SHALL zoom out by a factor of 1.25x centered on the viewport center

#### Scenario: Coordinate accuracy after pan and zoom
- **WHEN** the user pans and zooms multiple times, then paints
- **THEN** the lambda SHALL appear exactly under the pointer with no drift or offset

### Requirement: Lambda rendering on hex grid
The application SHALL render Nix lambda shapes as SVG path elements positioned on a hex grid. Each lambda uses the canonical Nix lambda path data, is fixed-size, and is rotated according to its hex grid position (cycling through 0°, 60°, 120°, 180°, 240°, 300°).

#### Scenario: Lambda appears at correct grid position
- **WHEN** a hex cell is filled
- **THEN** a lambda SVG path element is rendered at the cell's center coordinates with the rotation determined by the cell's position in the grid

#### Scenario: Lambdas do not overlap
- **WHEN** multiple adjacent hex cells are filled
- **THEN** no two lambda shapes visually overlap

### Requirement: Viewport-based rendering
The application SHALL only render lambda elements that are within or near the current viewBox to maintain performance.

#### Scenario: Off-screen lambdas not in DOM
- **WHEN** the canvas contains 1000+ filled cells but only 50 are visible
- **THEN** approximately 50 SVG elements are present in the DOM (plus a buffer margin)

### Requirement: Cursor reflects active tool
The canvas cursor SHALL change based on the active tool mode.

#### Scenario: Paint mode cursor
- **WHEN** paint mode is active
- **THEN** the canvas cursor SHALL be "default"

#### Scenario: Erase mode cursor
- **WHEN** erase mode is active
- **THEN** the canvas cursor SHALL be "crosshair"

#### Scenario: Pan mode cursor
- **WHEN** pan mode is active and user is not dragging
- **THEN** the canvas cursor SHALL be "grab"

#### Scenario: Pan mode dragging cursor
- **WHEN** pan mode is active and user is dragging
- **THEN** the canvas cursor SHALL be "grabbing"

