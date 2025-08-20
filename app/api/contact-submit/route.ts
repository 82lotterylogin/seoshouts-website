// app/api/contact-submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer';

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
    const { name, email, phone, company, website, service, budget, message, recaptchaToken } = data

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA (skip if disabled)
    if (recaptchaToken && recaptchaToken !== 'recaptcha_disabled') {
      const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)
      if (!isValidRecaptcha) {
        return NextResponse.json(
          { error: 'reCAPTCHA verification failed. Please try again.' },
          { status: 400 }
        )
      }
    } else if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification is required.' },
        { status: 400 }
      )
    }

    // Log the submission (will appear in your server console)
    console.log('📧 Contact Form Submission:', {
      name,
      email,
      phone,
      company,
      website,
      service,
      budget,
      message,
      timestamp: new Date().toISOString()
    });

    // Try to send email if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"SEO Shouts Contact Form" <${process.env.SMTP_USER}>`,
          to: 'contact@seoshouts.com',
          replyTo: email,
          subject: `🎯 New SEO Inquiry from ${name} - ${service || 'General'}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #3b82f6;">🎯 New Contact Form Submission</h1>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
              <p><strong>Company:</strong> ${company || 'Not provided'}</p>
              <p><strong>Website:</strong> ${website || 'Not provided'}</p>
              <p><strong>Service:</strong> ${service || 'Not selected'}</p>
              <p><strong>Budget:</strong> ${budget || 'Not selected'}</p>
              <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>
              <p><small>Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</small></p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully');
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
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}