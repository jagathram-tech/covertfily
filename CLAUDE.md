# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Covertfily (covertfily.com) is a **static, client-side-only file-conversion site**: no build system, no bundler, no package manager, no tests, no CI. Every conversion runs in the browser via CDN-loaded libraries (SheetJS, PDF.js, FFmpeg.wasm, Tesseract.js, pdf-lib, mammoth, etc.). Node.js is used only by the helper scripts below to regenerate HTML/SEO assets.

`AGENTS.md` is the authoritative conventions document — **read it before editing**. It covers locked CDN versions, required DOM IDs, the global `window` JS API (do not rename), the Google Analytics allowlist, and the hand-crafted-vs-generated page distinction. This file gives the big picture and the script pipeline; AGENTS.md gives the rules.

## Commands

```bash
npx serve .            # serve locally — file:// blocks CDN scripts, so always use HTTP
node generator.js      # regenerate all *-to-*.html converter pages from the template
node check-ids.js      # fail if any HTML file has duplicate id= attributes — run before committing
node generate-hubs.js  # regenerate category hub pages (images/documents/media)
node sync-seo.js       # rewrite SEO <head> blocks across all page types from seo-utils.js
node generate-sitemap.js   # regenerate sitemap.xml from the current set of .html files
node sync-design-system.js # propagate nav + footer from the template to other pages
```

There is no single test command. "Validation" = `node check-ids.js` + manually loading pages via `npx serve .`.

## The generation model (most important architectural fact)

`png-to-jpg.html` is **both a working converter page and the template** for every other `*-to-*.html`. `node generator.js` reads it, swaps in per-format SEO/labels/links from `seo-utils.js`, and overwrites all converter pages.

Consequence: **never hand-edit a generated `*-to-*.html`** — your change is lost on the next generator run. To change all converters, edit `png-to-jpg.html` and re-run `node generator.js`. The generator deliberately skips two pairs: `png→jpg` (the template itself) and `pdf→docx` (which is hand-crafted as `pdf-to-word.html` using mammoth).

Two page classes coexist:
- **Generated converters** — lowercase `<!doctype html>`, no keywords meta, no GA, all logic delegated to `main.js`.
- **Hand-crafted tools** (e.g. `merge-pdf.html`, `ocr.html`, `nasa-*.html`) — uppercase `<!DOCTYPE html>`, custom inline logic, keyword meta, and (only these) may include Google Analytics.

## Shared runtime: main.js + seo-utils.js

- `main.js` holds the shared converter engine (`processFile`, `handleFiles`, dropdown/format logic, `loadFFmpeg()`) and the `formatMapping` source of truth, all attached to `window` and referenced inline from HTML. Renaming these globals or the required DOM IDs breaks every generated page.
- `seo-utils.js` is the SEO single-source-of-truth shared by `generator.js`, `generate-hubs.js`, `sync-seo.js`, and `generate-sitemap.js`. It builds `<head>` blocks, breadcrumb HTML, JSON-LD, and sitemap priorities. Edit SEO here, then re-run the relevant generator scripts rather than editing `<head>` in pages by hand.

## Format-mapping sync hazard

The list of supported conversions is duplicated in **four** places that must stay consistent (see AGENTS.md "Sync Rules" for specifics):
1. `BASIC_MAPPING` in `generator.js` (and a near-copy in `generate-hubs.js`)
2. `formatMapping` in `main.js`
3. inline `FORMAT_MAPPING` in `index.html` (shadows main.js; currently missing some formats)
4. the matching label tables (`BASIC_LABELS` / `FORMAT_LABELS`) in each location

When adding a format, update all copies and their labels, then run `node generator.js` (and `generate-hubs.js` / `sync-seo.js` / `generate-sitemap.js` as appropriate).

## Common pitfalls

- Opening pages via `file://` silently blocks all CDN scripts — always serve over HTTP.
- Editing a generated `*-to-*.html` directly → overwritten on next `node generator.js`.
- Hand-crafted PDF pages must set `pdfjsLib.GlobalWorkerOptions.workerSrc` explicitly or PDF.js fails silently (`pdf-worker.js` wraps the CDN worker).
- FFmpeg.wasm version pins must match across `main.js` and every hand-crafted video tool, or `loadFFmpeg()` fails to initialize.
- Adding GA to `index.html` or generated converters violates the policy in AGENTS.md.
- On Windows, after manual HTML edits run `.\fix_nav_and_charset.ps1` to enforce UTF-8 charset and repair mojibake (its nav-reorder regex is currently a no-op).
