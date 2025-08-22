'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
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

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            Meta Tag Generator & Optimizer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create compelling title tags and meta descriptions that get clicked. Free tool with real-time SERP preview and optimization tips.
          </p>
        </div>

        {/* SEO Tips */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 SEO Optimization Tips
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Title Tag Best Practices</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Keep between 30-60 characters
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Include your primary keyword
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Make it compelling and clickable
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Unique for every page
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Meta Description Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Keep between 120-160 characters
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Include a call-to-action
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Summarize page content accurately
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Include relevant keywords naturally
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}