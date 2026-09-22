const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let count = 0;

for (let key in db.pages) {
    let html = db.pages[key].html;
    
    // We want to replace `<a href="#">` with `<a href="/">` ONLY when it is followed by `<span class="elementor-icon-list-text">Home</span>`
    // It looks like:
    // <a href="#">
    // 
    // <span class="elementor-icon-list-text">Home</span>
    // </a>
    
    const regex = /<a\s+href="#"([^>]*)>\s*<span\s+class="elementor-icon-list-text">Home<\/span>\s*<\/a>/g;
    
    const newHtml = html.replace(regex, '<a href="/"$1>\n\t\t\t\t\t\t\t\t\t\t\t<span class="elementor-icon-list-text">Home</span>\n\t\t\t\t\t\t\t\t\t\t\t</a>');
    
    if (html !== newHtml) {
        db.pages[key].html = newHtml;
        count++;
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
