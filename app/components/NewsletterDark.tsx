'use client'
import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function NewsletterDark() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Please enter your email address'); return }
    const token = recaptchaRef.current?.getValue()
    if (!token) { setError('Please complete the reCAPTCHA verification'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken: token }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSubscribed(true)
        setEmail('')
        recaptchaRef.current?.reset()
        setTimeout(() => setSubscribed(false), 5000)
      } else {
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Subscription failed. Please try again.')
      recaptchaRef.current?.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section style={{ background: 'var(--ink)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: 1360, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left */}
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--blue-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 24, height: 2, background: 'var(--blue-light)', flexShrink: 0, display: 'inline-block' }} />
              Newsletter
            </div>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>
              Weekly SEO insights.{' '}
              <span style={{ color: 'var(--blue)' }}>Stay ahead.</span>
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--gray-4)', lineHeight: 1.7 }}>
              Join 10,000+ SEO professionals getting exclusive strategies, algorithm updates, and tool announcements every week — free.
            </p>
          </div>

          {/* Right — Form */}
          <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                disabled={loading}
                required
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.9rem', padding: '13px 16px', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                onFocus={e => (e.target.style.borderColor = 'var(--blue)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} theme="dark" />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ background: 'var(--blue)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, padding: '13px 22px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', opacity: loading ? 0.7 : 1, transition: 'background 0.2s' }}
                onMouseEnter={e => !loading && ((e.target as HTMLButtonElement).style.background = 'var(--blue-dark)')}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'var(--blue)' }}
              >
                {loading ? 'Subscribing...' : 'Subscribe Free — No Spam'}
              </button>

              <p style={{ fontSize: '0.72rem', color: 'var(--gray-5)' }}>Join 10,000+ professionals. Unsubscribe anytime.</p>

              {subscribed && (
                <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.35)', padding: '14px 16px', color: '#93c5fd', fontWeight: 600, fontSize: '0.88rem' }}>
                  ✓ You&#39;re subscribed! Check your inbox to confirm.
                </div>
              )}
              {error && (
                <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', padding: '14px 16px', color: '#fca5a5', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
