## MODIFIED Requirements

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
