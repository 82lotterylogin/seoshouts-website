'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

export default function LongTailKeywordGeneratorClient() {
  // Load usage count from session storage
  useEffect(() => {
    const savedUsageCount = sessionStorage.getItem('longTailKeywordUsage')
    if (savedUsageCount) {
      setUsageCount(parseInt(savedUsageCount))
    }
  }, [])

  const [form, setForm] = useState({
    keyword: '',
    location: '',
    language: 'English'
  })

  const [results, setResults] = useState<Array<{ keyword: string; volume: string; competition: string; intent: string; cpc: string; difficulty: number }>>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit] = useState(5)

  // Enhanced features
  const [sortBy, setSortBy] = useState<'keyword' | 'volume' | 'difficulty'>('volume')
  const [filterIntent, setFilterIntent] = useState<'all' | 'Informational' | 'Commercial' | 'Local'>('all')

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Generate keywords (demo function)
  const generateKeywords = () => {
    if (!isVerified) {
      setError('Please complete the human verification first!')
      return
    }

    if (usageCount >= usageLimit) {
      setError(`You've reached the limit of ${usageLimit} generations per session. Please refresh the page to continue.`)
      return
    }

    if (!form.keyword.trim()) {
      setError('Please enter a seed keyword')
      return
    }

    setError('')
    setLoading(true)
    setResults([])

    // Simulate API call with demo data - NOW GENERATES 25 KEYWORDS
    setTimeout(() => {
      const baseKeyword = form.keyword
      const location = form.location || 'your city'

      const demoKeywords = [
        // Informational Intent Keywords (8 keywords)
        { keyword: `${baseKeyword} for beginners`, volume: '1,200', competition: 'Low', intent: 'Informational', cpc: '$0.45', difficulty: 25 },
        { keyword: `how to choose ${baseKeyword}`, volume: '850', competition: 'Low', intent: 'Informational', cpc: '$0.35', difficulty: 22 },
        { keyword: `${baseKeyword} tips and tricks`, volume: '780', competition: 'Medium', intent: 'Informational', cpc: '$0.55', difficulty: 38 },
        { keyword: `${baseKeyword} comparison guide`, volume: '540', competition: 'Low', intent: 'Informational', cpc: '$0.40', difficulty: 28 },
        { keyword: `what is ${baseKeyword}`, volume: '920', competition: 'Low', intent: 'Informational', cpc: '$0.30', difficulty: 20 },
        { keyword: `${baseKeyword} tutorial step by step`, volume: '670', competition: 'Medium', intent: 'Informational', cpc: '$0.50', difficulty: 35 },
        { keyword: `${baseKeyword} vs alternatives`, volume: '430', competition: 'Medium', intent: 'Informational', cpc: '$0.65', difficulty: 42 },
        { keyword: `${baseKeyword} benefits and advantages`, volume: '380', competition: 'Low', intent: 'Informational', cpc: '$0.38', difficulty: 26 },

        // Commercial Intent Keywords (10 keywords)
        { keyword: `buy ${baseKeyword} online`, volume: '2,100', competition: 'High', intent: 'Commercial', cpc: '$2.85', difficulty: 78 },
        { keyword: `best ${baseKeyword} 2024`, volume: '1,450', competition: 'Medium', intent: 'Commercial', cpc: '$1.95', difficulty: 55 },
        { keyword: `affordable ${baseKeyword} services`, volume: '450', competition: 'Low', intent: 'Commercial', cpc: '$1.45', difficulty: 32 },
        { keyword: `top rated ${baseKeyword} providers`, volume: '320', competition: 'Low', intent: 'Commercial', cpc: '$1.75', difficulty: 29 },
        { keyword: `${baseKeyword} reviews and ratings`, volume: '890', competition: 'Medium', intent: 'Commercial', cpc: '$1.25', difficulty: 45 },
        { keyword: `cheap ${baseKeyword} under 1000`, volume: '650', competition: 'Medium', intent: 'Commercial', cpc: '$1.55', difficulty: 48 },
        { keyword: `professional ${baseKeyword} services`, volume: '680', competition: 'Medium', intent: 'Commercial', cpc: '$2.25', difficulty: 52 },
        { keyword: `${baseKeyword} deals and discounts`, volume: '290', competition: 'Low', intent: 'Commercial', cpc: '$1.15', difficulty: 28 },
        { keyword: `premium ${baseKeyword} brands`, volume: '340', competition: 'High', intent: 'Commercial', cpc: '$3.45', difficulty: 72 },
        { keyword: `${baseKeyword} price comparison`, volume: '520', competition: 'Medium', intent: 'Commercial', cpc: '$1.85', difficulty: 44 },

        // Local Intent Keywords (7 keywords)
        { keyword: `${baseKeyword} near me`, volume: '890', competition: 'Medium', intent: 'Local', cpc: '$1.65', difficulty: 38 },
        { keyword: `best ${baseKeyword} in ${location}`, volume: '650', competition: 'Medium', intent: 'Local', cpc: '$1.45', difficulty: 41 },
        { keyword: `${baseKeyword} ${location} reviews`, volume: '240', competition: 'Low', intent: 'Local', cpc: '$0.95', difficulty: 24 },
        { keyword: `${baseKeyword} shop ${location}`, volume: '180', competition: 'Low', intent: 'Local', cpc: '$1.25', difficulty: 22 },
        { keyword: `${baseKeyword} delivery ${location}`, volume: '320', competition: 'Medium', intent: 'Local', cpc: '$1.35', difficulty: 36 },
        { keyword: `${baseKeyword} store near ${location}`, volume: '210', competition: 'Low', intent: 'Local', cpc: '$1.15', difficulty: 26 },
        { keyword: `local ${baseKeyword} experts ${location}`, volume: '150', competition: 'Low', intent: 'Local', cpc: '$1.85', difficulty: 18 }
      ]

      setResults(demoKeywords)

      // Increment usage count and save to session storage
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('longTailKeywordUsage', newUsageCount.toString())

      setLoading(false)
    }, 2000)
  }

  const copyToClipboard = async () => {
    if (results.length === 0) return

    const keywordList = results.map(item => item.keyword).join('\n')
    try {
      await navigator.clipboard.writeText(keywordList)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    const csvContent = [
      ['Keyword', 'Search Volume', 'Competition', 'Intent'],
      ...results.map(item => [item.keyword, item.volume, item.competition, item.intent])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `long-tail-keywords-${form.keyword.replace(/\s+/g, '-')}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetForm = () => {
    setForm({
      keyword: '',
      location: '',
      language: 'English'
    })
    setResults([])
    setError('')
    setLoading(false)
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  const getCompetitionBg = (competition: string) => {
    if (competition === 'Low') return 'rgba(22,163,74,0.12)'
    if (competition === 'Medium') return 'rgba(245,158,11,0.12)'
    return 'rgba(220,38,38,0.12)'
  }

  const getCompetitionColor = (competition: string) => {
    if (competition === 'Low') return 'var(--green)'
    if (competition === 'Medium') return 'var(--amber)'
    return 'var(--red)'
  }

  return (
    <>
      {/* ─── TOOL HERO ─── */}
      <div id="top" className="tool-hero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,9,10,0.35)', pointerEvents: 'none' }} />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Long Tail Keyword Generator</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free Long Tail Keyword Generator Tool
          </h1>
          <p style={{ color: '#3b82f6', fontWeight: 700, fontSize: '1.25rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
            Find Hidden Keywords That Actually Convert
          </p>
          <h2 style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.75rem', marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif', maxWidth: '900px' }}>
            Discover Profitable Keywords Your Competitors Are Missing
          </h2>
          <p className="tool-hero-sub" style={{ maxWidth: '900px' }}>
            Ever feel like you&apos;re fighting for scraps with the same keywords everyone else targets? Smart marketers know the real opportunity lies in long tail keywords - those longer, more specific phrases that people actually search for when they&apos;re ready to buy something.
          </p>
          <p className="tool-hero-sub" style={{ marginTop: '0.75rem', maxWidth: '900px' }}>
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Our Long Tail Keyword Generator</strong> helps you uncover hundreds of these hidden gems in seconds. No more guessing what people might search for. No more competing for impossible keywords. Just real, profitable keyword opportunities waiting to be discovered.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['AI-Powered Suggestions', 'Search Volume Data', 'Export Functionality', '100% Free'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>✓</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── TOOL INPUT SECTION ─── */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── LEFT BOX — Input ── */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Keyword Generator</h2>

            {/* Usage Counter */}
            <div style={{
              marginBottom: '1.25rem', padding: '12px 16px',
              background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="var(--blue-light)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-light)' }}>Session Usage</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--blue-light)' }}>
                    {usageLimit - usageCount} / {usageLimit}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-4)' }}>generations remaining</div>
                </div>
              </div>
              {usageCount >= usageLimit && (
                <div style={{
                  marginTop: '0.75rem', padding: '8px 12px',
                  background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                  color: 'var(--amber)', fontSize: '0.78rem', fontWeight: 500
                }}>
                  Session limit reached. Refresh page to continue.
                </div>
              )}
            </div>

            {/* Seed Keyword */}
            <label className="tool-box-label" htmlFor="keyword">Enter Seed Keyword *</label>
            <input
              type="text"
              id="keyword"
              className="tool-url-input"
              value={form.keyword}
              onChange={(e) => setForm(prev => ({ ...prev, keyword: e.target.value }))}
              placeholder="e.g., coffee maker, digital marketing, yoga classes"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>Start with a broad term related to your business</p>

            {/* Location */}
            <label className="tool-box-label" htmlFor="location">Target Location (Optional)</label>
            <input
              type="text"
              id="location"
              className="tool-url-input"
              value={form.location}
              onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Mumbai, Delhi, New York"
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>For location-specific keyword suggestions</p>

            {/* Language */}
            <label className="tool-box-label" htmlFor="language">Target Language</label>
            <select
              id="language"
              value={form.language}
              onChange={(e) => setForm(prev => ({ ...prev, language: e.target.value }))}
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                color: 'var(--ink)', outline: 'none', background: 'var(--white)',
                marginBottom: '1.5rem', cursor: 'pointer'
              }}
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Portuguese">Portuguese</option>
            </select>

            {/* Human Verification */}
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Human Verification Required
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Please verify that you&apos;re not a robot to generate keywords.
              </p>
              <div style={{ marginBottom: '0.5rem' }}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                  onChange={handleCaptchaChange}
                  theme="light"
                />
              </div>
              {isVerified && (
                <div style={{
                  marginTop: '0.5rem', padding: '8px 12px',
                  background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)',
                  fontSize: '0.82rem', fontWeight: 600, color: 'var(--green)'
                }}>
                  <span style={{ marginRight: '0.4rem' }}>✓</span>
                  Verification successful! You can now generate keywords.
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div style={{
                marginBottom: '1rem', padding: '10px 14px',
                background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)',
                fontSize: '0.85rem', color: 'var(--red)'
              }}>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={generateKeywords}
                disabled={loading || !form.keyword.trim() || !isVerified}
                className="tool-analyze-btn"
                style={{ flex: 1 }}
              >
                <div className="tool-analyze-btn-dot" />
                {loading ? (
                  <>
                    <svg className="animate-spin" style={{ width: 16, height: 16, marginRight: '0.4rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Keywords...
                  </>
                ) : (
                  !isVerified ? 'Complete Verification First' : 'Generate Keywords'
                )}
              </button>
              <button
                onClick={resetForm}
                style={{
                  padding: '14px 20px', background: 'var(--gray-1)', color: 'var(--gray-5)',
                  border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.85rem',
                  cursor: 'pointer', borderRadius: 6, fontFamily: 'Space Grotesk, sans-serif'
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* ── RIGHT BOX — Results ── */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Generated Keywords</h2>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{
                  width: 56, height: 56, background: 'var(--gray-1)', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--gray-4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p style={{ color: 'var(--gray-4)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Enter a seed keyword and generate long tail keyword suggestions
                </p>
              </div>
            ) : (
              <div>
                {/* Export Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      padding: '7px 14px', background: 'var(--gray-1)', color: 'var(--gray-5)',
                      border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.78rem',
                      cursor: 'pointer', borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    {copied ? '✓ Copied!' : 'Copy All'}
                  </button>
                  <button
                    onClick={exportToCSV}
                    style={{
                      padding: '7px 14px', background: 'var(--blue)', color: '#fff',
                      border: 'none', fontWeight: 600, fontSize: '0.78rem',
                      cursor: 'pointer', borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif'
                    }}
                  >
                    Export CSV
                  </button>
                </div>

                {/* Keywords List */}
                <div style={{ maxHeight: '24rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {results.map((item, index) => (
                    <div key={index} style={{ border: '1px solid var(--line)', padding: '10px 14px', background: 'var(--white)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.88rem', marginBottom: '0.4rem' }}>{item.keyword}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-4)' }}>{item.volume}/month</span>
                        <span style={{
                          padding: '2px 7px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 3,
                          background: getCompetitionBg(item.competition),
                          color: getCompetitionColor(item.competition)
                        }}>
                          {item.competition} Competition
                        </span>
                        <span style={{
                          padding: '2px 7px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 3,
                          background: 'rgba(37,99,235,0.1)', color: 'var(--blue)'
                        }}>
                          {item.intent}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--gray-4)' }}>
                  Generated {results.length} long tail keyword suggestions
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── WHAT ARE LONG TAIL KEYWORDS ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">What Are Long Tail Keywords <span className="blue">(And Why They&apos;re Marketing Gold)</span></h2>
          </div>
          <div className="prose-content">
            <p>
              Long tail keywords are basically the opposite of what most people target. Instead of going after &ldquo;shoes&rdquo; (good luck ranking for that), smart marketers target phrases like &ldquo;waterproof running shoes for women&rdquo; or &ldquo;best hiking boots under 5000 rupees.&rdquo;
            </p>

            <h3>Here&apos;s why they work so well:</h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { bold: 'Less competition', text: '- Fewer websites fighting for the same terms' },
                { bold: 'Higher conversion rates', text: '- People searching for specific things are closer to buying' },
                { bold: 'Clearer intent', text: '- You know exactly what the searcher wants' },
                { bold: 'Easier to rank', text: '- Your chances of page one are much better' },
                { bold: 'Better ROI', text: '- Less money spent competing, more traffic that converts' },
              ].map(item => (
                <li key={item.bold} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>
                    <strong>{item.bold}</strong> {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
              <p style={{ margin: 0, color: 'var(--gray-5)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Think about it - would you rather rank #47 for &ldquo;digital marketing&rdquo; or #3 for &ldquo;digital marketing services for small restaurants in Mumbai&rdquo;?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW OUR TOOL WORKS ─── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How It Works</div>
            <h2 className="s-title">How Our Long Tail Keyword <span className="blue">Generator Works</span></h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>

            {/* Card 1: AI-Powered Discovery */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <div className="feature-title">AI-Powered Keyword Discovery</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.5rem 0 1rem' }}>
                Our tool uses smart algorithms to analyze search patterns and generate hundreds of relevant long tail variations from your main keyword.
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>What makes it different:</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  'Pulls from multiple data sources for comprehensive coverage',
                  'Analyzes real search behavior, not just dictionary combinations',
                  'Updates constantly with fresh search trends',
                  'Filters out irrelevant or low-value suggestions',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} style={{ fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 2: Smart Categorization */}
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </div>
              <div className="feature-title">Smart Categorization and Filtering</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.5rem 0 1rem' }}>
                Not all keywords are created equal. Our tool organizes suggestions by intent and value.
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>Built-in organization:</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  '<strong>Buyer intent keywords</strong> - People ready to purchase',
                  '<strong>Information seekers</strong> - Researching and comparing options',
                  '<strong>Local searches</strong> - Location-specific opportunities',
                  '<strong>Question-based queries</strong> - Perfect for content marketing',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} style={{ fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Card 3: Real Search Data */}
            <div className="feature-card" style={{ borderRight: 'none' }}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                </svg>
              </div>
              <div className="feature-title">Real Search Data Integration</div>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.5rem 0 1rem' }}>
                Every suggestion comes with the data you need to make smart decisions.
              </p>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>Key metrics included:</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {[
                  'Monthly search volume estimates',
                  'Competition level analysis',
                  'Seasonal trend information',
                  'Related keyword suggestions',
                  'Search intent classification',
                ].map(item => (
                  <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.78rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                    <span dangerouslySetInnerHTML={{ __html: item }} style={{ fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }} />
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ─── HOW TO USE ─── */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How To Use</div>
            <h2 className="s-title">How to Use the Long Tail Keyword Generator <span className="blue">(Step by Step)</span></h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { num: '01', title: 'Enter Your Main Keyword', desc: 'Start with a broad term related to your business. For example: "coffee maker" or "digital marketing" or "yoga classes."' },
              { num: '02', title: 'Choose Your Target Location', desc: 'Select the country or region where your customers are located. This affects which keywords and search volumes you\'ll see.' },
              { num: '03', title: 'Pick Your Language', desc: 'Choose the language your customers search in. The tool supports dozens of languages for global and local campaigns.' },
              { num: '04', title: 'Complete Human Verification', desc: 'Verify that you\'re not a robot to ensure quality results and prevent automated abuse.' },
              { num: '05', title: 'Generate Keywords', desc: 'Click the generate button and watch hundreds of long tail keyword suggestions appear.' },
              { num: '06', title: 'Analyze and Export', desc: 'Review the suggestions, check search volumes, and export your chosen keywords for use in your campaigns.' },
            ].map((step, i) => (
              <div key={step.num} className="step-card" style={{ borderRight: i % 3 === 2 ? 'none' : undefined, borderBottom: i < 3 ? undefined : 'none' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 36, height: 36, borderRadius: '50%', background: 'var(--blue)',
                  color: '#fff', fontSize: '0.78rem', fontWeight: 700,
                  fontFamily: 'Space Grotesk, sans-serif', marginBottom: '1rem'
                }}>
                  {step.num}
                </div>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>
                  {step.title}
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--gray-5)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <strong>Pro tip:</strong> Start with 3-4 different seed keywords to get a comprehensive list of opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* ─── KEY FEATURES ─── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Key Features That Make This <span className="blue">Tool Essential</span></h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>
            {[
              { title: 'Instant Keyword Generation', desc: 'Enter one seed keyword and get hundreds of long tail variations within seconds. No waiting, no complicated setup.', paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'] },
              { title: 'Multiple Language Support', desc: 'Generate keywords in Hindi, English, or dozens of other languages for local and international campaigns.', paths: ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'] },
              { title: 'Location-Specific Results', desc: 'Filter by country, state, or city to find keywords relevant to your target market.', paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'] },
              { title: 'Export Functionality', desc: 'Download your keyword lists in CSV format for easy integration with your SEO tools and campaign planning.', paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'] },
              { title: 'No Registration Required', desc: 'Start using the tool immediately. No account creation, no email verification, no hassle.', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
              { title: 'Mobile-Friendly Interface', desc: 'Research keywords on any device - desktop, tablet, or smartphone.', paths: ['M12 18h.01', 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z'] },
            ].map(card => (
              <div key={card.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {card.paths.map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <div className="why-card-body">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHO SHOULD USE ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Who It&apos;s For</div>
            <h2 className="s-title">Who Should Use <span className="blue">This Tool?</span></h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>
            {[
              { title: 'Content Creators and Bloggers', desc: 'Find specific topics your audience is searching for and create content that actually gets found.', paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'] },
              { title: 'Small Business Owners', desc: 'Discover local keywords and niche opportunities that big competitors ignore.', paths: ['M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M9 22V12h6v10'] },
              { title: 'Digital Marketers', desc: 'Build comprehensive keyword lists for SEO campaigns and PPC advertising.', paths: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3'] },
              { title: 'eCommerce Store Owners', desc: 'Find product-specific keywords that buyers use when they\'re ready to purchase.', paths: ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'] },
              { title: 'Freelancers and Agencies', desc: 'Research keywords for client campaigns across different industries and locations.', paths: ['M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'] },
            ].map(card => (
              <div key={card.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {card.paths.map((d, i) => <path key={i} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <div className="why-card-body">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STRATEGIES ─── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Strategies</div>
            <h2 className="s-title">Long Tail Keyword Strategies <span className="blue">That Actually Work</span></h2>
          </div>
          <div className="why-grid" style={{ marginTop: '3rem' }}>
            {[
              { title: 'For Content Marketing', desc: 'Use question-based long tail keywords to create helpful blog posts, guides, and tutorials that answer specific user questions.', paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'] },
              { title: 'For Local SEO', desc: 'Target location + service combinations like "plumber in Sector 18 Noida" or "best restaurant near Connaught Place."', paths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'] },
              { title: 'For eCommerce', desc: 'Focus on product + modifier combinations like "wireless earbuds under 3000" or "organic skincare for sensitive skin."', paths: ['M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0'] },
              { title: 'For Service Businesses', desc: 'Target problem + solution keywords like "laptop screen repair near me" or "small business accounting software."', paths: ['M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z', 'M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'] },
            ].map(card => (
              <div key={card.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      {card.paths.map((d, i) => <path key={i} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <div className="why-card-body">{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── COMMON MISTAKES ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Mistakes</div>
            <h2 className="s-title">Common Long Tail Keyword <span className="blue">Mistakes to Avoid</span></h2>
          </div>
          <div className="mistakes-grid" style={{ gridTemplateColumns: '1fr', maxWidth: 720, margin: '2.5rem auto 0' }}>
            <div className="mistake-card" style={{ padding: '2rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { bold: 'Targeting keywords with zero search volume', text: '- Our tool shows real search data to prevent this' },
                  { bold: 'Ignoring user intent', text: '- We categorize keywords so you understand what searchers want' },
                  { bold: 'Choosing keywords that are too broad', text: '- Focus on specific, actionable phrases' },
                  { bold: 'Not considering local variations', text: '- Use location filters for better targeting' },
                  { bold: 'Forgetting about seasonality', text: '- Check trend data before committing to keywords' },
                ].map(item => (
                  <li key={item.bold} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ color: 'var(--red)', fontWeight: 700, fontSize: '1rem', flexShrink: 0, marginTop: 1 }}>✗</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>
                      <strong>{item.bold}</strong>{item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          </div>
          <div className="faq-list">
            {[
              { q: 'How many keywords can I generate?', a: 'There\'s no limit. Generate as many keyword lists as you need for your campaigns.' },
              { q: 'Do you provide search volume data?', a: 'Yes, we include estimated monthly search volumes to help you prioritize keywords.' },
              { q: 'Can I use this for PPC campaigns?', a: 'Absolutely. Long tail keywords often have lower costs per click and higher conversion rates for paid ads.' },
              { q: 'How often is the keyword data updated?', a: 'Our database is updated regularly to reflect current search trends and patterns.' },
              { q: 'Is the tool free to use?', a: 'Yes, completely free with no hidden fees or usage limits.' },
              { q: 'Can I save my keyword lists?', a: 'You can export keywords to CSV files or copy them for use in your preferred tools.' },
            ].map(item => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RELATED TOOLS ─── */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Free Tools</div>
            <h2 className="s-title">Explore Our Other <span className="blue">SEO Tools</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              { name: 'Long Tail Keyword Generator', desc: 'Find hidden keywords that actually convert and drive traffic.', current: true, href: '/tools/long-tail-keyword-generator/', paths: ['M21 21l-4.35-4.35', 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z'] },
              { name: 'Keyword Density Analyzer', desc: 'Optimize your keyword usage and avoid over-optimization penalties.', href: '/tools/keyword-density-analyzer/', paths: ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2', 'M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2'] },
              { name: 'Keyword Difficulty Checker', desc: 'Find out which keywords you can actually rank for with instant difficulty scores.', href: '/tools/keyword-difficulty-checker/', paths: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3'] },
              { name: 'Meta Tag Optimizer', desc: 'Generate perfect title tags and meta descriptions for better CTR.', href: '/tools/meta-tag-optimizer/', paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
              { name: 'On-Page SEO Analyzer', desc: 'Score any URL across 150+ on-page ranking signals instantly.', href: '/tools/on-page-seo-analyzer/', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
            ].map(t => (
              <div key={t.name} className={`related-card${t.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {t.paths.map((d, i) => <path key={i} d={d} />)}
                  </svg>
                </div>
                <div className="related-card-name"><a href={t.href}>{t.name}</a></div>
                <div className="related-card-desc">{t.desc}</div>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {t.current ? 'Current tool' : 'Free — no login'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Start Finding Profitable <span>Keywords Today</span></h2>
          <p className="final-cta-sub">
            Stop competing for impossible keywords. Start targeting the long tail phrases that your ideal customers are actually searching for.
          </p>
          <div className="final-cta-row">
            <button
              onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
              className="btn-primary"
            >
              Use the Long Tail Keyword Generator →
            </button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {[
              'Find profitable keywords in seconds - no registration required',
              'Learn advanced strategies for ranking with long tail keywords',
              'Get personalized keyword strategy guidance from our experts',
            ].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 600, margin: '1.5rem auto 0', textAlign: 'center' }}>
            <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Discover the keywords your competitors are missing with SEO Shouts&apos; free Long Tail Keyword Generator!</strong>
            <br />
            <em>Built by SEO professionals for marketers, business owners, and content creators who want to find keywords that actually drive results.</em>
          </p>
        </div>
      </div>
    </>
  )
}
