import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { retryOn503 } from '../../lib/gemini-retry'

// Backend for /tools/ai-copywriter. The client sends no recaptcha token and
// expects { variations: [{ copy }], tips: [] } — a different contract from the
// older /api/generate-copy route, which is kept as-is.

// Retries against Gemini 503s need headroom past Vercel's 10s default.
export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const {
      productDescription,
      targetAudience,
      copyType,
      tone,
      framework,
      keywords,
      numberOfVariations,
    } = await req.json()

    if (!productDescription?.trim()) {
      return NextResponse.json(
        { error: 'Please provide a product or service description.' },
        { status: 400 }
      )
    }
    if (productDescription.length > 2000 || (targetAudience?.length ?? 0) > 500 || (keywords?.length ?? 0) > 500) {
      return NextResponse.json({ error: 'Input too long.' }, { status: 400 })
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Copy generation is temporarily unavailable. Please try again later.' },
        { status: 503 }
      )
    }

    const count = Math.min(Math.max(parseInt(numberOfVariations, 10) || 3, 1), 5)

    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

    const prompt = `You are a professional conversion copywriter. Write ${count} distinct variations of ${copyType || 'marketing'} copy.

Product/Service: ${productDescription}
${targetAudience ? `Target Audience: ${targetAudience}` : ''}
Tone: ${tone || 'Professional'}
${framework ? `Copywriting Framework to follow: ${framework}` : 'Use a proven copywriting framework (AIDA, PAS, or Before-After-Bridge).'}
${keywords ? `Keywords/benefits to weave in naturally: ${keywords}` : ''}

Rules:
- Each variation must take a different angle (benefit-led, problem-led, curiosity-led, social-proof-led, etc.)
- Ready to publish: no placeholders, no [brackets]
- Include a clear call to action where the format allows
- Sound human, not like AI filler

Respond with ONLY valid JSON in exactly this shape:
{"variations":[{"copy":"full copy text for variation 1"},{"copy":"..."}],"tips":["one short tip on using this copy","another tip"]}

Produce exactly ${count} variations and 2-3 tips.`

    const result = await retryOn503(() => genAI.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    }))
    const text = result.text ?? ''

    let variations: Array<{ copy: string }> = []
    let tips: string[] = []
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text)
      if (Array.isArray(parsed.variations)) {
        variations = parsed.variations
          .filter((v: any) => typeof v?.copy === 'string' && v.copy.trim())
          .slice(0, count)
      }
      if (Array.isArray(parsed.tips)) {
        tips = parsed.tips.filter((t: any) => typeof t === 'string').slice(0, 3)
      }
    } catch {
      // Fallback: treat double-newline blocks as variations
      variations = text
        .split(/\n\s*\n/)
        .map(block => block.trim())
        .filter(Boolean)
        .slice(0, count)
        .map(copy => ({ copy }))
    }

    if (variations.length === 0) {
      return NextResponse.json(
        { error: 'Failed to generate copy. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ variations, tips })
  } catch (error) {
    console.error('AI copywriter error:', error)
    return NextResponse.json(
      { error: 'Failed to generate copy. Please try again.' },
      { status: 500 }
    )
  }
}
