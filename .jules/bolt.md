## 2024-05-26 - Prevent Layout Thrashing in Live Search
**Learning:** Performing `querySelector` and reading `.textContent` repeatedly on multiple elements inside a high-frequency event listener like `input` causes significant performance degradation and layout thrashing. This is especially true for search filters that iterate over numerous DOM elements.
**Action:** Always cache static DOM elements and their text content in a JavaScript array/object upfront (e.g., during initialization) instead of reading from the DOM repeatedly during dynamic filtering loops.
