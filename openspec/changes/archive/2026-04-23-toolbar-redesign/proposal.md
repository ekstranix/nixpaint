## Why

The current single horizontal toolbar mixes tool selection, color picking, and actions in one row. As we add more tools (pan) and modes (color cycling), the toolbar gets crowded. A Photoshop-style vertical tool sidebar separates tool selection from options, making the UI more scalable and familiar.

## What Changes

- Add a vertical side toolbar (left) with icon-only buttons and tooltips for: Paint, Erase, Pan
- Move tool selection (Paint, Erase) from the top toolbar to the side toolbar
- Add a Pan tool mode — left-click pans the canvas (in addition to existing middle-click pan)
- Add Zoom In / Zoom Out buttons to the top toolbar
- Add a color mode toggle: "Stable" (current behavior) vs "Cycle" (auto-advance through palette colors per cell painted)
- Cursor changes per active tool: default for paint, crosshair for erase, grab/grabbing for pan
- Top toolbar retains: palette selector, color swatches, zoom buttons, actions (Clear, Export, About)

## Capabilities

### New Capabilities
- `side-toolbar`: Vertical icon-only tool sidebar with tooltips on the left side of the canvas
- `color-cycling`: Auto-cycle color mode that advances through the active palette's colors per cell painted

### Modified Capabilities
- `lambda-canvas`: Adding pan tool mode (left-click pan) and zoom button controls alongside existing middle-click pan and scroll zoom
- `paint-engine`: Adding pan as a mode, cursor changes per mode

## Impact

- `src/types.ts`: `Mode` type gains `"pan"` value
- `src/store/canvas.ts`: New `colorMode` and `cycleIndex` state, modified `paintLine`/`fillCell` to cycle colors
- `src/components/Toolbar.tsx`: Restructured — tool buttons removed, zoom buttons added, color mode toggle added
- `src/components/SideToolbar.tsx`: New component
- `src/components/Canvas.tsx`: Pan mode via left-click, cursor per mode
- `src/index.css`: New sidebar styles, layout change to side-by-side
