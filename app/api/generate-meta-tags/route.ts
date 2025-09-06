import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const mode = (body.mode || 'manual') as 'manual' | 'url'
    let { title, content, contentType, numberOfVariations, recaptchaToken } = body

    console.log('=== REQUEST INFO ===')
    console.log('Mode:', mode)
    console.log('Content Type:', contentType)
    console.log('Number of variations:', numberOfVariations)
    console.log('Title preview:', title?.substring(0, 50))

    // Normalize numberOfVariations
    numberOfVariations = typeof numberOfVariations === 'string' ? parseInt(numberOfVariations, 10) : numberOfVariations

    if (!contentType || !numberOfVariations) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (mode === 'manual') {
      if (!title || !content) {
        return NextResponse.json(
          { success: false, error: 'All fields are required' },
          { status: 400 }
        )
      }
    } else if (mode === 'url') {
      const url = (body.url || '').trim()
      if (!url) {
        return NextResponse.json(
          { success: false, error: 'URL is required' },
          { status: 400 }
        )
      }
      // Validate URL and security constraints
      if (!isValidHttpUrl(url) || !isAllowedUrl(url)) {
        return NextResponse.json(
          { success: false, error: 'Please provide a valid public URL' },
          { status: 400 }
        )
      }
      // Fetch page content
      const { pageTitle, textContent, error: fetchError } = await fetchPageContent(url)
      if (fetchError) {
        return NextResponse.json(
          { success: false, error: fetchError },
          { status: 400 }
        )
      }
      // Use fetched values for prompt
      title = pageTitle || title || url
      content = textContent
    }

    if (numberOfVariations < 1 || numberOfVariations > 5) {
      return NextResponse.json(
        { success: false, error: 'Number of variations must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      { method: 'POST' }
    )
    const recaptchaResult = await recaptchaResponse.json()

    if (!recaptchaResult.success) {
      return NextResponse.json(
        { success: false, error: 'reCAPTCHA verification failed' },
        { status: 400 }
      )
    }

    // Create simple, clean prompt
    const promptText = createSimplePrompt(contentType, title as string, content as string, numberOfVariations)

    console.log('Calling Gemini API...')
    
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: promptText
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500,
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      console.error('Gemini API failed, using clean fallback')
      const fallbackResults = createCleanFallback(contentType, title as string, numberOfVariations)
      return NextResponse.json({
        success: true,
        results: fallbackResults
      })
    }

    const geminiData = await geminiResponse.json()
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
    
    console.log('AI Response preview:', generatedText?.substring(0, 100))

    let results
    try {
      // Simple cleanup - just extract JSON array
      let cleanText = generatedText
      cleanText = cleanText.replace(/``````/g, '')
      cleanText = cleanText.match(/\[.*\]/s)?.[0] || generatedText
      
      results = JSON.parse(cleanText)
      console.log('Parsed successfully:', results.length, 'results')
      
    } catch (parseError) {
      console.log('Parse failed, using clean fallback')
      results = createCleanFallback(contentType, title as string, numberOfVariations)
    }

    // Ensure correct number of results
    if (!Array.isArray(results) || results.length === 0) {
      results = createCleanFallback(contentType, title as string, numberOfVariations)
    }

    // Get exact number requested
    if (results.length !== numberOfVariations) {
      if (results.length > numberOfVariations) {
        results = results.slice(0, numberOfVariations)
      } else {
        const fallback = createCleanFallback(contentType, title as string, numberOfVariations)
        while (results.length < numberOfVariations) {
          results.push(fallback[results.length] || fallback[0])
        }
      }
    }

    // Clean up and optimize results
    const optimizedResults = results.map((result: any, index: number) => {
      return cleanOptimizeMetaTags(result, title as string, contentType, index)
    })

    console.log('Returning', optimizedResults.length, 'clean results')
    
    return NextResponse.json({
      success: true,
      results: optimizedResults
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate meta tags. Please try again.' },
      { status: 500 }
    )
  }
}

function createSimplePrompt(contentType: string, title: string, content: string, numberOfVariations: number) {
  let contentFocus = ''
  
  switch (contentType) {
    case 'Landing Page':
      contentFocus = 'This is a business homepage. Focus on attracting customers, highlighting benefits, and encouraging bookings or contact.'
      break
    case 'Service Page':
      contentFocus = 'This is a service page. Focus on the specific service offered, expertise, and professional results.'
      break
    case 'Blog Article':
      contentFocus = 'This is a blog article. Focus on providing information, tips, and educational value.'
      break
  }

  return `Write ${numberOfVariations} SEO meta titles and descriptions for this content:

Title: ${title}
Content: ${content}
Content Type: ${contentType}

${contentFocus}

Requirements:
- Meta titles: 55-60 characters (natural, no extra words)
- Meta descriptions: 155-160 characters (natural, no extra words)
- Write naturally without redundant terms
- Make each variation unique

Return only valid JSON array:
[
  {"title": "Natural title here", "description": "Natural description here"},
  {"title": "Another natural title", "description": "Another natural description"}
]`
}

function createCleanFallback(contentType: string, title: string, numberOfVariations: number) {
  // Clean the title first
  const businessName = cleanBusinessName(title)
  
  let baseResults: { title: string; description: string }[] = []
  
  if (contentType === 'Landing Page') {
    // Generic, brand-safe landing page options (no location assumptions)
    baseResults = [
      {
        title: `${businessName} — Official Site`,
        description: `Discover ${businessName}. Quality you can trust, exceptional service, and solutions tailored to your needs. Learn more.`
      },
      {
        title: `${businessName} | Excellence Delivered`,
        description: `${businessName} offers reliable, customer‑focused solutions with a commitment to quality and results. Get started today.`
      },
      {
        title: `Welcome to ${businessName}`,
        description: `Explore what ${businessName} can do for you — premium quality, trusted expertise, and a seamless experience from start to finish.`
      },
      {
        title: `${businessName} | Trusted by Customers`,
        description: `Experience ${businessName}: dependable quality, expert support, and real results that matter. Learn more.`
      },
      {
        title: `${businessName} — Quality You Can Rely On`,
        description: `${businessName} delivers professional quality with a focus on value, trust, and customer satisfaction. Get started today.`
      }
    ]
  } else if (contentType === 'Service Page') {
    baseResults = [
      {
        title: `Professional ${businessName} Services`,
        description: `Get expert ${businessName.toLowerCase()} services tailored to your needs. Professional team, proven results, and reliable support.`
      },
      {
        title: `${businessName} — Expert Solutions`,
        description: `Professional ${businessName.toLowerCase()} solutions with measurable results. Experienced team, custom approach, clear outcomes.`
      },
      {
        title: `Reliable ${businessName} Support`,
        description: `Trusted ${businessName.toLowerCase()} support from experienced professionals. Quality service and a results‑driven approach.`
      },
      {
        title: `${businessName} — Proven Results`,
        description: `Drive outcomes with professional ${businessName.toLowerCase()}. Expert guidance, practical implementation, and ongoing support.`
      },
      {
        title: `Expert ${businessName} Consulting`,
        description: `Consulting and implementation for ${businessName.toLowerCase()}. Tailored strategies, expert advice, and dependable delivery.`
      }
    ]
  } else { // Blog Article
    baseResults = [
      {
        title: `${businessName} — Complete Guide`,
        description: `Everything you need to know about ${businessName.toLowerCase()}. Expert tips, practical advice, and actionable strategies.`
      },
      {
        title: `${businessName} Tips and Best Practices`,
        description: `Master ${businessName.toLowerCase()} with proven tips and best practices. Clear guidance for better results.`
      },
      {
        title: `Understanding ${businessName} — Expert Guide`,
        description: `A comprehensive guide to ${businessName.toLowerCase()}. Learn key concepts and get practical insights you can apply today.`
      },
      {
        title: `${businessName} — What You Need to Know`,
        description: `Essential insights about ${businessName.toLowerCase()}. Practical tips and strategies explained simply.`
      },
      {
        title: `${businessName} Explained — Expert Insights`,
        description: `Get expert insights into ${businessName.toLowerCase()}. Practical guidance, proven methods, and clear next steps.`
      }
    ]
  }
  
  return baseResults.slice(0, numberOfVariations)
}

function cleanBusinessName(title: string) {
  // Remove common filler words and clean up the business name
  let clean = title
  
  // Remove redundant words and location bias
  clean = clean.replace(/\b(best|luxurious)\b\s*/gi, '')
  clean = clean.replace(/\s+villa\s+/gi, ' ')
  clean = clean.replace(/\s+in\s+[a-z\s]+$/gi, '')
  
  // Clean up extra spaces
  clean = clean.replace(/\s+/g, ' ').trim()
  
  // If too long, take first few words
  if (clean.length > 40) {
    const words = clean.split(' ')
    clean = words.slice(0, 3).join(' ')
  }
  
  return clean
}

// === URL mode helpers (scoped to this route to avoid changing other modules) ===
function isValidHttpUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

function isAllowedUrl(urlStr: string): boolean {
  try {
    const u = new URL(urlStr)
    const host = u.hostname.toLowerCase()
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.startsWith('172.16.') ||
      host.startsWith('172.17.') ||
      host.startsWith('172.18.') ||
      host.startsWith('172.19.') ||
      host.startsWith('172.2') ||
      host.startsWith('172.30.') ||
      host.startsWith('172.31.') ||
      host.startsWith('169.254.')
    ) {
      return false
    }
    return true
  } catch {
    return false
  }
}

function extractTextAndTitle(html: string): { title: string | null; text: string } {
  // Remove script/style/noscript/comments
  const clean = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
  const titleMatch = clean.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : null
  const text = clean
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&[a-zA-Z0-9#]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return { title, text }
}

async function fetchPageContent(url: string): Promise<{ pageTitle: string | null; textContent: string; error?: string }> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SEOShouts-MetaWriter/1.0 (Content Extraction Bot)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      // @ts-ignore Node fetch supports timeout signal
      signal: (AbortSignal as any).timeout ? (AbortSignal as any).timeout(15000) : undefined,
    })

    if (!response.ok) {
      return { pageTitle: null, textContent: '', error: `Failed to fetch URL: ${response.status} ${response.statusText}` }
    }
    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('text/html')) {
      return { pageTitle: null, textContent: '', error: 'URL does not contain HTML content' }
    }

    const html = await response.text()
    if (!html || html.trim().length === 0) {
      return { pageTitle: null, textContent: '', error: 'No content found at the provided URL' }
    }

    const { title, text } = extractTextAndTitle(html)
    if (!text || text.length < 50) {
      return { pageTitle: title, textContent: '', error: 'Insufficient text content found on the webpage' }
    }

    return { pageTitle: title, textContent: text }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { pageTitle: null, textContent: '', error: 'Request timeout - the webpage took too long to respond' }
    }
    return { pageTitle: null, textContent: '', error: 'Failed to fetch content from URL. Please try again.' }
  }
}

function cleanOptimizeMetaTags(result: any, originalTitle: string, contentType: string, index: number) {
  let metaTitle = result.title || `${cleanBusinessName(originalTitle)} - Option ${index + 1}`
  let metaDescription = result.description || `Professional ${cleanBusinessName(originalTitle).toLowerCase()} with quality results and satisfaction.`

  // Remove redundant words from title
  metaTitle = metaTitle.replace(/\s+services\s+services/gi, ' services')
  metaTitle = metaTitle.replace(/\s+service\s+services/gi, ' services') 
  metaTitle = metaTitle.replace(/\s+provider\s+services/gi, ' provider')
  metaTitle = metaTitle.replace(/\s+services\s+provider/gi, ' services')
  
  // Remove redundant words from description
  metaDescription = metaDescription.replace(/\s+services\s+services/gi, ' services')
  metaDescription = metaDescription.replace(/contact us today\.\s*contact us today\./gi, 'contact us today.')
  
  // Optimize title length (55-60 characters)
  if (metaTitle.length > 60) {
    const words = metaTitle.split(' ')
    let shortened = ''
    
    for (const word of words) {
      if ((shortened + ' ' + word).trim().length <= 60) {
        shortened = (shortened + ' ' + word).trim()
      } else {
        break
      }
    }
    metaTitle = shortened || metaTitle.substring(0, 60).trim()
  }
  
  if (metaTitle.length < 55) {
    const space = 60 - metaTitle.length
    // Avoid adding arbitrary locations or years; keep titles clean and relevant
    if (space >= 5 && !/\b(19|20)\d{2}\b/.test(metaTitle)) {
      // Optionally add a neutral qualifier only when it makes sense
      // metaTitle = `${metaTitle} | Guide`
      metaTitle = metaTitle
    }
  }

  // Optimize description length to avoid SERP cropping
  const MAX_DESC = 150  // Conservative limit to prevent truncation
  if (metaDescription.length > MAX_DESC) {
    // Find the last complete sentence or phrase within limit
    const truncated = metaDescription.substring(0, MAX_DESC)
    const lastPeriod = truncated.lastIndexOf('.')
    const lastSpace = truncated.lastIndexOf(' ')
    
    if (lastPeriod > MAX_DESC * 0.7) {
      // If we have a sentence that's at least 70% of our target, use it
      metaDescription = truncated.substring(0, lastPeriod + 1).trim()
    } else if (lastSpace > MAX_DESC * 0.8) {
      // Otherwise, break at the last word boundary if it's at least 80% of target
      metaDescription = truncated.substring(0, lastSpace).trim()
    } else {
      // Fallback: just trim to limit
      metaDescription = truncated.trim()
    }
  }
  
  // Ensure description ends properly (no hanging words or incomplete phrases)
  metaDescription = metaDescription.replace(/\s+(and|or|with|for|to|in|at|on|of|the|a|an)$/i, '').trim()
  
  // Add period if description doesn't end with punctuation
  if (metaDescription && !/[.!?]$/.test(metaDescription)) {
    if (metaDescription.length <= 149) {
      metaDescription += '.'
    }
  }

  // Final cleanup
  metaTitle = metaTitle.replace(/\s+/g, ' ').trim()
  metaDescription = metaDescription.replace(/\s+/g, ' ').trim()

  return {
    title: metaTitle,
    description: metaDescription
  }
}
