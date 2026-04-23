# background-color Specification

## Purpose
Canvas background color selection and export background toggle.
## Requirements
### Requirement: Selectable canvas background color
The application SHALL allow the user to select a canvas background color from presets: white (#ffffff), gray (#808080), and dark blue (#1a1a2e, the current default).

#### Scenario: Change background color
- **WHEN** user selects a background color preset
- **THEN** the canvas background SHALL change to the selected color

#### Scenario: Default background
- **WHEN** the application loads
- **THEN** the canvas background SHALL be dark blue (#1a1a2e)

### Requirement: Export background toggle
The application SHALL provide a checkbox to include or exclude the background color in SVG and PNG exports.

#### Scenario: Export with background enabled
- **WHEN** "export background" is checked and user exports
- **THEN** the exported file SHALL include a background rect in the selected background color

#### Scenario: Export with background disabled
- **WHEN** "export background" is unchecked and user exports
- **THEN** the exported file SHALL have a transparent background (no background rect)
