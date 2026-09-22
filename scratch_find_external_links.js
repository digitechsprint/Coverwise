const fs = require('fs');
const path = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(path, 'utf8'));

// Go through all service pages and extract missing images/css
const serviceSlugs = Object.keys(db.pages).filter(k => k.includes('insurance'));
let foundLinks = new Set();

serviceSlugs.forEach(slug => {
  const html = db.pages[slug].html;
  // match background-image: url(...)
  let bgMatches = html.match(/url\(['"]?(http[^'")]+)['"]?\)/gi) || [];
  bgMatches.forEach(m => foundLinks.add(m));
  
  // match img src
  let imgMatches = html.match(/src=['"](http[^'"]+)['"]/gi) || [];
  imgMatches.forEach(m => foundLinks.add(m));
});

console.log(Array.from(foundLinks).filter(link => link.includes('gaviaspreview.com') || link.includes('demo')));
