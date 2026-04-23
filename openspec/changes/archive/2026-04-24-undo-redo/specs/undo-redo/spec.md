## ADDED Requirements

### Requirement: Undo reverts last cell mutation
The application SHALL support undoing the last cell-mutating operation, restoring the canvas to its previous state.

#### Scenario: Undo a paint stroke
- **WHEN** user paints a stroke and then triggers undo
- **THEN** the entire stroke SHALL be removed and the canvas SHALL return to its state before the stroke

#### Scenario: Undo a clear
- **WHEN** user clears the canvas and then triggers undo
- **THEN** all previously painted cells SHALL be restored

#### Scenario: Undo when no history
- **WHEN** user triggers undo with no history available
- **THEN** nothing SHALL happen

### Requirement: Redo restores last undone operation
The application SHALL support redoing a previously undone operation.

#### Scenario: Redo after undo
- **WHEN** user undoes a stroke and then triggers redo
- **THEN** the stroke SHALL be restored

#### Scenario: Redo cleared by new action
- **WHEN** user undoes a stroke and then paints something new
- **THEN** the redo stack SHALL be cleared and redo SHALL not be available

### Requirement: Undo/Redo toolbar buttons
The top toolbar SHALL display Undo and Redo buttons. Buttons SHALL be visually disabled when their respective action is unavailable.

#### Scenario: Buttons reflect availability
- **WHEN** there is no undo history
- **THEN** the Undo button SHALL appear disabled

### Requirement: Undo/Redo keyboard shortcuts
The application SHALL support Ctrl+Z (undo) and Ctrl+Shift+Z (redo) keyboard shortcuts. On macOS, Cmd+Z and Cmd+Shift+Z SHALL also work.

#### Scenario: Ctrl+Z triggers undo
- **WHEN** user presses Ctrl+Z
- **THEN** the last operation SHALL be undone

#### Scenario: Ctrl+Shift+Z triggers redo
- **WHEN** user presses Ctrl+Shift+Z
- **THEN** the last undone operation SHALL be redone

### Requirement: History depth limit
The undo history SHALL be limited to 50 entries. When the limit is exceeded, the oldest entry SHALL be dropped.

#### Scenario: History overflow
- **WHEN** user has performed 50 operations and performs a 51st
- **THEN** the oldest undo entry SHALL be removed and only the most recent 50 SHALL remain
