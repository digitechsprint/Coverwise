const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['our-portfolio'].html;

const matches = html.match(/src="[^"]*\.html"/gi);
console.log([...new Set(matches)]);
