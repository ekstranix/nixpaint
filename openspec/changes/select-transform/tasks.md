# select-transform Tasks

## Task 1: Add select mode to types and store
- [x] Add `"select"` to the `Mode` type in `types.ts`
- [x] Add `selectedCells`, `selectionRect`, `dragMove` state to the Zustand store
- [x] Add selection actions: `selectCell`, `toggleSelectCell`, `selectRegion`, `addRegion`, `clearSelection`
- [x] Clear selection when switching away from select mode

## Task 2: Grid math for orbit
- [x] Add `hexRotateAround(hex, center, degrees)` to `grid.ts` — rotates a hex coord around a center point by multiples of 60°
- [x] Add `selectionCentroid(hexKeys)` — computes average hex position
- [x] Add tests for both functions

## Task 3: Transform actions in store
- [x] `rotateSelected(delta)` — adjust each selected lambda's rotation by ±60°
- [x] `orbitSelected(delta)` — rotate positions around centroid + adjust facing
- [x] `moveSelected(deltaQ, deltaR)` — move all by hex offset, overwrite destinations
- [x] `recolorSelected(color)` — set color on all selected
- [x] `deleteSelected()` — remove all selected cells, clear selection
- [x] All mutating actions push undo history

## Task 4: Selection UI in SideToolbar + ToolOptionsBar
- [x] Add Select tool button to `SideToolbar.tsx`
- [x] Add transform controls to `ToolOptionsBar.tsx` when mode is "select" and selection is non-empty
  - Rotate ↶ / ↷ buttons
  - Orbit ↶ / ↷ buttons
  - Recolor (using active palette color)
  - Delete button

## Task 5: Selection interaction in Canvas
- [x] Click to select / shift+click to toggle
- [x] Drag rectangle selection (render translucent rect overlay)
- [x] Shift+drag to add to selection
- [x] Click empty to clear, Escape to clear
- [x] Drag selected lambda to move (ghost preview, snap to grid on release)

## Task 6: Selection visual indicator on Lambda
- [x] Add `selected` prop to `Lambda` component
- [x] Render contrasting outline/stroke on selected lambdas
