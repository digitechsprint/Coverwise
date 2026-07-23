import { supabase } from './supabase';

/**
 * Get a page by its slug from Supabase
 * @param {string} slug - The page slug
 * @returns {Promise<Object|null>} The page object or null
 */
export async function getPage(slug) {
  try {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    return {
      slug: data.slug,
      title: data.title,
      description: data.description,
      bodyClass: data.body_class,
      html: data.html
    };
  } catch (err) {
    console.error("Supabase fetch error:", err);
    return null;
  }
}

/**
 * Get all pages metadata
 * @returns {Promise<Array>} List of page metadata
 */
export async function getAllPages() {
  try {
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
    const { error } = await supabase
      .from('pages')
      .update({ html: html, updated_at: new Date().toISOString() })
      .eq('slug', slug);
      
    return !error;
  } catch (err) {
    console.error("Supabase update error:", err);
    return false;
  }
}

