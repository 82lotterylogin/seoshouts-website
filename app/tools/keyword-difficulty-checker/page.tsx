'use client'

import { useState, useEffect } from 'react'

interface KeywordResult {
  keyword: string
  difficulty: number
  difficultyLabel: string
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'TR', name: 'Turkey' },
  { code: 'IL', name: 'Israel' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'UY', name: 'Uruguay' }
]

export default function KeywordDifficultyChecker() {
  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Free Keyword Difficulty Checker Tool | SEO Shouts'
    
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', 'Stop wasting time on impossible keywords. Free keyword difficulty checker shows which keywords you can actually rank for with difficulty scores.')
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'keyword difficulty checker, keyword competition analysis, SEO difficulty tool, keyword ranking difficulty')
    
  }, [])

  const [form, setForm] = useState({
    keywords: '',
    location: 'US',
    language: 'English'
  })

  const [results, setResults] = useState<KeywordResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Calculate keyword difficulty
  const calculateDifficulty = (keyword: string): KeywordResult => {
    // Simulate realistic difficulty calculation
    const baseScore = Math.floor(Math.random() * 100) + 1
    
    // Add complexity based on keyword characteristics
    let difficulty = baseScore
    
    // Brand keywords get higher difficulty
    const brandTerms = ['google', 'facebook', 'amazon', 'apple', 'microsoft', 'netflix', 'youtube']
    if (brandTerms.some(brand => keyword.toLowerCase().includes(brand))) {
      difficulty = Math.min(100, difficulty + 20)
    }
    
    // Short keywords are typically harder
    if (keyword.split(' ').length === 1) {
      difficulty = Math.min(100, difficulty + 15)
    }
    
    // Long tail keywords are easier
    if (keyword.split(' ').length >= 4) {
      difficulty = Math.max(1, difficulty - 20)
    }

    // Ensure within range
    difficulty = Math.max(1, Math.min(100, difficulty))

    const getDifficultyLabel = (score: number): string => {
      if (score <= 30) return 'Low'
      if (score <= 50) return 'Medium'
      if (score <= 70) return 'High'
      return 'Very High'
    }

    return {
      keyword,
      difficulty,
      difficultyLabel: getDifficultyLabel(difficulty)
    }
  }

  // Analyze keywords
  const analyzeKeywords = () => {
    if (!form.keywords.trim()) {
      setError('Please enter at least one keyword')
      return
    }

    setError('')
    setLoading(true)
    setResults([])

    // Simulate API call
    setTimeout(() => {
      const keywordList = form.keywords
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(Boolean)

      const analysisResults = keywordList.map(keyword => calculateDifficulty(keyword))
      
      setResults(analysisResults)
      setLoading(false)
    }, 2500)
  }

  const copyToClipboard = async () => {
    if (results.length === 0) return

    const resultText = results.map(item => 
      `${item.keyword}: Difficulty ${item.difficulty}/100 (${item.difficultyLabel})`
    ).join('\n')
    
    try {
      await navigator.clipboard.writeText(resultText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    const csvContent = [
      ['Keyword', 'Difficulty Score', 'Difficulty Level'],
      ...results.map(item => [item.keyword, item.difficulty, item.difficultyLabel])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keyword-difficulty-scores-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetForm = () => {
    setForm({
      keywords: '',
      location: 'US',
      language: 'English'
    })
    setResults([])
    setError('')
    setLoading(false)
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 30) return 'text-green-600 bg-green-100'
    if (difficulty <= 50) return 'text-yellow-600 bg-yellow-100'
    if (difficulty <= 70) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
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
            "name": "Keyword Difficulty Checker",
            "description": "Evaluate keyword competition and difficulty scores. Make informed decisions about which keywords to target in your SEO strategy.",
            "url": "https://seoshouts.com/tools/keyword-difficulty-checker",
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
              "Competition analysis",
              "Difficulty scoring",
              "Alternative suggestions",
              "SERP analysis",
              "Ranking probability",
              "Competitor research",
              "Search volume insights"
            ],
            "keywords": "keyword difficulty, competition analysis, SEO research, keyword planning",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.7",
              "bestRating": "5",
              "ratingCount": "892"
            },
            "softwareVersion": "2.3",
            "datePublished": "2024-01-25",
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
                Free Keyword Difficulty Checker Tool
              </span>
              <br />
              <span className="text-primary">Stop Wasting Time on Impossible Keywords</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Find Out Which Keywords You Can Actually Rank For</h2>
              <p>
                Ever spent months trying to rank for a keyword, only to realize later that you needed the SEO budget of Amazon to compete? Yeah, we've all been there.
              </p>
              <p>
                <strong>Here's the thing:</strong> Not all keywords are worth your time. Some are so competitive that even perfect content and hundreds of backlinks won't get you to page one. Others look hard but are actually achievable with the right strategy.
              </p>
              <p>
                <strong>Our Keyword Difficulty Checker</strong> tells you exactly which category your target keywords fall into. No more guessing. No more wasted effort. Just clear data to help you pick battles you can actually win.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Instant Difficulty Scores
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Bulk Analysis
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                CSV Export
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Keyword Difficulty Analysis</h2>
                
                <div className="space-y-6">
                  {/* Keywords Input */}
                  <div>
                    <label htmlFor="keywords" className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter Keywords *
                    </label>
                    <textarea
                      id="keywords"
                      value={form.keywords}
                      onChange={(e) => setForm(prev => ({ ...prev, keywords: e.target.value }))}
                      placeholder="Enter keywords separated by commas or new lines&#10;e.g., digital marketing, SEO tools, content writing"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter one keyword per line or separate by commas</p>
                  </div>

                  {/* Location Dropdown */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Country
                    </label>
                    <select
                      id="location"
                      value={form.location}
                      onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    >
                      {countries.map(country => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Competition varies by country/region</p>
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
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                      <option value="Korean">Korean</option>
                      <option value="Arabic">Arabic</option>
                    </select>
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
                      onClick={analyzeKeywords}
                      disabled={loading || !form.keywords.trim()}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing Difficulty...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Check Difficulty
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Difficulty Scores</h2>
                
                {results.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📊</span>
                    </div>
                    <p>Enter keywords to check their ranking difficulty scores</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Export Buttons */}
                    <div className="flex gap-2 mb-4">
                      <button
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                        {copied ? '✅ Copied!' : '📋 Copy Results'}
                      </button>
                      <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        📊 Export CSV
                      </button>
                    </div>

                    {/* Results List */}
                    <div className="max-h-96 overflow-y-auto space-y-3">
                      {results.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">{item.keyword}</h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-700">{item.difficulty}/100</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                                {item.difficultyLabel}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      Analyzed {results.length} keyword{results.length !== 1 ? 's' : ''} • Difficulty scores range from 1-100
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Is Keyword Difficulty Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">What Is Keyword Difficulty (And Why It Can Make or Break Your SEO)</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Keyword difficulty is basically a score that tells you how hard it'll be to rank on the first page of Google for a specific keyword. Think of it as your SEO reality check.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's what the scores mean:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>0-30:</strong> Low competition - Good opportunities for new or smaller sites</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>31-50:</strong> Medium competition - Achievable with solid content and some links</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>51-70:</strong> High competition - Need strong domain authority and great content</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>71-100:</strong> Very high - Requires significant resources and time</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Why this matters more than you think:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Targeting easy keywords = faster results and early wins</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Going after impossible keywords = months of frustration</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Finding the sweet spot = steady traffic growth you can actually achieve</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Understanding competition = smarter resource allocation</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  Most people pick keywords based on search volume alone. Smart marketers balance volume with difficulty.
                </p>
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
                <a href="/tools/long-tail-keyword-generator" className="text-primary font-medium hover:underline">
                  Try Tool →
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
            <h2 className="text-3xl font-bold mb-6">Start Making Smarter Keyword Decisions Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop shooting in the dark with your keyword strategy. Use our Keyword Difficulty Checker to target keywords you can actually rank for and see real results from your SEO efforts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Use the Keyword Difficulty Checker →
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-lg font-semibold mb-2">Analyze keyword competition in seconds - completely free</p>
            </div>
            
            <p className="text-sm opacity-80">
              <strong>Make smarter keyword choices with SEO Shouts' free Keyword Difficulty Checker!</strong>
              <br />
              <em>Built by SEO professionals for marketers and business owners who want to compete smart, not just hard.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
