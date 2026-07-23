const fs = require('fs');
const cheerio = require('cheerio');
const $ = cheerio.load(fs.readFileSync('../Cover Wise/coverwiseimf.com/our-portfolio/index.html', 'utf8'));
console.log($('body').attr('class'));
