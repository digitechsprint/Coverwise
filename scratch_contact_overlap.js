const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['contact'].html;

const match = html.indexOf('Need insurance &amp; services');
if (match > -1) {
    console.log(html.substring(Math.max(0, match - 1000), match + 2000));
} else {
    const match2 = html.indexOf('Need insurance');
    if (match2 > -1) {
        console.log(html.substring(Math.max(0, match2 - 1000), match2 + 2000));
    } else {
        console.log("Could not find text");
    }
}
