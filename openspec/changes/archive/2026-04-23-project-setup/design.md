## Context

Drawnix is a greenfield project — an online paint application where users compose art from Nix lambda shapes on an infinite SVG canvas. Lambdas are stamped along paint strokes onto a hex grid, auto-rotated to tile without overlapping. The app is statically hosted, uses LocalStorage for persistence, and is packaged with Nix.

## Goals / Non-Goals

**Goals:**
- Fully configured dev environment reproducible via `nix develop`
- Fast iteration cycle with Vite HMR
- Automated QA: Biome lint/format, TypeScript strict mode, Vitest unit tests, Playwright E2E
- CI pipeline that runs all checks on every push
- Infinite canvas with smooth pan/zoom via SVG viewBox transforms
- Hex-grid tiling engine that stamps non-overlapping, auto-rotated lambdas along stroke paths
- Two fixed color palettes with a simple selector UI
- SVG export (native) and PNG export (client-side rasterization)
- LocalStorage save/load of painting state

**Non-Goals:**
- Server-side rendering or backend services
- User accounts or cloud storage
- Real-time collaboration
- Custom color palettes or variable lambda sizes
- Mobile-optimized touch gestures (basic touch works via pointer events)

## Decisions

### 1. Raw SVG + React over a canvas library (tldraw, Fabric.js, Konva)

**Choice**: Direct SVG rendering via React components.

**Why**: The interaction model is "stamp fixed shapes onto a grid," not "manipulate freeform objects." A canvas library adds abstraction and bundle size for features we don't need. SVG gives us vector-clean rendering, trivial export (serialize the DOM), and React manages the state naturally.

**Alternative considered**: tldraw — powerful but opinionated. Its object model (select, resize, rotate individual shapes) doesn't match our "paint stream" interaction. Fabric.js/Konva target Canvas 2D, not SVG.

### 2. Hex grid for tiling

**Choice**: Lambdas are placed on a hex grid. Each cell has a pre-determined rotation (cycling 0°, 60°, 120°, 180°, 240°, 300°). Painting fills grid cells that the pointer path crosses.

**Why**: Hex grids naturally prevent overlaps with uniform spacing. The 6-fold rotational symmetry of the Nix snowflake maps perfectly to hex geometry. Grid-snapping makes persistence trivial (store cell coordinates + color, not pixel positions).

**Alternative considered**: Freeform placement with collision detection — complex, fragile, and doesn't guarantee aesthetic tiling.

### 3. Zustand for state management

**Choice**: Zustand store holding the map of filled cells (key: hex coordinate, value: color + rotation).

**Why**: Minimal API, no boilerplate, works outside React when needed (export logic). The state shape is simple — a Map plus active palette/color.

**Alternative considered**: React Context — sufficient but gets unwieldy with frequent updates during paint strokes.

### 4. Biome over ESLint + Prettier

**Choice**: Biome as the single lint + format tool.

**Why**: Single tool, fast (Rust-based), fewer config files, consistent formatting and linting in one pass.

### 5. Pan/zoom via SVG viewBox transform

**Choice**: Infinite canvas implemented by adjusting the SVG `viewBox` attribute on wheel/drag events.

**Why**: No extra libraries needed. ViewBox transforms are GPU-accelerated in browsers. All lambdas remain crisp at any zoom level (vector rendering).

### 6. PNG export via client-side rasterization

**Choice**: Use the browser's built-in SVG-to-Canvas pipeline. Serialize the SVG, draw it onto an offscreen `<canvas>`, then `toBlob()` for download.

**Why**: Works on static hosting with zero backend. SVG export is just DOM serialization.

### 7. Nix lambda path data

**Choice**: Embed the canonical Nix lambda SVG path (from nixos-artwork) as a constant in the codebase. Normalize it to a unit size centered at origin for easy transform composition.

**Why**: The path data is ~200 bytes. No need to load an external SVG file at runtime.

## Risks / Trade-offs

- **SVG performance with many elements** → For thousands of lambdas, DOM node count could become a problem. Mitigation: virtualize rendering (only render lambdas in the current viewBox). This is a known future optimization, not needed for initial release.
- **Hex grid constrains artistic freedom** → The grid prevents freeform placement. Mitigation: this is intentional for v1. Future modes can allow freeform placement.
- **LocalStorage size limits (~5-10MB)** → Large paintings could exceed storage. Mitigation: hex grid storage is compact (coordinate + color index per cell). A painting with 10,000 lambdas is ~200KB of JSON.
- **PNG export quality** → Rasterization resolution depends on implementation. Mitigation: render at 2x or allow user to choose resolution.
