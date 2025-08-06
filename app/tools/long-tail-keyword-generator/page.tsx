'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function LongTailKeywordGenerator() {
  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Long Tail Keyword Generator Tool - No Signup - No Login - 100% Free - SEOShouts'
    
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', 'Find profitable long tail keywords your competitors are missing. Free keyword generator with AI-powered suggestions, search volume data, and export functionality.')
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'long tail keyword generator, keyword research tool, SEO keywords, keyword finder, profitable keywords')
  }, [])

  const [form, setForm] = useState({
    keyword: '',
    location: '',
    language: 'English'
  })

  const [results, setResults] = useState<Array<{ keyword: string; volume: string; competition: string; intent: string }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Generate keywords (demo function)
const generateKeywords = () => {
  if (!form.keyword.trim()) {
    setError('Please enter a seed keyword')
    return
  }

  setError('')
  setLoading(true)
  setResults([])

  // Simulate API call with demo data - NOW GENERATES 25 KEYWORDS
  setTimeout(() => {
    const baseKeyword = form.keyword
    const location = form.location || 'your city'
    
    const demoKeywords = [
      // Informational Intent Keywords (8 keywords)
      { keyword: `${baseKeyword} for beginners`, volume: '1,200', competition: 'Low', intent: 'Informational' },
      { keyword: `how to choose ${baseKeyword}`, volume: '850', competition: 'Low', intent: 'Informational' },
      { keyword: `${baseKeyword} tips and tricks`, volume: '780', competition: 'Medium', intent: 'Informational' },
      { keyword: `${baseKeyword} comparison guide`, volume: '540', competition: 'Low', intent: 'Informational' },
      { keyword: `what is ${baseKeyword}`, volume: '920', competition: 'Low', intent: 'Informational' },
      { keyword: `${baseKeyword} tutorial step by step`, volume: '670', competition: 'Medium', intent: 'Informational' },
      { keyword: `${baseKeyword} vs alternatives`, volume: '430', competition: 'Medium', intent: 'Informational' },
      { keyword: `${baseKeyword} benefits and advantages`, volume: '380', competition: 'Low', intent: 'Informational' },

      // Commercial Intent Keywords (10 keywords)
      { keyword: `buy ${baseKeyword} online`, volume: '2,100', competition: 'High', intent: 'Commercial' },
      { keyword: `best ${baseKeyword} 2024`, volume: '1,450', competition: 'Medium', intent: 'Commercial' },
      { keyword: `affordable ${baseKeyword} services`, volume: '450', competition: 'Low', intent: 'Commercial' },
      { keyword: `top rated ${baseKeyword} providers`, volume: '320', competition: 'Low', intent: 'Commercial' },
      { keyword: `${baseKeyword} reviews and ratings`, volume: '890', competition: 'Medium', intent: 'Commercial' },
      { keyword: `cheap ${baseKeyword} under 1000`, volume: '650', competition: 'Medium', intent: 'Commercial' },
      { keyword: `professional ${baseKeyword} services`, volume: '680', competition: 'Medium', intent: 'Commercial' },
      { keyword: `${baseKeyword} deals and discounts`, volume: '290', competition: 'Low', intent: 'Commercial' },
      { keyword: `premium ${baseKeyword} brands`, volume: '340', competition: 'High', intent: 'Commercial' },
      { keyword: `${baseKeyword} price comparison`, volume: '520', competition: 'Medium', intent: 'Commercial' },

      // Local Intent Keywords (7 keywords)
      { keyword: `${baseKeyword} near me`, volume: '890', competition: 'Medium', intent: 'Local' },
      { keyword: `best ${baseKeyword} in ${location}`, volume: '650', competition: 'Medium', intent: 'Local' },
      { keyword: `${baseKeyword} ${location} reviews`, volume: '240', competition: 'Low', intent: 'Local' },
      { keyword: `${baseKeyword} shop ${location}`, volume: '180', competition: 'Low', intent: 'Local' },
      { keyword: `${baseKeyword} delivery ${location}`, volume: '320', competition: 'Medium', intent: 'Local' },
      { keyword: `${baseKeyword} store near ${location}`, volume: '210', competition: 'Low', intent: 'Local' },
      { keyword: `local ${baseKeyword} experts ${location}`, volume: '150', competition: 'Low', intent: 'Local' }
    ]

    setResults(demoKeywords)
    setLoading(false)
  }, 2000)
}


  const copyToClipboard = async () => {
    if (results.length === 0) return

    const keywordList = results.map(item => item.keyword).join('\n')
    try {
      await navigator.clipboard.writeText(keywordList)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    const csvContent = [
      ['Keyword', 'Search Volume', 'Competition', 'Intent'],
      ...results.map(item => [item.keyword, item.volume, item.competition, item.intent])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `long-tail-keywords-${form.keyword.replace(/\s+/g, '-')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetForm = () => {
    setForm({
      keyword: '',
      location: '',
      language: 'English'
    })
    setResults([])
    setError('')
    setLoading(false)
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

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
                Free Long Tail Keyword Generator Tool
              </span>
              <br />
              <span className="text-primary">Find Hidden Keywords That Actually Convert</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Discover Profitable Keywords Your Competitors Are Missing</h2>
              <p>
                Ever feel like you're fighting for scraps with the same keywords everyone else targets? Smart marketers know the real opportunity lies in long tail keywords - those longer, more specific phrases that people actually search for when they're ready to buy something.
              </p>
              <p>
                <strong>Our Long Tail Keyword Generator</strong> helps you uncover hundreds of these hidden gems in seconds. No more guessing what people might search for. No more competing for impossible keywords. Just real, profitable keyword opportunities waiting to be discovered.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                AI-Powered Suggestions
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Search Volume Data
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Export Functionality
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Keyword Generator</h2>
                
                <div className="space-y-6">
                  {/* Seed Keyword */}
                  <div>
                    <label htmlFor="keyword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter Seed Keyword *
                    </label>
                    <input
                      type="text"
                      id="keyword"
                      value={form.keyword}
                      onChange={(e) => setForm(prev => ({ ...prev, keyword: e.target.value }))}
                      placeholder="e.g., coffee maker, digital marketing, yoga classes"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">Start with a broad term related to your business</p>
                  </div>

                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Location (Optional)
                    </label>
                    <input
                      type="text"
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., Mumbai, Delhi, New York"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">For location-specific keyword suggestions</p>
                  </div>

                  {/* Language */}
                  <div>
                    <label htmlFor="language" className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Language
                    </label>
                    <select
                      id="language"
                      value={form.language}
                      onChange={(e) => setForm(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    >
                      <option value="English">English</option>
                      <option value="Hindi">Hindi</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Portuguese">Portuguese</option>
                    </select>
                  </div>

                  {/* Human Verification Section */}
                  <div className="border-2 border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Please verify that you're not a robot to generate keywords.
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
                        <span className="text-sm font-medium text-green-800">Verification successful! You can now generate keywords.</span>
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
                      onClick={generateKeywords}
                      disabled={loading || !form.keyword.trim() || !isVerified}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating Keywords...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          {!isVerified ? 'Complete Verification First' : 'Generate Keywords'}
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Generated Keywords</h2>
                
                {results.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <p>Enter a seed keyword and generate long tail keyword suggestions</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Export Buttons */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        {copied ? '✅ Copied!' : '📋 Copy All'}
                      </button>
                      <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        📊 Export CSV
                      </button>
                    </div>

                    {/* Keywords Table */}
                    <div className="max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {results.map((item, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                            <div className="font-medium text-gray-800 mb-1">{item.keyword}</div>
                            <div className="flex gap-4 text-xs text-gray-600">
                              <span>📊 {item.volume}/month</span>
                              <span className={`px-2 py-1 rounded ${
                                item.competition === 'Low' ? 'bg-green-100 text-green-700' :
                                item.competition === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {item.competition} Competition
                              </span>
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">{item.intent}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      Generated {results.length} long tail keyword suggestions
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Long Tail Keywords Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">What Are Long Tail Keywords (And Why They're Marketing Gold)</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Long tail keywords are basically the opposite of what most people target. Instead of going after "shoes" (good luck ranking for that), smart marketers target phrases like "waterproof running shoes for women" or "best hiking boots under 5000 rupees."
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's why they work so well:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Less competition</strong> - Fewer websites fighting for the same terms</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Higher conversion rates</strong> - People searching for specific things are closer to buying</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Clearer intent</strong> - You know exactly what the searcher wants</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Easier to rank</strong> - Your chances of page one are much better</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Better ROI</strong> - Less money spent competing, more traffic that converts</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  Think about it - would you rather rank #47 for "digital marketing" or #3 for "digital marketing services for small restaurants in Mumbai"?
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Our Tool Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How Our Long Tail Keyword Generator Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* AI-Powered Discovery */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🤖 AI-Powered Keyword Discovery</h3>
                <p className="text-gray-600 mb-4">Our tool uses smart algorithms to analyze search patterns and generate hundreds of relevant long tail variations from your main keyword.</p>
                <h4 className="font-semibold text-gray-800 mb-2">What makes it different:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Pulls from multiple data sources for comprehensive coverage</li>
                  <li>• Analyzes real search behavior, not just dictionary combinations</li>
                  <li>• Updates constantly with fresh search trends</li>
                  <li>• Filters out irrelevant or low-value suggestions</li>
                </ul>
              </div>

              {/* Smart Categorization */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🎯 Smart Categorization and Filtering</h3>
                <p className="text-gray-600 mb-4">Not all keywords are created equal. Our tool organizes suggestions by intent and value.</p>
                <h4 className="font-semibold text-gray-800 mb-2">Built-in organization:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• <strong>Buyer intent keywords</strong> - People ready to purchase</li>
                  <li>• <strong>Information seekers</strong> - Researching and comparing options</li>
                  <li>• <strong>Local searches</strong> - Location-specific opportunities</li>
                  <li>• <strong>Question-based queries</strong> - Perfect for content marketing</li>
                </ul>
              </div>

              {/* Real Search Data */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 Real Search Data Integration</h3>
                <p className="text-gray-600 mb-4">Every suggestion comes with the data you need to make smart decisions.</p>
                <h4 className="font-semibold text-gray-800 mb-2">Key metrics included:</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Monthly search volume estimates</li>
                  <li>• Competition level analysis</li>
                  <li>• Seasonal trend information</li>
                  <li>• Related keyword suggestions</li>
                  <li>• Search intent classification</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features That Make This Tool Essential</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                <div className="text-3xl mb-4">⚡</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Instant Keyword Generation</h3>
                <p className="text-gray-600">Enter one seed keyword and get hundreds of long tail variations within seconds. No waiting, no complicated setup.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                <div className="text-3xl mb-4">🌍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Multiple Language Support</h3>
                <p className="text-gray-600">Generate keywords in Hindi, English, or dozens of other languages for local and international campaigns.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                <div className="text-3xl mb-4">📍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Location-Specific Results</h3>
                <p className="text-gray-600">Filter by country, state, or city to find keywords relevant to your target market.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 text-center">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Export Functionality</h3>
                <p className="text-gray-600">Download your keyword lists in CSV format for easy integration with your SEO tools and campaign planning.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 text-center">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">No Registration Required</h3>
                <p className="text-gray-600">Start using the tool immediately. No account creation, no email verification, no hassle.</p>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 text-center">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Mobile-Friendly Interface</h3>
                <p className="text-gray-600">Research keywords on any device - desktop, tablet, or smartphone.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">How to Use the Long Tail Keyword Generator (Step by Step)</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">1</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Enter Your Main Keyword</h3>
                  <p className="text-gray-700">Start with a broad term related to your business. For example: "coffee maker" or "digital marketing" or "yoga classes."</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">2</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Choose Your Target Location</h3>
                  <p className="text-gray-700">Select the country or region where your customers are located. This affects which keywords and search volumes you'll see.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">3</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Pick Your Language</h3>
                  <p className="text-gray-700">Choose the language your customers search in. The tool supports dozens of languages for global and local campaigns.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">4</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Complete Human Verification</h3>
                  <p className="text-gray-700">Verify that you're not a robot to ensure quality results and prevent automated abuse.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">5</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Generate Keywords</h3>
                  <p className="text-gray-700">Click the generate button and watch hundreds of long tail keyword suggestions appear.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">6</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Analyze and Export</h3>
                  <p className="text-gray-700">Review the suggestions, check search volumes, and export your chosen keywords for use in your campaigns.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-primary/10 border border-primary/20 rounded-xl p-6">
              <p className="text-gray-700 text-center">
                <strong>Pro tip:</strong> Start with 3-4 different seed keywords to get a comprehensive list of opportunities.
              </p>
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
                <div className="text-3xl mb-4">✍️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Content Creators and Bloggers</h3>
                <p className="text-gray-600">Find specific topics your audience is searching for and create content that actually gets found.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                <div className="text-3xl mb-4">🏪</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Small Business Owners</h3>
                <p className="text-gray-600">Discover local keywords and niche opportunities that big competitors ignore.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                <div className="text-3xl mb-4">📈</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Digital Marketers</h3>
                <p className="text-gray-600">Build comprehensive keyword lists for SEO campaigns and PPC advertising.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 text-center">
                <div className="text-3xl mb-4">🛒</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">eCommerce Store Owners</h3>
                <p className="text-gray-600">Find product-specific keywords that buyers use when they're ready to purchase.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 text-center">
                <div className="text-3xl mb-4">💼</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Freelancers and Agencies</h3>
                <p className="text-gray-600">Research keywords for client campaigns across different industries and locations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategies Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Long Tail Keyword Strategies That Actually Work</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📝 For Content Marketing</h3>
                <p className="text-gray-600">Use question-based long tail keywords to create helpful blog posts, guides, and tutorials that answer specific user questions.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📍 For Local SEO</h3>
                <p className="text-gray-600">Target location + service combinations like "plumber in Sector 18 Noida" or "best restaurant near Connaught Place."</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🛍️ For eCommerce</h3>
                <p className="text-gray-600">Focus on product + modifier combinations like "wireless earbuds under 3000" or "organic skincare for sensitive skin."</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">💼 For Service Businesses</h3>
                <p className="text-gray-600">Target problem + solution keywords like "laptop screen repair near me" or "small business accounting software."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Common Long Tail Keyword Mistakes to Avoid</h2>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Targeting keywords with zero search volume</strong> - Our tool shows real search data to prevent this</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Ignoring user intent</strong> - We categorize keywords so you understand what searchers want</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Choosing keywords that are too broad</strong> - Focus on specific, actionable phrases</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Not considering local variations</strong> - Use location filters for better targeting</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">❌</span>
                  <span className="text-gray-700"><strong>Forgetting about seasonality</strong> - Check trend data before committing to keywords</span>
                </div>
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
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How many keywords can I generate?</h3>
                <p className="text-gray-600">There's no limit. Generate as many keyword lists as you need for your campaigns.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Do you provide search volume data?</h3>
                <p className="text-gray-600">Yes, we include estimated monthly search volumes to help you prioritize keywords.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I use this for PPC campaigns?</h3>
                <p className="text-gray-600">Absolutely. Long tail keywords often have lower costs per click and higher conversion rates for paid ads.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How often is the keyword data updated?</h3>
                <p className="text-gray-600">Our database is updated regularly to reflect current search trends and patterns.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is the tool free to use?</h3>
                <p className="text-gray-600">Yes, completely free with no hidden fees or usage limits.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I save my keyword lists?</h3>
                <p className="text-gray-600">You can export keywords to CSV files or copy them for use in your preferred tools.</p>
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
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Long Tail Keyword Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Find hidden keywords that actually convert and drive traffic.</p>
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
            <h2 className="text-3xl font-bold mb-6">Start Finding Profitable Keywords Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop competing for impossible keywords. Start targeting the long tail phrases that your ideal customers are actually searching for.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Use the Long Tail Keyword Generator →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>🔍</span>
                <span>Find profitable keywords in seconds - no registration required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📚</span>
                <span>Learn advanced strategies for ranking with long tail keywords</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>Get personalized keyword strategy guidance from our experts</span>
              </div>
            </div>
            
            <p className="text-sm mt-6 opacity-80">
              <strong>Discover the keywords your competitors are missing with SEO Shouts' free Long Tail Keyword Generator!</strong>
              <br />
              <em>Built by SEO professionals for marketers, business owners, and content creators who want to find keywords that actually drive results.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
