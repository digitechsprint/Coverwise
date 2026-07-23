import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('id, slug, title, excerpt, featured_image, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json({ success: true, blogs: data });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { title, excerpt, featured_image, content_html } = data;
    
    // Auto-generate slug from title
    let slug = data.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    const { data: newBlog, error } = await supabase
      .from('blogs')
      .insert([
        { slug, title, excerpt, featured_image, content_html }
      ])
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'A blog post with this slug already exists.' }, { status: 400 });
      }
      throw error;
    }
    
    return NextResponse.json({ success: true, blog: newBlog });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
