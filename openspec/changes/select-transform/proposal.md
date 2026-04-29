# select-transform

## Summary
Add a Select tool that lets users select one or more lambdas on the canvas, then apply transformations: individual rotation, group orbit, move (snap-to-grid), recolor, and delete.

## Motivation
Currently all interactions are immediate mutations — paint or erase. There's no way to modify existing lambdas after placing them. Users who want to adjust a section of their drawing must erase and repaint. A select-then-transform workflow enables non-destructive editing of existing work.

## Scope

### In scope
- Select mode as a new tool in the side toolbar
- Click and shift+click to select individual lambdas
- Drag rectangle to select regions, shift+drag to add to selection
- Visual selection indicator on selected lambdas
- Individual rotation (±60° per lambda in place)
- Group orbit (±60° around selection centroid, also rotates each lambda's facing)
- Move by dragging, snap to hex grid, overwrite destination cells
- Recolor all selected lambdas
- Delete all selected lambdas
- Each transform is one undo step

### Out of scope
- Lasso selection
- Copy/paste or duplicate
- Scale transform
- Freeform (non-grid-snapped) positioning
- Multi-select across disconnected drag regions without shift

## Design decisions
- Select is a new mode alongside paint/erase/pan/node (approach A — fits existing tool pattern)
- Rectangle overlay for drag-select (not hex-highlighting)
- Move drags from click point (not group center)
- Move overwrites occupied destination cells
- Orbit rotates both position and individual facing by the same angle
- All transforms push a history snapshot for undo
