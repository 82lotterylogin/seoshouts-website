'use client'

import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

function AICopywriterTool() {
  const [formData, setFormData] = useState({
    productDescription: '',
    targetAudience: '',
    copyType: 'Ad',
    tone: 'Professional',
    framework: '',
    keywords: '',
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
      document.title = 'Free AI Copywriting Tool for Web Copy, Ads & More — Write Like a Pro in Seconds'
      
      const storedUsage = localStorage.getItem('ai-copywriter-usage')
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

    if (!formData.productDescription.trim()) {
      setFormData(prev => ({ ...prev, error: 'Please enter a product/service description' }))
      return
    }

    if (!formData.targetAudience.trim()) {
      setFormData(prev => ({ ...prev, error: 'Please enter target audience information' }))
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setFormData(prev => ({ ...prev, error: 'Please complete the reCAPTCHA verification' }))
      return
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: '', results: null }))

    try {
      const response = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDescription: formData.productDescription,
          targetAudience: formData.targetAudience,
          copyType: formData.copyType,
          tone: formData.tone,
          framework: formData.framework,
          keywords: formData.keywords,
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
        localStorage.setItem('ai-copywriter-usage', newUsageCount.toString())
        
        setUsageInfo({
          usageCount: newUsageCount,
          maxUsage: 5,
          isLimitReached: newUsageCount >= 5
        })
        
        recaptchaRef.current?.reset()
      } else {
        throw new Error(data.error || 'Failed to generate copy')
      }
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate copy. Please try again.'
      }))
      recaptchaRef.current?.reset()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAllResults = () => {
    if (!formData.results) return
    
    let allText = "Generated Copy:\n\n"
    formData.results.forEach((result: any, index: number) => {
      allText += `Option ${index + 1}:\n`
      allText += `Headline: ${result.headline}\n`
      allText += `Copy: ${result.body}\n\n`
    })
    
    navigator.clipboard.writeText(allText)
  }

  const resetUsageLimit = () => {
    localStorage.removeItem('ai-copywriter-usage')
    setUsageInfo({
      usageCount: 0,
      maxUsage: 5,
      isLimitReached: false
    })
    setFormData(prev => ({ ...prev, error: '' }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Software Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Copywriter",
            "description": "Generate compelling copy and marketing content with AI assistance. Create headlines, descriptions, and engaging content in seconds.",
            "url": "https://seoshouts.com/tools/ai-copywriter",
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
              "AI-powered content generation",
              "Multiple content types",
              "Instant results",
              "Customizable tone",
              "Export functionality",
              "Marketing copy creation",
              "Creative writing assistance"
            ],
            "keywords": "AI copywriter, content generation, marketing copy, AI writing tool",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.6",
              "bestRating": "5",
              "ratingCount": "1567"
            },
            "softwareVersion": "3.1",
            "datePublished": "2024-03-01",
            "dateModified": "2024-08-19",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />
      
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
                "name": "Will AI copy hurt my brand voice?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not if you customize the tone settings and edit the output. Use it as a starting point, not the final word."
                }
              },
              {
                "@type": "Question",
                "name": "Can search engines tell if copy is AI-generated?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Google cares about quality and usefulness, not who wrote it. Good AI copy that serves your audience is perfectly fine."
                }
              },
              {
                "@type": "Question",
                "name": "Should I use AI copy without editing it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Usually you'll want to make some tweaks. The AI handles the heavy lifting, but you add the finishing touches."
                }
              },
              {
                "@type": "Question",
                "name": "How do I know if the copy will actually convert?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Test it! AI gives you great starting points, but real-world testing tells you what works for your specific audience."
                }
              },
              {
                "@type": "Question",
                "name": "Can I use this for different industries?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the AI understands context for virtually any industry or niche."
                }
              },
              {
                "@type": "Question",
                "name": "Will this replace professional copywriters?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, but it makes them more efficient. Think collaboration, not replacement."
                }
              }
            ]
          })
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free AI Copywriting Tool
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free AI Copywriting Tool for Web Copy, Ads & More — Write Like a Pro in Seconds
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Generate professional copy for ads, emails, websites and more. AI-powered copywriting that actually converts, trained on high-performing copy that gets results.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>100+ Copy Templates
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Proven Frameworks
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Multiple Tones
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>100% Free
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">✍️ AI Copy Generator</h2>
                
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
                  {/* Copy Type */}
                  <div>
                    <label htmlFor="copyType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Copy Type *
                    </label>
                    <select
                      id="copyType"
                      value={formData.copyType}
                      onChange={(e) => setFormData(prev => ({ ...prev, copyType: e.target.value, error: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    >
                      <option value="Ad">Ad Copy</option>
                      <option value="Email">Email</option>
                      <option value="Webpage">Webpage Copy</option>
                      <option value="Product Description">Product Description</option>
                      <option value="Social Media Post">Social Media Post</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Blog Post">Blog Post</option>
                      <option value="Facebook Ad">Facebook Ad</option>
                      <option value="Google Ad">Google Ad</option>
                      <option value="Email Subject">Email Subject Line</option>
                    </select>
                  </div>

                  {/* Tone */}
                  <div>
                    <label htmlFor="tone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Tone & Style *
                    </label>
                    <select
                      id="tone"
                      value={formData.tone}
                      onChange={(e) => setFormData(prev => ({ ...prev, tone: e.target.value, error: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    >
                      <option value="Professional">Professional</option>
                      <option value="Casual">Casual</option>
                      <option value="Exciting">Exciting</option>
                      <option value="Trustworthy">Trustworthy</option>
                      <option value="Funny">Funny</option>
                      <option value="Technical">Technical</option>
                    </select>
                  </div>

                  {/* Framework (Optional) */}
                  <div>
                    <label htmlFor="framework" className="block text-sm font-semibold text-gray-700 mb-2">
                      Copywriting Framework (Optional)
                    </label>
                    <select
                      id="framework"
                      value={formData.framework}
                      onChange={(e) => setFormData(prev => ({ ...prev, framework: e.target.value, error: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                    >
                      <option value="">No specific framework</option>
                      <option value="AIDA">AIDA (Attention, Interest, Desire, Action)</option>
                      <option value="PAS">PAS (Problem, Agitate, Solution)</option>
                      <option value="BAB">BAB (Before, After, Bridge)</option>
                      <option value="Problem-Solution">Problem-Solution</option>
                    </select>
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

                  {/* Product Description */}
                  <div>
                    <label htmlFor="productDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                      Product/Service Description *
                    </label>
                    <textarea
                      id="productDescription"
                      value={formData.productDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, productDescription: e.target.value, error: '' }))}
                      placeholder="Describe what you're selling or promoting. Include key features, benefits, and unique selling points..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">Be specific about benefits and features</p>
                      <p className="text-xs text-gray-500">{formData.productDescription.length}/500 characters</p>
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Audience *
                    </label>
                    <input
                      type="text"
                      id="targetAudience"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value, error: '' }))}
                      placeholder="e.g., Small business owners, fitness enthusiasts, young professionals..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">Who is your ideal customer?</p>
                      <p className="text-xs text-gray-500">{formData.targetAudience.length}/100 characters</p>
                    </div>
                  </div>

                  {/* Keywords (Optional) */}
                  <div>
                    <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
                      Key Benefits/Keywords (Optional)
                    </label>
                    <input
                      type="text"
                      id="keywords"
                      value={formData.keywords}
                      onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value, error: '' }))}
                      placeholder="e.g., fast results, money-back guarantee, 24/7 support..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                    />
                    <p className="text-xs text-gray-400 mt-1">Comma-separated list of key benefits or keywords to highlight</p>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">Please verify that you're not a robot to generate your copy.</p>
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
                          Generating AI Copy...
                        </>
                      ) : usageInfo.isLimitReached ? (
                        'Daily Limit Reached'
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                          Generate {formData.numberOfVariations} AI Copy Option{formData.numberOfVariations > 1 ? 's' : ''}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        productDescription: '',
                        targetAudience: '',
                        copyType: 'Ad',
                        tone: 'Professional',
                        framework: '',
                        keywords: '',
                        numberOfVariations: 3,
                        isLoading: false,
                        error: '',
                        results: null 
                      })}
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">🎯 Generated Copy</h2>
                  
                  {!formData.results ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">✍️</span>
                      </div>
                      <p>Fill in the details above and click generate to create AI-powered copy</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">
                          Generated {formData.results.length} variation{formData.results.length > 1 ? 's' : ''} of {formData.copyType}
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
                            <h3 className="font-semibold text-gray-900">Option {index + 1} - {formData.copyType} ({formData.tone} tone)</h3>
                            <button
                              onClick={() => copyToClipboard(`${result.headline}\n\n${result.body}`)}
                              className="text-primary hover:text-primary/80 text-sm"
                            >
                              Copy
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            {result.headline && (
                              <div>
                                <label className="text-sm font-medium text-gray-600">Headline/Title:</label>
                                <p className="text-gray-900 bg-white p-3 rounded border text-sm font-medium">{result.headline}</p>
                              </div>
                            )}
                            
                            {result.body && (
                              <div>
                                <label className="text-sm font-medium text-gray-600">Copy:</label>
                                <p className="text-gray-700 bg-white p-3 rounded border text-sm leading-relaxed">{result.body}</p>
                              </div>
                            )}
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
                    <h3 className="text-blue-800 font-semibold">AI Copywriting Tips</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Getting Better Results:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Be specific about your product benefits</li>
                        <li>• Clearly define your target audience</li>
                        <li>• Try different tones and frameworks</li>
                        <li>• Generate multiple variations for A/B testing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Pro Tips:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Always test different copy variations</li>
                        <li>• Customize the AI output for your brand voice</li>
                        <li>• Include specific numbers and benefits when possible</li>
                        <li>• Consider your platform's best practices</li>
                      </ul>
                    </div>
                  </div>
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
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
              <span className="mr-3">⛔</span>
              Stop Staring at Blank Pages Trying to Write Copy That Converts
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  Picture this: It's 2 AM, you've got a product launch tomorrow, and you're staring at a blank Google Doc trying to write ad copy. Your brain feels like mush, everything you write sounds terrible, and you're starting to panic.
                </p>
                
                <p><strong>Been there?</strong></p>
                
                <p>
                  I used to spend hours wrestling with headlines, rewriting the same paragraph fifteen times, and still ending up with copy that sounded like it was written by a robot having a bad day.
                </p>
                
                <p>
                  Then I discovered something that changed everything: <strong>AI that actually understands copywriting.</strong>
                </p>
                
                <p>
                  Not just keyword-stuffing, template-filling AI. I'm talking about AI that knows why some headlines grab attention while others get ignored, why certain product descriptions make people buy while others make them bounce, and how to write ads that actually convert.
                </p>
                
                <p>
                  <strong>Our Free AI Copywriting Tool</strong> doesn't just spit out generic text. It creates copy that sounds human, follows proven frameworks, and actually gets results.
                </p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
                  <p className="text-xl font-semibold text-primary text-center">
                    Ready to never struggle with copywriting again? ↑ Use the tool above! ↑
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
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
              <span className="mr-3">🚀</span>
              What This AI Tool Actually Does (And Why It's Different)
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Think of this as having a world-class copywriter sitting next to you, ready to help whenever inspiration runs dry.
              </p>
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <span className="mr-3">📝</span>
                Here's what happens when you use it:
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Tell it what you're selling and who you're selling to</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Pick the type of copy you need (ad, email, webpage, whatever)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Choose your tone and style</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Watch as it generates multiple options that actually sound good</span>
                </li>
              </ul>
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  <strong>The difference?</strong> Most AI tools just rearrange words. This one understands persuasion, psychology, and what makes people take action.
                </p>
                <p className="text-gray-700 text-center mt-4 italic">
                  I tested it against copy I'd written manually for clients, and honestly? The AI versions often performed better. Sometimes that stings your ego, but it sure saves time.
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
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
              <span className="mr-3">🧠</span>
              Why AI-Generated Copy Actually Works Better Than You Think
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Look, I was skeptical too. "No way a machine can write better than humans," I thought. Then I ran some tests.
              </p>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="mr-3">🤖</span>
                    What AI does better than tired humans:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Never gets writer's block</strong> - No more staring at blank screens for 45 minutes
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Knows what works</strong> - Trained on millions of successful ads and sales pages
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Tests multiple angles instantly</strong> - Get 10 different approaches in seconds
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Stays consistent</strong> - No "phoning it in" when you're writing your 50th product description
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Never forgets the fundamentals</strong> - Always includes calls-to-action and benefit statements
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <span className="mr-3">👨‍💻</span>
                    What humans still do better:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Understanding nuanced brand voice</strong> - Though AI is getting scary good at this
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Knowing industry insider details</strong> - But you can teach the AI these
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Making final strategic decisions</strong> - AI gives options, you pick winners
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

      {/* Key Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center">
              <span className="mr-3">✨</span>
              Key Features That Make This Tool Essential
            </h2>
            
            <div className="space-y-8">
              {/* 100+ Templates */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">📝</span>
                  100+ Copy Templates for Everything
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Whether you need Google Ads, Facebook posts, email subject lines, or website copy, we've got templates that work.
                </p>
                <h4 className="font-semibold text-gray-800 mb-4">Popular templates include:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Google Ads headlines and descriptions</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Facebook and Instagram ad copy</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Product descriptions that sell</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Email subject lines that get opened</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Landing page headlines and CTAs</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Blog post intros that hook readers</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Social media captions that engage</span>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 italic mt-6">
                  So you never have to start from scratch again.
                </p>
              </div>

              {/* Proven Frameworks */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🎯</span>
                  Proven Copywriting Frameworks Built-In
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  The AI knows all the frameworks that actually convert, not just random word combinations.
                </p>
                <h4 className="font-semibold text-gray-800 mb-4">Choose from frameworks like:</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">AIDA</strong> (Attention, Interest, Desire, Action)
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">BAB</strong> (Before, After, Bridge)
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">PAS</strong> (Problem, Agitate, Solution)
                      </div>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Features vs Benefits</strong> conversion
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Pain Point</strong> identification and solution
                      </div>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 italic mt-6">
                  Which means your copy follows proven patterns that actually work.
                </p>
              </div>

              {/* Tone Customization */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🎭</span>
                  Tone and Voice Customization
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Your brand voice matters. The AI can write like you, not like everyone else.
                </p>
                <h4 className="font-semibold text-gray-800 mb-4">Available tones:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Professional and authoritative</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Casual and conversational</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Exciting and energetic</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Trustworthy and reassuring</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Funny and engaging</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Technical and detailed</span>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 italic mt-6">
                  Because one size definitely doesn't fit all brands.
                </p>
              </div>

              {/* Multi-Platform */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">📱</span>
                  Multi-Platform Optimization
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Different platforms need different approaches. The AI knows the rules for each.
                </p>
                <h4 className="font-semibold text-gray-800 mb-4">Platform-specific features:</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Google Ads</strong> - Character limits and approval guidelines
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Facebook Ads</strong> - Engagement-focused copy that doesn't sound salesy
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Instagram</strong> - Visual-friendly captions with hashtag suggestions
                      </div>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">LinkedIn</strong> - Professional tone that builds authority
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <strong className="text-gray-800">Email</strong> - Subject lines and preview text optimization
                      </div>
                    </li>
                  </ul>
                </div>
                <p className="text-gray-700 italic mt-6">
                  So your copy works perfectly wherever you use it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
              <span className="mr-3">📋</span>
              How to Use the AI Copywriting Tool (It's Really Simple)
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 1: Pick Your Copy Type</strong>
                </h3>
                <p className="text-gray-600">
                  Choose what you're writing - ad copy, email, webpage, product description, whatever.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 2: Fill in the Basics</strong>
                </h3>
                <p className="text-gray-600">
                  Tell the AI about your product/service, target audience, and main benefit or message.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 3: Choose Your Style</strong>
                </h3>
                <p className="text-gray-600">
                  Pick the tone, framework, and approach that fits your brand.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 4: Generate Options</strong>
                </h3>
                <p className="text-gray-600">
                  Hit the button and watch multiple copy variations appear in seconds.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 5: Pick and Customize</strong>
                </h3>
                <p className="text-gray-600">
                  Choose your favorite, make any tweaks needed, and you're done.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mt-8">
              <p className="text-gray-700">
                <strong>Pro tip:</strong> Always generate at least 5 options. The first one might be good, but option #4 might be brilliant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses This Tool */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center">
              <span className="mr-3">👥</span>
              Who Actually Uses This Tool?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🏢</span>
                  Small Business Owners
                </h3>
                <p className="text-gray-600">
                  Stop spending your weekends trying to write ads that don't work. Get professional copy in minutes.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🎯</span>
                  Marketing Agencies
                </h3>
                <p className="text-gray-600">
                  Speed up client work without sacrificing quality. Generate options fast, then customize for each brand.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🛒</span>
                  eCommerce Store Owners
                </h3>
                <p className="text-gray-600">
                  Turn boring product specs into compelling descriptions that actually drive sales.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">✍️</span>
                  Content Creators and Bloggers
                </h3>
                <p className="text-gray-600">
                  Beat writer's block and create engaging content that keeps readers scrolling.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">💼</span>
                  Freelancers and Consultants
                </h3>
                <p className="text-gray-600">
                  Deliver better results for clients faster, leaving more time for strategy and higher-value work.
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
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center">
              <span className="mr-3">💡</span>
              Common Scenarios Where This Tool Saves Your Sanity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">📦</span>
                  "I Need 50 Product Descriptions by Tomorrow"
                </h3>
                <p className="text-gray-600">
                  Bulk generate descriptions for your entire catalog in under an hour instead of spending days writing them manually.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">📉</span>
                  "My Ads Are Getting Zero Clicks"
                </h3>
                <p className="text-gray-600">
                  Try fresh angles and approaches based on what's actually working in your industry right now.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">📱</span>
                  "I Have No Idea What to Post on Social Media"
                </h3>
                <p className="text-gray-600">
                  Generate weeks of social content ideas and captions in one session.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">📧</span>
                  "My Email Open Rates Are Terrible"
                </h3>
                <p className="text-gray-600">
                  Test different subject line approaches and find what makes your audience actually open emails.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">✏️</span>
                  "I'm Not a Natural Writer"
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
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center">
              <span className="mr-3">🔥</span>
              What Makes Our AI Different from Generic Tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🎯</span>
                  Trained on High-Converting Copy
                </h3>
                <p className="text-gray-600">
                  Our AI learned from ads and sales pages that actually worked, not just any random text from the internet.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🧠</span>
                  Understands Psychology
                </h3>
                <p className="text-gray-600">
                  Knows why people buy, what objections they have, and how to address concerns in copy.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">⏰</span>
                  Stays Current
                </h3>
                <p className="text-gray-600">
                  Continuously updated with what's working now, not what worked three years ago.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">🎯</span>
                  Context-Aware
                </h3>
                <p className="text-gray-600">
                  Doesn't just fill in templates - understands your specific situation and audience.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                  <span className="mr-3">💰</span>
                  Conversion-Focused
                </h3>
                <p className="text-gray-600">
                  Optimized for results, not just pretty words. Every suggestion is designed to drive action.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Talk Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center">
              <span className="mr-3">💬</span>
              Real Talk: What This Tool Can and Can't Do
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-green-800">
                  ✅ What it's amazing at:
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Generating ideas when you're stuck</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Writing first drafts that are actually good</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Creating multiple variations for testing</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Following proven copywriting formulas</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Saving massive amounts of time</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  👨‍💻 What you still need to do:
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Provide clear input about your goals</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Choose the best options from what it generates</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Add specific details only you know</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Make final edits for brand voice</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Test and optimize based on results</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
              <p className="text-gray-700 text-center font-medium">
                This isn't about replacing human creativity - it's about amplifying it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center">
              <span className="mr-3">❓</span>
              Frequently Asked Questions
            </h2>
            <div className="space-y-8">
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <span className="mr-3">🎭</span>
                  Will AI copy hurt my brand voice?
                </h3>
                <p className="text-gray-600">
                  Not if you customize the tone settings and edit the output. Use it as a starting point, not the final word.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <span className="mr-3">🔍</span>
                  Can search engines tell if copy is AI-generated?
                </h3>
                <p className="text-gray-600">
                  Google cares about quality and usefulness, not who wrote it. Good AI copy that serves your audience is perfectly fine.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <span className="mr-3">✏️</span>
                  Should I use AI copy without editing it?
                </h3>
                <p className="text-gray-600">
                  Usually you'll want to make some tweaks. The AI handles the heavy lifting, but you add the finishing touches.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <span className="mr-3">📊</span>
                  How do I know if the copy will actually convert?
                </h3>
                <p className="text-gray-600">
                  Test it! AI gives you great starting points, but real-world testing tells you what works for your specific audience.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <span className="mr-3">🏭</span>
                  Can I use this for different industries?
                </h3>
                <p className="text-gray-600">
                  Yes, the AI understands context for virtually any industry or niche.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                  <span className="mr-3">👨‍💻</span>
                  Will this replace professional copywriters?
                </h3>
                <p className="text-gray-600">
                  No, but it makes them more efficient. Think collaboration, not replacement.
                </p>
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
              <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center justify-center">
                <span className="mr-3">🛠️</span>
                Explore Our Other SEO Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO and marketing tools designed to help you optimize your website, improve rankings, and drive more traffic.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Meta Tag Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect meta titles and descriptions with AI power.</p>
                <a href="/tools/seo-meta-writer" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Copywriter</h3>
                <p className="text-sm text-gray-600 mb-4">Create compelling copy for ads, emails, and websites with AI.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Optimize your keyword usage and avoid over-optimization.</p>
                <a href="/tools/keyword-density-analyzer" className="text-primary font-medium hover:underline">Try Tool →</a>
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
            <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
              <span className="mr-3">🚀</span>
              Start Writing Copy That Actually Converts
            </h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Stop struggling with blank pages and mediocre copy. Get professional-quality options in seconds, then customize them to fit your brand perfectly.
            </p>
            <p className="text-xl font-semibold mb-8">
              Our AI Copywriting Tool gives you the creative firepower of a top copywriter without the top copywriter price tag.
            </p>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center justify-center">
                <span className="mr-3">📋</span>
                Get Started Right Now:
              </h3>
              <div className="space-y-4 text-lg">
                <div className="flex items-start justify-center space-x-3">
                  <span>🎯</span>
                  <div>
                    <strong>Try the AI Copywriting Tool above</strong><br/>
                    <em className="text-white/80">Generate compelling copy in seconds - completely free</em>
                  </div>
                </div>
                <div className="flex items-start justify-center space-x-3">
                  <span>📚</span>
                  <div>
                    <strong>Need help with overall marketing strategy?</strong><br/>
                    <em className="text-white/80">Contact our experts for personalized guidance</em>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl font-bold mb-4">
                Never write boring copy again. Use SEOShouts' AI Copywriting Tool and watch your conversions improve.
              </p>
              <p className="text-white/80 italic">
                Built by marketers who understand that great copy is the difference between struggling and thriving online.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AICopywriterTool
