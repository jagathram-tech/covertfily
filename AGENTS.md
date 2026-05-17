# AGENTS.md

## Architecture

Static HTML site, no build system, no package manager, no tests, no CI, no linting. All conversion logic runs client-side via CDN-loaded libraries. Node.js used only for `generator.js` and `check-ids.js`.

## Commands

- **Serve locally:** `npx serve .` — `file://` blocks CDN scripts
- **Regenerate converters:** `node generator.js` — reads `png-to-jpg.html` template, writes all `*-to-*.html` + updates `index.html`
- **Nav/charset fix:** `.\fix_nav_and_charset.ps1` — enforces UTF-8 `<meta charset>`, fixes Home→Tools→Blog nav order, repairs broken Unicode
- **Check duplicate IDs:** `node check-ids.js` — scans all `.html` for non-unique `id=` attributes

## Generator Rules

- `generator.js` reads **only** `png-to-jpg.html` as template. `png-to-jpg.html` serves dual purpose: working converter *and* generator template.
- **Never edit generated `*-to-*.html` directly** — they are overwritten on each generator run.
- Generator skips `png→jpg` (the template itself) and `pdf→docx` (hand-crafted as `pdf-to-word.html`).
- `index.html` is read-modify-written by the generator (not templated), but its dropzone onclick handler and file-input markup are overwritten by regex replacements. Confine persistent manual edits to `<div class="tool-list">` and the Popular Converters section. See `INDEX_UPDATE_REFERENCE.md` for exact boundaries.
- After editing `png-to-jpg.html`, run `node generator.js` to propagate changes to all converter pages.

## Sync Rules

- Keep `BASIC_MAPPING` (generator.js:3) and `formatMapping` (main.js:2) in sync. `formatMapping` includes `svg` (hand-managed); `BASIC_MAPPING` does not. When adding formats, update both plus their label tables (`BASIC_LABELS` / `FORMAT_LABELS`).
- FFmpeg.wasm versions: always `ffmpeg@0.12.10` + `util@0.12.1` + `core@0.12.6` in both main.js and hand-crafted video tools.
- PDF.js: `3.11.174` everywhere. Set `pdfjsLib.GlobalWorkerOptions.workerSrc` explicitly on every page that imports PDF.js.

## Hand-Crafted vs Generated Pages

- **Auto-generated:** lowercase `<!doctype html>`, no keywords `<meta>`, no GA, rely on main.js for all logic.
- **Hand-crafted:** uppercase `<!DOCTYPE html>`, have keywords meta, some include GA. `pdf-to-word.html` is hand-crafted (uses mammoth) despite being an `x-to-y` converter.

## Global JS API (Do Not Rename)

All attached to `window` and referenced inline in HTML:
`FORMAT_MAPPING`, `FORMAT_LABELS`, `updateProgress`, `hideProgress`, `setConversionProgress`, `processFile`, `handleFiles`, `updateTargetDropdown`, `selectFromFormat`, `selectToFormat`, `toggleDropdown`, `filterFormats`, `downloadFile`.

## Required DOM IDs

`#dropzone`, `#formatFromContainer`, `#formatToContainer`, `.progress-bar-fill`, `#downloadBtn`, `#loading`, `#downloadContainer` — renaming breaks converters.

## CDN Versions (Locked)

Font Awesome 6.4.0 (cdnjs) · Inter wght@400-800 (Google Fonts) · SheetJS 0.20.1 · PDF.js 3.11.174 · pdf-lib (unpkg) · jspdf 2.5.1 · mammoth 1.6.0 · docx 7.1.1 · marked + Turndown · jszip 3.10.1 · FFmpeg.wasm 0.12.10+0.12.6 (video only) · SortableJS 1.15.0 · Tesseract.js v5 · UTIF 3.1.0

## Tool Library Patterns

- **PDF manipulation (merge/reorder/protect/watermark/compress):** pdf-lib via unpkg; must set `workerSrc` before PDF.js load. Local `pdf-worker.js` wraps the CDN worker.
- **Image→PDF / DOCX→PDF:** jspdf (simple writes), no pdf-lib.
- **Video tools (compressor/speed/trimmer/extractor):** load FFmpeg.wasm inline, delegate to shared `loadFFmpeg()` in main.js.
- **Audio merger:** Web Audio API + SortableJS, outputs WAV (no external encoding lib).

## Google Analytics Policy

Add `gtag.js` (ID: `G-4Z6LTJ67E2`) ONLY on hand-crafted tool pages with substantial custom logic. NEVER add to `index.html` or auto-generated converters.

Currently on: merge-pdf, compress-pdf, watermark, pdf-to-word, ocr, image-tools, qr-code-generator, file-hash-checker, image-to-json, image-to-base64, exif-reader, metadata-stripper, color-palette-extractor, eyedropper, pixel-art, stereogram, steganography, brightness-map, collage-maker.

## Download Behavior

`downloadFile()` sets `#downloadBtn` href and revokes previous blob URLs — does not auto-trigger. `#downloadContainer` must be visible to reveal button.

## Homepage Dropzone

`index.html` dropzone calls `goToDedicatedPage()` — function injected by `generator.js`. Removing it breaks dropzone navigation.

## Mobile Nav

- Hamburger was removed; mobile nav is now handled via persistent header structure. `main.js` no longer injects it.
- `.nav-backdrop` is injected by JS where needed.

## PowerScript Nav Fix

`fix_nav_and_charset.ps1` overwrites all `.html` files with UTF-8 encoding — run **after** manual edits, not before. Only `fix_nav_and_charset.ps1` has Unicode repair; `fix_nav_only.ps1` skips it.

## Validation

- `node check-ids.js` before committing.
- Test locally: `npx serve .` (CDN scripts need HTTP, not `file://`).

## Common Pitfalls

- Opening via `file://` blocks all CDN scripts and fetch requests.
- Editing generated `*-to-*.html` directly → changes lost on next generator run.
- Forgetting PDF.js `workerSrc` on hand-crafted PDF pages → silent failure.
- Mismatched FFmpeg.wasm versions → `loadFFmpeg()` fails to initialize.
- Changing required DOM IDs without updating main.js + all page scripts.
- Adding GA to generated converters → violates policy and will be reverted.
- Copy-pasting HTML blocks with `id` attributes can create duplicate IDs across files.
