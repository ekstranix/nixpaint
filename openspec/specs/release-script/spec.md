# release-script Specification

## Purpose
Release script for version bumping, changelog management, and GitHub release creation.
## Requirements
### Requirement: Release script prompts for bump type
The release script (`scripts/release.sh`) SHALL prompt the user to choose major, minor, or patch version bump.

#### Scenario: User selects patch bump
- **WHEN** user runs the release script and selects "patch"
- **THEN** version SHALL increment from e.g. 0.2.0 to 0.2.1

#### Scenario: User selects minor bump
- **WHEN** user runs the release script and selects "minor"
- **THEN** version SHALL increment from e.g. 0.2.1 to 0.3.0

#### Scenario: User selects major bump
- **WHEN** user runs the release script and selects "major"
- **THEN** version SHALL increment from e.g. 0.3.0 to 1.0.0

### Requirement: Release script updates changelog
The release script SHALL replace the `## [Unreleased]` heading with `## [X.Y.Z] - YYYY-MM-DD` and add a fresh `## [Unreleased]` placeholder above it.

#### Scenario: Changelog updated on release
- **WHEN** the release script runs successfully
- **THEN** CHANGELOG.md SHALL contain the new version heading with today's date and a fresh Unreleased section above it

### Requirement: Release script aborts on empty changelog
The release script SHALL abort if the Unreleased section contains no entries.

#### Scenario: Empty unreleased section
- **WHEN** user runs the release script and the Unreleased section has no entries
- **THEN** the script SHALL exit with an error message and make no changes

### Requirement: Release script updates package.json
The release script SHALL update the `version` field in `package.json` to the new version.

#### Scenario: package.json version bumped
- **WHEN** the release script runs successfully
- **THEN** `package.json` version SHALL match the new release version

### Requirement: Release script commits, tags, and pushes
The release script SHALL create a git commit, tag it with `vX.Y.Z`, and push both to the remote.

#### Scenario: Git tag created
- **WHEN** the release script runs successfully
- **THEN** a git tag `vX.Y.Z` SHALL exist and be pushed to the remote

### Requirement: Release script creates GitHub release
The release script SHALL create a GitHub release using `gh release create` with the changelog entries from the released section as notes.

#### Scenario: GitHub release created
- **WHEN** the release script runs successfully
- **THEN** a GitHub release for `vX.Y.Z` SHALL exist with the changelog entries as the release body
