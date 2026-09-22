const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['our-portfolio'].html;
const cssLinks = [...html.matchAll(/href="([^"]*\.css[^"]*)"/gi)].map(m => m[1]);
console.log(cssLinks.filter(link => link.includes('elementor/css')));
