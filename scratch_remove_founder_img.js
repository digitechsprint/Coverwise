const fs = require('fs');
const cssPath = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/post-157453.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/background-image:url\([^)]*gaurav\.webp[^)]*\);/g, '');

fs.writeFileSync(cssPath, css);
console.log("Removed background image");
