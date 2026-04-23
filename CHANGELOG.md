# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [0.3.2] - 2026-04-24

### Added
- Favicon

## [0.3.1] - 2026-04-24

### Added
- Pre-flight checks in release script (clean tree, typecheck, tests, lint, build)

### Fixed
- Biome lint errors: non-null assertions replaced with safe accessors
- Biome formatting in ToolOptionsBar, Toolbar, and import ordering in store
- Release script uses system `biome` binary (NixOS compatible) instead of node_modules

## [0.3.0] - 2026-04-24

### Added
- Context-sensitive tool options bar below top toolbar
- Node tool for point-to-point line drawing
- Brush width control for paint tool
- Eraser size control
- Paint/stamp mode toggle
- Rotation mode override (auto-cycle or fixed angle) for paint and node tools
- Background color selector (white, gray, dark blue)
- Export background toggle for SVG/PNG export
- Grayscale palette
- Foreground and background color tools in side toolbar
- Undo/redo with Ctrl+Z / Ctrl+Shift+Z keyboard shortcuts
- Undo/redo buttons in top toolbar
- Umami analytics tracking

### Changed
- Palette selector and color mode toggle moved to tool options bar (foreground color tool)
- Top toolbar simplified to app-level actions only (undo/redo, zoom, clear, export, about)
- Layout expanded to 3-row grid (header, options bar, sidebar+canvas)

## [0.2.0] - 2026-04-24

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
