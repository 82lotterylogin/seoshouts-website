'use client'

import { useState, useRef, useEffect } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--gray-3)',
  padding: '8px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.88rem',
  color: 'var(--ink)',
  outline: 'none',
  background: 'var(--white)',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--gray-3)',
  padding: '8px 12px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '0.88rem',
  color: 'var(--ink)',
  outline: 'none',
  background: 'var(--white)',
  appearance: 'none' as const,
  cursor: 'pointer',
}

export default function AICopywriterClient() {
  const [formData, setFormData] = useState({
    productDescription: '',
    targetAudience: '',
    copyType: 'Ad',
    tone: 'Professional',
    framework: '',
    keywords: '',
    numberOfVariations: 3,
    isLoading: false,
    error: '',
    results: null as any,
  })

  const [usageInfo, setUsageInfo] = useState({
    usageCount: 0,
    maxUsage: 5,
    isLimitReached: false,
  })

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsage = localStorage.getItem('ai-copywriter-usage')
      const currentUsage = storedUsage ? parseInt(storedUsage) : 0
      setUsageInfo({
        usageCount: currentUsage,
        maxUsage: 5,
        isLimitReached: currentUsage >= 5,
      })
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const generateCopy = async () => {
    if (formData.isLoading) return

    if (usageInfo.isLimitReached) {
      setFormData((prev) => ({ ...prev, error: 'Daily usage limit reached. Please try again tomorrow.' }))
      return
    }

    if (!formData.productDescription.trim()) {
      setFormData((prev) => ({ ...prev, error: 'Please provide a product or service description.' }))
      return
    }

    setFormData((prev) => ({ ...prev, isLoading: true, error: '', results: null }))

    try {
      const response = await fetch('/api/ai-copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDescription: formData.productDescription,
          targetAudience: formData.targetAudience,
          copyType: formData.copyType,
          tone: formData.tone,
          framework: formData.framework,
          keywords: formData.keywords,
          numberOfVariations: formData.numberOfVariations,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setFormData((prev) => ({ ...prev, results: data, isLoading: false }))
        const newUsageCount = usageInfo.usageCount + 1
        localStorage.setItem('ai-copywriter-usage', newUsageCount.toString())
        setUsageInfo((prev) => ({
          ...prev,
          usageCount: newUsageCount,
          isLimitReached: newUsageCount >= 5,
        }))
      } else {
        throw new Error(data.error || 'Failed to generate copy')
      }
    } catch (error: any) {
      setFormData((prev) => ({
        ...prev,
        error: error.message || 'Something went wrong. Please try again.',
        isLoading: false,
      }))
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    })
  }

  const copyTypes = [
    { value: 'Ad', label: 'Advertisement Copy' },
    { value: 'Product', label: 'Product Description' },
    { value: 'Email', label: 'Email Marketing' },
    { value: 'Social', label: 'Social Media Post' },
    { value: 'Blog', label: 'Blog Post Intro' },
    { value: 'Landing', label: 'Landing Page Copy' },
    { value: 'Sales', label: 'Sales Page' },
    { value: 'PPC', label: 'PPC Ad Copy' },
  ]

  const toneOptions = [
    'Professional',
    'Friendly',
    'Persuasive',
    'Urgent',
    'Casual',
    'Authoritative',
    'Emotional',
    'Informative',
  ]

  const usagePct = Math.min((usageInfo.usageCount / usageInfo.maxUsage) * 100, 100)

  return (
    <>
      {/* ── HERO ── */}
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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>AI Copywriter</span>
          </nav>
          <div className="tool-hero-badge">Free AI Tool</div>
          <h1 className="tool-hero-h1">
            Free AI <span>Copywriter</span>
          </h1>
          <p className="tool-hero-sub">
            Write like a pro in seconds. Generate high-converting ad copy, product descriptions, emails, and
            marketing content using proven frameworks &mdash; with multiple variations for A/B testing, no
            experience required.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['AI-Powered Generation', 'Multiple Variations', '8+ Copy Types', '100% Free'].map((label) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TOOL ── */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: Form */}
          <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>

            {/* Usage strip */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.65rem 1.5rem',
              borderBottom: '1px solid var(--line)',
              background: 'var(--gray-1)',
            }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Daily Usage
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '72px', height: '3px', background: 'var(--line)', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: `${usagePct}%`,
                    height: '100%',
                    background: usageInfo.isLimitReached ? 'var(--red)' : 'var(--green)',
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--mono, monospace)',
                  color: usageInfo.isLimitReached ? 'var(--red)' : 'var(--green)',
                  fontWeight: 700,
                }}>
                  {usageInfo.usageCount}/{usageInfo.maxUsage}
                </span>
              </div>
            </div>

            <div style={{ padding: '2rem 2rem 2rem' }}>
              <h2 className="tool-box-heading">Copy Details</h2>
              <p className="tool-box-sub">Describe your product and configure the tone and copy type below.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Product / Service Description */}
                <div>
                  <label className="tool-box-label">Product / Service Description *</label>
                  <textarea
                    value={formData.productDescription}
                    onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                    rows={4}
                    placeholder="Describe what you're promoting. Include key features, benefits, and unique selling points..."
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '96px' }}
                  />
                </div>

                {/* Target Audience */}
                <div>
                  <label className="tool-box-label">Target Audience</label>
                  <input
                    type="text"
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                    placeholder="e.g., small business owners, fitness enthusiasts, students..."
                    style={inputStyle}
                  />
                </div>

                {/* Copy Type + Tone */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label className="tool-box-label">Copy Type</label>
                    <select
                      value={formData.copyType}
                      onChange={(e) => setFormData({ ...formData, copyType: e.target.value })}
                      style={selectStyle}
                    >
                      {copyTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="tool-box-label">Tone</label>
                    <select
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      style={selectStyle}
                    >
                      {toneOptions.map((tone) => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <label className="tool-box-label">Keywords to Include</label>
                  <input
                    type="text"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="important keywords, separated by commas"
                    style={inputStyle}
                  />
                </div>

                {/* Number of Variations */}
                <div>
                  <label className="tool-box-label">
                    Number of Variations: {formData.numberOfVariations}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={formData.numberOfVariations}
                    onChange={(e) => setFormData({ ...formData, numberOfVariations: parseInt(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--blue)', marginTop: '0.25rem' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <span key={n} style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-4)' }}>{n}</span>
                    ))}
                  </div>
                </div>

                {/* Error */}
                {formData.error && (
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderLeft: '3px solid var(--red)',
                    background: 'rgba(220,38,38,0.05)',
                    fontSize: '0.875rem',
                    color: 'var(--red)',
                    lineHeight: 1.5,
                  }}>
                    {formData.error}
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={generateCopy}
                  disabled={formData.isLoading || usageInfo.isLimitReached}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    opacity: (formData.isLoading || usageInfo.isLimitReached) ? 0.6 : 1,
                    cursor: (formData.isLoading || usageInfo.isLimitReached) ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {formData.isLoading ? (
                    <>
                      <svg
                        width={16} height={16} viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
                        style={{ animation: 'spin 0.8s linear infinite' }}
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Generating Copy&hellip;
                    </>
                  ) : (
                    <>
                      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      Generate Copy
                    </>
                  )}
                </button>

                {usageInfo.isLimitReached && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--red)', textAlign: 'center', fontFamily: 'var(--mono, monospace)', marginTop: '-0.5rem' }}>
                    Daily limit reached. Try again tomorrow.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div className="tool-box" style={{ maxWidth: 'none', padding: 0, position: 'sticky', top: '6rem' }}>

            {/* Panel header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.65rem 1.5rem',
              borderBottom: '1px solid var(--line)',
              background: 'var(--gray-1)',
            }}>
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Generated Copy
              </span>
              {formData.results && (
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--green)', fontWeight: 700 }}>
                  {formData.results.variations?.length} variation{formData.results.variations?.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {formData.results ? (
              <div style={{ maxHeight: '520px', overflowY: 'auto' }}>
                {formData.results.variations?.map((variation: any, index: number) => (
                  <div key={index} style={{ borderBottom: '1px solid var(--line)' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.55rem 1.25rem',
                      borderBottom: '1px solid var(--line)',
                      background: 'var(--gray-1)',
                    }}>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Variation {index + 1}
                      </span>
                      <button
                        onClick={() => copyToClipboard(variation.copy, index)}
                        style={{
                          padding: '0.3rem 0.75rem',
                          border: '1px solid var(--line)',
                          background: copiedIndex === index ? 'var(--green)' : 'var(--white)',
                          color: copiedIndex === index ? 'var(--white)' : 'var(--ink)',
                          fontSize: '0.72rem',
                          fontFamily: 'var(--mono, monospace)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.15s',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {copiedIndex === index ? '✓ Copied!' : 'Copy'}
                      </button>
                    </div>
                    <div style={{ padding: '1.25rem 1.5rem' }}>
                      <p style={{ color: 'var(--ink)', lineHeight: 1.75, fontSize: '0.875rem', whiteSpace: 'pre-wrap', margin: 0 }}>
                        {variation.copy}
                      </p>
                    </div>
                  </div>
                ))}

                {formData.results.tips && formData.results.tips.length > 0 && (
                  <div style={{ borderTop: '3px solid var(--blue)' }}>
                    <div style={{
                      padding: '0.55rem 1.25rem',
                      borderBottom: '1px solid var(--line)',
                      background: 'var(--gray-1)',
                    }}>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Copywriting Tips
                      </span>
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: '1rem 1.5rem' }}>
                      {formData.results.tips.map((tip: string, i: number) => (
                        <li key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem 0', fontSize: '0.825rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>
                          <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700 }}>→</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48,
                  background: 'var(--blue-pale)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}>
                  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <p style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>
                  Ready to generate copy
                </p>
                <p style={{ color: 'var(--gray-4)', fontSize: '0.8rem', fontFamily: 'var(--mono, monospace)' }}>
                  Fill in the details and click &ldquo;Generate Copy&rdquo;
                </p>
                {formData.isLoading && (
                  <p style={{ marginTop: '1.25rem', color: 'var(--gray-4)', fontSize: '0.78rem', fontFamily: 'var(--mono, monospace)' }}>
                    Generating&hellip;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── ABOUT ── white (prose-section default) */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Write Like a Pro in Seconds</h2>
            <p className="s-sub">AI-generated copy using proven frameworks — ready to customize and deploy.</p>
          </div>
          <div className="prose-content reveal">
            <h3>Generate High-Converting Copy with AI</h3>
            <p>
              Create compelling ad copy, product descriptions, emails, and marketing content that converts. Our AI
              uses proven copywriting frameworks to generate multiple variations for A/B testing.
            </p>
            <p>
              Perfect for marketers, business owners, and content creators who need professional copy fast. No
              experience required &mdash; just describe your product and let AI do the rest.
            </p>
          </div>
        </div>
      </section>

      {/* ── USE CASES ── gray (features-section default) */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Perfect for Every Marketing Need</h2>
          </div>
          <div className="features-grid">
            {[
              {
                title: 'Social Media Ads',
                desc: 'Create engaging Facebook, Instagram, and LinkedIn ad copy that stops the scroll and drives clicks.',
                paths: [
                  'M18 5a3 3 0 100-6 3 3 0 000 6zM6 12a3 3 0 100-6 3 3 0 000 6zM18 19a3 3 0 100-6 3 3 0 000 6z',
                  'M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49',
                ],
              },
              {
                title: 'Email Marketing',
                desc: 'Generate compelling email subject lines and body content that increase open rates and conversions.',
                paths: [
                  'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z',
                  'M22 6l-10 7L2 6',
                ],
              },
              {
                title: 'Product Descriptions',
                desc: 'Write persuasive product descriptions that highlight benefits and drive sales conversions.',
                paths: [
                  'M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z',
                  'M7 7h.01',
                ],
              },
              {
                title: 'Landing Pages',
                desc: 'Craft high-converting landing page copy that captures leads and maximizes conversion rates.',
                paths: [
                  'M3 3h18v18H3V3z',
                  'M3 9h18',
                  'M9 21V9',
                ],
              },
              {
                title: 'Google Ads',
                desc: 'Create compelling PPC ad headlines and descriptions that improve Quality Score and CTR.',
                paths: [
                  'M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35',
                  'M11 8v6M8 11h6',
                ],
              },
              {
                title: 'Sales Pages',
                desc: 'Generate persuasive sales copy that addresses pain points and drives purchase decisions.',
                paths: [
                  'M23 6L13.5 15.5l-5-5L1 18',
                  'M17 6h6v6',
                ],
              },
            ].map((f) => (
              <div key={f.title} className="feature-card reveal">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    {f.paths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.65, marginTop: '0.5rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── white (howto-section default) */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">How Our AI Copywriter Works</h2>
            <p className="s-sub">Advanced context analysis and proven copywriting frameworks, running in seconds.</p>
          </div>
          <div className="steps-grid reveal" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              {
                n: '01',
                title: 'Smart Context Analysis',
                desc: 'Our AI analyzes your product description, target audience, and desired tone to understand the context perfectly.',
              },
              {
                n: '02',
                title: 'Conversion-Focused Generation',
                desc: 'Uses proven copywriting frameworks like AIDA, PAS, and Before-After-Bridge to create persuasive content.',
              },
              {
                n: '03',
                title: 'Multiple Variations',
                desc: 'Generates multiple copy variations so you can A/B test and choose the best performing version.',
              },
            ].map((s, i) => (
              <div key={s.n} className="step-card">
                {i < 2 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                <div className="step-num-big">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>

          {/* Copy Types We Support */}
          <div
            className="reveal"
            style={{
              marginTop: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              border: '1px solid var(--line)',
              background: 'var(--white)',
            }}
          >
            {[
              { type: 'Social Media Ads', sub: 'Facebook, Instagram' },
              { type: 'Email Marketing', sub: 'Subject lines & body' },
              { type: 'Product Copy', sub: 'Descriptions & features' },
              { type: 'Landing Pages', sub: 'Headlines & CTAs' },
              { type: 'PPC Ads', sub: 'Google & Bing Ads' },
            ].map((item, i) => (
              <div key={item.type} style={{
                padding: '1.1rem 0.75rem',
                borderRight: i < 4 ? '1px solid var(--line)' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '0.2rem' }}>
                  {item.type}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-4)', fontFamily: 'Inter, sans-serif' }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRO TIPS ── gray (why-section default) */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Pro Copywriting Tips</h2>
            <p className="s-sub">Apply these principles to improve AI output and write copy that consistently converts.</p>
          </div>
          <div className="why-grid reveal" style={{ marginTop: '3rem' }}>
            <div className="why-card" style={{ borderTop: '3px solid var(--green)' }}>
              <div className="why-card-title">
                <div className="why-card-icon" style={{ background: 'var(--green)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                High-Converting Elements
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-5)', lineHeight: 1.7 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'Strong, benefit-focused headlines that grab attention',
                    'Clear value proposition that addresses pain points',
                    'Compelling call-to-action with urgency or scarcity',
                    'Social proof and testimonials for credibility',
                  ].map((item) => (
                    <li key={item} style={{ display: 'flex', gap: '0.5rem', padding: '0.3rem 0', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0, lineHeight: 1.7 }}>+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="why-card" style={{ borderTop: '3px solid var(--red)' }}>
              <div className="why-card-title">
                <div className="why-card-icon" style={{ background: 'var(--red)' }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </div>
                Common Mistakes to Avoid
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--gray-5)', lineHeight: 1.7 }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'Focusing on features instead of customer benefits',
                    'Using industry jargon that confuses your audience',
                    'Making bold claims without supporting evidence',
                    'Weak or vague call-to-action statements',
                  ].map((item) => (
                    <li key={item} style={{ display: 'flex', gap: '0.5rem', padding: '0.3rem 0', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--red)', fontWeight: 700, flexShrink: 0, lineHeight: 1.7 }}>&#8722;</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── white (faq-section default) */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Frequently Asked Questions</h2>
          </div>
          <div className="faq-list reveal">
            {[
              {
                q: 'Is the AI copywriter tool free?',
                a: 'Yes, you can generate up to 5 copy variations per day for free. No signup required to start using the tool.',
              },
              {
                q: 'What copy types can I generate?',
                a: 'You can create ads, product descriptions, emails, social media posts, blog intros, landing pages, sales copy, and PPC ads.',
              },
              {
                q: 'How accurate is the AI-generated copy?',
                a: 'Our AI uses proven copywriting frameworks and is trained on high-converting copy examples. Always review and customize for your brand voice.',
              },
              {
                q: 'Can I specify keywords to include?',
                a: 'Yes, you can add important keywords that the AI will naturally incorporate into your copy for better SEO and relevance.',
              },
              {
                q: 'What tones and styles are available?',
                a: 'Choose from professional, friendly, persuasive, urgent, casual, authoritative, emotional, or informative tones to match your brand.',
              },
              {
                q: 'Can I use the generated copy commercially?',
                a: 'Absolutely. All generated copy is yours to use for any commercial purpose including ads, websites, emails, and marketing materials.',
              },
            ].map((item) => (
              <details key={item.q} className="faq-item reveal">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS ── dark (related-section default) */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Explore Our Other SEO Tools</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free tools to power your content marketing and SEO strategy.
            </p>
          </div>
          <div className="related-tools-grid reveal">
            {[
              {
                name: 'AI Copywriter',
                current: true,
                href: '/tools/ai-copywriter/',
                desc: 'Generate high-converting copy for ads, product descriptions, emails, and more with AI.',
                paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'],
              },
              {
                name: 'SEO Meta Writer',
                current: false,
                href: '/tools/seo-meta-writer/',
                desc: 'Generate compelling meta titles and descriptions for better click-through rates in search.',
                paths: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8'],
              },
              {
                name: 'Keyword Density Analyzer',
                current: false,
                href: '/tools/keyword-density-analyzer/',
                desc: 'Analyze keyword density and optimize content for target keywords without over-optimization.',
                paths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'],
              },
              {
                name: 'Blog Ideas Generator',
                current: false,
                href: '/tools/blog-ideas-generator/',
                desc: 'Generate hundreds of blog post ideas tailored to your niche and target audience.',
                paths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'],
              },
              {
                name: 'Meta Tag Optimizer',
                current: false,
                href: '/tools/meta-tag-optimizer/',
                desc: 'Generate perfect title tags and meta descriptions with real-time SERP preview.',
                paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
              },
            ].map((t) => (
              <div key={t.name} className={`related-card${t.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
                    {t.paths.map((d, j) => <path key={j} d={d} />)}
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

      {/* ── FINAL CTA ── */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Ready to Scale Your <span>Content Marketing?</span></h2>
          <p className="final-cta-sub">
            Our AI copywriter is just one tool in your marketing arsenal. Get professional copywriting and content
            marketing services to maximize your conversions and ROI.
          </p>

          <div className="tool-grid-2col" style={{ gap: '1rem', maxWidth: 680, margin: '2rem auto', textAlign: 'left' }}>
            {[
              {
                title: 'Content Strategy',
                desc: 'Expert content planning, conversion optimization, and performance tracking for maximum marketing impact.',
              },
              {
                title: 'Copywriting Services',
                desc: 'Professional copywriting for sales pages, email sequences, and high-converting ad campaigns.',
              },
            ].map((card) => (
              <div key={card.title} style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="final-cta-row">
            <a href="/services/" className="btn-primary">View Marketing Services</a>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {['Instant results — no account required', 'AI-powered with proven frameworks', '100% free, up to 5 daily generations'].map((p) => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
