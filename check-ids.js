const fs = require('fs');
const ids = {};
for (const file of fs.readdirSync('.').filter(f => f.endsWith('.html'))) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.matchAll(/id="([^"]+)"/g);
  for (const m of matches) {
    const id = m[1];
    if (!ids[id]) ids[id] = [];
    ids[id].push(file);
  }
}
for (const [id, files] of Object.entries(ids)) {
  if (files.length > 1) {
    console.log('Duplicate ID: ' + id + ' in: ' + files.join(', '));
  }
}