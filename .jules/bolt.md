## 2026-06-08 - Cached DOM queries for filtering
**Learning:** Found a specific performance bottleneck where the search filter on index.html repeatedly hit the DOM to query 'h3' and 'p' elements on every keypress, which causes layout thrashing.
**Action:** Next time, cache static DOM queries and their text contents in a JavaScript array during initialization for UI components that require high-frequency filtering.
