## 2026-06-01 - Icon-Only Footer Links Accessibility
**Learning:** Icon-only social media links in the footer (using FontAwesome `<i>` tags inside `<a>` tags) lacked `aria-label` attributes, making them opaque to screen readers.
**Action:** Added descriptive `aria-label`s to these anchor tags in `png-to-jpg.html` and `index.html`, and propagated changes across all hand-crafted and generated HTML files. Ensure future icon-only links always include accessible labels.
