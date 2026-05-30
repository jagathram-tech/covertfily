## 2024-05-24 - Prevent Layout Thrashing in Frequent Events
**Learning:** Querying the DOM (`querySelectorAll`) and reading properties like `.textContent` inside high-frequency event listeners (like `input` for search filtering) causes layout thrashing and unnecessary performance bottlenecks in this static site architecture.
**Action:** Always cache static DOM elements and their text content in JavaScript arrays upfront before the event listener is attached, ensuring only necessary style writes happen during the event.
