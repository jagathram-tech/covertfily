# AGENTS.md

- Static site with no build system - serve via HTTP (`npx serve .`) as `file://` blocks CDN scripts
- Run `node generator.js` after editing `BASIC_MAPPING` in `generator.js` to regenerate conversion pages
- **`generator.js` overwrites `index.html`** - inline edits to index.html are lost on regeneration
- Keep `BASIC_MAPPING` (generator.js) and `formatMapping` (main.js) in sync - formatMapping includes svg but BASIC_MAPPING does not
- Conversion pages generated from `png-to-jpg.html` template - edit template for UI changes
- Generator skips `png-to-jpg.html` and `pdf-to-docx.html` (hand-crafted); `pdf-to-word.html` has unique implementation
- Hand-crafted tool pages (watermark, merge-pdf, ocr, image-resizer, etc.) NOT generated - see nav in index.html
- `main.js` attaches to window: FORMAT_MAPPING, FORMAT_LABELS, updateProgress, hideProgress, setConversionProgress, processFile, handleFiles, updateTargetDropdown, selectFromFormat, selectToFormat, toggleDropdown, filterFormats - **do not rename**
- Core UI requires DOM IDs: #dropzone, #formatFromContainer, #formatToContainer, .progress-bar-fill
- Homepage uses `goToDedicatedPage` injected by generator.js - format navigation fails without it
- PDF conversion requires pdf.worker.min.js from CDN (set in main.js DOMContentLoaded)
- downloadFile() sets #downloadBtn href (no auto-trigger); previous blob URLs revoked each call - show #resultArea/#downloadContainer to reveal button
- Mobile nav toggles nav-active class on <body> via main.js (creates .menu-toggle if missing)
- Navbar live search (.tool-search) filters .tool-list a entries
- CSS uses custom properties in :root (--primary, --secondary, --bg-alt, --border, etc.) - do not hardcode colors
- Style depends on Font Awesome 6 Free and Google Fonts (Inter) from CDN
- Maintenance: Use fix_nav_and_charset.ps1 PowerShell script to fix broken characters and navbar order in HTML files