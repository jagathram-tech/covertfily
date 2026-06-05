
## 2024-05-18 - Caching DOM textContent in search filters
**Learning:** In interactive elements that update based on frequent user input (like search filtering `input` events), querying the DOM for `.textContent` or `.dataset` on every loop iteration causes severe layout thrashing and performance bottlenecks, especially on mobile. This is a specific pattern found in the hand-crafted UI dashboard cards in `index.html`.
**Action:** Always map and cache static DOM properties (like text content and dataset categories) into a plain JavaScript array object during `DOMContentLoaded`. Filter operations should iterate over this JS object and only perform one DOM action (`element.style.display = ...`) per matched item.
