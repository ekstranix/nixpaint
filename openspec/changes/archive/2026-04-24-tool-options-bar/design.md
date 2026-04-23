## Context

The app currently has a top toolbar (app actions + palette + zoom), a side toolbar (paint/erase/pan), and a canvas. The bean `nixpaint-ro9j` describes a second horizontal bar for per-tool settings, new tools, and background color control.

## Goals / Non-Goals

**Goals:**
- Context-sensitive tool options bar between top toolbar and canvas
- Per-tool settings: brush width, rotation mode, paint/stamp mode
- Node tool for point-to-point lambda lines
- Foreground color as a "tool" with palette + cycle toggle
- Background color with export option
- Grayscale palette

**Non-Goals:**
- Custom color picker (outside palettes)
- Undo/redo
- Layer system
- Keyboard shortcuts for tool switching

## Decisions

### Layout: 3-row grid
**Rationale:** Add options bar as a third row between header and canvas:
```
"header  header"
"options options"
"sidebar canvas"
```
Options bar spans full width including above the sidebar for visual consistency.

### Tool options bar: one React component per tool
**Rationale:** `ToolOptionsBar` renders a child component based on `mode`:
- `PaintOptions` — brush width slider, paint/stamp toggle, rotation mode
- `EraseOptions` — eraser size slider
- `PanOptions` — empty / help text
- `NodeOptions` — rotation mode
- `ForegroundOptions` — palette selector, swatches, stable/cycle
- `BackgroundOptions` — color buttons, export checkbox

This keeps each options component focused and easy to test.

### Side toolbar tools expand to 6
```
🖌  Paint
🧹  Erase
✋  Pan
🔗  Node
🎨  Foreground color
🖼  Background color
```
Foreground and Background are "tools" in the sense that selecting them shows their options in the bar. Clicking on the canvas while they're active does nothing (like Pan).

### Mode type expands
```ts
type Mode = "paint" | "erase" | "pan" | "node" | "foreground" | "background";
```
Only `paint`, `erase`, and `node` interact with the canvas. `pan` pans. `foreground` and `background` are settings-only (no canvas interaction).

### Brush/eraser width: radius in hex cells
Width 1 = single cell (current behavior). Width 2 = center cell + all 6 neighbors. Width 3 = 2 rings. Stored as `brushWidth: number` and `eraserWidth: number` in the store.

### Rotation mode
```ts
type RotationMode = "auto" | 0 | 60 | 120 | 180 | 240 | 300;
```
`"auto"` = current behavior (cycle based on hex position). A number = all lambdas painted at that fixed angle. Stored per-tool: `paintRotation` and `nodeRotation`.

### Node tool interaction
Click to place points. Each click adds a point and fills all hexes on the line from the previous point. Double-click or press Escape to end the current path. State: `nodePoints: Array<{x, y}>` in the store (reset on tool switch or Escape).

### Background color
```ts
type BackgroundColor = "#ffffff" | "#808080" | "#1a1a2e";
```
Three presets. Canvas `<rect>` behind all lambdas uses this color. Export optionally includes it based on `exportBackground: boolean`.

### Grayscale palette
```ts
const GRAYSCALE: Palette = {
  name: "Grayscale",
  colors: ["#ffffff", "#c0c0c0", "#808080", "#404040", "#000000"],
};
```

## Risks / Trade-offs

- **[Many new store fields]** → Could split into sub-stores later if it gets unwieldy. For now, a flat zustand store is fine.
- **[Mode type overloaded]** → "foreground" and "background" aren't really canvas tools. Acceptable because the options bar pattern is the same: select in sidebar → see options in bar.
- **[Brush width performance]** → Width 3 fills 19 cells per click. Should be fine with the existing Map-based cell store.
