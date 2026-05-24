'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

export default function KeywordDensityAnalyzerClient() {
  const [form, setForm] = useState({
    content: '',
    targetKeyword: '',
    isAnalyzing: false,
    results: null as any
  })

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit] = useState(10)

  // Input mode selection
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text')
  const [url, setUrl] = useState('')

  // CAPTCHA states
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const [analysis, setAnalysis] = useState<{
    totalWords: number
    totalCharacters: number
    keywordCount: number
    keywordDensity: number
    topKeywords: Array<{ word: string; count: number; density: number }>
    recommendations: string[]
    readabilityScore: number
  } | null>(null)

  // Load usage count from session storage
  useEffect(() => {
    const savedUsageCount = sessionStorage.getItem('keywordAnalyzerUsage')
    if (savedUsageCount) {
      setUsageCount(parseInt(savedUsageCount))
    }
  }, [])

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Clean and process text
  const cleanText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Fetch content from URL
  const fetchUrlContent = async (url: string): Promise<string> => {
    try {
      const response = await fetch('/api/fetch-url-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await response.json()
      if (data.success) {
        return data.content
      } else {
        throw new Error(data.error || 'Failed to fetch content')
      }
    } catch (error) {
      throw error
    }
  }

  // Calculate keyword density
  const analyzeContent = async () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }

    // Check usage limit
    if (usageCount >= usageLimit) {
      alert(`You've reached the limit of ${usageLimit} analyses per session. Please refresh the page to continue.`)
      return
    }

    let contentToAnalyze = ''

    if (inputMode === 'text') {
      if (!form.content.trim()) {
        alert('Please enter some content to analyze')
        return
      }
      contentToAnalyze = form.content.trim()
    } else {
      if (!url.trim()) {
        alert('Please enter a URL to analyze')
        return
      }
      try {
        setForm(prev => ({ ...prev, isAnalyzing: true }))
        contentToAnalyze = await fetchUrlContent(url.trim())
        if (!contentToAnalyze.trim()) {
          alert('No content found at the provided URL')
          setForm(prev => ({ ...prev, isAnalyzing: false }))
          return
        }
      } catch (error) {
        alert('Failed to fetch content from URL. Please check the URL and try again.')
        setForm(prev => ({ ...prev, isAnalyzing: false }))
        return
      }
    }

    setForm(prev => ({ ...prev, isAnalyzing: true }))

    setTimeout(() => {
      const content = contentToAnalyze
      const cleanedContent = cleanText(content)
      const words = cleanedContent.split(' ').filter(word => word.length > 0)

      const totalWords = words.length
      const totalCharacters = content.length

      const targetKeyword = form.targetKeyword.toLowerCase().trim()
      let keywordCount = 0
      let keywordDensity = 0

      if (targetKeyword) {
        const keywordRegex = new RegExp(`\\b${targetKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
        const matches = content.match(keywordRegex)
        keywordCount = matches ? matches.length : 0
        keywordDensity = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
      }

      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within', 'without', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except', 'but', 'until', 'unless', 'since', 'while', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
      ])

      const wordCount: { [key: string]: number } = {}
      words.forEach(word => {
        if (word.length > 2 && !stopWords.has(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1
        }
      })

      const topKeywords = Object.entries(wordCount)
        .map(([word, count]) => ({
          word,
          count,
          density: (count / totalWords) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      const recommendations: string[] = []

      if (targetKeyword) {
        if (keywordDensity < 0.5) {
          recommendations.push(`Your target keyword "${targetKeyword}" appears ${keywordCount} times (${keywordDensity.toFixed(2)}%). Consider adding it 2-3 more times naturally.`)
        } else if (keywordDensity > 3) {
          recommendations.push(`Your target keyword "${targetKeyword}" appears ${keywordCount} times (${keywordDensity.toFixed(2)}%). This might be over-optimization. Consider reducing usage.`)
        } else {
          recommendations.push(`Great! Your target keyword "${targetKeyword}" has optimal density (${keywordDensity.toFixed(2)}%).`)
        }
      }

      if (totalWords < 300) {
        recommendations.push('Consider adding more content. Aim for at least 300-500 words for better SEO.')
      } else if (totalWords > 2000) {
        recommendations.push('Your content is quite long. Consider breaking it into multiple pages or sections.')
      }

      if (topKeywords.length > 0 && topKeywords[0].density > 5) {
        recommendations.push(`The word "${topKeywords[0].word}" appears very frequently (${topKeywords[0].density.toFixed(2)}%). Consider using synonyms for better readability.`)
      }

      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const avgWordsPerSentence = totalWords / Math.max(sentences, 1)
      const avgCharsPerWord = totalCharacters / Math.max(totalWords, 1)

      let readabilityScore = 100 - (avgWordsPerSentence * 1.5) - (avgCharsPerWord * 2)
      readabilityScore = Math.max(0, Math.min(100, readabilityScore))

      if (readabilityScore < 50) {
        recommendations.push('Consider using shorter sentences and simpler words to improve readability.')
      }

      setAnalysis({
        totalWords,
        totalCharacters,
        keywordCount,
        keywordDensity,
        topKeywords,
        recommendations,
        readabilityScore
      })

      // Increment usage count and save to session storage
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('keywordAnalyzerUsage', newUsageCount.toString())

      setForm(prev => ({ ...prev, isAnalyzing: false }))
    }, 1500)
  }

  const resetAnalysis = () => {
    setForm({
      content: '',
      targetKeyword: '',
      isAnalyzing: false,
      results: null
    })
    setUrl('')
    setInputMode('text')
    setAnalysis(null)
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">

      {/* Tool Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-center leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Keyword Density
              </span>{' '}
              <span className="text-primary">Analyzer</span>
            </h1>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Instant Analysis
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Top Keywords Report
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                SEO Recommendations
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>

            {/* Answer Capsule */}
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                Stop guessing about your keyword usage. Our <strong>Free Keyword Density Analyzer</strong> gives you instant insights into how often keywords appear in your content, helping you strike the perfect balance between optimization and natural readability. Whether you're writing blog posts, product descriptions, or web pages, this tool ensures your content is optimized without risking keyword stuffing penalties.
              </p>
            </div>

            {/* Two-column tool */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Input Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-900">Content Analysis</h2>

                {/* Usage Counter */}
                {(usageCount > 0 || usageCount >= usageLimit) && (
                  <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium mb-4 ${
                    usageCount >= usageLimit
                      ? 'bg-orange-100 text-orange-800 border border-orange-200'
                      : 'bg-green-100 text-green-800 border border-green-200'
                  }`}>
                    <span className="mr-2">📊</span>
                    {usageCount >= usageLimit
                      ? 'Session limit reached. Refresh page to continue.'
                      : `${usageLimit - usageCount} of ${usageLimit} session analyses remaining`
                    }
                  </div>
                )}

                <div className="space-y-5">

                  {/* Input Mode Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Choose Analysis Method *
                    </label>
                    <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setInputMode('text')}
                        className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors ${
                          inputMode === 'text'
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        📝 Text Content
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputMode('url')}
                        className={`flex-1 py-2.5 px-4 text-sm font-medium transition-colors border-l border-gray-200 ${
                          inputMode === 'url'
                            ? 'bg-primary text-white'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        🌐 Website URL
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {inputMode === 'text'
                        ? 'Paste your content directly for analysis'
                        : 'Analyze content from any webpage'}
                    </p>
                  </div>

                  {/* Target Keyword */}
                  <div>
                    <label htmlFor="targetKeyword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Keyword (Optional)
                    </label>
                    <input
                      type="text"
                      id="targetKeyword"
                      value={form.targetKeyword}
                      onChange={(e) => setForm(prev => ({ ...prev, targetKeyword: e.target.value }))}
                      placeholder="e.g., SEO tips, digital marketing"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base placeholder-gray-400"
                      disabled={form.isAnalyzing}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter your main keyword to check its density</p>
                  </div>

                  {/* URL Input */}
                  {inputMode === 'url' && (
                    <div>
                      <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-2">
                        Website URL to Analyze *
                      </label>
                      <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com/your-page"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base placeholder-gray-400"
                        disabled={form.isAnalyzing}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the URL of the webpage you want to analyze for keyword density
                      </p>
                    </div>
                  )}

                  {/* Text Content Input */}
                  {inputMode === 'text' && (
                    <div>
                      <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                        Content to Analyze *
                      </label>
                      <textarea
                        id="content"
                        value={form.content}
                        onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Paste your article, blog post, or web page content here..."
                        rows={10}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none text-base placeholder-gray-400"
                        disabled={form.isAnalyzing}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {form.content.length} characters • {form.content.trim().split(/\s+/).filter(word => word.length > 0).length} words
                      </p>
                    </div>
                  )}

                  {/* Human Verification */}
                  <div className="p-4 border-2 border-blue-200 bg-blue-50 rounded-xl">
                    <div className="flex items-center mb-3">
                      <span className="text-blue-600 mr-2">🛡️</span>
                      <span className="text-sm font-semibold text-blue-800">Human Verification Required</span>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Please verify that you're not a robot to analyze your content.
                    </p>
                    <div className="mb-3">
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
                        <span className="text-sm font-medium text-green-800">Verification successful! You can now analyze your content.</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={analyzeContent}
                      disabled={form.isAnalyzing || (inputMode === 'text' && !form.content.trim()) || (inputMode === 'url' && !url.trim()) || !isVerified || usageCount >= usageLimit}
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-base rounded-xl hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 shadow-lg"
                    >
                      {form.isAnalyzing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        '🔍 Analyze Content'
                      )}
                    </button>
                    {analysis && (
                      <button
                        onClick={resetAnalysis}
                        className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                      >
                        🔄 Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Feature Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-semibold mb-4 text-gray-900 text-center">Key Features:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Real-time Density</div>
                        <div className="text-gray-600">Instant calculations for text or URL</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Top Keywords Report</div>
                        <div className="text-gray-600">See top 10 keywords by frequency</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Readability Score</div>
                        <div className="text-gray-600">Measure content complexity</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Stop Word Filtering</div>
                        <div className="text-gray-600">Focus only on meaningful keywords</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-900">Analysis Results</h2>

                {!analysis ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📊</span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Enter your content and click "Analyze Content" to see detailed keyword density analysis
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{analysis.totalWords.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Total Words</div>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{analysis.totalCharacters.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Characters</div>
                      </div>
                    </div>

                    {/* Target Keyword Analysis */}
                    {form.targetKeyword && (
                      <div className="border border-gray-200 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Target Keyword Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Keyword:</span>
                            <span className="font-semibold text-primary text-sm">"{form.targetKeyword}"</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Count:</span>
                            <span className="font-semibold text-sm">{analysis.keywordCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 text-sm">Density:</span>
                            <span className={`font-semibold text-sm ${
                              analysis.keywordDensity >= 0.5 && analysis.keywordDensity <= 3
                                ? 'text-green-600'
                                : 'text-orange-600'
                            }`}>
                              {analysis.keywordDensity.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Readability Score */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Readability Score</h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${
                              analysis.readabilityScore >= 70 ? 'bg-green-500' :
                              analysis.readabilityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(analysis.readabilityScore, 10)}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-800 text-sm w-16 text-right">
                          {analysis.readabilityScore.toFixed(0)}/100
                        </span>
                      </div>
                    </div>

                    {/* Top Keywords */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Top Keywords</h3>
                      <div className="space-y-1 max-h-48 overflow-y-auto">
                        {analysis.topKeywords.map((keyword, index) => (
                          <div key={index} className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 bg-primary/10 text-primary text-xs font-bold rounded flex items-center justify-center flex-shrink-0">
                                {index + 1}
                              </span>
                              <span className="text-gray-800 font-medium text-sm">{keyword.word}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500">{keyword.count}x</span>
                              <span className="text-xs text-primary ml-2 font-medium">{keyword.density.toFixed(2)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SEO Recommendations */}
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">SEO Recommendations</h3>
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-primary mt-0.5 flex-shrink-0 text-sm">•</span>
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <ToolBreadcrumb toolName="Keyword Density Analyzer" toolSlug="keyword-density-analyzer" />

      {/* Introduction Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                <strong>Ready to optimize your content?</strong> Try the Keyword Density Analyzer now and get instant recommendations to improve your SEO performance.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300"
                >
                  🎯 Use the Tool Above →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Keyword Density Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                What is Keyword Density and Why Does It Matter?
              </span>
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Keyword density is the percentage of times a target keyword appears in your content compared to the total word count. While there's no "perfect" density percentage, maintaining the right balance is crucial for SEO success.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's why keyword density matters:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Search engines need context</strong> to understand what your content is about</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Over-optimization can trigger penalties</strong> and hurt your rankings</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Under-optimization means missed opportunities</strong> for relevant traffic</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Natural keyword distribution</strong> improves user experience and readability</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  <strong>The sweet spot?</strong> Most SEO experts recommend keeping primary keyword density between <strong className="text-primary">1-3%</strong> for optimal results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Key Features of Our Keyword Density Analyzer
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Comprehensive Keyword Analysis</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">✓</span><span><strong>Real-time density calculations</strong> for any text or webpage URL</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">✓</span><span><strong>Primary and secondary keyword tracking</strong> to monitor all target terms</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">✓</span><span><strong>Phrase density analysis</strong> for long-tail keywords and key phrases</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">✓</span><span><strong>Word count statistics</strong> to understand content length and structure</span></li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Advanced Analytics and Insights</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">✓</span><span><strong>Keyword frequency charts</strong> showing exact occurrence counts</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">✓</span><span><strong>Density percentage breakdowns</strong> for every keyword and phrase</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">✓</span><span><strong>Stop word filtering</strong> to focus on meaningful content words</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">✓</span><span><strong>Keyword distribution mapping</strong> throughout your content</span></li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🎨</span>
                  </div>
                  <h3 className="font-bold text-gray-900">User-Friendly Interface</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-purple-600 mr-2 mt-0.5">✓</span><span><strong>Simple copy-paste functionality</strong> for quick text analysis</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-2 mt-0.5">✓</span><span><strong>URL analysis capability</strong> to check live webpages</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-2 mt-0.5">✓</span><span><strong>Clean, easy-to-read reports</strong> that anyone can understand</span></li>
                  <li className="flex items-start"><span className="text-purple-600 mr-2 mt-0.5">✓</span><span><strong>Mobile-responsive design</strong> for analysis on any device</span></li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Professional SEO Features</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-orange-600 mr-2 mt-0.5">✓</span><span><strong>Keyword highlighting</strong> to visualize distribution patterns</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-2 mt-0.5">✓</span><span><strong>Export functionality</strong> for detailed reporting and client presentations</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-2 mt-0.5">✓</span><span><strong>Bulk keyword tracking</strong> for comprehensive content audits</span></li>
                  <li className="flex items-start"><span className="text-orange-600 mr-2 mt-0.5">✓</span><span><strong>Historical comparison</strong> to track optimization improvements</span></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How to Use the Keyword Density Analyzer
              </span>
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">📝</span>
                  </div>
                  For Text Content
                </h3>
                <div className="space-y-4">
                  {[
                    'Copy your content from your document or CMS',
                    'Paste it into the analyzer input field',
                    'Click "Analyze Content" to generate your report',
                    'Review the results and identify optimization opportunities',
                    'Adjust your content based on the recommendations'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 text-white">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">🌐</span>
                  </div>
                  For Live Webpages
                </h3>
                <div className="space-y-4">
                  {[
                    'Enter the webpage URL you want to analyze',
                    'Click "Analyze URL" to fetch and process the content',
                    'Review keyword density for all detected keywords',
                    'Compare with competitors to identify gaps',
                    'Optimize your content for better performance'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-sm font-semibold flex-shrink-0 text-white">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-sm leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-lg font-bold mb-6 text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">📊</span>
                  </div>
                  Understanding Results
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></span>
                    <div>
                      <strong className="text-gray-800 text-sm">Green indicators:</strong>
                      <p className="text-sm text-gray-600">Optimal keyword density (1-3%)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-4 h-4 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
                    <div>
                      <strong className="text-gray-800 text-sm">Yellow indicators:</strong>
                      <p className="text-sm text-gray-600">Slightly high density (3-5%) - monitor closely</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></span>
                    <div>
                      <strong className="text-gray-800 text-sm">Red indicators:</strong>
                      <p className="text-sm text-gray-600">Potential over-optimization (5%+) - reduce usage</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SEO Best Practices Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SEO Best Practices for Keyword Density
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Primary Keywords</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">•</span><span>Keep density between <strong>1-3%</strong> for main target keywords</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">•</span><span>Use variations and synonyms naturally throughout content</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">•</span><span>Focus on user intent rather than strict percentage targets</span></li>
                  <li className="flex items-start"><span className="text-primary mr-2 mt-0.5">•</span><span>Ensure keywords appear in key locations (title, headings, first paragraph)</span></li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🔗</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Secondary Keywords</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">•</span><span>Maintain <strong>0.5-2%</strong> density for supporting keywords</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">•</span><span>Use semantic variations to cover related search terms</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">•</span><span>Balance keyword usage with natural language flow</span></li>
                  <li className="flex items-start"><span className="text-green-600 mr-2 mt-0.5">•</span><span>Include long-tail variations for comprehensive coverage</span></li>
                </ul>
              </div>

            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">💡 Content Optimization Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Write for humans first,</strong> optimize for search engines second</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Use keywords naturally</strong> in context rather than forcing them</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Vary your vocabulary</strong> with synonyms and related terms</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-gray-700"><strong>Focus on topic coverage</strong> rather than keyword repetition</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Common Keyword Density Mistakes to Avoid
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-red-800 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  Over-Optimization Red Flags
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start"><span className="text-red-500 mr-2 mt-0.5">✗</span><span className="text-gray-700">Repeating the same keyword phrase excessively</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 mt-0.5">✗</span><span className="text-gray-700">Forcing keywords into every paragraph unnaturally</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 mt-0.5">✗</span><span className="text-gray-700">Using exact-match keywords when variations would flow better</span></li>
                  <li className="flex items-start"><span className="text-red-500 mr-2 mt-0.5">✗</span><span className="text-gray-700">Ignoring readability for the sake of keyword density</span></li>
                </ul>
              </div>

              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-orange-800 flex items-center">
                  <span className="text-2xl mr-2">❗</span>
                  Under-Optimization Issues
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start"><span className="text-orange-500 mr-2 mt-0.5">!</span><span className="text-gray-700">Failing to use target keywords in important sections</span></li>
                  <li className="flex items-start"><span className="text-orange-500 mr-2 mt-0.5">!</span><span className="text-gray-700">Not including keyword variations and synonyms</span></li>
                  <li className="flex items-start"><span className="text-orange-500 mr-2 mt-0.5">!</span><span className="text-gray-700">Missing opportunities for natural keyword placement</span></li>
                  <li className="flex items-start"><span className="text-orange-500 mr-2 mt-0.5">!</span><span className="text-gray-700">Ignoring search intent in favor of unrelated keywords</span></li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Why Choose SEO Shouts' Keyword Density Analyzer?
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Completely Free to Use</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">No hidden fees, no registration required. Just paste your content and get instant analysis.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Accurate and Reliable</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Built by SEO experts with 13+ years of experience in keyword optimization and content analysis.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Regular Updates</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Our tool evolves with Google's algorithm changes and SEO best practices.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Privacy-Focused</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">Your content is analyzed locally and not stored on our servers.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200 md:col-span-2">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl flex-shrink-0">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">Professional-Grade Results</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">The same quality analysis that we use for client campaigns, available free to everyone.</p>
                  </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Frequently Asked Questions
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">What's the ideal keyword density percentage?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">There's no universal perfect percentage, but <strong>1-3% for primary keywords</strong> is generally recommended. Focus more on natural usage and user value than hitting exact percentages.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can high keyword density hurt my rankings?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Yes, keyword stuffing (excessive keyword repetition) can result in penalties. Our tool helps you identify when density is too high.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Should I analyze just my main content or include navigation?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">For best results, analyze just your main content (body text) rather than including navigation, footers, or sidebar elements.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How often should I check keyword density?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Check density during content creation and before publishing. Also analyze when updating existing content or if you notice ranking changes.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Does the tool work for non-English content?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Yes, our analyzer works with content in multiple languages, though optimal density ranges may vary by language.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I analyze competitor content?</h3>
                <p className="text-gray-600 text-sm leading-relaxed">Yes, you can analyze any publicly accessible webpage using the URL analysis feature.</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Optimizing Your Content Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop leaving your keyword optimization to chance. Use our <strong>Free Keyword Density Analyzer</strong> to ensure your content hits the sweet spot between optimization and readability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Use the Keyword Density Analyzer Tool →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>Analyze content instantly and get optimization recommendations</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📚</span>
                <span>Learn advanced techniques for natural keyword integration</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>Contact our SEO experts for personalized guidance</span>
              </div>
            </div>

            <p className="text-sm mt-6 opacity-80">
              <strong>Perfect your keyword optimization with SEO Shouts' free tools and expert guidance!</strong>
              <br />
              <em>Built by SEO professionals for content creators, marketers, and business owners who want better search rankings through optimized content.</em>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
