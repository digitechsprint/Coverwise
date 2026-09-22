const fs = require('fs');
const cssPath = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/post-234c7b.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/Why-Choose-Coverwise-copy\.webp"\);background-position:bottom left;/g, 'Why-Choose-Coverwise-copy.webp");background-position:center center;');

fs.writeFileSync(cssPath, css);
console.log("Replaced background position");
