const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const pagesToConvert = [
  'our-services',
  'health-insurance',
  'motor-insurance',
  'travel-insurance-explore-the-world-with-confidence',
  'marine-transit-insurance-protecting-your-cargo-securing-your-business',
  'fire-business-package-insurance-safeguarding-your-business-from-the-unexpected',
  'project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business',
  'group-health-insurance-for-employees-secure-your-workforce-strengthen-your-business',
  'motor-insurance-drive-with-confidence-stay-protected',
  'choosing-the-best-health-insurance-in-ghaziabad-and-noida',
  'wealth-management-through-mutual-funds-secure-grow-and-prosper',
  'why-business-travelers-from-noida-need-more-than-just-a-passport',
  'why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo',
  'get-a-quote'
];

pagesToConvert.forEach(pageName => {
  const sourcePath = path.join(__dirname, '../Cover Wise/coverwiseimf.com', pageName, 'index.html');
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`Skipping ${pageName} - Not found`);
    return;
  }

  console.log(`Converting ${pageName}...`);
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
    // Fix wp-content
    str = str.replace(/(href|src)=['"](?:\.\.\/)*\/?(?:insurance\.sprintdigitech\.com\/)?wp-content\/(.*?)['"]/gi, '$1="/wp-content/$2"');
    // Fix wp-includes
    str = str.replace(/(href|src)=['"](?:\.\.\/)*\/?(?:insurance\.sprintdigitech\.com\/)?wp-includes\/(.*?)['"]/gi, '$1="/wp-includes/$2"');
    // Fix absolute URLs that point to the original domain
    str = str.replace(/(href|src)=['"](?:https?:\/\/coverwiseimf\.com)(.*?)['"]/gi, '$1="$2"');
    // Remove index.html
    str = str.replace(/(href|src)=['"](?:\.\.\/)*\/?([^'"]*?)\/?index\.html['"]/gi, (match, p1, p2) => {
      return p2 ? p1 + '="/' + p2 + '"' : p1 + '="/"';
    });
    // Fix relative URLs that point to folders
    str = str.replace(/(href|src)=['"](?:\.\.\/)+([^'"]+)['"]/gi, '$1="/$2"');
    str = str.replace(/(href|src)=['"](?:\.\.\/)+['"]/gi, '$1="/"');
    return str;
  }

  extraHeadLinks = fixPaths(extraHeadLinks);
  bodyHtml = fixPaths(bodyHtml);

  const pageJs = `
import ScriptRunner from '@/components/ScriptRunner';

export const metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  openGraph: {
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(description)},
  }
};

export default function Page() {
  return (
    <ScriptRunner html={${JSON.stringify(extraHeadLinks + bodyHtml)}} bodyClass={${JSON.stringify(bodyClass)}} />
  );
}
  `;

  fs.mkdirSync(path.join(__dirname, 'src/app', pageName), { recursive: true });
  fs.writeFileSync(path.join(__dirname, 'src/app', pageName, 'page.js'), pageJs);
});

console.log("All services and other pages conversion complete");
