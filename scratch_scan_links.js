const fs = require('fs');
const raw = fs.readFileSync('data/pages.json', 'utf8');
const db = JSON.parse(raw);

const hrefRe = /href=\\"([^\\"]*)\\"/g;
const bySlugIssues = {};

const suspicious = (href) => {
  if (!href) return false;
  const h = href.toLowerCase();
  if (h.includes('example.com')) return true;
  if (h.includes('246') && h.includes('333')) return true;
  if (h.includes('307') && h.includes('776')) return true;
  if (h.includes('yourdomain')) return true;
  if (h.includes('yoursite')) return true;
  if (h.includes('facebook.com/yourpage')) return true;
  if (h === '#' ) return true;
  if (h.startsWith('http://localhost')) return true;
  if (h.includes('placeholder')) return true;
  return false;
};

for (const page of Object.values(db.pages)) {
  const html = page.html || '';
  let m;
  const re = /href="([^"]*)"/g;
  const seen = new Set();
  while ((m = re.exec(html))) {
    const href = m[1];
    if (suspicious(href) && !seen.has(href)) {
      seen.add(href);
      (bySlugIssues[page.slug] = bySlugIssues[page.slug] || []).push(href);
    }
  }
}

console.log(JSON.stringify(bySlugIssues, null, 2));
