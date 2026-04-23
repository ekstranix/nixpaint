# lambda-canvas Specification

## Purpose
TBD - created by archiving change project-setup. Update Purpose after archive.
## Requirements
### Requirement: Infinite SVG canvas
The application SHALL render an SVG canvas that supports panning and zooming with no fixed boundaries.

#### Scenario: Pan the canvas
- **WHEN** user middle-click-drags or two-finger-drags on the canvas
- **THEN** the viewBox shifts to follow the drag, revealing previously off-screen areas

#### Scenario: Zoom the canvas
- **WHEN** user scrolls the mouse wheel or pinch-zooms
- **THEN** the viewBox scales around the pointer position, zooming in or out smoothly

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

