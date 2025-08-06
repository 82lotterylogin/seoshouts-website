// app/components/BlogNewsletterForm.tsx
'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function BlogNewsletterForm() {
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
    <div className="mt-2 mb-12">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">Get More SEO Insights</h3>
            <p className="text-blue-100">
              Join 10,000+ marketers receiving weekly SEO strategies and tips directly in their inbox.
            </p>
          </div>
          
          {!formData.isSubscribed ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value, error: '' }))}
                  disabled={formData.isLoading}
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={formData.isLoading}
                >
                  {formData.isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Subscribe Free'
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
                <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-4 text-white text-center">
                  {formData.error}
                </div>
              )}
            </form>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="font-semibold">Thank you! You've been successfully subscribed to our newsletter.</span>
              </div>
            </div>
          )}
          
          <p className="text-xs text-blue-200 mt-4">
            ✓ No spam, ever ✓ Unsubscribe anytime ✓ Expert SEO tips
          </p>
        </div>
      </div>
    </div>
  )
}
