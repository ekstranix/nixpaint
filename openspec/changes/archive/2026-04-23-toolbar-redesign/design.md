## Context

Current layout is a single horizontal toolbar above a full-screen canvas. Tools (Paint, Erase), palette, and actions share one row. Panning is middle-mouse only. Zooming is scroll-wheel only. Color is always the manually selected color.

## Goals / Non-Goals

**Goals:**
- Photoshop-style vertical side toolbar for tool selection
- Zoom buttons in top toolbar for discoverability
- Color cycling mode for rapid multi-color painting
- Icon-only buttons with hover tooltips on side toolbar

**Non-Goals:**
- Custom icon design (use Unicode/emoji initially, can upgrade to SVG icons later)
- Keyboard shortcuts for tool switching (future enhancement)
- Zoom slider or percentage display

## Decisions

### Layout: CSS Grid with sidebar
**Rationale:** The app layout changes from a simple flex column to a grid:
```
"header header"
"sidebar canvas"
```
The sidebar is narrow (~40px), canvas fills remaining space. Grid is simpler than nested flexbox for this 3-region layout.

### Side toolbar buttons: `<button>` with `title` attribute for tooltips
**Rationale:** Native `title` tooltips are sufficient — no tooltip library needed. Keeps it simple. Can upgrade to custom positioned tooltips later if needed.

### Color cycling: per-cell with `cycleIndex` in store
**Rationale:** Each cell painted advances `cycleIndex` by 1 and picks `palette.colors[cycleIndex % palette.colors.length]`. This gives the most visually interesting result, especially with the 6-color NixOS Rainbow palette. The index resets when switching palettes.

### Pan mode: reuses existing pan logic
**Rationale:** The Canvas already has pan-on-middle-click. Pan mode simply routes left-click to the same pan handler instead of paint/erase. The mode type expands to `"paint" | "erase" | "pan"`.

### Zoom buttons: dispatch to store
**Rationale:** Zoom buttons call a new `zoomIn`/`zoomOut` action on the store that zooms centered on the viewport center (unlike scroll-zoom which centers on cursor). Factor is 1.25x per click.

## Risks / Trade-offs

- **[Unicode icons]** → May render inconsistently across OS. Acceptable for now; SVG icons are a future upgrade.
- **[Color mode toggle placement]** → Placed in the top toolbar next to the palette. Could feel crowded — but it's directly related to color behavior, so it belongs near the palette.
