const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

function fixHtml(html, slug) {
  let out = html;

  // 1. "Call experts" widget phone number isn't a tel: link, on every page.
  out = out.replace(
    /(<p class="elementor-icon-box-description">\s*)\+91-9958806806(\s*<\/p>)/g,
    '$1<a href="tel:+919958806806">+91-9958806806</a>$2'
  );

  // 2. Leftover theme-demo links (gaviaspreview.com) pointing off-site.
  out = out.replace(/https:\/\/gaviaspreview\.com\/wp\/modins\/contact\//g, '/contact');
  out = out.replace(/https:\/\/gaviaspreview\.com\/wp\/modins\/get-a-quote\//g, '/get-a-quote');
  if (slug === 'get-a-quote') {
    out = out.replace(/https:\/\/gaviaspreview\.com\/wp\/modins\/insurance\/[a-z-]+\//g, '#quote-form');
  }

  return out;
}

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, slug, html');
  if (error) { console.error(envFile, error.message); return; }

  for (const page of data) {
    const fixed = fixHtml(page.html, page.slug);
    if (fixed !== page.html) {
      const { error: updErr } = await supabase.from('pages').update({ html: fixed, updated_at: new Date().toISOString() }).eq('id', page.id);
      console.log(envFile, page.slug, updErr ? 'FAILED: ' + updErr.message : 'updated');
    }
  }
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');
}

run();
