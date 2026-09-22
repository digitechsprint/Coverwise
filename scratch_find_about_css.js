const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const about = db.pages['about-us'] ? db.pages['about-us'] : db.pages['about'];
const links = about.html.match(/href="([^"]*post-\d+\.css)"/g);
console.log("CSS files:", links);

// Find the ID of the about page itself to search for it in elementor CSS
console.log("About page class:", about.bodyClass.match(/elementor-page-\d+/));
console.log("About page body class elementor:", about.html.match(/elementor-\d+/g).slice(0, 5));
