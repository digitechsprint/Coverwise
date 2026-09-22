const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const html = db.pages['our-portfolio'].html;

const matches = html.match(/<div class="service-two__single[\s\S]*?<\/h4>[\s\S]*?<\/div><\/div><\/div>/g);
if (matches) {
    console.log(`Found ${matches.length} items`);
    matches.forEach((m, i) => {
        console.log(`--- Item ${i+1} ---`);
        console.log(m.substring(0, 500));
    });
} else {
    console.log("None found");
}
