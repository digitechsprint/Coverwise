const fs = require('fs');
const cssPath = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/post-157453.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/gaurav\.webp"\);background-position:bottom left;/g, 'gaurav.webp");background-position:top center;');

fs.writeFileSync(cssPath, css);
console.log("Replaced background position");
