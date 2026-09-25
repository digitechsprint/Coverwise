const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const localEnv = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const supabase = createClient(localEnv.NEXT_PUBLIC_SUPABASE_URL, localEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.from('pages').select('html, updated_at').eq('slug', 'home').single();
  if (error) { console.error(error.message); return; }
  console.log('updated_at:', data.updated_at);
  console.log('Rohit Sharma present:', data.html.includes('Rohit Sharma'));
  console.log('Kalyani present:', data.html.includes('>Kalyani<'));
}

run();
