const fs = require('fs');
const db = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));
const page = Object.values(db.pages).find(p => p.slug === 'home');
const html = page.html;
const idx = html.indexOf('href="#"');
console.log(html.slice(Math.max(0, idx - 300), idx + 300));
