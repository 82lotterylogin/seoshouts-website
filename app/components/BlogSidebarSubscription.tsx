'use client'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function BlogSidebarSubscription() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [error, setError] = useState('')

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError('Please enter your email address')
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSubscribed(true)
        setEmail('')
        recaptchaRef.current?.reset()
        setTimeout(() => setIsSubscribed(false), 5000)
      } else {
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed. Please try again.')
      recaptchaRef.current?.reset()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="news-card">
      <div className="news-grid-bg" />
      <div className="news-inner">
        <div className="news-head">
          <div className="news-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <div>
            <h3>Stay Ahead in SEO</h3>
            <div className="joined">// JOIN SEO PROFESSIONALS</div>
          </div>
        </div>

        <p className="news-desc">
          Get exclusive insights, advanced strategies, and industry updates delivered weekly. No fluff, just actionable SEO tactics that work.
        </p>

        <form className="news-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            disabled={isLoading}
            required
          />

          {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
            <div style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                theme="dark"
                size="normal"
              />
            </div>
          )}

          <button type="submit" className="news-submit" disabled={isLoading}>
            {isLoading ? 'Subscribing...' : (
              <>
                Subscribe Free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>

          <p className="news-fineprint">
            By clicking &ldquo;Subscribe&rdquo; I agree and accept the{' '}
            <a href="/privacy-policy/">privacy policy</a> of SEOShouts.
          </p>

          {isSubscribed && (
            <div className="news-success">✓ You&apos;re subscribed! Welcome aboard.</div>
          )}
          {error && (
            <div className="news-error">{error}</div>
          )}
        </form>

      </div>
    </div>
  )
}
