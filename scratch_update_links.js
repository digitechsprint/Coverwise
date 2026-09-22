const fs = require('fs');
const path = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(path, 'utf8'));

let replacedCount = 0;

for (const key in db.pages) {
  let html = db.pages[key].html;
  
  // Replace links that end with /get-a-quote/ or similar
  const updatedHtml = html.replace(/href="[^"]*\/get-a-quote\/"/gi, 'href="/get-a-quote"');
  
  // Also look for exact text "Get a Quote Today" anchor tag and force its href
  const finalHtml = updatedHtml.replace(/href="([^"]+)"([^>]*)>Get a Quote Today<\/a>/gi, 'href="/get-a-quote"$2>Get a Quote Today</a>');

  if (html !== finalHtml) {
    db.pages[key].html = finalHtml;
    replacedCount++;
  }
}

fs.writeFileSync(path, JSON.stringify(db, null, 2));
console.log("Pages updated:", replacedCount);
