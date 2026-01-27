import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Testing SMTP configuration...');
    console.log('SMTP_HOST:', process.env.SMTP_HOST);
    console.log('SMTP_PORT:', process.env.SMTP_PORT);
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Set' : 'Not Set');

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return NextResponse.json({
        success: false,
        error: 'SMTP configuration missing'
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Test connection
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');

    // Send test email
    const mailOptions = {
      from: `"SEO Shouts Test" <${process.env.SMTP_USER}>`,
      to: 'seoshouts@gmail.com',
      subject: '🧪 SMTP Test Email',
      html: `
        <h1>SMTP Test Successful</h1>
        <p>This is a test email to verify SMTP configuration.</p>
        <p>Sent at: ${new Date().toISOString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('❌ SMTP test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}