const fs = require('fs');
const path = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(path, 'utf8'));

let replacedCount = 0;

for (const key in db.pages) {
  let html = db.pages[key].html;
  
  const finalHtml = html.replace(/href="\/get-a-quote"\s+target="_blank"\s+rel="noopener"/gi, 'href="/get-a-quote"');

  if (html !== finalHtml) {
    db.pages[key].html = finalHtml;
    replacedCount++;
  }
}

fs.writeFileSync(path, JSON.stringify(db, null, 2));
console.log("Pages updated to remove target _blank:", replacedCount);
