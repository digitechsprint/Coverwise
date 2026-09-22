const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const targetText = 'Krishna Apra D Mall, F-136, 1st floor, Shakti Khand-II, Indirapuram, Ghaziabad, UP-201014';
const newMapLink = 'https://www.google.com/maps/search/?api=1&query=Krishna+Apra+D+Mall,+F-136,+1st+floor,+Shakti+Khand-II,+Indirapuram,+Ghaziabad,+UP-201014';

let count = 0;

for (let key in db.pages) {
    let html = db.pages[key].html;
    if (html.includes(targetText)) {
        // Find the <a href="..."> right before this text. 
        // We can do a regex replace
        const regex = new RegExp('<a\\s+href="[^"]*"([^>]*>\\s*<span[^>]*>\\s*<i[^>]*class="fas fa-map-marker-alt"[^>]*><\\/i>\\s*<\\/span>\\s*<span[^>]*>' + targetText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + ')', 'g');
        
        const newHtml = html.replace(regex, `<a href="${newMapLink}" target="_blank"$1`);
        if (html !== newHtml) {
            db.pages[key].html = newHtml;
            count++;
        }
    }
}

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log(`Updated ${count} pages`);
