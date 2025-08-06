'use client'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function NewsletterPageForm() {
  // Newsletter form state
  const [newsletterForm, setNewsletterForm] = useState({
    email: '',
    firstName: '',
    isLoading: false,
    isSubscribed: false,
    error: ''
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Newsletter form submission handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newsletterForm.email) {
      setNewsletterForm(prev => ({ ...prev, error: 'Please enter your email address' }))
      return
    }

    // Get reCAPTCHA token
    const recaptchaToken = recaptchaRef.current?.getValue()
    
    if (!recaptchaToken) {
      setNewsletterForm(prev => ({ ...prev, error: 'Please complete the reCAPTCHA verification' }))
      return
    }

    setNewsletterForm(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: newsletterForm.email,
          firstName: newsletterForm.firstName,
          recaptchaToken: recaptchaToken
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setNewsletterForm(prev => ({ 
          ...prev, 
          isLoading: false, 
          isSubscribed: true,
          email: '',
          firstName: '' 
        }))
        
        // Reset reCAPTCHA
        recaptchaRef.current?.reset()
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setNewsletterForm(prev => ({ ...prev, isSubscribed: false }))
        }, 5000)
      } else {
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (error) {
      setNewsletterForm(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Subscription failed. Please try again.' 
      }))
      
      // Reset reCAPTCHA on error
      recaptchaRef.current?.reset()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscribe Now - It's Free!</h2>
      
      <form className="space-y-4" onSubmit={handleNewsletterSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
            value={newsletterForm.email}
            onChange={(e) => setNewsletterForm(prev => ({ ...prev, email: e.target.value, error: '' }))}
            disabled={newsletterForm.isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name (Optional)
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your first name"
            value={newsletterForm.firstName}
            onChange={(e) => setNewsletterForm(prev => ({ ...prev, firstName: e.target.value }))}
            disabled={newsletterForm.isLoading}
          />
        </div>

        {/* reCAPTCHA Widget */}
        <div className="flex justify-center py-4">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            theme="light"
          />
        </div>

        <button
          type="submit"
          disabled={newsletterForm.isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-lg font-bold hover:scale-105 transition transform shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {newsletterForm.isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </span>
          ) : (
            '📧 Subscribe to SEOShouts Weekly'
          )}
        </button>

        {/* Success Message */}
        {newsletterForm.isSubscribed && (
          <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-green-700 text-center">
            ✅ Thank you! You've been successfully subscribed to our newsletter.
          </div>
        )}
        
        {/* Error Message */}
        {newsletterForm.error && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-4 text-red-700 text-center">
            {newsletterForm.error}
          </div>
        )}
      </form>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        ✅ Free forever • ✅ Unsubscribe anytime • ✅ No spam, ever
      </p>
    </div>
  )
}
