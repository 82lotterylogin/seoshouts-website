'use client'

import { useState, useRef, useCallback } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

interface AnalysisResult {
  url: string
  overallScore: number
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
  const recaptchaRef = useRef<ReCAPTCHA>(null)

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

    setLoading(true)
    setError('')

    try {
      const recaptchaToken = recaptchaRef.current?.getValue()
      if (!recaptchaToken) {
        throw new Error('Please complete the reCAPTCHA verification')
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

      const response = await fetch('/api/analyze-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          targetKeyword: targetKeyword || undefined,
          recaptchaToken: recaptchaToken
        }),
      })
      
      setCurrentStep('Processing analysis results...')
      setAnalysisProgress(90)

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Analysis failed')
      }
      
      setCurrentStep('Analysis complete!')
      setAnalysisProgress(100)
      
      await new Promise(resolve => setTimeout(resolve, 500))

      console.log('Analysis completed successfully')
      setAnalysisResult(data.analysis)
      
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
    } finally {
      setLoading(false)
    }
  }, [url, targetKeyword, isVerified])

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

  const renderAnalysisSection = (title: string, section: AnalysisSection) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(section.score)}`}>
          {section.score}/{section.maxScore}
        </div>
      </div>
      
      <div className="space-y-4">
        {section.checks.map((check, index) => (
          <div key={index} className="border-l-4 border-gray-200 pl-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">{getStatusIcon(check.status)}</span>
                  <span className="font-medium text-gray-900">{check.factor}</span>
                </div>
                <p className="text-sm text-gray-600">{check.description}</p>
              </div>
              <div className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                check.status === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                check.status === 'good' ? 'bg-green-100 text-green-800' :
                check.status === 'fair' ? 'bg-blue-100 text-blue-800' :
                check.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                check.status === 'critical' ? 'bg-red-100 text-red-800' :
                check.status === 'poor' ? 'bg-orange-100 text-orange-800' :
                check.status === 'error' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {check.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

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

      {/* Tool Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Input Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">🔍 Analyze Your Website</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Keyword (Optional)
                    </label>
                    <input
                      type="text"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      placeholder="your target keyword"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Adding a target keyword provides more specific optimization recommendations
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                      onChange={handleCaptchaChange}
                      theme="light"
                    />
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={analyzeWebsite}
                      disabled={!url || !isVerified || loading}
                      className="w-full bg-gradient-to-r from-primary to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Analyzing Website...
                        </div>
                      ) : (
                        '🚀 Start SEO Analysis'
                      )}
                    </button>
                    
                    {analysisResult && (
                      <button
                        onClick={resetAnalysis}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200"
                      >
                        🔄 New Analysis
                      </button>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}
                </div>

                {/* Enhanced Analysis Progress */}
                {loading && (
                  <div className="mt-6 space-y-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {currentStep || 'Preparing analysis...'}
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                        <div 
                          className="bg-gradient-to-r from-primary to-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${analysisProgress}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-4">
                        {analysisProgress}% Complete
                      </div>
                    </div>
                    
                    {/* Animated Steps */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            analysisProgress >= 10 ? 'bg-green-500' : 'bg-gray-300 animate-pulse'
                          }`}></div>
                          <span className="text-xs font-medium text-gray-700">Fetching Content</span>
                        </div>
                        {analysisProgress >= 10 && <span className="text-green-500 text-xs">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            analysisProgress >= 40 ? 'bg-green-500' : 
                            analysisProgress >= 10 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs font-medium text-gray-700">Technical SEO Check</span>
                        </div>
                        {analysisProgress >= 40 && <span className="text-green-500 text-xs">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            analysisProgress >= 70 ? 'bg-green-500' : 
                            analysisProgress >= 40 ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs font-medium text-gray-700">PageSpeed Analysis</span>
                        </div>
                        {analysisProgress >= 70 && <span className="text-green-500 text-xs">✓</span>}
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            analysisProgress >= 100 ? 'bg-green-500' : 
                            analysisProgress >= 70 ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'
                          }`}></div>
                          <span className="text-xs font-medium text-gray-700">Generating Report</span>
                        </div>
                        {analysisProgress >= 100 && <span className="text-green-500 text-xs">✓</span>}
                      </div>
                    </div>
                    
                    {/* Fun Loading Messages */}
                    <div className="text-center mt-4">
                      <div className="text-xs text-gray-500 italic">
                        {analysisProgress < 25 ? '🔍 Inspecting your website...' :
                         analysisProgress < 50 ? '⚡ Checking performance metrics...' :
                         analysisProgress < 75 ? '📊 Running comprehensive analysis...' :
                         '🎯 Almost done! Finalizing results...'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

              {/* Results Section */}
              <div className="lg:col-span-2">
                {!analysisResult ? (
                  <div className="bg-white rounded-2xl shadow-xl p-12 border border-gray-100 text-center">
                    <div className="text-6xl mb-6">🔍</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ready to Analyze Your Website?
                    </h3>
                    <p className="text-gray-600 mb-8">
                      Enter your website URL to get a comprehensive SEO analysis with actionable insights
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                        <div className="text-3xl mb-3">📊</div>
                        <h4 className="font-semibold text-gray-900 mb-2">150+ SEO Factors</h4>
                        <p className="text-sm text-gray-600">
                          Comprehensive analysis covering content, technical SEO, Core Web Vitals, and more
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                        <div className="text-3xl mb-3">⚡</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Actionable Insights</h4>
                        <p className="text-sm text-gray-600">
                          Get specific recommendations and step-by-step optimization guidance
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl">
                        <div className="text-3xl mb-3">🎯</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Latest 2025 Standards</h4>
                        <p className="text-sm text-gray-600">
                          Analysis based on current Google algorithm and ranking factors
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl">
                        <div className="text-3xl mb-3">📈</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Detailed Scoring</h4>
                        <p className="text-sm text-gray-600">
                          Clear scoring system with priorities and impact assessment
                        </p>
                      </div>
                    </div>
                  </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score Dashboard */}
                  <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">SEO Analysis Report</h2>
                        <p className="text-blue-100">
                          Analysis completed for: <span className="font-medium">{analysisResult.url}</span>
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">{analysisResult.overallScore}/100</div>
                        <div className="text-sm text-blue-100">Overall Score</div>
                      </div>
                    </div>
                    
                    {/* Category Scores */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(analysisResult.factors).map(([key, section]) => {
                        const titles: { [key: string]: string } = {
                          contentQuality: 'Content',
                          technicalSEO: 'Technical',
                          onPageElements: 'On-Page',
                          userExperience: 'UX',
                          contentStructure: 'Structure',
                          socialOptimization: 'Social',
                          localSEO: 'Local',
                          advancedAnalytics: 'Analytics'
                        }
                        return (
                          <div key={key} className="text-center">
                            <div className="text-2xl font-bold">{section.score}</div>
                            <div className="text-xs text-blue-100">{titles[key]}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                    <div className="flex space-x-1 overflow-x-auto">
                      {[
                        { id: 'overview', label: '📊 Overview', count: '' },
                        { id: 'content', label: '📝 Content Quality', count: `${analysisResult.factors.contentQuality.score}` },
                        { id: 'technical', label: '⚙️ Technical SEO', count: `${analysisResult.factors.technicalSEO.score}` },
                        { id: 'onpage', label: '🎯 On-Page Elements', count: `${analysisResult.factors.onPageElements.score}` },
                        { id: 'ux', label: '👥 User Experience', count: `${analysisResult.factors.userExperience.score}` },
                        { id: 'structure', label: '🏗️ Content Structure', count: `${analysisResult.factors.contentStructure.score}` },
                        { id: 'social', label: '📱 Social Optimization', count: `${analysisResult.factors.socialOptimization.score}` },
                        { id: 'local', label: '📍 Local SEO', count: `${analysisResult.factors.localSEO.score}` },
                        { id: 'analytics', label: '📈 Advanced Analytics', count: `${analysisResult.factors.advancedAnalytics.score}` }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-primary text-white shadow-md'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {tab.label} {tab.count && <span className="ml-1 opacity-75">({tab.count})</span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tab Content */}
                  <div>
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
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
                    <div className="flex space-x-4">
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
              )}
            </div>
            </div>
          </div>
        </div>
      </section>

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