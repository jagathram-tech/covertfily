# AGENTS.md

- Static site with no build system — serve via HTTP (`npx serve .`); `file://` blocks CDN scripts
- Run `node generator.js` after editing `BASIC_MAPPING` in `generator.js` to regenerate conversion pages
- **`generator.js` overwrites `index.html`** — inline edits to index.html are lost on regeneration
- Keep `BASIC_MAPPING` (generator.js) and `formatMapping` (main.js) in sync — `formatMapping` includes `svg` but `BASIC_MAPPING` does not
- Conversion pages generated from `png-to-jpg.html` template — edit template for UI changes
- Generator skips `png-to-jpg.html` (hand-crafted) and `pdf-to-docx.html` (unique: uses docx.js via worker); `pdf-to-word.html` (another hand-crafted PDF→DOCX path) uses mammoth.js
- Hand-crafted tool pages (watermark, merge-pdf, compress-pdf, ocr, image-resizer, etc.) NOT generated — see nav in index.html for full list
- `main.js` attaches to window: `FORMAT_MAPPING`, `FORMAT_LABELS`, `updateProgress`, `hideProgress`, `setConversionProgress`, `processFile`, `handleFiles`, `updateTargetDropdown`, `selectFromFormat`, `selectToFormat`, `toggleDropdown`, `filterFormats` — do not rename
- Core UI requires DOM IDs: `#dropzone`, `#formatFromContainer`, `#formatToContainer`, `.progress-bar-fill`
- Homepage converter relies on `goToDedicatedPage()` injected by generator.js — dropzone click will fail without it
- PDF conversion may require `pdf.worker.min.js` from CDN — set via `pdfjsLib.GlobalWorkerOptions.workerSrc` in `DOMContentLoaded` (main.js) or inline in page-specific scripts
- `downloadFile()` sets `#downloadBtn` href (no auto-trigger); previous blob URLs revoked on each call — show `#resultArea`/`#downloadContainer` to reveal button
- Mobile nav toggles `nav-active` class on `<body>` via main.js (creates `.menu-toggle` if missing)
- Navbar live search (`.tool-search`) filters `.tool-list a` entries
- CSS uses custom properties in `:root` (`--primary`, `--secondary`, `--bg-alt`, `--border`, etc.) — do not hardcode colors
- Style depends on Font Awesome 6 Free and Google Fonts (Inter) from CDN
- Maintenance: use `fix_nav_and_charset.ps1` PowerShell script to fix broken characters and navbar order in HTML files

### Important nuances

- **Google Analytics** — `gtag.js` is injected on many hand-crafted tool pages (but NOT on `index.html` or generated `*-to-*.html` converters). This creates an inconsistency with the "100% private" claim. Do not remove without project discussion.
- **PDF library split** — some tools use `jsPDF` (image→PDF, DOCX→PDF) while others use `pdf-lib` (merge-pdf, metadata-stripper). Check page `<script>` tags when editing PDF writing logic.
- **OCR uses Tesseract.js v5** from CDN (`tesseract.min.js`). Language packs download on demand.
- **Media conversion uses FFmpeg.wasm** — dynamically loaded from unpkg (`@ffmpeg/ffmpeg` + `@ffmpeg/core` + `@ffmpeg/util`). Core/wasm URLs are hardcoded in `loadFFmpeg()` in `main.js`.
- **Character corruption fix** handles Windows-1252 mojibake: `â€¢` (•) and `â€”` (—). The script also enforces UTF-8 `<meta charset="UTF-8">` tags.
- **Navbar order** enforced by maintenance script: Home → Tools dropdown → Blog (in `<ul class="nav-links">`). Pages missing this order will be corrected by `fix_nav_and_charset.ps1`.