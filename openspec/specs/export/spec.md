# export Specification

## Purpose
TBD - created by archiving change project-setup. Update Purpose after archive.
## Requirements
### Requirement: SVG export
The application SHALL allow the user to download their painting as an SVG file.

#### Scenario: Export as SVG
- **WHEN** user clicks "Export SVG"
- **THEN** a `.svg` file is downloaded containing all painted lambdas with correct colors and transforms, cropped to the bounding box of the painting

### Requirement: PNG export
The application SHALL allow the user to download their painting as a PNG image, rasterized client-side without any server.

#### Scenario: Export as PNG
- **WHEN** user clicks "Export PNG"
- **THEN** a `.png` file is downloaded with the painting rasterized at a reasonable resolution (minimum 2x display density)

### Requirement: Export includes only painted content
Both SVG and PNG exports SHALL be cropped to the bounding box of the painted lambdas, not the current viewport.

#### Scenario: Export bounds match painted area
- **WHEN** user exports a painting that spans cells (0,0) to (10,5) but the viewport shows a larger area
- **THEN** the exported file contains only the bounding box of the painted area with appropriate padding

