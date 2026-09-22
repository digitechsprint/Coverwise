const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

for (let key in db.pages) {
    let html = db.pages[key].html;
    const match = html.indexOf('Marine &amp; Transit Insurance');
    if (match > -1) {
        console.log(`Found in page: ${key}`);
        console.log(html.substring(Math.max(0, match - 500), match + 500));
    }
}
