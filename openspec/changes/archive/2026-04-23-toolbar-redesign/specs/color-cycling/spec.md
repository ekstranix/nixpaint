## ADDED Requirements

### Requirement: Color mode toggle
The application SHALL provide a toggle between "Stable" and "Cycle" color modes, displayed in the top toolbar near the palette.

#### Scenario: Default color mode
- **WHEN** the application loads
- **THEN** the color mode SHALL be "Stable"

#### Scenario: Toggle color mode
- **WHEN** user clicks the color mode toggle
- **THEN** the color mode SHALL switch between "Stable" and "Cycle"

### Requirement: Stable color mode
In Stable color mode, painting SHALL use the manually selected active color for all cells.

#### Scenario: Paint with stable color
- **WHEN** color mode is "Stable" and user paints
- **THEN** all cells SHALL be filled with the currently selected active color

### Requirement: Cycle color mode
In Cycle color mode, each cell painted SHALL use the next color in the active palette, advancing automatically.

#### Scenario: Per-cell color cycling
- **WHEN** color mode is "Cycle" and user paints multiple cells
- **THEN** each successive cell SHALL use the next color in the palette, wrapping to the first color after the last

#### Scenario: Cycle index resets on palette change
- **WHEN** user switches to a different palette while in Cycle mode
- **THEN** the cycle index SHALL reset to the first color of the new palette
