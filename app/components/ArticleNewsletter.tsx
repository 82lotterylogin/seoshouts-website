// app/components/ArticleNewsletter.tsx
'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

const ArticleNewsletter = () => {
  const [formData, setFormData] = useState({
    email: '',
    isLoading: false,
    isSubscribed: false,
    error: ''
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email) {
      setFormData(prev => ({ ...prev, error: 'Please enter your email address' }))
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    
    if (!recaptchaToken) {
      setFormData(prev => ({ ...prev, error: 'Please complete the reCAPTCHA verification' }))
      return
    }

    setFormData(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          recaptchaToken: recaptchaToken
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData(prev => ({ 
          ...prev, 
          isLoading: false, 
          isSubscribed: true,
          email: '' 
        }))
        
        recaptchaRef.current?.reset()
        
        setTimeout(() => {
          setFormData(prev => ({ ...prev, isSubscribed: false }))
        }, 5000)
      } else {
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (error) {
      setFormData(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Subscription failed. Please try again.' 
      }))
      
      recaptchaRef.current?.reset()
    }
  }

  return (
    <section className="my-16">
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-2xl p-8 lg:p-12 text-white relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300/20 rounded-full translate-y-24 -translate-x-24"></div>
        
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          
          <h3 className="text-3xl lg:text-4xl font-bold mb-4">
            Want More SEO Insights Like This?
          </h3>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            Join 15,000+ marketers getting weekly actionable SEO strategies, case studies, and industry updates that actually move the needle.
          </p>
          
          {!formData.isSubscribed ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value, error: '' }))}
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all"
                  disabled={formData.isLoading}
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-orange-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={formData.isLoading}
                >
                  {formData.isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Get Free Insights'
                  )}
                </button>
              </div>

              {/* reCAPTCHA */}
              <div className="flex justify-center pt-4">
                <div className="bg-white/95 rounded-lg p-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    theme="light"
                  />
                </div>
              </div>

              {/* Error Message */}
              {formData.error && (
                <div className="bg-red-500/20 border border-red-300/30 rounded-xl p-4 text-white text-center max-w-md mx-auto">
                  {formData.error}
                </div>
              )}
            </form>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 text-white">
                <svg className="w-6 h-6 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="font-semibold">Thanks! You've been successfully subscribed to our newsletter.</span>
              </div>
            </div>
          )}
          
          <p className="text-sm text-white/70 mt-4">
            ✓ No spam, ever ✓ Unsubscribe anytime ✓ Exclusive SEO tips & case studies
          </p>
        </div>
      </div>
    </section>
  )
}

export default ArticleNewsletter
