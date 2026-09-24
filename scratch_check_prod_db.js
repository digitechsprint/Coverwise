const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const prodEnv = Object.fromEntries(
  fs.readFileSync('.env.production', 'utf8')
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
);

const supabase = createClient(
  prodEnv.NEXT_PUBLIC_SUPABASE_URL,
  prodEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function run() {
  const { data, error } = await supabase.from('pages').select('slug, html').eq('slug', 'our-services').single();
  if (error) {
    console.error('Error (RLS may block anon reads):', error.message);
    return;
  }
  console.log('our-services contains 307 number:', data.html.includes('tel:+1(307)776-0608'));
  console.log('our-services contains example.com mailto:', data.html.includes('mailto:contact@example.com'));
}

run();
