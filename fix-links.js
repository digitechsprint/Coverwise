const fs = require('fs');
const path = require('path');

function removeIndexHtml(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace links like "about/index.html" with "/about"
  // And "index.html" with "/"
  content = content.replace(/(href)=['"]\/?([^'"]*?)\/?index\.html['"]/gi, (match, p1, p2) => {
    return p2 ? 'href="/' + p2 + '"' : 'href="/"';
  });
  
  fs.writeFileSync(filePath, content);
}

removeIndexHtml(path.join(__dirname, 'src/app/layout.js'));
removeIndexHtml(path.join(__dirname, 'src/app/page.js'));
removeIndexHtml(path.join(__dirname, 'src/app/about/page.js'));

console.log('Fixed .html links');
