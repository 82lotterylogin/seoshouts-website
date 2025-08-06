'use client'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function BlogSidebarSubscription() {
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
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden border-4 border-blue-800/20">
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Stay Ahead in SEO</h3>
            <div className="flex items-center gap-1 text-blue-200 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span>Join 10,000+ SEO professionals</span>
            </div>
          </div>
        </div>
        
        <p className="text-blue-100 mb-6 leading-relaxed">
          Get exclusive insights, advanced strategies, and industry updates delivered weekly. No fluff, just actionable SEO tactics that work.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-4 rounded-xl bg-white/15 backdrop-blur-sm border-2 border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all duration-200"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value, error: '' }))}
              disabled={formData.isLoading}
              required
            />
            <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
          </div>

          {/* reCAPTCHA */}
          <div className="flex justify-center">
            <div className="bg-white/95 rounded-lg p-2">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                theme="light"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-blue-700 py-4 px-6 rounded-xl hover:bg-blue-50 transition-all duration-200 font-bold shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
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
              <>
                <span>Subscribe Free</span>
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </>
            )}
          </button>

          {/* Success Message */}
          {formData.isSubscribed && (
            <div className="bg-green-500/20 border border-green-300/30 rounded-xl p-4 text-white text-center">
              ✅ Thank you! You've been successfully subscribed to our newsletter.
            </div>
          )}
          
          {/* Error Message */}
          {formData.error && (
            <div className="bg-red-500/20 border border-red-300/30 rounded-xl p-4 text-white text-center">
              {formData.error}
            </div>
          )}
        </form>
        
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-blue-200">
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>No spam, ever</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <span>Unsubscribe anytime</span>
          </div>
        </div>
      </div>
    </div>
  )
}
