# persistence Specification

## Purpose
TBD - created by archiving change project-setup. Update Purpose after archive.
## Requirements
### Requirement: Auto-save to LocalStorage
The application SHALL automatically save the current painting state to LocalStorage.

#### Scenario: Painting persists across page reload
- **WHEN** user paints some lambdas and reloads the page
- **THEN** the painting is restored exactly as it was (same cells, colors, rotations)

### Requirement: Load painting on startup
The application SHALL load any previously saved painting from LocalStorage on startup.

#### Scenario: Fresh start with no saved data
- **WHEN** user opens the app for the first time (no LocalStorage data)
- **THEN** an empty canvas is shown

#### Scenario: Restore saved painting
- **WHEN** user opens the app with existing saved data in LocalStorage
- **THEN** the saved painting is rendered on the canvas

### Requirement: Clear also clears storage
When the user clears the canvas, the saved state in LocalStorage SHALL also be cleared.

#### Scenario: Clear removes persisted data
- **WHEN** user clears the canvas and reloads the page
- **THEN** the canvas is empty (no data restored)

