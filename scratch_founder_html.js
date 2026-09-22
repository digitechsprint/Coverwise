const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['home'].html;

const idx = html.toLowerCase().indexOf('meet our founder');
if (idx > -1) {
  // get a large chunk of HTML around this section
  const chunk = html.substring(Math.max(0, idx - 1000), idx + 3000);
  console.log(chunk);
} else {
  console.log("not found");
}
