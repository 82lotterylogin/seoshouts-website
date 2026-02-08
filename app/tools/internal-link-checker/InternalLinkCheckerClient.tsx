'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'
import InternalLinkVisualization from './InternalLinkVisualization'
import InternalLinkDataTable from './InternalLinkDataTable'
import ExportOptions from './ExportOptions'

interface AnchorData {
  text: string;
  href: string;
  count: number;
  pages: string[];
  destinations?: Array<{ href: string; count: number }>;
}

interface AnalysisInsights {
  totalUniqueAnchors: number;
  totalInternalLinks: number;
  averageLinksPerPage: number;
  pagesCrawled: number;
  successfulPages: number;
  failedPages: number;
  mostFrequentAnchor: AnchorData | null;
  singleUsageAnchors: number;
  topAnchors: AnchorData[];
}

interface CrawledPage {
  url: string;
  title: string;
  linkCount: number;
  error: string | null;
}

interface AnalysisResult {
  baseUrl: string;
  anchors: AnchorData[];
  insights: AnalysisInsights;
  crawledPages: CrawledPage[];
  pagesWithNoLinks?: Array<{
    url: string;
    title: string;
    reason: string;
  }>;
}

interface ProgressStep {
  step: string;
  status: 'in_progress' | 'completed' | 'failed';
  message: string;
  timestamp: number;
}

interface UserInputRequest {
  needsUserInput: boolean;
  step: string;
  message: string;
  progressSteps?: ProgressStep[];
  options?: Array<{ id: string; label: string }>;
  checkedLocations?: string[];
  robotsSitemaps?: string[];
  urlCount?: number;
  sitemapUrl?: string;
}

export default function InternalLinkCheckerClient() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [activeTab, setActiveTab] = useState<'cloud' | 'table' | 'pages' | 'no-links'>('cloud')

  // State for multi-step workflow
  const [userInputRequest, setUserInputRequest] = useState<UserInputRequest | null>(null)
  const [manualSitemapUrl, setManualSitemapUrl] = useState('')
  const [manualUrls, setManualUrls] = useState('')
  const [usageInfo, setUsageInfo] = useState<{
    remainingRequests?: number;
    resetTime?: string;
    isLimitReached?: boolean;
  }>({})

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Group anchors by text to combine duplicates
  const groupAnchors = (anchors: AnchorData[]) => {
    const groupedAnchors = new Map<string, AnchorData>()

    anchors.forEach(anchor => {
      if (groupedAnchors.has(anchor.text)) {
        const existing = groupedAnchors.get(anchor.text)!
        // Combine counts
        existing.count += anchor.count
        // Merge all pages (remove duplicates)
        existing.pages = [...new Set([...existing.pages, ...anchor.pages])]

        // Handle multiple destination URLs properly
        const existingHrefs = existing.href.split(', ').filter(h => h.trim())
        if (!existingHrefs.includes(anchor.href)) {
          existingHrefs.push(anchor.href)
          existing.href = existingHrefs.join(', ')
        }

        // Store detailed destination information
        if (!existing.destinations) {
          const originalHref = existingHrefs[0]
          existing.destinations = [{ href: originalHref, count: existing.count - anchor.count }]
        }

        // Add this destination or update count
        const destIndex = existing.destinations.findIndex(d => d.href === anchor.href)
        if (destIndex >= 0) {
          existing.destinations[destIndex].count += anchor.count
        } else {
          existing.destinations.push({ href: anchor.href, count: anchor.count })
        }

      } else {
        const newAnchor = { ...anchor }
        newAnchor.destinations = [{ href: anchor.href, count: anchor.count }]
        groupedAnchors.set(anchor.text, newAnchor)
      }
    })

    return Array.from(groupedAnchors.values())
  }

  const performAnalysis = async (step: string = 'discover', sitemapUrl?: string, manualUrlList?: string[]) => {
    // Get reCAPTCHA token
    let recaptchaToken = '';

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      try {
        recaptchaToken = await recaptchaRef.current?.getValue() || ''

        if (!recaptchaToken) {
          setError('Please complete the reCAPTCHA verification.')
          return
        }
      } catch (error) {
        setError('reCAPTCHA verification failed. Please try again.')
        return
      }
    } else {
      setError('reCAPTCHA is not properly configured. Please contact support.')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResults(null)
    setUserInputRequest(null)
    setProgress('Analyzing website...')

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800000); // 30 minute timeout

      const requestBody: any = {
        url: url.trim(),
        recaptchaToken,
        step
      }

      if (sitemapUrl) {
        requestBody.sitemapUrl = sitemapUrl
      }

      if (manualUrlList) {
        requestBody.manualUrls = manualUrlList
      }

      const response = await fetch('/api/internal-link-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (!response.ok) {
        // Handle rate limiting response
        if (response.status === 429) {
          setUsageInfo({
            remainingRequests: data.remainingRequests || 0,
            resetTime: data.resetTime || 'tomorrow',
            isLimitReached: true
          })
        }
        throw new Error(data.error || 'Analysis failed')
      }

      // Update usage info on successful request
      if (data.remainingRequests !== undefined) {
        setUsageInfo({
          remainingRequests: data.remainingRequests,
          resetTime: data.resetTime || 'tomorrow',
          isLimitReached: false
        })
      }

      if (data.success) {
        // Analysis completed successfully
        setResults(data.data)
        setProgress('Analysis completed!')
        recaptchaRef.current?.reset()

        // Update usage info from successful response
        if (data.remainingRequests !== undefined) {
          setUsageInfo({
            remainingRequests: data.remainingRequests,
            resetTime: data.resetTime || 'tomorrow',
            isLimitReached: false
          })
        }
      } else if (data.needsUserInput) {
        // Need user input for next step
        setUserInputRequest(data)
        // Reset reCAPTCHA so it can be used for follow-up requests
        recaptchaRef.current?.reset()
      } else {
        throw new Error(data.error || 'Analysis failed')
      }

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Analysis timed out after 30 minutes. The website may be extremely large, very slow, or blocking our crawler. Please try with a smaller site or specific URLs.')
        } else {
          setError(err.message)
        }
      } else {
        setError('An unexpected error occurred')
      }
      setProgress('')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('Please enter a website URL')
      return
    }

    await performAnalysis()
  }

  const handleUserChoice = async (choice: string) => {
    if (choice === 'provide_sitemap') {
      // Show sitemap URL input
      setUserInputRequest({
        ...userInputRequest!,
        step: 'sitemap_input_needed'
      })
    } else if (choice === 'no_sitemap') {
      // Show manual URL input
      setUserInputRequest({
        ...userInputRequest!,
        step: 'manual_urls_needed'
      })
    } else if (choice === 'retry_sitemap') {
      // Clear sitemap URL and show input again
      setManualSitemapUrl('')
      setUserInputRequest({
        ...userInputRequest!,
        step: 'sitemap_input_needed'
      })
    }
  }

  const handleSitemapSubmit = async () => {
    if (!manualSitemapUrl.trim()) {
      setError('Please enter a sitemap URL')
      return
    }
    await performAnalysis('manual_sitemap', manualSitemapUrl.trim())
  }

  const handleManualUrlsSubmit = async () => {
    if (!manualUrls.trim()) {
      setError('Please enter at least one URL')
      return
    }

    const urlList = manualUrls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0)

    if (urlList.length === 0) {
      setError('Please enter valid URLs')
      return
    }

    await performAnalysis('manual_urls', undefined, urlList)
  }

  const resetAnalysis = () => {
    setResults(null)
    setError('')
    setProgress('')
    setUrl('')
    setActiveTab('cloud')
    setUserInputRequest(null)
    setManualSitemapUrl('')
    setManualUrls('')
    // Don't reset usage info as it should persist across analyses
    recaptchaRef.current?.reset()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">


      {/* Analysis Form */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* H1 Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Internal Link Checker: Audit Anchor Text, Link Distribution & Site Architecture
              </span>
            </h1>

            {/* Answer Capsule */}
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                An internal link checker crawls your website to analyze anchor text patterns, link distribution, and site structure — identifying over-optimization, wasted generic anchors, and keyword stuffing across your internal linking profile. SEOShouts' free tool scans up to 500 URLs and generates a <strong>visual word cloud</strong> showing which anchor phrases dominate your link structure, a feature no other free tool offers.
              </p>
            </div>

            {!results ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <form onSubmit={handleAnalyze}>
                  <div className="text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900">
                      Analyze Your Website's Internal Link Structure
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Enter your website URL below to start crawling and analyzing internal anchor text patterns.
                    </p>

                    {/* Usage Counter */}
                    {(usageInfo.remainingRequests !== undefined || usageInfo.isLimitReached) && (
                      <div className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        usageInfo.isLimitReached
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : usageInfo.remainingRequests === 0
                          ? 'bg-orange-100 text-orange-800 border border-orange-200'
                          : 'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {usageInfo.isLimitReached ? (
                          <>
                            <span className="mr-2">🚫</span>
                            Daily limit reached. Resets: {usageInfo.resetTime}
                          </>
                        ) : (
                          <>
                            <span className="mr-2">📊</span>
                            {usageInfo.remainingRequests} of 5 daily uses remaining
                            {usageInfo.resetTime && (
                              <span className="ml-1 text-xs opacity-75">
                                (Resets: {usageInfo.resetTime})
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="max-w-md mx-auto">
                      <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                        Website URL
                      </label>
                      <input
                        type="url"
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-base placeholder-gray-400"
                        required
                        disabled={isAnalyzing}
                      />
                    </div>

                    {/* reCAPTCHA */}
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                      <div className="flex justify-center mb-4">
                        <ReCAPTCHA
                          ref={recaptchaRef}
                          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                        />
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className={`p-4 border rounded-2xl ${
                        usageInfo.isLimitReached
                          ? 'bg-orange-50 border-orange-200'
                          : 'bg-red-50 border-red-200'
                      }`}>
                        <div className="flex items-start">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 ${
                            usageInfo.isLimitReached
                              ? 'bg-orange-100'
                              : 'bg-red-100'
                          }`}>
                            <span className={`text-sm ${
                              usageInfo.isLimitReached
                                ? 'text-orange-600'
                                : 'text-red-600'
                            }`}>
                              {usageInfo.isLimitReached ? '🚫' : '⚠️'}
                            </span>
                          </div>
                          <div>
                            <h4 className={`font-semibold mb-1 ${
                              usageInfo.isLimitReached
                                ? 'text-orange-800'
                                : 'text-red-800'
                            }`}>
                              {usageInfo.isLimitReached ? 'Usage Limit Reached' : 'Analysis Error'}
                            </h4>
                            <p className={`text-sm ${
                              usageInfo.isLimitReached
                                ? 'text-orange-700'
                                : 'text-red-700'
                            }`}>
                              {error}
                            </p>
                            {usageInfo.isLimitReached && (
                              <div className="mt-2 text-xs text-orange-600">
                                <p>📊 This tool is free and limited to 5 analyses per day to ensure fair usage for all users.</p>
                                <p>🔄 Your usage limit will reset at midnight (your local time).</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Loading Indicator */}
                    {isAnalyzing && (
                      <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mr-3"></div>
                        <span className="text-blue-700 font-medium">
                          {progress || 'Analyzing website...'}
                        </span>
                      </div>
                    )}

                    {/* User Input Request */}
                    {userInputRequest && (
                      <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl">
                        <div className="flex items-start mb-4">
                          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-yellow-600 text-lg">📝</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-yellow-800 mb-2">User Input Required</h4>
                            <p className="text-yellow-700 text-sm mb-4">{userInputRequest.message}</p>


                            {/* Options for no sitemap found */}
                            {userInputRequest.step === 'no_sitemap_found' && userInputRequest.options && (
                              <div className="space-y-2">
                                {userInputRequest.options.map((option) => (
                                  <button
                                    key={option.id}
                                    onClick={() => handleUserChoice(option.id)}
                                    className="w-full text-left p-3 bg-white hover:bg-yellow-50 border border-yellow-200 rounded-lg transition-colors text-sm font-medium text-gray-700 hover:text-yellow-800"
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Manual Sitemap URL Input */}
                            {userInputRequest.step === 'sitemap_input_needed' && (
                              <div className="space-y-3">
                                <input
                                  type="url"
                                  placeholder="Enter sitemap URL (e.g., https://example.com/sitemap.xml)"
                                  value={manualSitemapUrl}
                                  onChange={(e) => setManualSitemapUrl(e.target.value)}
                                  className="w-full p-3 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleSitemapSubmit}
                                    disabled={!manualSitemapUrl.trim()}
                                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                  >
                                    Analyze Sitemap
                                  </button>
                                  <button
                                    onClick={() => handleUserChoice('no_sitemap')}
                                    className="px-4 py-2 text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-50 font-medium text-sm"
                                  >
                                    No Sitemap
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Manual URLs Input */}
                            {userInputRequest.step === 'manual_urls_needed' && (
                              <div className="space-y-3">
                                <textarea
                                  placeholder="Enter URLs to analyze (one per line)&#10;https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                                  value={manualUrls}
                                  onChange={(e) => setManualUrls(e.target.value)}
                                  rows={6}
                                  className="w-full p-3 border border-yellow-200 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm resize-none"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleManualUrlsSubmit}
                                    disabled={!manualUrls.trim()}
                                    className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
                                  >
                                    Analyze URLs
                                  </button>
                                  <button
                                    onClick={() => handleUserChoice('provide_sitemap')}
                                    className="px-4 py-2 text-yellow-700 border border-yellow-300 rounded-lg hover:bg-yellow-50 font-medium text-sm"
                                  >
                                    Try Sitemap
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* URL Limit Exceeded */}
                            {userInputRequest.step === 'url_limit_exceeded' && (
                              <div className="space-y-3">
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-red-700 text-sm">
                                    <strong>Found {userInputRequest.urlCount} URLs</strong> - exceeds our limit of 500 URLs for optimal performance.
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleUserChoice('no_sitemap')}
                                  className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium text-sm"
                                >
                                  Provide Specific URLs Instead
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        disabled={isAnalyzing || !url.trim() || usageInfo.isLimitReached}
                        className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-lg rounded-xl hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 shadow-lg"
                      >
                        {isAnalyzing ? (
                          'Analyzing Website...'
                        ) : usageInfo.isLimitReached ? (
                          'Daily Limit Reached'
                        ) : (
                          <>
                            🔍 Analyze Internal Links
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Feature Info */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold mb-6 text-gray-900 text-center">Key Features:</h3>
                  <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Visual Anchor Cloud</div>
                          <div className="text-gray-600">Instantly see which words dominate your internal linking profile</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Keyword Stuffing Detection</div>
                          <div className="text-gray-600">Identify if you are aggressively over-using specific keywords</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Generic Link Finder</div>
                          <div className="text-gray-600">Spot wasted opportunities like "read more" or "this post"</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Deep Crawl Analysis</div>
                          <div className="text-gray-600">Scan up to 500 URLs to get a complete picture of your site's semantic structure</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Results Section */
              <div className="space-y-8">

                {/* Results Header */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 sm:p-6 lg:p-8 relative overflow-visible">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent"></div>

                  <div className="relative z-10 flex flex-col items-center text-center sm:flex-row sm:justify-between sm:items-center sm:text-left">
                    <div className="mb-4 sm:mb-0">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 text-gray-900">
                        Analysis Complete ✅
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 break-all sm:break-normal">
                        <span className="font-medium">{results.baseUrl}</span>
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <ExportOptions results={results} />
                      <button
                        onClick={resetAnalysis}
                        className="px-4 sm:px-6 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors w-full sm:w-auto text-sm sm:text-base"
                      >
                        🔄 New Analysis
                      </button>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                      {results.insights.totalUniqueAnchors.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Unique Anchors</div>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                      {results.insights.totalInternalLinks.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Total Links</div>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                      {results.insights.pagesCrawled.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Pages Crawled</div>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1 sm:mb-2">
                      {results.insights.successfulPages.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">With Anchor Text</div>
                  </div>
                  <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 text-center">
                    <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary mb-1 sm:mb-2">
                      {results.insights.averageLinksPerPage.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Avg Links/Page</div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="border-b border-gray-200">
                    <nav className="flex overflow-x-auto scrollbar-hide">
                      <button
                        onClick={() => setActiveTab('cloud')}
                        className={`min-w-0 flex-1 py-3 px-3 sm:py-4 sm:px-6 text-center font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                          activeTab === 'cloud'
                            ? 'bg-primary text-white border-b-2 border-primary'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        <span className="block sm:inline text-lg sm:text-base">☁️</span>
                        <span className="hidden xs:inline sm:inline"> Word Cloud</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('table')}
                        className={`min-w-0 flex-1 py-3 px-3 sm:py-4 sm:px-6 text-center font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                          activeTab === 'table'
                            ? 'bg-primary text-white border-b-2 border-primary'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        <span className="block sm:inline text-lg sm:text-base">📊</span>
                        <span className="hidden xs:inline sm:inline"> Data Table</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('pages')}
                        className={`min-w-0 flex-1 py-3 px-3 sm:py-4 sm:px-6 text-center font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                          activeTab === 'pages'
                            ? 'bg-primary text-white border-b-2 border-primary'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        <span className="block sm:inline text-lg sm:text-base">📄</span>
                        <span className="hidden xs:inline sm:inline"> All Pages</span>
                        <span className="hidden sm:inline"> ({results.insights.pagesCrawled})</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('no-links')}
                        className={`min-w-0 flex-1 py-3 px-3 sm:py-4 sm:px-6 text-center font-medium transition-colors text-xs sm:text-sm whitespace-nowrap ${
                          activeTab === 'no-links'
                            ? 'bg-primary text-white border-b-2 border-primary'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                        }`}
                      >
                        <span className="block sm:inline text-lg sm:text-base">❌</span>
                        <span className="hidden xs:inline sm:inline"> No Links</span>
                        <span className="hidden sm:inline"> ({results.pagesWithNoLinks?.length || 0})</span>
                      </button>
                    </nav>
                  </div>

                  <div className="p-3 sm:p-6 lg:p-8">
                    {activeTab === 'cloud' && (
                      <InternalLinkVisualization
                        anchors={groupAnchors(results.anchors)}
                        insights={results.insights}
                      />
                    )}
                    {activeTab === 'table' && (
                      <InternalLinkDataTable
                        anchors={groupAnchors(results.anchors)}
                        insights={results.insights}
                      />
                    )}
                    {activeTab === 'pages' && (
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <h3 className="text-xl font-bold">All Crawled Pages</h3>
                          <div className="text-sm text-gray-600">
                            {results.insights.pagesCrawled} total • {results.insights.successfulPages} with anchor text • {results.pagesWithNoLinks?.length || 0} without links
                          </div>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {results.crawledPages.map((page, index) => (
                            <div
                              key={index}
                              className={`p-4 rounded-xl border ${
                                page.error
                                  ? 'bg-red-50 border-red-200'
                                  : page.linkCount > 0
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    {page.error ? (
                                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                                    ) : page.linkCount > 0 ? (
                                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                                    ) : (
                                      <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></span>
                                    )}
                                    <div className="font-medium text-sm text-gray-900 truncate">
                                      {page.title || 'Untitled'}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-500 truncate ml-4">
                                    {page.url}
                                  </div>
                                  {page.error && (
                                    <div className="text-xs text-red-600 mt-1 ml-4">
                                      Error: {page.error}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className={`text-sm font-medium ${
                                    page.error ? 'text-red-600' :
                                    page.linkCount > 0 ? 'text-green-600' : 'text-gray-500'
                                  }`}>
                                    {page.error ? 'Failed' : `${page.linkCount} links`}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeTab === 'no-links' && (
                      <div>
                        <h3 className="text-xl font-bold mb-6">Pages with No Internal Links</h3>
                        {results.pagesWithNoLinks && results.pagesWithNoLinks.length > 0 ? (
                          <div className="space-y-3 max-h-96 overflow-y-auto">
                            {results.pagesWithNoLinks.map((page, index) => (
                              <div
                                key={index}
                                className="p-4 rounded-xl border bg-yellow-50 border-yellow-200"
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-gray-900 truncate">
                                      {page.title}
                                    </div>
                                    <div className="text-xs text-gray-500 truncate mt-1">
                                      {page.url}
                                    </div>
                                    <div className="text-xs text-yellow-700 mt-2 flex items-center">
                                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                      {page.reason}
                                    </div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                                      No Links
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="text-green-600 text-2xl">✅</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Excellent!</h4>
                            <p className="text-gray-600">All pages have internal links in their content.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <ToolBreadcrumb toolName="Internal Link Checker" toolSlug="internal-link-checker" />

      {/* Author Expertise Block */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">RS</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    Built by Rohit Sharma — 13+ Years in Technical SEO
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "I built this internal link checker after auditing 500+ websites and finding the same pattern: site owners obsess over broken links but completely ignore what their anchor text tells Google. This tool doesn't just find links — it visualizes the words you're using and shows whether they're helping or hurting your rankings."
                  </p>
                  <p className="text-gray-800 font-medium">
                    — Rohit Sharma, Founder of SEOShouts | <a href="/meet-the-experts/" className="text-primary hover:underline">Meet Our Experts</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Is an Internal Link Checker Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                What Is an Internal Link Checker and Why Do You Need One?
              </span>
            </h2>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                An internal link checker is an SEO tool that crawls your website to map how pages connect to each other through hyperlinks. It analyzes anchor text (the clickable words in each link), tracks link distribution across your site, identifies broken or redirected links, and flags pages that receive too few or too many incoming links.
              </p>

              <p>
                Most internal link tools stop at finding broken links and counting totals. That misses the point entirely. The real value lies in <strong>anchor text analysis</strong> — understanding what words you're using to link pages together, because those words directly tell Google what each destination page is about.
              </p>

              <p>
                Google's John Mueller confirmed this in a Search Central session: <strong>"Internal linking is super critical for SEO. It's one of the biggest things that you can do on a website to guide Google and guide visitors to the pages that you think are important."</strong>
              </p>

              <p>
                According to Semrush's site audit data, <strong>25% of all web pages have zero incoming internal links</strong> — effectively invisible to both search engines and users. Meanwhile, Zyppy's study of 23 million internal links found that pages with <strong>more anchor text variations receive significantly more clicks</strong> from Google, proving that diverse, descriptive anchor text directly impacts traffic.
              </p>

              <p>
                The SEOShouts Internal Link Checker addresses both problems: it finds underlinked pages AND shows you exactly what anchor text you're using through a visual word cloud that no other free tool provides.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Key Features of Our Internal Link Checker
              </span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">☁️</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Visual Anchor Text Word Cloud</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Instantly see which words and phrases dominate your internal linking profile. The word cloud sizes each term by frequency — if one keyword towers over everything else, you know your anchor profile is over-optimized. <strong>This feature is unique to SEOShouts — no other free tool offers it.</strong></p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🔍</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Keyword Stuffing Detection</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Identify aggressive over-use of specific anchor keywords before Google's algorithms flag it. Sites with anchor text diversity below 30% have experienced ranking drops of up to 15 positions in competitive niches (Authority Hacker, 2025). Catch the problem early.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Generic Link Finder</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Spot wasted opportunities where you're using "click here," "read more," "learn more," or "this article" as anchor text. These words carry zero semantic value and tell search engines nothing about the destination page. Our tool highlights every instance so you can rewrite them with descriptive anchors.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🕷️</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Deep Crawl Analysis</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">Scan up to 500 URLs to get a complete picture of your site's internal linking structure. The crawler reads actual HTML anchor elements, extracting text between &lt;a&gt; and &lt;/a&gt; tags for accurate insights.</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-6 border border-pink-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">📊</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Anchor Text Grouping & URL Mapping</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">See which anchor texts point to which destination URLs, grouped by frequency. Identify pages receiving too many exact-match anchors and pages receiving none at all.</p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-6 border border-indigo-200 text-left">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <h3 className="font-bold text-gray-900">Zero Barriers</h3>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">No login, no credit card, no account creation. Enter your URL and get results in minutes. Free for every analysis, every time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How to Audit Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How to Audit Your Internal Link Anchors (Step-by-Step)
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Optimizing your internal linking structure is one of the fastest ways to improve rankings without building a single backlink. A study by Databox found that <strong>42% of SEO experts spend equal time on internal links as external links</strong> — and for good reason. Here's how to run a complete audit:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </span>
                  Enter Your Domain
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Type your homepage URL into the input field above. Our crawler reads your website's HTML, specifically extracting the anchor text between &lt;a&gt; and &lt;/a&gt; tags. It follows internal links across up to 500 pages to build a comprehensive map of your site's linking vocabulary.
                </p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  <strong>Tip:</strong> For the most thorough analysis, enter your homepage URL rather than an inner page. This gives the crawler the broadest starting point to discover your internal link structure.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </span>
                  Analyze the Word Cloud
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Once the crawl completes, study the visual word cloud. This is your immediate health check.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-gray-700"><strong>What you want to see:</strong> A diverse mix of terms with natural variations. Multiple descriptive phrases at similar sizes means your anchor profile is healthy and balanced.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-0.5 flex-shrink-0">✗</span>
                    <span className="text-gray-700"><strong>What signals a problem:</strong> A single keyword dominating the cloud (appears much larger than everything else). This indicates over-optimization that could trigger Google's spam detection algorithms.</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm mt-3">
                  According to Zyppy's research, <strong>pages with more unique anchor text variations receive significantly more organic clicks</strong>. Diversity isn't just safe — it directly drives traffic.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </span>
                  Review the Data Table
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Switch to the data view for granular insights:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Total Links:</strong> Frequency count for each unique anchor text string</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Destination URLs:</strong> Which pages each anchor points to</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Context:</strong> Source pages using each anchor</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm mt-3">
                  Check your distribution against these benchmarks (covered in detail in the ratio section below). Flag any anchor that appears more than 15% of the time pointing to a single URL — that's a strong signal of over-optimization.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </span>
                  Fix and Optimize
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Use the data to take action:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Replace generic anchors</strong> ("click here," "read more") with descriptive phrases that include relevant keywords</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Diversify over-optimized anchors</strong> by using synonyms, partial matches, and longer natural phrases</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Add internal links to orphan pages</strong> — any page with fewer than 3 incoming internal links needs attention</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Verify link placement</strong> — contextual in-content links pass more authority than navigation or footer links</span>
                  </li>
                </ul>
                <p className="text-gray-700 leading-relaxed text-sm mt-3">
                  After making changes, re-run the analysis to confirm your improvements. Monthly audits keep your anchor profile balanced as you publish new content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Anchor Text Matters Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Why Anchor Text Is the Most Underrated Ranking Factor
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Many site owners chase backlinks while completely ignoring the text within those links. Here's why your internal anchor text strategy matters more than most SEOs realize:
            </p>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">It Directly Tells Google What Pages Are About</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Google's crawlers rely on anchor text to understand what the linked page covers. When you link from Page A to Page B using the anchor <strong>"technical SEO audit checklist"</strong>, you're explicitly signaling to Google that Page B is relevant for that topic.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Google's own documentation on <a href="https://developers.google.com/search/docs/crawling-indexing/links-crawlable" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">link best practices</a> states: "Good anchor text is descriptive, reasonably concise, and relevant to the page that it's on and to the page it links to." When you use vague text like "click here," Google has to guess what the target page is about — and guessing leads to weaker rankings.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>Industry data backs this up:</strong> 8% of SEO professionals rank internal links as the single most important ranking factor, and 42% of marketers invest equal effort in internal and external link building (Sure Oak, 2024).
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">It Builds Topical Authority Across Your Site</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Internal links don't just connect pages — they create <strong>topic clusters</strong> that prove expertise to search engines. When you consistently use relevant, descriptive anchors to link related pages within a topic cluster, you signal to Google that your site has depth and authority on that subject.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  For example, if your site has a pillar guide on <a href="/blog/internal-linking-strategy/" className="text-primary hover:underline">internal linking strategy</a>, and 10 supporting articles all link back to it using varied but topically relevant anchors, Google recognizes that cluster as authoritative content worth ranking.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Yoast's 2025 internal linking guide puts it clearly: "In the age of AI-driven search and generative optimization, internal links are no longer mere SEO signals — they're context signals that shape how AI models understand your topics, your expertise, and your brand."
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">It Protects You from Algorithmic Penalties</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Google's Penguin algorithm specifically targets manipulative anchor text patterns — and it applies to internal links, not just backlinks.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <span className="text-red-600 mr-3 mt-0.5 flex-shrink-0 text-xl">⚠️</span>
                      <div>
                        <p className="text-gray-800">
                          <strong className="text-gray-900">The Risk:</strong> If 100 pages on your site all link to your money page using the exact same keyword anchor, Google may interpret that as manipulation. Research shows sites with anchor text diversity below 30% have experienced ranking drops averaging 15 positions.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-3 mt-0.5 flex-shrink-0 text-xl">✓</span>
                      <div>
                        <p className="text-gray-800">
                          <strong className="text-gray-900">The Solution:</strong> Use our word cloud to instantly spot keyword spikes, then diversify with synonyms, partial matches, and natural language variations. Your anchor profile should look like natural human writing, not a spreadsheet of repeated keywords.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">It Distributes Link Equity to Pages That Need It</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Every internal link passes a portion of the linking page's authority to the destination page. Pages with strong backlink profiles can "share" that authority with newer or weaker pages through strategic internal linking.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  This is why 51% of digital marketers believe every blog post should include at least 2-3 internal links (Databox). Those links aren't just for navigation — they're distributing ranking power across your site.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The key insight: <strong>link from your strongest pages to the pages you most want to rank.</strong> Our internal link checker helps you identify which pages are over-linked (wasting equity on already-strong pages) and which are underlinked (missing out on authority they need).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ideal Anchor Text Ratio Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The Ideal Internal Anchor Text Ratio
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              There's no single "perfect" formula, but analyzing top-ranking sites reveals a consistent healthy pattern. When reviewing your word cloud and data table, aim for this distribution:
            </p>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      <th className="px-6 py-4 text-left font-bold">Anchor Type</th>
                      <th className="px-6 py-4 text-left font-bold">Example</th>
                      <th className="px-6 py-4 text-left font-bold">Target %</th>
                      <th className="px-6 py-4 text-left font-bold">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Descriptive / Partial Match</td>
                      <td className="px-6 py-4 text-gray-700 italic">"check out our internal link audit guide"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                          50-60%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">✅ Safest & Most Useful</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Branded</td>
                      <td className="px-6 py-4 text-gray-700 italic">"according to SEOShouts' analysis"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                          20-30%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">✅ Builds Brand Entity</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Exact Match</td>
                      <td className="px-6 py-4 text-gray-700 italic">"internal link checker"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800">
                          10-15%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">⚠️ High Power, High Risk</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Generic</td>
                      <td className="px-6 py-4 text-gray-700 italic">"click here," "read more"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
                          &lt; 5%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">❌ Zero SEO Value</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Naked URL</td>
                      <td className="px-6 py-4 text-gray-700 italic">"seoshouts.com/tools/"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-red-100 text-red-800">
                          &lt; 5%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">❌ Wasted Opportunity</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <p className="text-gray-800 mb-4">
                <strong>Critical rule:</strong> Never use the same anchor text twice for the same target URL. If 10 different pages link to your pricing page, each one should use a different anchor variation. Repetition is the fastest path to over-optimization.
              </p>
              <p className="text-gray-800 mb-4">
                Zyppy's study of 23 million internal links confirmed that <strong>anchor text variety correlates directly with organic traffic</strong> — the more unique anchors pointing to a page, the more clicks it receives from Google.
              </p>
              <p className="text-gray-800">
                <strong>Pro Tip:</strong> Use our word cloud to check if your percentages are skewed too heavily toward "Exact Match" or "Generic." A healthy cloud shows many terms at similar sizes, not one keyword dominating everything else.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Common Mistakes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                5 Common Anchor Text Mistakes (And How to Fix Them)
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Run the SEOShouts Internal Link Checker to find these specific problems in your site structure:
            </p>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">1. The "Click Here" Problem</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>What it looks like:</strong> Anchors like "Click here," "Read more," "Learn more," "This article," or "This post" scattered throughout your content.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Why it hurts:</strong> These words carry zero semantic value. They tell Google absolutely nothing about the destination page. Every generic anchor is a missed opportunity to send a topical relevance signal.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>How to fix it:</strong> Search your report for generic terms. Locate the source pages and rewrite each link.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <span className="text-red-600 mr-3 flex-shrink-0">✗</span>
                      <span className="text-gray-700">Bad: "Click here to see our services."</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-3 flex-shrink-0">✓</span>
                      <span className="text-gray-700">Good: "Explore our <a href="/services/technical-seo-audit/" className="text-primary hover:underline">technical SEO audit services</a>."</span>
                    </div>
                    <div className="flex items-start mt-3">
                      <span className="text-red-600 mr-3 flex-shrink-0">✗</span>
                      <span className="text-gray-700">Bad: "Read more about this topic."</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-3 flex-shrink-0">✓</span>
                      <span className="text-gray-700">Good: "Learn how <a href="/blog/anchor-text-optimization/" className="text-primary hover:underline">anchor text optimization</a> impacts your rankings."</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">2. Exact-Match Keyword Stuffing</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>What it looks like:</strong> The same high-value keyword used as anchor text on dozens of internal links, all pointing to the same page.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Why it hurts:</strong> It looks unnatural and robotic. Google's algorithms detect this pattern and may flag it as manipulative — even for internal links. The Penguin algorithm doesn't distinguish between internal and external anchor spam.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>How to fix it:</strong> Check the word cloud. If your main keyword is the largest word by far, you need to diversify immediately. Use synonyms, LSI variations, and longer natural phrases:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700">Instead of repeating "SEO audit" 20 times, use: "website audit checklist," "analyze your site's SEO health," "run a comprehensive site review," "check your on-page factors," etc.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">3. Mismatched Anchors</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>What it looks like:</strong> Linking to a page about "local SEO services" using anchor text about "website development" or some other unrelated topic.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Why it hurts:</strong> It creates a relevancy conflict. Google expects the anchor text to accurately describe the destination. Mismatches confuse both algorithms and users who click expecting one thing but land on something else.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>How to fix it:</strong> Review your data table. For each anchor text, verify it aligns with the actual content of the target URL. If it doesn't match, rewrite the anchor to accurately reflect the destination.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">4. Naked URL Anchors</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>What it looks like:</strong> Using raw URLs as the visible link text: "Check out https://seoshouts.com/tools/on-page-seo-analyzer/ for more."
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Why it hurts:</strong> While not harmful, it's a significant wasted opportunity. A naked URL passes no topical signal to Google about what the destination page covers.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>How to fix it:</strong> Replace every raw URL anchor with a descriptive phrase:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700">Check out our <a href="/tools/on-page-seo-analyzer/" className="text-primary hover:underline">on-page SEO analyzer with 100+ ranking factors</a> for a deeper audit.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">5. Orphan Pages with Zero Internal Links</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>What it looks like:</strong> Important pages on your site that receive no internal links from any other page.
                </p>
                <p className="text-gray-700 leading-relaxed mb-3">
                  <strong>Why it hurts:</strong> Search engines struggle to discover orphan pages. According to Semrush, 25% of all web pages have zero incoming internal links. These pages receive virtually no organic traffic regardless of their content quality.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  <strong>How to fix it:</strong> After running our tool, check which destination URLs appear least frequently. Cross-reference with your sitemap to find pages not appearing in the report at all. Add at least 3 internal links from relevant content pages to each orphan page, using varied descriptive anchors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Many Internal Links Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How Many Internal Links Should a Page Have?
              </span>
            </h2>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                This is one of the most debated questions in SEO, and Zyppy answered it with data.
              </p>

              <p>
                Their analysis of <strong>23 million internal links</strong> found clear patterns:
              </p>

              <ul className="space-y-3 ml-6">
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1 flex-shrink-0">•</span>
                  <span><strong>40-44 internal links:</strong> The range where pages receive the most clicks from Google</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1 flex-shrink-0">•</span>
                  <span><strong>45-50 internal links:</strong> Peak traffic performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1 flex-shrink-0">•</span>
                  <span><strong>50+ internal links:</strong> Traffic declines — Google may discount the value of individual links when pages are link-saturated</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-3 mt-1 flex-shrink-0">•</span>
                  <span><strong>3-5 contextual links per 1,000 words:</strong> The recommended density for in-content links specifically (not including navigation)</span>
                </li>
              </ul>

              <p>
                <strong>Click depth matters too.</strong> The same study found that pages buried <strong>4 or more clicks deep</strong> from the homepage receive <strong>9x less traffic</strong> than pages within 3 clicks. Internal linking isn't just about anchor text — where you place links in your site hierarchy determines whether pages get found at all.
              </p>

              <p>
                This is why a holistic internal link audit — anchor text quality AND link placement — delivers the biggest ranking improvements. Our tool handles the anchor text analysis; pair it with a <a href="/tools/on-page-seo-analyzer/" className="text-primary hover:underline">full on-page SEO analysis</a> to evaluate overall page structure and depth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Search Optimization Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How to Optimize Internal Links for AI Search Engines (2026)
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              AI search is fundamentally changing how internal links function. Google AI Overviews, ChatGPT, Perplexity, Claude, and Gemini don't just follow links — they use them to build <strong>semantic maps</strong> of your site's knowledge structure.
            </p>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">How AI Models Interpret Your Internal Links</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Traditional search engines follow links to crawl and index pages. AI models go further — they use internal link patterns to understand <strong>topical relationships</strong> between your content.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When your blog post about "anchor text optimization" links to your tool page using the anchor "analyze your anchor text distribution," the AI model learns that these two pieces of content are semantically related and that your site has depth on this topic.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  seoClarity's 2025 research confirmed: <strong>"A strong internal linking structure gives AI engines clearer semantic signals, making it easier for AI search engines to surface your most authoritative and relevant pages in generative results."</strong>
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Natural Language Anchors Beat Keywords for AI</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  AI models process language as vectors — mathematical representations of meaning. Short, robotic keyword anchors provide weak semantic signals. Longer, natural language anchors provide rich context.
                </p>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                          <th className="px-6 py-4 text-left font-bold">❌ Old SEO Anchors</th>
                          <th className="px-6 py-4 text-left font-bold">✅ AI-Optimized Anchors</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700">"internal link checker"</td>
                          <td className="px-6 py-4 text-gray-700">"use our free internal link checker to audit your anchor text"</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700">"best pizza NYC"</td>
                          <td className="px-6 py-4 text-gray-700">"the top-rated pizza places across New York City"</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700">"SEO audit"</td>
                          <td className="px-6 py-4 text-gray-700">"run a comprehensive technical SEO audit of your website"</td>
                        </tr>
                        <tr className="hover:bg-blue-50 transition-colors">
                          <td className="px-6 py-4 text-gray-700">"link building"</td>
                          <td className="px-6 py-4 text-gray-700">"proven strategies for building high-quality backlinks"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mt-4">
                  The shift is clear: <strong>write anchors as if you're explaining the destination to a human</strong>, not stuffing keywords for a crawler.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Testing Your AI Visibility</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We recommend testing your site's AI visibility weekly across ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews, and Copilot. Ask each platform questions about your topic area and track whether your brand appears, what content gets cited, and which competitors show up instead.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  The sites getting cited most in AI responses share three characteristics: descriptive internal anchor text, deep topical clusters, and clear expertise signals. Our internal link checker directly addresses the first requirement — use it alongside proper <a href="/tools/schema-generator/" className="text-primary hover:underline">schema markup</a> and <a href="/tools/robots-txt-generator/" className="text-primary hover:underline">robots.txt configuration for AI crawlers</a> to cover all three.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SEOShouts vs Other Internal Link Checkers
              </span>
            </h2>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      <th className="px-4 py-4 text-left font-bold text-sm">Feature</th>
                      <th className="px-4 py-4 text-center font-bold text-sm">SEOShouts</th>
                      <th className="px-4 py-4 text-center font-bold text-sm">Screaming Frog</th>
                      <th className="px-4 py-4 text-center font-bold text-sm">Ahrefs</th>
                      <th className="px-4 py-4 text-center font-bold text-sm">SEOptimer</th>
                      <th className="px-4 py-4 text-center font-bold text-sm">Sitechecker</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Visual Word Cloud</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          ✅ Unique
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Free Crawl Limit</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">500 pages</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">500 pages</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">Paid only ($99+/mo)</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">Single page</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">14-day trial only</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Anchor Text Grouping</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">No Login Required</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌ (Desktop install)</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌ (Account required)</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌ (Trial signup)</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Browser-Based</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">❌ (Desktop only)</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅ (Cloud)</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Keyword Stuffing Alert</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Generic Anchor Detection</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">Manual only</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">Manual only</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Destination URL Mapping</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                      <td className="px-4 py-3 text-center text-gray-500">❌</td>
                      <td className="px-4 py-3 text-center text-green-600 font-bold">✅</td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-gray-900 text-sm">Cost</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          Free forever
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">Free (limited) / £199/yr</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">$99-$999/mo</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">Free (limited)</td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">$49+/mo</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold mb-3 text-gray-800">When to Choose SEOShouts</h3>
                <p className="text-gray-700 leading-relaxed">
                  Use our tool when you need a <strong>fast, visual health check</strong> of your anchor text profile without installing software or paying for subscriptions. The word cloud gives you an insight in 2 seconds that would take 20 minutes to extract from a Screaming Frog data table.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                <h3 className="text-xl font-bold mb-3 text-gray-800">When You Might Need More</h3>
                <p className="text-gray-700 leading-relaxed">
                  For enterprise sites with 10,000+ pages, full JavaScript rendering, or integration with backlink data, desktop crawlers like Screaming Frog or paid platforms like Ahrefs offer deeper capabilities. For most blogs, small businesses, and service websites under 500 pages, SEOShouts provides everything you need at zero cost.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Audit Checklist Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Complete Internal Link Audit Checklist (2026)
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              Use this checklist after running your SEOShouts analysis. Bookmark it and revisit monthly.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  Link Quantity & Distribution
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Total internal links per page between 40-50 (not exceeding 50)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">All important pages within 3 clicks of homepage</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Zero orphan pages (every page has 3+ incoming internal links)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">3-5 contextual in-content links per 1,000 words</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">High-authority pages link to pages you most want to rank</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">🎯</span>
                  Anchor Text Quality
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Anchor ratio: 50-60% partial match, 10-15% exact, 20-30% branded, &lt;5% generic</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">No duplicate anchor text pointing to the same target URL</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Zero "click here," "read more," or "learn more" anchors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">No naked URL anchors (raw URLs as link text)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Anchors include natural language for AI search parsing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">🔧</span>
                  Technical Health
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">All internal links return 200 status codes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">No redirect chains (301→301) in internal links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">No internal links pointing to noindex pages</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Links use standard HTML &lt;a href&gt; elements (not JavaScript-only)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">No links with empty anchor text</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                  <span className="text-2xl mr-3">🏗️</span>
                  Content Architecture
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Topic clusters bidirectionally linked (pillar ↔ cluster ↔ cluster)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">New content receives 3-5 internal links from existing pages within 48 hours of publishing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Content silos don't create isolated sections with no cross-links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-3 mt-0.5">•</span>
                    <span className="text-gray-700 text-sm">Homepage links to most important category/tool pages directly</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">
              Frequently Asked Questions
            </h2>
            <p className="text-center text-gray-600 mb-10">Everything you need to know about internal link auditing</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:grid-flow-row-dense">
              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What is an internal link checker?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  An internal link checker is an SEO tool that crawls your website to analyze how pages link to each other. It examines anchor text patterns, link distribution, follow/nofollow attributes, and identifies issues like broken links, orphan pages, and over-optimized anchor text. SEOShouts' version adds visual word cloud analysis to show which anchor phrases dominate your linking profile.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>How many internal links should a page have?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  According to Zyppy's analysis of 23 million internal links, pages with 40-44 internal links receive the most Google clicks, with 45-50 being the peak traffic range. Beyond 50 internal links per page, traffic declines significantly. Aim for 3-5 contextual internal links per 1,000 words of content.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What is the ideal anchor text ratio for internal links?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  A healthy distribution is approximately: 50-60% descriptive or partial match anchors, 20-30% branded anchors, 10-15% exact match anchors, and less than 5% generic anchors like "click here." Never use the same anchor text repeatedly for the same target URL.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Can over-optimized anchor text hurt SEO rankings?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Yes. Google's Penguin algorithm specifically targets unnatural anchor text patterns. Sites with anchor text diversity below 30% — meaning the same anchor used more than 70% of the time — have experienced ranking drops of up to 15 positions in competitive niches. Our word cloud visualization makes it easy to spot over-optimization before it triggers penalties.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Is the SEOShouts internal link checker free?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Yes, completely free. The tool crawls up to 500 URLs per analysis with no registration, no credit card, and no usage limits. You get full anchor text analysis, word cloud visualization, keyword stuffing detection, and generic link identification at zero cost.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What makes SEOShouts different from other internal link checkers?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  SEOShouts is the only free internal link checker that generates visual word clouds of your anchor text profile. While tools like Screaming Frog, Ahrefs, and SEOptimer show data in tables, our word cloud gives you an instant visual health check. We also offer anchor text grouping, destination URL analysis, and keyword stuffing detection — all without login or payment.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>How does internal linking affect AI search rankings?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  AI search engines like ChatGPT, Perplexity, and Google Gemini use internal links to understand topical relationships between your pages. Descriptive, natural language anchor text helps AI models map your site's semantic structure more effectively than short keyword anchors. A strong internal linking structure gives AI engines clearer signals about which pages are authoritative.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>How often should I audit internal links?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Run a full internal link audit monthly. Check for sudden spikes in exact-match anchor text, identify orphan pages with zero incoming links, verify all links return 200 status codes, and ensure important pages receive adequate link equity. After publishing new content, immediately add 3-5 internal links from existing relevant pages.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What are orphan pages and why do they matter?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Orphan pages have zero internal links pointing to them. Search engines struggle to discover and index them, and they receive virtually no organic traffic. According to Semrush data, 25% of all web pages have zero incoming internal links. Every important page should have at least 3 incoming internal links from related content.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Does this tool analyze external links too?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  This tool focuses on internal links to help you control relevance flow within your domain. For external link analysis, use our <a href="/tools/on-page-seo-analyzer/" className="text-primary hover:underline">On-Page SEO Analyzer</a> which audits both internal and external links along with 100+ ranking factors.
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Tools Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Explore Our Other Free SEO Tools
                </span>
              </h2>
            </div>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">On-Page SEO Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Audit any page for 100+ ranking factors with real Google PageSpeed API data. Covers technical SEO, content quality, and competitive benchmarks.</p>
                <a href="/tools/on-page-seo-analyzer/" className="text-primary font-medium hover:underline">
                  Analyze your on-page SEO factors →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏗️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Schema Markup Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate JSON-LD structured data for 39+ schema types. Add the markup search engines need to understand your content.</p>
                <a href="/tools/schema-generator/" className="text-primary font-medium hover:underline">
                  Generate schema markup for your pages →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Robots.txt Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create and validate robots.txt files — including directives for AI crawlers like GPTBot, ClaudeBot, and PerplexityBot.</p>
                <a href="/tools/robots-txt-generator/" className="text-primary font-medium hover:underline">
                  Configure your robots.txt for AI crawlers →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Check keyword frequency and semantic density across any page. Ensure your content hits target keywords without over-optimization.</p>
                <a href="/tools/keyword-density-analyzer/" className="text-primary font-medium hover:underline">
                  Check keyword density in your content →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Craft perfect title tags and meta descriptions optimized for click-through rate and search relevance.</p>
                <a href="/tools/meta-tag-optimizer/" className="text-primary font-medium hover:underline">
                  Optimize your meta tags for better CTR →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">XML Sitemap Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create XML sitemaps that help search engines discover and index every important page on your site.</p>
                <a href="/tools/xml-sitemap-generator/" className="text-primary font-medium hover:underline">
                  Create an XML sitemap for your site →
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
                Browse All 15 Free SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">
                All tools are 100% free · No signup required · Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Final Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Start Your Internal Link Audit Now
              </span>
            </h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Poor anchor text hides your best content from Google and AI search engines. Run your analysis in under 5 minutes, identify the problems, and fix them today.
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🔗 Analyze Your Internal Links Now
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>⚡</span>
                <span>Complete analysis in under 5 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>Up to 500 pages crawled per analysis</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>☁️</span>
                <span>Visual word cloud included — only at SEOShouts</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
