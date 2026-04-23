## MODIFIED Requirements

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
