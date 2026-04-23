## 1. Types and Store Foundation

- [x] 1.1 Expand `Mode` type to include `"node"`, `"foreground"`, `"background"`
- [x] 1.2 Add `RotationMode` type: `"auto" | 0 | 60 | 120 | 180 | 240 | 300`
- [x] 1.3 Add tool settings to store: `brushWidth`, `eraserWidth`, `paintMode` (paint/stamp), `paintRotation`, `nodeRotation`
- [x] 1.4 Add background state to store: `backgroundColor`, `exportBackground`
- [x] 1.5 Add node tool state to store: `nodePoints` array, `clearNodePoints` action

## 2. Grayscale Palette

- [x] 2.1 Add `GRAYSCALE` palette to `palettes.ts` and include in `PALETTES` array

## 3. Brush and Eraser Width

- [x] 3.1 Add `hexesInRadius` utility to `grid.ts` that returns all hex cells within a given radius
- [x] 3.2 Modify `paintAtPixel` and `paintLine` to expand to `brushWidth` radius
- [x] 3.3 Modify `eraseLine` to expand to `eraserWidth` radius

## 4. Rotation Override

- [x] 4.1 Modify `fillCell` and `paintLine` to use fixed rotation when `paintRotation` is not `"auto"`
- [x] 4.2 Modify node tool line fill to use `nodeRotation`

## 5. Paint/Stamp Mode

- [x] 5.1 Modify Canvas pointer handling: in stamp mode, only fill on click, ignore drag

## 6. Node Tool

- [x] 6.1 Add node tool canvas interaction: click places point, fills line from previous point
- [x] 6.2 End path on Escape key, double-click, or tool switch
- [x] 6.3 Render visual indicator for the last placed node point

## 7. Background Color

- [x] 7.1 Add `backgroundColor` to canvas SVG `<rect>` background element
- [x] 7.2 Add `setBackgroundColor` and `setExportBackground` actions to store
- [x] 7.3 Modify SVG export to optionally include background rect
- [x] 7.4 Modify PNG export to optionally draw background color

## 8. Tool Options Bar Component

- [x] 8.1 Create `ToolOptionsBar` component that renders per-tool options based on active mode
- [x] 8.2 Create `PaintOptions` sub-component: brush width, paint/stamp toggle, rotation selector
- [x] 8.3 Create `EraseOptions` sub-component: eraser size control
- [x] 8.4 Create `NodeOptions` sub-component: rotation selector
- [x] 8.5 Create `ForegroundOptions` sub-component: palette selector, swatches, stable/cycle toggle
- [x] 8.6 Create `BackgroundOptions` sub-component: color presets, export checkbox

## 9. Toolbar Restructure

- [x] 9.1 Remove palette, color swatches, and stable/cycle toggle from top `Toolbar`
- [x] 9.2 Add Node, Foreground Color, and Background Color to `SideToolbar`

## 10. Layout and Styling

- [x] 10.1 Update CSS grid to 3 rows: header, options, sidebar+canvas
- [x] 10.2 Style the options bar (same dark theme, consistent with top toolbar)
- [x] 10.3 Render `ToolOptionsBar` in `App.tsx`

## 11. Integration

- [x] 11.1 Ensure `foreground` and `background` modes do not interact with canvas (no paint/erase)
- [x] 11.2 Update cursor: node tool uses "crosshair", foreground/background use "default"
- [x] 11.3 Update e2e tests for new UI structure
