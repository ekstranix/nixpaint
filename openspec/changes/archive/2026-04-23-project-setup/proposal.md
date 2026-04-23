## Why

Drawnix is a new project — an online paint application where users paint with Nix lambda shapes. Before any feature work can begin, we need project scaffolding: build tooling, QA infrastructure, Nix packaging, and the foundational canvas with lambda tiling mechanics.

## What Changes

- Scaffold a React + TypeScript + Vite project with pnpm
- Configure Biome for linting and formatting
- Set up Vitest for unit tests and Playwright for E2E tests
- Create a `flake.nix` with devShell and static build output
- Add GitHub Actions CI pipeline
- Implement an infinite SVG canvas with pan/zoom
- Implement hex-grid-based lambda tiling along paint strokes (fixed-size lambdas, auto-rotated, non-overlapping)
- Define the two color palettes (2-tone Nix blue, NixOS rainbow)
- Add palette selector UI
- SVG and PNG export of paintings
- LocalStorage persistence for save/load
- Create a README documenting the project

## Capabilities

### New Capabilities
- `lambda-canvas`: Infinite pannable/zoomable SVG canvas that renders lambda shapes on a hex grid
- `paint-engine`: Painting mechanic — pointer events stamp lambdas along the stroke path onto hex grid cells with auto-rotation
- `color-palettes`: Two fixed palettes (2-tone Nix blue, NixOS 6-color rainbow) with palette selector UI
- `export`: Download paintings as SVG or PNG from a static-hosted app
- `persistence`: Save/load paintings to LocalStorage
- `project-scaffold`: Vite + React + TypeScript + pnpm + Biome + Vitest + Playwright + flake.nix + CI

### Modified Capabilities

(none — greenfield project)

## Impact

- New repository structure with all tooling configured
- Dependencies: react, zustand, vite, biome, vitest, playwright
- Nix flake for reproducible dev environment and static build
- GitHub Actions for CI (lint, typecheck, test)
