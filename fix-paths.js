const fs = require('fs');
const path = require('path');

const layoutPath = path.join(__dirname, 'src/app/layout.js');
const pagePath = path.join(__dirname, 'src/app/page.js');

let layout = fs.readFileSync(layoutPath, 'utf-8');
layout = layout.replace(/(href|src)=['"](wp-content\/.*?|wp-includes\/.*?)['"]/g, '$1="/$2"');
fs.writeFileSync(layoutPath, layout);

let page = fs.readFileSync(pagePath, 'utf-8');
page = page.replace(/(href|src)=['"](wp-content\/.*?|wp-includes\/.*?)['"]/g, '$1="/$2"');
fs.writeFileSync(pagePath, page);
console.log('Fixed paths');
