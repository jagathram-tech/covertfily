# AGENTS.md – Guidance for OpenCode

- After changing `generator.js` BASIC_MAPPING or `main.js` FORMAT_MAPPING, run `node generator.js` to regenerate conversion pages and the homepage dropdown logic.
- Conversion pages are based on `png-to-jpg.html`; edit this template for UI tweaks instead of each generated file.
- Serve the site via HTTP (e.g., `npx serve .`). Opening `index.html` with `file://` blocks CDN scripts.
- Heavy libraries (SheetJS, JSZip, PDF.js, FFmpeg.wasm, etc.) load from CDNs on first use; an internet connection is required initially, after which the app works offline.
- The homepage dropdown uses `goToDedicatedPage` injected by `generator.js`; without it format navigation fails.
- Core UI expects specific DOM IDs (`#dropzone`, `#formatFromContainer`, `#formatToContainer`, progress bar elements). Renaming/removing them breaks file handling.
- PDF conversion needs reachable `pdf.worker.min.js` from its CDN.
- FFmpeg.wasm is downloaded on first audio/video conversion – expect a delay.
- `downloadFile` triggers downloads via a temporary anchor; browsers may block automatic downloads.
- No build system or package manager; changes are reflected directly when the site is served.
- `generator.js` skips regeneration of hand‑crafted `png-to-jpg.html` and `pdf-to-docx.html`; maintain those manually if edited.
- Mobile navigation toggles the `nav-active` class on `<body>`; ensure CSS respects this class.
- Navbar live search (`.tool-search`) works only if `.tool-list a` entries exist for each tool.
- Global objects (`window.FORMAT_MAPPING`, `window.updateProgress`, etc.) are referenced throughout; renaming them will break functionality.