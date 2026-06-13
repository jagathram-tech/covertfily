## 2024-05-18 - Missing ARIA Labels on Social Icons
**Learning:** Icon-only social links in the site footer lacked ARIA labels and had screen-reader-visible icons, creating an accessibility barrier.
**Action:** Applied `aria-label` to the `<a>` tags and `aria-hidden="true"` to the `<i>` tags in `index.html` and the generator template (`png-to-jpg.html`), then synced to all generated pages.
