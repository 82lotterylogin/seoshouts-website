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
    <div className="ba-inline-news">
      <div className="ba-inline-news-l">
        <span className="ba-inline-news-tag">Newsletter</span>
        <h4>Get More SEO Insights</h4>
        <p>Join 10,000+ marketers receiving weekly SEO strategies and tips directly in their inbox.</p>
      </div>
      <div className="ba-inline-news-r">
        {formData.isSubscribed ? (
          <div className="ba-inline-news-success">
            &#10003; You&apos;re subscribed! Welcome aboard.
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value, error: '' }))}
              disabled={formData.isLoading}
              required
            />
            <div style={{ transform: 'scale(0.75)', transformOrigin: 'left center', marginBottom: '-12px' }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                theme="dark"
                size="normal"
              />
            </div>
            <button type="submit" disabled={formData.isLoading}>
              {formData.isLoading ? 'Subscribing…' : (
                <>
                  Subscribe Free
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </>
              )}
            </button>
            {formData.error && <div className="ba-inline-news-error">{formData.error}</div>}
          </form>
        )}
        <div className="ba-inline-news-trust">
          <span className="ck">&#10003;</span><span>No spam, ever</span>
          <span className="ck">&#10003;</span><span>Unsubscribe anytime</span>
          <span className="ck">&#10003;</span><span>Expert SEO tips</span>
        </div>
      </div>
    </div>
  )
}
