'use client'
import { useState, useEffect, useRef } from 'react'
import ShapeGrid from './ShapeGrid'

function useCounter(target: number, duration: number, go: boolean) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!go) return
    let start: number | null = null
    const frame = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setV(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(frame)
      else setV(target)
    }
    requestAnimationFrame(frame)
  }, [go, target, duration])
  return v
}

const WORDS = ['Rankings', 'Revenue', 'Results']

export default function HeroSection() {
  const [started, setStarted] = useState(false)
  const [url, setUrl] = useState('')
  const [analyzed, setAnalyzed] = useState(false)
  const [wordIdx, setWordIdx] = useState(0)
  const [fading, setFading] = useState(false)

  const years = useCounter(10, 1600, started)
  const tools = useCounter(18, 1400, started)
  const perc = useCounter(150, 2000, started)

  useEffect(() => {
    const t1 = setTimeout(() => setStarted(true), 200)
    const t2 = setInterval(() => {
      setFading(true)
      setTimeout(() => { setWordIdx(i => (i + 1) % 3); setFading(false) }, 300)
    }, 3000)
    return () => { clearTimeout(t1); clearInterval(t2) }
  }, [])

  const handleAnalyze = () => {
    if (url.trim()) {
      window.location.href = `/tools/on-page-seo-analyzer/?url=${encodeURIComponent(url.trim())}`
    }
  }

  return (
    <section style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Animated grid background */}
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'all', overflow: 'hidden' }}>
        <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
      </div>

      {/* Vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 70% at 50% 50%, transparent 20%, rgba(8,9,10,0.7) 100%)', pointerEvents: 'none', zIndex: 1 }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '130px 2rem 80px', maxWidth: 1360, margin: '0 auto' }}>
        {/* Label */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(37,99,235,0.4)', padding: '6px 14px', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--blue-light)', marginBottom: '2.2rem' }}>
          <span style={{ width: 5, height: 5, background: 'var(--blue-light)', animation: 'blink 1.8s infinite', display: 'inline-block' }} />
          Professional SEO &amp; Free Tools · Founded 2014
        </div>

        {/* H1 */}
        <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(3rem, 5.5vw, 6.5rem)', fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.05, letterSpacing: '-0.035em', maxWidth: 1000 }}>
          SEOShouts Complete SEO
          <span style={{ display: 'block', color: 'var(--blue)' }}>Solutions</span>
        </h1>

        {/* Sub */}
        <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 580, lineHeight: 1.7, marginTop: '1.75rem', fontWeight: 400, animation: 'fiu 0.6s 0.16s ease both' }}>
          From <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>free SEO analysis</strong> to{' '}
          <strong style={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>professional SEO services</strong> — everything you need to dominate search rankings and grow your business.
        </p>

        {/* URL Analyzer Box */}
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', marginTop: '2.5rem', maxWidth: 700, width: '100%', animation: 'fiu 0.6s 0.24s ease both' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--gray-4)', marginBottom: '1rem' }}>
            Step 1: Analyze your website
          </div>
          {analyzed ? (
            <div style={{ background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.4)', padding: '14px 18px', color: '#93c5fd', fontSize: '0.88rem', fontWeight: 600 }}>
              ✓ Analyzing {url} — redirecting to report...
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 0 }}>
              <input
                type="text"
                placeholder="Enter your website URL (e.g. yoursite.com)"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAnalyze()}
                style={{ flex: 1, background: 'var(--ink-3)', border: '1px solid rgba(255,255,255,0.12)', borderRight: 'none', color: '#fff', fontSize: '0.95rem', padding: '14px 18px', fontFamily: 'Inter, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => { (e.target as HTMLInputElement).style.borderColor = 'var(--blue)' }}
                onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
              />
              <button
                onClick={handleAnalyze}
                style={{ background: 'var(--blue)', color: '#fff', fontSize: '0.9rem', fontWeight: 700, padding: '14px 28px', border: 'none', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '-0.01em', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = 'var(--blue-dark)' }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'var(--blue)' }}
              >
                Get Free Report
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            {['SEO Score Analysis', 'Core Web Vitals Check', 'Optimization Suggestions', '100% Free & Secure'].map(tag => (
              <span key={tag} style={{ fontSize: '0.72rem', color: 'var(--gray-5)', display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ color: 'var(--blue-light)', fontWeight: 700 }}>✓</span> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0, marginTop: '3.5rem', border: '1px solid rgba(255,255,255,0.08)', animation: 'fiu 0.6s 0.32s ease both', width: '100%', maxWidth: 700 }}>
          {[
            { num: `${years}`, sfx: '+', label: 'Years of Experience' },
            { num: `${tools}+`, sfx: '', label: 'Free SEO Tools' },
            { num: '#1', sfx: '', label: 'Internal Link Checker' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, padding: '1.5rem 2rem', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.4rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>
                {s.num}
                {s.sfx && <sup style={{ fontSize: '1.2rem', color: 'var(--blue)' }}>{s.sfx.replace('%', '')}</sup>}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: 4, letterSpacing: '0.03em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
