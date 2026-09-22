const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const p = db.pages['home'];
console.log("In bodyClass:", p.bodyClass.includes('elementor-15'));
console.log("In HTML:", p.html.includes('elementor-15'));
