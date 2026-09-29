const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

const FIXES = {
  home: 'Compare motor, health and business insurance with Coverwise IMF LLP in Indirapuram, Ghaziabad. Get expert assistance for policy selection, renewals and claims.',
  about: 'COVERWISE IMF LLP offers trusted insurance and wealth management solutions, focused on transparency, integrity, and client satisfaction.',
};

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  for (const [slug, description] of Object.entries(FIXES)) {
    const { data, error } = await supabase.from('pages').select('id, description').eq('slug', slug).single();
    if (error) { console.error(envFile, slug, error.message); continue; }
    const { error: updErr } = await supabase.from('pages').update({ description, updated_at: new Date().toISOString() }).eq('id', data.id);
    console.log(envFile, slug, updErr ? 'FAILED: ' + updErr.message : `updated (was "${data.description}")`);
  }
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');
}

run();
