## 1. Project Scaffold

- [x] 1.1 Initialize pnpm project with `package.json` (name: drawnix, type: module)
- [x] 1.2 Set up Vite + React + TypeScript (`vite.config.ts`, `tsconfig.json` with strict mode, `index.html`)
- [x] 1.3 Configure Biome (`biome.json` with lint + format rules)
- [x] 1.4 Add Vitest configuration and a placeholder unit test
- [x] 1.5 Add Playwright configuration and a placeholder E2E test
- [x] 1.6 Create `flake.nix` with devShell (node, pnpm) and static build package
- [x] 1.7 Create GitHub Actions CI workflow (lint, typecheck, test, test:e2e)
- [x] 1.8 Create README.md with project description, dev setup, build, and test instructions
- [x] 1.9 Add pnpm scripts: `dev`, `build`, `lint`, `format`, `typecheck`, `test`, `test:e2e`

## 2. Lambda Path & Hex Grid

- [x] 2.1 Define the canonical Nix lambda SVG path data as a normalized constant (`src/lib/lambda-path.ts`)
- [x] 2.2 Implement hex grid math: pixel-to-hex, hex-to-pixel coordinate conversion, neighbor calculation (`src/lib/grid.ts`)
- [x] 2.3 Implement rotation assignment per hex cell (cycling 0°, 60°, 120°, 180°, 240°, 300°)
- [x] 2.4 Write unit tests for hex grid coordinate conversions and rotation logic

## 3. Canvas & Rendering

- [x] 3.1 Create Zustand store for canvas state: filled cells map, active color, active palette, viewport (`src/store/canvas.ts`)
- [x] 3.2 Create `Lambda` component: renders a single lambda SVG path with position, rotation, and color props (`src/components/Lambda.tsx`)
- [x] 3.3 Create `Canvas` component: SVG element with viewBox, renders visible lambdas, handles pan/zoom via pointer and wheel events (`src/components/Canvas.tsx`)
- [x] 3.4 Implement viewport-based rendering: only render lambdas within/near the current viewBox
- [x] 3.5 Create `App.tsx` composing Canvas with Toolbar/Palette

## 4. Paint Engine

- [x] 4.1 Implement paint-on-drag: pointer down/move events fill hex cells along the stroke path with active color
- [x] 4.2 Implement path interpolation to avoid gaps when dragging fast (sample intermediate hex cells between pointer events)
- [x] 4.3 Implement erase mode: drag to remove lambdas from cells
- [x] 4.4 Implement clear canvas action
- [x] 4.5 Write unit tests for stroke-to-hex-cells conversion

## 5. Color Palettes

- [x] 5.1 Define palette data: Nix Blue (2 colors) and NixOS Rainbow (6 colors) with exact hex values (`src/lib/palettes.ts`)
- [x] 5.2 Create `Palette` component: palette selector + color swatches (`src/components/Palette.tsx`)
- [x] 5.3 Create `Toolbar` component: mode toggle (paint/erase), clear button, export buttons (`src/components/Toolbar.tsx`)

## 6. Persistence

- [x] 6.1 Implement auto-save to LocalStorage on state changes (debounced)
- [x] 6.2 Implement load from LocalStorage on app startup
- [x] 6.3 Clear LocalStorage when canvas is cleared

## 7. Export

- [x] 7.1 Implement SVG export: serialize painted lambdas to a standalone SVG file, cropped to bounding box
- [x] 7.2 Implement PNG export: rasterize SVG to canvas, download as PNG at 2x resolution
- [x] 7.3 Write E2E test: paint some lambdas, verify export downloads a file

## 8. Polish & Integration

- [x] 8.1 Add basic CSS styling for toolbar, palette, and canvas layout
- [x] 8.2 Verify all Biome lint/format checks pass
- [x] 8.3 Verify TypeScript strict mode compiles cleanly
- [x] 8.4 Run full test suite (unit + E2E) and fix any failures
