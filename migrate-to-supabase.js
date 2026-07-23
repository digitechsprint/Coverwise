require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Reading data/pages.json...");
  const dbPath = path.join(__dirname, 'data', 'pages.json');
  if (!fs.existsSync(dbPath)) {
    console.error("data/pages.json not found!");
    return;
  }

  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const pages = Object.values(db.pages);

  console.log(`Found ${pages.length} pages to migrate.`);

  for (const page of pages) {
    console.log(`Uploading ${page.slug}...`);
    
    // Check if it exists first to avoid unique constraint errors on retry
    const { data: existing } = await supabase.from('pages').select('id').eq('slug', page.slug).single();
    
    if (existing) {
      console.log(`  Updating existing page ${page.slug}...`);
      const { error } = await supabase.from('pages').update({
        title: page.title || '',
        description: page.description || '',
        body_class: page.bodyClass || '',
        html: page.html || ''
      }).eq('id', existing.id);
      
      if (error) console.error(`  Error updating ${page.slug}:`, error.message);
    } else {
      console.log(`  Inserting new page ${page.slug}...`);
      const { error } = await supabase.from('pages').insert({
        slug: page.slug,
        title: page.title || '',
        description: page.description || '',
        body_class: page.bodyClass || '',
        html: page.html || ''
      });
      
      if (error) console.error(`  Error inserting ${page.slug}:`, error.message);
    }
  }

  console.log("Migration complete!");
}

run();
