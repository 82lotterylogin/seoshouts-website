// app/api/contact-submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer';
import { sanitizeInput, validateEmail, logSecurityEvent, getSecurityHeaders } from '@/app/lib/security';

// Verify reCAPTCHA
async function verifyRecaptcha(token: string) {
  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })
  
  const data = await response.json()
  return data.success
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    let { name, email, phone, company, website, service, budget, message, recaptchaToken } = data

    // Sanitize all inputs
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    phone = sanitizeInput(phone);
    company = sanitizeInput(company);
    website = sanitizeInput(website);
    service = sanitizeInput(service);
    budget = sanitizeInput(budget);
    message = sanitizeInput(message);

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    // Verify reCAPTCHA (skip if disabled)
    if (recaptchaToken && recaptchaToken !== 'recaptcha_disabled') {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)
      if (!isValidRecaptcha) {
        logSecurityEvent('RECAPTCHA_FAILED', { email, ip: request.ip }, request);
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400, headers: getSecurityHeaders() }
        )
      }
    } else if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification is required.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const serviceLabels: Record<string, string> = {
      'local-seo': 'Local SEO',
      'ecommerce-seo': 'eCommerce SEO',
      'website-development': 'SEO Website Development',
      'technical-audit': 'Technical SEO Audit',
      'link-building': 'Link Building',
      'seo-consulting': 'SEO Consulting',
      'not-sure': 'Not Sure - Need Guidance'
    };

    const budgetLabels: Record<string, string> = {
      'under-25k': 'Under INR 25,000',
      '25k-50k': 'INR 25,000 - INR 50,000',
      '50k-100k': 'INR 50,000 - INR 100,000',
      '100k-200k': 'INR 100,000 - INR 200,000',
      'above-200k': 'Above INR 200,000',
      'website-static': 'SEO Optimised Static Website - INR 8,500',
      'website-backend': 'SEO Optimised Website with Backend - INR 21,000',
      'website-ecommerce': 'SEO Optimised eCommerce Website - INR 42,000',
      'discuss': 'Discuss Budget'
    };

    const formattedService = service ? (serviceLabels[service] || service) : 'Not selected';
    const formattedBudget = budget ? (budgetLabels[budget] || budget) : 'Not selected';

    // Log the submission (will appear in your server console)
    console.log('📧 Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      website,
      service: formattedService,
      budget: formattedBudget,
      message,
      timestamp: new Date().toISOString()
    });

    // Try to send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        });

        const mailOptions = {
          from: `"SEO Shouts Contact Form" <${process.env.SMTP_USER}>`,
          to: 'seoshouts@gmail.com',
          replyTo: email,
          subject: `🎯 New SEO Inquiry from ${name} - ${formattedService}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #3b82f6;">🎯 New Contact Form Submission</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Company:</strong> ${company || 'Not provided'}</p>
              <p><strong>Website:</strong> ${website || 'Not provided'}</p>
              <p><strong>Service:</strong> ${formattedService}</p>
              <p><strong>Budget:</strong> ${formattedBudget}</p>
              <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
              <p><small>Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</small></p>
            </div>
          `
        };

        // Test connection first
        await transporter.verify();
        console.log('✅ SMTP connection verified');
        
        await transporter.sendMail(mailOptions);
        console.log('✅ Contact email sent successfully to:', 'seoshouts@gmail.com');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('⚠️ SMTP not configured. Add environment variables: SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your inquiry! We will get back to you soon.'
    }, { headers: getSecurityHeaders() })

  } catch (error) {
    logSecurityEvent('CONTACT_FORM_ERROR', { error: error instanceof Error ? error.message : 'Unknown error' }, request);
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}