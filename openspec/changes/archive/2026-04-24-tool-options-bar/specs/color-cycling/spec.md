## MODIFIED Requirements

### Requirement: Color mode toggle
The application SHALL provide a toggle between "Stable" and "Cycle" color modes, displayed in the tool options bar when the foreground color tool is active.

#### Scenario: Default color mode
- **WHEN** the application loads
- **THEN** the color mode SHALL be "Stable"

#### Scenario: Toggle color mode
- **WHEN** user clicks the color mode toggle in the foreground color options
- **THEN** the color mode SHALL switch between "Stable" and "Cycle"
