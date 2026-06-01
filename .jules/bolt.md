## 2024-06-01 - DOM Read Caching for Filter Inputs
**Learning:** Frequent DOM reads (like `.textContent` or `querySelector`) inside event listeners (especially `input` events for search/filtering) can cause severe layout thrashing and high CPU usage in client-side heavy applications with many DOM nodes.
**Action:** Always map and cache static DOM element text and metadata into an array of plain JavaScript objects upfront. Then, run the filtering logic against this cached array, only touching the DOM to update visibility (`style.display`).
