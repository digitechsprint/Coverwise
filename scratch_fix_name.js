const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let count = 0;

for (let key in db.pages) {
    let html = db.pages[key].html;
    let newHtml = html;
    
    // Replace different variations of the name
    newHtml = newHtml.replace(/Gourav Aggarwal/gi, 'Gaurav Agarwal');
    newHtml = newHtml.replace(/Gourav Agarwal/gi, 'Gaurav Agarwal');
    newHtml = newHtml.replace(/Gaurav Aggarwal/gi, 'Gaurav Agarwal');
    
    if (html !== newHtml) {
        db.pages[key].html = newHtml;
        count++;
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
