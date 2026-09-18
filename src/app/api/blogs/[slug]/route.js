import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(request, { params }) {
  const { slug } = await params;
  
  try {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, blog: data });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug: originalSlug } = await params;

  try {
    const data = await request.json();
    const { title, slug, excerpt, featured_image, content_html } = data;
    
    const updateData = {
      title,
      slug: slug || originalSlug,
      excerpt,
      featured_image,
      content_html,
      updated_at: new Date().toISOString()
    };
    
    const { data: updatedBlog, error } = await supabaseAdmin
      .from('blogs')
      .update(updateData)
      .eq('slug', originalSlug)
      .select()
      .single();
      
    if (error) throw error;

    revalidatePath('/blog');
    revalidatePath(`/blog/${originalSlug}`);
    if (updatedBlog.slug !== originalSlug) {
      revalidatePath(`/blog/${updatedBlog.slug}`);
    }
    return NextResponse.json({ success: true, blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const { error } = await supabaseAdmin
      .from('blogs')
      .delete()
      .eq('slug', slug);
      
    if (error) throw error;

    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
