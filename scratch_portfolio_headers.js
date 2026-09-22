const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['our-portfolio'].html;

console.log("Length:", html.length);
const headers = html.match(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi);
console.log("Headers:");
if (headers) {
    headers.forEach(h => console.log(h.replace(/<[^>]+>/g, '').trim()));
}
