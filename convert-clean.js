const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const htmlContent = fs.readFileSync(path.join(__dirname, '../Cover Wise/coverwiseimf.com/index.html'), 'utf-8');
const $ = cheerio.load(htmlContent, { decodeEntities: false });

const title = $('title').text();
const description = $('meta[name="description"]').attr('content');

// Remove title and description from head since Next.js handles them
$('title').remove();
$('meta[name="description"]').remove();
$('meta[property="og:title"]').remove();
$('meta[property="og:description"]').remove();
$('meta[name="twitter:title"]').remove();
$('meta[name="twitter:description"]').remove();
$('meta[http-equiv="content-type"]').remove();
// Remove broken scripts
$('script[type="speculationrules"]').remove();
$('script').each((i, el) => {
  if ($(el).attr('src') && $(el).attr('src').includes('burst.min')) {
    $(el).remove();
  }
});

let headHtml = $('head').html();
// Fix relative paths
headHtml = headHtml.replace(/(href|src)=['"]\/?(?:insurance\.sprintdigitech\.com\/)?wp-content\/(.*?)['"]/gi, '$1="/wp-content/$2"');
headHtml = headHtml.replace(/(href|src)=['"]\/?(?:insurance\.sprintdigitech\.com\/)?wp-includes\/(.*?)['"]/gi, '$1="/wp-includes/$2"');
headHtml = headHtml.replace(/(href)=['"]\/?([^'"]*?)\/?index\.html['"]/gi, (match, p1, p2) => {
  return p2 ? 'href="/' + p2 + '"' : 'href="/"';
});

// Generate layout.js
const layoutJs = `
import "./globals.css";

export const metadata = {
  title: ${JSON.stringify(title)},
  description: ${JSON.stringify(description)},
  openGraph: {
    title: ${JSON.stringify(title)},
    description: ${JSON.stringify(description)},
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head dangerouslySetInnerHTML={{ __html: ${JSON.stringify(headHtml)} }} />
      <body suppressHydrationWarning className="home page-template page-template-elementor_header_footer page page-id-7 wp-custom-logo ehf-template-modins ehf-stylesheet-modins elementor-default elementor-template-full-width elementor-kit-15 elementor-page elementor-page-7">
        {children}
      </body>
    </html>
  );
}
`;

// Body content
let bodyHtml = $('body').html();
bodyHtml = bodyHtml.replace(/(href|src)=['"]\/?(?:insurance\.sprintdigitech\.com\/)?wp-content\/(.*?)['"]/gi, '$1="/wp-content/$2"');
bodyHtml = bodyHtml.replace(/(href|src)=['"]\/?(?:insurance\.sprintdigitech\.com\/)?wp-includes\/(.*?)['"]/gi, '$1="/wp-includes/$2"');
bodyHtml = bodyHtml.replace(/(href)=['"]\/?([^'"]*?)\/?index\.html['"]/gi, (match, p1, p2) => {
  return p2 ? `href="/${p2}"` : 'href="/"';
});

let bodyClass = $('body').attr('class') || '';

const pageJs = `
import ScriptRunner from '@/components/ScriptRunner';

export default function Home() {
  return (
    <ScriptRunner html={${JSON.stringify(bodyHtml)}} bodyClass={${JSON.stringify(bodyClass)}} />
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src/app/layout.js'), layoutJs);
fs.writeFileSync(path.join(__dirname, 'src/app/page.js'), pageJs);
console.log("Conversion complete");
