const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let count = 0;

for (let key in db.pages) {
    let html = db.pages[key].html;
    if (html.includes('tel:+1(307)776-0608')) {
        const newHtml = html.replace(/tel:\+1\(307\)776-0608/g, 'tel:+919958806806');
        if (html !== newHtml) {
            db.pages[key].html = newHtml;
            count++;
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
