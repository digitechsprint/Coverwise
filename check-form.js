const cheerio = require('cheerio');
const db = require('./data/pages.json');
const $ = cheerio.load(db.pages.contact.html);
console.log($('form').attr('class'));
