const fs = require('fs');
const l = fs.readFileSync('src/app/layout.js', 'utf8');
const p = fs.readFileSync('src/app/page.js', 'utf8');
const p2 = fs.readFileSync('src/app/our-portfolio/page.js', 'utf8');
console.log('layout js relative paths:', l.match(/src=['"](?!http|\/)[^'"]+['"]/g));
console.log('layout css relative paths:', l.match(/href=['"](?!http|\/)[^'"]+\.css[^'"]*['"]/g));
