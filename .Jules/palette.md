## 2024-05-18 - Missing ARIA Labels on Icon-Only Footer Links
**Learning:** Shared layout components (like the global footer) that use icon-only links lacked `aria-label` attributes and included screen-reader-visible `<i>` tags. This is a common accessibility anti-pattern.
**Action:** Added `aria-label` attributes to the `<a>` tags and `aria-hidden="true"` to the `<i>` tags to ensure screen reader users understand the link destinations without redundant icon announcements. Always check global template files (like `png-to-jpg.html`) for a11y issues, as they propagate to all generated pages.
