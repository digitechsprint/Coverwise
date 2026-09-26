const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, html').eq('slug', 'our-portfolio').single();
  if (error) { console.error(envFile, error.message); return; }

  let html = data.html;
  const before = html;

  // Hide the now-empty decorative column (its only content was the deleted client-success.png background)
  html = html.replace(
    '<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a57fffd" data-id="a57fffd" data-element_type="column" data-e-type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">',
    '<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-a57fffd" data-id="a57fffd" data-element_type="column" data-e-type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}" style="display:none">'
  );

  // Let the text column take the full width
  html = html.replace(
    '<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-2afbc45" data-id="2afbc45" data-element_type="column" data-e-type="column">',
    '<div class="elementor-column elementor-col-50 elementor-top-column elementor-element elementor-element-2afbc45" data-id="2afbc45" data-element_type="column" data-e-type="column" style="width:100%;max-width:100%;flex-basis:100%">'
  );

  if (html !== before) {
    const { error: updErr } = await supabase.from('pages').update({ html, updated_at: new Date().toISOString() }).eq('id', data.id);
    console.log(envFile, updErr ? 'FAILED: ' + updErr.message : 'layout fixed');
  } else {
    console.log(envFile, 'no match found, nothing changed');
  }
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');
}

run();
