const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'pages.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const replacements = [
  [/tel:\+1\(307\)776-0608/g, 'tel:+919958806806'],
  [/tel:1-\(246\)333-0089/g, 'tel:+919958806806'],
  [/mailto:contact@example\.com/g, 'mailto:coverwise.imf@gmail.com'],
];

let changed = 0;
for (const page of Object.values(db.pages)) {
  const original = page.html || '';
  let fixed = original;
  for (const [re, replacement] of replacements) {
    fixed = fixed.replace(re, replacement);
  }
  if (fixed !== original) {
    page.html = fixed;
    changed++;
  }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${changed} pages in data/pages.json`);
