const fs = require('fs');
const db = JSON.parse(fs.readFileSync('c:/Users/akkik/Coverwise/data/pages.json', 'utf8'));
const page = db.pages['our-portfolio'];
if (!page) {
    console.log("No our-portfolio page found in db!");
    process.exit(1);
}

const html = page.html;

// Find all src="..." for images
const imgMatches = [...html.matchAll(/src="([^"]+\.(?:jpg|jpeg|png|webp|gif))"/gi)].map(m => m[1]);
console.log("Images found in HTML src:", [...new Set(imgMatches)]);

// Find all background-image:url(...) in the HTML
const bgMatches = [...html.matchAll(/background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/gi)].map(m => m[2]);
console.log("Images found in HTML inline backgrounds:", [...new Set(bgMatches)]);

// Find the Elementor CSS files for our-portfolio
const cssLinks = [...html.matchAll(/href="([^"]*post-\d+\.css)"/gi)].map(m => m[1]);
console.log("CSS files:", cssLinks);
