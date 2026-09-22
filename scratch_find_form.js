const fs = require('fs');
const path = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(path, 'utf8'));

const p = Object.values(db.pages).find(p => p.slug === 'get-a-quote');
if (p) {
  // Find the index of "Get an insurance" and print 500 characters before it
  const idx = p.html.indexOf("Get an insurance");
  if (idx > -1) {
    console.log(p.html.substring(Math.max(0, idx - 500), idx + 100));
  } else {
    console.log("Text not found");
  }
}
