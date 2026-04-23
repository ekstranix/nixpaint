## 1. Store and Types

- [x] 1.1 Add `"pan"` to `Mode` type in `types.ts`
- [x] 1.2 Add `colorMode: "stable" | "cycle"` and `cycleIndex: number` to canvas store
- [x] 1.3 Add `setColorMode` action and reset `cycleIndex` when palette changes
- [x] 1.4 Modify `fillCell` and `paintLine` to advance `cycleIndex` and pick cycle color when `colorMode === "cycle"`
- [x] 1.5 Add `zoomIn` and `zoomOut` actions to canvas store (1.25x factor, centered on viewport)

## 2. Side Toolbar

- [x] 2.1 Create `SideToolbar` component with icon-only buttons for Paint, Erase, Pan
- [x] 2.2 Add `title` attributes for tooltips on each button
- [x] 2.3 Style side toolbar: narrow vertical bar, dark theme, active tool highlighted
- [x] 2.4 Wire buttons to `setMode` store action

## 3. Top Toolbar Restructure

- [x] 3.1 Remove Paint/Erase buttons from top `Toolbar` component
- [x] 3.2 Add Zoom In / Zoom Out buttons to top toolbar
- [x] 3.3 Add color mode toggle (Stable / Cycle) near the palette section

## 4. Layout

- [x] 4.1 Change app layout from flex column to CSS grid: `"header header" / "sidebar canvas"`
- [x] 4.2 Add sidebar and grid styles to `index.css`

## 5. Canvas Updates

- [x] 5.1 Add pan-mode left-click handling in Canvas (reuse existing pan logic)
- [x] 5.2 Update cursor logic: default for paint, crosshair for erase, grab/grabbing for pan
- [x] 5.3 Ensure paint and erase do nothing when mode is `"pan"`

## 6. Integration

- [x] 6.1 Import and render `SideToolbar` in `App.tsx` within the grid layout
- [x] 6.2 Update e2e tests for new UI structure (button locations, selectors)
