'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

/* ─── Micro icons ─────────────────────────────────────────────────────────── */
function IconMail() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}
function IconGlobe() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}
function IconCheck() {
  return (
    <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}
function IconArrow() {
  return (
    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
    </svg>
  )
}

/* ─── Styles ──────────────────────────────────────────────────────────────── */
const CSS = `
.hqf-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 0.85rem;
}
.hqf-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fff;
}
.hqf-input {
  width: 100%;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.18);
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  padding: 9px 12px;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}
.hqf-input::placeholder { color: rgba(255,255,255,0.45); }
.hqf-input:focus { border-color: rgba(37,99,235,0.6); background: rgba(37,99,235,0.06); }
.hqf-captcha-wrap {
  margin-bottom: 0.85rem;
  transform: scale(0.82);
  transform-origin: left top;
  height: 62px;
  overflow: hidden;
}
.hqf-btn {
  width: 100%;
  background: var(--blue, #2563eb);
  color: #fff;
  border: none;
  padding: 10px 18px;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.15s, opacity 0.15s;
}
.hqf-btn:hover:not(:disabled) { background: #1d4ed8; }
.hqf-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.hqf-err {
  font-size: 0.72rem;
  color: #f87171;
  margin-top: -0.4rem;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.03em;
}
.hqf-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  text-align: center;
}
.hqf-success-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.01em;
}
.hqf-success-sub {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.5;
  font-family: 'Inter', sans-serif;
}
`

/* ─── Component ───────────────────────────────────────────────────────────── */
export default function HeroQuoteForm() {
  const [email, setEmail]     = useState('')
  const [website, setWebsite] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)
  const [error, setError]     = useState('')
  const recaptchaRef          = useRef<ReCAPTCHA>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) { setError('Email address is required.'); return }
    if (!website.trim()) { setError('Website URL is required.'); return }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) { setError('Please complete the captcha.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/inquiry-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), website: website.trim(), recaptchaToken }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed.')
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      recaptchaRef.current?.reset()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="phero-card">
        {/* ── Header ── */}
        <div className="phero-card-head">
          <span className="phero-card-title">request-a-quote.form</span>
          <span className="phero-card-live">
            <span className="live-dot" />FREE
          </span>
        </div>

        {/* ── Body ── */}
        <div className="phero-card-body" style={{ padding: '1rem 1.25rem 1rem' }}>
          {done ? (
            <div className="hqf-success">
              <IconCheck />
              <div className="hqf-success-title">Request Received!</div>
              <div className="hqf-success-sub">
                We&apos;ll review your site and send a free proposal within 24 hours.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <div className="hqf-field">
                <label className="hqf-label">
                  <IconMail /> Email Address
                </label>
                <input
                  className="hqf-input"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              {/* Website */}
              <div className="hqf-field">
                <label className="hqf-label">
                  <IconGlobe /> Website URL
                </label>
                <input
                  className="hqf-input"
                  type="url"
                  placeholder="https://yoursite.com"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  autoComplete="url"
                  required
                />
              </div>

              {/* reCAPTCHA */}
              <div className="hqf-captcha-wrap">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  theme="dark"
                />
              </div>

              {/* Error */}
              {error && <p className="hqf-err">⚠ {error}</p>}

              {/* Submit */}
              <button className="hqf-btn" type="submit" disabled={loading}>
                {loading ? 'Sending…' : <>Get Free Proposal <IconArrow /></>}
              </button>
            </form>
          )}
        </div>

        {/* ── Footer stats ── */}
        <div className="map-card-foot">
          <div className="pcf-cell">
            <div className="pcf-num">13+</div>
            <div className="pcf-label">Yrs Experience</div>
          </div>
          <div className="pcf-cell">
            <div className="pcf-num">Free</div>
            <div className="pcf-label">No Obligation</div>
          </div>
          <div className="pcf-cell">
            <div className="pcf-num">24h</div>
            <div className="pcf-label">Response Time</div>
          </div>
        </div>
      </div>
    </>
  )
}
