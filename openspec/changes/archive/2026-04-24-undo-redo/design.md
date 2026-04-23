## Context

The canvas state is a `Map<string, CellData>` in a zustand store. Multiple actions mutate it: `paintAtPixel`, `paintLine`, `eraseLine`, `eraseAtPixel`, `nodeClick`, `clearAll`. There is no history mechanism.

## Goals / Non-Goals

**Goals:**
- Undo/redo for all cell-mutating operations
- Toolbar buttons and keyboard shortcuts
- Reasonable memory limit on history depth

**Non-Goals:**
- Undo for viewport/zoom changes
- Undo for tool setting changes (brush width, palette, etc.)
- Granular per-cell undo (undo operates on full snapshots)

## Decisions

### Snapshot-based history (not command/patch based)
**Rationale:** The cells Map is the only state being tracked. Snapshots of the full Map are simple to implement and always correct. With a max history of 50 steps and typical Map sizes under 10K entries, memory is not a concern. Command-based undo would be more complex and error-prone for multi-cell operations (brush width > 1, lines).

**Alternative considered:** Diff/patch based — more memory efficient but significantly more complex. Not worth it at current scale.

### History stored outside zustand's main state
**Rationale:** History lives as a separate array alongside the store, not as zustand state itself. This avoids re-renders on every history push. Only `canUndo` and `canRedo` are derived as zustand state for button enable/disable.

Actually, simpler: store `history: Map[]` and `historyIndex: number` directly in the zustand store. The history array doesn't trigger re-renders unless subscribed to. We expose `canUndo` and `canRedo` as computed getters.

### Snapshot granularity: per pointer-up / per action
**Rationale:** A single paint stroke (pointer down → many moves → pointer up) should be one undo step. We push a snapshot on pointer-down (capturing state before the stroke), so undo reverts the entire stroke at once. For instant actions like `clearAll`, we snapshot before executing.

Implementation: a `pushHistory()` action that saves the current cells to the history stack. Called at the start of pointer-down (for paint/erase), before `clearAll`, and before `nodeClick`.

### Max history: 50 entries
**Rationale:** Keeps memory bounded. Oldest entries are dropped when the limit is exceeded.

### Keyboard shortcuts
- `Ctrl+Z` / `Cmd+Z`: Undo
- `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Redo

Handled in the Canvas `useEffect` keydown listener (already exists for Escape).

## Risks / Trade-offs

- **[Memory with large canvases]** → Each snapshot clones the full Map. At 10K cells × 50 snapshots, this is ~50K Map entries total. JavaScript handles this fine.
- **[Redo stack cleared on new action]** → Standard behavior: any new mutation after undo clears the redo stack.
