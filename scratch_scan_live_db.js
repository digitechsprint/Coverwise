require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const patterns = [
  { name: 'tel:+1(307)776-0608', re: /tel:\+1\(307\)776-0608/g },
  { name: 'tel:1-(246)333-0089', re: /tel:1-\(246\)333-0089/g },
  { name: 'mailto:contact@example.com', re: /mailto:contact@example\.com/g },
];

async function run() {
  const { data, error } = await supabase.from('pages').select('slug, html');
  if (error) {
    console.error('Error fetching pages:', error.message);
    process.exit(1);
  }
  console.log(`Fetched ${data.length} pages from live Supabase DB.\n`);
  for (const page of data) {
    const html = page.html || '';
    const hits = patterns
      .filter(p => p.re.test(html))
      .map(p => p.name);
    if (hits.length) {
      console.log(`${page.slug}: ${hits.join(', ')}`);
    }
  }
}

run();
