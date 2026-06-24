## 2024-05-15 - Add Keyboard Accessibility to Non-Semantic CTAs
**Learning:** Core interactive elements implemented as non-semantic tags (e.g., `<div onclick=...>`) lack built-in keyboard support. Users relying on keyboard navigation cannot interact with essential features like dropzones or accordions.
**Action:** Always explicitly make non-semantic interactive elements keyboard accessible by adding `role="button"`, `tabindex="0"`, `onkeydown` handlers for "Enter" and "Space" keys (including `event.preventDefault()`), and standard focus classes (e.g., `focus-visible:ring-2`).
