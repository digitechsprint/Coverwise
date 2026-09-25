const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const prodEnv = Object.fromEntries(
  fs.readFileSync('.env.production', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const prodLocal = Object.fromEntries(
  fs.readFileSync('.env.production.local', 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
);
const supabase = createClient(prodEnv.NEXT_PUBLIC_SUPABASE_URL, prodLocal.SUPABASE_SERVICE_ROLE_KEY);
const newBlock = fs.readFileSync('scratch_real_testimonials_block.html', 'utf8');

async function run() {
  const { data, error } = await supabase.from('pages').select('id, html').eq('slug', 'home').single();
  if (error) { console.error(error.message); return; }
  const start = data.html.indexOf('<div class="gsc-testimonial');
  const marker = '<div class="swiper-pagination"></div>   </div>';
  const markerIdx = data.html.indexOf(marker, start);
  if (start === -1 || markerIdx === -1) { console.error('markers not found in production html'); return; }
  const end = markerIdx + marker.length;
  const oldBlock = data.html.slice(start, end);
  console.log('Old block length:', oldBlock.length, 'contains Rohit Sharma:', oldBlock.includes('Rohit Sharma'));

  const html = data.html.slice(0, start) + newBlock + data.html.slice(end);
  fs.writeFileSync('scratch_prod_home_before_testimonial_swap.html', data.html);

  const { error: updErr } = await supabase.from('pages').update({ html, updated_at: new Date().toISOString() }).eq('id', data.id);
  console.log(updErr ? 'FAILED: ' + updErr.message : 'Testimonials swapped in production DB');
}

run();
