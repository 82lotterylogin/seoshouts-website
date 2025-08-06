// app/api/newsletter-subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, recaptchaToken } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!recaptchaToken) {
      return NextResponse.json({ error: 'reCAPTCHA verification is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // ✅ VERIFY reCAPTCHA TOKEN
    const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY
    
    if (!RECAPTCHA_SECRET_KEY) {
      console.error('reCAPTCHA secret key is missing')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    console.log('Verifying reCAPTCHA token...')

    // Verify reCAPTCHA with Google
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    })

    const recaptchaData = await recaptchaResponse.json()
    
    console.log('reCAPTCHA verification result:', {
      success: recaptchaData.success,
      score: recaptchaData.score,
      action: recaptchaData.action,
      hostname: recaptchaData.hostname,
      errorCodes: recaptchaData['error-codes']
    })

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData['error-codes'])
      return NextResponse.json({ error: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 })
    }

    // ✅ BREVO INTEGRATION WITH ENHANCED ERROR HANDLING
    const BREVO_API_KEY = process.env.BREVO_API_KEY
    const BREVO_LIST_ID = process.env.BREVO_LIST_ID

    if (!BREVO_API_KEY || !BREVO_LIST_ID) {
      console.error('Brevo configuration missing:', {
        hasApiKey: !!BREVO_API_KEY,
        hasListId: !!BREVO_LIST_ID,
        apiKeyLength: BREVO_API_KEY?.length || 0
      })
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    console.log('Making Brevo API request:', {
      email,
      firstName: firstName || 'Not provided',
      listId: BREVO_LIST_ID,
      apiKeyPrefix: BREVO_API_KEY.substring(0, 10) + '...'
    })

    // Prepare attributes object
    const attributes: any = {
      SOURCE: 'seoshouts-website',
      SIGNUP_DATE: new Date().toISOString().split('T')[0],
      RECAPTCHA_VERIFIED: 'true'
    }

    // Add firstName if provided
    if (firstName && firstName.trim()) {
      attributes.FIRSTNAME = firstName.trim()
    }

    // Create contact in Brevo
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        listIds: [parseInt(BREVO_LIST_ID)],
        attributes: attributes,
        updateEnabled: true,
      }),
    })

    console.log('Brevo API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Handle successful responses (including empty ones)
    if (response.ok) {
      // Get response text first
      const responseText = await response.text()
      console.log('Brevo API response body:', responseText || '(empty)')
      
      // Handle different success scenarios
      if (!responseText.trim()) {
        // Empty response is often success for contact creation/update
        console.log('Brevo API returned empty response - treating as success')
        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed to newsletter!'
        })
      }
      
      // Try to parse JSON if response has content
      try {
        const data = JSON.parse(responseText)
        console.log('Brevo API parsed response:', data)
        
        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed to newsletter!'
        })
      } catch (parseError) {
        console.log('Non-JSON response, but request was successful')
        return NextResponse.json({
          success: true,
          message: 'Successfully subscribed to newsletter!'
        })
      }
    }

    // Handle error responses
    let errorText = ''
    try {
      errorText = await response.text()
      console.error('Brevo API error response:', errorText)
    } catch (textError) {
      console.error('Could not read error response:', textError)
    }

    // Handle specific error cases
    if (response.status === 400 && errorText.includes('already exists')) {
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!'
      })
    }
    
    if (response.status === 401) {
      console.error('Brevo API authentication failed')
      return NextResponse.json({ error: 'API authentication failed' }, { status: 500 })
    }

    if (response.status === 400) {
      console.error('Brevo API bad request:', errorText)
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    console.error('Brevo API failed:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    })

    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' }, 
      { status: 500 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' }, 
      { status: 500 }
    )
  }
}
