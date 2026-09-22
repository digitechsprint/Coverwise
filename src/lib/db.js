import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
import fs from 'fs';
import path from 'path';

/**
 * Fallback to read from local JSON if Supabase is not configured or fails
 */
function getLocalPage(slug) {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'pages.json');
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
      const pages = Object.values(db.pages);
      const page = pages.find(p => p.slug === slug);
      if (page) {
        return {
          slug: page.slug,
          title: page.title || '',
          description: page.description || '',
          bodyClass: page.bodyClass || '',
          html: page.html || ''
        };
      }
    }
  } catch (err) {
    console.error("Local JSON read error:", err);
  }
  return null;
}

/**
 * Get a page by its slug from Supabase
 * @param {string} slug - The page slug
 * @returns {Promise<Object|null>} The page object or null
 */
export async function getPage(slug) {
  try {
    // If we're using the placeholder URL, skip Supabase fetch and use local JSON
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      return getLocalPage(slug);
    }

    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      // Fallback on error
      return getLocalPage(slug);
    }
    return {
      slug: data.slug,
      title: data.title,
      description: data.description,
      bodyClass: data.body_class,
      html: data.html
    };
  } catch (err) {
    console.error("Supabase fetch error:", err);
    return getLocalPage(slug);
  }
}

/**
 * Get all pages metadata
 * @returns {Promise<Array>} List of page metadata
 */
export async function getAllPages() {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      const dbPath = path.join(process.cwd(), 'data', 'pages.json');
      if (fs.existsSync(dbPath)) {
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        return Object.values(db.pages).map(p => ({
          slug: p.slug,
          title: p.title,
          description: p.description
        }));
      }
      return [];
    }

    const { data, error } = await supabase
      .from('pages')
      .select('slug, title, description')
      .order('slug');
      
    if (error || !data) return [];
    return data;
  } catch (err) {
    console.error("Supabase fetch error:", err);
    return [];
  }
}

/**
 * Update a page's HTML content in Supabase
 * @param {string} slug - The page slug
 * @param {string} html - The new HTML content
 * @returns {Promise<boolean>} Success status
 */
export async function updatePageHtml(slug, html) {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
      console.warn("Skipping Supabase update; using placeholder credentials.");
      return false;
    }

    const { error } = await supabaseAdmin
      .from('pages')
      .update({ html: html, updated_at: new Date().toISOString() })
      .eq('slug', slug);
      
    return !error;
  } catch (err) {
    console.error("Supabase update error:", err);
    return false;
  }
}
