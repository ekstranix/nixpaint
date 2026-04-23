# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added
- Photoshop-style vertical side toolbar with Paint, Erase, and Pan tools
- Zoom in/out buttons in top toolbar
- Color cycling mode (auto-advance through palette colors per cell)
- About dialog with version, copyright, license, and links
- MIT LICENSE file
- CHANGELOG.md
- Release script and versioned deploy workflow
- Canvas coordinate accuracy using SVG native `getScreenCTM()` transform

### Fixed
- Canvas pointer coordinate drift after panning and zooming
- Biome lint compliance for About dialog

### Changed
- Deploy only triggers on version tag push, not every push to main
- Canvas uses `preserveAspectRatio="none"` for exact coordinate mapping
