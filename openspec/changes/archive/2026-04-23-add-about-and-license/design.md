## Context

The app currently has a Toolbar at the top and a full-screen Canvas below. There is no attribution, licensing, or project info visible. The toolbar has button groups separated by gaps, styled with the dark theme (`#16213e` background).

## Goals / Non-Goals

**Goals:**
- Add an About button to the toolbar that opens a modal overlay
- Show project name, copyright, license, and links in the modal
- Add MIT LICENSE file to the repo

**Non-Goals:**
- Settings panel or preferences
- Version display or changelog

## Decisions

### Modal overlay triggered by toolbar button
**Rationale:** A full-screen painting app shouldn't waste canvas space on a persistent footer. A small centered modal keeps the UI clean and is dismissible. Clicking the backdrop or a close button dismisses it.

**Alternative considered:** Footer bar — rejected because it permanently reduces canvas space.

### Pure CSS/React modal, no library
**Rationale:** This is a simple overlay with static content. No need for a dialog library. A fixed-position div with backdrop handles it.

### About button placed at the right end of the toolbar
**Rationale:** Standard placement for info/help actions. Separated from the main tool buttons with `margin-left: auto` to push it to the far right.

## Risks / Trade-offs

- **[Modal z-index]** → Must be above toolbar (z-index: 10). Use z-index: 100 for the overlay.
