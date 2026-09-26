const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const prodEnv = Object.fromEntries(
  fs.readFileSync('.env.production', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const supabase = createClient(prodEnv.NEXT_PUBLIC_SUPABASE_URL, prodEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('pages').select('slug, html');
  const re = /<a href="([^"]*)">\s*<span class="elementor-icon-list-text">Home<\/span>/g;
  for (const page of data) {
    let m;
    const re2 = new RegExp(re);
    let count = 0;
    while ((m = re2.exec(page.html))) {
      count++;
      console.log(page.slug, '| Home link #' + count, '-> href="' + m[1] + '"');
    }
    if (count === 0) console.log(page.slug, '| no footer Home link found');
  }
}

run();
