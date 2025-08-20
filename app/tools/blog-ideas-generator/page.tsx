'use client'

import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

function BlogIdeasGeneratorTool() {
  const [formData, setFormData] = useState({
    mainTopic: '',
    numberOfIdeas: 5,
    angle: 'Surprise me',
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
      document.title = 'Free Blog Ideas Generator Tool — Never Stare at a Blank Screen Again | SEO Shouts'
      
      const storedUsage = localStorage.getItem('blog-ideas-generator-usage')
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

    if (!formData.mainTopic.trim()) {
      setFormData(prev => ({ ...prev, error: 'Please enter a main topic or keyword' }))
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setFormData(prev => ({ ...prev, error: 'Please complete the reCAPTCHA verification' }))
      return
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: '', results: null }))

    try {
      const response = await fetch('/api/generate-blog-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainTopic: formData.mainTopic,
          numberOfIdeas: formData.numberOfIdeas,
          angle: formData.angle,
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
        localStorage.setItem('blog-ideas-generator-usage', newUsageCount.toString())
        
        setUsageInfo({
          usageCount: newUsageCount,
          maxUsage: 5,
          isLimitReached: newUsageCount >= 5
        })
        
        recaptchaRef.current?.reset()
      } else {
        throw new Error(data.error || 'Failed to generate blog ideas')
      }
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate blog ideas. Please try again.'
      }))
      recaptchaRef.current?.reset()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAllResults = () => {
    if (!formData.results) return
    
    let allText = "Generated Blog Topics:\n\n"
    formData.results.forEach((title: string, index: number) => {
      allText += `${index + 1}. ${title}\n`
    })
    
    navigator.clipboard.writeText(allText)
  }

  const resetUsageLimit = () => {
    localStorage.removeItem('blog-ideas-generator-usage')
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
            "name": "AI Blog Ideas Generator",
            "description": "Generate compelling blog topics and content ideas with AI assistance. Get inspired with hundreds of topic suggestions tailored to your niche.",
            "url": "https://seoshouts.com/tools/blog-ideas-generator",
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
              "AI topic generation",
              "Niche-specific ideas",
              "SEO-friendly suggestions",
              "Bulk generation",
              "Export functionality",
              "Content planning",
              "Creative inspiration"
            ],
            "keywords": "blog ideas, content ideas, AI blog generator, topic generator",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "bestRating": "5",
              "ratingCount": "1203"
            },
            "softwareVersion": "2.8",
            "datePublished": "2024-02-15",
            "dateModified": "2024-08-19",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free Blog Ideas Generator
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Blog Ideas Generator Tool — Never Stare at a Blank Screen Again
              </span>
            </h1>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Generate unlimited blog topic ideas instantly. No more writer's block, no more blank screens. Just fresh, engaging topics for your blog or content calendar.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>AI-Powered Ideas
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>5-20 Topics Per Generate
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>Trending & Evergreen Mix
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">💡 Blog Ideas Generator</h2>
                
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
                  {/* Number of Ideas */}
                  <div>
                    <label htmlFor="numberOfIdeas" className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Ideas *
                    </label>
                    <select
                      id="numberOfIdeas"
                      value={formData.numberOfIdeas}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfIdeas: parseInt(e.target.value), error: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    >
                      <option value={5}>5 Blog Ideas</option>
                      <option value={10}>10 Blog Ideas</option>
                      <option value={15}>15 Blog Ideas</option>
                      <option value={20}>20 Blog Ideas</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose how many topic ideas you need</p>
                  </div>

                  {/* Pick Your Angle */}
                  <div>
                    <label htmlFor="angle" className="block text-sm font-semibold text-gray-700 mb-2">
                      Pick Your Angle (Optional)
                    </label>
                    <select
                      id="angle"
                      value={formData.angle}
                      onChange={(e) => setFormData(prev => ({ ...prev, angle: e.target.value, error: '' }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                    >
                      <option value="Surprise me">Surprise me</option>
                      <option value="How-to guides">How-to guides</option>
                      <option value="Comparison posts">Comparison posts</option>
                      <option value="Beginner content">Beginner content</option>
                      <option value="Listicles">Listicles (Top 10, Best of...)</option>
                      <option value="Problem-solving">Problem-solving posts</option>
                      <option value="Personal experience">Personal experience stories</option>
                      <option value="Industry trends">Industry trends & news</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Want how-to guides? Comparison posts? Beginner content? You can specify or let the generator surprise you.</p>
                  </div>

                  {/* Main Topic */}
                  <div>
                    <label htmlFor="mainTopic" className="block text-sm font-semibold text-gray-700 mb-2">
                      Main Topic or Keyword *
                    </label>
                    <input
                      type="text"
                      id="mainTopic"
                      value={formData.mainTopic}
                      onChange={(e) => setFormData(prev => ({ ...prev, mainTopic: e.target.value, error: '' }))}
                      placeholder="e.g., fitness, small business marketing, vegan cooking, personal finance..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={formData.isLoading || usageInfo.isLimitReached}
                      required
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-400">Enter your blog niche, topic, or keyword</p>
                      <p className="text-xs text-gray-500">{formData.mainTopic.length}/100 characters</p>
                    </div>
                  </div>

                  {/* reCAPTCHA */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">Please verify that you're not a robot to generate your blog ideas.</p>
                    <div className="recaptcha-wrapper">
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
                          Generating Blog Ideas...
                        </>
                      ) : usageInfo.isLimitReached ? (
                        'Daily Limit Reached'
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                          </svg>
                          Generate {formData.numberOfIdeas} Blog Ideas
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ 
                        mainTopic: '',
                        numberOfIdeas: 5,
                        angle: 'Surprise me',
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
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">🎯 Generated Blog Topics</h2>
                  
                  {!formData.results ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">💡</span>
                      </div>
                      <p>Enter your topic above and click generate to get fresh blog topics</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <span className="text-sm text-gray-600">
                            Generated {formData.results.length} blog topic{formData.results.length > 1 ? 's' : ''} for "{formData.mainTopic}"
                          </span>
                          {formData.angle !== 'Surprise me' && (
                            <div className="text-xs text-gray-500 mt-1">
                              Angle: {formData.angle}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={copyAllResults}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Copy All
                        </button>
                      </div>
                      
                      <div className="space-y-3">
                        {formData.results.map((title: string, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 pr-4">
                                <div className="flex items-center space-x-3">
                                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                    {index + 1}
                                  </span>
                                  <h3 className="font-medium text-gray-900 leading-tight">{title}</h3>
                                </div>
                              </div>
                              <button
                                onClick={() => copyToClipboard(title)}
                                className="text-primary hover:text-primary/80 text-sm flex-shrink-0 ml-2"
                                title="Copy this topic"
                              >
                                📋
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tips Section */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-xl">
                  <div className="flex items-center mb-3">
                    <span className="text-blue-600 mr-2">💡</span>
                    <h3 className="text-blue-800 font-semibold">Blog Topic Tips</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Getting Better Topics:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Be specific with your topic (e.g., "Instagram marketing for restaurants")</li>
                        <li>• Use the angle selector to focus on specific content types</li>
                        <li>• Pick topics you're genuinely interested in writing about</li>
                        <li>• Consider your audience's skill level and interests</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">Pro Tips:</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Mix evergreen topics with trending ones</li>
                        <li>• Generate ideas in batches when you're creative</li>
                        <li>• These are starting points - add your unique perspective</li>
                        <li>• Don't overthink - sometimes obvious topics work best</li>
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
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
              <span>🧠</span>
              Generate Blog Topic Ideas When Your Brain Just Won't Cooperate
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  Okay, confession time. Last Tuesday, I sat at my laptop for THREE HOURS trying to think of what to write about. Three hours! I could've learned to juggle in that time.
                </p>
                
                <p>
                  You know that feeling? You've got a blog to feed, deadlines breathing down your neck, and your brain feels like it's been replaced with soggy cereal. I've been there way too many times.
                </p>
                
                <p>
                  I used to think writer's block was just part of being a blogger. Wrong! The pros don't sit around waiting for lightning to strike. They've got systems.
                </p>
                
                <p>
                  <strong>Our Blog Ideas Generator</strong> is basically that system in tool form. Type in your topic, hit a button, and suddenly you've got more blog ideas than you know what to do with.
                </p>
                
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
                  <p className="text-xl font-semibold text-primary text-center">
                    Tired of brain fog when you need ideas most? ↑ Use the tool above! ↑
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Blog Topics Feel Impossible */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
              <span>🤯</span>
              Why Coming Up With Blog Topics Feels Impossible Sometimes
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Here's what I've noticed after years of blogging and helping other people with content:
              </p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    <strong>We make it way harder than it needs to be.</strong> Like, unnecessarily complicated. Instead of just picking something useful to write about, we convince ourselves it needs to be this groundbreaking piece that changes the world.
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-700 mb-4">
                    <strong>We forget our readers are regular humans with regular problems.</strong> They don't need us to reinvent the wheel. They just want help with stuff they're struggling with.
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-700 mb-4">
                    <strong>We think everything's been covered already.</strong> Newsflash: it hasn't. And even if it has, your take on it matters. Your experience matters. Your weird way of explaining things might be exactly what someone needs to hear.
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-700 mb-4">
                    <strong>We get stuck in our own heads.</strong> This happens to me all the time. I start thinking about what I should write instead of what my readers actually want to know.
                  </p>
                </div>
              </div>
              
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
                <p className="text-gray-700 text-center font-medium">
                  Truth bomb: Your audience wants you to cover the basics. They want straightforward help with their problems. Stop trying to be clever and start being useful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How This Tool Helps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
              <span>🚀</span>
              How This Tool Actually Helps (Without the Fancy AI Buzzwords)
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Look, I could tell you about "advanced algorithms" and "machine learning," but honestly? Here's what really happens:
              </p>
              
              <p className="text-gray-700 mb-6">
                You tell it what you write about (like "small business marketing" or "vegan cooking"), and it spits out a bunch of topic ideas that people are actually interested in reading about.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span>🤖</span>
                    The smart part:
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">It knows what's trending in your space right now</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">It suggests different angles you probably hadn't thought of</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">It gives you topics people are actually searching for</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">It mixes up the format so you're not always writing "5 Tips for..." posts</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <span>👨‍💻</span>
                    The human part (that's you):
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Pick the ideas that excite you</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Add your own spin and personality</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Actually write something good</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Choose topics you can speak about with authority</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
                <p className="text-gray-700 text-center font-medium">
                  Simple? Yes. Effective? Also yes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Kind of Ideas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center gap-2">
              <span>📝</span>
              What Kind of Ideas You'll Actually Get
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🥖</span>
                  The Bread-and-Butter Stuff
                </h3>
                <p className="text-gray-600">
                  "How to" guides that solve real problems. "Complete beginner's guide to" posts for people just starting out. The foundational content every niche needs.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🔧</span>
                  Problem-Solving Posts
                </h3>
                <p className="text-gray-600">
                  "Why your [thing] isn't working and how to fix it" type content. These perform really well because they address specific pain points.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>⚖️</span>
                  Comparison and Review Content
                </h3>
                <p className="text-gray-600">
                  "X vs Y" posts, tool reviews, "best of" lists. People love these because they help with decision-making.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🎬</span>
                  Behind-the-Scenes and Personal Experience
                </h3>
                <p className="text-gray-600">
                  "What I learned when I..." or "My experience with..." posts. These build connection and trust with your audience.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>📈</span>
                  Current Events and Trend Commentary
                </h3>
                <p className="text-gray-600">
                  What's happening in your industry right now? What should people know about the latest changes or updates?
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mt-8">
              <p className="text-gray-700 text-center font-medium">
                The generator mixes all these up so you're not stuck writing the same type of post over and over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use It */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
              <span>📋</span>
              How to Use It (It's Stupidly Simple)
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 1:</strong> Type in your main topic or keyword
                </h3>
                <p className="text-gray-600">
                  Could be broad like "fitness" or specific like "home workouts for busy moms."
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 2:</strong> Hit generate and watch the magic happen
                </h3>
                <p className="text-gray-600">
                  You'll get a list of topic ideas, usually 15-25 of them.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 3:</strong> Scan through and save the ones that make you go "ooh, yes!"
                </h3>
                <p className="text-gray-600">
                  Don't overthink it. If an idea sparks something in your brain, grab it.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 4:</strong> Start writing
                </h3>
                <p className="text-gray-600">
                  Pick your favorite and just start. Don't wait for perfect conditions or more research. Just write.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  <strong>Step 5:</strong> Come back when you need more ideas
                </h3>
                <p className="text-gray-600">
                  The tool's always here when inspiration runs dry.
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl mt-8">
              <p className="text-gray-700">
                <strong>Pro tip I learned the hard way:</strong> Generate ideas in batches when you're feeling creative. Don't wait until you're desperate and deadline-stressed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses This */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center gap-2">
              <span>👥</span>
              Who Actually Uses This Thing?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>😤</span>
                  Bloggers Who Are Tired of Struggling
                </h3>
                <p className="text-gray-600">
                  Anyone who's ever sat staring at a blank screen wondering what the hell to write about next.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🏢</span>
                  Small Business Owners
                </h3>
                <p className="text-gray-600">
                  People who know they should be blogging but don't have time to brainstorm topics on top of everything else they're doing.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>✍️</span>
                  Content Creators and Freelancers
                </h3>
                <p className="text-gray-600">
                  Writers who need a steady stream of ideas for their own blogs or client work.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🎯</span>
                  Marketing Teams
                </h3>
                <p className="text-gray-600">
                  Groups that need to keep content calendars full without spending entire meetings just trying to think of topics.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🧱</span>
                  Anyone Who's Ever Had Writer's Block
                </h3>
                <p className="text-gray-600">
                  If you've ever procrastinated on writing because you couldn't think of what to write about, this tool is for you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Situations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center gap-2">
              <span>🆘</span>
              Real Situations Where This Tool Saves Your Sanity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🚨</span>
                  "I Need to Post Tomorrow and I've Got Nothing"
                </h3>
                <p className="text-gray-600">
                  Panic mode activated? Generate some ideas right now, pick one that speaks to you, and start writing. Crisis averted.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🔄</span>
                  "I Feel Like I've Written About Everything in My Niche"
                </h3>
                <p className="text-gray-600">
                  You haven't. The generator will prove it by showing you angles and subtopics you totally forgot about.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>📅</span>
                  "My Content Calendar Is a Disaster Zone"
                </h3>
                <p className="text-gray-600">
                  Spend 20 minutes generating ideas and you can plan out weeks of content. Future you will thank present you.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>❓</span>
                  "I Don't Know What My Readers Want"
                </h3>
                <p className="text-gray-600">
                  The tool suggests topics based on what people are actually searching for, not just what sounds interesting to you.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>😴</span>
                  "I'm Bored Writing the Same Stuff Over and Over"
                </h3>
                <p className="text-gray-600">
                  Mix up your content with different formats and fresh angles on familiar topics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting the Most Bang */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center gap-2">
              <span>💰</span>
              Getting the Most Bang for Your Buck
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>❤️</span>
                  Pick Topics You Actually Care About
                </h3>
                <p className="text-gray-600">
                  Don't write about stuff just because it might be popular. Write about things you have opinions on, experience with, or genuine interest in.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>📚</span>
                  Know Your Audience's Skill Level
                </h3>
                <p className="text-gray-600">
                  Are you talking to complete beginners or people who already know the basics? Match your topic choice to where your readers are at.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>⚖️</span>
                  Mix Evergreen with Trending
                </h3>
                <p className="text-gray-600">
                  Some topics will be relevant forever. Others are hot right now but might fizzle out. Having both keeps your blog balanced.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🎯</span>
                  Don't Overthink the "Perfect" Topic
                </h3>
                <p className="text-gray-600">
                  Sometimes the most obvious topic is exactly what your readers need. Don't get too clever for your own good.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  <span>🎨</span>
                  Test Different Formats
                </h3>
                <p className="text-gray-600">
                  If you always write long guides, try a quick tips post. If you never do personal stories, experiment with one. Variety keeps things interesting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 flex items-center justify-center gap-2">
              <span>❓</span>
              Common Questions People Ask
            </h2>
            <div className="space-y-8">
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <span>📝</span>
                  What if someone else already wrote about my topic?
                </h3>
                <p className="text-gray-600">
                  So what? Your perspective is different. Your experience is unique. Your way of explaining things might be exactly what someone needs to finally "get it."
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <span>🎯</span>
                  Are these topics going to be unique to my blog?
                </h3>
                <p className="text-gray-600">
                  The generator gives suggestions based on what works in your niche. Other people might get similar ideas, but what you do with them is what makes them yours.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <span>✏️</span>
                  Can I change the suggested titles?
                </h3>
                <p className="text-gray-600">
                  Of course! These are starting points, not commandments. Tweak them to fit your voice and style.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <span>🔄</span>
                  How often should I generate new ideas?
                </h3>
                <p className="text-gray-600">
                  Whenever you're planning content. Some people batch it monthly, others prefer to generate as needed. Do whatever works for your workflow.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
                  <span>🤔</span>
                  What if I don't like any of the suggestions?
                </h3>
                <p className="text-gray-600">
                  Try different keywords or be more specific. Sometimes "social media marketing" gives you different results than "Instagram marketing for restaurants."
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
              <h2 className="text-3xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
                <span>🛠️</span>
                Explore Our Other SEO Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO and content tools designed to help you optimize your website, improve rankings, and create better content.
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
                <a href="/tools/ai-copywriter" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">💡</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Blog Ideas Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Never run out of blog topics with AI-powered idea generation.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
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
            <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
              <span>🚀</span>
              Ready to Never Run Out of Ideas Again?
            </h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Stop treating topic brainstorming like some mystical creative process that only works when the stars align. You need a system, and this tool is that system.
            </p>
            <p className="text-xl font-semibold mb-8">
              Whether you need one topic for tomorrow's deadline or fifty ideas to plan your next quarter, the generator has your back.
            </p>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                <span>📋</span>
                Get Started Right Now:
              </h3>
              <div className="space-y-4 text-lg">
                <div className="flex items-start justify-center space-x-3">
                  <span>🎯</span>
                  <div>
                    <strong>Use the Blog Ideas Generator above</strong><br/>
                    <em className="text-white/80">Generate unlimited topic ideas instantly - completely free</em>
                  </div>
                </div>
                <div className="flex items-start justify-center space-x-3">
                  <span>📱</span>
                  <div>
                    <strong>Works great on mobile too</strong><br/>
                    <em className="text-white/80">Generate ideas on the go when inspiration strikes</em>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <p className="text-xl font-bold mb-4">
                Never waste another hour staring at blank screens. Use SEOShouts' Blog Ideas Generator and always know what to write about next.
              </p>
              <p className="text-white/80 italic">
                Built by people who've been stuck for blog topics way too many times and got tired of it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Add CSS for reCAPTCHA responsiveness */}
      <style jsx global>{`
        .recaptcha-wrapper {
          overflow: hidden;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        @media only screen and (max-width: 575px) {
          .g-recaptcha {
            transform: scale(0.77);
            -webkit-transform: scale(0.77);
            transform-origin: 0 0;
            -webkit-transform-origin: 0 0;
            margin-bottom: -20px;
          }
        }

        @media only screen and (max-width: 360px) {
          .g-recaptcha {
            transform: scale(0.70);
            -webkit-transform: scale(0.70);
            transform-origin: 0 0;
            -webkit-transform-origin: 0 0;
          }
        }
      `}</style>
    </div>
  )
}

export default BlogIdeasGeneratorTool
