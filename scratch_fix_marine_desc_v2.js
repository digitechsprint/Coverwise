const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let count = 0;
const correctText = ' Protect your cargo, goods, and shipments against loss or damage during transit.';

for (let key in db.pages) {
    let html = db.pages[key].html;
    
    // We match the Marine & Transit Insurance title and replace the description following it.
    // The description currently says " Secure your well-being with individual, family, and corporate health\nplans."
    const regex = /(Marine &amp; Transit Insurance\s*<\/span>\s*<\/h4>\s*<div class="service-two__desc">)\s*Secure your well-being with individual, family, and corporate health\s*plans\./g;
    
    const newHtml = html.replace(regex, `$1${correctText}`);
    
    if (html !== newHtml) {
        db.pages[key].html = newHtml;
        count++;
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
