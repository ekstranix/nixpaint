## MODIFIED Requirements

### Requirement: Vertical side toolbar
The application SHALL display a vertical toolbar on the left side of the canvas containing tool selection buttons: Paint, Erase, Pan, Node, Foreground Color, and Background Color.

#### Scenario: Side toolbar is visible
- **WHEN** the application loads
- **THEN** a narrow vertical toolbar is visible on the left edge, containing Paint, Erase, Pan, Node, Foreground Color, and Background Color tool buttons

### Requirement: Icon-only buttons with tooltips
Each side toolbar button SHALL display an icon only, with a tooltip shown on hover revealing the tool name.

#### Scenario: Tooltip on hover
- **WHEN** user hovers over a side toolbar button
- **THEN** a tooltip displaying the tool name (e.g., "Paint", "Erase", "Pan", "Node", "Foreground Color", "Background Color") SHALL appear

### Requirement: Active tool indicator
The side toolbar SHALL visually indicate which tool is currently active.

#### Scenario: Active tool is highlighted
- **WHEN** user selects a tool
- **THEN** that tool's button SHALL be visually highlighted and all other tool buttons SHALL not be highlighted
