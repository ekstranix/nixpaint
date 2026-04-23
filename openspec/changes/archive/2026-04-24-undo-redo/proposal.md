## Why

There is no way to undo mistakes while painting. A single misplaced stroke or accidental clear is permanent. Undo/redo is a fundamental expectation for any drawing application.

## What Changes

- Add undo/redo history tracking for cell mutations (paint, erase, clear, node tool)
- Add Undo and Redo buttons to the top toolbar
- Support Ctrl+Z (undo) and Ctrl+Shift+Z (redo) keyboard shortcuts
- History is a stack of cell snapshots; viewport/tool settings are NOT tracked

## Capabilities

### New Capabilities
- `undo-redo`: Undo/redo history for canvas cell state with keyboard shortcuts and toolbar buttons

### Modified Capabilities

_None._

## Impact

- `src/store/canvas.ts`: History stack, undo/redo actions, snapshot on mutations
- `src/components/Toolbar.tsx`: Undo/Redo buttons
- `src/components/Canvas.tsx`: Keyboard shortcuts (Ctrl+Z, Ctrl+Shift+Z)
