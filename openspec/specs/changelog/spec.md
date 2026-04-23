# changelog Specification

## Purpose
CHANGELOG.md file following the Keep a Changelog format.
## Requirements
### Requirement: CHANGELOG.md file
The repository SHALL contain a `CHANGELOG.md` at the root following the Keep a Changelog format.

#### Scenario: Unreleased section exists
- **WHEN** a developer inspects CHANGELOG.md
- **THEN** there SHALL be a `## [Unreleased]` section at the top for accumulating changes

#### Scenario: Released versions have date
- **WHEN** a version has been released
- **THEN** it SHALL appear as `## [X.Y.Z] - YYYY-MM-DD` below the Unreleased section

### Requirement: Changelog entries categorized
Changelog entries SHALL be grouped under standard Keep a Changelog categories: Added, Changed, Fixed, Removed.

#### Scenario: Entry under correct category
- **WHEN** a developer adds a changelog entry
- **THEN** it SHALL be placed under the appropriate `### Added`, `### Changed`, `### Fixed`, or `### Removed` heading within the `[Unreleased]` section
