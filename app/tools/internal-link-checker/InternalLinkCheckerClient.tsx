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
          <div className="max-w-7xl mx-auto">

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
                  <div className="max-w-4xl mx-auto">
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Advanced SEO Analysis Tool
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Internal Link Anchor Text Checker: Visualize & Optimize Site Structure
              </span>
            </h1>

            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <p className="font-semibold text-gray-800">
                Audit your website's internal link anchors, detect over-optimization, and fix irrelevant keywords. Crawl up to 500 URLs for free—no login required.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">☁️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Visual Anchor Cloud</h3>
                <p className="text-gray-600 text-sm">Instantly see which words dominate your internal linking profile</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🔍</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Keyword Stuffing Detection</h3>
                <p className="text-gray-600 text-sm">Identify if you are aggressively over-using specific keywords</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🚀</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Zero Barriers</h3>
                <p className="text-gray-600 text-sm">No login, no credit card, just instant analysis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Ultimate Tool Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The Ultimate Tool for Anchor Text Optimization
              </span>
            </h2>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-center">
              <p>
                In the world of SEO, a working link is not enough. You need the right link with the right context.
              </p>
              <p>
                Most internal link tools focuses on technical errors like broken links. The <strong>SEO Shouts Internal Link Anchor Text Checker</strong> focuses on <strong>ranking performance</strong>. It analyzes the actual words you are using to link your pages together.
              </p>
              <p>
                Search engines like Google use "Anchor Text" to understand what a page is about. If you use the same keyword too many times, you risk a <strong>"Over-Optimization" penalty</strong>. If you use generic words like "Click Here," you waste a ranking opportunity. Our tool visualizes your data so you can balance your profile perfectly.
              </p>

              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-8 text-gray-800">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200 text-left">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xl">☁️</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Visual Anchor Cloud</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">Instantly see which words dominate your internal linking profile.</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200 text-left">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xl">🔍</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Keyword Stuffing Detection</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">Identify if you are aggressively over-using specific keywords.</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-6 border border-orange-200 text-left">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xl">🎯</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Generic Link Finder</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">Spot wasted opportunities like "read more" or "this post."</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-6 border border-purple-200 text-left">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xl">🕷️</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Deep Crawl Analysis</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">Scan up to 500 URLs to get a complete picture of your site's semantic structure.</p>
                  </div>

                  <div className="bg-gradient-to-br from-pink-50 to-pink-100/50 rounded-xl p-6 border border-pink-200 text-left">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-white text-xl">🚀</span>
                      </div>
                      <h4 className="font-bold text-gray-900">Zero Barriers</h4>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">No login, no credit card, just instant analysis.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* How to Audit Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How to Audit Your Internal Link Anchors (Step-by-Step)
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Optimizing your internal linking structure is one of the fastest ways to improve rankings without building new backlinks. Here is how to use our tool to do it:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">1</span>
                  </span>
                  Input Your Domain
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Enter your homepage URL above. Our crawler is designed to read the HTML of your website, specifically extracting the text between the &lt;a&gt; and &lt;/a&gt; tags.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">2</span>
                  </span>
                  Analyze the "Word Cloud"
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Once the crawl is complete, look at the visual Word Cloud. This is your immediate health check.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-0.5">✓</span>
                    <span className="text-gray-700"><strong>Want:</strong> Diverse mix of terms and natural variations.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2 mt-0.5">✗</span>
                    <span className="text-gray-700"><strong>Avoid:</strong> Single keyword dominating the cloud.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">3</span>
                  </span>
                  Review the "Anchor Text List"
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Switch to the data view to see the breakdown.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Total Links:</strong> Frequency of each anchor text.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">•</span>
                    <span className="text-gray-700"><strong>Context:</strong> Which pages use these anchors.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-white font-bold text-sm">4</span>
                  </span>
                  Update & Optimize
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Use the data to edit your content. Change generic anchors ("click here") to descriptive ones ("view our pricing"). Dilute over-optimized anchors by using synonyms or longer phrases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Anchor Text Matters Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Why Anchor Text is the "Hidden Gem" of SEO Rankings
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Many site owners obsess over getting links, but they ignore the text of those links. Here is why your internal anchor text strategy is critical:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-xl font-bold mb-3 text-gray-800">1. It Provides Context to Google</h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Googlebot is blind; it relies on text to understand images and links. When you link from Page A to Page B using the anchor text <strong>"running shoes,"</strong> you are explicitly telling Google, "Page B is about running shoes."
                </p>
                <div className="bg-blue-100 border border-blue-200 rounded-xl p-3">
                  <p className="text-gray-800 text-sm">
                    <strong>The Opportunity:</strong> If you use the wrong text (or no text), Google has to guess what the target page is about. Our tool ensures you are sending clear signals.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-xl font-bold mb-3 text-gray-800">2. It Defines "Topical Authority"</h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  Internal linking connects related ideas. By consistently using relevant, descriptive anchors within a "Topic Cluster," you prove to search engines that your website is an authority on that specific niche.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 md:col-span-2">
                <h3 className="text-xl font-bold mb-3 text-gray-800">3. Protection Against "Penguin" Penalties</h3>
                <p className="text-gray-700 leading-relaxed text-sm mb-3">
                  Years ago, Google released the "Penguin" algorithm update to punish sites that spammed exact-match keywords.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2 mt-0.5">⚠️</span>
                    <div className="text-sm">
                      <strong className="text-gray-900">The Risk:</strong>
                      <span className="text-gray-700"> If 100 pages link with "Cheap Laptops," Google may flag it as manipulative.</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-2 mt-0.5">✓</span>
                    <div className="text-sm">
                      <strong className="text-gray-900">The Solution:</strong>
                      <span className="text-gray-700"> Our tool spots keyword spikes so you can diversify them.</span>
                    </div>
                  </div>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                4 Common Anchor Text Mistakes (And How to Fix Them)
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-12 text-center">
              Use the SEO Shouts Anchor Text Checker to find these four specific problems in your site structure:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-red-600">1. The "Click Here" Syndrome</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-700 text-sm"><strong>The Problem:</strong> Using generic calls to action like "Click here," "Read more," "Learn more," or "This article."</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm"><strong>Why it hurts:</strong> These words carry zero semantic value. They tell Google nothing about the destination page.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm mb-2"><strong>The Fix:</strong> Search your report for these generic terms. Locate the source pages and rewrite the links.</p>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 text-sm">
                      <div className="flex items-start mb-1">
                        <span className="text-red-600 mr-2">✗</span>
                        <span className="text-gray-700">Bad: "Click here to see our services."</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span className="text-gray-700">Good: "Explore our <strong>SEO audit services</strong>."</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-orange-600">2. Aggressive Exact-Match Stuffing</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-700 text-sm"><strong>The Problem:</strong> Using the exact same high-value keyword for every single link.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm"><strong>Why it hurts:</strong> It looks unnatural and robotic.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm"><strong>The Fix:</strong> Use the Word Cloud. If your main keyword is the biggest word in the cloud, you need to diversify. Use synonyms, LSI keywords (Latent Semantic Indexing), or partial-match phrases.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-yellow-600">3. Irrelevant Anchors</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-700 text-sm"><strong>The Problem:</strong> Linking to a page using text that doesn't match the destination's content.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm"><strong>Why it hurts:</strong> It creates a "relevancy conflict" for Google and frustrates users who click expecting one thing but get another.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm"><strong>The Fix:</strong> Review your table. Ensure the anchor text aligns with the Target URL.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-xl font-bold mb-3 text-purple-600">4. Naked URLs as Anchors</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-700 text-sm"><strong>The Problem:</strong> Linking using the raw URL (e.g., https://mysite.com/blog/post-1) as the visible text.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm"><strong>Why it hurts:</strong> While not "harmful," it is a wasted opportunity. You are missing a chance to use a descriptive keyword.</p>
                  </div>
                  <div>
                    <p className="text-gray-700 text-sm"><strong>The Fix:</strong> Replace raw URL anchors with the title of the post or a summary of the topic.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect Ratio Table Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                The Perfect Internal Anchor Text Ratio
              </span>
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              While there is no "perfect" formula, analyzing top-ranking sites reveals a healthy pattern. When using our tool, aim for a distribution that looks something like this:
            </p>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      <th className="px-6 py-4 text-left font-bold">Anchor Type</th>
                      <th className="px-6 py-4 text-left font-bold">Example</th>
                      <th className="px-6 py-4 text-left font-bold">Estimated Safe %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Descriptive / Partial Match</td>
                      <td className="px-6 py-4 text-gray-700 italic">"Check out our internal link guide"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 text-green-800">
                          50-60%
                        </span>
                        <span className="block text-xs text-gray-600 mt-1">(Safest & Most Useful)</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Branded</td>
                      <td className="px-6 py-4 text-gray-700 italic">"According to SEO Shouts"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                          20-30%
                        </span>
                        <span className="block text-xs text-gray-600 mt-1">(Builds Brand Entity)</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Exact Match</td>
                      <td className="px-6 py-4 text-gray-700 italic">"Internal Link Checker"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-yellow-100 text-yellow-800">
                          10-15%
                        </span>
                        <span className="block text-xs text-gray-600 mt-1">(High Power, High Risk)</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Generic</td>
                      <td className="px-6 py-4 text-gray-700 italic">"Click here"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-800">
                          &lt; 5%
                        </span>
                        <span className="block text-xs text-gray-600 mt-1">(Minimize this)</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">Naked URL</td>
                      <td className="px-6 py-4 text-gray-700 italic">"seoshouts.com"</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-800">
                          &lt; 5%
                        </span>
                        <span className="block text-xs text-gray-600 mt-1">(Minimize this)</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <p className="text-gray-800">
                <strong>💡 Pro Tip:</strong> Use our tool to see if your percentages are skewed too heavily toward "Exact Match" or "Generic."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AIO Strategy Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Advanced Strategy: Optimizing for AI Overviews (AIO)
              </span>
            </h2>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                With the rise of AI search (Google AI Overviews, ChatGPT Search, Perplexity), internal linking is changing. AI models function on "Vector Embeddings"—they look for the relationship between concepts.
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800">How our tool helps you rank in AI:</h3>
                <p className="text-gray-700 mb-4">
                  AI models prefer Descriptive, Natural Language Anchors.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-red-600 mr-3 mt-1">✗</span>
                    <div>
                      <strong className="text-gray-900">Old SEO:</strong>
                      <span className="text-gray-700"> "Best Pizza NYC"</span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 mr-3 mt-1">✓</span>
                    <div>
                      <strong className="text-gray-900">AI SEO:</strong>
                      <span className="text-gray-700"> "the top-rated pizza places in New York City"</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                By using our tool to identify short, robotic keywords and expanding them into natural, conversational phrases, you make your site easier for AI to understand and cite.
              </p>
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
            <p className="text-center text-gray-600 mb-10">Everything you need to know about our Internal Link Checker</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:grid-flow-row-dense">
              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What is Anchor Text?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Anchor text is the visible, clickable text in a hyperlink. It is one of the primary signals search engines use to determine the topic of the linked page.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Can over-optimized anchor text hurt my site?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Yes. Google's algorithms detect unnatural linking patterns. Our tool helps you visualize this risk before it impacts your rankings.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Is this internal link checker free?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Yes, completely free. Get detailed analysis without registration or hidden fees.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>How accurate is the analysis?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Our tool crawls your actual website content and analyzes real HTML anchor elements for accurate insights.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>What makes this tool different?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Visual word clouds, comprehensive anchor text grouping, and detailed URL analysis to optimize your linking strategy.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Can I analyze any website?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Yes, any public website URL. Works with blogs, e-commerce sites, and business websites.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Is it free for large sites?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Free for up to 500 URLs—covers most blogs, small businesses, and service websites.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>How often should I run analysis?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  Monthly or after adding significant content to maintain healthy anchor text distribution.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Does it analyze external links?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  This tool focuses on internal links to help you control relevance flow within your domain.
                </div>
              </details>

              <details className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                  <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>Do you store my website data?</span>
                  <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                </summary>
                <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                  No. All analysis is performed in real-time with complete privacy—nothing is stored.
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
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Explore Our Other SEO Tools</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
              </p>
            </div>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔗</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Internal Link Checker</h3>
                <p className="text-sm text-gray-600 mb-4">Analyze your website's internal link structure and anchor text distribution.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Analyze keyword density and optimize content for target keywords.</p>
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

      {/* Call to Action Section - Final Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Start Your Semantic Audit Now</h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Don't let poor keyword choices hide your best content from Google. Use the <strong>SEO Shouts Internal Link Anchor Text Checker</strong> to visualize your site's vocabulary and create a perfectly balanced linking structure.
            </p>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🔗 Check Your Anchor Text Now
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>⚡</span>
                <span>Complete analysis in under 5 minutes</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>Up to 500 pages analyzed</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Visual word cloud included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consolidated Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://seoshouts.com/#organization",
                "name": "SEO Shouts",
                "url": "https://seoshouts.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://seoshouts.com/assets/images/logo.png",
                  "width": 600,
                  "height": 60
                },
                "description": "SEO Shouts provides free SEO tools and resources to help webmasters optimize their websites.",
                "sameAs": [
                  "https://www.facebook.com/seoshouts",
                  "https://twitter.com/seoshouts",
                  "https://www.linkedin.com/company/seoshouts",
                  "https://www.youtube.com/@seoshouts"
                ]
              },
              {
                "@type": "SoftwareApplication",
                "name": "SEO Shouts Internal Link Anchor Text Checker",
                "url": "https://seoshouts.com/tools/internal-link-checker/",
                "image": "https://seoshouts.com/assets/images/tool-screenshot.jpg",
                "description": "A free SEO tool that audits internal link anchor text, generates visual word clouds to detect over-optimization, and analyzes semantic site structure for up to 500 URLs.",
                "applicationCategory": "SEO Tool",
                "operatingSystem": "Web Browser",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock",
                  "category": "Free Tool"
                },
                "featureList": [
                  "Anchor Text Word Cloud Visualization",
                  "Semantic Site Architecture Analysis",
                  "Internal Link Distribution",
                  "Free 500 URL Crawl Limit",
                  "No Login Required"
                ],
                "author": {
                  "@id": "https://seoshouts.com/#organization"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "ratingCount": "15",
                  "bestRating": "5",
                  "worstRating": "4"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://seoshouts.com/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Free SEO Tools",
                    "item": "https://seoshouts.com/tools/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Internal Link Anchor Text Checker",
                    "item": "https://seoshouts.com/tools/internal-link-checker/"
                  }
                ]
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is Anchor Text?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Anchor text is the visible, clickable text in a hyperlink. In HTML code, it looks like this: <a href=\"...\">This is the Anchor Text</a>. It is one of the primary signals search engines use to determine the topic of the linked page."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why does this tool not show broken links?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We built this tool specifically for Semantic Analysis, not technical maintenance. While finding broken links is useful, fixing your anchor text strategy is what actually boosts your rankings. We focus entirely on helping you optimize the words that connect your pages."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can over-optimized anchor text hurt my site?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. Google's algorithms (specifically Penguin) are trained to detect unnatural linking patterns. If you excessively use \"Money Keywords\" (commercial terms) as internal anchors, Google may devalue those links or penalize the page. Our tool helps you visualize this risk."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How often should I run internal link analysis?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We recommend analyzing your internal links monthly or after adding significant content. Regular monitoring helps maintain healthy anchor text distribution and identify new linking opportunities."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Does this tool analyze external links too?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "This tool scans the links on your page. It captures the anchor text of links pointing internally (to your own site). This allows you to control the flow of relevance within your own domain."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is it free to use for large sites?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "The tool is free for audits up to 500 URLs. This covers the core structure of most blogs, small businesses, and service websites."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is this internal link checker free?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, our comprehensive internal link analyzer is completely free to use. Get detailed analysis of your website's anchor text patterns and internal link structure without any registration or hidden fees."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How accurate is the internal link analysis?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our tool crawls your actual website content through sitemaps and analyzes real HTML anchor elements, providing accurate insights into your internal linking patterns and anchor text distribution."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What makes this tool different?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Unlike other tools that show basic metrics, we provide visual word clouds, comprehensive anchor text grouping, and detailed destination URL analysis to help you optimize your internal linking strategy."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Can I analyze any website?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, you can analyze any public website URL. Our tool works with all types of websites including blogs, e-commerce sites, and business websites by discovering pages through sitemaps."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do you store or save my website data?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "No, we don't store or save any data from your website analysis. Each analysis is performed in real-time and results are only shown to you during the session for complete privacy."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
    </div>
  )
}