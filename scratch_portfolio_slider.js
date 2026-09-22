const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['our-portfolio'].html;

const idx = html.indexOf('slider-image-31.html');
if (idx > -1) {
    console.log(html.substring(Math.max(0, idx - 1000), idx + 1000));
} else {
    console.log("Section not found");
}
