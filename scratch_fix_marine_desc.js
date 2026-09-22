const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let count = 0;
const searchStr = 'Marine &amp; Transit Insurance';
const incorrectText = 'Secure your well-being with individual, family, and corporate health plans.';
const correctText = 'Protect your cargo, goods, and shipments against loss or damage during transit.';

for (let key in db.pages) {
    let html = db.pages[key].html;
    
    // We need to replace incorrectText ONLY in the block that belongs to Marine & Transit.
    // The easiest way is to use a regex that matches the title, some HTML, and then the text.
    
    const regex = new RegExp(`(Marine &amp; Transit Insurance\\s*<\\/span>\\s*<\\/h3>\\s*<div[^>]*>\\s*<p class="elementor-icon-box-description">\\s*)${incorrectText.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\$&')}`, 'g');
    
    const newHtml = html.replace(regex, `$1${correctText}`);
    
    if (html !== newHtml) {
        db.pages[key].html = newHtml;
        count++;
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
