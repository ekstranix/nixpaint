## ADDED Requirements

### Requirement: Grayscale palette
The application SHALL provide a "Grayscale" palette with five colors:
- White: `#ffffff`
- Light gray: `#c0c0c0`
- Gray: `#808080`
- Dark gray: `#404040`
- Black: `#000000`

#### Scenario: Select Grayscale palette
- **WHEN** user selects the Grayscale palette
- **THEN** all five grayscale colors are available for painting

## MODIFIED Requirements

### Requirement: Palette selector UI
The application SHALL display a palette selector allowing the user to switch between palettes (Nix Blue, NixOS Rainbow, Grayscale) and pick a color within the active palette. The palette UI SHALL be displayed in the tool options bar when the foreground color tool is active.

#### Scenario: Switch palette
- **WHEN** user switches from Nix Blue to Rainbow palette
- **THEN** the color picker updates to show the six rainbow colors and the active color changes to the first color of the new palette

#### Scenario: Select color within palette
- **WHEN** user clicks a color swatch in the palette
- **THEN** that color becomes the active paint color
