const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['about-us'] ? db.pages['about-us'].html : (db.pages['about'] ? db.pages['about'].html : '');
const matches = html.match(/class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-[^"]+/g);
console.log(matches);
