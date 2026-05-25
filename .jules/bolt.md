## 2024-06-19 - Nav Tools Dropdown Search Layout Thrashing
**Learning:** During dropdown search filtering, querying the DOM with `querySelectorAll` and reading `.textContent` synchronously on every `input` event triggers expensive recalcs and layout thrashing, particularly since the dropdown items are static.
**Action:** Always cache static DOM elements and their frequently accessed properties (like text content) upfront during initialization, and iterate over these pre-cached arrays within frequent event listeners to avoid hitting the live DOM.
