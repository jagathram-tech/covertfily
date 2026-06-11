## 2024-05-24 - Prevent Layout Thrashing in Search Filtering

**Learning:** During rapid events like search filtering (e.g., in `index.html`'s `filterTools`), calling `querySelector` and reading `textContent` on every loop iteration causes redundant DOM access and layout thrashing, which becomes a performance bottleneck for large node lists.

**Action:** Cache static DOM elements and their text content in JavaScript arrays upfront (e.g., `initCardsCache()`). When filtering dynamically updated lists, implement an explicit invalidation mechanism (by checking `length` or object references like `cachedCards[0].el !== currentCards[0]`) rather than reading the DOM every time.
