## 2024-05-24 - Cache DOM Text Content for Search Filters
**Learning:** During frequent events like `input` for search filtering, repeatedly calling `querySelector` and reading `.textContent` on every card in the dashboard creates measurable performance overhead and potential layout thrashing. This is a common bottleneck in static sites lacking a virtual DOM.
**Action:** Always cache static DOM elements and their text content in a JS array upfront during initialization. Iterate over this cached data structure for filtering instead of repeatedly querying the live DOM.
