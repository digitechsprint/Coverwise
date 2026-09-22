const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const home = db.pages['home'].html;
const matches = home.match(/<a[^>]+>Contact(?: Us)?<\/a>/gi);
console.log("Matches exactly 'Contact Us' or 'Contact':");
console.log(matches);

const hrefs = home.match(/href="([^"]*contact[^"]*)"/gi);
console.log("Hrefs containing 'contact':");
console.log(hrefs);
