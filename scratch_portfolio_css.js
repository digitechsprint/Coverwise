const fs = require('fs');
const cssPath = 'c:/Users/akkik/Coverwise/public/wp-content/uploads/elementor/css/post-1364.css';
if(fs.existsSync(cssPath)) {
    const css = fs.readFileSync(cssPath, 'utf8');
    const bgMatches = [...css.matchAll(/background-image\s*:\s*url\((['"]?)([^'")]+)\1\)/gi)].map(m => m[2]);
    console.log(bgMatches);
} else {
    console.log('post-1364.css not found');
}
