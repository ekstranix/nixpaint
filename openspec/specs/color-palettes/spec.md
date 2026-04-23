# color-palettes Specification

## Purpose
TBD - created by archiving change project-setup. Update Purpose after archive.
## Requirements
### Requirement: Two-tone Nix blue palette
The application SHALL provide a "Nix Blue" palette with exactly two colors:
- Light blue: `#7EBAE4`
- Dark blue: `#5277C3`

#### Scenario: Select Nix Blue palette
- **WHEN** user selects the Nix Blue palette
- **THEN** only the two blue colors are available for painting

### Requirement: NixOS rainbow palette
The application SHALL provide a "NixOS Rainbow" palette with six colors:
- Red: `#E40303`
- Orange: `#FF8C00`
- Yellow: `#FFED00`
- Green: `#008026`
- Blue: `#24408E`
- Purple: `#732982`

#### Scenario: Select Rainbow palette
- **WHEN** user selects the Rainbow palette
- **THEN** all six rainbow colors are available for painting

### Requirement: Palette selector UI
The application SHALL display a palette selector allowing the user to switch between palettes (Nix Blue, NixOS Rainbow, Grayscale) and pick a color within the active palette. The palette UI SHALL be displayed in the tool options bar when the foreground color tool is active.

#### Scenario: Switch palette
- **WHEN** user switches from Nix Blue to Rainbow palette
- **THEN** the color picker updates to show the six rainbow colors and the active color changes to the first color of the new palette

#### Scenario: Select color within palette
- **WHEN** user clicks a color swatch in the palette
- **THEN** that color becomes the active paint color

