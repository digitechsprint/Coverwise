const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let count = 0;

for (let key in db.pages) {
    let html = db.pages[key].html;
    if (html.includes('mailto:contact@example.com')) {
        const newHtml = html.replace(/mailto:contact@example\.com/g, 'mailto:coverwise.imf@gmail.com');
        if (html !== newHtml) {
            db.pages[key].html = newHtml;
            count++;
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
