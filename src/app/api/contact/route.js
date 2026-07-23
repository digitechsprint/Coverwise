import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields based on standard Contact Form 7
    // Note: The CoverWise contact form uses 'your-phone' for Email and 'tel-908' for Phone!
    const name = data['your-name'] || data.name || 'Unknown';
    const email = data['your-phone'] || data['your-email'] || data.email || 'Unknown';
    const phone = data['tel-908'] || data['your-tel'] || data.phone || '';
    const message = data['your-message'] || data.message || '';
    
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }
    
    // Insert into Supabase
    const { error } = await supabase
      .from('contact_submissions')
      .insert([
        { name, email, phone, message }
      ]);
      
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      message: 'Thank you for reaching out to CoverWise! Your message has been successfully received, and one of our experts will get back to you shortly.' 
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
