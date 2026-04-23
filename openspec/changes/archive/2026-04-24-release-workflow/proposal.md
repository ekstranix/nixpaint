## Why

There is no versioning, changelog, or release process. Deploys happen on every push to main, with no way to track what changed between versions. Users (and the About screen) have no version info.

## What Changes

- Add `CHANGELOG.md` following Keep a Changelog format with an `[Unreleased]` placeholder
- Add `scripts/release.sh` that bumps version (major/minor/patch), updates CHANGELOG.md, commits, tags, pushes, and creates a GitHub release with the changelog section
- `package.json` version is the single source of truth (SST); Vite injects it at build time via `define`
- About dialog shows the version and a link to GitHub releases
- Deploy workflow only triggers on tag pushes (`v*`), not on every push to main
- CI (check + e2e) still runs on every push and PR; deploy job additionally runs CI before deploying on tag push

## Capabilities

### New Capabilities
- `changelog`: CHANGELOG.md file with Keep a Changelog format and Unreleased section
- `release-script`: Bash release script that bumps version, updates changelog, tags, and creates GitHub release
- `version-display`: Build-time version injection and display in About dialog

### Modified Capabilities
- `ci-deploy`: Deploy only on tag push (`v*`), not on every push to main
- `about-dialog`: Show version and changelog link

## Impact

- `CHANGELOG.md`: New file
- `scripts/release.sh`: New file
- `package.json`: Version bumped by release script
- `vite.config.ts`: Add `define` for `__APP_VERSION__`
- `src/components/AboutDialog.tsx`: Show version + changelog link
- `.github/workflows/ci.yml`: Deploy job trigger changed to tags only
