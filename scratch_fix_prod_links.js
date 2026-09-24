// Run this against the PRODUCTION Supabase project (xyhfxskxvrjkfpnrsjhu.supabase.co).
//
// Setup:
//   1. Get the service_role key from Supabase dashboard -> this project ->
//      Project Settings -> API -> service_role secret
//      (or Vercel -> Project Settings -> Environment Variables -> SUPABASE_SERVICE_ROLE_KEY,
//      Production scope).
//   2. Create a file named .env.production.local in the project root (gitignored)
//      with one line:
//        SUPABASE_SERVICE_ROLE_KEY=paste-the-key-here
//   3. Run:  node scratch_fix_prod_links.js
//
// It backs up every changed page's current HTML to
// scratch_prod_html_backup.json before writing anything.

require('dotenv').config({ path: '.env.production' });
require('dotenv').config({ path: '.env.production.local', override: true });

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Add SUPABASE_SERVICE_ROLE_KEY to .env.production.local (see comment at top of this file).');
  process.exit(1);
}

console.log('Target Supabase project:', supabaseUrl);
if (!supabaseUrl.includes('xyhfxskxvrjkfpnrsjhu')) {
  console.error('This URL does not look like the production project (xyhfxskxvrjkfpnrsjhu.supabase.co). Aborting.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

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

  const backupPath = path.join(__dirname, 'scratch_prod_html_backup.json');
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
