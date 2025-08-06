'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function MetaTagOptimizer() {
  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Free Meta Tag Generator and Optimizer Tool | SEO Shouts'
    
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', 'Create compelling title tags and meta descriptions that get clicked. Free meta tag generator with real-time SERP preview and optimization tips.')
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'meta tag generator, title tag optimizer, meta description tool, SERP preview, SEO meta tags')
  }, [])

  const [form, setForm] = useState({
    title: '',
    description: '',
    keywords: '',
    url: 'https://example.com',
    author: '',
    viewport: 'width=device-width, initial-scale=1'
  })

  const [copied, setCopied] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Generate optimized meta tags
  const generateMetaTags = () => {
    const escapedTitle = form.title.replace(/"/g, '&quot;')
    const escapedDescription = form.description.replace(/"/g, '&quot;')
    const escapedKeywords = form.keywords.replace(/"/g, '&quot;')
    const escapedAuthor = form.author.replace(/"/g, '&quot;')
    const escapedUrl = form.url.replace(/"/g, '&quot;')

    return `<!-- Essential Meta Tags -->
<title>${escapedTitle}</title>
<meta name="description" content="${escapedDescription}" />
<meta name="keywords" content="${escapedKeywords}" />
<meta name="author" content="${escapedAuthor}" />
<meta name="viewport" content="${form.viewport}" />
<link rel="canonical" href="${escapedUrl}" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="${escapedUrl}" />
<meta property="og:title" content="${escapedTitle}" />
<meta property="og:description" content="${escapedDescription}" />
<meta property="og:image" content="${escapedUrl}/og-image.jpg" />

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="${escapedUrl}" />
<meta property="twitter:title" content="${escapedTitle}" />
<meta property="twitter:description" content="${escapedDescription}" />
<meta property="twitter:image" content="${escapedUrl}/twitter-image.jpg" />

<!-- Additional SEO Meta Tags -->
<meta name="robots" content="index, follow" />
<meta name="language" content="English" />
<meta name="revisit-after" content="7 days" />`
  }

  const copyToClipboard = async () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }

    try {
      await navigator.clipboard.writeText(generateMetaTags())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      keywords: '',
      url: 'https://example.com',
      author: '',
      viewport: 'width=device-width, initial-scale=1'
    })
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  // Get title length status
  const getTitleStatus = () => {
    const length = form.title.length
    if (length === 0) return { color: 'text-gray-400', message: 'Enter a title' }
    if (length < 30) return { color: 'text-orange-600', message: 'Too short' }
    if (length <= 60) return { color: 'text-green-600', message: 'Optimal' }
    return { color: 'text-red-600', message: 'Too long' }
  }

  // Get description length status
  const getDescriptionStatus = () => {
    const length = form.description.length
    if (length === 0) return { color: 'text-gray-400', message: 'Enter a description' }
    if (length < 120) return { color: 'text-orange-600', message: 'Too short' }
    if (length <= 160) return { color: 'text-green-600', message: 'Optimal' }
    return { color: 'text-red-600', message: 'Too long' }
  }

  const titleStatus = getTitleStatus()
  const descriptionStatus = getDescriptionStatus()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free SEO Tool
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Meta Tag Generator and Optimizer Tool
              </span>
              <br />
              <span className="text-primary">Perfect Your Title Tags & Meta Descriptions Instantly</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Search Snippets That Actually Get Clicked</h2>
              <p>
                Ever noticed how some search results just grab your attention while others get completely ignored? It's not magic - it's good meta tags.
              </p>
              <p>
                Your title tag and meta description are basically your website's first impression. Get them wrong, and people scroll right past you. Get them right, and you'll see your click-through rates jump.
              </p>
              <p>
                <strong>Our Meta Tag Optimizer</strong> helps you write compelling, properly-sized meta tags that look great on both desktop and mobile. Best part? It's completely free.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Real-time Preview
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Human Verified
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Social Media Tags
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Meta Tag Generator</h2>
                
                <div className="space-y-6">
                  {/* Page Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                      Page Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={form.title}
                      onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter your SEO-optimized page title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      maxLength={70}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-xs ${titleStatus.color}`}>
                        {titleStatus.message}
                      </p>
                      <p className={`text-xs ${form.title.length > 60 ? 'text-red-600' : 'text-gray-500'}`}>
                        {form.title.length}/60 characters
                      </p>
                    </div>
                  </div>

                  {/* Meta Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Description *
                    </label>
                    <textarea
                      id="description"
                      value={form.description}
                      onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Write a compelling meta description that encourages clicks"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                      maxLength={180}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-xs ${descriptionStatus.color}`}>
                        {descriptionStatus.message}
                      </p>
                      <p className={`text-xs ${form.description.length > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                        {form.description.length}/160 characters
                      </p>
                    </div>
                  </div>

                  {/* Meta Keywords */}
                  <div>
                    <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Keywords
                    </label>
                    <input
                      type="text"
                      id="keywords"
                      value={form.keywords}
                      onChange={(e) => setForm(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="SEO, meta tags, optimization, search engine"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Separate keywords with commas</p>
                  </div>

                  {/* URL */}
                  <div>
                    <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
                      Page URL
                    </label>
                    <input
                      type="url"
                      id="url"
                      value={form.url}
                      onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="https://example.com/page"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>

                  {/* Human Verification Section */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Please verify that you're not a robot to generate your meta tags.
                    </p>
                    
                    <div className="mb-4">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                        onChange={handleCaptchaChange}
                        theme="light"
                      />
                    </div>

                    {isVerified && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center">
                        <span className="text-green-600 mr-2">✅</span>
                        <span className="text-sm font-medium text-green-800">Verification successful! You can now generate meta tags.</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={copyToClipboard}
                      disabled={!form.title || !form.description || !isVerified}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      {copied ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          {!isVerified ? 'Complete Verification First' : 'Copy Meta Tags'}
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-6">
                {/* SERP Preview */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">SERP Preview</h2>
                  
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="space-y-1">
                      <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                        {form.title || 'Your Page Title Will Appear Here'}
                      </div>
                      <div className="text-green-700 text-sm">
                        {form.url}
                      </div>
                      <div className="text-gray-600 text-sm leading-relaxed">
                        {form.description || 'Your meta description will appear here. This is what users will see in search engine results.'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-500">
                    This is how your page will appear in Google search results.
                  </div>
                </div>

                {/* Generated Code */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Generated Meta Tags</h2>
                  
                  {form.title && form.description && isVerified ? (
                    <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
                      <pre className="text-green-400 text-sm leading-relaxed">
                        <code>{generateMetaTags()}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📄</span>
                      </div>
                      <p>
                        {!form.title || !form.description 
                          ? 'Fill in the title and description to generate meta tags' 
                          : 'Complete human verification to view generated meta tags'
                        }
                      </p>
                    </div>
                  )}

                  {/* SEO Tips & Character Limits Section */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mt-6 rounded-r-xl">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">💡</span>
                      <h3 className="text-blue-800 font-semibold">SEO Tips & Character Limits</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Title Tag Guidelines:</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Optimal length: <strong>50-60 characters</strong></li>
                          <li>• Maximum: 70 characters (avoid truncation)</li>
                          <li>• Include main keyword near the beginning</li>
                          <li>• Make it compelling and clickable</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">Meta Description Tips:</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Optimal length: <strong>150-160 characters</strong></li>
                          <li>• Maximum: 180 characters</li>
                          <li>• Include a clear call-to-action</li>
                          <li>• Match user search intent</li>
                        </ul>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What This Tool Does Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">What This Tool Actually Does</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Think of this as your personal meta tag assistant. You paste in your content or URL, and it shows you exactly how your title and description will appear in Google search results.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's what happens:</h3>

              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">See a live preview of your search snippet</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Check if your tags are too long (they'll get cut off)</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Make sure your important keywords are included</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Preview how it looks on mobile vs desktop</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Generate social media tags for Facebook and Twitter</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Get suggestions for improvement</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Copy the optimized HTML code</span>
                </li>
              </ul>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  No guesswork. No surprises. Just clear feedback on how to make your meta tags better.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features That Make This Tool Useful</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Real-Time Search Preview */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🔍 Real-Time Search Preview</h3>
                <p className="text-gray-600 mb-4">Watch your meta tags come to life as you type. See exactly how they'll appear in Google, including where text gets cut off.</p>
              </div>

              {/* Length Checking */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📏 Length Checking</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Title tags: Stay under 60 characters to avoid truncation</li>
                  <li>• Meta descriptions: Keep it between 150-160 characters</li>
                  <li>• Pixel width tracking for more precise optimization</li>
                </ul>
              </div>

              {/* Social Media Integration */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📱 Social Media Integration</h3>
                <p className="text-gray-600">Automatically generate Open Graph tags for Facebook and Twitter Card tags so your content looks great when shared.</p>
              </div>

              {/* Export Ready Code */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">💻 Export Ready Code</h3>
                <p className="text-gray-600">Copy perfectly formatted HTML meta tags ready to paste into your website's header.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">How to Use the Meta Tag Optimizer</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                  <div>
                    <p className="text-gray-700"><strong>Step 1:</strong> Edit your title tag and meta description in the provided fields</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                  <div>
                    <p className="text-gray-700"><strong>Step 2:</strong> Watch the live preview update as you type</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                  <div>
                    <p className="text-gray-700"><strong>Step 3:</strong> Check the character count and mobile preview</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                  <div>
                    <p className="text-gray-700"><strong>Step 4:</strong> Complete the human verification</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">5</span>
                  <div>
                    <p className="text-gray-700"><strong>Step 5:</strong> Copy the generated HTML code and add it to your website</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                <p className="text-gray-700 text-lg font-semibold">
                  <strong>That's it!</strong> The whole process takes about 2 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Meta Tags Matter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Your Meta Tags Matter More Than You Think</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* First Impressions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">👁️ First Impressions Count</h3>
                <p className="text-gray-600">Your meta tags are often the first thing potential visitors see. A boring title like "Home Page" won't cut it.</p>
              </div>

              {/* Click-Through Rates */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📈 Click-Through Rates Impact Rankings</h3>
                <p className="text-gray-600">Google pays attention to how often people click your results. Better meta tags = more clicks = better rankings over time.</p>
              </div>

              {/* Mobile Optimization */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📱 Mobile Optimization</h3>
                <p className="text-gray-600">With most searches happening on mobile, your meta tags need to work perfectly on small screens.</p>
              </div>

              {/* Social Sharing */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🔗 Social Sharing</h3>
                <p className="text-gray-600">When someone shares your page on Facebook or Twitter, your meta tags control how it looks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Common Meta Tag Mistakes This Tool Helps You Avoid</h2>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Writing titles that get cut off</strong> - Our character counter prevents this</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Forgetting to include keywords</strong> - We highlight keyword placement</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Using the same meta tags on multiple pages</strong> - Each page needs unique tags</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Writing meta descriptions that don't match content</strong> - Preview helps you stay relevant</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Ignoring mobile display</strong> - We show both desktop and mobile previews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Meta Tag Best Practices Built Into the Tool</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Title Tag Guidelines */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">🏷️ Title Tag Guidelines</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Include your main keyword near the beginning</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Keep it under 60 characters</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Make it compelling and clickable</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Include your brand name when space allows</span>
                  </li>
                </ul>
              </div>

              {/* Meta Description Tips */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">📝 Meta Description Tips</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Write 150-160 characters max</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Include a clear call-to-action</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Use your target keyword naturally</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Summarize what visitors will find on the page</span>
                  </li>
                </ul>
              </div>

              {/* Social Media Optimization */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">📱 Social Media Optimization</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    <span>Use eye-catching titles for social shares</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    <span>Include relevant hashtags in Twitter Cards</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-600 mr-2 mt-1">•</span>
                    <span>Choose the right image dimensions for previews</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Use Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Who Should Use This Tool?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                <div className="text-3xl mb-4">🏠</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Website Owners</h3>
                <p className="text-gray-600">Optimize your site's search appearance without needing technical knowledge.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Content Marketers</h3>
                <p className="text-gray-600">Create compelling snippets that increase blog traffic and engagement.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">SEO Professionals</h3>
                <p className="text-gray-600">Speed up your optimization workflow with instant previews and suggestions.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 text-center">
                <div className="text-3xl mb-4">💻</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Web Developers</h3>
                <p className="text-gray-600">Generate clean, properly formatted meta tag code for client websites.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 text-center">
                <div className="text-3xl mb-4">🏪</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Small Business Owners</h3>
                <p className="text-gray-600">Improve your local search visibility with better meta tags.</p>
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
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is this tool really free?</h3>
                <p className="text-gray-600">Yes, completely free. No signup required, no hidden fees.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Do meta tags directly affect my rankings?</h3>
                <p className="text-gray-600">Title tags are a direct ranking factor. Meta descriptions don't directly impact rankings but significantly affect click-through rates.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How often should I update my meta tags?</h3>
                <p className="text-gray-600">Update them when you refresh content, target new keywords, or if your current tags aren't performing well.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I use this for multiple languages?</h3>
                <p className="text-gray-600">Absolutely. The tool works with any language and character set.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Does this tool store my data?</h3>
                <p className="text-gray-600">No, everything is processed in your browser. We don't store or track your content.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Why is human verification required?</h3>
                <p className="text-gray-600">We use reCAPTCHA to prevent automated abuse of our free tools while ensuring legitimate users have a great experience.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More SEO Tools Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-indigo/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Explore Our Other SEO Tools</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
              </p>
            </div>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Optimize your keyword usage and avoid over-optimization penalties.</p>
                <a href="/tools/keyword-density-analyzer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions for better CTR.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">More Tools Coming</h3>
                <p className="text-sm text-gray-600 mb-4">Schema generator, sitemap analyzer, and many more professional SEO tools.</p>
                <a href="/tools" className="text-primary font-medium hover:underline">
                  See All →
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a 
                href="/tools"
                className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🛠️</span>
                Browse All SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">
                All tools are 100% free • No signup required • Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Optimizing Your Meta Tags Now</h2>
            <p className="text-lg mb-8 opacity-90">
              Ready to create meta tags that actually get clicked? Our tool makes it simple to write compelling, properly-optimized title tags and meta descriptions that work on all devices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Use the Meta Tag Optimizer Tool →
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-semibold mb-2">No signup required. Takes 2 minutes. Completely free.</p>
            </div>
            
            <p className="text-sm opacity-80">
              <em>Built by the SEO experts at SEO Shouts to help you create better search snippets and drive more traffic to your website.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
