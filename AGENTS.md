# AGENTS.md

- Static site, no build system. Serve via HTTP (`npx serve .`); `file://` blocks CDN scripts.
- Run `node generator.js` after editing `BASIC_MAPPING` (in `generator.js`) or `FORMAT_MAPPING` (in `main.js`) to regenerate conversion pages and homepage dropdown.
- Conversion pages are generated from the hand-crafted `png-to-jpg.html` template. Edit the template for UI changes; generated files are overwritten on next generator run.
- `generator.js` skips hand-crafted `png-to-jpg.html` and `pdf-to-word.html` (does not skip `pdf-to-docx.html`).
- Hand-crafted tool pages (watermark, merge-pdf, ocr, etc.) are not generated; see nav in `png-to-jpg.html` for full list.
- `main.js` loads on all pages, exports `window.FORMAT_MAPPING`, `window.updateProgress`, etc. Do not rename these globals.
- Core UI requires DOM IDs: `#dropzone`, `#formatFromContainer`, `#formatToContainer`, `.progress-bar-fill`.
- Homepage uses `goToDedicatedPage` injected by `generator.js`; format navigation fails without it.
- CDN libraries (SheetJS, JSZip, PDF.js, FFmpeg.wasm) load on first use. Works offline after initial load.
- FFmpeg.wasm uses single-threaded core (no COOP/COEP). First media conversion downloads ~10MB.
- PDF conversion requires `pdf.worker.min.js` from CDN.
- `downloadFile` uses temporary anchor; browsers may block auto-downloads.
- Mobile nav toggles `nav-active` class on `<body>`.
- Navbar live search (`.tool-search`) needs `.tool-list a` entries for each tool.
