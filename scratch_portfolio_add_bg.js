const fs = require('fs');
const cssPath = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/post-1364ca92.css';
let css = fs.readFileSync(cssPath, 'utf8');

const targetStr = '{background-position:top center;background-repeat:no-repeat;background-size:cover;}.elementor-1364 .elementor-element.elementor-element-a57fffd > .elementor-element-populated';
const replacementStr = '{background-image:url("../../2023/01/client-success.png");background-position:top center;background-repeat:no-repeat;background-size:cover;}.elementor-1364 .elementor-element.elementor-element-a57fffd > .elementor-element-populated';

css = css.replace(targetStr, replacementStr);
fs.writeFileSync(cssPath, css);
console.log("Updated CSS successfully");
