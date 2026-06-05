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
    <div className="nlf-wrap">
      <form onSubmit={handleNewsletterSubmit}>
        {/* First name row */}
        <div className="nlf-name-row">
          <span className="nlf-name-tag">FIRST_NAME</span>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="nlf-name-input"
            placeholder="First name (optional)"
            value={newsletterForm.firstName}
            onChange={(e) => setNewsletterForm(prev => ({ ...prev, firstName: e.target.value }))}
            disabled={newsletterForm.isLoading}
            autoComplete="given-name"
          />
        </div>

        {/* Email + submit row */}
        <div className="nlf-row">
          <input
            type="email"
            id="email"
            name="email"
            required
            className="nlf-email-input"
            placeholder="your@email.com"
            value={newsletterForm.email}
            onChange={(e) => setNewsletterForm(prev => ({ ...prev, email: e.target.value, error: '' }))}
            disabled={newsletterForm.isLoading}
            autoComplete="email"
          />
          <button type="submit" className="nlf-btn" disabled={newsletterForm.isLoading}>
            {newsletterForm.isLoading ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                Subscribing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                Subscribe
              </>
            )}
          </button>
        </div>

        {/* reCAPTCHA */}
        <div className="nlf-captcha">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            theme="dark"
          />
        </div>

        {/* Success */}
        {newsletterForm.isSubscribed && (
          <div className="nlf-success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            SUBSCRIBED &mdash; check your inbox for confirmation.
          </div>
        )}

        {/* Error */}
        {newsletterForm.error && (
          <div className="nlf-error">{newsletterForm.error}</div>
        )}
      </form>
    </div>
  )
}
