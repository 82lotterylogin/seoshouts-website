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
      mainTopic, 
      numberOfIdeas,
      angle, // New field
      recaptchaToken 
    } = await req.json()

    // Verify reCAPTCHA
    if (!recaptchaToken || !await verifyRecaptcha(recaptchaToken)) {
      return NextResponse.json({ success: false, error: 'Invalid reCAPTCHA' }, { status: 400 })
    }

    // Validate required fields
    if (!mainTopic?.trim()) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please enter a main topic or keyword' 
      }, { status: 400 })
    }

    if (!numberOfIdeas || numberOfIdeas < 1 || numberOfIdeas > 20) {
      return NextResponse.json({ 
        success: false, 
        error: 'Please select a valid number of ideas' 
      }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    // Updated prompt to only return titles
    const angleText = angle && angle !== 'Surprise me' ? `Focus on: ${angle}` : 'Use a mix of different content types and angles'
    
    const prompt = `You are a professional content strategist and blogger. Generate ${numberOfIdeas} unique blog post titles for the topic: "${mainTopic}".

${angleText}

Requirements:
- Return ONLY blog post titles, nothing else
- No descriptions, explanations, or additional text
- Each title should be compelling and click-worthy
- Make titles specific and actionable
- Ensure variety in approaches and formats
- Each title must be unique and engaging

Return the results as a clean JSON array of strings:
[
  "Blog Post Title 1",
  "Blog Post Title 2",
  "Blog Post Title 3"
]

Generate exactly ${numberOfIdeas} titles for: ${mainTopic}`

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Parse the response to extract only titles
    let blogTitles = []
    try {
      // Try to extract JSON array from response
      const jsonMatch = text.match(/\[[\s\S]*?\]/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[0]
        const parsed = JSON.parse(jsonStr)
        if (Array.isArray(parsed)) {
          blogTitles = parsed.slice(0, numberOfIdeas)
        }
      }
    } catch (parseError) {
      // Fallback: extract titles from text
      const lines = text.split('\n')
        .filter(line => line.trim())
        .map(line => {
          // Clean up common prefixes and formatting
          return line
            .replace(/^\d+\.?\s*/, '') // Remove numbers
            .replace(/^[-*•]\s*/, '') // Remove bullets
            .replace(/^["']|["']$/g, '') // Remove quotes
            .trim()
        })
        .filter(line => line.length > 0 && line.length < 150) // Reasonable title length
        .slice(0, numberOfIdeas)

      blogTitles = lines
    }

    // Ensure we have the requested number of titles
    while (blogTitles.length < numberOfIdeas) {
      blogTitles.push(`${mainTopic}: Essential Tips and Strategies`)
    }

    // Clean up titles - remove any extra descriptions
    blogTitles = blogTitles.map(title => {
      // If title contains a period followed by more text, take only the first part
      if (title.includes('. ')) {
        return title.split('. ')[0]
      }
      // If title contains colon followed by description, keep both parts
      return title.trim()
    })

    return NextResponse.json({ 
      success: true, 
      results: blogTitles.slice(0, numberOfIdeas)
    })

  } catch (error) {
    console.error('Blog ideas generation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate blog ideas. Please try again.' 
    }, { status: 500 })
  }
}
