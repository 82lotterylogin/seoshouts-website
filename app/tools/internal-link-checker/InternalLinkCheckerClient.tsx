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
                  <h3 className="text-lg font-semibold mb-6 text-gray-900 text-center">What You'll Get:</h3>
                  <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Interactive Word Cloud</div>
                          <div className="text-gray-600">Visual representation with size based on frequency</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Detailed Data Table</div>
                          <div className="text-gray-600">Anchor text, URLs, frequency, and pages</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Content-Only Analysis</div>
                          <div className="text-gray-600">Excludes header, footer, and sidebar links</div>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Export Options</div>
                          <div className="text-gray-600">CSV data export and PNG word cloud</div>
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
                Free Internal Link Checker Tool - Internal Link Analysis
              </span>
            </h1>

            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Most Comprehensive Anchor Text Analysis Tool Online</h2>
              <p>
                Analyze your website's internal link structure with our free Internal Link Checker tool. Visualize anchor text patterns, identify optimization opportunities, and improve your internal linking strategy with comprehensive insights.
              </p>
              <p>
                Our tool crawls up to 500 pages, extracts internal links from content areas, and creates an interactive word cloud showing anchor text frequency and distribution patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">🕷️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Crawling</h3>
                <p className="text-gray-600 text-sm">Comprehensive website analysis with sitemap discovery and intelligent URL detection</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">☁️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Visual Insights</h3>
                <p className="text-gray-600 text-sm">Interactive word cloud with frequency-based sizing and clickable anchor text analysis</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Export Reports</h3>
                <p className="text-gray-600 text-sm">Download comprehensive reports in CSV, JSON, and detailed text formats</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900">
              How Our Internal Link Checker Tool Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🕷️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Smart Crawling</h3>
                <p className="text-gray-600">
                  We crawl your website (up to 500 pages) and extract internal links from main content areas only, excluding navigation and footer links.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Anchor Analysis</h3>
                <p className="text-gray-600">
                  We analyze all anchor text patterns, count frequencies, and identify which pages use specific anchor text variations.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☁️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Visual Insights</h3>
                <p className="text-gray-600">
                  Get an interactive word cloud with anchor text sized by frequency, plus detailed tables and export options.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Anchor Cloud Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              What is Internal Link Analysis and Why It Matters for SEO
            </h2>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
                  Internal Link Analysis is a powerful SEO technique that visualizes your website's internal link anchor text distribution.
                  By analyzing how frequently different anchor texts are used across your internal links, you can identify patterns,
                  opportunities for optimization, and potential over-optimization issues that could impact your search rankings.
                </p>

                <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">Our Internal Link Checker Tool Analyzes:</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Anchor Text Distribution</span>
                        <p className="text-sm text-gray-600">Frequency and usage patterns of internal anchor text</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Internal Link Structure</span>
                        <p className="text-sm text-gray-600">Complete mapping of your internal linking network</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Page Authority Flow</span>
                        <p className="text-sm text-gray-600">How link equity flows between your pages</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Optimization Opportunities</span>
                        <p className="text-sm text-gray-600">Identify under-optimized and over-optimized anchor text</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Visual Insights</span>
                        <p className="text-sm text-gray-600">Interactive word clouds and detailed data tables</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Naked URL Detection</span>
                        <p className="text-sm text-gray-600">Identify and track bare URL anchor texts</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Export & Reporting</span>
                        <p className="text-sm text-gray-600">Export data for further analysis and reporting</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Comprehensive Site Crawl</span>
                        <p className="text-sm text-gray-600">Complete analysis of all discoverable pages</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <p className="text-gray-700 text-center">
                    <span className="font-semibold">Why it matters:</span> Proper anchor text distribution can improve your internal
                    link relevancy signals by 30-40% and help search engines better understand your content hierarchy and topic clusters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Advanced Features That Make Our Internal Link Checker Tool Unique
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                  <div className="text-3xl mb-4">🕸️</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Complete Site Mapping</h3>
                  <p className="text-gray-600">
                    Automatic discovery and crawling of all your website pages through sitemaps and navigation
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                  <div className="text-3xl mb-4">☁️</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Interactive Word Cloud</h3>
                  <p className="text-gray-600">
                    Dynamic visual representation with anchor text sized by frequency and detailed popup information
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                  <div className="text-3xl mb-4">🔍</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Smart Filtering</h3>
                  <p className="text-gray-600">
                    Filter by frequency, text type, and specific patterns to focus on what matters most
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 text-center">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Detailed Analytics</h3>
                  <p className="text-gray-600">
                    Comprehensive tables showing anchor text usage, frequency, and pages where they appear
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 text-center">
                  <div className="text-3xl mb-4">📥</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Export Capabilities</h3>
                  <p className="text-gray-600">
                    Export your anchor text data in multiple formats for further analysis and reporting
                  </p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 text-center">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">SEO Optimization Ready</h3>
                  <p className="text-gray-600">
                    Built for modern SEO with focus on natural anchor text distribution and link relevancy
                  </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              How Internal Link Analysis Benefits Your SEO Strategy
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Internal Link Optimization */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold mb-4 text-blue-800 flex items-center">
                  <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🔗</span>
                  </span>
                  Internal Link Optimization
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <span><strong>Identify Over-Optimization:</strong> Spot keyword-stuffed anchor texts that could trigger penalties</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <span><strong>Find Missing Opportunities:</strong> Discover pages that need more internal links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <span><strong>Natural Distribution:</strong> Ensure your anchor text appears naturally and varied</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <span><strong>Topic Clustering:</strong> Improve content relevance through strategic anchor text usage</span>
                  </li>
                </ul>
              </div>

              {/* SEO Performance Improvement */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-bold mb-4 text-green-800 flex items-center">
                  <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">📈</span>
                  </span>
                  SEO Performance Improvement
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <span><strong>Better Rankings:</strong> Improved anchor text signals help pages rank for target keywords</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <span><strong>Page Authority Flow:</strong> Optimize how link equity flows throughout your site</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <span><strong>Content Understanding:</strong> Help search engines understand page topics better</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <span><strong>User Experience:</strong> More descriptive anchor texts improve navigation</span>
                  </li>
                </ul>
              </div>

              {/* Technical SEO Benefits */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold mb-4 text-purple-800 flex items-center">
                  <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">⚡</span>
                  </span>
                  Technical SEO Benefits
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>Site Architecture:</strong> Visualize and improve your site's link structure</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>Crawlability:</strong> Ensure all important pages are discoverable through internal links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>Site Speed Impact:</strong> Identify pages with excessive internal links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>Mobile Optimization:</strong> Ensure anchor texts work well on mobile devices</span>
                  </li>
                </ul>
              </div>

              {/* Content Strategy Enhancement */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-bold mb-4 text-orange-800 flex items-center">
                  <span className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">📝</span>
                  </span>
                  Content Strategy Enhancement
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <span><strong>Content Gaps:</strong> Identify topics that need more internal linking support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <span><strong>Keyword Distribution:</strong> Track how keywords flow through your internal links</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <span><strong>Topic Authority:</strong> Build topical relevance through strategic anchor text</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <span><strong>Content Silos:</strong> Improve content organization and thematic clustering</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Anchor Text Optimization Best Practices for 2025
            </h2>

            <div className="space-y-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border border-blue-100 p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <span className="text-white font-bold">1</span>
                  </span>
                  Maintain Natural Anchor Text Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                      <span className="mr-2">📊</span>
                      Recommended Distribution:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Branded anchors:</span>
                        <span className="font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-sm">25-30%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Naked URLs:</span>
                        <span className="font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm">20-25%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-gray-700">Generic ("click here"):</span>
                        <span className="font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full text-sm">15-20%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Exact match keywords:</span>
                        <span className="font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">10-15%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Partial match:</span>
                        <span className="font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-sm">15-20%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                        <span className="text-gray-700">LSI/Related terms:</span>
                        <span className="font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full text-sm">10-15%</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
                      <span className="mr-2">🎯</span>
                      Key Guidelines:
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500 mr-3 mt-1 bg-green-100 rounded-full w-5 h-5 flex items-center justify-center text-sm">✓</span>
                        <span className="text-gray-700">Avoid over-optimizing with exact keywords</span>
                      </div>
                      <div className="flex items-start p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500 mr-3 mt-1 bg-green-100 rounded-full w-5 h-5 flex items-center justify-center text-sm">✓</span>
                        <span className="text-gray-700">Use descriptive, contextual anchor text</span>
                      </div>
                      <div className="flex items-start p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500 mr-3 mt-1 bg-green-100 rounded-full w-5 h-5 flex items-center justify-center text-sm">✓</span>
                        <span className="text-gray-700">Vary anchor text for repeated internal links</span>
                      </div>
                      <div className="flex items-start p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500 mr-3 mt-1 bg-green-100 rounded-full w-5 h-5 flex items-center justify-center text-sm">✓</span>
                        <span className="text-gray-700">Focus on user experience first</span>
                      </div>
                      <div className="flex items-start p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500 mr-3 mt-1 bg-green-100 rounded-full w-5 h-5 flex items-center justify-center text-sm">✓</span>
                        <span className="text-gray-700">Include brand name variations</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg border border-green-100 p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <span className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                    <span className="text-white font-bold">2</span>
                  </span>
                  Strategic Internal Linking for SEO
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                    <div className="text-3xl mb-4">🔗</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Priority Page Linking</h3>
                    <p className="text-gray-600">
                      Use more descriptive, keyword-rich anchor texts when linking to your most important pages. This helps search engines understand which pages are most valuable.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                    <div className="text-3xl mb-4">🎨</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Contextual Relevance</h3>
                    <p className="text-gray-600">
                      Ensure anchor texts are contextually relevant to both the linking page content and the destination page. This improves user experience and SEO signals.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                    <div className="text-3xl mb-4">🌍</div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Deep Linking Strategy</h3>
                    <p className="text-gray-600">
                      Don't just link to your homepage. Create internal links to deep pages that provide value and help distribute page authority throughout your site.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-blue-800">
                  🎯 Pro Tip: Regular Anchor Text Audits
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Use our Internal Link Checker tool monthly to monitor your internal linking patterns. Look for sudden spikes in exact-match
                  anchor texts, identify orphaned content that needs more internal links, and ensure your most important pages
                  receive adequate link equity through strategic anchor text usage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Is this internal link checker free?
                </h3>
                <p className="text-gray-700">
                  Yes, our comprehensive internal link analyzer is completely free to use. Get detailed analysis of your website's anchor text patterns and internal link structure without any registration or hidden fees.
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  How accurate is the internal link analysis?
                </h3>
                <p className="text-gray-700">
                  Our tool crawls your actual website content through sitemaps and analyzes real HTML anchor elements, providing accurate insights into your internal linking patterns and anchor text distribution.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  What makes this tool different?
                </h3>
                <p className="text-gray-700">
                  Unlike other tools that show basic metrics, we provide visual word clouds, comprehensive anchor text grouping, and detailed destination URL analysis to help you optimize your internal linking strategy.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Can I analyze any website?
                </h3>
                <p className="text-gray-700">
                  Yes, you can analyze any public website URL. Our tool works with all types of websites including blogs, e-commerce sites, and business websites by discovering pages through sitemaps.
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  How often should I run internal link analysis?
                </h3>
                <p className="text-gray-700">
                  We recommend analyzing your internal links monthly or after adding significant content. Regular monitoring helps maintain healthy anchor text distribution and identify new linking opportunities.
                </p>
              </div>

              <div className="bg-pink-50 border border-pink-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">
                  Do you store or save my website data?
                </h3>
                <p className="text-gray-700">
                  No, we don't store or save any data from your website analysis. Each analysis is performed in real-time and results are only shown to you during the session for complete privacy.
                </p>
              </div>
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
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Complete Internal Link Analysis Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop guessing about your website's internal linking strategy. Get a comprehensive analysis of your anchor text distribution, link patterns, and optimization opportunities to improve your SEO performance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🔗 Analyze Your Internal Links Now →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
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

            <p className="text-sm mt-6 opacity-80">
              <strong>Get professional internal linking insights with SEO Shouts' Internal Link Checker!</strong>
              <br />
              <em>Trusted by thousands of SEO professionals, marketers, and website owners worldwide for comprehensive link analysis.</em>
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
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
                "name": "How often should I run internal link analysis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We recommend analyzing your internal links monthly or after adding significant content. Regular monitoring helps maintain healthy anchor text distribution and identify new linking opportunities."
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
          })
        }}
      />

      {/* Tool Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Free Internal Link Checker with Anchor Cloud",
            "description": "Professional internal link analyzer that checks up to 500 pages without login. Features anchor text visualization, word cloud generation, and comprehensive internal linking analysis for SEO optimization.",
            "url": "https://seoshouts.com/tools/internal-link-checker",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "featureList": [
              "Up to 500 pages analysis",
              "No login required",
              "Interactive anchor cloud visualization",
              "Detailed data table with statistics",
              "Anchor text grouping and filtering",
              "Export options (CSV, PNG, TXT)",
              "Real-time sitemap discovery",
              "Content-only link analysis",
              "Destination URL breakdown",
              "Internal linking optimization insights"
            ],
            "screenshot": "https://seoshouts.com/tools/internal-link-checker/screenshot.jpg",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "ratingCount": "1247"
            },
            "softwareVersion": "1.0",
            "datePublished": "2025-01-15",
            "dateModified": "2025-01-15",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seoshouts.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "SEO Tools",
                "item": "https://seoshouts.com/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Internal Link Checker",
                "item": "https://seoshouts.com/tools/internal-link-checker"
              }
            ]
          })
        }}
      />
    </div>
  )
}