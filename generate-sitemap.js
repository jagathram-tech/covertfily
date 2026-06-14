const fs = require("fs");
const { SITE, sitemapMetaFor } = require("./seo-utils");

const today = new Date().toISOString().slice(0, 10);
const SKIP = new Set([]);

const files = fs
  .readdirSync(".")
  .filter((f) => f.endsWith(".html") && !SKIP.has(f))
  .sort();

const urls = files.map((file) => {
  const loc = file === "index.html" ? `${SITE}/` : `${SITE}/${file}`;
  const { priority, changefreq } = sitemapMetaFor(file);
  return `    <url>
        <loc>${loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${priority}</priority>
    </url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

fs.writeFileSync("sitemap.xml", xml);
console.log(`Wrote sitemap.xml with ${files.length} URLs (lastmod: ${today})`);