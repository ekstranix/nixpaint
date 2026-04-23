# about-dialog Specification

## Purpose
TBD - created by archiving change add-about-and-license. Update Purpose after archive.
## Requirements
### Requirement: About button in toolbar
The toolbar SHALL display an "About" button at the far right that opens the about dialog.

#### Scenario: User opens about dialog
- **WHEN** user clicks the "About" button in the toolbar
- **THEN** a modal overlay SHALL appear centered on screen

### Requirement: About dialog content
The about dialog SHALL display the following information:
- Project name: "nixpaint"
- Version: the current build version (e.g. "v0.2.0")
- Copyright: "© 2026 Pim Snel"
- License: "MIT License"
- Link to extranix.com
- Link to the GitHub repository (github.com/ekstranix/nixpaint)
- Link to changelog (GitHub releases page)

#### Scenario: Dialog shows all required info
- **WHEN** the about dialog is open
- **THEN** the dialog SHALL show the project name, version, copyright, license, and all links

#### Scenario: Version reflects build
- **WHEN** the about dialog is open
- **THEN** the displayed version SHALL match the version the app was built with

#### Scenario: Changelog link opens GitHub releases
- **WHEN** user clicks the changelog link
- **THEN** the GitHub releases page SHALL open in a new tab

### Requirement: About dialog dismissal
The about dialog SHALL be dismissable by clicking the backdrop or a close button.

#### Scenario: Dismiss by backdrop click
- **WHEN** the about dialog is open and user clicks outside the dialog content
- **THEN** the dialog SHALL close

#### Scenario: Dismiss by close button
- **WHEN** the about dialog is open and user clicks the close button
- **THEN** the dialog SHALL close

### Requirement: MIT LICENSE file
The repository SHALL contain a `LICENSE` file at the root with the MIT license text, copyright holder "Pim Snel", and year 2026.

#### Scenario: LICENSE file exists
- **WHEN** a user inspects the repository root
- **THEN** a `LICENSE` file SHALL be present with valid MIT license text

