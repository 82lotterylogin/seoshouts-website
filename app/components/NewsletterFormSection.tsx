'use client'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function NewsletterFormSection() {
  // Newsletter form state
  const [newsletterForm, setNewsletterForm] = useState({
    email: '',
    isLoading: false,
    isSubscribed: false,
    error: ''
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Newsletter form submission handler with reCAPTCHA
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
          recaptchaToken: recaptchaToken
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setNewsletterForm(prev => ({ 
          ...prev, 
          isLoading: false, 
          isSubscribed: true,
          email: '' 
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
    <section id="newsletter" className="py-16 sm:py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6 sm:mb-8">
            <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-medium text-white">📬 Join 10,000+ SEO Professionals</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Get Weekly SEO Insights
            <br />
            <span className="text-white/80">Delivered to Your Inbox</span>
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto px-4">
            Stay ahead of the competition with exclusive SEO strategies, tool updates, 
            and marketing tips that you won't find anywhere else.
          </p>

          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl">
              <form 
                className="space-y-4 sm:space-y-6" 
                role="form" 
                aria-label="Newsletter subscription"
                onSubmit={handleNewsletterSubmit}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white/90 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/30 focus:border-white focus:outline-none focus:ring-4 focus:ring-white/20 text-gray-800 placeholder-gray-500 font-medium text-base sm:text-lg transition-all duration-300"
                      required
                      aria-label="Email address for newsletter subscription"
                      value={newsletterForm.email}
                      onChange={(e) => setNewsletterForm(prev => ({ ...prev, email: e.target.value, error: '' }))}
                      disabled={newsletterForm.isLoading}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="group px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center min-w-fit disabled:opacity-70 disabled:cursor-not-allowed"
                    aria-label="Subscribe to newsletter"
                    disabled={newsletterForm.isLoading}
                  >
                    <span className="flex items-center">
                      {newsletterForm.isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </>
                      ) : (
                        <>
                          Subscribe Free
                          <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>
                </div>

                {/* reCAPTCHA Widget - NEW */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    theme="light"
                  />
                </div>

                {/* Success Message */}
                {newsletterForm.isSubscribed && (
                  <div className="bg-green-500/20 border border-green-300/30 rounded-xl p-4 text-white text-center">
                    ✅ Thank you! You've been successfully subscribed to our newsletter.
                  </div>
                )}
                
                {/* Error Message */}
                {newsletterForm.error && (
                  <div className="bg-red-500/20 border border-red-300/30 rounded-xl p-4 text-white text-center">
                    {newsletterForm.error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
