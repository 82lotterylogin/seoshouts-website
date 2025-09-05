// app/api/inquiry-submit/route.ts
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
    const { website, email, recaptchaToken } = data

    // Validate required fields
    if (!website || !email) {
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
    }

    // Log the submission (will appear in your server console)
    console.log('📊 SEO Analysis Inquiry:', {
      website,
      email,
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
          from: `"SEO Shouts Analysis Request" <${process.env.SMTP_USER}>`,
          to: 'seoshouts@gmail.com',
          replyTo: email,
          subject: `🎯 New SEO Analysis Request - ${website}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #3b82f6;">🎯 New SEO Analysis Request</h1>
              <p><strong>Website:</strong> <a href="${website}" target="_blank">${website}</a></p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Request Type:</strong> Detailed SEO Report</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
              <hr style="margin: 20px 0;">
              <p><small>This inquiry was submitted through the website analyzer form on the homepage.</small></p>
            </div>
          `
        };

        // Test connection first
        await transporter.verify();
        console.log('✅ SMTP connection verified');
        
        await transporter.sendMail(mailOptions);
        console.log('✅ Inquiry email sent successfully to:', 'contact@seoshouts.com');
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    } else {
      console.log('⚠️ SMTP not configured. Add environment variables: SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT');
    }

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your inquiry! We will send you a detailed SEO report within 24 hours.'
    })

  } catch (error) {
    console.error('Inquiry form error:', error)
    return NextResponse.json(
      { error: 'Failed to send inquiry. Please try again.' },
      { status: 500 }
    )
  }
}