## MODIFIED Requirements

### Requirement: Lambda rendering on hex grid
The application SHALL render Nix lambda shapes as SVG path elements positioned on a hex grid. Each lambda uses the canonical Nix lambda path data and is fixed-size. Rotation is determined by the cell's hex position (auto-cycle through 0°–300°) unless the tool's rotation mode overrides it with a fixed angle.

#### Scenario: Lambda appears at correct grid position
- **WHEN** a hex cell is filled
- **THEN** a lambda SVG path element is rendered at the cell's center coordinates with the rotation from the cell data

#### Scenario: Lambdas do not overlap
- **WHEN** multiple adjacent hex cells are filled
- **THEN** no two lambda shapes visually overlap

#### Scenario: Fixed rotation override
- **WHEN** a lambda is painted with a fixed rotation mode (e.g., 60°)
- **THEN** the lambda SHALL be rendered at 60° regardless of its hex grid position

## ADDED Requirements

### Requirement: Canvas background color
The canvas SHALL display a background in the user-selected background color.

#### Scenario: Background color visible
- **WHEN** user changes the background color to white
- **THEN** the canvas background SHALL be white
