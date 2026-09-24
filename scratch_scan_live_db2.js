require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const suspicious = (href) => {
  if (!href) return false;
  const h = href.toLowerCase().trim();
  if (h === '#' || h === '') return false; // toggle anchors, ignore
  if (h.startsWith('javascript:')) return true;
  if (h.includes('example.com')) return true;
  if (h.includes('yourdomain')) return true;
  if (h.includes('yoursite')) return true;
  if (h.includes('yourpage')) return true;
  if (h.includes('placeholder')) return true;
  if (h.includes('lorem')) return true;
  if (h.startsWith('http://localhost')) return true;
  if (h.startsWith('tel:') && !h.includes('919958806806')) return true;
  if (h.startsWith('mailto:') && !h.includes('coverwise')) return true;
  return false;
};

async function run() {
  const { data, error } = await supabase.from('pages').select('slug, html');
  if (error) { console.error(error.message); process.exit(1); }

  const hrefRe = /href="([^"]*)"/g;
  const bySlug = {};
  for (const page of data) {
    const html = page.html || '';
    let m;
    const seen = new Set();
    while ((m = hrefRe.exec(html))) {
      const href = m[1];
      if (suspicious(href) && !seen.has(href)) {
        seen.add(href);
        (bySlug[page.slug] = bySlug[page.slug] || []).push(href);
      }
    }
  }
  console.log(JSON.stringify(bySlug, null, 2));
}

run();
