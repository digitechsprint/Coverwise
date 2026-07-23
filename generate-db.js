const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const pagesToConvert = [
  { source: '', slug: 'home' },
  { source: 'about', slug: 'about' },
  { source: 'our-portfolio', slug: 'our-portfolio' },
  { source: 'contact', slug: 'contact' },
  { source: 'blog', slug: 'blog' },
  { source: 'our-services', slug: 'our-services' },
  { source: 'health-insurance', slug: 'health-insurance' },
  { source: 'motor-insurance', slug: 'motor-insurance' },
  { source: 'travel-insurance-explore-the-world-with-confidence', slug: 'travel-insurance-explore-the-world-with-confidence' },
  { source: 'marine-transit-insurance-protecting-your-cargo-securing-your-business', slug: 'marine-transit-insurance-protecting-your-cargo-securing-your-business' },
  { source: 'fire-business-package-insurance-safeguarding-your-business-from-the-unexpected', slug: 'fire-business-package-insurance-safeguarding-your-business-from-the-unexpected' },
  { source: 'project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business', slug: 'project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business' },
  { source: 'group-health-insurance-for-employees-secure-your-workforce-strengthen-your-business', slug: 'group-health-insurance-for-employees-secure-your-workforce-strengthen-your-business' },
  { source: 'motor-insurance-drive-with-confidence-stay-protected', slug: 'motor-insurance-drive-with-confidence-stay-protected' },
  { source: 'choosing-the-best-health-insurance-in-ghaziabad-and-noida', slug: 'choosing-the-best-health-insurance-in-ghaziabad-and-noida' },
  { source: 'wealth-management-through-mutual-funds-secure-grow-and-prosper', slug: 'wealth-management-through-mutual-funds-secure-grow-and-prosper' },
  { source: 'why-business-travelers-from-noida-need-more-than-just-a-passport', slug: 'why-business-travelers-from-noida-need-more-than-just-a-passport' },
  { source: 'why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo', slug: 'why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo' },
  { source: 'get-a-quote', slug: 'get-a-quote' }
];

const db = {
  pages: {}
};

pagesToConvert.forEach(page => {
  const sourcePath = path.join(__dirname, '../Cover Wise/coverwiseimf.com', page.source, 'index.html');
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`Skipping ${page.slug} - Not found`);
    return;
  }

  console.log(`Processing ${page.slug}...`);
  const htmlContent = fs.readFileSync(sourcePath, 'utf-8');
  const $ = cheerio.load(htmlContent, { decodeEntities: false });

  const title = $('title').text();
  const description = $('meta[name="description"]').attr('content') || '';

  // Clean up scripts
  $('script[type="speculationrules"]').remove();
  $('script').each((i, el) => {
    const src = $(el).attr('src');
    if (src && (src.includes('burst.min') || src.includes('contact-form-7') || src.includes('wp-emoji-release'))) {
      $(el).remove();
    }
  });

  // Extract only styles and links from the head
  const $head = cheerio.load($('head').html() || '', { decodeEntities: false });
  $head('title').remove();
  $head('meta').remove();
  $head('script').remove(); // root layout handles global scripts
  let extraHeadLinks = $head.root().html() || '';

  let bodyHtml = $('body').html() || '';
  let bodyClass = $('body').attr('class') || '';

  // Function to fix paths
  function fixPaths(str) {
    if (!str) return '';
    str = str.replace(/(href|src)=['"](?:\.\.\/)*\/?(?:insurance\.sprintdigitech\.com\/)?wp-content\/(.*?)['"]/gi, '$1="/wp-content/$2"');
    str = str.replace(/(href|src)=['"](?:\.\.\/)*\/?(?:insurance\.sprintdigitech\.com\/)?wp-includes\/(.*?)['"]/gi, '$1="/wp-includes/$2"');
    str = str.replace(/(href|src)=['"](?:https?:\/\/coverwiseimf\.com)(.*?)['"]/gi, '$1="$2"');
    str = str.replace(/(href|src)=['"](?:\.\.\/)*\/?([^'"]*?)\/?index\.html['"]/gi, (match, p1, p2) => {
      return p2 ? p1 + '="/' + p2 + '"' : p1 + '="/"';
    });
    str = str.replace(/(href|src)=['"](?:\.\.\/)+([^'"]+)['"]/gi, '$1="/$2"');
    str = str.replace(/(href|src)=['"](?:\.\.\/)+['"]/gi, '$1="/"');
    return str;
  }

  extraHeadLinks = fixPaths(extraHeadLinks);
  bodyHtml = fixPaths(bodyHtml);

  const fullHtml = extraHeadLinks + bodyHtml;

  // Add to DB
  db.pages[page.slug] = {
    slug: page.slug,
    title,
    description,
    bodyClass,
    html: fullHtml
  };

  // Generate dynamic Next.js page
  const pageJs = `
import ScriptRunner from '@/components/ScriptRunner';
import { getPage } from '@/lib/db';
import { notFound } from 'next/navigation';

export async function generateMetadata() {
  const page = await getPage('${page.slug}');
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
    }
  };
}

export default async function Page() {
  const page = await getPage('${page.slug}');
  if (!page) {
    notFound();
  }

  return (
    <ScriptRunner html={page.html} bodyClass={page.bodyClass} />
  );
}
  `;

  const routePath = page.slug === 'home' ? '' : page.slug;
  fs.mkdirSync(path.join(__dirname, 'src/app/(frontend)', routePath), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'src/app/(frontend)', routePath, 'page.js'), pageJs.trim() + '\n');
});

fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'data/pages.json'), JSON.stringify(db, null, 2));
console.log("Database generated successfully.");
