# AGENTS.md – Guidance for OpenCode

- After editing format mappings, run `node generator.js` to regenerate all conversion HTML pages; otherwise new formats won't have dedicated pages.
- Conversion pages are generated from the `png-to-jpg.html` template. Modify the template for UI changes instead of editing each generated file.
- Serve the site over HTTP/HTTPS (e.g., `npx serve .`). Opening `index.html` via `file://` can block CDN script loading and break functionality.
- All heavy libraries (SheetJS, JSZip, PDF.js, FFmpeg.wasm, etc.) are loaded from CDNs at runtime. An initial internet connection is required; after scripts load the app works offline.
- Keep `generator.js` BASIC_MAPPING/BASIC_LABELS and `main.js` FORMAT_MAPPING/FORMAT_LABELS in sync; mismatched mappings cause dropdown errors.
- The homepage dropdown triggers navigation via the `goToDedicatedPage` function injected by `generator.js`. Without this, selecting formats on the home page won't navigate to the correct conversion page.
- The app expects specific DOM elements (`#dropzone`, `#formatFromContainer`, `#formatToContainer`, progress bar elements). Missing or renamed elements will break file handling.
- PDF conversion relies on the PDF.js worker script (`pdf.worker.min.js`) from the CDN. Ensure network access to this file; otherwise PDF-related tools fail.
- Audio/video conversion uses FFmpeg.wasm; the first conversion can be slow due to library download. Users should be aware of this load time.
- The `downloadFile` utility creates a temporary anchor to trigger downloads. Some browsers may block automatic downloads; user interaction may be required.
- The repository has no build system or package manager; changes are reflected directly when served. Do not expect `npm` scripts or bundlers.
- `generator.js` skips regeneration of the hand‑crafted `png-to-jpg.html` and `pdf-to-docx.html` pages; keep those files manually if you modify those specific conversions.
- The mobile navigation menu toggles the `nav-active` class on `<body>`. Ensure CSS respects this class for proper mobile behavior.
- The tool list in the navbar uses a live search (`.tool-search`). The search functionality depends on the `.tool-list a` elements being present.
- The site relies on global `window` objects (`window.FORMAT_MAPPING`, `window.updateProgress`, etc.). Do not rename these globals without updating all references.
