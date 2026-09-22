const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['contact'].html;

const match = html.indexOf('Need insurance &amp; services');
if (match > -1) {
    console.log(html.substring(Math.max(0, match - 2000), match + 500));
}
