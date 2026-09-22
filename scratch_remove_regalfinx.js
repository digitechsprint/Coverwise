const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let count = 0;

for (let key in db.pages) {
    let html = db.pages[key].html;
    if (html.includes('(formerly RegalfinX)')) {
        // Replace with taking care of the preceding space
        const newHtml = html.replace(/ \(formerly RegalfinX\)/g, '');
        // Also handle case where there is no space
        const newHtml2 = newHtml.replace(/\(formerly RegalfinX\)/g, '');
        
        if (html !== newHtml2) {
            db.pages[key].html = newHtml2;
            count++;
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Removed '(formerly RegalfinX)' from ${count} pages`);
