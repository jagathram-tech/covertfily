# AGENTS.md

## Architecture

Static HTML site with no build system, no package manager, no tests, no CI, no linting. All conversion logic runs client-side via CDN-loaded libraries. Node.js is used only for two utility scripts (`generator.js`, `check-ids.js`).

## Quick Start

- **Serve locally:** `npx serve .` — static site requires HTTP; `file://` blocks CDN scripts
- **Regenerate converters:** `node generator.js` — reads `png-to-jpg.html` template, writes all `*-to-*.html` + updates `index.html`
- **Update navbar/charset sitewide:** `.\fix_nav_and_charset.ps1` — enforces UTF-8 `<meta charset>` and ensures nav order is Home → Tools → Blog
- **Check duplicate IDs:** `node check-ids.js` — scans all `.html` files for non-unique `id=` attributes

## Critical Sync Rules

- Keep `BASIC_MAPPING` (generator.js:3) and `formatMapping` (main.js:2) in sync — `formatMapping` includes `svg` (hand-managed), `BASIC_MAPPING` does not. When adding formats, update both mappings and their label tables (`BASIC_LABELS` in generator.js, `FORMAT_LABELS` in main.js).
- Generator skips `png→jpg` (template itself) and `pdf→docx` (hand-crafted as `pdf-to-word.html`) — do not auto-generate these.
- All other `*-to-*.html` converters are generated from the `png-to-jpg.html` template — edit the template for shared UI changes.
- **FFmpeg.wasm versions:** Both `main.js` and hand-crafted video tools use `ffmpeg@0.12.10` with `core@0.12.6`. Keep these aligned when updating.
- **PDF.js worker version:** All pages use `pdf.js@3.11.174` — set `pdfjsLib.GlobalWorkerOptions.workerSrc` explicitly on every page that imports PDF.js.

## Generator Behavior & Scope

- `generator.js` reads **only** `png-to-jpg.html` as the template — this file is the *single source of truth* for all auto-generated converters.
- `generator.js` **overwrites** every `*-to-*.html` file (except `png-to-jpg.html` itself and `pdf-to-word.html`) on each run — never edit generated files directly.
- `generator.js` also **overwrites** `index.html` — confine manual edits to the Tools dropdown (`<div class="tool-list">`) and Popular Converters section. See `INDEX_UPDATE_REFERENCE.md` for exact boundaries.
- `png-to-jpg.html` serves dual purpose: it's a working converter *and* the generator template — changes here affect all generated pages when `node generator.js` runs.
- `pdf-to-word.html` is hand-crafted (uses `mammoth`) and never auto-generated.

## Main.js Global API (Do Not Rename)

`FORMAT_MAPPING`, `FORMAT_LABELS`, `updateProgress`, `hideProgress`, `setConversionProgress`, `processFile`, `handleFiles`, `updateTargetDropdown`, `selectFromFormat`, `selectToFormat`, `toggleDropdown`, `filterFormats`, `downloadFile` — all attached to `window` and referenced inline in HTML.

## Required DOM IDs (Core UI)

`#dropzone`, `#formatFromContainer`, `#formatToContainer`, `.progress-bar-fill`, `#downloadBtn`, `#loading`, `#downloadContainer` — referenced throughout main.js and page scripts; renaming breaks converters.

## External Dependencies (CDN Locked)

- **Font Awesome:** 6.4.0 (cdnjs)
- **Google Fonts:** Inter wght@400–800
- **SheetJS (xlsx):** 0.20.1
- **PDF.js:** 3.11.174 (requires explicit `workerSrc` on every page)
- **pdf-lib:** Used by merge/reorder/protect/watermark/compress via unpkg
- **jspdf:** 2.5.1 (cdnjs)
- **mammoth:** 1.6.0
- **docx:** 7.1.1
- **marked / turndown:** Markdown/HTML conversion
- **jszip:** 3.10.1
- **FFmpeg.wasm:** ffmpeg@0.12.10 + core@0.12.6 + util@0.12.1 — hand-crafted video tools only
- **SortableJS:** 1.15.0 (reorder-pdf, audio-merger)
- **Tesseract.js:** v5 (ocr.html)
- **UTIF:** 3.1.0 (loaded inline for EPS/TIFF handling)

## Hand-Crafted Tool Library Patterns

- **PDF manipulation (merge/reorder/protect/watermark/compress):** Uses `pdf-lib` for complex operations; must set `pdfjsLib.GlobalWorkerOptions.workerSrc` inline before PDF.js load.
- **Image→PDF / DOCX→PDF:** Uses `jspdf` (simple writes) — no `pdf-lib` needed.
- **Video tools (compressor/speed):** Load FFmpeg.wasm inline and delegate to shared `loadFFmpeg()` in main.js for actual conversion. Both expect versions above.
- **Audio merger:** Uses Web Audio API + SortableJS, no external encoding library (outputs WAV).

## Homepage Dropzone Behavior

`index.html` dropzone calls `goToDedicatedPage()` — injected by `generator.js`. Removing this function breaks dropzone navigation.

## Download Behavior

`downloadFile()` sets `#downloadBtn` href and revokes previous blob URLs — does not auto-trigger. Ensure `#downloadContainer` is visible to reveal the button.

## Mobile Navigation

- Hamburger auto-created by main.js if missing
- `initializeMobileNav()` computes mobile drawer `top` from `nav.getBoundingClientRect().bottom` — do not hardcode
- Drawer `z-index: 1001`; `.nav-backdrop` injected by JS

## Tool List Search

`.tool-search` input filters `.tool-list a` entries by text match — used in nav dropdowns.

## Styling

CSS uses `:root` custom properties (`--primary`, `--secondary`, `--bg-alt`, `--border`, etc.). Do not hardcode colors. Site depends on Font Awesome 6 Free and Inter from CDN.

## Google Analytics Policy

Add `gtag.js` (ID: `G-4Z6LTJ67E2`) ONLY on hand-crafted tool pages with substantial custom logic. NEVER add to `index.html` or auto-generated `*-to-*.html` converter pages.

Hand-crafted pages currently using GA:
- merge-pdf.html
- compress-pdf.html
- watermark.html
- pdf-to-word.html
- ocr.html
- image-tools.html
- qr-code-generator.html
- file-hash-checker.html
- image-to-json.html
- image-to-base64.html
- exif-reader.html
- metadata-stripper.html
- color-palette-extractor.html
- eyedropper.html
- pixel-art.html
- stereogram.html
- steganography.html
- brightness-map.html
- collage-maker.html

When creating a new hand-crafted tool, include the standard GA snippet in the `<head>` as seen in existing tools above.

## Testing & Validation

- Run `node check-ids.js` before committing to catch duplicate `id=` attributes across all HTML files.
- Verify locally with `npx serve .` — all CDN scripts must load over HTTP(S), not `file://`.
- Test both desktop and mobile layouts after CSS changes; some breakpoints defined in `MOBILE_OPTIMIZATION_GUIDE.md`.

## Common Pitfalls

- Opening HTML directly in browser (`file://`) blocks CDN scripts and fetch requests.
- Editing generated `*-to-*.html` files directly — changes will be overwritten by `generator.js`.
- Forgetting PDF.js worker config on hand-crafted PDF pages → silent failure.
- Mismatched FFmpeg.wasm versions → `loadFFmpeg()` fails to initialize.
- Changing required DOM IDs without updating main.js and page scripts.
- Adding GA to generated converters — violates privacy policy and will be reverted.
- Copy-pasting HTML blocks with `id` attributes can create duplicate IDs across files — run `check-ids.js` to catch.
- `fix_nav_and_charset.ps1` overwrites all `.html` files with UTF-8 encoding — run after manual edits, not before.
