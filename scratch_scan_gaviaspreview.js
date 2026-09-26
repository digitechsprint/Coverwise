const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const prodEnv = Object.fromEntries(
  fs.readFileSync('.env.production', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const supabase = createClient(prodEnv.NEXT_PUBLIC_SUPABASE_URL, prodEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data: pages } = await supabase.from('pages').select('slug, html');
  const { data: blogs } = await supabase.from('blogs').select('slug, content_html');
  const docs = [...pages.map(p => ({ slug: p.slug, html: p.html })), ...blogs.map(b => ({ slug: b.slug, html: b.content_html }))];

  const re = /href="(https?:\/\/gaviaspreview\.com[^"]*)"/g;
  for (const doc of docs) {
    let m;
    const re2 = new RegExp(re);
    while ((m = re2.exec(doc.html))) {
      console.log(doc.slug, '->', m[1]);
    }
  }
}

run();
