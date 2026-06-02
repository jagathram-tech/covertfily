## 2024-06-02 - Caching Static DOM Elements
**Learning:** Frequent events like `input` listeners that query elements (e.g., `querySelectorAll`) and read properties like `textContent` cause layout thrashing and major performance bottlenecks, especially in complex UIs with large dynamic dropdowns.
**Action:** Always pre-process static DOM elements by caching their node references and processed text values inside Javascript arrays or Maps upfront, so event listeners only execute fast data comparisons rather than expensive DOM reads.
