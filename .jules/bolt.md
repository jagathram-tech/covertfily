## 2026-06-06 - Layout Thrashing Avoidance with DOM Caching
**Learning:** Frequent events like `input` for search filtering cause significant performance bottlenecks due to layout thrashing when redundant DOM property reads (like `querySelectorAll` and `.textContent`) are performed inside the event loop.
**Action:** Always cache static DOM elements and their text content in JS arrays (or attach a cached property to the element itself) upfront to prevent redundant reads and improve render performance.
