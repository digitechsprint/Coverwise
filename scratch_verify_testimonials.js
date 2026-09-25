const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const prodEnv = Object.fromEntries(
  fs.readFileSync('.env.production', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const supabase = createClient(prodEnv.NEXT_PUBLIC_SUPABASE_URL, prodEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('pages').select('html').eq('slug', 'home').single();
  console.log('Rohit Sharma present:', data.html.includes('Rohit Sharma'));
  console.log('Kalyani present:', data.html.includes('>Kalyani<'));
  console.log('Mahesh Pal present:', data.html.includes('Mahesh Pal'));
  console.log('saurav sankrit present:', data.html.includes('saurav sankrit'));
}

run();
