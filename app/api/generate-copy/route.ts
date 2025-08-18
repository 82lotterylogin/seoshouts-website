import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

async function verifyRecaptcha(token: string) {
  const response = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
  })
  const data = await response.json()
  return data.success
}

export async function POST(req: NextRequest) {
  try {
    const { 
      productDescription, 
      targetAudience, 
      copyType, 
      tone, 
      framework,
      numberOfVariations, 
      keywords,
      recaptchaToken 
    } = await req.json()

    // Verify reCAPTCHA
    if (!recaptchaToken || !await verifyRecaptcha(recaptchaToken)) {
      return NextResponse.json({ success: false, error: 'Invalid reCAPTCHA' }, { status: 400 })
    }

    // Validate required fields
    if (!productDescription?.trim() || !targetAudience?.trim() || !copyType || !tone) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please fill in all required fields' 
      }, { status: 400 })
    }

    // Updated model name here ✅
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `You are a professional copywriter. Create ${numberOfVariations} variations of ${copyType.toLowerCase()} copy with the following specifications:

Product/Service: ${productDescription}
Target Audience: ${targetAudience}
Copy Type: ${copyType}
Tone: ${tone}
${framework ? `Copywriting Framework: ${framework}` : ''}
${keywords ? `Key Benefits/Keywords to highlight: ${keywords}` : ''}

Requirements:
- Write compelling, conversion-focused copy
- Use the ${tone.toLowerCase()} tone throughout
- ${framework ? `Follow the ${framework} framework structure` : 'Use proven copywriting principles'}
- Make it human-like and engaging
- Include strong calls-to-action where appropriate
- Keep it appropriate for ${copyType.toLowerCase()} format
- Each variation should be unique and test different angles

Format the response as a JSON array with objects containing 'headline' and 'body' fields. For single-line copy types like ads, put the main copy in 'headline' and supporting text in 'body'. For longer copy, use 'headline' for the main title and 'body' for the main content.

Example format:
[
  {
    "headline": "Main headline or title",
    "body": "Supporting copy or main body text"
  }
]

Generate exactly ${numberOfVariations} unique variations.`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Try to parse JSON response
    let copyOptions
    try {
      // Extract JSON from response if it's wrapped in other text
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      const jsonStr = jsonMatch ? jsonMatch[0] : text
      copyOptions = JSON.parse(jsonStr)
      
      // Ensure it's an array
      if (!Array.isArray(copyOptions)) {
        copyOptions = [copyOptions]
      }
      
      // Limit to requested number
      copyOptions = copyOptions.slice(0, numberOfVariations)
      
    } catch (parseError) {
      // Fallback: split by lines and create basic structure
      const lines = text.split('\n').filter(line => line.trim())
      copyOptions = lines.slice(0, numberOfVariations).map((line, index) => ({
        headline: `${copyType} Option ${index + 1}`,
        body: line.trim()
      }))
    }

    return NextResponse.json({ 
      success: true, 
      results: copyOptions 
    })

  } catch (error) {
    console.error('Copy generation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate copy. Please try again.' 
    }, { status: 500 })
  }
}
