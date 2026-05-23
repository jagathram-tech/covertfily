## 2024-05-24 - Cached static DOM elements for search
**Learning:** Repeatedly querying the DOM and reading `textContent` in frequent event handlers (like search input) causes unnecessary layout thrashing and slows down rendering.
**Action:** Pre-calculate and cache DOM elements and their relevant text properties into JS arrays on `DOMContentLoaded`. Iterate over this static array instead of the DOM during filtering operations.
