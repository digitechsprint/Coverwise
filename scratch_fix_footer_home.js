const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

const RE = /<a href="#">(\s*)<span class="elementor-icon-list-text">Home<\/span>/g;
const REPLACEMENT = '<a href="/">$1<span class="elementor-icon-list-text">Home</span>';

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, slug, html');
  if (error) { console.error(envFile, error.message); return; }

  for (const page of data) {
    const fixed = page.html.replace(RE, REPLACEMENT);
    if (fixed !== page.html) {
      const { error: updErr } = await supabase.from('pages').update({ html: fixed, updated_at: new Date().toISOString() }).eq('id', page.id);
      console.log(envFile, page.slug, updErr ? 'FAILED: ' + updErr.message : 'fixed');
    }
  }
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');

  // Local pages.json fallback too
  const db = JSON.parse(fs.readFileSync('data/pages.json', 'utf8'));
  let changed = 0;
  for (const page of Object.values(db.pages)) {
    const fixed = page.html.replace(RE, REPLACEMENT);
    if (fixed !== page.html) { page.html = fixed; changed++; }
  }
  fs.writeFileSync('data/pages.json', JSON.stringify(db, null, 2));
  console.log('local pages.json: fixed', changed, 'pages');
}

run();
