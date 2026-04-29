# select-transform Specification

## Purpose
Select one or more lambdas on the canvas and apply transformations to them.

## Requirements

### Requirement: Select mode tool
The side toolbar SHALL include a Select tool. When active, pointer interactions SHALL select lambdas instead of painting.

#### Scenario: Activate select mode
- **WHEN** user clicks the Select tool button
- **THEN** the mode SHALL change to "select" and the cursor SHALL indicate selection mode

### Requirement: Click to select
Clicking a lambda in select mode SHALL select it.

#### Scenario: Click a lambda
- **WHEN** user clicks on an occupied cell
- **THEN** that lambda SHALL be selected and any previous selection SHALL be cleared

#### Scenario: Click empty cell
- **WHEN** user clicks on an empty cell
- **THEN** the selection SHALL be cleared

#### Scenario: Shift+click to toggle
- **WHEN** user shift+clicks an occupied cell
- **THEN** that cell SHALL be toggled in/out of the selection without affecting other selected cells

### Requirement: Drag rectangle to select
Dragging on empty space in select mode SHALL draw a selection rectangle.

#### Scenario: Drag select
- **WHEN** user drags from empty space
- **THEN** a translucent rectangle SHALL be rendered during drag
- **AND** on release, all lambdas within the rectangle SHALL be selected

#### Scenario: Shift+drag to add
- **WHEN** user shift+drags
- **THEN** lambdas in the rectangle SHALL be added to the existing selection

### Requirement: Clear selection
The selection SHALL be clearable via Escape key or clicking empty space.

#### Scenario: Escape clears selection
- **WHEN** user presses Escape with an active selection
- **THEN** the selection SHALL be cleared

### Requirement: Individual rotation
Selected lambdas SHALL be rotatable in 60° increments around their own center.

#### Scenario: Rotate selected lambdas
- **WHEN** user triggers rotate ±60°
- **THEN** each selected lambda's rotation SHALL change by that amount
- **AND** the operation SHALL be one undo step

### Requirement: Group orbit
Selected lambdas SHALL be rotatable as a group around the selection's centroid in 60° increments.

#### Scenario: Orbit selected lambdas
- **WHEN** user triggers orbit ±60°
- **THEN** each selected lambda's hex position SHALL rotate around the group centroid
- **AND** each lambda's individual rotation SHALL also change by the same amount
- **AND** the operation SHALL be one undo step

#### Scenario: Orbit collision
- **WHEN** orbiting causes a lambda to land on an occupied non-selected cell
- **THEN** the destination cell SHALL be overwritten

### Requirement: Move selection
Selected lambdas SHALL be movable by dragging, snapping to the hex grid.

#### Scenario: Drag to move
- **WHEN** user drags a selected lambda
- **THEN** the entire selection SHALL move with it, relative to the click point
- **AND** positions SHALL snap to hex grid positions
- **AND** ghost lambdas (reduced opacity) SHALL preview the destination during drag

#### Scenario: Move overwrites
- **WHEN** moving selection onto occupied non-selected cells
- **THEN** the destination cells SHALL be overwritten

#### Scenario: Move is undoable
- **WHEN** user moves a selection
- **THEN** the move SHALL be one undo step

### Requirement: Recolor selection
All selected lambdas SHALL be recolorable to a chosen color.

#### Scenario: Recolor
- **WHEN** user picks a color with an active selection
- **THEN** all selected lambdas SHALL change to that color
- **AND** the operation SHALL be one undo step

### Requirement: Delete selection
All selected lambdas SHALL be deletable.

#### Scenario: Delete
- **WHEN** user triggers delete with an active selection
- **THEN** all selected cells SHALL be removed from the canvas
- **AND** the selection SHALL be cleared
- **AND** the operation SHALL be one undo step

### Requirement: Selection visual indicator
Selected lambdas SHALL be visually distinguishable from unselected lambdas.

#### Scenario: Visual feedback
- **WHEN** lambdas are selected
- **THEN** they SHALL display a visible indicator (e.g. contrasting outline)
