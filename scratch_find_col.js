const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['about-us'] ? db.pages['about-us'].html : (db.pages['about'] ? db.pages['about'].html : '');
const idx = html.indexOf('0e4dc25');
const substr = html.substring(idx, idx + 15000);
const matches = substr.match(/class="elementor-column [^"]+/g);
console.log(matches);
