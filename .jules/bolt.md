## 2024-05-24 - Cache DOM text content for search filtering
**Learning:** Frequent `.textContent` and `.querySelector` reads in event handlers like `input` (e.g. search filtering) cause synchronous layout thrashing and high JS execution time when iterating over many elements (like 32+ tools in a dropdown or dashboard).
**Action:** Always pre-calculate and cache static text strings and DOM nodes in memory (e.g., using `Array.from(...).map(...)`) outside the event listener to ensure searching just compares strings instead of repeatedly parsing the DOM tree.
