import { NextResponse } from 'next/server';
import { updatePageHtml } from '@/lib/db';

export async function POST(request) {
  try {
    const { slug, html } = await request.json();
    
    if (!slug || !html) {
      return NextResponse.json({ error: 'Missing slug or html' }, { status: 400 });
    }
    
    const success = await updatePageHtml(slug, html);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
