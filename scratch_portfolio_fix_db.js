const fs = require('fs');
const dbPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

let html = db.pages['our-portfolio'].html;

// Replace .html with .png for the specific images
html = html.replace(/slider-image-31\.html/g, 'slider-image-31.png');
html = html.replace(/service-02\.html/g, 'service-02.png');
html = html.replace(/service-03\.html/g, 'service-03.png');
html = html.replace(/service-04\.html/g, 'service-04.png');

db.pages['our-portfolio'].html = html;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Database updated successfully");
