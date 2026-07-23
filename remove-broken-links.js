const fs = require('fs');
let c = fs.readFileSync('src/app/(frontend)/layout.js', 'utf8');

c = c.replace(/<link rel="stylesheet" id="elementor-gf-local-roboto-css".*?>\n/g, '');
c = c.replace(/<link rel="stylesheet" id="elementor-gf-local-robotoslab-css".*?>\n/g, '');
c = c.replace(/<link rel="stylesheet" id="elementor-gf-local-montserrat-css".*?>\n/g, '');
c = c.replace(/<script type="text\/javascript" src="\/wp-includes\/js\/wp-emoji-release\.min\.js\?.*?"><\/script>\n/g, '');

fs.writeFileSync('src/app/(frontend)/layout.js', c);
