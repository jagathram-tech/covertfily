# AGENTS.md

## Quick Start

- **Serve locally:** `npx serve .` — static site needs HTTP; `file://` blocks CDN scripts
- **Regenerate converters:** `node generator.js` after editing `BASIC_MAPPING` in `generator.js`
- **Update navbar/charset across all HTML:** `.\fix_nav_and_charset.ps1` (PowerShell)

## Critical Sync Rules

- Keep `BASIC_MAPPING` (generator.js:3) and `formatMapping` (main.js:2) in sync — `formatMapping` includes `svg` (hand-managed), `BASIC_MAPPING` does not
- Generator skips `png-to-jpg.html` (hand-crafted) and `pdf-to-docx.html` (hand-crafted as `pdf-to-word.html`) — do not auto-generate these
- All other `*-to-*.html` converters are generated from the `png-to-jpg.html` template — edit the template for shared UI changes

## Main.js Global API (Do Not Rename)

These are attached to `window` and referenced inline in HTML:
`FORMAT_MAPPING`, `FORMAT_LABELS`, `updateProgress`, `hideProgress`, `setConversionProgress`, `processFile`, `handleFiles`, `updateTargetDropdown`, `selectFromFormat`, `selectToFormat`, `toggleDropdown`, `filterFormats`

## Required DOM IDs (Core UI)

`#dropzone`, `#formatFromContainer`, `#formatToContainer`, `.progress-bar-fill` — used by main.js event handlers; changing these breaks all converters

## Homepage Converter Dependency

The dropzone on `index.html` calls `goToDedicatedPage()` — this function is injected by `generator.js`. If regenerating index.html manually, ensure it exists or the dropzone click fails.

## PDF Worker Configuration

When using PDF.js on any page, set `pdfjsLib.GlobalWorkerOptions.workerSrc` explicitly. `main.js` sets it globally, but hand-crafted PDF pages may need inline configuration (see `pdf-to-word.html:29`).

## Download Behavior

`downloadFile()` sets `#downloadBtn` href only — does not auto-trigger. Previous blob URLs are revoked. Ensure `#resultArea`/`#downloadContainer` is visible to reveal the button.

## Mobile Navigation

Main.js creates `.menu-toggle` hamburger if missing. Toggles `nav-active` class on `<body>`. Dropdowns in mobile require `.dropdown-toggle` click handler.

## Tool List Search

`.tool-search` input filters `.tool-list a` entries by text match — used in nav dropdowns.

## Styling

CSS uses `:root` custom properties (`--primary`, `--secondary`, `--bg-alt`, `--border`, etc.). Do not hardcode colors. Styles depend on Font Awesome 6 Free and Google Fonts (Inter) from CDN.

## Important Nuances

- **Google Analytics** — `gtag.js` injected on hand-crafted tool pages (`merge-pdf.html`, `pdf-to-word.html`, `image-tools.html`, etc.) but NOT on `index.html` or generated `*-to-*.html` converters. Contradicts "100% private" claim; do not remove without project discussion.
- **PDF library split** — `jsPDF` used for image→PDF and DOCX→PDF (simple writes); `pdf-lib` used for merge-pdf, reorder-pdf, protect-pdf (complex manipulation). Check page `<script>` tags when editing.
- **OCR** — uses Tesseract.js v5 from CDN; language packs download on demand.
- **Media conversion** — FFmpeg.wasm loaded dynamically in `loadFFmpeg()` (main.js:887) with hardcoded CDN URLs. Different versions exist across hand-crafted pages; prefer the pattern in `main.js` (0.12.10 core 0.12.6).
- **Character corruption fix** — `fix_nav_and_charset.ps1` repairs Windows-1252 mojibake (`â€¢` → `•`, `â€”` → `—`) and enforces UTF-8 `<meta charset="UTF-8">`.
- **Navbar order** — enforced by maintenance script: Home → Tools dropdown → Blog. Pages deviating will be corrected.