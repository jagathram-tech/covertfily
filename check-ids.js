const fs = require('fs');
let hasDuplicates = false;
for (const file of fs.readdirSync('.').filter(f => f.endsWith('.html'))) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.matchAll(/id="([^"]+)"/g);
  const fileIds = new Set();
  for (const m of matches) {
    const id = m[1];
    if (fileIds.has(id)) {
      console.log(`Duplicate ID: ${id} in file ${file}`);
      hasDuplicates = true;
    }
    fileIds.add(id);
  }
}
if (hasDuplicates) {
  process.exit(1);
}