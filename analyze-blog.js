const fs = require('fs');
const cheerio = require('cheerio');
const db = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));
const $ = cheerio.load(db.pages.blog.html);

$('a').each((i, el) => {
  const href = $(el).attr('href');
  if(href && href.includes('coverwise') && $(el).text().trim().length > 5) {
     console.log('Link:', href, 'Text:', $(el).text().trim());
  }
});
