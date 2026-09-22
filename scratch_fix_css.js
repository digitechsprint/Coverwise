const fs = require('fs');
const cssPath = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/post-157453.css';
let css = fs.readFileSync(cssPath, 'utf8');

// Replace the bad Gaurav URL with the new gaurav.webp image
css = css.replace(/Gaurav-Aggarwal-[^\"]+?\.html/g, 'gaurav.webp');
fs.writeFileSync(cssPath, css);
console.log("CSS fixed successfully.");
