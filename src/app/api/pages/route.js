import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { updatePageHtml } from '@/lib/db';
import { isAdminAuthenticated } from '@/lib/auth';

export async function POST(request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug, html } = await request.json();
    
    if (!slug || !html) {
      return NextResponse.json({ error: 'Missing slug or html' }, { status: 400 });
    }
    
    const success = await updatePageHtml(slug, html);
    
    if (success) {
      revalidatePath(slug === 'home' ? '/' : `/${slug}`);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
