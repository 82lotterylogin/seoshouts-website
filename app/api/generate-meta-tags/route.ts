import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, content, contentType, numberOfVariations, recaptchaToken } = await request.json()

    console.log('=== REQUEST INFO ===')
    console.log('Content Type:', contentType)
    console.log('Number of variations:', numberOfVariations)
    console.log('Title:', title?.substring(0, 50))

    if (!title || !content || !contentType || !numberOfVariations) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      )
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
    const promptText = createSimplePrompt(contentType, title, content, numberOfVariations)

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
      const fallbackResults = createCleanFallback(contentType, title, numberOfVariations)
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
      results = createCleanFallback(contentType, title, numberOfVariations)
    }

    // Ensure correct number of results
    if (!Array.isArray(results) || results.length === 0) {
      results = createCleanFallback(contentType, title, numberOfVariations)
    }

    // Get exact number requested
    if (results.length !== numberOfVariations) {
      if (results.length > numberOfVariations) {
        results = results.slice(0, numberOfVariations)
      } else {
        const fallback = createCleanFallback(contentType, title, numberOfVariations)
        while (results.length < numberOfVariations) {
          results.push(fallback[results.length] || fallback[0])
        }
      }
    }

    // Clean up and optimize results
    const optimizedResults = results.map((result, index) => {
      return cleanOptimizeMetaTags(result, title, contentType, index)
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
  
  let baseResults = []
  
  if (contentType === 'Landing Page') {
    baseResults = [
      {
        title: `${businessName} - Luxury Accommodation Udaipur`,
        description: `Book your stay at ${businessName}. Premium villa accommodation with exceptional amenities and service in Udaipur. Reserve now for best rates.`
      },
      {
        title: `Premium Villa Rentals | ${businessName}`,
        description: `Experience luxury at ${businessName}, Udaipur's premier villa resort. Beautiful accommodation, top-class service, unforgettable experience.`
      },
      {
        title: `${businessName} Resort - Book Your Dream Stay`,
        description: `Discover ${businessName}, a luxury villa resort in Udaipur. Premium amenities, stunning views, exceptional hospitality. Book today.`
      },
      {
        title: `Best Villa Resort Udaipur | ${businessName}`,
        description: `Choose ${businessName} for your Udaipur stay. Luxury villas, premium facilities, personalized service. Perfect for memorable holidays.`
      },
      {
        title: `${businessName} - Udaipur's Premier Villa Resort`,
        description: `Stay at ${businessName}, Udaipur's top-rated villa resort. Luxurious accommodation, world-class amenities, exceptional guest experience.`
      }
    ]
  } else if (contentType === 'Service Page') {
    baseResults = [
      {
        title: `Professional ${businessName} Solutions`,
        description: `Get expert ${businessName.toLowerCase()} solutions tailored to your needs. Professional service, proven results, competitive pricing.`
      },
      {
        title: `${businessName} - Expert Consultation`,
        description: `Professional ${businessName.toLowerCase()} consultation and implementation. Experienced team, customized approach, guaranteed satisfaction.`
      },
      {
        title: `Reliable ${businessName} Support`,
        description: `Trusted ${businessName.toLowerCase()} support with measurable results. Expert guidance, professional service, ongoing assistance.`
      },
      {
        title: `${businessName} - Professional Results`,
        description: `Get professional ${businessName.toLowerCase()} results that matter. Expert team, proven methods, customer-focused approach.`
      },
      {
        title: `Expert ${businessName} Consulting`,
        description: `Professional ${businessName.toLowerCase()} consulting with real results. Customized solutions, expert advice, reliable support.`
      }
    ]
  } else { // Blog Article
    baseResults = [
      {
        title: `${businessName} - Complete Guide`,
        description: `Everything you need to know about ${businessName.toLowerCase()}. Expert tips, practical advice, and actionable strategies for success.`
      },
      {
        title: `${businessName} Tips and Best Practices`,
        description: `Master ${businessName.toLowerCase()} with proven tips and best practices. Expert guidance for better results and implementation.`
      },
      {
        title: `Understanding ${businessName} - Expert Guide`,
        description: `Comprehensive guide to ${businessName.toLowerCase()}. Learn from experts and get practical insights for immediate application.`
      },
      {
        title: `${businessName} - What You Need to Know`,
        description: `Essential information about ${businessName.toLowerCase()}. Expert insights, practical tips, and proven strategies explained simply.`
      },
      {
        title: `${businessName} Explained - Expert Insights`,
        description: `Get expert insights into ${businessName.toLowerCase()}. Practical guidance, proven methods, and actionable advice for success.`
      }
    ]
  }
  
  return baseResults.slice(0, numberOfVariations)
}

function cleanBusinessName(title: string) {
  // Remove common filler words and clean up the business name
  let clean = title
  
  // Remove redundant words
  clean = clean.replace(/best\s+/gi, '')
  clean = clean.replace(/luxurious\s+/gi, '')
  clean = clean.replace(/\s+villa\s+/gi, ' ')
  clean = clean.replace(/\s+in\s+udaipur$/gi, '')
  
  // Clean up extra spaces
  clean = clean.replace(/\s+/g, ' ').trim()
  
  // If too long, take first few words
  if (clean.length > 40) {
    const words = clean.split(' ')
    clean = words.slice(0, 3).join(' ')
  }
  
  return clean
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
    if (space >= 8 && !metaTitle.includes('Udaipur')) {
      metaTitle = metaTitle + ' Udaipur'
    } else if (space >= 5) {
      metaTitle = metaTitle + ' 2024'
    }
  }

  // Optimize description length (155-160 characters)
  if (metaDescription.length > 160) {
    const words = metaDescription.split(' ')
    let shortened = ''
    
    for (const word of words) {
      if ((shortened + ' ' + word).trim().length <= 160) {
        shortened = (shortened + ' ' + word).trim()
      } else {
        break
      }
    }
    metaDescription = shortened || metaDescription.substring(0, 160).trim()
  }
  
  if (metaDescription.length < 155) {
    const space = 160 - metaDescription.length
    if (space >= 15) {
      metaDescription = metaDescription + ' Book today.'
    } else if (space >= 10) {
      metaDescription = metaDescription + ' Call now.'
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
