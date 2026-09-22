const fs = require('fs');
const cssPath = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/post-3070d2.css';
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace('margin-bottom:-50px;', 'margin-bottom:40px;');
fs.writeFileSync(cssPath, css);
console.log("Updated margin-bottom");
