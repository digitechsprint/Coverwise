const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

function loadEnv(file) {
  return Object.fromEntries(
    fs.readFileSync(file, 'utf8').split('\n').filter(l => l.includes('=')).map(l => l.split('=').map(s => s.trim()))
  );
}

const OLD = `<div class="elementor-element elementor-element-88a53e7 elementor-widget elementor-widget-spacer" data-id="88a53e7" data-element_type="widget" data-e-type="widget" data-widget_type="spacer.default">
				<div class="elementor-widget-container">
							<div class="elementor-spacer">
			<div class="elementor-spacer-inner"></div>
		</div>
						</div>
				</div>`;

const NEW = `<div class="elementor-element elementor-widget elementor-widget-gva-image-content" data-element_type="widget" data-e-type="widget" data-widget_type="gva-image-content.default">
				<div class="elementor-widget-container">
					<div class="gva-element-gva-image-content gva-element">
	<div class="about-seven__single">
	  	<div class="about-seven__content"><div class="about-seven__image">
			<img decoding="async" src="/wp-content/uploads/2025/04/Gaurav-Agarwal-Founder.webp" alt="Gaurav Agarwal - Founder of Coverwise IMF LLP">
	  	</div></div>
	</div>
</div>				</div>
				</div>`;

async function fixProject(envFile, keyFile) {
  const env = loadEnv(envFile);
  const serviceKey = keyFile ? loadEnv(keyFile).SUPABASE_SERVICE_ROLE_KEY : env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceKey);

  const { data, error } = await supabase.from('pages').select('id, html').eq('slug', 'home').single();
  if (error) { console.error(envFile, error.message); return; }

  if (!data.html.includes(OLD)) {
    console.log(envFile, 'no exact match found');
    return;
  }
  const fixed = data.html.replace(OLD, NEW);
  const { error: updErr } = await supabase.from('pages').update({ html: fixed, updated_at: new Date().toISOString() }).eq('id', data.id);
  console.log(envFile, updErr ? 'FAILED: ' + updErr.message : 'founder photo added');
}

async function run() {
  await fixProject('.env.production', '.env.production.local');
  await fixProject('.env.local');
}

run();
