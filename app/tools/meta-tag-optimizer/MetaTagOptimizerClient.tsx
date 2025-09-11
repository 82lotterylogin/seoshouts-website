'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

export default function MetaTagOptimizerClient() {
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
<meta name="googlebot" content="index, follow" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="language" content="English" />
<meta name="revisit-after" content="1 days" />
<meta name="distribution" content="global" />
<meta name="rating" content="general" />
<meta http-equiv="Cache-Control" content="public" />`
  }

  // Copy to clipboard
  const copyToClipboard = () => {
    const metaTags = generateMetaTags()
    navigator.clipboard.writeText(metaTags).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Calculate character counts and status
  const getTitleStatus = () => {
    const length = form.title.length
    if (length === 0) return { color: 'text-gray-400', message: 'Enter a title' }
    if (length < 30) return { color: 'text-yellow-600', message: 'Too short (30-60 chars recommended)' }
    if (length <= 60) return { color: 'text-green-600', message: 'Optimal length' }
    return { color: 'text-red-600', message: 'Too long (may be truncated)' }
  }

  const getDescriptionStatus = () => {
    const length = form.description.length
    if (length === 0) return { color: 'text-gray-400', message: 'Enter a description' }
    if (length < 120) return { color: 'text-yellow-600', message: 'Too short (120-160 chars recommended)' }
    if (length <= 160) return { color: 'text-green-600', message: 'Optimal length' }
    return { color: 'text-red-600', message: 'Too long (may be truncated)' }
  }

  const titleStatus = getTitleStatus()
  const descriptionStatus = getDescriptionStatus()

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Tool Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Input Form */}
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    📝
                  </span>
                  Page Information
                </h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Page Title *
                    </label>
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => setForm({...form, title: e.target.value})}
                      placeholder="Enter your page title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-sm ${titleStatus.color}`}>
                        {titleStatus.message}
                      </span>
                      <span className="text-sm text-gray-500">
                        {form.title.length}/60
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Meta Description *
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({...form, description: e.target.value})}
                      rows={3}
                      placeholder="Enter your meta description..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-sm ${descriptionStatus.color}`}>
                        {descriptionStatus.message}
                      </span>
                      <span className="text-sm text-gray-500">
                        {form.description.length}/160
                      </span>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Keywords
                    </label>
                    <input
                      type="text"
                      value={form.keywords}
                      onChange={(e) => setForm({...form, keywords: e.target.value})}
                      placeholder="keyword1, keyword2, keyword3..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Separate keywords with commas
                    </p>
                  </div>

                  {/* URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Page URL *
                    </label>
                    <input
                      type="url"
                      value={form.url}
                      onChange={(e) => setForm({...form, url: e.target.value})}
                      placeholder="https://example.com/page"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={form.author}
                      onChange={(e) => setForm({...form, author: e.target.value})}
                      placeholder="Author name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Viewport */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Viewport
                    </label>
                    <select
                      value={form.viewport}
                      onChange={(e) => setForm({...form, viewport: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="width=device-width, initial-scale=1">Responsive (Recommended)</option>
                      <option value="width=1024">Fixed Width (1024px)</option>
                      <option value="width=768">Tablet Width (768px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SERP Preview & Output */}
              <div className="space-y-8">
                
                {/* SERP Preview */}
                {form.title && form.description && (
                  <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                        👁️
                      </span>
                      SERP Preview
                    </h2>
                    
                    <div className="bg-gray-50 rounded-lg p-6 border">
                      <div className="max-w-lg">
                        <h3 className="text-lg font-medium text-blue-600 hover:underline cursor-pointer mb-1 truncate">
                          {form.title || 'Your Page Title'}
                        </h3>
                        <p className="text-sm text-green-700 mb-2 truncate">
                          {form.url} ▼
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {form.description || 'Your meta description will appear here...'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      💡 This is how your page will appear in Google search results
                    </div>
                  </div>
                )}

                {/* Generated Meta Tags */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      🏷️
                    </span>
                    Generated Meta Tags
                  </h2>
                  
                  <div className="bg-gray-900 rounded-lg p-6 relative">
                    <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
                      {form.title || form.description ? generateMetaTags() : '<!-- Enter title and description to generate meta tags -->'}
                    </pre>
                    
                    {(form.title && form.description) && (
                      <button
                        onClick={copyToClipboard}
                        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                      >
                        <span>{copied ? '✅ Copied!' : '📋 Copy'}</span>
                      </button>
                    )}
                  </div>
                  
                  {/* reCAPTCHA */}
                  <div className="mt-6 flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                      onChange={handleCaptchaChange}
                      theme="light"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Breadcrumb */}
      <ToolBreadcrumb toolName="Meta Tag Optimizer" toolSlug="meta-tag-optimizer" />

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
                Meta Tag Generator & Optimizer
              </span>
              <br />
              <span className="text-primary">Create SEO-Perfect Meta Tags</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generate Optimized Meta Tags for Better SEO</h2>
              <p>
                Create compelling title tags and meta descriptions that get clicked. Our free tool includes real-time SERP preview, character count validation, and generates complete meta tag code for your website.
              </p>
              <p>
                Perfect for SEO professionals, web developers, and content creators who want to optimize their pages for search engines and improve click-through rates from Google.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Live SERP Preview
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Character Count Validation
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Complete Meta Tag Code
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Perfect for Every Website</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-3xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Business Websites</h3>
                <p className="text-gray-600">Optimize your company pages, service descriptions, and product listings for better search visibility and higher click-through rates.</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="text-3xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">eCommerce Stores</h3>
                <p className="text-gray-600">Create compelling product page meta tags that drive more organic traffic and increase sales from search engines.</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Blog Content</h3>
                <p className="text-gray-600">Optimize blog posts and articles with meta tags that accurately describe your content and attract more readers.</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-3xl mb-4">📄</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Landing Pages</h3>
                <p className="text-gray-600">Create high-converting meta tags for landing pages that improve both SEO performance and user engagement.</p>
              </div>
              
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                <div className="text-3xl mb-4">📰</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">News & Media</h3>
                <p className="text-gray-600">Generate compelling meta tags for news articles and media content that drive engagement and social sharing.</p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">SEO Agencies</h3>
                <p className="text-gray-600">Streamline your meta tag optimization process for client websites with real-time preview and validation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Explanation Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How Our Meta Tag Optimizer Works</h2>
            
            <div className="space-y-12">
              
              {/* Process Steps */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Enter Your Content</h3>
                  <p className="text-gray-600">Input your page title, meta description, keywords, and URL. Our tool provides real-time character count and optimization suggestions.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👁️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">2. Preview SERP Appearance</h3>
                  <p className="text-gray-600">See exactly how your page will appear in Google search results with our live SERP preview feature.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">3. Generate Complete Code</h3>
                  <p className="text-gray-600">Get ready-to-use HTML meta tag code including Open Graph and Twitter Card tags for social media sharing.</p>
                </div>
              </div>
              
              {/* Features */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Advanced Features</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Smart Character Validation</h4>
                        <p className="text-gray-600">Real-time validation ensures your titles (30-60 chars) and descriptions (120-160 chars) are optimal length.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Complete Meta Tag Set</h4>
                        <p className="text-gray-600">Generates essential meta tags, Open Graph tags for social sharing, and Twitter Card markup.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Live SERP Preview</h4>
                        <p className="text-gray-600">See exactly how your page will appear in Google search results before publishing.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">4</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">SEO Best Practices</h4>
                        <p className="text-gray-600">Built-in optimization guidelines help you create meta tags that follow SEO best practices.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">5</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">One-Click Copy</h4>
                        <p className="text-gray-600">Copy the generated HTML code to your clipboard with a single click for easy implementation.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold">6</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Social Media Ready</h4>
                        <p className="text-gray-600">Includes Open Graph and Twitter Card tags for optimal social media sharing appearance.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Meta Tag Benefits */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">Why Meta Tags Matter for SEO</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">Search Engine Benefits</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span><strong>Better Rankings:</strong> Well-crafted meta tags help search engines understand your content</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span><strong>Higher CTR:</strong> Compelling descriptions increase click-through rates from search results</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span><strong>Rich Snippets:</strong> Proper meta tags can trigger enhanced search result features</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">User Experience Benefits</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span><strong>Clear Expectations:</strong> Users know what to expect before clicking your link</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span><strong>Better Sharing:</strong> Social media platforms use meta tags for link previews</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        <span><strong>Professional Appearance:</strong> Complete meta tags make your site look more credible</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Are meta tags really important for SEO?</h3>
                <p className="text-gray-600">Yes, absolutely! Meta tags directly impact click-through rates and help search engines understand your content.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Can I use this for client projects?</h3>
                <p className="text-gray-600">Absolutely! It's great for agencies, freelancers, and professionals optimizing client websites.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">What's the ideal title tag length?</h3>
                <p className="text-gray-600">Keep titles between 30-60 characters. Our tool shows real-time character counts with color-coded validation.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">How do I implement the generated code?</h3>
                <p className="text-gray-600">Copy the HTML code and paste it in your page's &lt;head&gt; section, or use SEO plugins like Yoast.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Do I need keywords in meta descriptions?</h3>
                <p className="text-gray-600">Include your primary keyword naturally, but write for humans first. Avoid keyword stuffing.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Are social media tags included?</h3>
                <p className="text-gray-600">Yes, we generate Open Graph and Twitter Card tags for optimal social media sharing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Explore Our Other SEO Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">On-Page SEO Analyzer</h3>
                <p className="text-gray-600 mb-4">Comprehensive analysis of your webpage's SEO elements including meta tags, headings, content structure, and technical factors.</p>
                <a href="/tools/on-page-seo-analyzer" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Try Tool →
                </a>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-gray-600 mb-4">Analyze keyword density and frequency in your content to optimize for target keywords without over-optimization.</p>
                <a href="/tools/keyword-density-analyzer" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Try Tool →
                </a>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">🏗️</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Schema Generator</h3>
                <p className="text-gray-600 mb-4">Generate structured data markup for better search engine understanding and rich snippet opportunities.</p>
                <a href="/tools/schema-generator" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Try Tool →
                </a>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">🤖</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Robots.txt Generator</h3>
                <p className="text-gray-600 mb-4">Create and optimize your robots.txt file to control how search engines crawl your website.</p>
                <a href="/tools/robots-txt-generator" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Try Tool →
                </a>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">XML Sitemap Generator</h3>
                <p className="text-gray-600 mb-4">Generate XML sitemaps to help search engines discover and index all your important pages.</p>
                <a href="/tools/xml-sitemap-generator" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Try Tool →
                </a>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl mb-4">✍️</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">AI Copywriter</h3>
                <p className="text-gray-600 mb-4">Generate compelling copy for ads, product descriptions, and marketing content using AI technology.</p>
                <a href="/tools/ai-copywriter" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold">
                  Try Tool →
                </a>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <a 
                href="/tools" 
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                View All SEO Tools
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Optimize Your Meta Tags?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Join thousands of SEO professionals and website owners who use our free meta tag optimizer to improve their search rankings and click-through rates.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="text-lg font-semibold mb-2">Better CTR</h3>
                <p className="text-primary-200">Increase click-through rates with optimized meta descriptions</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-primary-200">Generate and preview meta tags in real-time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🆓</div>
                <h3 className="text-lg font-semibold mb-2">Completely Free</h3>
                <p className="text-primary-200">No limits, no registration required</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#tool"
                className="px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-gray-100 transition shadow-xl"
              >
                Start Optimizing Now
              </a>
              <a
                href="/contact"
                className="px-8 py-4 bg-white/20 border border-white text-white rounded-xl font-bold hover:bg-white/30 transition"
              >
                Get Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}