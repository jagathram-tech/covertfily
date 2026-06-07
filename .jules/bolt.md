## 2024-05-18 - Caching DOM Read Operations in Dashboard Filter
**Learning:** Found a performance bottleneck where frequent events (like typing in the search input) triggered redundant reads of DOM `.textContent` during layout recalculations, causing potential layout thrashing and slowing down search filtering.
**Action:** Avoid redundant DOM queries and reads inside event listeners. Cache the static DOM text content in a JavaScript array object upfront and iterate over the array when filtering.
