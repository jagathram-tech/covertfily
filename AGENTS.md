# AGENTS.md

## Architecture

Static HTML site with no build system, no package manager, no tests, no CI, no linting. All conversion logic runs client-side via CDN-loaded libraries. Node.js is used only for two utility scripts (`generator.js`, `check-ids.js`).

## Quick Start

- **Serve locally:** `npx serve .` — static site requires HTTP; `file://` blocks CDN scripts
- **Regenerate converters:** `node generator.js` — reads `png-to-jpg.html` template, writes all `*-to-*.html` + updates `index.html`
- **Update navbar/charset sitewide:** `.\fix_nav_and_charset.ps1` — enforces UTF-8 `<meta charset>` and ensures nav order is Home → Tools → Blog
- **Check duplicate IDs:** `node check-ids.js` — scans all `.html` files for non-unique `id=` attributes

## Critical Sync Rules

- Keep `BASIC_MAPPING` (generator.js:3) and `formatMapping` (main.js:2) in sync — `formatMapping` includes `svg` (hand-managed), `BASIC_MAPPING` does not
- Generator skips `png→jpg` (template itself) and `pdf→docx` (hand-crafted as `pdf-to-word.html`) — do not auto-generate these
- All other `*-to-*.html` converters are generated from the `png-to-jpg.html` template — edit the template for shared UI changes
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
- **PDF.js:** 3.11.174 (requires explicit worker config on every page)
- **pdf-lib:** Used by merge/reorder/protect pages via unpkg
- **jspdf:** 2.5.1 (cdnjs)
- **mammoth:** 1.6.0
- **docx:** 7.1.1
- **marked / turndown:** Markdown HTML conversion
- **jszip:** 3.10.1
- **FFmpeg.wasm:** 0.12.10 (ffmpeg) + 0.12.6 (core), plus util@0.12.1 — hand-crafted video tools only
- **SortableJS:** 1.15.0 (reorder-pdf, audio-merger)
- **Tesseract.js:** v5 (ocr.html)

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

- **Breakpoint:** `≤ 768px`. Desktop styles are untouched below `769px`.
- **Navbar:** `position: fixed` on mobile — always visible at top. Height `60px` (`56px` at `≤ 480px`). Pure white background, no backdrop-filter.
- **Hamburger button (`.menu-toggle`):** Auto-created by `main.js` as a `<button>` (with `aria-label` + `aria-expanded`) if absent in HTML. Three `<span>` bars morph into an X via CSS transforms on `body.nav-active`. Always 44×44px tap target.
- **Drawer:** Toggled by adding/removing `body.nav-active` class. The drawer (`body.nav-active .nav-links`) is `position: fixed; top: 60px` and slides in via `@keyframes mobileDrawerIn`. No backdrop or overlay — page is visible behind the drawer.
- **Scroll freeze:** When the drawer opens, `main.js` sets `body.style.overflow/position/width` to freeze the page. Restored (`''`) on every close path: X button tap, nav link tap, Escape key, and tool link tap.
- **Tools dropdown accordion (`.dropdown`):** Clicking `.dropdown-toggle` on mobile toggles `.active` on the parent `.dropdown` `<li>`. Only one `.dropdown` open at a time (others closed first). CSS rule `.nav-links .dropdown.active .dropdown-content` shows the submenu inline (not `position: fixed`).
- **Category accordion (`.mobile-category`):** Each category header (`.mobile-category-header`) toggles `.expanded` on its `.mobile-category` parent. Only one category open at a time. Chevron icon (`fa-chevron-right`) rotated 90° via `element.style.transform` when open. Managed by `closeAllCategories()` helper in `main.js`.
- **Tool link tap (`.mobile-category-items a`):** Closes all categories + collapses Tools dropdown + closes main drawer + restores scroll. Navigation proceeds normally (no `preventDefault`).
- **Desktop:** Tools dropdown shown via CSS `:hover` / `.has-open` class (mouseenter/mouseleave). Category accordions do not activate on desktop (`.mobile-categories` is CSS-hidden at `≥ 769px`).
- **No `initializeMobileNav()`, no `.nav-backdrop`, no `body.nav-active { overflow: hidden }` in CSS** — scroll freeze is handled exclusively in JS.

## Tool List Search

`.tool-search` input filters `.tool-list a` entries by text match — used in nav dropdowns.

## Styling

CSS uses `:root` custom properties (`--primary`, `--secondary`, `--bg-alt`, `--border`, etc.). Do not hardcode colors. Site depends on Font Awesome 6 Free and Inter from CDN.

## Google Analytics Policy

`gtag.js` (ID: `G-4Z6LTJ67E2`) is injected ONLY on hand-crafted tool pages. NEVER add to `index.html` or auto-generated converter pages. The current list of pages with GA: `merge-pdf.html`, `compress-pdf.html`, `reorder-pdf.html`, `protect-pdf.html`, `watermark.html`, `pdf-to-word.html`, `ocr.html`, `image-tools.html`, `video-trimmer.html`, `video-frame-extractor.html`, `audio-trimmer.html`, `video-compressor.html`, `video-speed.html`, `audio-merger.html`, `word-counter.html`, `lorem-ipsum.html`, `collage-maker.html`, `stereogram.html`, `steganography.html`, `brightness-map.html`, `image-to-json.html`, `pixel-art.html`, `metadata-stripper.html`, `exif-reader.html`, `image-to-base64.html`, `eyedropper.html`, `color-palette-extractor.html`, `qr-code-generator.html`, `barcode-generator.html`, `file-hash-checker.html`.

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
- `fix_nav_and_charset.ps1` overwrites all `.html` files with UTF-8 encoding — run after manual edits, not before.
