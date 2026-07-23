const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync(path.join(__dirname, '../Cover Wise/coverwiseimf.com/about/index.html'), 'utf-8');
const $ = cheerio.load(htmlContent, { decodeEntities: false });

const title = $('title').text();
const description = $('meta[name="description"]').attr('content');

// Clean up scripts
$('script[type="speculationrules"]').remove();
$('script').each((i, el) => {
  const src = $(el).attr('src');
  if (src && (src.includes('burst.min') || src.includes('contact-form-7') || src.includes('wp-emoji-release'))) {
    $(el).remove();
  }
});

// Extract only styles and links from the head (since RootLayout already has the global ones, these might be redundant but will ensure any page-specific CSS is loaded)
const $head = cheerio.load($('head').html(), { decodeEntities: false });
$head('title').remove();
$head('meta').remove();
$head('script').remove(); // root layout handles global scripts
let extraHeadLinks = $head.root().html() || '';

let bodyHtml = $('body').html() || '';
let bodyClass = $('body').attr('class') || '';

// Function to fix paths
function fixPaths(str) {
  if (!str) return '';
  // Fix wp-content (including the sprintdigitech domain ones)
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

export default function About() {
  return (
    <ScriptRunner html={${JSON.stringify(extraHeadLinks + bodyHtml)}} bodyClass={${JSON.stringify(bodyClass)}} />
  );
}
`;

fs.mkdirSync(path.join(__dirname, 'src/app/about'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'src/app/about/page.js'), pageJs);
console.log("About page conversion complete");
