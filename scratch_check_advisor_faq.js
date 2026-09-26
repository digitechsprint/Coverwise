const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const prodEnv = Object.fromEntries(
  fs.readFileSync('.env.production', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const supabase = createClient(prodEnv.NEXT_PUBLIC_SUPABASE_URL, prodEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function run() {
  const { data } = await supabase.from('pages').select('html').eq('slug', 'home').single();
  const idx = data.html.indexOf('Talk to an Advisor');
  console.log('=== Talk to an Advisor context ===');
  console.log(data.html.slice(Math.max(0, idx - 600), idx + 100));

  const faqIdx = data.html.indexOf('Frequently Asked Questions');
  console.log('\n=== FAQ section context ===');
  console.log(data.html.slice(faqIdx, faqIdx + 2500));
}

run();
