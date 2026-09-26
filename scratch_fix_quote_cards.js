const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

const DESCRIPTIONS = {
  'd833a49': 'Reliable coverage that protects your vehicle on every drive.',
  'b50c52e': 'Financial protection and peace of mind for your family.',
  '2c50c28': "Safeguard your home and belongings against life's uncertainties.",
  'c492c79': 'Quality healthcare coverage for you and your loved ones.',
  '15d2df9': 'Tailored protection to keep your business risk-free and secure.',
};

function fixHtml(html) {
  let out = html;

  // Replace each card's Lorem Ipsum with a real, distinct description.
  for (const [repeaterId, desc] of Object.entries(DESCRIPTIONS)) {
    const re = new RegExp(
      `(elementor-repeater-item-${repeaterId}"[\\s\\S]{0,300}?<div class="iconbox-one__desc">)Lorem ipsum is simply sit of free text dolor\\.(</div>)`
    );
    out = out.replace(re, `$1${desc}$2`);
  }

  // The overlay links use target="_blank" on a same-page #quote-form anchor,
  // which opens a blank new tab instead of scrolling -- looks like the card
  // does nothing. Drop the target/rel so it navigates in the same tab.
  out = out.replace(
    /(<a href="#quote-form" class="iconbox-one__link-overlay") target="_blank" rel="noopener"(>)/g,
    '$1$2'
  );

  return out;
}

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, html').eq('slug', 'get-a-quote').single();
  if (error) { console.error(envFile, error.message); return; }

  const fixed = fixHtml(data.html);
  if (fixed !== data.html) {
    const { error: updErr } = await supabase.from('pages').update({ html: fixed, updated_at: new Date().toISOString() }).eq('id', data.id);
    console.log(envFile, updErr ? 'FAILED: ' + updErr.message : 'fixed');
  } else {
    console.log(envFile, 'no changes matched');
  }
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');
}

run();
