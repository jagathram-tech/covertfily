const fs = require("fs");

const fixes = [
  { from: "<style>>", to: "<style>" },
  { from: 'href="style.css"', to: 'href="style.css?v=2.0.1"' },
];

let touched = 0;

for (const file of fs.readdirSync(".")) {
  if (!file.endsWith(".html")) continue;

  let html = fs.readFileSync(file, "utf8");
  const original = html;
  const isGeneratedConverter =
    /^[a-z0-9]+-to-[a-z0-9]+\.html$/.test(file) && file !== "pdf-to-word.html";

  for (const fix of fixes) {
    if (fix.from === 'href="style.css"' && isGeneratedConverter) continue;
    if (fix.from === 'href="style.css"') {
      html = html.replace(/href="style\.css"(?!\?v=)/g, fix.to);
    } else {
      html = html.replaceAll(fix.from, fix.to);
    }
  }

  if (html !== original) {
    fs.writeFileSync(file, html);
    touched++;
    console.log(`Fixed: ${file}`);
  }
}

console.log(`Done. Updated ${touched} hand-crafted pages.`);