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
    const { topic, niche, duration, platform, tone, includeCaptions, includeHashtags, includeBroll, recaptchaToken } = await req.json()

    if (!recaptchaToken || !await verifyRecaptcha(recaptchaToken)) {
      return NextResponse.json({ success: false, error: 'Invalid reCAPTCHA' }, { status: 400 })
    }

    if (!topic?.trim()) {
      return NextResponse.json({ success: false, error: 'Please provide a topic' }, { status: 400 })
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const platformNote = platform ? `Platform: ${platform}.` : ''
    const nicheNote = niche ? `Niche: ${niche}.` : ''
    const toneNote = tone ? `Tone: ${tone}.` : ''

    const prompt = `You are a professional short-form video scriptwriter. Create a complete ${duration}-second ${platform || 'YouTube Shorts'} content package for the topic "${topic}". ${nicheNote} ${toneNote}

Return your response strictly as a JSON object with these fields:
{
  "overview": "1-2 sentence summary of what the short delivers and why it's compelling.",
  "script": "A beat-by-beat script with timestamps (e.g., [0-3s], [4-7s], etc.). Start with a strong hook in the first 2 seconds. Keep lines short and punchy.",
  ${includeCaptions ? '"captions": "On-screen caption text, timed for key beats. Keep concise and high-contrast.",' : ''}
  ${includeHashtags ? '"hashtags": ["list", "of", "10-15", "relevant", "hashtags"],' : ''}
  ${includeBroll ? '"broll": ["specific b-roll or visual cues matched to timestamps"],' : ''}
  "titles": ["5-8 punchy title ideas optimized for CTR"]
}

Requirements:
- Adhere to the target duration (~${duration}s) with timestamp pacing
- Open with a high-impact hook immediately
- Use the ${tone || 'Energetic'} tone
- Keep language tight, conversational, and specific
- Avoid filler words and generic tips
- Prefer action verbs and concrete visuals
- If educational, include a clear payoff or CTA
- Format strictly as valid JSON`.

    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON object
    let parsed
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}$/)
      const jsonStr = jsonMatch ? jsonMatch[0] : text
      parsed = JSON.parse(jsonStr)
    } catch (e) {
      // Fallback minimal structure
      parsed = {
        overview: text.slice(0, 200),
        script: text
      }
    }

    // Normalize arrays
    if (parsed.hashtags && !Array.isArray(parsed.hashtags)) {
      parsed.hashtags = String(parsed.hashtags)
        .split(/[#,\s]+/)
        .filter(Boolean)
        .map((h: string) => (h.startsWith('#') ? h : '#' + h))
        .slice(0, 15)
    }
    if (parsed.titles && !Array.isArray(parsed.titles)) {
      parsed.titles = String(parsed.titles)
        .split(/\n|\.|;|\||,/)
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, 8)
    }
    if (parsed.broll && !Array.isArray(parsed.broll)) {
      parsed.broll = String(parsed.broll)
        .split(/\n|\.|;|\||,/)
        .map((s: string) => s.trim())
        .filter(Boolean)
        .slice(0, 10)
    }

    return NextResponse.json({ success: true, results: parsed })
  } catch (error) {
    console.error('YouTube short generation error:', error)
    return NextResponse.json({ success: false, error: 'Failed to generate script. Please try again.' }, { status: 500 })
  }
}
