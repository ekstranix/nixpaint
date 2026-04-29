# select-transform Design

## Architecture

### State additions (Zustand store)

```
selectedCells: Set<string>           // hex keys of selected lambdas
selectionRect: {x1,y1,x2,y2} | null // live drag rectangle (screen coords)
dragMove: {startX, startY, currentX, currentY} | null // active move drag
```

Mode type extends with `"select"`.

### New store actions

| Action | Description |
|--------|-------------|
| `selectCell(key)` | Select single cell, clear others |
| `toggleSelectCell(key)` | Add/remove cell from selection |
| `selectRegion(rect)` | Select all lambdas within screen rectangle |
| `addRegion(rect)` | Add lambdas in rectangle to existing selection |
| `clearSelection()` | Deselect all |
| `rotateSelected(delta)` | Rotate each selected lambda's rotation by delta (±60°) |
| `orbitSelected(delta)` | Rotate positions around centroid by delta, also adjust each lambda's facing |
| `moveSelected(deltaQ, deltaR)` | Move all selected cells by hex offset, overwrite destinations |
| `recolorSelected(color)` | Set color of all selected cells |
| `deleteSelected()` | Remove all selected cells |

All mutating actions push to undo history.

### Grid math additions

```
hexRotateAround(hex, center, degrees) → newHex
```
Rotates a hex coordinate around a center point by `degrees` (multiples of 60°). Uses the cube coordinate rotation formula:
1. Convert to cube coords, translate so center is origin
2. Rotate (for 60° CW: x,y,z → -z,-x,-y)
3. Translate back, convert to axial

```
selectionCentroid(hexKeys[]) → {q, r}
```
Average of all selected hex positions (fractional), used as orbit center.

### Component changes

**Canvas.tsx:**
- In select mode: pointer events handle click-select, shift-click, drag-rect, and move-drag
- Render translucent rectangle overlay during drag-select
- Render ghost lambdas during move-drag (at snapped offset positions)

**Lambda.tsx:**
- Accept `selected` prop → render visual indicator (e.g. contrasting outline/stroke)

**SideToolbar.tsx:**
- Add Select tool button (cursor/pointer icon)

**ToolOptionsBar.tsx:**
- When mode is "select" and selection is non-empty, show transform buttons:
  - Rotate ↶ / ↷
  - Orbit ↶ / ↷
  - Recolor (color picker from active palette)
  - Delete

### Interaction flow

```
Select mode active
│
├── Click on lambda → selectCell (or toggleSelectCell with shift)
├── Click on empty  → clearSelection
├── Drag on empty   → draw selectionRect → selectRegion on release
├── Shift+drag      → draw selectionRect → addRegion on release
├── Drag on selected lambda → start move drag
│   ├── pointer move → update dragMove, show ghost preview
│   └── pointer up   → compute hex delta, moveSelected, snap to grid
├── Escape → clearSelection
│
└── Transform buttons (in ToolOptionsBar)
    ├── Rotate ↶↷  → rotateSelected(±60)
    ├── Orbit ↶↷   → orbitSelected(±60)
    ├── Recolor    → recolorSelected(color)
    └── Delete     → deleteSelected
```

### Selection visual

Selected lambdas get a visible outline/stroke to distinguish them. During drag-select, a translucent rectangle overlay shows the selection area. During move-drag, ghost lambdas (reduced opacity) show where the selection will land.
