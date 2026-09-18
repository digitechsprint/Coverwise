const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = process.argv[2] || 'http://localhost:3414';
const OUT_DIR = process.argv[3] || './shots';

const PAGES = [
  '/', '/about', '/our-portfolio', '/contact', '/blog', '/our-services',
  '/health-insurance', '/motor-insurance',
  '/travel-insurance-explore-the-world-with-confidence',
  '/marine-transit-insurance-protecting-your-cargo-securing-your-business',
  '/fire-business-package-insurance-safeguarding-your-business-from-the-unexpected',
  '/project-workmen-compensation-insurance-protecting-your-workforce-securing-your-business',
  '/group-health-insurance-for-employees-secure-your-workforce-strengthen-your-business',
  '/motor-insurance-drive-with-confidence-stay-protected',
  '/choosing-the-best-health-insurance-in-ghaziabad-and-noida',
  '/wealth-management-through-mutual-funds-secure-grow-and-prosper',
  '/why-business-travelers-from-noida-need-more-than-just-a-passport',
  '/why-every-modern-adult-needs-a-comprehensive-health-term-insurance-combo',
  '/get-a-quote',
];

function slugify(p) {
  return p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '_');
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 900 });

  for (const p of PAGES) {
    const url = BASE_URL + p;
    const name = slugify(p);
    try {
      const consoleErrors = [];
      page.removeAllListeners('console');
      page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      await new Promise(r => setTimeout(r, 400));
      const filePath = path.join(OUT_DIR, `${name}.png`);
      await page.screenshot({ path: filePath, fullPage: true });
      console.log(JSON.stringify({ page: p, status: resp.status(), file: filePath, consoleErrors }));
    } catch (err) {
      console.log(JSON.stringify({ page: p, error: err.message }));
    }
  }

  await browser.close();
})();
