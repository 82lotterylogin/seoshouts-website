'use client'
import { useState, useEffect } from 'react'

export default function SiteCookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const sessionConsent = sessionStorage.getItem('cookieConsentSession')
    const permanentConsent = localStorage.getItem('cookieConsent')
    if (!sessionConsent && !permanentConsent) setShow(true)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShow(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleAccept = () => {
    setShow(false)
    sessionStorage.setItem('cookieConsentSession', 'accepted')
    localStorage.setItem('cookieConsent', 'accepted')
  }
  const handleDecline = () => {
    setShow(false)
    sessionStorage.setItem('cookieConsentSession', 'declined')
    localStorage.setItem('cookieConsent', 'declined')
  }

  if (!show) return null

  return (
    <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: 320, zIndex: 9999 }}>
      <div style={{ background: 'var(--ink-2)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.5rem', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', position: 'relative' }}>
        <button
          onClick={() => { setShow(false); sessionStorage.setItem('cookieConsentSession', 'closed') }}
          style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', color: 'var(--gray-4)', cursor: 'pointer', lineHeight: 1 }}
          aria-label="Close"
        >✕</button>
        <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>We value your privacy</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--gray-4)', lineHeight: 1.6, marginBottom: '1rem' }}>
          This website uses cookies to improve user experience. Read our{' '}
          <a href="/privacy-policy/" style={{ color: 'var(--blue-light)', textDecoration: 'underline' }}>Privacy Policy</a>.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleAccept} style={{ flex: 1, background: 'var(--blue)', color: '#fff', border: 'none', padding: '8px 0', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Accept All
          </button>
          <button onClick={handleDecline} style={{ flex: 1, background: 'none', color: 'var(--gray-4)', border: '1px solid rgba(255,255,255,0.15)', padding: '8px 0', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Decline
          </button>
        </div>
      </div>
    </div>
  )
}
