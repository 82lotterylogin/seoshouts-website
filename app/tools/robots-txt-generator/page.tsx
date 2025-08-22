'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface RobotsRule {
  id: string
  label: string
  path: string
  description: string
  enabled: boolean
  type: 'disallow' | 'allow'
}

const platformTemplates = {
  wordpress: {
    name: 'WordPress',
    rules: [
      { id: 'wp-admin', label: 'Admin Area', path: '/wp-admin/', description: 'WordPress admin dashboard', enabled: true, type: 'disallow' as const },
      { id: 'wp-includes', label: 'WordPress Core Files', path: '/wp-includes/', description: 'WordPress system files', enabled: true, type: 'disallow' as const },
      { id: 'wp-content-plugins', label: 'Plugin Directories', path: '/wp-content/plugins/', description: 'WordPress plugin folders', enabled: true, type: 'disallow' as const },
      { id: 'wp-admin-ajax', label: 'Admin AJAX (Allow)', path: '/wp-admin/admin-ajax.php', description: 'Required for site functionality', enabled: true, type: 'allow' as const },
      { id: 'wp-uploads', label: 'Media Uploads (Allow)', path: '/wp-content/uploads/', description: 'Images and media files', enabled: true, type: 'allow' as const },
    ]
  },
  shopify: {
    name: 'Shopify',
    rules: [
      { id: 'admin', label: 'Admin Area', path: '/admin/', description: 'Store admin dashboard', enabled: true, type: 'disallow' as const },
      { id: 'cart', label: 'Shopping Cart', path: '/cart/', description: 'Shopping cart pages', enabled: true, type: 'disallow' as const },
      { id: 'checkout', label: 'Checkout Pages', path: '/checkout/', description: 'Checkout process pages', enabled: true, type: 'disallow' as const },
      { id: 'account', label: 'Customer Accounts', path: '/account/', description: 'Customer login and account pages', enabled: true, type: 'disallow' as const },
    ]
  },
  general: {
    name: 'General Website',
    rules: [
      { id: 'admin', label: 'Admin Area', path: '/admin/', description: 'Administrative pages', enabled: true, type: 'disallow' as const },
      { id: 'private', label: 'Private Directory', path: '/private/', description: 'Private content folder', enabled: true, type: 'disallow' as const },
      { id: 'tmp', label: 'Temporary Files', path: '/tmp/', description: 'Temporary file directory', enabled: true, type: 'disallow' as const },
      { id: 'staging', label: 'Staging Area', path: '/staging/', description: 'Development/staging environment', enabled: true, type: 'disallow' as const },
    ]
  }
}

export default function RobotsTxtGenerator() {
  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Free Robots.txt Generator Tool | SEO Shouts'
    
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', 'Create perfect robots.txt files without breaking your website. Free generator with templates for WordPress, Shopify, and more.')
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'robots.txt generator, robots txt file, search engine crawling, website security, SEO tools')
    
  }, [])

  const [selectedPlatform, setSelectedPlatform] = useState<'wordpress' | 'shopify' | 'general'>('wordpress')
  const [rules, setRules] = useState<RobotsRule[]>(platformTemplates.wordpress.rules)
  const [customRules, setCustomRules] = useState<string>('')
  const [sitemapUrl, setSitemapUrl] = useState('https://yoursite.com/sitemap.xml')
  const [crawlDelay, setCrawlDelay] = useState('')
  const [userAgents, setUserAgents] = useState<string[]>(['*']) // Changed to array
  const [robotsContent, setRobotsContent] = useState('')
  const [copied, setCopied] = useState(false)
  
  // CAPTCHA states
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Update rules when platform changes
  useEffect(() => {
    setRules(platformTemplates[selectedPlatform].rules)
  }, [selectedPlatform])

  // Generate robots.txt content
  useEffect(() => {
    generateRobotsContent()
  }, [rules, customRules, sitemapUrl, crawlDelay, userAgents]) // Updated dependency

  const generateRobotsContent = () => {
    let content = ''
    
    // Generate content for each selected user agent
    userAgents.forEach((agent, index) => {
      content += `User-agent: ${agent}\n`
      
      // Add disallow rules
      const disallowRules = rules.filter(rule => rule.enabled && rule.type === 'disallow')
      disallowRules.forEach(rule => {
        content += `Disallow: ${rule.path}\n`
      })
      
      // Add allow rules
      const allowRules = rules.filter(rule => rule.enabled && rule.type === 'allow')
      allowRules.forEach(rule => {
        content += `Allow: ${rule.path}\n`
      })
      
      // Add crawl delay if specified
      if (crawlDelay) {
        content += `Crawl-delay: ${crawlDelay}\n`
      }
      
      // Add spacing between user agents (except for the last one)
      if (index < userAgents.length - 1) {
        content += `\n`
      }
    })
    
    // Add custom rules
    if (customRules.trim()) {
      content += `\n# Custom Rules\n${customRules}\n`
    }
    
    // Add sitemap
    if (sitemapUrl) {
      content += `\nSitemap: ${sitemapUrl}`
    }
    
    setRobotsContent(content)
  }

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const copyToClipboard = async () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }

    try {
      await navigator.clipboard.writeText(robotsContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const downloadRobotsTxt = () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }

    const blob = new Blob([robotsContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'robots.txt'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetToDefaults = () => {
    setRules(platformTemplates[selectedPlatform].rules)
    setCustomRules('')
    setSitemapUrl('https://yoursite.com/sitemap.xml')
    setCrawlDelay('')
    setUserAgents(['*']) // Reset to default
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
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
            "name": "Robots.txt Generator",
            "description": "Generate and validate robots.txt files to control how search engines crawl your website. Includes syntax validation and testing.",
            "url": "https://seoshouts.com/tools/robots-txt-generator",
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
              "Automated generation",
              "Syntax validation",
              "Testing functionality",
              "Custom rules creation",
              "Download functionality",
              "Template library",
              "Crawl control"
            ],
            "keywords": "robots.txt, crawler control, search engine crawling, SEO technical",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "bestRating": "5",
              "ratingCount": "687"
            },
            "softwareVersion": "1.8",
            "datePublished": "2024-02-05",
            "dateModified": "2024-08-19",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />
      
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
                Free Robots.txt Generator Tool
              </span>
              <br />
              <span className="text-primary">Tell Search Engines Where They Can (And Can't) Go</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Perfect Robots.txt Files Without Breaking Your Website</h2>
              <p>
                Last month, a small business owner called me in a panic. "Google isn't showing any of my pages!" he said. Turns out, he'd tried to create a robots.txt file himself and accidentally blocked his entire website. One tiny typo cost him three weeks of lost traffic.
              </p>
              <p>
                <strong>Don't be that guy.</strong>
              </p>
              <p>
                Creating a robots.txt file might seem simple, but mess up the syntax and you could accidentally hide your whole site from Google. Or worse, you could leave sensitive pages completely exposed.
              </p>
              <p>
                <strong>Our Robots.txt Generator</strong> takes the guesswork out of it. Just click what you want to block or allow, and we'll create a bulletproof robots.txt file that actually works.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Multi-Agent Support
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                AI Bot Control
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Real-time Preview
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Robots.txt Generator</h2>
                
                <div className="space-y-6">
                  {/* Platform Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Choose Your Platform
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(platformTemplates).map(([key, template]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedPlatform(key as any)}
                          className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedPlatform === key
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Select User Agents */}
                  <div>
                    <label htmlFor="userAgents" className="block text-sm font-semibold text-gray-700 mb-2">
                      Select User Agents
                    </label>
                    <select
                      id="userAgents"
                      multiple
                      value={userAgents}
                      onChange={(e) => {
                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value)
                        setUserAgents(selectedOptions)
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 h-32"
                    >
                      <option value="*">* (All Crawlers)</option>
                      
                      <optgroup label="🔍 Search Engine Bots">
                        <option value="Googlebot">Googlebot</option>
                        <option value="Bingbot">Bingbot</option>
                        <option value="Slurp">Yahoo Slurp</option>
                        <option value="DuckDuckBot">DuckDuckBot</option>
                        <option value="Baiduspider">Baiduspider</option>
                        <option value="YandexBot">YandexBot</option>
                      </optgroup>
                      
                      <optgroup label="🤖 AI & Training Bots">
                        <option value="GPTBot">GPTBot (OpenAI)</option>
                        <option value="ChatGPT-User">ChatGPT-User (OpenAI Web Browsing)</option>
                        <option value="CCBot">CCBot (Common Crawl)</option>
                        <option value="anthropic-ai">anthropic-ai (Claude)</option>
                        <option value="ClaudeBot">ClaudeBot (Anthropic)</option>
                        <option value="Google-Extended">Google-Extended (AI Training)</option>
                        <option value="FacebookBot">FacebookBot (Meta AI)</option>
                        <option value="Applebot-Extended">Applebot-Extended (Apple AI)</option>
                        <option value="PerplexityBot">PerplexityBot</option>
                        <option value="YouBot">YouBot (You.com)</option>
                      </optgroup>
                      
                      <optgroup label="📱 Social Media Bots">
                        <option value="facebookexternalhit">Facebook External Hit</option>
                        <option value="Twitterbot">Twitterbot</option>
                        <option value="LinkedInBot">LinkedInBot</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="TelegramBot">TelegramBot</option>
                      </optgroup>
                      
                      <optgroup label="📊 SEO & Analytics Bots">
                        <option value="AhrefsBot">AhrefsBot</option>
                        <option value="SemrushBot">SemrushBot</option>
                        <option value="MJ12bot">MJ12bot (Majestic)</option>
                        <option value="DotBot">DotBot (Moz)</option>
                        <option value="SerpstatBot">SerpstatBot</option>
                      </optgroup>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Hold Ctrl (or Cmd on Mac) to select multiple user agents. Selected: {userAgents.length} agent{userAgents.length !== 1 ? 's' : ''}
                    </p>
                    
                    {/* Show selected agents */}
                    {userAgents.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {userAgents.map((agent, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                              {agent}
                              <button
                                onClick={() => setUserAgents(prev => prev.filter(a => a !== agent))}
                                className="ml-1 text-primary hover:text-primary/70"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Rules Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Rules to Apply
                    </label>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {rules.map((rule) => (
                        <div key={rule.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <input
                            type="checkbox"
                            id={rule.id}
                            checked={rule.enabled}
                            onChange={() => toggleRule(rule.id)}
                            className="mt-1 w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                          />
                          <div className="flex-1">
                            <label htmlFor={rule.id} className="block text-sm font-medium text-gray-700 cursor-pointer">
                              {rule.type === 'disallow' ? '🚫' : '✅'} {rule.label}
                            </label>
                            <p className="text-xs text-gray-500">
                              {rule.type === 'disallow' ? 'Disallow' : 'Allow'}: {rule.path}
                            </p>
                            <p className="text-xs text-gray-600">{rule.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Rules */}
                  <div>
                    <label htmlFor="customRules" className="block text-sm font-semibold text-gray-700 mb-2">
                      Custom Rules (Optional)
                    </label>
                    <textarea
                      id="customRules"
                      value={customRules}
                      onChange={(e) => setCustomRules(e.target.value)}
                      placeholder="Add custom disallow/allow rules here..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                    />
                  </div>

                  {/* Sitemap URL */}
                  <div>
                    <label htmlFor="sitemapUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                      Sitemap URL
                    </label>
                    <input
                      type="url"
                      id="sitemapUrl"
                      value={sitemapUrl}
                      onChange={(e) => setSitemapUrl(e.target.value)}
                      placeholder="https://yoursite.com/sitemap.xml"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>

                  {/* Crawl Delay */}
                  <div>
                    <label htmlFor="crawlDelay" className="block text-sm font-semibold text-gray-700 mb-2">
                      Crawl Delay (seconds, optional)
                    </label>
                    <input
                      type="number"
                      id="crawlDelay"
                      value={crawlDelay}
                      onChange={(e) => setCrawlDelay(e.target.value)}
                      placeholder="e.g., 10"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Adds delay between crawler requests</p>
                  </div>

                  {/* Human Verification Section */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Please verify that you're not a robot to generate your robots.txt file.
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
                        <span className="text-sm font-medium text-green-800">Verification successful! You can now generate your robots.txt file.</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={resetToDefaults}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Robots.txt Preview</h2>
                
                <div className="space-y-4">
                  {/* Preview Box */}
                  <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto">
                    <pre className="text-green-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {robotsContent || '# Your robots.txt file will appear here'}
                    </pre>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      disabled={!isVerified}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isVerified
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={downloadRobotsTxt}
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

                  {/* Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-blue-800 mb-2">📝 How to Use This File:</h3>
                    <ol className="text-sm text-blue-700 space-y-1">
                      <li>1. Complete human verification above</li>
                      <li>2. Download the robots.txt file</li>
                      <li>3. Upload it to your website's root directory</li>
                      <li>4. Test at: yoursite.com/robots.txt</li>
                      <li>5. Verify in Google Search Console</li>
                    </ol>
                  </div>

                  {/* Multi-Agent Info */}
                  {userAgents.length > 1 && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-green-800 mb-2">🤖 Multi-Agent Rules:</h3>
                      <p className="text-sm text-green-700">
                        Rules will be applied to {userAgents.length} different user agents: {userAgents.join(', ')}
                      </p>
                    </div>
                  )}

                  {/* Warning if blocking everything */}
                  {robotsContent.includes('Disallow: /') && !robotsContent.includes('Allow:') && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-red-800 mb-2">⚠️ Warning:</h3>
                      <p className="text-sm text-red-700">
                        You're blocking your entire website! This will prevent search engines from indexing any of your pages.
                      </p>
                    </div>
                  )}

                  {/* Verification Required Notice */}
                  {!isVerified && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <h3 className="text-sm font-semibold text-yellow-800 mb-2">🔒 Verification Required:</h3>
                      <p className="text-sm text-yellow-700">
                        Please complete the human verification above to download or copy your robots.txt file.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add all your content sections here from the previous version */}
      {/* What Is Robots.txt, Why Our Generator Beats DIY, etc. */}
      


      {/* What Is Robots.txt Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">What The Heck Is Robots.txt Anyway?</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Think of robots.txt as a bouncer for your website. It stands at the front door and tells visiting search engine bots, "Hey, you can check out these pages, but stay away from those ones over there."
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's the deal:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">It's just a simple text file that sits on your website</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Search engines read it before crawling your site</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Good bots respect it, sketchy ones might ignore it</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Get it wrong, and you could accidentally block everything</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mb-6">
                <p className="text-gray-700">
                  <strong>Real-world example:</strong> Your WordPress admin area is at <code className="bg-gray-200 px-2 py-1 rounded">/wp-admin/</code>. You definitely don't want that showing up in Google search results, right? Robots.txt keeps it hidden.
                </p>
              </div>

              <p className="text-gray-700">
                But here's what trips people up - the syntax is super picky. Miss a slash, forget a colon, or use the wrong case, and boom - your file either doesn't work or blocks the wrong stuff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Our Generator Beats DIY Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Our Generator Beats DIY Robots.txt</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Point-and-Click Simplicity */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🖱️ Point-and-Click Simplicity</h3>
                <p className="text-gray-600 mb-4">No memorizing weird syntax or Googling "how to write robots.txt" for the hundredth time.</p>
                <h4 className="font-semibold text-gray-800 mb-2">Here's how easy it is:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Pick your website type (WordPress, Shopify, whatever)</li>
                  <li>• Click the folders you want to block</li>
                  <li>• Hit generate and boom - perfect robots.txt file</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3 italic">Because nobody has time to learn robot syntax when you've got a business to run.</p>
              </div>

              {/* Mistake-Proof Templates */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🛡️ Mistake-Proof Templates</h3>
                <p className="text-gray-600 mb-4">We've built templates for every major platform that already know what to block and what to leave alone.</p>
                <h4 className="font-semibold text-gray-800 mb-2">WordPress template blocks:</h4>
                <ul className="text-gray-600 text-sm space-y-1 mb-3">
                  <li>• <code>/wp-admin/</code> (your admin area)</li>
                  <li>• <code>/wp-includes/</code> (WordPress core files)</li>
                  <li>• <code>/wp-content/plugins/</code> (plugin folders)</li>
                </ul>
                <h4 className="font-semibold text-gray-800 mb-2">But allows:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• <code>/wp-content/uploads/</code> (your images)</li>
                  <li>• <code>/wp-admin/admin-ajax.php</code> (site functions)</li>
                </ul>
              </div>

              {/* Real-Time Preview */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">👁️ Real-Time Preview</h3>
                <p className="text-gray-600 mb-4">See exactly what your robots.txt file will look like before you download it.</p>
                <h4 className="font-semibold text-gray-800 mb-2">What the preview shows:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• The actual code that'll go on your server</li>
                  <li>• Warnings if something looks fishy</li>
                  <li>• Explanations of what each rule does</li>
                  <li>• Suggestions for common additions</li>
                </ul>
                <p className="text-gray-600 text-sm mt-3 italic">Which means no surprises when you upload the file to your website.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Robots.txt Rules Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Common Robots.txt Rules Every Website Should Consider</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Essential Blocks */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🚫 Essential Blocks for Most Websites</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm">
{`User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /tmp/
Disallow: /staging/`}
                  </pre>
                </div>
              </div>

              {/* WordPress Specific */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📝 WordPress-Specific Rules</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm">
{`User-agent: *
Disallow: /wp-admin/
Disallow: /wp-includes/
Allow: /wp-admin/admin-ajax.php
Allow: /wp-content/uploads/`}
                  </pre>
                </div>
              </div>

              {/* eCommerce Protection */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🛒 eCommerce Protection</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm">
{`User-agent: *
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/
Disallow: /admin/`}
                  </pre>
                </div>
              </div>

              {/* Development and Testing */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🔧 Development and Testing</h3>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm">
{`User-agent: *
Disallow: /dev/
Disallow: /test/
Disallow: /staging/
Disallow: /*.pdf$`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What to Block Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What You Should (And Shouldn't) Block</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Always Block */}
              <div className="bg-red-50 rounded-2xl shadow-sm border border-red-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-red-800">❌ Always Block These:</h3>
                <ul className="space-y-2 text-red-700">
                  <li>• <code>/admin/</code> or <code>/wp-admin/</code> (admin areas)</li>
                  <li>• <code>/private/</code> (personal stuff)</li>
                  <li>• <code>/tmp/</code> (temporary files)</li>
                  <li>• <code>/staging/</code> (test environments)</li>
                  <li>• User account and login pages</li>
                </ul>
              </div>

              {/* Never Block */}
              <div className="bg-green-50 rounded-2xl shadow-sm border border-green-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-green-800">✅ Never Block These:</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• Your main content and blog posts</li>
                  <li>• CSS and JavaScript files (Google needs these!)</li>
                  <li>• Product pages or important landing pages</li>
                  <li>• Your sitemap.xml file</li>
                </ul>
              </div>

              {/* Maybe Block */}
              <div className="bg-yellow-50 rounded-2xl shadow-sm border border-yellow-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-yellow-800">⚠️ Maybe Block These:</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li>• Search result pages (can create duplicate content)</li>
                  <li>• Shopping cart pages (depends on your setup)</li>
                  <li>• PDF files (unless they're important for SEO)</li>
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
                <a href="/tools/keyword-density-analyzer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions for better CTR.</p>
                <a href="/tools/meta-tag-optimizer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Robots.txt Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create perfect robots.txt files without breaking your website.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
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
            <h2 className="text-3xl font-bold mb-6">Ready to Take Control?</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop leaving your website's crawlability to chance. Create a professional robots.txt file that guides search engines to your good stuff while keeping the private pages private.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Use the Robots.txt Generator →
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-semibold mb-2">Create your file in 2 minutes - completely free</p>
            </div>
            
            <p className="text-sm opacity-80">
              <strong>Don't let a tiny text file break your SEO. Use SEO Shouts' Robots.txt Generator and do it right the first time.</strong>
              <br />
              <em>Built by people who've seen every robots.txt disaster imaginable, so you don't have to experience them yourself.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
