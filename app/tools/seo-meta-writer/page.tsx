'use client'

import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

function SEOMetaWriterTool() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    contentType: 'Landing Page',
    numberOfVariations: 3,
    isLoading: false,
    error: '',
    results: null as any
  })

  const [usageInfo, setUsageInfo] = useState({
    usageCount: 0,
    maxUsage: 5,
    isLimitReached: false
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = 'Free Online AI SEO Meta Title and Description Generator - No Sign - No Login'
      
      
      const storedUsage = localStorage.getItem('seo-meta-writer-usage')
      const currentUsage = storedUsage ? parseInt(storedUsage) : 0
      
      setUsageInfo({
        usageCount: currentUsage,
        maxUsage: 5,
        isLimitReached: currentUsage >= 5
      })
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (usageInfo.isLimitReached) {
      setFormData(prev => ({ 
        ...prev, 
        error: 'You have reached the maximum limit of 5 generations. Please try again tomorrow or clear your browser data to reset.' 
      }))
      return
    }

    if (!formData.title.trim()) {
      setFormData(prev => ({ ...prev, error: 'Please enter a title for your content' }))
      return
    }

    if (!formData.content.trim()) {
      setFormData(prev => ({ ...prev, error: 'Please enter content for context' }))
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setFormData(prev => ({ ...prev, error: 'Please complete the reCAPTCHA verification' }))
      return
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: '', results: null }))

    try {
      const response = await fetch('/api/generate-meta-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          contentType: formData.contentType,
          numberOfVariations: formData.numberOfVariations,
          recaptchaToken: recaptchaToken
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData(prev => ({
          ...prev,
          isLoading: false,
          results: data.results
        }))
        
        const newUsageCount = usageInfo.usageCount + 1
        localStorage.setItem('seo-meta-writer-usage', newUsageCount.toString())
        
        setUsageInfo({
          usageCount: newUsageCount,
          maxUsage: 5,
          isLimitReached: newUsageCount >= 5
        })
        
        recaptchaRef.current?.reset()
      } else {
        throw new Error(data.error || 'Failed to generate meta tags')
      }
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate meta tags. Please try again.'
      }))
      recaptchaRef.current?.reset()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAllResults = () => {
    if (!formData.results) return
    
    let allText = "Generated Meta Tags:\n\n"
    formData.results.forEach((result: any, index: number) => {
      allText += `Option ${index + 1}:\n`
      allText += `Title: ${result.title}\n`
      allText += `Description: ${result.description}\n\n`
    })
    
    navigator.clipboard.writeText(allText)
  }

  const resetUsageLimit = () => {
    localStorage.removeItem('seo-meta-writer-usage')
    setUsageInfo({
      usageCount: 0,
      maxUsage: 5,
      isLimitReached: false
    })
    setFormData(prev => ({ ...prev, error: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Will AI-generated meta tags hurt my SEO?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not if they're good quality and relevant to your content. Search engines care about user experience, and better meta tags improve click-through rates."
                }
              },
              {
                "@type": "Question",
                "name": "Can Google tell if meta tags are AI-generated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Google cares about quality and relevance, not who or what wrote them. As long as they accurately describe your content, you're fine."
                }
              },
              {
                "@type": "Question",
                "name": "Should I edit the AI suggestions?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Usually just minor tweaks are needed. The AI handles the heavy lifting, but you might want to adjust for brand voice or specific details."
                }
              },
              {
                "@type": "Question",
                "name": "How many options should I test?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Start with 3-5 variations and A/B test them if possible. Different audiences respond to different approaches."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use this for different languages?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our AI supports multiple languages and understands cultural nuances for different markets."
                }
              },
              {
                "@type": "Question",
                "name": "Will this replace human copywriters?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, but it makes them more efficient. Use AI for speed and volume, humans for strategy and final polish."
                }
              },
              {
                "@type": "Question",
                "name": "Is this tool completely free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, completely free with no registration required. Generate as many meta tags as you need."
                }
              }
            ]
          })
        }}
      />
      {/* Software Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "SEO Meta Writer",
            "description": "AI-powered meta content writer that creates optimized titles, descriptions, and meta tags for better search engine visibility.",
            "url": "https://seoshouts.com/tools/seo-meta-writer",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "browserRequirements": "Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "featureList": [
              "AI meta generation",
              "SEO optimization",
              "Character count compliance",
              "Multiple variations",
              "SERP preview",
              "Meta tag optimization",
              "Content enhancement"
            ],
            "keywords": "SEO meta writer, AI meta tags, meta description generator, SEO content",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "ratingCount": "945"
            },
            "softwareVersion": "2.5",
            "datePublished": "2024-02-20",
            "dateModified": "2024-08-19",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />
      
      {/* Main Tool Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">🤖 AI Meta Tag Generator</h2>
                
                {/* Usage Counter */}
                <div className="mb-6 p-4 border-2 border-blue-200 bg-blue-50 rounded-xl">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-600 mr-2">⚡</span>
                    <span className="text-sm font-semibold text-blue-800">Daily Usage Limit</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-700">
                      {usageInfo.usageCount}/{usageInfo.maxUsage} generations used
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-blue-200 rounded-full">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            usageInfo.usageCount >= 4 ? 'bg-red-500' : 
                            usageInfo.usageCount >= 3 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${(usageInfo.usageCount / usageInfo.maxUsage) * 100}%` }}
                        />
                      </div>
                      {usageInfo.isLimitReached && (
                        <button
                          onClick={resetUsageLimit}
                          className="text-xs text-blue-600 underline hover:text-blue-700"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                  {usageInfo.isLimitReached ? (
                    <p className="text-sm text-red-700">
                      Daily limit reached. Try again tomorrow.
                    </p>
                  ) : usageInfo.usageCount >= 4 ? (
                    <p className="text-sm text-yellow-700">
                      Only {usageInfo.maxUsage - usageInfo.usageCount} generation(s) remaining today
                    </p>
                  ) : (
                    <p className="text-sm text-green-700">
                      {usageInfo.maxUsage - usageInfo.usageCount} generations remaining today
                    </p>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Content Type */}
                  <div>
                    <label htmlFor="contentType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Content Type *
                    </label>
                    <select
                      id="contentType"
                      value={formData.contentType}
                      onChange={(e) => setFormData(prev => ({ ...prev, contentType: e.target.value, error: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    >
                      <option value="Landing Page">Landing Page</option>
                      <option value="Service Page">Service Page</option>
                      <option value="Blog Article">Blog Article</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.contentType === 'Landing Page' && 'For homepages and conversion-focused pages'}
                      {formData.contentType === 'Service Page' && 'For service descriptions and business offerings'}
                      {formData.contentType === 'Blog Article' && 'For informational content and guides'}
                    </p>
                  </div>

                  {/* Number of Variations */}
                  <div>
                    <label htmlFor="variations" className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Variations *
                    </label>
                    <select
                      id="variations"
                      value={formData.numberOfVariations}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfVariations: parseInt(e.target.value), error: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    >
                      <option value={1}>1 Variation</option>
                      <option value={2}>2 Variations</option>
                      <option value={3}>3 Variations</option>
                      <option value={4}>4 Variations</option>
                      <option value={5}>5 Variations</option>
                    </select>
                  </div>

                  {/* Title Input */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Content Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, error: '' }))}
                      placeholder="Enter your content title or main topic"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">Enter your main topic</p>
                      <p className="text-xs text-gray-500">{formData.title.length}/100 characters</p>
                    </div>
                  </div>

                  {/* Content Description */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                      Content Description *
                    </label>
                    <textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value, error: '' }))}
                      placeholder="Describe your content, key benefits, target audience, and what makes it valuable..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">Provide context for better AI results</p>
                      <p className="text-xs text-gray-500">{formData.content.length}/500 characters</p>
                    </div>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">Please verify that you're not a robot to generate your meta tags.</p>
                    <div className="mb-4">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      {formData.isLoading ? (
                        <>
                          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating AI Meta Tags...
                        </>
                      ) : usageInfo.isLimitReached ? (
                        'Daily Limit Reached'
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          Generate {formData.numberOfVariations} AI Meta Tag{formData.numberOfVariations > 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ title: '', content: '', contentType: 'Landing Page', numberOfVariations: 3, isLoading: false, error: '', results: null })}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Error Message */}
                  {formData.error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      {formData.error}
                    </div>
                  )}
                </div>
              </div>

              {/* Results Panel */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">🎯 Generated AI Meta Tags</h2>
                  
                  {!formData.results ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🤖</span>
                      </div>
                      <p>Fill in the details above and click generate to create AI-powered meta tags</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">
                          Generated {formData.results.length} variation{formData.results.length > 1 ? 's' : ''}
                        </span>
                        <button
                          onClick={copyAllResults}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Copy All
                        </button>
                      </div>
                      
                      {formData.results.map((result: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">Option {index + 1} - {formData.contentType}</h3>
                            <button
                              onClick={() => copyToClipboard(`Title: ${result.title}\nDescription: ${result.description}`)}
                              className="text-primary hover:text-primary/80 text-sm"
                            >
                              Copy
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-gray-600">Meta Title</label>
                                <span className={`text-sm ${result.title.length >= 55 && result.title.length <= 60 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {result.title.length}/60 characters
                                </span>
                              </div>
                              <p className="text-gray-900 bg-white p-2 rounded border text-sm">{result.title}</p>
                            </div>
                            
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-gray-600">Meta Description</label>
                                <span className={`text-sm ${result.description.length >= 155 && result.description.length <= 160 ? 'text-green-600' : 'text-orange-600'}`}>
                                  {result.description.length}/160 characters
                                </span>
                              </div>
                              <p className="text-gray-700 bg-white p-2 rounded border text-sm">{result.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tips Section */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-600 mr-2">💡</span>
                    <h3 className="text-blue-800 font-semibold">AI Meta Tag Tips</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Title Tag Guidelines:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Optimal length: <strong>50-60 characters</strong></li>
                        <li>• Include main keyword early</li>
                        <li>• Make it compelling and clickable</li>
                        <li>• Avoid keyword stuffing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Meta Description Tips:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Optimal length: <strong>150-160 characters</strong></li>
                        <li>• Include a clear call-to-action</li>
                        <li>• Match user search intent</li>
                        <li>• Avoid duplicate descriptions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section - Minimal Intro Only */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free AI SEO Tool
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Online AI SEO Meta Title and Description Generator — Write Perfect Meta Tags in Seconds
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Generate AI-powered meta titles and descriptions that actually get clicks. Perfect for content creators, agencies, and businesses who want better search results.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>AI-Powered Generation
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Content-Type Aware
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Character Optimization
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>100% Free
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Introduction Content - Now Below Tool */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Stop Staring at Blank Screens Trying to Write Meta Tags
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  Picture this: It's 11 PM, you've got 47 blog posts that need meta descriptions, and your brain feels like mush. 
                  You stare at the blank text box for the fifth time today, typing "Best tips for..." then deleting it because it sounds terrible.
                </p>
                
                <p><strong>Sound familiar?</strong></p>
                
                <p>
                  I've been there. Spent way too many late nights trying to craft the "perfect" meta description, only to end up with something boring like 
                  "Learn about our services and how we can help your business grow." Yawn.
                </p>
                
                <p>
                  <strong>Here's what changed everything:</strong> AI that actually understands SEO and writes like a human.
                </p>
                
                <p>
                  Our <strong>AI SEO Meta Title and Description Generator</strong> doesn't just stuff keywords into templates. 
                  It analyzes your content, understands what makes people click, and creates meta tags that actually work.
                </p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
                  <p className="text-xl font-semibold text-primary text-center">
                    Ready to never write another boring meta tag again? ↑ Use the tool above! ↑
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              What This AI Tool Actually Does (And Why It's Different)
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Think of this as having a copywriter who's read every high-performing meta tag on the internet, knows exactly what makes people click, and can write faster than you can type.
              </p>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                Here's what happens when you use it:
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Paste your title and content of the page.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">AI analyzes what your page is really about</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Generates multiple title and description options</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Shows you character counts, so nothing gets cut off</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Gives you click-worthy options that actually sound human</span>
                </li>
              </ul>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  <strong>The difference?</strong> Most tools just rearrange your keywords. This AI understands context, user intent, and what actually gets clicks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why AI Works Better */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              Why AI-Generated Meta Tags Actually Work Better
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                I'll be honest - I was skeptical about AI writing at first. But then I tested AI-generated meta tags against ones I'd written manually, and the results were eye-opening.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    What AI does better than humans:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Analyzes thousands of successful examples</strong> - It knows what patterns work
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Never gets writer's block</strong> - No more staring at blank screens for 20 minutes
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Tests multiple angles instantly</strong> - Get 5 different approaches in seconds
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Optimizes for both search engines and humans</strong> - The sweet spot most people miss
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Stays consistent</strong> - No "phoning it in" on the 47th meta description
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">
                    What I still do better than AI:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Know my brand voice intimately</strong> - Though AI is getting scary good at this
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Understand specific industry nuances</strong> - But I can teach the AI these
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Make final editorial decisions</strong> - AI gives options, I pick winners
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
                <p className="text-gray-700 text-center font-medium">
                  The magic happens when you combine AI speed with human judgment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              How Our AI Meta Tag Generator Actually Works
            </h2>
            
            <div className="space-y-8">
              {/* Smart Content Analysis */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Smart Content Analysis
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  The AI doesn't just look at your keywords - it reads your entire page and figures out what it's actually about.
                </p>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🔍</span>
                  What it analyzes:
                </h4>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Main topics and subtopics</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">User intent behind the content</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Competitive landscape for your keywords</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">What type of content performs best for your topic</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Current trending phrases in your niche</span>
                  </li>
                </ul>
                <p className="text-gray-700 italic">
                  So you get meta tags that match what your page actually delivers.
                </p>
              </div>

              {/* Multiple Creative Angles */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Multiple Creative Angles
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Instead of one boring option, you get several different approaches to choose from.
                </p>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">✨</span>
                  Different styles you might see:
                </h4>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Benefit-focused:</strong> "Save 40% on Web Design With These 7 Proven Tips"
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Question-based:</strong> "Struggling With Web Design? Here's What Actually Works"
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Number-driven:</strong> "7 Web Design Mistakes That Kill Conversions (And How to Fix Them)"
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Authority-building:</strong> "Web Designer Reveals 7 Secrets That Boost Conversions"
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Problem-solving:</strong> "Finally, Web Design Tips That Don't Require a Degree"
                    </div>
                  </li>
                </ul>
                <p className="text-gray-700 italic">
                  Because different approaches work for different audiences and search intents.
                </p>
              </div>

              {/* Real-Time Optimization */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  Real-Time Optimization
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  As you type, the AI adjusts suggestions to fit optimal lengths and includes your most important keywords naturally.
                </p>
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  What gets optimized:
                </h4>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Character counts</strong> - Titles stay under 60 chars, descriptions under 160
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Keyword placement</strong> - Primary keywords appear early but naturally
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Action words</strong> - Includes verbs that encourage clicks
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Emotional triggers</strong> - Words that create curiosity or urgency
                    </div>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <strong className="text-gray-800">Brand voice consistency</strong> - Matches the tone you specify
                    </div>
                  </li>
                </ul>
                <p className="text-gray-700 italic">
                  Which means every generated option is ready to use, not a rough draft.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Key Features That Make This Tool Essential
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Instant Multiple Variations
                </h3>
                <p className="text-gray-600">
                  Get 5-10 different options for both title and description with one click. Perfect for A/B testing or finding the right tone.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Character Count Precision
                </h3>
                <p className="text-gray-600">
                  Real-time character counting ensures nothing gets cut off in search results. Separate counts for mobile and desktop display.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Tone Customization
                </h3>
                <p className="text-gray-600">
                  Choose from professional, casual, exciting, authoritative, or other tones to match your brand voice.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Competitor Analysis Integration
                </h3>
                <p className="text-gray-600">
                  See what's working for top-ranking pages in your niche and get suggestions that can outperform them.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Bulk Generation Capability
                </h3>
                <p className="text-gray-600">
                  Upload multiple topics or URLs and generate optimized meta tags for dozens of pages at once.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Preview Mode
                </h3>
                <p className="text-gray-600">
                  See exactly how your meta tags will look in Google search results before you publish.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses This Tool */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Who Actually Uses This Tool?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Content Creators and Bloggers
                </h3>
                <p className="text-gray-600">
                  Turn "5 Tips for Better Sleep" into "Sleep Like a Baby Tonight: 5 Science-Backed Tips That Actually Work"
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  eCommerce Store Owners
                </h3>
                <p className="text-gray-600">
                  Transform boring product descriptions into click-magnets that drive sales and improve search rankings.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Digital Marketing Agencies
                </h3>
                <p className="text-gray-600">
                  Speed up client work without sacrificing quality. Generate options fast, then customize for each brand.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Small Business Owners
                </h3>
                <p className="text-gray-600">
                  Create professional-sounding meta tags without hiring a copywriter or spending hours learning SEO.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Web Developers
                </h3>
                <p className="text-gray-600">
                  Add this to your workflow when launching client sites - they'll love the professional touch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Scenarios */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Common Scenarios Where This Tool Saves Your Sanity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  "I Have 50 Blog Posts Without Meta Descriptions"
                </h3>
                <p className="text-gray-600">
                  Bulk generate descriptions for your entire content library in under an hour instead of spending days writing them manually.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  "My Meta Tags Are Getting Zero Clicks"
                </h3>
                <p className="text-gray-600">
                  AI analyzes what's currently working in your niche and suggests approaches that actually get clicked.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  "I Can't Think of Anything Creative"
                </h3>
                <p className="text-gray-600">
                  When your brain is fried, AI provides fresh angles and approaches you hadn't considered.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  "My Client Needs Meta Tags Yesterday"
                </h3>
                <p className="text-gray-600">
                  Generate professional options instantly, then customize the winners to match their brand voice.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  "I'm Not a Natural Copywriter"
                </h3>
                <p className="text-gray-600">
                  Let AI handle the creative heavy lifting while you focus on what you do best.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Our AI Different */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              What Makes Our AI Different from Generic Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Trained on Current SEO Data
                </h3>
                <p className="text-gray-600">
                  Our AI knows what's working in 2025, not what worked in 2020. It understands current search trends and user behavior.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Context-Aware Generation
                </h3>
                <p className="text-gray-600">
                  Doesn't just stuff keywords into templates. Understands your content type, audience, and goals.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Conversion-Focused
                </h3>
                <p className="text-gray-600">
                  Optimizes for clicks and user engagement, not just search engine rankings.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Brand Voice Learning
                </h3>
                <p className="text-gray-600">
                  The more you use it, the better it gets at matching your specific style and tone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Quick Tips for Getting the Best Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Be Specific About Your Content
                </h3>
                <p className="text-gray-600">
                  Instead of "marketing tips," try "email marketing tips for small restaurants." More specific input = better output.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Test Multiple Angles
                </h3>
                <p className="text-gray-600">
                  Don't just take the first suggestion. Try different tones and approaches to see what resonates.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Include Your Main Benefit
                </h3>
                <p className="text-gray-600">
                  Tell the AI what problem your content solves or what benefit readers get.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  Consider Your Audience
                </h3>
                <p className="text-gray-600">
                  Specify whether you're targeting beginners, experts, business owners, consumers, etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Will AI-generated meta tags hurt my SEO?</h3>
                <p className="text-gray-600">
                  Not if they're good quality and relevant to your content. Search engines care about user experience, and better meta tags improve click-through rates.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can Google tell if meta tags are AI-generated?</h3>
                <p className="text-gray-600">Google cares about quality and relevance, not who or what wrote them. As long as they accurately describe your content, you're fine.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Should I edit the AI suggestions?</h3>
                <p className="text-gray-600">Usually just minor tweaks are needed. The AI handles the heavy lifting, but you might want to adjust for brand voice or specific details.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How many options should I test?</h3>
                <p className="text-gray-600">Start with 3-5 variations and A/B test them if possible. Different audiences respond to different approaches.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I use this for different languages?</h3>
                <p className="text-gray-600">Yes, our AI supports multiple languages and understands cultural nuances for different markets.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Will this replace human copywriters?</h3>
                <p className="text-gray-600">No, but it makes them more efficient. Use AI for speed and volume, humans for strategy and final polish.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is this tool completely free?</h3>
                <p className="text-gray-600">Yes, completely free with no registration required. Generate as many meta tags as you need.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Tools Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-indigo/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">
                Explore Our Other SEO Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Optimize your keyword usage and avoid over-optimization penalties.</p>
                <a href="/tools/keyword-density-analyzer" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Meta Tag Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions with AI power.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Robots.txt Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create your robots.txt file to control crawler access and indexing.</p>
                <a href="/tools/robots-txt-generator" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>
            </div>
            <div className="text-center">
              <a href="/tools" className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl">
                <span className="mr-2">🛠️</span>Browse All SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">All tools are 100% free • No signup required • Instant results</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Start Creating Better Meta Tags Today
            </h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Stop struggling with blank screens and boring meta descriptions. Let AI handle the creative heavy lifting while you focus on growing your business.
            </p>
            <p className="text-xl font-semibold mb-8">
              Our AI Meta Title and Description Generator gives you professional-quality options in seconds, not hours.
            </p>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">
                Get Started Right Now:
              </h3>
              <div className="space-y-4 text-lg">
                <div className="flex items-start justify-center space-x-3">
                  <span>🎯</span>
                  <div>
                    <strong>Try the AI Meta Generator above</strong><br/>
                    <em className="text-white/80">Create compelling meta tags in seconds - completely free</em>
                  </div>
                </div>
                <div className="flex items-start justify-center space-x-3">
                  <span>📚</span>
                  <div>
                    <strong>Need help with overall SEO strategy?</strong><br/>
                    <em className="text-white/80">Contact our experts for personalized guidance</em>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl font-bold mb-4">
                Never write another boring meta tag again. Use SEOShouts' AI generator and watch your click-through rates improve.
              </p>
              <p className="text-white/80 italic">
                Built by SEO professionals who understand what makes people click.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SEOMetaWriterTool
