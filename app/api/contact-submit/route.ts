// app/api/contact-submit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import sendMailModule from '../../../compiled/email/index.js';
import nodemailer from 'nodemailer';

const sendMail = (sendMailModule as any).default;

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

    // Verify reCAPTCHA
    if (!recaptchaToken) {
      return NextResponse.json(
        { error: 'Please complete the reCAPTCHA verification.' },
        { status: 400 }
      )
    }

    const isValidRecaptcha = await verifyRecaptcha(recaptchaToken)
    if (!isValidRecaptcha) {
      return NextResponse.json(
        { error: 'reCAPTCHA verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Create transporter
   const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

    // Email content
    const emailContent = `
New Contact Form Submission from SEO Shouts Website

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
Company: ${company || 'Not provided'}
Website: ${website || 'Not provided'}
Service Interested In: ${service || 'Not selected'}
Budget Range: ${budget || 'Not selected'}

Message:
${message}

---
This form was submitted from the SEO Shouts contact page.
Submission time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
    `

    const mailOptions = {
      from: `"SEO Shouts Contact Form" <${process.env.SMTP_USER}>`,
      to: 'seoshouts@gmail.com',
      replyTo: email,
      subject: `🎯 New SEO Inquiry from ${name} - ${service || 'General'}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Contact Form Submission</h1>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-top: 0;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Name:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Phone:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${phone || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Company:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${company || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Website:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${website || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Service:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">${service || 'Not selected'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #374151;">Budget:</td>
                <td style="padding: 8px 0; color: #6b7280;">${budget || 'Not selected'}</td>
              </tr>
            </table>
            
            <h3 style="color: #374151; margin-top: 20px;">Message:</h3>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; color: #374151; line-height: 1.6;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
              <p style="margin: 0; color: #065f46; font-size: 14px;">
                📅 Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST<br>
                🌐 Source: SEO Shouts Contact Page
              </p>
            </div>
          </div>
        </div>
      `
    }

    await sendMail(mailOptions)

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
