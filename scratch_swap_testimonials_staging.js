const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const localEnv = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const supabase = createClient(localEnv.NEXT_PUBLIC_SUPABASE_URL, localEnv.SUPABASE_SERVICE_ROLE_KEY);
const newBlock = fs.readFileSync('scratch_real_testimonials_block.html', 'utf8');

async function run() {
  const { data, error } = await supabase.from('pages').select('id, html').eq('slug', 'home').single();
  if (error) { console.error(error.message); return; }
  const start = data.html.indexOf('<div class="gsc-testimonial');
  const marker = '<div class="swiper-pagination"></div>   </div>';
  const markerIdx = data.html.indexOf(marker, start);
  if (start === -1 || markerIdx === -1) { console.error('markers not found in staging html'); return; }
  const end = markerIdx + marker.length;
  const html = data.html.slice(0, start) + newBlock + data.html.slice(end);
  const { error: updErr } = await supabase.from('pages').update({ html, updated_at: new Date().toISOString() }).eq('id', data.id);
  console.log(updErr ? 'FAILED: ' + updErr.message : 'Testimonials swapped in staging DB');
}

run();
