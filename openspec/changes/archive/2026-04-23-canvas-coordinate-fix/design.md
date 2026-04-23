## Context

The canvas is an SVG element inside a CSS grid layout. The viewBox is dynamically updated as the user pans and zooms. Previously, screen-to-SVG coordinate conversion was done manually using `getBoundingClientRect()` proportions, which didn't account for `preserveAspectRatio` letterboxing and was susceptible to stale React closure state.

## Goals / Non-Goals

**Goals:**
- Exact pointer-to-canvas coordinate mapping at all zoom levels and after any sequence of pan/zoom
- No drift over time during extended painting sessions
- Correct behavior regardless of CSS container sizing

**Non-Goals:**
- Changing the hex grid or lambda rendering
- Changing the painting/erasing logic itself

## Decisions

### Use `getScreenCTM().inverse()` for coordinate conversion
**Rationale:** SVG provides `getScreenCTM()` which returns the exact matrix that maps SVG userspace to screen pixels, accounting for viewBox, preserveAspectRatio, CSS transforms, and any other factors. Inverting it and transforming a `DOMPoint(clientX, clientY)` gives exact SVG coordinates. This replaces ~6 lines of fragile manual math with one reliable API call.

**Alternative considered:** Fixing the manual math to account for letterboxing — rejected because it reimplements what the browser already does correctly, and would need updating if CSS layout changes.

### Set `preserveAspectRatio="none"`
**Rationale:** A painting canvas should fill its entire container with no invisible padding. The default `xMidYMid meet` letterboxes when the viewBox aspect ratio doesn't match the element's pixel size, creating dead space where clicks don't map correctly. `"none"` stretches the viewBox to fill, which is correct for a canvas that dynamically adjusts its own viewport.

### Native `addEventListener` in `useEffect([], [])` with `getState()`
**Rationale:** React `useCallback` closures capture state at creation time. During a drag, viewport and mode can change many times between re-renders, causing the closure's captured values to go stale. Using native event listeners that read from `useCanvasStore.getState()` at call time guarantees fresh state on every event, with zero React re-render dependency.

### Capture CTM at pan start for delta calculation
**Rationale:** During a pan drag, the viewport (and thus the CTM) changes on every mouse move. But the pan delta must be computed relative to the start position. Capturing the CTM at `pointerdown` and using it for all subsequent `pointermove` events during that drag gives consistent delta math without feedback loops.

## Risks / Trade-offs

- **[`getScreenCTM()` returns null]** → Only happens if the SVG is not in the document. Guarded with a fallback `DOMPoint`.
- **[`preserveAspectRatio="none"` distorts lambdas]** → Lambdas may appear slightly stretched if the viewport aspect ratio diverges significantly from the container. Acceptable because the viewport is continuously adjusted by the user, and pixel-perfect circles aren't a requirement for lambda shapes.
