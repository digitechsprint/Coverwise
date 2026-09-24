require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const replacements = [
  [/tel:\+1\(307\)776-0608/g, 'tel:+919958806806'],
  [/tel:1-\(246\)333-0089/g, 'tel:+919958806806'],
  [/mailto:contact@example\.com/g, 'mailto:coverwise.imf@gmail.com'],
];

async function run() {
  const { data, error } = await supabase.from('pages').select('id, slug, html');
  if (error) { console.error('Fetch error:', error.message); process.exit(1); }

  const backup = {};
  const toUpdate = [];

  for (const page of data) {
    const original = page.html || '';
    let fixed = original;
    for (const [re, replacement] of replacements) {
      fixed = fixed.replace(re, replacement);
    }
    if (fixed !== original) {
      backup[page.slug] = original;
      toUpdate.push({ id: page.id, slug: page.slug, html: fixed });
    }
  }

  const backupPath = path.join(__dirname, 'scratch_live_html_backup.json');
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`Backed up original HTML for ${Object.keys(backup).length} pages to ${backupPath}`);

  for (const page of toUpdate) {
    const { error: updErr } = await supabase
      .from('pages')
      .update({ html: page.html, updated_at: new Date().toISOString() })
      .eq('id', page.id);
    if (updErr) {
      console.error(`  FAILED ${page.slug}:`, updErr.message);
    } else {
      console.log(`  Fixed ${page.slug}`);
    }
  }

  console.log(`\nDone. Updated ${toUpdate.length} pages.`);
}

run();
