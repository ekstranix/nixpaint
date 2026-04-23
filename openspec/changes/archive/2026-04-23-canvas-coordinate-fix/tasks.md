## 1. Coordinate Conversion

- [x] 1.1 Replace manual `getBoundingClientRect` coordinate math with `getScreenCTM().inverse()` + `DOMPoint.matrixTransform()`
- [x] 1.2 Set `preserveAspectRatio="none"` on the canvas SVG element

## 2. Event Handler Architecture

- [x] 2.1 Move all pointer/wheel handlers to a single `useEffect` with native `addEventListener`
- [x] 2.2 Read all store state via `useCanvasStore.getState()` inside handlers to eliminate stale closures
- [x] 2.3 Capture CTM at pan start for consistent delta calculation during drag
