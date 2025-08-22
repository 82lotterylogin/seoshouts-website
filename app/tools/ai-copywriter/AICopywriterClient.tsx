'use client'

import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function AICopywriterClient() {
  const [formData, setFormData] = useState({
    productDescription: '',
    targetAudience: '',
    copyType: 'Ad',
    tone: 'Professional',
    framework: '',
    keywords: '',
    numberOfVariations: 3,
    isLoading: false,
    error: '',
    results: null as any
  })

  const [usageInfo, setUsageInfo] = useState({
    usageCount: 0,
    maxUsage: 5,
    isLimitReached: false
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsage = localStorage.getItem('ai-copywriter-usage')
      const currentUsage = storedUsage ? parseInt(storedUsage) : 0
      
      setUsageInfo({
        usageCount: currentUsage,
        maxUsage: 5,
        isLimitReached: currentUsage >= 5
      })
    }
  }, [])

  // Generate copy using AI
  const generateCopy = async () => {
    if (formData.isLoading) return
    
    // Check usage limit
    if (usageInfo.isLimitReached) {
      setFormData(prev => ({ 
        ...prev, 
        error: 'Daily usage limit reached. Please try again tomorrow.' 
      }))
      return
    }

    if (!formData.productDescription.trim()) {
      setFormData(prev => ({ 
        ...prev, 
        error: 'Please provide a product or service description.' 
      }))
      return
    }

    setFormData(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: '',
      results: null 
    }))

    try {
      const response = await fetch('/api/ai-copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDescription: formData.productDescription,
          targetAudience: formData.targetAudience,
          copyType: formData.copyType,
          tone: formData.tone,
          framework: formData.framework,
          keywords: formData.keywords,
          numberOfVariations: formData.numberOfVariations
        })
      })

      const data = await response.json()

      if (response.ok) {
        setFormData(prev => ({ 
          ...prev, 
          results: data,
          isLoading: false 
        }))
        
        // Update usage count
        const newUsageCount = usageInfo.usageCount + 1
        localStorage.setItem('ai-copywriter-usage', newUsageCount.toString())
        setUsageInfo(prev => ({
          ...prev,
          usageCount: newUsageCount,
          isLimitReached: newUsageCount >= 5
        }))
      } else {
        throw new Error(data.error || 'Failed to generate copy')
      }
    } catch (error: any) {
      setFormData(prev => ({ 
        ...prev, 
        error: error.message || 'Something went wrong. Please try again.',
        isLoading: false 
      }))
    }
  }

  // Copy to clipboard function
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Show success feedback
    })
  }

  const copyTypes = [
    { value: 'Ad', label: 'Advertisement Copy' },
    { value: 'Product', label: 'Product Description' },
    { value: 'Email', label: 'Email Marketing' },
    { value: 'Social', label: 'Social Media Post' },
    { value: 'Blog', label: 'Blog Post Intro' },
    { value: 'Landing', label: 'Landing Page Copy' },
    { value: 'Sales', label: 'Sales Page' },
    { value: 'PPC', label: 'PPC Ad Copy' }
  ]

  const toneOptions = [
    'Professional',
    'Friendly',
    'Persuasive',
    'Urgent',
    'Casual',
    'Authoritative',
    'Emotional',
    'Informative'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            AI Copywriting Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Generate high-converting copy for ads, product descriptions, emails, and more. Professional copywriting powered by AI in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                ✍️
              </span>
              Copy Details
            </h2>

            {/* Usage Counter */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Daily Usage</span>
                <span className={`text-sm font-bold ${usageInfo.isLimitReached ? 'text-red-600' : 'text-green-600'}`}>
                  {usageInfo.usageCount}/{usageInfo.maxUsage}
                </span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    usageInfo.isLimitReached ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(usageInfo.usageCount / usageInfo.maxUsage) * 100}%` }}
                ></div>
              </div>
              {usageInfo.isLimitReached && (
                <p className="text-xs text-red-600 mt-1">Daily limit reached. Try again tomorrow!</p>
              )}
            </div>

            <div className="space-y-6">
              {/* Product/Service Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product/Service Description *
                </label>
                <textarea
                  value={formData.productDescription}
                  onChange={(e) => setFormData({...formData, productDescription: e.target.value})}
                  rows={4}
                  placeholder="Describe what you're promoting. Include key features, benefits, and unique selling points..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  placeholder="e.g., small business owners, fitness enthusiasts, students..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Copy Type and Tone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Copy Type
                  </label>
                  <select
                    value={formData.copyType}
                    onChange={(e) => setFormData({...formData, copyType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {copyTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    {toneOptions.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Keywords to Include
                </label>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                  placeholder="important keywords, separated by commas"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Number of Variations */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Variations: {formData.numberOfVariations}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={formData.numberOfVariations}
                  onChange={(e) => setFormData({...formData, numberOfVariations: parseInt(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>

              {/* Error Message */}
              {formData.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{formData.error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generateCopy}
                disabled={formData.isLoading || usageInfo.isLimitReached}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {formData.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating Copy...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Generate Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                📝
              </span>
              Generated Copy
            </h2>
            
            {formData.results ? (
              <div className="space-y-6">
                {formData.results.variations?.map((variation: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Variation {index + 1}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(variation.copy)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {variation.copy}
                      </p>
                    </div>
                  </div>
                ))}
                
                {formData.results.tips && formData.results.tips.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                      💡 Copywriting Tips
                    </h3>
                    <ul className="space-y-2">
                      {formData.results.tips.map((tip: string, index: number) => (
                        <li key={index} className="text-blue-800 text-sm flex items-start">
                          <span className="mr-2">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <p className="text-lg mb-2">Ready to generate copy!</p>
                <p className="text-sm">Fill in the details and click "Generate Copy" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Copywriting Tips */}
        <div className="mt-16 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 Pro Copywriting Tips
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">High-Converting Copy Elements</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Strong, benefit-focused headlines
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Clear value proposition
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Compelling call-to-action
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Social proof and testimonials
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Common Mistakes to Avoid</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Focusing on features instead of benefits
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Using jargon your audience won't understand
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Making claims without proof
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  Weak or missing call-to-action
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}