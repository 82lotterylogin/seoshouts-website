'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '@/app/components/ToolBreadcrumb'
import CoreWebVitalsCard from '@/app/components/seo-report/CoreWebVitalsCard'
import SEOMetricCard from '@/app/components/seo-report/SEOMetricCard'

interface AnalysisResult {
  url: string
  overallScore: number
  pageSpeed?: {
    desktop: PageSpeedData
    mobile: PageSpeedData
  }
  factors: {
    contentQuality: AnalysisSection
    technicalSEO: AnalysisSection
    onPageElements: AnalysisSection
    userExperience: AnalysisSection
    contentStructure: AnalysisSection
    socialOptimization: AnalysisSection
    localSEO: AnalysisSection
    advancedAnalytics: AnalysisSection
  }
}

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

interface AnalysisSection {
  score: number
  maxScore: number
  checks: AnalysisCheck[]
}

interface AnalysisCheck {
  factor: string
  status: 'excellent' | 'good' | 'fair' | 'warning' | 'critical' | 'neutral' | 'poor' | 'error'
  description: string
}

export default function OnPageSEOAnalyzerClient() {
  const [url, setUrl] = useState('')
  const [targetKeyword, setTargetKeyword] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [pageSpeedLoading, setPageSpeedLoading] = useState(false)
  const [usageLimit, setUsageLimit] = useState({ remaining: 5, totalLimit: 5, resetTime: '', canUse: true })
  const [showUsageWarning, setShowUsageWarning] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Check usage limits on component mount
  useEffect(() => {
    const checkUsageLimit = async () => {
      try {
        const response = await fetch('/api/usage-limit')
        if (response.ok) {
          const data = await response.json()
          setUsageLimit(data)
          if (data.remaining <= 1) {
            setShowUsageWarning(true)
          }
        }
      } catch (error) {
        console.error('Failed to check usage limit:', error)
      }
    }
    
    checkUsageLimit()
  }, [])

  const handleCaptchaChange = (value: string | null) => {
    setIsVerified(!!value)
  }

  const resetAnalysis = () => {
    setAnalysisResult(null)
    setError('')
    setAnalysisProgress(0)
    setCurrentStep('')
    setActiveTab('overview')
  }

  const analyzeWebsite = useCallback(async () => {
    if (!url || !isVerified) return

    // Check usage limit before starting analysis
    if (!usageLimit.canUse) {
      setError(`Daily limit exceeded. You have used all ${usageLimit.totalLimit} analyses for today. Please try again after ${new Date(usageLimit.resetTime).toLocaleString()}.`)
      return
    }

    setLoading(true)
    setError('')

    try {
      const recaptchaToken = recaptchaRef.current?.getValue()
      if (!recaptchaToken) {
        throw new Error('Please complete the reCAPTCHA verification')
      }

      // Track usage
      const usageResponse = await fetch('/api/usage-limit', { method: 'POST' })
      if (!usageResponse.ok) {
        const usageData = await usageResponse.json()
        if (usageResponse.status === 429) {
          throw new Error(usageData.error || 'Daily limit exceeded')
        }
      } else {
        const usageData = await usageResponse.json()
        setUsageLimit(usageData)
      }

      console.log('Analyzing URL:', url)
      
      // Simulate progress steps
      setCurrentStep('Fetching webpage content...')
      setAnalysisProgress(10)
      
      await new Promise(resolve => setTimeout(resolve, 500))
      setCurrentStep('Analyzing HTML structure...')
      setAnalysisProgress(25)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep('Checking technical SEO factors...')
      setAnalysisProgress(40)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep('Evaluating content quality...')
      setAnalysisProgress(55)
      
      await new Promise(resolve => setTimeout(resolve, 300))
      setCurrentStep('Running PageSpeed analysis...')
      setAnalysisProgress(70)
      
      // Fetch PageSpeed data in parallel with timeout
      setPageSpeedLoading(true)
      const pageSpeedPromise = Promise.race([
        fetch('/api/page-speed', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: url }),
          signal: AbortSignal.timeout(30000) // 30 second timeout
        }),
        new Promise<Response>((_, reject) => {
          setTimeout(() => reject(new Error('PageSpeed request timeout')), 30000)
        })
      ])

      const [seoResponse, pageSpeedResponse] = await Promise.allSettled([
        fetch('/api/analyze-seo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: url,
            targetKeyword: targetKeyword || undefined,
            recaptchaToken: recaptchaToken
          }),
          signal: AbortSignal.timeout(45000) // 45 second timeout for main SEO analysis
        }),
        pageSpeedPromise
      ])
      
      setCurrentStep('Processing analysis results...')
      setAnalysisProgress(90)

      // Handle SEO response
      let seoData
      if (seoResponse.status === 'fulfilled' && seoResponse.value.ok) {
        seoData = await seoResponse.value.json()
      } else {
        console.error('SEO analysis failed:', seoResponse.status === 'rejected' ? seoResponse.reason : 'API error')
        throw new Error('SEO analysis failed. Please try again.')
      }

      // Handle PageSpeed response
      let pageSpeedData = null
      if (pageSpeedResponse.status === 'fulfilled') {
        try {
          pageSpeedData = await pageSpeedResponse.value.json()
        } catch (error) {
          console.warn('PageSpeed analysis failed, continuing without Core Web Vitals data:', error)
        }
      } else {
        console.warn('PageSpeed analysis timed out, continuing without Core Web Vitals data:', pageSpeedResponse.reason)
      }
      
      setPageSpeedLoading(false)

      const data = seoData

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }
      
      setCurrentStep('Analysis complete!')
      setAnalysisProgress(100)
      
      await new Promise(resolve => setTimeout(resolve, 500))

      console.log('Analysis completed successfully')
      const analysisWithPageSpeed = {
        ...data.analysis,
        pageSpeed: pageSpeedData
      }
      setAnalysisResult(analysisWithPageSpeed)
      
      // Show usage warning if remaining uses are low
      if (usageLimit.remaining <= 2 && usageLimit.remaining > 0) {
        setShowUsageWarning(true)
      }
      
      // Reset reCAPTCHA
      recaptchaRef.current?.reset()
      setIsVerified(false)
      
    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze the website. Please check the URL and try again.')
      
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset()
      setIsVerified(false)
      setAnalysisProgress(0)
      setCurrentStep('')
      setPageSpeedLoading(false)
    } finally {
      setLoading(false)
    }
  }, [url, targetKeyword, isVerified, usageLimit])

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 75) return 'text-blue-600 bg-blue-100'
    if (score >= 50) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = (status: 'excellent' | 'good' | 'fair' | 'warning' | 'critical' | 'neutral' | 'poor' | 'error') => {
    switch (status) {
      case 'excellent': return '🌟'
      case 'good': return '✅'
      case 'fair': return '👍'
      case 'warning': return '⚠️'
      case 'critical': return '❌'
      case 'poor': return '😞'
      case 'error': return '💥'
      case 'neutral': return 'ℹ️'
      default: return '❓'
    }
  }

  const renderAnalysisSection = (title: string, section: AnalysisSection) => {
    const percentage = Math.round((section.score / section.maxScore) * 100)
    const excellentChecks = section.checks.filter(c => c.status === 'excellent').length
    const goodChecks = section.checks.filter(c => c.status === 'good').length
    const warningChecks = section.checks.filter(c => c.status === 'warning').length
    const criticalChecks = section.checks.filter(c => c.status === 'critical' || c.status === 'error').length
    
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
        {/* Header with Score */}
        <div className={`px-6 py-4 ${
          percentage >= 90 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' :
          percentage >= 75 ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200' :
          percentage >= 50 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' :
          'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
        } border-b`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center text-green-600">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  {excellentChecks + goodChecks} Passed
                </span>
                <span className="flex items-center text-yellow-600">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  {warningChecks} Warnings
                </span>
                <span className="flex items-center text-red-600">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {criticalChecks} Critical
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                percentage >= 90 ? 'text-green-600' :
                percentage >= 75 ? 'text-blue-600' :
                percentage >= 50 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {percentage}%
              </div>
              <div className="text-sm text-gray-600">{section.score}/{section.maxScore} points</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  percentage >= 90 ? 'bg-green-500' :
                  percentage >= 75 ? 'bg-blue-500' :
                  percentage >= 50 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Checks List */}
        <div className="p-6">
          <div className="space-y-4">
            {section.checks.map((check, index) => {
              const getBorderColor = (status: string) => {
                switch (status) {
                  case 'excellent': return 'border-green-200 bg-green-50'
                  case 'good': return 'border-blue-200 bg-blue-50'
                  case 'warning': return 'border-yellow-200 bg-yellow-50'
                  case 'critical':
                  case 'error': return 'border-red-200 bg-red-50'
                  default: return 'border-gray-200 bg-gray-50'
                }
              }
              
              const getTextColor = (status: string) => {
                switch (status) {
                  case 'excellent': return 'text-green-700'
                  case 'good': return 'text-blue-700'
                  case 'warning': return 'text-yellow-700'
                  case 'critical':
                  case 'error': return 'text-red-700'
                  default: return 'text-gray-700'
                }
              }
              
              return (
                <div key={index} className={`border-l-4 ${getBorderColor(check.status)} border rounded-lg p-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{getStatusIcon(check.status)}</span>
                        <div>
                          <span className="font-semibold text-gray-900">{check.factor}</span>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-3 ${
                            check.status === 'excellent' ? 'bg-green-100 text-green-800' :
                            check.status === 'good' ? 'bg-blue-100 text-blue-800' :
                            check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                            check.status === 'critical' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {check.status === 'excellent' ? 'Excellent' :
                             check.status === 'good' ? 'Good' :
                             check.status === 'warning' ? 'Needs Attention' :
                             check.status === 'critical' ? 'Critical' :
                             check.status === 'error' ? 'Error' : 'Unknown'}
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm ${getTextColor(check.status)} leading-relaxed`}>
                        {check.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Summary and Recommendations */}
          {(criticalChecks > 0 || warningChecks > 0) && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Priority Actions
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.checks
                  .filter(c => c.status === 'critical' || c.status === 'error')
                  .slice(0, 4)
                  .map((check, index) => (
                    <div key={index} className="flex items-start p-3 bg-red-50 border border-red-100 rounded-lg">
                      <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium text-red-800 text-sm">Fix {check.factor}</span>
                        <p className="text-xs text-red-600 mt-1">High impact on SEO performance</p>
                      </div>
                    </div>
                  ))
                }
                {section.checks
                  .filter(c => c.status === 'warning')
                  .slice(0, Math.max(0, 4 - criticalChecks))
                  .map((check, index) => (
                    <div key={index + criticalChecks} className="flex items-start p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-white text-xs font-bold">{index + criticalChecks + 1}</span>
                      </div>
                      <div>
                        <span className="font-medium text-yellow-800 text-sm">Improve {check.factor}</span>
                        <p className="text-xs text-yellow-600 mt-1">Moderate impact on SEO performance</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    )
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
            "name": "On-Page SEO Analyzer Tool",
            "description": "Complete on-page SEO analysis with 150+ factors. Analyze content quality, technical SEO, Core Web Vitals, user experience, and get actionable recommendations.",
            "url": "https://seoshouts.com/tools/on-page-seo-analyzer",
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
              "150+ SEO factors analysis",
              "Core Web Vitals analysis",
              "Content quality evaluation",
              "Technical SEO audit",
              "PageSpeed Insights integration",
              "Real-time analysis",
              "Actionable recommendations"
            ],
            "keywords": "on-page SEO analyzer, website SEO audit, SEO analysis tool, Core Web Vitals, technical SEO, content optimization",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "bestRating": "5",
              "ratingCount": "2847"
            },
            "softwareVersion": "2.0",
            "datePublished": "2024-12-01",
            "dateModified": "2025-01-15",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
            }
          })
        }}
      />

      {/* Hero Tool Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            
            {/* Tool Title */}
            <div className="text-center mb-8">
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Free Website Page SEO Checker
              </p>
            </div>

            {/* Tool Interface */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
              <div className="space-y-8">
                
                {/* URL and Keyword Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* URL Input */}
                  <div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Example.com"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg placeholder-gray-400"
                    />
                  </div>

                  {/* Keyword Input */}
                  <div>
                    <input
                      type="text"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      placeholder="Target Keyword (Optional)"
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-lg placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={handleCaptchaChange}
                    theme="light"
                  />
                </div>

                {/* Usage Limit Info */}
                {!loading && (
                  <div className="flex items-center justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${usageLimit.remaining > 2 ? 'bg-green-500' : usageLimit.remaining > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                      <span className="text-gray-600">
                        {usageLimit.remaining} of {usageLimit.totalLimit} free analyses remaining today
                      </span>
                    </div>
                  </div>
                )}

                {/* Audit Button */}
                <div className="text-center">
                  <button
                    onClick={analyzeWebsite}
                    disabled={!url || !isVerified || loading || !usageLimit.canUse}
                    className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold text-xl rounded-xl hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Analyzing...
                      </div>
                    ) : !usageLimit.canUse ? (
                      'Daily Limit Reached'
                    ) : (
                      'Audit'
                    )}
                  </button>
                  
                  {!usageLimit.canUse && (
                    <div className="mt-3 text-center">
                      <p className="text-sm text-red-600 mb-2">
                        You've reached your daily limit of {usageLimit.totalLimit} free analyses.
                      </p>
                      <p className="text-xs text-gray-500">
                        Resets at: {new Date(usageLimit.resetTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                {/* Subtitle */}
                <p className="text-center text-gray-600">
                  Enter an URL address and get a Free Website Analysis!
                </p>

                {/* Usage Warning */}
                {showUsageWarning && usageLimit.remaining <= 1 && usageLimit.remaining > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-yellow-800 font-medium">Almost at your daily limit!</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      You have {usageLimit.remaining} analysis remaining. Your limit will reset at {new Date(usageLimit.resetTime).toLocaleString()}.
                    </p>
                    <button
                      onClick={() => setShowUsageWarning(false)}
                      className="mt-2 text-xs text-yellow-600 hover:text-yellow-800 underline"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}

                {/* New Analysis Button - shown after results */}
                {analysisResult && (
                  <div className="text-center">
                    <button
                      onClick={resetAnalysis}
                      className="inline-flex items-center px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200"
                    >
                      🔄 New Analysis
                    </button>
                  </div>
                )}

                {/* Enhanced Analysis Progress */}
                {loading && (
                  <div className="mt-8 bg-gray-50 rounded-2xl p-6">
                    <div className="text-center mb-6">
                      <div className="text-lg font-medium text-gray-700 mb-3">
                        {currentStep || 'Preparing analysis...'}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div 
                          className="bg-gradient-to-r from-primary to-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${analysisProgress}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        {analysisProgress}% Complete
                      </div>
                    </div>
                    
                    {/* Animated Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 10 ? 'bg-green-500' : 'bg-gray-300 animate-pulse'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">Fetching Content</span>
                        </div>
                        {analysisProgress >= 10 && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 40 ? 'bg-green-500' : 
                            analysisProgress >= 10 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">Technical SEO Check</span>
                        </div>
                        {analysisProgress >= 40 && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 70 && !pageSpeedLoading ? 'bg-green-500' : 
                            analysisProgress >= 40 || pageSpeedLoading ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">
                            PageSpeed Analysis {pageSpeedLoading ? '(Both Desktop & Mobile)' : ''}
                          </span>
                        </div>
                        {analysisProgress >= 70 && !pageSpeedLoading && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            analysisProgress >= 100 ? 'bg-green-500' : 
                            analysisProgress >= 70 ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-sm font-medium text-gray-700">Generating Report</span>
                        </div>
                        {analysisProgress >= 100 && <span className="text-green-500 text-sm">✓</span>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analysis Results Section */}
      {analysisResult && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
              <div className="space-y-8">
                {/* Overall Score Dashboard */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white">
                    {/* Mobile Layout */}
                    <div className="block lg:hidden p-4">
                      {/* Top Row: Title and Score */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <div>
                            <h2 className="text-lg font-bold">SEO Analysis Report</h2>
                          </div>
                        </div>
                        
                        {/* Compact Score Display */}
                        <div className="relative">
                          <div className="w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                              <circle
                                cx="60" cy="60" r="45"
                                stroke={analysisResult.overallScore >= 80 ? '#22c55e' : 
                                       analysisResult.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="8" fill="none" strokeLinecap="round"
                                strokeDasharray={`${(analysisResult.overallScore / 100) * 283} 283`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-lg font-bold text-white">{analysisResult.overallScore}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* URL Row */}
                      <div className="mb-4 bg-white/10 rounded-lg p-3">
                        <div className="flex items-center text-slate-200 text-xs">
                          <svg className="w-3 h-3 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          <span className="truncate" title={analysisResult.url}>{analysisResult.url}</span>
                        </div>
                      </div>
                      
                      {/* Stats Row */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-green-500/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-green-300">
                            {Object.values(analysisResult.factors).reduce((acc, section) => 
                              acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)}
                          </div>
                          <div className="text-xs text-green-200">Passed</div>
                        </div>
                        <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-yellow-300">
                            {Object.values(analysisResult.factors).reduce((acc, section) => 
                              acc + section.checks.filter(c => c.status === 'warning').length, 0)}
                          </div>
                          <div className="text-xs text-yellow-200">Warnings</div>
                        </div>
                        <div className="bg-red-500/20 rounded-lg p-3 text-center">
                          <div className="text-lg font-bold text-red-300">
                            {Object.values(analysisResult.factors).reduce((acc, section) => 
                              acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)}
                          </div>
                          <div className="text-xs text-red-200">Critical</div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mt-4 text-center">
                        <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold ${
                          analysisResult.overallScore >= 80 ? 'bg-green-500 text-white' :
                          analysisResult.overallScore >= 60 ? 'bg-yellow-500 text-black' :
                          'bg-red-500 text-white'
                        }`}>
                          {analysisResult.overallScore >= 80 ? '🌟 Excellent Performance' :
                           analysisResult.overallScore >= 60 ? '👍 Good Performance' : '⚠️ Needs Improvement'}
                        </span>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:block p-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start mb-4">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <div className="min-w-0 flex-1">
                              <h2 className="text-3xl font-bold mb-2">SEO Analysis Report</h2>
                              <div className="flex items-center text-slate-200 text-sm">
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span className="truncate" title={analysisResult.url}>{analysisResult.url}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="flex items-center text-green-300">
                              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 flex-shrink-0"></div>
                              <span className="whitespace-nowrap">
                                {Object.values(analysisResult.factors).reduce((acc, section) => 
                                  acc + section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length, 0)} Passed
                              </span>
                            </div>
                            <div className="flex items-center text-yellow-300">
                              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 flex-shrink-0"></div>
                              <span className="whitespace-nowrap">
                                {Object.values(analysisResult.factors).reduce((acc, section) => 
                                  acc + section.checks.filter(c => c.status === 'warning').length, 0)} Warnings
                              </span>
                            </div>
                            <div className="flex items-center text-red-300">
                              <div className="w-3 h-3 bg-red-400 rounded-full mr-2 flex-shrink-0"></div>
                              <span className="whitespace-nowrap">
                                {Object.values(analysisResult.factors).reduce((acc, section) => 
                                  acc + section.checks.filter(c => c.status === 'critical' || c.status === 'error').length, 0)} Critical
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Overall Score Circle - Desktop */}
                        <div className="relative">
                          <div className="w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r="45" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                              <circle
                                cx="60" cy="60" r="45"
                                stroke={analysisResult.overallScore >= 80 ? '#22c55e' : 
                                       analysisResult.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                                strokeWidth="8" fill="none" strokeLinecap="round"
                                strokeDasharray={`${(analysisResult.overallScore / 100) * 283} 283`}
                                className="transition-all duration-1000 ease-out"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-white mb-1">{analysisResult.overallScore}</div>
                                <div className="text-sm text-slate-200">Overall Score</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${
                            analysisResult.overallScore >= 80 ? 'bg-green-500 text-white' :
                            analysisResult.overallScore >= 60 ? 'bg-yellow-500 text-black' :
                            'bg-red-500 text-white'
                          }`}>
                            {analysisResult.overallScore >= 80 ? 'Excellent' :
                             analysisResult.overallScore >= 60 ? 'Good' : 'Needs Work'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Scores Grid */}
                  <div className="p-8 bg-gradient-to-br from-gray-50 to-white">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                      <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      Performance Breakdown by Category
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {Object.entries(analysisResult.factors).map(([key, section]) => {
                        const titles: { [key: string]: string } = {
                          contentQuality: 'Content Quality',
                          technicalSEO: 'Technical SEO',
                          onPageElements: 'On-Page Elements',
                          userExperience: 'User Experience',
                          contentStructure: 'Content Structure',
                          socialOptimization: 'Social Optimization',
                          localSEO: 'Local SEO',
                          advancedAnalytics: 'Advanced Analytics'
                        }
                        
                        const icons: { [key: string]: React.ReactNode } = {
                          contentQuality: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                          technicalSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                          onPageElements: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
                          userExperience: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                          contentStructure: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" /></svg>,
                          socialOptimization: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
                          localSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                          advancedAnalytics: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        }
                        
                        const percentage = Math.round((section.score / section.maxScore) * 100)
                        const getColorClass = (score: number) => {
                          if (score >= 80) return 'from-green-500 to-emerald-600 text-green-600 bg-green-50 border-green-200'
                          if (score >= 60) return 'from-blue-500 to-indigo-600 text-blue-600 bg-blue-50 border-blue-200'
                          if (score >= 40) return 'from-yellow-500 to-orange-600 text-yellow-600 bg-yellow-50 border-yellow-200'
                          return 'from-red-500 to-pink-600 text-red-600 bg-red-50 border-red-200'
                        }
                        
                        return (
                          <div key={key} className={`bg-white rounded-xl shadow-md border-2 ${getColorClass(percentage).split(' ').slice(-2).join(' ')} p-6 transition-all duration-200 hover:shadow-lg hover:scale-105`}>
                            <div className="flex items-center justify-between mb-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(percentage).split(' ').slice(-4, -2).join(' ')}`}>
                                {icons[key]}
                              </div>
                              <div className="text-right">
                                <div className={`text-2xl font-bold ${getColorClass(percentage).split(' ')[2]}`}>
                                  {percentage}%
                                </div>
                              </div>
                            </div>
                            
                            <h4 className="font-semibold text-gray-900 mb-2">{titles[key]}</h4>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>{section.score}/{section.maxScore}</span>
                                <span>{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full bg-gradient-to-r ${getColorClass(percentage).split(' ').slice(0, 2).join(' ')} transition-all duration-700 ease-out`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                                {section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length} passed
                              </span>
                              <span className="flex items-center">
                                <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                                {section.checks.filter(c => c.status === 'critical' || c.status === 'error').length} issues
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    {/* Quick Insights */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Top Priority</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          {(() => {
                            const lowestSection = Object.entries(analysisResult.factors)
                              .sort((a, b) => (a[1].score / a[1].maxScore) - (b[1].score / b[1].maxScore))[0]
                            const titles: { [key: string]: string } = {
                              contentQuality: 'Content Quality',
                              technicalSEO: 'Technical SEO',
                              onPageElements: 'On-Page Elements',
                              userExperience: 'User Experience',
                              contentStructure: 'Content Structure',
                              socialOptimization: 'Social Optimization',
                              localSEO: 'Local SEO',
                              advancedAnalytics: 'Advanced Analytics'
                            }
                            return `Focus on improving ${titles[lowestSection[0]]} for maximum SEO impact.`
                          })()}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Strengths</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          {(() => {
                            const highestSection = Object.entries(analysisResult.factors)
                              .sort((a, b) => (b[1].score / b[1].maxScore) - (a[1].score / a[1].maxScore))[0]
                            const titles: { [key: string]: string } = {
                              contentQuality: 'Content Quality',
                              technicalSEO: 'Technical SEO',
                              onPageElements: 'On-Page Elements',
                              userExperience: 'User Experience',
                              contentStructure: 'Content Structure',
                              socialOptimization: 'Social Optimization',
                              localSEO: 'Local SEO',
                              advancedAnalytics: 'Advanced Analytics'
                            }
                            return `${titles[highestSection[0]]} is performing well and supports your SEO strategy.`
                          })()}
                        </p>
                      </div>
                      
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100">
                        <div className="flex items-center mb-3">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h4 className="font-semibold text-gray-900">Potential</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          With focused improvements, your SEO score could reach {Math.min(100, analysisResult.overallScore + 25)}/100, significantly boosting organic visibility.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  {/* Desktop Tabs */}
                  <div className="hidden lg:block">
                    <div className="grid grid-cols-9 bg-gray-50">
                      {[
                        { id: 'overview', label: 'Overview', icon: '📊', count: '' },
                        { id: 'content', label: 'Content', icon: '📝', count: `${analysisResult.factors.contentQuality.score}` },
                        { id: 'technical', label: 'Technical', icon: '⚙️', count: `${analysisResult.factors.technicalSEO.score}` },
                        { id: 'onpage', label: 'On-Page', icon: '🎯', count: `${analysisResult.factors.onPageElements.score}` },
                        { id: 'ux', label: 'Experience', icon: '👥', count: `${analysisResult.factors.userExperience.score}` },
                        { id: 'structure', label: 'Structure', icon: '🏗️', count: `${analysisResult.factors.contentStructure.score}` },
                        { id: 'social', label: 'Social', icon: '📱', count: `${analysisResult.factors.socialOptimization.score}` },
                        { id: 'local', label: 'Local', icon: '📍', count: `${analysisResult.factors.localSEO.score}` },
                        { id: 'analytics', label: 'Analytics', icon: '📈', count: `${analysisResult.factors.advancedAnalytics.score}` }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`relative px-3 py-4 text-center transition-all duration-200 border-b-3 ${
                            activeTab === tab.id
                              ? 'bg-white border-primary text-primary shadow-sm'
                              : 'border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-lg">{tab.icon}</span>
                            <span className="text-xs font-semibold">{tab.label}</span>
                            {tab.count && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                activeTab === tab.id 
                                  ? 'bg-primary/10 text-primary' 
                                  : 'bg-gray-200 text-gray-600'
                              }`}>
                                {tab.count}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile/Tablet Tabs */}
                  <div className="lg:hidden">
                    <div className="p-4 bg-gray-50 border-b">
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'overview', label: 'Overview', icon: '📊', count: '' },
                          { id: 'content', label: 'Content', icon: '📝', count: `${analysisResult.factors.contentQuality.score}` },
                          { id: 'technical', label: 'Technical', icon: '⚙️', count: `${analysisResult.factors.technicalSEO.score}` },
                          { id: 'onpage', label: 'On-Page', icon: '🎯', count: `${analysisResult.factors.onPageElements.score}` },
                          { id: 'ux', label: 'Experience', icon: '👥', count: `${analysisResult.factors.userExperience.score}` },
                          { id: 'structure', label: 'Structure', icon: '🏗️', count: `${analysisResult.factors.contentStructure.score}` },
                          { id: 'social', label: 'Social', icon: '📱', count: `${analysisResult.factors.socialOptimization.score}` },
                          { id: 'local', label: 'Local', icon: '📍', count: `${analysisResult.factors.localSEO.score}` },
                          { id: 'analytics', label: 'Analytics', icon: '📈', count: `${analysisResult.factors.advancedAnalytics.score}` }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-3 rounded-lg text-center transition-all duration-200 ${
                              activeTab === tab.id
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <span className="text-sm">{tab.icon}</span>
                              <span className="text-xs font-medium">{tab.label}</span>
                              {tab.count && (
                                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                                  activeTab === tab.id 
                                    ? 'bg-white/20 text-white' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {tab.count}
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Active Tab Indicator */}
                  <div className="hidden lg:block bg-white px-6 py-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm">
                            {(() => {
                              const currentTab = [
                                { id: 'overview', icon: '📊' },
                                { id: 'content', icon: '📝' },
                                { id: 'technical', icon: '⚙️' },
                                { id: 'onpage', icon: '🎯' },
                                { id: 'ux', icon: '👥' },
                                { id: 'structure', icon: '🏗️' },
                                { id: 'social', icon: '📱' },
                                { id: 'local', icon: '📍' },
                                { id: 'analytics', icon: '📈' }
                              ].find(tab => tab.id === activeTab)
                              return currentTab?.icon || '📊'
                            })()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {(() => {
                              const titles: { [key: string]: string } = {
                                overview: 'Analysis Overview',
                                content: 'Content Quality Analysis',
                                technical: 'Technical SEO Analysis',
                                onpage: 'On-Page Elements Analysis',
                                ux: 'User Experience Analysis',
                                structure: 'Content Structure Analysis',
                                social: 'Social Optimization Analysis',
                                local: 'Local SEO Analysis',
                                analytics: 'Advanced Analytics'
                              }
                              return titles[activeTab] || 'Analysis Overview'
                            })()}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {activeTab === 'overview' 
                              ? 'Complete overview of your SEO performance across all categories'
                              : `Detailed analysis and recommendations for ${activeTab} optimization`}
                          </p>
                        </div>
                      </div>
                      
                      {activeTab !== 'overview' && (
                        <div className="flex items-center space-x-2">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            (() => {
                              const factorKey = {
                                content: 'contentQuality',
                                technical: 'technicalSEO',
                                onpage: 'onPageElements',
                                ux: 'userExperience',
                                structure: 'contentStructure',
                                social: 'socialOptimization',
                                local: 'localSEO',
                                analytics: 'advancedAnalytics'
                              }[activeTab as keyof typeof factorKey]
                              
                              if (!factorKey) return 'bg-gray-100 text-gray-700'
                              
                              const section = analysisResult.factors[factorKey as keyof typeof analysisResult.factors]
                              if (!section) return 'bg-gray-100 text-gray-700'
                              
                              const percentage = Math.round((section.score / section.maxScore) * 100)
                              if (percentage >= 80) return 'bg-green-100 text-green-700'
                              if (percentage >= 60) return 'bg-blue-100 text-blue-700'
                              if (percentage >= 40) return 'bg-yellow-100 text-yellow-700'
                              return 'bg-red-100 text-red-700'
                            })()
                          }`}>
                            {(() => {
                              const factorKey = {
                                content: 'contentQuality',
                                technical: 'technicalSEO',
                                onpage: 'onPageElements',
                                ux: 'userExperience',
                                structure: 'contentStructure',
                                social: 'socialOptimization',
                                local: 'localSEO',
                                analytics: 'advancedAnalytics'
                              }[activeTab as keyof typeof factorKey]
                              
                              if (!factorKey) return '0'
                              
                              const section = analysisResult.factors[factorKey as keyof typeof analysisResult.factors]
                              if (!section) return '0'
                              
                              return Math.round((section.score / section.maxScore) * 100)
                            })()}% Score
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === 'overview' && (
                    <div className="space-y-8">
                      {/* Core Web Vitals Section */}
                      {analysisResult.pageSpeed && (
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg className="w-7 h-7 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Page Speed & Core Web Vitals
                          </h3>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <CoreWebVitalsCard
                              title="Desktop Performance"
                              score={analysisResult.pageSpeed.desktop.score}
                              coreWebVitals={analysisResult.pageSpeed.desktop.coreWebVitals}
                              device="desktop"
                            />
                            <CoreWebVitalsCard
                              title="Mobile Performance"
                              score={analysisResult.pageSpeed.mobile.score}
                              coreWebVitals={analysisResult.pageSpeed.mobile.coreWebVitals}
                              device="mobile"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* SEO Metrics Overview */}
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                          <svg className="w-7 h-7 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          SEO Factors Overview
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {Object.entries(analysisResult.factors).map(([key, section]) => {
                            const titles: { [key: string]: string } = {
                              contentQuality: 'Content Quality',
                              technicalSEO: 'Technical SEO',
                              onPageElements: 'On-Page Elements',
                              userExperience: 'User Experience',
                              contentStructure: 'Content Structure',
                              socialOptimization: 'Social Optimization',
                              localSEO: 'Local SEO',
                              advancedAnalytics: 'Advanced Analytics'
                            }
                            
                            const icons: { [key: string]: React.ReactNode } = {
                              contentQuality: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                              technicalSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                              onPageElements: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
                              userExperience: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                              contentStructure: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" /></svg>,
                              socialOptimization: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
                              localSEO: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                              advancedAnalytics: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            }
                            
                            const getStatus = (score: number, maxScore: number) => {
                              const percentage = (score / maxScore) * 100
                              if (percentage >= 90) return 'excellent'
                              if (percentage >= 75) return 'good'
                              if (percentage >= 50) return 'warning'
                              return 'error'
                            }
                            
                            const getStatusDetails = (section: AnalysisSection) => {
                              const goodChecks = section.checks.filter(c => c.status === 'excellent' || c.status === 'good').length
                              const totalChecks = section.checks.length
                              return [`${goodChecks}/${totalChecks} checks passed`, `${section.checks.filter(c => c.status === 'critical' || c.status === 'error').length} issues found`]
                            }
                            
                            const getRecommendations = (section: AnalysisSection) => {
                              return section.checks
                                .filter(c => c.status === 'critical' || c.status === 'error' || c.status === 'warning')
                                .slice(0, 3)
                                .map(c => `Fix ${c.factor.toLowerCase()}`)
                            }
                            
                            return (
                              <SEOMetricCard
                                key={key}
                                title={titles[key]}
                                score={section.score}
                                maxScore={section.maxScore}
                                status={getStatus(section.score, section.maxScore)}
                                icon={icons[key]}
                                description={`Analysis of ${titles[key].toLowerCase()} factors and optimization opportunities.`}
                                details={getStatusDetails(section)}
                                recommendations={getRecommendations(section)}
                              />
                            )
                          })}
                        </div>
                      </div>
                      
                      {/* Overall Summary */}
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          📊 Analysis Summary
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Top Performing Areas</h4>
                            <div className="space-y-2">
                              {Object.entries(analysisResult.factors)
                                .sort((a, b) => b[1].score - a[1].score)
                                .slice(0, 3)
                                .map(([key, section]) => {
                                  const titles: { [key: string]: string } = {
                                    contentQuality: 'Content Quality',
                                    technicalSEO: 'Technical SEO',
                                    onPageElements: 'On-Page Elements',
                                    userExperience: 'User Experience',
                                    contentStructure: 'Content Structure',
                                    socialOptimization: 'Social Optimization',
                                    localSEO: 'Local SEO',
                                    advancedAnalytics: 'Advanced Analytics'
                                  }
                                  return (
                                    <div key={key} className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                                      <span className="text-sm font-medium text-gray-900">{titles[key]}</span>
                                      <span className="text-sm font-bold text-green-600">{section.score}/{section.maxScore}</span>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                            <div className="space-y-2">
                              {Object.entries(analysisResult.factors)
                                .sort((a, b) => a[1].score - b[1].score)
                                .slice(0, 3)
                                .map(([key, section]) => {
                                  const titles: { [key: string]: string } = {
                                    contentQuality: 'Content Quality',
                                    technicalSEO: 'Technical SEO',
                                    onPageElements: 'On-Page Elements',
                                    userExperience: 'User Experience',
                                    contentStructure: 'Content Structure',
                                    socialOptimization: 'Social Optimization',
                                    localSEO: 'Local SEO',
                                    advancedAnalytics: 'Advanced Analytics'
                                  }
                                  return (
                                    <div key={key} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                                      <span className="text-sm font-medium text-gray-900">{titles[key]}</span>
                                      <span className="text-sm font-bold text-yellow-600">{section.score}/{section.maxScore}</span>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'content' && renderAnalysisSection('Content Quality Analysis', analysisResult.factors.contentQuality)}
                  {activeTab === 'technical' && renderAnalysisSection('Technical SEO Analysis', analysisResult.factors.technicalSEO)}
                  {activeTab === 'onpage' && renderAnalysisSection('On-Page Elements Analysis', analysisResult.factors.onPageElements)}
                  {activeTab === 'ux' && renderAnalysisSection('User Experience Analysis', analysisResult.factors.userExperience)}
                  {activeTab === 'structure' && renderAnalysisSection('Content Structure Analysis', analysisResult.factors.contentStructure)}
                  {activeTab === 'social' && renderAnalysisSection('Social Optimization Analysis', analysisResult.factors.socialOptimization)}
                  {activeTab === 'local' && renderAnalysisSection('Local SEO Analysis', analysisResult.factors.localSEO)}
                  {activeTab === 'analytics' && renderAnalysisSection('Advanced Analytics', analysisResult.factors.advancedAnalytics)}
                </div>

                {/* Export Options */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Export Your Report</h3>
                  <div className="flex flex-wrap gap-4">
                    <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                      <span className="mr-2">📊</span>
                      Download PDF Report
                    </button>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                      <span className="mr-2">📈</span>
                      Export to CSV
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                      <span className="mr-2">📧</span>
                      Email Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}


      {/* Tool Breadcrumb */}
      <ToolBreadcrumb toolName="On-Page SEO Analyzer" toolSlug="on-page-seo-analyzer" />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Professional SEO Analysis Tool
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Advanced On-Page SEO Analyzer
              </span>
              <br />
              <span className="text-primary">Complete Website Analysis with 150+ Factors</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Most Comprehensive SEO Analysis Tool Online</h2>
              <p>
                Get detailed insights into your website's SEO performance with our advanced analyzer. Check content quality, technical SEO, Core Web Vitals, user experience, and get actionable recommendations.
              </p>
              <p>
                Perfect for SEO professionals, marketers, and website owners who want to improve their search engine rankings with data-driven optimization strategies.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                150+ SEO Factors
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Core Web Vitals
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Real PageSpeed Data
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Analyze Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Analyze Your Website?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Enter your website URL above to get a comprehensive SEO analysis with actionable insights and detailed recommendations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">150+ SEO Factors</h3>
                <p className="text-sm text-gray-600">
                  Comprehensive analysis covering content, technical SEO, Core Web Vitals, and more
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">Actionable Insights</h3>
                <p className="text-sm text-gray-600">
                  Get specific recommendations and step-by-step optimization guidance
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-100">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">Latest 2025 Standards</h3>
                <p className="text-sm text-gray-600">
                  Analysis based on current Google algorithm and ranking factors
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
                <div className="text-3xl mb-3">📈</div>
                <h3 className="font-semibold text-gray-900 mb-2">Detailed Scoring</h3>
                <p className="text-sm text-gray-600">
                  Clear scoring system with priorities and impact assessment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is On-Page SEO Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
              What is On-Page SEO Analysis and Why It Matters in 2025
            </h2>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  On-page SEO analysis is the comprehensive evaluation of all elements on your website that impact search engine rankings. 
                  In 2025, this includes traditional factors like content quality and meta tags, as well as modern considerations like 
                  Core Web Vitals, E-A-T signals, and AI-driven content analysis.
                </p>

                <h3 className="text-xl font-semibold mb-4 text-gray-800">Our 2025 On-Page SEO Analysis Covers:</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Content Quality & E-A-T</span>
                        <p className="text-sm text-gray-600">Expertise, authoritativeness, trustworthiness analysis</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Core Web Vitals</span>
                        <p className="text-sm text-gray-600">LCP, INP, CLS performance metrics</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Technical SEO Audit</span>
                        <p className="text-sm text-gray-600">HTTPS, mobile-friendliness, structured data</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">On-Page Optimization</span>
                        <p className="text-sm text-gray-600">Title tags, meta descriptions, headers, URLs</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">User Experience Analysis</span>
                        <p className="text-sm text-gray-600">Navigation, accessibility, design quality</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Social Media Optimization</span>
                        <p className="text-sm text-gray-600">Open Graph, Twitter Cards, social sharing</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Advanced Analytics</span>
                        <p className="text-sm text-gray-600">Search intent, SERP features, voice search readiness</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <span className="font-semibold text-gray-900">Local SEO Factors</span>
                        <p className="text-sm text-gray-600">NAP consistency, local schema, geo-targeting</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                  <p className="text-gray-700 text-center">
                    <span className="font-semibold">Why it matters:</span> Proper on-page SEO can improve your search rankings by 25-50% 
                    and significantly boost organic traffic, user engagement, and conversion rates.
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
              Advanced Features That Make Our Tool Stand Out
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 text-center">
                  <div className="text-3xl mb-4">🔬</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">150+ SEO Factors</h3>
                  <p className="text-gray-600">
                    Most comprehensive analysis available covering every aspect of on-page SEO optimization
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 text-center">
                  <div className="text-3xl mb-4">⚡</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Core Web Vitals Analysis</h3>
                  <p className="text-gray-600">
                    Real-time analysis of Google's Core Web Vitals with specific optimization recommendations
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 text-center">
                  <div className="text-3xl mb-4">🤖</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">AI-Powered Insights</h3>
                  <p className="text-gray-600">
                    Advanced AI analysis for content quality, E-A-T signals, and search intent matching
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100 text-center">
                  <div className="text-3xl mb-4">📊</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Visual Score Dashboard</h3>
                  <p className="text-gray-600">
                    Clear, color-coded scoring system with detailed breakdowns for each SEO category
                  </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100 text-center">
                  <div className="text-3xl mb-4">🎯</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Actionable Recommendations</h3>
                  <p className="text-gray-600">
                    Specific, prioritized recommendations with step-by-step implementation guidance
                  </p>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100 text-center">
                  <div className="text-3xl mb-4">📈</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">2025 Algorithm Ready</h3>
                  <p className="text-gray-600">
                    Analysis based on the latest Google algorithm updates and ranking factors for 2025
                  </p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Factors Analysis Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Complete Guide: 150+ SEO Factors We Analyze
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Content Quality Factors */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-bold mb-6 text-blue-800 flex items-center">
                  <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">📝</span>
                  </span>
                  Content Quality & E-A-T Analysis
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Content Length:</strong> Analyzes word count and ensures sufficient content depth (300+ words recommended)
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Readability Score:</strong> Evaluates content complexity and sentence structure for better user experience
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Content Uniqueness:</strong> Checks for duplicate content that could harm search rankings
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>E-A-T Signals:</strong> Evaluates Expertise, Authoritativeness, and Trustworthiness indicators
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Content Freshness:</strong> Important for maintaining relevance and search visibility
                    </div>
                  </li>
                </ul>
              </div>

              {/* Technical SEO Factors */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-bold mb-6 text-green-800 flex items-center">
                  <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">⚙️</span>
                  </span>
                  Technical SEO & Core Web Vitals
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>HTTPS Security:</strong> SSL certificate validation - essential for user trust and Google rankings
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Core Web Vitals:</strong> LCP, INP, CLS measurements directly from Google PageSpeed Insights
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Mobile Viewport:</strong> Responsive design validation for mobile-first indexing
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Character Encoding:</strong> Proper UTF-8 encoding for international content support
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Structured Data:</strong> JSON-LD schema markup for enhanced SERP appearances
                    </div>
                  </li>
                </ul>
              </div>

              {/* On-Page Elements */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-bold mb-6 text-purple-800 flex items-center">
                  <span className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🎯</span>
                  </span>
                  On-Page Optimization Elements
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Title Tag Optimization:</strong> Length (30-60 chars), keyword placement, and uniqueness
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Meta Descriptions:</strong> Compelling descriptions (120-160 chars) with relevant keywords
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Header Structure:</strong> Proper H1-H6 hierarchy for content organization and SEO
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>URL Structure:</strong> Clean, descriptive URLs that enhance user experience
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Internal Linking:</strong> Strategic internal links for better site architecture
                    </div>
                  </li>
                </ul>
              </div>

              {/* User Experience & Social */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-bold mb-6 text-orange-800 flex items-center">
                  <span className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">👥</span>
                  </span>
                  User Experience & Social Signals
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Image Alt Text:</strong> Accessibility and SEO benefits through descriptive alt attributes
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Language Declaration:</strong> Proper lang attributes for international SEO
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Open Graph Tags:</strong> Optimized social media sharing with title, description, and image
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Twitter Cards:</strong> Enhanced Twitter sharing for better social engagement
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-600 mr-2 mt-1">✓</span>
                    <div>
                      <strong>Modern Image Formats:</strong> WebP/AVIF usage for improved page loading speed
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Why These Factors Matter</h3>
                <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">
                  Google uses over 200 ranking factors to determine search positions. Our tool analyzes the most critical on-page elements 
                  that directly impact your rankings. From technical fundamentals like HTTPS and Core Web Vitals to content quality signals 
                  and user experience indicators, each factor contributes to your overall SEO success. By addressing these elements systematically, 
                  you can achieve <span className="font-semibold text-primary">25-50% improvement in search rankings</span> and significantly boost 
                  organic traffic, user engagement, and conversion rates.
                </p>
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is this on-page SEO analyzer free?</h3>
                <p className="text-gray-600">Yes, our comprehensive SEO analyzer is completely free to use. Get detailed analysis of 150+ SEO factors without any registration or hidden fees.</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How accurate is the SEO analysis?</h3>
                <p className="text-gray-600">Our tool uses real data from Google PageSpeed Insights API and analyzes actual HTML content from your website, providing accurate and actionable SEO insights.</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">What makes this tool different?</h3>
                <p className="text-gray-600">Unlike other tools that show generic advice, we provide specific, actionable recommendations based on your actual website analysis with real Core Web Vitals data.</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I analyze any website?</h3>
                <p className="text-gray-600">Yes, you can analyze any public website URL. Our tool works with all types of websites including blogs, e-commerce sites, and business websites.</p>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How often should I run SEO analysis?</h3>
                <p className="text-gray-600">We recommend running analysis monthly or after making significant changes to your website. Regular monitoring helps maintain and improve your search rankings.</p>
              </div>
              
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Do you store or save my website data?</h3>
                <p className="text-gray-600">No, we don't store or save any data from your website analysis. Each analysis is performed in real-time and results are only shown to you during the session.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore Other Tools Section */}
      <section className="py-16 bg-white">
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
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">On-Page SEO Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Complete website analysis with 150+ SEO factors and Core Web Vitals.</p>
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
            <h2 className="text-3xl font-bold mb-6">Start Your Complete SEO Analysis Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop guessing what's wrong with your website's SEO. Get a comprehensive analysis of 150+ factors that directly impact your search rankings, user experience, and organic traffic.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🔬 Analyze Your Website Now →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>⚡</span>
                <span>Complete analysis in under 60 seconds</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>150+ SEO factors analyzed</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Actionable recommendations included</span>
              </div>
            </div>
            
            <p className="text-sm mt-6 opacity-80">
              <strong>Get professional SEO insights with SEO Shouts' Advanced On-Page Analyzer!</strong>
              <br />
              <em>Trusted by thousands of SEO professionals, marketers, and website owners worldwide for accurate website analysis.</em>
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
                "name": "Is this on-page SEO analyzer free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our comprehensive SEO analyzer is completely free to use. Get detailed analysis of 150+ SEO factors without any registration or hidden fees."
                }
              },
              {
                "@type": "Question", 
                "name": "How accurate is the SEO analysis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our tool uses real data from Google PageSpeed Insights API and analyzes actual HTML content from your website, providing accurate and actionable SEO insights."
                }
              },
              {
                "@type": "Question",
                "name": "What makes this tool different?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Unlike other tools that show generic advice, we provide specific, actionable recommendations based on your actual website analysis with real Core Web Vitals data."
                }
              },
              {
                "@type": "Question",
                "name": "Can I analyze any website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can analyze any public website URL. Our tool works with all types of websites including blogs, e-commerce sites, and business websites."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I run SEO analysis?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We recommend running analysis monthly or after making significant changes to your website. Regular monitoring helps maintain and improve your search rankings."
                }
              },
              {
                "@type": "Question",
                "name": "Do you store or save my website data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No, we don't store or save any data from your website analysis. Each analysis is performed in real-time and results are only shown to you during the session."
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
            "name": "Advanced On-Page SEO Analyzer",
            "description": "Professional on-page SEO analysis tool that analyzes 150+ ranking factors including content quality, technical SEO, Core Web Vitals, user experience, and provides actionable optimization recommendations.",
            "url": "https://seoshouts.com/tools/on-page-seo-analyzer",
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
              "150+ SEO factor analysis",
              "Core Web Vitals analysis",
              "Technical SEO audit",
              "Content quality assessment",
              "User experience evaluation",
              "Social optimization check",
              "Local SEO analysis",
              "Advanced analytics review",
              "Actionable recommendations",
              "PageSpeed Insights integration"
            ],
            "screenshot": "https://seoshouts.com/tools/on-page-seo-analyzer/screenshot.jpg"
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
                "name": "On-Page SEO Analyzer",
                "item": "https://seoshouts.com/tools/on-page-seo-analyzer"
              }
            ]
          })
        }}
      />
    </div>
  )
}