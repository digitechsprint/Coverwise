const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

const START_MARKER = '<style>\n\t\t\t:root {';
const END_MARKER = '/*]]>*/\n\t\t</script>';

function stripBlock(html) {
  const start = html.indexOf(START_MARKER);
  if (start === -1) return { html, removed: false };
  const end = html.indexOf(END_MARKER, start);
  if (end === -1) return { html, removed: false };
  const block = html.slice(start, end + END_MARKER.length);
  if (!block.includes('document.oncontextmenu')) return { html, removed: false };
  return { html: html.slice(0, start) + html.slice(end + END_MARKER.length), removed: true };
}

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, slug, html');
  if (error) { console.error(envFile, error.message); return; }

  let count = 0;
  for (const page of data) {
    if (!page.html) continue;
    const { html: fixed, removed } = stripBlock(page.html);
    if (!removed) continue;
    const { error: updErr } = await supabase.from('pages').update({ html: fixed, updated_at: new Date().toISOString() }).eq('id', page.id);
    if (updErr) { console.error(envFile, page.slug, 'FAILED:', updErr.message); continue; }
    count++;
  }
  console.log(envFile, `removed right-click/drag block from ${count} pages`);
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');
}

run();
