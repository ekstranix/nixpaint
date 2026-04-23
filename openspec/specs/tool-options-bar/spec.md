# tool-options-bar Specification

## Purpose
Context-sensitive options bar displayed between the top toolbar and the canvas.
## Requirements
### Requirement: Context-sensitive tool options bar
The application SHALL display a horizontal options bar between the top toolbar and the canvas that shows settings specific to the currently active tool.

#### Scenario: Options bar changes with tool
- **WHEN** user switches the active tool in the side toolbar
- **THEN** the options bar SHALL update to show settings relevant to the newly selected tool

#### Scenario: Paint tool options
- **WHEN** paint tool is active
- **THEN** the options bar SHALL show brush width, paint/stamp mode toggle, and rotation mode selector

#### Scenario: Erase tool options
- **WHEN** erase tool is active
- **THEN** the options bar SHALL show eraser size control

#### Scenario: Pan tool options
- **WHEN** pan tool is active
- **THEN** the options bar SHALL be empty or show a help message

#### Scenario: Node tool options
- **WHEN** node tool is active
- **THEN** the options bar SHALL show rotation mode selector

#### Scenario: Foreground color options
- **WHEN** foreground color is selected in the side toolbar
- **THEN** the options bar SHALL show palette selector, color swatches, and stable/cycle toggle

#### Scenario: Background color options
- **WHEN** background color is selected in the side toolbar
- **THEN** the options bar SHALL show background color presets and an export background checkbox
