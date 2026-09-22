const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['about-us'] ? db.pages['about-us'].html : (db.pages['about'] ? db.pages['about'].html : '');
const idx = html.indexOf('a4e64b7'); // The section that contains 0e4dc25
const htmlBefore = html.substring(Math.max(0, idx - 5000), idx);
const htmlAfter = html.substring(idx, idx + 5000);

const colsBefore = htmlBefore.match(/class="elementor-column elementor-col-50[^"]+/g);
const colsAfter = htmlAfter.match(/class="elementor-column elementor-col-50[^"]+/g);

console.log("Cols Before:", colsBefore);
console.log("Cols After:", colsAfter);
