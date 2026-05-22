## 2025-02-18 - Caching DOM properties in frequent event listeners
**Learning:** Frequent events like `input` (e.g. search bars) can cause layout thrashing and performance bottlenecks when they repeatedly query the DOM (e.g., `querySelectorAll`) and read properties like `.textContent` that might require style recalculation.
**Action:** Always cache static DOM references and their static text content in an array upfront when initializing a filter or search function, and perform the filtering logic against this cached array rather than the DOM directly.
