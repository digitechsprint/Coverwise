import fs from 'fs';
import path from 'path';

// Define the path to our local JSON database
const dbPath = path.join(process.cwd(), 'data', 'pages.json');

// Helper to read the database
function readDB() {
  if (!fs.existsSync(dbPath)) return { pages: {} };
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

// Helper to write to the database
function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

/**
 * Get a page by its slug
 * @param {string} slug - The page slug
 * @returns {Promise<Object|null>} The page object or null
 */
export async function getPage(slug) {
  const db = readDB();
  return db.pages[slug] || null;
}

/**
 * Get all pages (lightweight version without full HTML)
 * @returns {Promise<Array>} List of page metadata
 */
export async function getAllPages() {
  const db = readDB();
  return Object.values(db.pages).map(p => ({
    slug: p.slug,
    title: p.title,
    description: p.description
  }));
}

/**
 * Update a page's HTML content
 * @param {string} slug - The page slug
 * @param {string} html - The new HTML content
 * @returns {Promise<boolean>} Success status
 */
export async function updatePageHtml(slug, html) {
  const db = readDB();
  if (!db.pages[slug]) return false;
  
  db.pages[slug].html = html;
  writeDB(db);
  return true;
}
