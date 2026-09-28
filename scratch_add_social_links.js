const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

const OLD_INSTAGRAM_HREF = 'https://www.instagram.com/coverwise.imf/profilecard/?igsh=czlkeHdnNzRuZzk2';
const NEW_INSTAGRAM_HREF = 'https://www.instagram.com/coverwise.imf';

// Exact block as stored in the DB (tabs, not spaces) -- extracted programmatically
// from the real page HTML rather than hand-typed, so whitespace matches exactly.
const OLD_IG_BLOCK = '<a class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-e9775fc" href="' + OLD_INSTAGRAM_HREF + '" target="_blank">\n\t\t\t\t\t\t<span class="elementor-screen-only">Instagram</span>\n\t\t\t\t\t\t<i aria-hidden="true" class="fab fa-instagram"></i>\t\t\t\t\t</a>\n\t\t\t\t</span>';

const NEW_IG_BLOCK = '<a class="elementor-icon elementor-social-icon elementor-social-icon-instagram elementor-repeater-item-e9775fc" href="' + NEW_INSTAGRAM_HREF + '" target="_blank">\n\t\t\t\t\t\t<span class="elementor-screen-only">Instagram</span>\n\t\t\t\t\t\t<i aria-hidden="true" class="fab fa-instagram"></i>\t\t\t\t\t</a>\n\t\t\t\t</span>\n\t\t\t\t\t\t\t<span class="elementor-grid-item" role="listitem">\n\t\t\t\t\t<a class="elementor-icon elementor-social-icon elementor-social-icon-linkedin elementor-repeater-item-c4a2f81" href="https://www.linkedin.com/in/gaurav-agarwal-gi" target="_blank">\n\t\t\t\t\t\t<span class="elementor-screen-only">LinkedIn</span>\n\t\t\t\t\t\t<i aria-hidden="true" class="fab fa-linkedin-in"></i>\t\t\t\t\t</a>\n\t\t\t\t</span>';

function applyFix(html) {
  const before = html;
  const fixed = html.split(OLD_IG_BLOCK).join(NEW_IG_BLOCK);
  const linkedinCount = fixed.split('elementor-social-icon-linkedin').length - 1;
  return { fixed, changed: fixed !== before, linkedinCount };
}

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, slug, html');
  if (error) { console.error(envFile, error.message); return; }

  let totalPages = 0, totalLinkedin = 0;
  for (const page of data) {
    if (!page.html || !page.html.includes(OLD_IG_BLOCK)) continue;
    const { fixed, linkedinCount } = applyFix(page.html);
    const { error: updErr } = await supabase.from('pages').update({ html: fixed, updated_at: new Date().toISOString() }).eq('id', page.id);
    if (updErr) { console.error(envFile, page.slug, 'FAILED:', updErr.message); continue; }
    totalPages++;
    totalLinkedin += linkedinCount;
  }
  console.log(envFile, `updated ${totalPages} pages, ${totalLinkedin} LinkedIn icons now present`);
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');
}

run();
