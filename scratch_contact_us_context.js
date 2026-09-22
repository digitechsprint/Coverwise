const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const home = db.pages['home'].html;
const idx = home.indexOf('elementor-icon-list-text">Contact Us');
console.log(home.substring(Math.max(0, idx - 500), idx + 500));
