# node-tool Specification

## Purpose
Point-to-point line drawing tool using hex cell filling.
## Requirements
### Requirement: Node tool draws point-to-point lines
The application SHALL provide a node tool that fills hex cells along straight line segments between user-placed points.

#### Scenario: First click places a point
- **WHEN** node tool is active and user clicks on the canvas
- **THEN** the click position SHALL be recorded as the first point (no cells filled yet)

#### Scenario: Subsequent clicks draw line segments
- **WHEN** node tool is active and user clicks after placing a previous point
- **THEN** all hex cells along the line from the previous point to the new point SHALL be filled with lambdas

#### Scenario: End path with Escape or double-click
- **WHEN** user presses Escape or double-clicks while using the node tool
- **THEN** the current path SHALL end and the next click starts a new path

#### Scenario: Switching away from node tool ends path
- **WHEN** user switches to a different tool while a node path is in progress
- **THEN** the current path SHALL end

### Requirement: Node tool respects rotation mode
The node tool SHALL use its own rotation mode setting (auto-cycle or fixed angle) when filling cells.

#### Scenario: Fixed rotation on node tool
- **WHEN** node tool rotation is set to a fixed angle (e.g., 60°)
- **THEN** all lambdas placed by the node tool SHALL use that fixed rotation
