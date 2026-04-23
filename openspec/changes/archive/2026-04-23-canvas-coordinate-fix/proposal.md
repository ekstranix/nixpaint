## Why

Pointer-to-canvas coordinate conversion used manual math (`getBoundingClientRect` + viewport proportions) which drifted from the true position over time, especially after panning and zooming. The SVG's default `preserveAspectRatio="xMidYMid meet"` also introduced invisible letterbox padding that the manual math didn't account for, causing a permanent offset.

## What Changes

- Replace all manual screen-to-SVG coordinate math with `svg.getScreenCTM().inverse()` via `DOMPoint.matrixTransform()` — the browser's own exact coordinate pipeline
- Set `preserveAspectRatio="none"` on the canvas SVG so it stretches to fill its container with no letterboxing
- Move all pointer/wheel event handlers to a single `useEffect` with native `addEventListener`, reading store state via `getState()` to eliminate stale React closures

## Capabilities

### New Capabilities

_None._

### Modified Capabilities
- `lambda-canvas`: Screen-to-SVG coordinate conversion now uses the SVG's native transform matrix; canvas uses `preserveAspectRatio="none"`
- `paint-engine`: Pointer coordinate accuracy is now exact at all zoom levels and after any number of pan/zoom operations

## Impact

- `src/components/Canvas.tsx`: Rewritten event handling and coordinate conversion
