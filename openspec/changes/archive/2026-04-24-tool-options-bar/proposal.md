## Why

As more tools and per-tool settings are introduced, the top toolbar becomes the wrong place for tool configuration. A Photoshop-style options bar (a second horizontal bar below the top toolbar) provides context-sensitive settings for the active tool. This also enables new capabilities: brush/eraser width, rotation control, a node tool for point-to-point lines, a grayscale palette, background color selection, and export background toggle.

## What Changes

- Add a context-sensitive Tool Options Bar below the top toolbar that changes content based on the active tool
- Move palette selector, color swatches, and stable/cycle toggle from top toolbar into the options bar under a foreground color tool
- **Paint tool options**: brush width (radius in hex cells), paint-or-stamp mode, rotation mode (auto-cycle or fixed 0°/60°/120°/180°)
- **Eraser tool options**: eraser size (radius in hex cells)
- **Pan tool**: no options (empty bar)
- **Node tool** (new): draw lines from click-point to click-point, filling hexes along each segment. Rotation mode (auto-cycle or fixed)
- **Foreground color** in side toolbar: palette selector (Rainbow/Blue/Grayscale), color swatches, stable/cycle toggle
- **Background color** in side toolbar: color picker (white/gray/current blue), checkbox for "export background"
- Add Grayscale palette
- Top toolbar retains only app-level actions: zoom, clear, export, about

## Capabilities

### New Capabilities
- `tool-options-bar`: Context-sensitive horizontal bar showing settings for the active tool
- `node-tool`: Point-to-point line drawing tool that fills hexes along line segments
- `background-color`: Selectable canvas background with optional export

### Modified Capabilities
- `side-toolbar`: Add Node tool, Foreground color, and Background color entries
- `paint-engine`: Brush width, paint-vs-stamp mode, rotation mode override for paint and erase
- `color-palettes`: Add Grayscale palette; move palette UI from top toolbar to tool options bar
- `color-cycling`: Move stable/cycle toggle to foreground color options
- `export`: Optionally include background color rect in SVG/PNG export
- `lambda-canvas`: Rotation can be overridden (fixed angle) instead of auto-cycle from hex position

## Impact

- `src/types.ts`: Mode gains `"node"`, new types for tool settings, rotation mode, background color
- `src/store/canvas.ts`: Per-tool settings state, brush width, background color, node tool state
- `src/lib/palettes.ts`: Add grayscale palette
- `src/components/ToolOptionsBar.tsx`: New component
- `src/components/SideToolbar.tsx`: Add node, foreground, background entries
- `src/components/Toolbar.tsx`: Remove palette/cycle toggle (moved to options bar)
- `src/components/Palette.tsx`: Rendered inside options bar now
- `src/components/Canvas.tsx`: Node tool interaction, brush width, rotation override
- `src/App.tsx`: Render ToolOptionsBar, background color on canvas, export with background
- `src/index.css`: Options bar styles, layout grid gains third row
