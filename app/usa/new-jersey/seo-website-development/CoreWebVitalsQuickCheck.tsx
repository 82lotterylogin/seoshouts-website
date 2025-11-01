'use client'

import { useState } from 'react'

interface CoreWebVitalMetric {
  value: number
  status: 'good' | 'needs-improvement' | 'poor'
}

interface CoreWebVitalsData {
  LCP: CoreWebVitalMetric
  INP: CoreWebVitalMetric
  CLS: CoreWebVitalMetric
}

interface PageSpeedData {
  score: number
  coreWebVitals: CoreWebVitalsData
}

interface PerformanceResult {
  desktop: PageSpeedData
  mobile: PageSpeedData
}

export default function CoreWebVitalsQuickCheck() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PerformanceResult | null>(null)
  const [error, setError] = useState('')

  const checkPerformance = async () => {
    if (!url) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      // Set a 60-second timeout for the request
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000)

      const response = await fetch('/api/analyze-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          targetKeyword: '',
          recaptchaToken: 'quick_check_bypass'
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (response.ok && data.pageSpeed) {
        // Data is now in the correct format from the API
        setResult(data.pageSpeed)
      } else if (response.ok && !data.pageSpeed) {
        setError('Performance data unavailable. The PageSpeed API may be temporarily down or not configured.')
      } else {
        setError(data.error || 'Failed to analyze performance. Please try again.')
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Analysis is taking longer than expected. The website might be slow or unavailable. Please try again.')
      } else {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getStatusColor = (status: string) => {
    if (status === 'good') return 'bg-green-500'
    if (status === 'needs-improvement') return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getStatusText = (status: string) => {
    if (status === 'good') return 'Good'
    if (status === 'needs-improvement') return 'Needs Improvement'
    return 'Poor'
  }

  const formatValue = (metric: string, value: number) => {
    if (metric === 'CLS') return value.toFixed(3)
    return `${(value / 1000).toFixed(2)}s`
  }

  return (
    <section id="core-web-vitals-check" className="relative py-6 sm:py-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Column - Header and Input Form */}
            <div>
              {/* Section Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 border border-white/20">
                  <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-semibold text-white uppercase tracking-wide">Free Performance Check</span>
                </div>
                <h2 className="text-[2rem] font-bold text-white mb-4 leading-tight">
                  Quick Core Web Vitals Check
                </h2>
                <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
                  Get instant mobile and desktop performance scores powered by Google PageSpeed Insights
                </p>
              </div>

              {/* Input Form - Highlighted with border glow */}
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>

                <div className="relative bg-white rounded-2xl shadow-2xl p-2 border-2 border-yellow-400/50">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter your website URL (e.g., https://example.com)"
                      className="flex-1 px-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base placeholder-gray-400 bg-gray-50"
                      onKeyPress={(e) => e.key === 'Enter' && checkPerformance()}
                    />
                    <button
                      onClick={checkPerformance}
                      disabled={loading || !url}
                      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold text-base rounded-lg hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 whitespace-nowrap hover:from-yellow-300 hover:to-orange-400"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Checking...
                        </span>
                      ) : (
                        'Check Your Performance'
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Score Display */}
            <div>

          {/* Score Display - Always Visible */}
          <div className="space-y-6">
            {/* Mobile Score */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                {/* Left: Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Mobile</h3>
                </div>

                {/* Right: Score Box */}
                <div className={`px-8 py-4 rounded-2xl transition-all duration-500 shadow-md ${result ? getScoreBgColor(result.mobile.score) : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                  <div className={`text-5xl font-bold transition-all duration-700 ${result ? getScoreColor(result.mobile.score) + ' animate-score-pop' : 'text-gray-400'}`}>
                    {result ? result.mobile.score : '0'}
                  </div>
                </div>
              </div>

              {result && (
                <div className="grid grid-cols-3 gap-6 animate-fade-in">
                  {/* LCP Circle */}
                  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="50" stroke="#f3f4f6" strokeWidth="10" fill="white" />
                        <circle
                          cx="56" cy="56" r="50"
                          stroke={result.mobile.coreWebVitals.LCP.status === 'good' ? '#10b981' : result.mobile.coreWebVitals.LCP.status === 'needs-improvement' ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="314.16"
                          strokeDashoffset={result.mobile.coreWebVitals.LCP.status === 'good' ? '31.416' : result.mobile.coreWebVitals.LCP.status === 'needs-improvement' ? '157.08' : '219.912'}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-md"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className={`w-8 h-8 ${result.mobile.coreWebVitals.LCP.status === 'good' ? 'text-green-600' : result.mobile.coreWebVitals.LCP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${result.mobile.coreWebVitals.LCP.status === 'good' ? 'text-green-600' : result.mobile.coreWebVitals.LCP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatValue('LCP', result.mobile.coreWebVitals.LCP.value)}
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-1">LCP</div>
                    <div className="text-xs text-gray-500 text-center">Largest Contentful Paint</div>
                  </div>

                  {/* CLS Circle */}
                  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="50" stroke="#f3f4f6" strokeWidth="10" fill="white" />
                        <circle
                          cx="56" cy="56" r="50"
                          stroke={result.mobile.coreWebVitals.CLS.status === 'good' ? '#10b981' : result.mobile.coreWebVitals.CLS.status === 'needs-improvement' ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="314.16"
                          strokeDashoffset={result.mobile.coreWebVitals.CLS.status === 'good' ? '31.416' : result.mobile.coreWebVitals.CLS.status === 'needs-improvement' ? '157.08' : '219.912'}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-md"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className={`w-8 h-8 ${result.mobile.coreWebVitals.CLS.status === 'good' ? 'text-green-600' : result.mobile.coreWebVitals.CLS.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${result.mobile.coreWebVitals.CLS.status === 'good' ? 'text-green-600' : result.mobile.coreWebVitals.CLS.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatValue('CLS', result.mobile.coreWebVitals.CLS.value)}
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-1">CLS</div>
                    <div className="text-xs text-gray-500 text-center">Cumulative Layout Shift</div>
                  </div>

                  {/* INP Circle */}
                  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="50" stroke="#f3f4f6" strokeWidth="10" fill="white" />
                        <circle
                          cx="56" cy="56" r="50"
                          stroke={result.mobile.coreWebVitals.INP.status === 'good' ? '#10b981' : result.mobile.coreWebVitals.INP.status === 'needs-improvement' ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="314.16"
                          strokeDashoffset={result.mobile.coreWebVitals.INP.status === 'good' ? '31.416' : result.mobile.coreWebVitals.INP.status === 'needs-improvement' ? '157.08' : '219.912'}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-md"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className={`w-8 h-8 ${result.mobile.coreWebVitals.INP.status === 'good' ? 'text-green-600' : result.mobile.coreWebVitals.INP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${result.mobile.coreWebVitals.INP.status === 'good' ? 'text-green-600' : result.mobile.coreWebVitals.INP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatValue('INP', result.mobile.coreWebVitals.INP.value)}
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-1">INP</div>
                    <div className="text-xs text-gray-500 text-center">Interaction to Next Paint</div>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Score */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                {/* Left: Header */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Desktop</h3>
                </div>

                {/* Right: Score Box */}
                <div className={`px-8 py-4 rounded-2xl transition-all duration-500 shadow-md ${result ? getScoreBgColor(result.desktop.score) : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
                  <div className={`text-5xl font-bold transition-all duration-700 ${result ? getScoreColor(result.desktop.score) + ' animate-score-pop' : 'text-gray-400'}`}>
                    {result ? result.desktop.score : '0'}
                  </div>
                </div>
              </div>

              {result && (
                <div className="grid grid-cols-3 gap-6 animate-fade-in">
                  {/* LCP Circle */}
                  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="50" stroke="#f3f4f6" strokeWidth="10" fill="white" />
                        <circle
                          cx="56" cy="56" r="50"
                          stroke={result.desktop.coreWebVitals.LCP.status === 'good' ? '#10b981' : result.desktop.coreWebVitals.LCP.status === 'needs-improvement' ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="314.16"
                          strokeDashoffset={result.desktop.coreWebVitals.LCP.status === 'good' ? '31.416' : result.desktop.coreWebVitals.LCP.status === 'needs-improvement' ? '157.08' : '219.912'}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-md"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className={`w-8 h-8 ${result.desktop.coreWebVitals.LCP.status === 'good' ? 'text-green-600' : result.desktop.coreWebVitals.LCP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${result.desktop.coreWebVitals.LCP.status === 'good' ? 'text-green-600' : result.desktop.coreWebVitals.LCP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatValue('LCP', result.desktop.coreWebVitals.LCP.value)}
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-1">LCP</div>
                    <div className="text-xs text-gray-500 text-center">Largest Contentful Paint</div>
                  </div>

                  {/* CLS Circle */}
                  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="50" stroke="#f3f4f6" strokeWidth="10" fill="white" />
                        <circle
                          cx="56" cy="56" r="50"
                          stroke={result.desktop.coreWebVitals.CLS.status === 'good' ? '#10b981' : result.desktop.coreWebVitals.CLS.status === 'needs-improvement' ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="314.16"
                          strokeDashoffset={result.desktop.coreWebVitals.CLS.status === 'good' ? '31.416' : result.desktop.coreWebVitals.CLS.status === 'needs-improvement' ? '157.08' : '219.912'}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-md"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className={`w-8 h-8 ${result.desktop.coreWebVitals.CLS.status === 'good' ? 'text-green-600' : result.desktop.coreWebVitals.CLS.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${result.desktop.coreWebVitals.CLS.status === 'good' ? 'text-green-600' : result.desktop.coreWebVitals.CLS.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatValue('CLS', result.desktop.coreWebVitals.CLS.value)}
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-1">CLS</div>
                    <div className="text-xs text-gray-500 text-center">Cumulative Layout Shift</div>
                  </div>

                  {/* INP Circle */}
                  <div className="flex flex-col items-center p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200">
                    <div className="relative w-28 h-28 mb-4">
                      <svg className="w-28 h-28 transform -rotate-90">
                        <circle cx="56" cy="56" r="50" stroke="#f3f4f6" strokeWidth="10" fill="white" />
                        <circle
                          cx="56" cy="56" r="50"
                          stroke={result.desktop.coreWebVitals.INP.status === 'good' ? '#10b981' : result.desktop.coreWebVitals.INP.status === 'needs-improvement' ? '#f59e0b' : '#ef4444'}
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray="314.16"
                          strokeDashoffset={result.desktop.coreWebVitals.INP.status === 'good' ? '31.416' : result.desktop.coreWebVitals.INP.status === 'needs-improvement' ? '157.08' : '219.912'}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out drop-shadow-md"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className={`w-8 h-8 ${result.desktop.coreWebVitals.INP.status === 'good' ? 'text-green-600' : result.desktop.coreWebVitals.INP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${result.desktop.coreWebVitals.INP.status === 'good' ? 'text-green-600' : result.desktop.coreWebVitals.INP.status === 'needs-improvement' ? 'text-yellow-600' : 'text-red-600'}`}>
                      {formatValue('INP', result.desktop.coreWebVitals.INP.value)}
                    </div>
                    <div className="text-base font-bold text-gray-900 mb-1">INP</div>
                    <div className="text-xs text-gray-500 text-center">Interaction to Next Paint</div>
                  </div>
                </div>
              )}
            </div>
          </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
