'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default function FloatingContactPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [formData, setFormData] = useState({
    website: '',
    message: '',
    source: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.website || !formData.message) {
      setErrorMessage('Please fill in all required fields.')
      setSubmitStatus('error')
      return
    }

    let recaptchaToken = 'recaptcha_disabled'
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && recaptchaRef.current) {
      const existingToken = recaptchaRef.current.getValue()
      if (!existingToken) {
        setErrorMessage('Please complete the reCAPTCHA verification.')
        setSubmitStatus('error')
        return
      }
      recaptchaToken = existingToken
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          name: 'Quick Contact Form',
          email: 'no-email@provided.com',
          service: 'general-inquiry',
          recaptchaToken
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ website: '', message: '', source: '' })
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
        setTimeout(() => { setSubmitStatus('idle'); setIsOpen(false) }, 3000)
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || 'Something went wrong. Please try again.')
        if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) recaptchaRef.current?.reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePopup = () => {
    if (isMinimized) { setIsMinimized(false); setIsOpen(true) }
    else { setIsOpen(!isOpen) }
  }

  const minimizePopup = () => { setIsMinimized(true); setIsOpen(false) }

  return (
    <>
      <style>{`
        /* FloatingContactPopup (fcp-) */
        @keyframes fcp-in { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:translateY(0) } }

        .fcp-trigger { position:fixed; bottom:1.5rem; left:1.5rem; z-index:50; display:flex; align-items:center; gap:10px; background:var(--ink); color:#fff; border:1px solid rgba(255,255,255,0.12); padding:11px 18px 11px 14px; cursor:pointer; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:600; letter-spacing:-0.01em; transition:background 0.15s, border-color 0.15s; }
        .fcp-trigger:hover { background:var(--blue); border-color:var(--blue); }
        .fcp-trigger-icon { width:28px; height:28px; background:var(--blue); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:background 0.15s; }
        .fcp-trigger:hover .fcp-trigger-icon { background:rgba(255,255,255,0.18); }
        .fcp-trigger-label { display:flex; flex-direction:column; }
        .fcp-trigger-sub { font-family:'JetBrains Mono',monospace; font-size:0.6rem; color:var(--blue-light); letter-spacing:0.08em; text-transform:uppercase; margin-bottom:1px; transition:color 0.15s; }
        .fcp-trigger:hover .fcp-trigger-sub { color:rgba(255,255,255,0.7); }
        .fcp-trigger-arrow { color:rgba(255,255,255,0.35); transition:color 0.15s; }
        .fcp-trigger:hover .fcp-trigger-arrow { color:#fff; }

        .fcp-mini { position:fixed; bottom:1.5rem; left:1.5rem; z-index:50; width:44px; height:44px; background:var(--ink); border:1px solid rgba(255,255,255,0.12); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:background 0.15s; color:#fff; }
        .fcp-mini:hover { background:var(--blue); border-color:var(--blue); }

        .fcp-popup { position:fixed; bottom:1rem; left:1rem; right:1rem; z-index:50; animation:fcp-in 0.25s ease-out; max-width:420px; }
        @media (min-width:540px) { .fcp-popup { left:1.5rem; right:auto; bottom:1.5rem; } }

        .fcp-card { background:var(--white); border:1px solid var(--line); }
        .fcp-head { background:var(--ink); padding:1.1rem 1.25rem; display:flex; align-items:flex-start; justify-content:space-between; border-bottom:1px solid rgba(255,255,255,0.08); }
        .fcp-head-l { display:flex; align-items:center; gap:12px; }
        .fcp-head-icon { width:36px; height:36px; background:var(--blue); display:flex; align-items:center; justify-content:center; flex-shrink:0; color:#fff; }
        .fcp-head-title { font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:700; color:#fff; letter-spacing:-0.02em; margin-bottom:4px; }
        .fcp-head-status { display:flex; align-items:center; gap:6px; font-family:'JetBrains Mono',monospace; font-size:0.65rem; color:#4ade80; letter-spacing:0.06em; text-transform:uppercase; }
        .fcp-head-status-dot { width:5px; height:5px; border-radius:50%; background:#4ade80; }
        .fcp-head-actions { display:flex; gap:4px; }
        .fcp-head-btn { width:28px; height:28px; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.45); background:none; border:none; cursor:pointer; transition:color 0.15s; }
        .fcp-head-btn:hover { color:#fff; }

        .fcp-body { padding:1.25rem; background:var(--white); }
        .fcp-field { margin-bottom:0.75rem; }
        .fcp-label { display:block; font-family:'JetBrains Mono',monospace; font-size:0.65rem; font-weight:600; color:var(--gray-5); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:5px; }
        .fcp-input { width:100%; padding:10px 12px; border:1px solid var(--line); font-family:'Inter',sans-serif; font-size:0.88rem; color:var(--ink); background:var(--white); outline:none; transition:border-color 0.15s; }
        .fcp-input:focus { border-color:var(--blue); }
        .fcp-input::placeholder { color:var(--gray-4); }
        .fcp-textarea { width:100%; padding:10px 12px; border:1px solid var(--line); font-family:'Inter',sans-serif; font-size:0.88rem; color:var(--ink); background:var(--white); outline:none; transition:border-color 0.15s; resize:vertical; min-height:80px; }
        .fcp-textarea:focus { border-color:var(--blue); }
        .fcp-textarea::placeholder { color:var(--gray-4); }
        .fcp-submit { width:100%; background:var(--blue); color:#fff; border:none; padding:12px; font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.15s; margin-top:0.75rem; }
        .fcp-submit:hover { background:var(--blue-dark); }
        .fcp-submit:disabled { background:var(--gray-3); cursor:not-allowed; }
        .fcp-success { background:rgba(22,163,74,0.06); border:1px solid rgba(22,163,74,0.25); padding:12px; margin-bottom:0.75rem; font-family:'Space Grotesk',sans-serif; font-size:0.88rem; font-weight:600; color:#16a34a; display:flex; align-items:center; gap:8px; }
        .fcp-error { background:rgba(220,38,38,0.06); border-left:3px solid var(--red,#dc2626); padding:10px 12px; margin-bottom:0.75rem; font-size:0.82rem; color:var(--red,#dc2626); }
        .fcp-fine { font-family:'JetBrains Mono',monospace; font-size:0.62rem; color:var(--gray-4); letter-spacing:0.04em; margin-top:0.625rem; text-align:center; line-height:1.5; }
      `}</style>

      {/* Floating trigger button */}
      {!isOpen && !isMinimized && (
        <button className="fcp-trigger" onClick={togglePopup} aria-label="Get free performance report">
          <div className="fcp-trigger-icon">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className="fcp-trigger-label">
            <span className="fcp-trigger-sub">FREE TOOL</span>
            <span>Get free performance report</span>
          </div>
          <svg className="fcp-trigger-arrow" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
      )}

      {/* Minimised icon button */}
      {isMinimized && (
        <button className="fcp-mini" onClick={togglePopup} aria-label="Open form">
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </button>
      )}

      {/* Popup form */}
      {isOpen && (
        <div className="fcp-popup">
          <div className="fcp-card">
            {/* Header */}
            <div className="fcp-head">
              <div className="fcp-head-l">
                <div className="fcp-head-icon">
                  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <div className="fcp-head-title">Experience Real Results.</div>
                  <div className="fcp-head-status">
                    <span className="fcp-head-status-dot"/>
                    <span>We&apos;re online now</span>
                  </div>
                </div>
              </div>
              <div className="fcp-head-actions">
                <button className="fcp-head-btn" onClick={minimizePopup} aria-label="Minimise">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
                <button className="fcp-head-btn" onClick={() => setIsOpen(false)} aria-label="Close">
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Form body */}
            <div className="fcp-body">
              {submitStatus === 'success' && (
                <div className="fcp-success">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Thank you! We&apos;ll get back to you soon.
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="fcp-error">{errorMessage}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="fcp-field">
                  <label className="fcp-label" htmlFor="fcp-website">Website URL</label>
                  <input
                    type="url" id="fcp-website" name="website" required
                    className="fcp-input" placeholder="https://yoursite.com"
                    value={formData.website} onChange={handleInputChange}
                  />
                </div>
                <div className="fcp-field">
                  <label className="fcp-label" htmlFor="fcp-message">Tell us about your business</label>
                  <textarea
                    id="fcp-message" name="message" required
                    className="fcp-textarea" placeholder="Goals, current traffic, what&apos;s not working..."
                    value={formData.message} onChange={handleInputChange}
                  />
                </div>
                <div className="fcp-field">
                  <label className="fcp-label" htmlFor="fcp-source">How did you hear about us? <span style={{ fontWeight:400, textTransform:'none', letterSpacing:0 }}>(optional)</span></label>
                  <input
                    type="text" id="fcp-source" name="source"
                    className="fcp-input" placeholder="Google, referral, social..."
                    value={formData.source} onChange={handleInputChange}
                  />
                </div>

                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                  <div style={{ margin:'0.625rem 0', transform:'scale(0.88)', transformOrigin:'left center' }}>
                    <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
                  </div>
                )}

                <button type="submit" disabled={isSubmitting} className="fcp-submit">
                  {isSubmitting ? (
                    <>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                      Sending&hellip;
                    </>
                  ) : (
                    <>
                      Get Started
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </>
                  )}
                </button>

                <p className="fcp-fine">By submitting you agree to receive updates from SEO Shouts.</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
