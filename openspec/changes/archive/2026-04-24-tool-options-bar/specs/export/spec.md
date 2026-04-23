## MODIFIED Requirements

### Requirement: SVG export
The application SHALL allow the user to download their painting as an SVG file.

#### Scenario: Export as SVG without background
- **WHEN** user clicks "Export SVG" and "export background" is unchecked
- **THEN** a `.svg` file is downloaded containing all painted lambdas with no background rect

#### Scenario: Export as SVG with background
- **WHEN** user clicks "Export SVG" and "export background" is checked
- **THEN** a `.svg` file is downloaded containing a background rect in the selected background color behind all painted lambdas

### Requirement: PNG export
The application SHALL allow the user to download their painting as a PNG image, rasterized client-side without any server.

#### Scenario: Export as PNG without background
- **WHEN** user clicks "Export PNG" and "export background" is unchecked
- **THEN** a `.png` file is downloaded with transparent background

#### Scenario: Export as PNG with background
- **WHEN** user clicks "Export PNG" and "export background" is checked
- **THEN** a `.png` file is downloaded with the selected background color
