## 1. Store: History State and Actions

- [x] 1.1 Add `past: Map<string, CellData>[]`, `future: Map<string, CellData>[]` to store
- [x] 1.2 Add `pushHistory()` action that snapshots current cells to past, clears future, enforces max 50
- [x] 1.3 Add `undo()` action that pops past into cells, pushes current to future
- [x] 1.4 Add `redo()` action that pops future into cells, pushes current to past
- [x] 1.5 Add `canUndo` and `canRedo` derived in toolbar via `past.length > 0` / `future.length > 0`

## 2. Integrate History into Mutations

- [x] 2.1 Call `pushHistory()` at start of paint/erase pointer-down (before first cell is modified)
- [x] 2.2 Call `pushHistory()` before `clearAll`
- [x] 2.3 Call `pushHistory()` before `nodeClick` (when it will create cells — i.e., when there's a previous point)

## 3. Toolbar Buttons

- [x] 3.1 Add Undo and Redo buttons to top toolbar
- [x] 3.2 Disable buttons when `canUndo` / `canRedo` is false

## 4. Keyboard Shortcuts

- [x] 4.1 Add Ctrl+Z / Cmd+Z handler for undo in Canvas keydown listener
- [x] 4.2 Add Ctrl+Shift+Z / Cmd+Shift+Z handler for redo
