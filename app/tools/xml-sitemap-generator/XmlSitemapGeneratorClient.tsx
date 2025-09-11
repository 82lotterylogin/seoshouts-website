'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

interface SitemapUrl {
  url: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  type: 'page'
}

export default function XmlSitemapGeneratorClient() {
  // Load usage count from session storage
  useEffect(() => {
    const savedUsageCount = sessionStorage.getItem('sitemapGeneratorUsage')
    if (savedUsageCount) {
      setUsageCount(parseInt(savedUsageCount))
    }
  }, [])

  // Input mode selection
  const [inputMode, setInputMode] = useState<'manual' | 'crawl'>('crawl')
  
  // Manual URL inputs
  const [manualUrls, setManualUrls] = useState('')
  
  // Crawl inputs
  const [crawlUrl, setCrawlUrl] = useState('')
  const [maxPages, setMaxPages] = useState(100)
  const [crawlDepth, setCrawlDepth] = useState(3)
  
  // Settings
  const [changeFreq, setChangeFreq] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [isGenerating, setIsGenerating] = useState(false)
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrl[]>([])
  const [sitemapXML, setSitemapXML] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // CAPTCHA states
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit] = useState(5)

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Generate sitemap from manual URLs or crawling
  const generateSitemap = async () => {
    if (!isVerified) {
      setError('Please complete the human verification first!')
      return
    }

    // Check usage limit
    if (usageCount >= usageLimit) {
      setError(`You've reached the limit of ${usageLimit} sitemap generations per session. Please refresh the page to continue.`)
      return
    }

    setError('')
    setIsGenerating(true)
    setSitemapUrls([])
    setSitemapXML('')

    try {
      let urls: string[] = []

      if (inputMode === 'manual') {
        // Manual URL input
        if (!manualUrls.trim()) {
          setError('Please enter URLs to include in the sitemap')
          setIsGenerating(false)
          return
        }

        urls = manualUrls
          .split('\n')
          .map(url => url.trim())
          .filter(url => url.length > 0)

        // Check if URLs exceed 2000 limit BEFORE processing
        if (urls.length > 2000) {
          setError(`Too many URLs! You've entered ${urls.length} URLs, but the maximum allowed is 2,000. Please remove ${urls.length - 2000} URLs.`)
          setIsGenerating(false)
          return
        }
      } else {
        // Crawl mode
        if (!crawlUrl.trim()) {
          setError('Please enter a website URL to crawl')
          setIsGenerating(false)
          return
        }

        // Validate the crawl URL
        try {
          new URL(crawlUrl)
        } catch {
          setError('Please enter a valid website URL (e.g., https://example.com)')
          setIsGenerating(false)
          return
        }

        // Crawl the website
        urls = await crawlWebsite(crawlUrl, maxPages, crawlDepth)
        
        if (urls.length === 0) {
          setError('No valid pages found. Please check the URL and try again.')
          setIsGenerating(false)
          return
        }
      }

      // Normalize and deduplicate URLs
      const normalizedUrls = new Set<string>()
      
      urls.forEach(url => {
        try {
          const urlObj = new URL(url)
          
          // Build normalized URL with consistent trailing slashes
          let normalizedUrl = urlObj.origin + urlObj.pathname
          
          // Ensure trailing slash for consistency (except for files with extensions)
          const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(urlObj.pathname)
          
          if (!hasFileExtension && !normalizedUrl.endsWith('/')) {
            normalizedUrl += '/'
          }
          
          // Add query parameters and hash if they exist
          if (urlObj.search) {
            normalizedUrl += urlObj.search
          }
          if (urlObj.hash) {
            normalizedUrl += urlObj.hash
          }
          
          normalizedUrls.add(normalizedUrl)
        } catch {
          // Skip invalid URLs
        }
      })

      const validUrls = Array.from(normalizedUrls)
      
      if (validUrls.length === 0) {
        setError('No valid URLs found. Please check your URLs and try again.')
        setIsGenerating(false)
        return
      }

      // Convert URLs to sitemap format
      const sitemapData: SitemapUrl[] = validUrls.map(url => {
        let priority = 0.5
        let changefreq: SitemapUrl['changefreq'] = changeFreq
        
        // Set priority based on URL type
        const path = new URL(url).pathname
        if (path === '/' || path === '') {
          priority = 1.0 // Homepage
          changefreq = 'daily'
        } else if (path.includes('/blog/') || path.includes('/news/')) {
          priority = 0.6
          changefreq = 'weekly'
        } else if (path.includes('/products/') || path.includes('/services/')) {
          priority = 0.8
          changefreq = 'monthly'
        }

        return {
          url,
          lastmod: new Date().toISOString().split('T')[0],
          changefreq,
          priority,
          type: 'page'
        }
      })

      setSitemapUrls(sitemapData)
      generateXML(sitemapData)
      
      // Increment usage count and save to session storage
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('sitemapGeneratorUsage', newUsageCount.toString())
    } catch (err) {
      setError('Failed to generate sitemap. Please try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Crawl website function
  const crawlWebsite = async (startUrl: string, maxPages: number, maxDepth: number): Promise<string[]> => {
    try {
      const response = await fetch('/api/crawl-website', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: startUrl,
          maxPages: maxPages,
          maxDepth: maxDepth,
          recaptchaToken: captchaValue
        })
      })

      const data = await response.json()
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Crawling failed')
      }

      return data.urls || []
    } catch (error) {
      console.error('Crawl error:', error)
      throw error
    }
  }

  const generateXML = (urls: SitemapUrl[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    
    urls.forEach(urlData => {
      xml += `  <url>\n`
      xml += `    <loc>${urlData.url}</loc>\n`
      xml += `    <lastmod>${urlData.lastmod}</lastmod>\n`
      xml += `    <changefreq>${urlData.changefreq}</changefreq>\n`
      xml += `    <priority>${urlData.priority.toFixed(1)}</priority>\n`
      xml += `  </url>\n`
    })
    
    xml += `</urlset>`
    setSitemapXML(xml)
  }

  const downloadSitemap = () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }

    const blob = new Blob([sitemapXML], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.xml'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }

    try {
      await navigator.clipboard.writeText(sitemapXML)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const resetForm = () => {
    setInputMode('crawl')
    setManualUrls('')
    setCrawlUrl('')
    setMaxPages(100)
    setCrawlDepth(3)
    setChangeFreq('weekly')
    setSitemapUrls([])
    setSitemapXML('')
    setError('')
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  // Count URLs for display (only for manual mode)
  const urlCount = inputMode === 'manual' ? manualUrls.split('\n').filter(url => url.trim().length > 0).length : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Software Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "XML Sitemap Generator",
            "description": "Create comprehensive XML sitemaps for search engines. Supports various content types and includes priority and frequency settings.",
            "url": "https://seoshouts.com/tools/xml-sitemap-generator",
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
              "Automated sitemap creation",
              "Priority & frequency settings",
              "Multi-format support",
              "URL validation",
              "Download functionality",
              "Bulk URL processing",
              "SEO optimization"
            ],
            "keywords": "XML sitemap, sitemap generator, search engine submission, SEO technical",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "bestRating": "5",
              "ratingCount": "923"
            },
            "softwareVersion": "2.0",
            "datePublished": "2024-02-10",
            "dateModified": "2024-08-19",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />
      

      {/* Tool Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">XML Sitemap Generator</h2>
                
                {/* Usage Counter Display */}
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-blue-600 mr-2">📊</span>
                      <span className="text-sm font-semibold text-blue-800">Session Usage</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-700">
                        {usageLimit - usageCount} / {usageLimit}
                      </div>
                      <div className="text-xs text-blue-600">generations remaining</div>
                    </div>
                  </div>
                  {usageCount >= usageLimit && (
                    <div className="mt-3 bg-orange-100 border border-orange-300 rounded-lg p-2">
                      <p className="text-orange-800 text-xs font-medium">
                        ⚠️ Session limit reached. Refresh page to continue.
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  {/* Input Mode Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      How would you like to create your sitemap? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div
                        onClick={() => setInputMode('crawl')}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          inputMode === 'crawl'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            inputMode === 'crawl' ? 'border-primary bg-primary' : 'border-gray-300'
                          }`}>
                            {inputMode === 'crawl' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-800">🤖 Automatic Crawling</h3>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">
                          Enter your website URL and let us crawl it automatically to find all pages
                        </p>
                        <div className="mt-2 ml-7">
                          <span className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                            Recommended
                          </span>
                        </div>
                      </div>

                      <div
                        onClick={() => setInputMode('manual')}
                        className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          inputMode === 'manual'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                            inputMode === 'manual' ? 'border-primary bg-primary' : 'border-gray-300'
                          }`}>
                            {inputMode === 'manual' && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                            )}
                          </div>
                          <h3 className="font-semibold text-gray-800">✏️ Manual Input</h3>
                        </div>
                        <p className="text-sm text-gray-600 ml-7">
                          Manually enter specific URLs you want to include in your sitemap
                        </p>
                        <div className="mt-2 ml-7">
                          <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                            Precise Control
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Crawl Mode Input */}
                  {inputMode === 'crawl' && (
                    <>
                      <div>
                        <label htmlFor="crawlUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                          Website URL to Crawl *
                        </label>
                        <input
                          type="url"
                          id="crawlUrl"
                          value={crawlUrl}
                          onChange={(e) => setCrawlUrl(e.target.value)}
                          placeholder="https://yourwebsite.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the main URL of your website. We'll automatically discover all linked pages.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="maxPages" className="block text-sm font-semibold text-gray-700 mb-2">
                            Maximum Pages to Crawl
                          </label>
                          <select
                            id="maxPages"
                            value={maxPages}
                            onChange={(e) => setMaxPages(parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          >
                            <option value={50}>50 pages</option>
                            <option value={100}>100 pages</option>
                            <option value={250}>250 pages</option>
                            <option value={500}>500 pages</option>
                            <option value={1000}>1,000 pages</option>
                            <option value={2000}>2,000 pages (max)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="crawlDepth" className="block text-sm font-semibold text-gray-700 mb-2">
                            Crawl Depth
                          </label>
                          <select
                            id="crawlDepth"
                            value={crawlDepth}
                            onChange={(e) => setCrawlDepth(parseInt(e.target.value))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          >
                            <option value={1}>1 level (homepage only)</option>
                            <option value={2}>2 levels</option>
                            <option value={3}>3 levels (recommended)</option>
                            <option value={4}>4 levels</option>
                            <option value={5}>5 levels (deep crawl)</option>
                          </select>
                          <p className="text-xs text-gray-500 mt-1">
                            How many clicks deep to follow links from your homepage
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-blue-800 mb-2">🤖 Automatic Crawling:</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Discovers pages automatically by following links</li>
                          <li>• Respects robots.txt files and meta tags</li>
                          <li>• Filters out non-indexable pages</li>
                          <li>• Perfect for most websites</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Manual Mode Input */}
                  {inputMode === 'manual' && (
                    <>
                      <div>
                        <label htmlFor="manualUrls" className="block text-sm font-semibold text-gray-700 mb-2">
                          Website URLs *
                        </label>
                        <textarea
                          id="manualUrls"
                          value={manualUrls}
                          onChange={(e) => setManualUrls(e.target.value)}
                          placeholder="Enter your website URLs, one per line:&#10;https://yourwebsite.com&#10;https://yourwebsite.com/about&#10;https://yourwebsite.com/contact&#10;https://yourwebsite.com/blog/post-1&#10;https://yourwebsite.com/products/product-1"
                          rows={12}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500">
                            Enter one URL per line (maximum 2,000 URLs)
                          </p>
                          <div className={`text-xs font-medium ${urlCount > 2000 ? 'text-red-600' : urlCount > 1800 ? 'text-yellow-600' : 'text-gray-500'}`}>
                            {urlCount}/2,000 URLs
                          </div>
                        </div>
                        {urlCount > 2000 && (
                          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2">
                            <p className="text-red-700 text-xs">
                              ⚠️ Too many URLs! Please remove {urlCount - 2000} URLs to proceed.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-orange-800 mb-2">✏️ Manual Input:</h3>
                        <ul className="text-sm text-orange-700 space-y-1">
                          <li>• Complete control over which pages to include</li>
                          <li>• Perfect for private or password-protected sites</li>
                          <li>• Good for new sites with few pages</li>
                          <li>• Requires you to list all URLs manually</li>
                        </ul>
                      </div>
                    </>
                  )}

                  {/* Change Frequency */}
                  <div>
                    <label htmlFor="changeFreq" className="block text-sm font-semibold text-gray-700 mb-2">
                      Default Change Frequency
                    </label>
                    <select
                      id="changeFreq"
                      value={changeFreq}
                      onChange={(e) => setChangeFreq(e.target.value as any)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">How often your content typically changes</p>
                  </div>

                  {/* Usage Counter & Limits Notice */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">📊 Usage & Limits:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Maximum 2,000 URLs per sitemap</li>
                      <li>• {usageLimit - usageCount} generations remaining this session</li>
                      <li>• Automatic priority optimization</li>
                      <li>• Google-compliant XML format</li>
                    </ul>
                    {usageCount >= usageLimit && (
                      <div className="mt-3 bg-orange-100 border border-orange-300 rounded-lg p-2">
                        <p className="text-orange-800 text-xs font-medium">
                          ⚠️ Session limit reached. Refresh page to continue.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Human Verification Section */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Please verify that you're not a robot to generate your XML sitemap.
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
                        <span className="text-sm font-medium text-green-800">Verification successful! You can now generate your sitemap.</span>
                      </div>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={generateSitemap}
                      disabled={isGenerating || (inputMode === 'manual' && (!manualUrls.trim() || urlCount > 2000)) || (inputMode === 'crawl' && !crawlUrl.trim()) || !isVerified || usageCount >= usageLimit}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Sitemap...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Generate Sitemap
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

              {/* Results Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  {inputMode === 'crawl' ? 'Crawled Sitemap Results' : 'Generated Sitemap'}
                </h2>
                
                {sitemapUrls.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🗺️</span>
                    </div>
                    <p>Add your website URLs and complete verification to generate a professional XML sitemap</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-green-700">{sitemapUrls.length}</div>
                        <div className="text-xs text-green-600">Total URLs</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <div className="text-lg font-bold text-blue-700">{Math.round(sitemapXML.length / 1024)}KB</div>
                        <div className="text-xs text-blue-600">File Size</div>
                      </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={copyToClipboard}
                        disabled={!isVerified}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isVerified
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {copied ? '✅ Copied!' : '📋 Copy XML'}
                      </button>
                      <button
                        onClick={downloadSitemap}
                        disabled={!isVerified}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isVerified
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        📥 Download
                      </button>
                    </div>

                    {/* Preview */}
                    <div className="bg-gray-900 rounded-xl p-4 h-64 overflow-y-auto">
                      <pre className="text-green-400 text-xs leading-relaxed whitespace-pre-wrap">
                        {sitemapXML.substring(0, 1000)}
                        {sitemapXML.length > 1000 && '\n... (truncated for preview)'}
                      </pre>
                    </div>

                    {/* URL List Preview */}
                    <div className="border rounded-lg p-4 max-h-32 overflow-y-auto">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Included URLs:</h3>
                      <div className="space-y-1 text-xs text-gray-600">
                        {sitemapUrls.slice(0, 10).map((url, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="truncate flex-1">{url.url}</span>
                            <span className="ml-2 text-gray-400">{url.priority}</span>
                          </div>
                        ))}
                        {sitemapUrls.length > 10 && (
                          <div className="text-gray-400 text-center">... and {sitemapUrls.length - 10} more URLs</div>
                        )}
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-blue-800 mb-2">📝 Next Steps:</h3>
                      <ol className="text-sm text-blue-700 space-y-1">
                        <li>1. Download the sitemap.xml file</li>
                        <li>2. Upload it to your website's root directory</li>
                        <li>3. Submit to Google Search Console</li>
                        <li>4. Add to Bing Webmaster Tools</li>
                        <li>5. Test at: yoursite.com/sitemap.xml</li>
                      </ol>
                    </div>

                    {/* Verification Required Notice */}
                    {!isVerified && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-2">🔒 Verification Required:</h3>
                        <p className="text-sm text-yellow-700">
                          Please complete the human verification above to download or copy your XML sitemap.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Breadcrumb */}
      <ToolBreadcrumb toolName="XML Sitemap Generator" toolSlug="xml-sitemap-generator" />

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
                Free XML Sitemap Generator Tool
              </span>
              <br />
              <span className="text-primary">Help Search Engines Find Every Page on Your Website</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Professional Sitemaps in Seconds (No Coding Required)</h2>
              <p>
                Here's a story that'll make you appreciate sitemaps: A friend launched her online store last year with 500 products. Three months later, she discovered that Google had only indexed 47 of her product pages. The rest? Invisible to search engines.
              </p>
              <p>
                Turns out, her website structure was so confusing that Google's crawlers gave up trying to find everything. One properly formatted XML sitemap later, and boom - all 500+ pages got indexed within two weeks.
              </p>
              <p>
                <strong>That's the power of a good sitemap.</strong>
              </p>
              <p>
                Most people think search engines automatically find every page on their website. Nope. If you've got a complex site structure, new pages, or just want to make sure nothing gets missed, you need an XML sitemap.
              </p>
              <p>
                <strong>Our XML Sitemap Generator</strong> creates professional, Google-approved sitemaps in seconds. No technical knowledge required.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Manual URL Input
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Up to 2,000 URLs
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Google-Approved Format
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's an XML Sitemap Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">What's an XML Sitemap (And Why Your Website Needs One)</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Think of an XML sitemap as a detailed map you give to Google saying, "Hey, here are all the important pages on my website. Please make sure you don't miss any of them."
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's what it actually does:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Lists every page you want search engines to find</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Tells them when each page was last updated</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Shows which pages are most important</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Helps new pages get discovered faster</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Prevents important content from being overlooked</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-6">
                <p className="text-gray-700">
                  <strong>Real talk:</strong> Small websites with good navigation might not desperately need one, but why take chances? Plus, if you've got more than 20-30 pages, a sitemap is basically mandatory.
                </p>
              </div>

              <p className="text-gray-700">
                <strong>The kicker?</strong> Google actually recommends having one, especially for larger sites, new websites, or sites that don't have many external links pointing to them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Generator Beats DIY Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Our Sitemap Generator Beats DIY</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Point, Click, Done */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🖱️ Point, Click, Done</h3>
                <p className="text-gray-600 mb-4">No XML coding, no syntax headaches, no wondering if you got the format right.</p>
                <h4 className="font-semibold text-gray-800 mb-2">Here's how stupidly simple it is:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Enter your website URLs</li>
                  <li>• Complete human verification</li>
                  <li>• Click generate</li>
                  <li>• Download your perfect sitemap</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3 italic">Takes literally 30 seconds.</p>
              </div>

              {/* Catches Pages You'd Miss */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">✅ Complete Control</h3>
                <p className="text-gray-600 mb-4">You know your website better than any automated crawler. Add exactly the pages you want indexed.</p>
                <h4 className="font-semibold text-gray-800 mb-2">Manual input means:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• No missed important pages</li>
                  <li>• No unwanted pages included</li>
                  <li>• Complete control over priorities</li>
                  <li>• Works with any website structure</li>
                  <li>• Perfect for private or new sites</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3 italic">So nothing important gets left behind.</p>
              </div>

              {/* Google-Approved Format */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🛡️ Google-Approved Format</h3>
                <p className="text-gray-600 mb-4">Mess up the XML format and Google might ignore your whole sitemap.</p>
                <h4 className="font-semibold text-gray-800 mb-2">We automatically handle:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Proper XML syntax and structure</li>
                  <li>• Correct date formatting</li>
                  <li>• Valid URL encoding</li>
                  <li>• Priority and frequency settings</li>
                  <li>• 2,000 URL limit compliance</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3 italic">Which means your sitemap actually works instead of just sitting there looking pretty.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">How to Use the XML Sitemap Generator (Super Easy)</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 1: Gather Your URLs</h3>
                <p className="text-gray-700">Create a list of all the important pages on your website that you want search engines to index. Include your homepage, about page, product pages, blog posts, and any other valuable content.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 2: Paste Your URLs</h3>
                <p className="text-gray-700">Copy and paste your URLs into the text area, one URL per line. Make sure each URL is complete and properly formatted (starting with https:// or http://). Remember the 2,000 URL limit!</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 3: Complete Verification</h3>
                <p className="text-gray-700">Complete the human verification to prevent automated abuse and ensure fair usage of our free tool.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 4: Generate and Download</h3>
                <p className="text-gray-700">Click generate to create your XML sitemap, then download the file and upload it to your website's root directory. Don't forget to submit it to Google Search Console!</p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
              <p className="text-gray-700 text-center">
                <strong>Pro tip:</strong> Your sitemap should live at yourdomain.com/sitemap.xml - that's where search engines expect to find it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Gets Included Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Gets Included (And What Doesn't)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Automatically Included */}
              <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-800">✅ Automatically Included:</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• All URLs you manually add</li>
                  <li>• Proper priority settings (homepage = 1.0)</li>
                  <li>• Current date as last modified</li>
                  <li>• Appropriate change frequency</li>
                  <li>• Valid XML formatting</li>
                </ul>
              </div>

              {/* Smart Optimization */}
              <div className="bg-blue-50 rounded-2xl shadow-sm border border-blue-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">🎯 Smart Optimization:</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Homepage gets priority 1.0</li>
                  <li>• Product/service pages get 0.8</li>
                  <li>• Blog/news pages get 0.6</li>
                  <li>• Other pages get 0.5</li>
                  <li>• URL validation and cleanup</li>
                </ul>
              </div>

              {/* Limitations */}
              <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Important Limits:</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Maximum 2,000 URLs per sitemap</li>
                  <li>• Only manually added URLs included</li>
                  <li>• Human verification required</li>
                  <li>• Invalid URLs are excluded</li>
                  <li>• One sitemap file generated</li>
                </ul>
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
                <a href="/tools/keyword-density-analyzer/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions for better CTR.</p>
                <a href="/tools/meta-tag-optimizer/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Robots.txt Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create perfect robots.txt files without breaking your website.</p>
                <a href="/tools/robots-txt-generator/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">XML Sitemap Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Help search engines find every page on your website (up to 2,000 URLs).</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Long Tail Keyword Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Find hidden keywords that actually convert and drive traffic.</p>
                <a href="/tools/long-tail-keyword-generator/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Page Speed Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Check your website's loading speed and get optimization tips.</p>
                <a href="/tools/page-speed-analyzer/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a 
                href="/tools/"
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
            <h2 className="text-3xl font-bold mb-6">Ready to Get All Your Pages Found?</h2>
            <p className="text-lg mb-8 opacity-90">
              Don't leave page discovery to chance. Create a professional XML sitemap that gives search engines a complete roadmap to all your important content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Create Your XML Sitemap →
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-semibold mb-2">Professional sitemaps in 30 seconds - completely free</p>
            </div>
            
            <p className="text-sm opacity-80">
              <strong>Don't let great content go undiscovered. Create your sitemap with SEO Shouts and make sure Google finds everything.</strong>
              <br />
              <em>Built by SEO pros who understand that every page deserves a chance to rank.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
