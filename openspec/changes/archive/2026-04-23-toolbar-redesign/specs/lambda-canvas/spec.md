## MODIFIED Requirements

### Requirement: Infinite SVG canvas
The application SHALL render an SVG canvas that supports panning and zooming with no fixed boundaries.

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

## ADDED Requirements

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
