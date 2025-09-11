'use client'

import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

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
    <div className="min-h-screen bg-gray-50">

      {/* Tool Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Input Form */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
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
                className="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
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
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
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
      </div>
    </div>
  </section>

      {/* Tool Breadcrumb */}
      <ToolBreadcrumb toolName="AI Copywriter" toolSlug="ai-copywriter" />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free AI Tool
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free AI Copywriting Tool for Web Copy, Ads & More
              </span>
              <br />
              <span className="text-primary">Write Like a Pro in Seconds</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generate High-Converting Copy with AI</h2>
              <p>
                Create compelling ad copy, product descriptions, emails, and marketing content that converts. Our AI uses proven copywriting frameworks to generate multiple variations for A/B testing.
              </p>
              <p>
                Perfect for marketers, business owners, and content creators who need professional copy fast. No experience required - just describe your product and let AI do the rest.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                AI-Powered Generation
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Multiple Variations
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                8+ Copy Types
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Perfect for Every Marketing Need</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Social Media Ads</h3>
                <p className="text-gray-600">Create engaging Facebook, Instagram, and LinkedIn ad copy that stops the scroll and drives clicks.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Email Marketing</h3>
                <p className="text-gray-600">Generate compelling email subject lines and body content that increase open rates and conversions.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-primary/10">
                <div className="text-3xl mb-4">🛍️</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Product Descriptions</h3>
                <p className="text-gray-600">Write persuasive product descriptions that highlight benefits and drive sales conversions.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Landing Pages</h3>
                <p className="text-gray-600">Craft high-converting landing page copy that captures leads and maximizes conversion rates.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Google Ads</h3>
                <p className="text-gray-600">Create compelling PPC ad headlines and descriptions that improve Quality Score and CTR.</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="text-3xl mb-4">💼</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Sales Pages</h3>
                <p className="text-gray-600">Generate persuasive sales copy that addresses pain points and drives purchase decisions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Explanation Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How Our AI Copywriter Works</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">🤖 Advanced AI Technology</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Smart Context Analysis</h4>
                      <p className="text-gray-600">Our AI analyzes your product description, target audience, and desired tone to understand the context perfectly.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Conversion-Focused Generation</h4>
                      <p className="text-gray-600">Uses proven copywriting frameworks like AIDA, PAS, and Before-After-Bridge to create persuasive content.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Multiple Variations</h4>
                      <p className="text-gray-600">Generates multiple copy variations so you can A/B test and choose the best performing version.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">🎯 Copy Types We Support</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">📱 Social Media Ads</span>
                    <span className="text-sm text-primary">Facebook, Instagram</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">📧 Email Marketing</span>
                    <span className="text-sm text-primary">Subject lines & body</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">🛍️ Product Copy</span>
                    <span className="text-sm text-primary">Descriptions & features</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">🎯 Landing Pages</span>
                    <span className="text-sm text-primary">Headlines & CTAs</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">🔍 PPC Ads</span>
                    <span className="text-sm text-primary">Google & Bing Ads</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-primary/10">
              <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">💡 Pro Copywriting Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    High-Converting Elements
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 text-sm">•</span>
                      Strong, benefit-focused headlines that grab attention
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 text-sm">•</span>
                      Clear value proposition that addresses pain points
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 text-sm">•</span>
                      Compelling call-to-action with urgency or scarcity
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 text-sm">•</span>
                      Social proof and testimonials for credibility
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="text-red-500 mr-2">✗</span>
                    Common Mistakes to Avoid
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 text-sm">•</span>
                      Focusing on features instead of customer benefits
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 text-sm">•</span>
                      Using industry jargon that confuses your audience
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 text-sm">•</span>
                      Making bold claims without supporting evidence
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2 text-sm">•</span>
                      Weak or vague call-to-action statements
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is the AI copywriter tool free?</h3>
                <p className="text-gray-600">Yes, you can generate up to 5 copy variations per day for free. No signup required to start using the tool.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">What copy types can I generate?</h3>
                <p className="text-gray-600">You can create ads, product descriptions, emails, social media posts, blog intros, landing pages, sales copy, and PPC ads.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How accurate is the AI-generated copy?</h3>
                <p className="text-gray-600">Our AI uses proven copywriting frameworks and is trained on high-converting copy examples. Always review and customize for your brand voice.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I specify keywords to include?</h3>
                <p className="text-gray-600">Yes, you can add important keywords that the AI will naturally incorporate into your copy for better SEO and relevance.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">What tones and styles are available?</h3>
                <p className="text-gray-600">Choose from professional, friendly, persuasive, urgent, casual, authoritative, emotional, or informative tones to match your brand.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I use the generated copy commercially?</h3>
                <p className="text-gray-600">Absolutely! All generated copy is yours to use for any commercial purpose including ads, websites, emails, and marketing materials.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Tools Section */}
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
                <div className="text-3xl mb-3">✍️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">AI Copywriter</h3>
                <p className="text-sm text-gray-600 mb-4">Generate high-converting copy for ads, emails, and product descriptions.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">SEO Meta Writer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate compelling meta titles and descriptions for better CTR.</p>
                <a href="/tools/seo-meta-writer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Analyze keyword density and optimize content for target keywords.</p>
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
                <div className="text-3xl mb-3">💻</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">HTML Editor</h3>
                <p className="text-sm text-gray-600 mb-4">Professional HTML5 editor with live preview and syntax highlighting.</p>
                <a href="/tools/html-editor" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📝</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Word Counter</h3>
                <p className="text-sm text-gray-600 mb-4">Real-time word and character counting with reading time estimates.</p>
                <a href="/tools/word-counter" className="text-primary font-medium hover:underline">
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
            <h2 className="text-3xl font-bold mb-6">Ready to Scale Your Content Marketing?</h2>
            <p className="text-lg mb-8 opacity-90">
              Our AI copywriter is just one tool in your marketing arsenal. Get professional copywriting and content marketing services to maximize your conversions and ROI.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
                <h3 className="text-xl font-semibold mb-3">🎯 Content Strategy</h3>
                <p className="opacity-90">Expert content planning, conversion optimization, and performance tracking for maximum marketing impact.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
                <h3 className="text-xl font-semibold mb-3">📈 Copywriting Services</h3>
                <p className="opacity-90">Professional copywriting for sales pages, email sequences, and high-converting ad campaigns.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/services" 
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg"
              >
                View Marketing Services
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                Get Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}