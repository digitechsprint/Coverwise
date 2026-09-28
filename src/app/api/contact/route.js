import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const NOTIFY_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'coverwise.imf@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields based on standard Contact Form 7
    // Note: The CoverWise contact form uses 'your-phone' for Email and 'tel-908' for Phone!
    const name = data['your-name'] || data.name || 'Unknown';
    const email = data['your-phone'] || data['your-email'] || data.email || 'Unknown';
    const phone = data['tel-908'] || data['your-tel'] || data.phone || '';
    const message = data['your-message'] || data.message || '';
    const subject = data['your-subject'] || '';
    const insuranceType = data['insurance-type'] || '';

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // Insert into Supabase (this is what the admin panel's Leads page reads)
    const { error } = await supabase
      .from('contact_submissions')
      .insert([
        { name, email, phone, message }
      ]);

    if (error) throw error;

    // Email the business so submissions don't only sit in the admin panel.
    // A missing/invalid API key shouldn't fail the visitor's submission --
    // the lead is already saved above -- so this is best-effort and logged.
    if (resend) {
      try {
        await resend.emails.send({
          from: `Coverwise Website <${FROM_EMAIL}>`,
          to: NOTIFY_EMAIL,
          replyTo: email !== 'Unknown' ? email : undefined,
          subject: `New ${insuranceType || 'contact'} inquiry from ${name}`,
          html: `
            <h2>New inquiry from the website</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ''}
            ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ''}
            ${insuranceType ? `<p><strong>Insurance type:</strong> ${escapeHtml(insuranceType)}</p>` : ''}
            ${message ? `<p><strong>Message:</strong><br>${escapeHtml(message).replace(/\n/g, '<br>')}</p>` : ''}
          `,
        });
      } catch (emailError) {
        console.error('Error sending notification email:', emailError);
      }
    } else {
      console.warn('RESEND_API_KEY not set -- skipping email notification for this submission.');
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out to CoverWise! Your message has been successfully received, and one of our experts will get back to you shortly.'
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
