const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

const NEW_TITLE = 'Insurance Advisor in Indirapuram, Ghaziabad | Coverwise IMF LLP';

async function fix(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, title').eq('slug', 'home').single();
  if (error) { console.error(envFile, error.message); return; }

  const { error: updErr } = await supabase.from('pages').update({ title: NEW_TITLE, updated_at: new Date().toISOString() }).eq('id', data.id);
  console.log(envFile, updErr ? 'FAILED: ' + updErr.message : `title updated (was "${data.title}")`);
}

(async () => {
  await fix('.env.production', '.env.production.local');
  await fix('.env.local');
})();
