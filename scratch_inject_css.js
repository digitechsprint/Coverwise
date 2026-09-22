const fs = require('fs');
const path = require('path');

const pagesPath = 'c:/Users/akkik/Coverwise/data/pages.json';
const db = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));

const cssDir = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/';
const cssFiles = fs.readdirSync(cssDir);

let updatedCount = 0;

for (const slug in db.pages) {
  const page = db.pages[slug];
  let html = page.html;
  
  // Find all elementor IDs in the HTML
  const regex = /elementor-(\d+)/g;
  let match;
  const ids = new Set();
  
  while ((match = regex.exec(html)) !== null) {
    ids.add(match[1]);
  }
  
  let linksToInject = '';
  
  ids.forEach(id => {
    // Find matching CSS file in directory (e.g. post-43.css or post-43abcd.css)
    const matchingFile = cssFiles.find(f => {
      // Must start with post-{id} and either have .css immediately or a hash then .css
      return f.startsWith(`post-${id}.css`) || f.match(new RegExp(`^post-${id}[a-z0-9]*\\.css$`));
    });
    
    if (matchingFile) {
      const linkTag = `<link rel="stylesheet" href="/wp-content/uploads/elementor/css/${matchingFile}" />`;
      if (!html.includes(linkTag)) {
        linksToInject += linkTag + '\n';
      }
    }
  });
  
  if (linksToInject) {
    page.html = linksToInject + html;
    updatedCount++;
  }
}

fs.writeFileSync(pagesPath, JSON.stringify(db, null, 2));
console.log("Pages updated with CSS links:", updatedCount);
