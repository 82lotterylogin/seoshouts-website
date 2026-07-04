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

function BlogIdeasGeneratorClient() {
  const [formData, setFormData] = useState({
    mainTopic: '',
    numberOfIdeas: 5,
    angle: 'Surprise me',
    isLoading: false,
    error: '',
    results: null as any,
  })

  const [usageInfo, setUsageInfo] = useState({
    usageCount: 0,
    maxUsage: 5,
    isLimitReached: false,
  })

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsage = localStorage.getItem('blog-ideas-generator-usage')
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (usageInfo.isLimitReached) {
      setFormData((prev) => ({
        ...prev,
        error: 'You have reached the maximum limit of 5 generations. Please try again tomorrow or clear your browser data to reset.',
      }))
      return
    }

    if (!formData.mainTopic.trim()) {
      setFormData((prev) => ({ ...prev, error: 'Please enter a main topic or keyword' }))
      return
    }

    const recaptchaToken = recaptchaRef.current?.getValue()
    if (!recaptchaToken) {
      setFormData((prev) => ({ ...prev, error: 'Please complete the reCAPTCHA verification' }))
      return
    }

    setFormData((prev) => ({ ...prev, isLoading: true, error: '', results: null }))

    try {
      const response = await fetch('/api/generate-blog-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainTopic: formData.mainTopic,
          numberOfIdeas: formData.numberOfIdeas,
          angle: formData.angle,
          recaptchaToken: recaptchaToken,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setFormData((prev) => ({ ...prev, isLoading: false, results: data.results }))

        const newUsageCount = usageInfo.usageCount + 1
        localStorage.setItem('blog-ideas-generator-usage', newUsageCount.toString())

        setUsageInfo({
          usageCount: newUsageCount,
          maxUsage: 5,
          isLimitReached: newUsageCount >= 5,
        })

        recaptchaRef.current?.reset()
      } else {
        throw new Error(data.error || 'Failed to generate blog ideas')
      }
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to generate blog ideas. Please try again.',
      }))
      recaptchaRef.current?.reset()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const copyAllResults = () => {
    if (!formData.results) return
    let allText = 'Generated Blog Topics:\n\n'
    formData.results.forEach((title: string, index: number) => {
      allText += `${index + 1}. ${title}\n`
    })
    navigator.clipboard.writeText(allText)
  }

  const resetUsageLimit = () => {
    localStorage.removeItem('blog-ideas-generator-usage')
    setUsageInfo({ usageCount: 0, maxUsage: 5, isLimitReached: false })
    setFormData((prev) => ({ ...prev, error: '' }))
  }

  const usagePct = Math.min((usageInfo.usageCount / usageInfo.maxUsage) * 100, 100)

  return (
    <>
      <style jsx global>{`
        .recaptcha-wrapper { overflow: hidden; width: 100%; display: flex; justify-content: center; }
        @media only screen and (max-width: 575px) {
          .g-recaptcha { transform: scale(0.77); -webkit-transform: scale(0.77); transform-origin: 0 0; -webkit-transform-origin: 0 0; margin-bottom: -20px; }
        }
        @media only screen and (max-width: 360px) {
          .g-recaptcha { transform: scale(0.70); -webkit-transform: scale(0.70); transform-origin: 0 0; -webkit-transform-origin: 0 0; }
        }
      `}</style>

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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Blog Ideas Generator</span>
          </nav>
          <div className="tool-hero-badge">Free AI Tool</div>
          <h1 className="tool-hero-h1">
            Free Blog Ideas &amp; Topic <span>Generator</span>
          </h1>
          <p className="tool-hero-sub">
            Never stare at a blank screen again. Get unlimited fresh, engaging topics in seconds &mdash; mixing
            trending subjects with evergreen content ideas tailored to your niche and audience.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['AI-Powered Ideas', '5–20 Topics Per Generate', 'Trending & Evergreen Mix', '100% Free'].map((label) => (
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
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT: Form */}
          <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>

            {/* Usage strip */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Daily Usage</span>
                {usageInfo.usageCount >= 4 && !usageInfo.isLimitReached && (
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--amber)', fontWeight: 700 }}>
                    {usageInfo.maxUsage - usageInfo.usageCount} remaining
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {usageInfo.isLimitReached && (
                  <button
                    onClick={resetUsageLimit}
                    style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--blue)', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'underline', padding: 0 }}
                  >
                    Reset
                  </button>
                )}
                <div style={{ width: '72px', height: '3px', background: 'var(--line)', position: 'relative' }}>
                  <div style={{
                    position: 'absolute', top: 0, left: 0,
                    width: `${usagePct}%`, height: '100%',
                    background: usageInfo.isLimitReached ? 'var(--red)' : usageInfo.usageCount >= 4 ? 'var(--amber)' : 'var(--green)',
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--mono, monospace)', color: usageInfo.isLimitReached ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                  {usageInfo.usageCount}/{usageInfo.maxUsage}
                </span>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <h2 className="tool-box-heading">Blog Ideas Generator</h2>
              <p className="tool-box-sub">Enter your topic, pick an angle, and generate fresh ideas instantly.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Number of Ideas */}
                <div>
                  <label htmlFor="numberOfIdeas" className="tool-box-label">Number of Ideas *</label>
                  <select
                    id="numberOfIdeas"
                    value={formData.numberOfIdeas}
                    onChange={(e) => setFormData((prev) => ({ ...prev, numberOfIdeas: parseInt(e.target.value), error: '' }))}
                    style={selectStyle}
                    disabled={formData.isLoading || usageInfo.isLimitReached}
                    required
                  >
                    <option value={5}>5 Blog Ideas</option>
                    <option value={10}>10 Blog Ideas</option>
                    <option value={15}>15 Blog Ideas</option>
                    <option value={20}>20 Blog Ideas</option>
                  </select>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: '0.25rem', fontFamily: 'Inter, sans-serif' }}>Choose how many topic ideas you need</p>
                </div>

                {/* Angle */}
                <div>
                  <label htmlFor="angle" className="tool-box-label">Pick Your Angle (Optional)</label>
                  <select
                    id="angle"
                    value={formData.angle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, angle: e.target.value, error: '' }))}
                    style={selectStyle}
                    disabled={formData.isLoading || usageInfo.isLimitReached}
                  >
                    <option value="Surprise me">Surprise me</option>
                    <option value="How-to guides">How-to guides</option>
                    <option value="Comparison posts">Comparison posts</option>
                    <option value="Beginner content">Beginner content</option>
                    <option value="Listicles">Listicles (Top 10, Best of...)</option>
                    <option value="Problem-solving">Problem-solving posts</option>
                    <option value="Personal experience">Personal experience stories</option>
                    <option value="Industry trends">Industry trends &amp; news</option>
                  </select>
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: '0.25rem', fontFamily: 'Inter, sans-serif' }}>
                    Want how-to guides? Comparison posts? Beginner content? You can specify or let the generator surprise you.
                  </p>
                </div>

                {/* Main Topic */}
                <div>
                  <label htmlFor="mainTopic" className="tool-box-label">Main Topic or Keyword *</label>
                  <input
                    type="text"
                    id="mainTopic"
                    value={formData.mainTopic}
                    onChange={(e) => setFormData((prev) => ({ ...prev, mainTopic: e.target.value, error: '' }))}
                    placeholder="e.g., fitness, small business marketing, vegan cooking, personal finance..."
                    style={inputStyle}
                    disabled={formData.isLoading || usageInfo.isLimitReached}
                    required
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.25rem' }}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', fontFamily: 'Inter, sans-serif' }}>Enter your blog niche, topic, or keyword</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', fontFamily: 'var(--mono, monospace)' }}>{formData.mainTopic.length}/100 characters</p>
                  </div>
                </div>

                {/* reCAPTCHA */}
                <div style={{ borderTop: '1px solid var(--line)', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)', borderLeft: '3px solid var(--blue)', padding: '1rem', background: 'var(--gray-1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: 16, height: 16, border: '1px solid var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, fontFamily: 'var(--mono, monospace)', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink)' }}>
                      Human Verification Required
                    </span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-5)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    Please verify that you&apos;re not a robot to generate your blog ideas.
                  </p>
                  <div className="recaptcha-wrapper">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                    />
                  </div>
                </div>

                {/* Error */}
                {formData.error && (
                  <div style={{ padding: '0.75rem 1rem', borderLeft: '3px solid var(--red)', background: 'rgba(220,38,38,0.05)', fontSize: '0.875rem', color: 'var(--red)', lineHeight: 1.5 }}>
                    {formData.error}
                  </div>
                )}

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={handleSubmit}
                    disabled={formData.isLoading || usageInfo.isLimitReached}
                    className="btn-primary"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: (formData.isLoading || usageInfo.isLimitReached) ? 0.6 : 1,
                      cursor: (formData.isLoading || usageInfo.isLimitReached) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {formData.isLoading ? (
                      <>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                        </svg>
                        Generating Ideas&hellip;
                      </>
                    ) : usageInfo.isLimitReached ? 'Daily Limit Reached' : (
                      <>
                        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Generate {formData.numberOfIdeas} Blog Ideas
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ mainTopic: '', numberOfIdeas: 5, angle: 'Surprise me', isLoading: false, error: '', results: null })}
                    style={{ padding: '0 1.25rem', border: '1px solid var(--line)', background: 'var(--white)', color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results + Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Results panel */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0, position: 'sticky', top: '6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Generated Blog Topics</span>
                {formData.results && (
                  <button
                    onClick={copyAllResults}
                    style={{ padding: '0.3rem 0.75rem', border: 'none', background: 'var(--green)', color: 'var(--white)', fontSize: '0.72rem', fontFamily: 'var(--mono, monospace)', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.05em' }}
                  >
                    Copy All
                  </button>
                )}
              </div>

              {formData.results ? (
                <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  <div style={{ padding: '0.55rem 1.25rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gray-5)', fontFamily: 'var(--mono, monospace)' }}>
                      {formData.results.length} topic{formData.results.length > 1 ? 's' : ''} for &ldquo;{formData.mainTopic}&rdquo;
                    </span>
                    {formData.angle !== 'Surprise me' && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--blue)', fontFamily: 'var(--mono, monospace)', fontWeight: 700 }}>{formData.angle}</span>
                    )}
                  </div>
                  {formData.results.map((title: string, index: number) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1.25rem', borderBottom: '1px solid var(--line)', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', flex: 1 }}>
                        <span style={{ flexShrink: 0, width: 22, height: 22, background: 'var(--blue)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontFamily: 'var(--mono, monospace)', fontWeight: 700 }}>
                          {index + 1}
                        </span>
                        <span style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.5, fontWeight: 500 }}>{title}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(title)}
                        style={{ flexShrink: 0, padding: '0.25rem 0.5rem', border: '1px solid var(--line)', background: 'var(--white)', color: 'var(--gray-5)', fontSize: '0.68rem', fontFamily: 'var(--mono, monospace)', cursor: 'pointer' }}
                        title="Copy this topic"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, background: 'var(--blue-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p style={{ color: 'var(--ink)', fontSize: '0.9rem', marginBottom: '0.4rem', fontWeight: 600 }}>Ready to generate ideas</p>
                  <p style={{ color: 'var(--gray-4)', fontSize: '0.8rem', fontFamily: 'var(--mono, monospace)' }}>Enter your topic and click Generate</p>
                  {formData.isLoading && (
                    <p style={{ marginTop: '1rem', color: 'var(--gray-4)', fontSize: '0.78rem', fontFamily: 'var(--mono, monospace)' }}>Generating&hellip;</p>
                  )}
                </div>
              )}
            </div>

            {/* Tips panel */}
            <div className="tool-box" style={{ maxWidth: 'none', padding: 0 }}>
              <div style={{ padding: '0.65rem 1.5rem', borderBottom: '1px solid var(--line)', background: 'var(--gray-1)' }}>
                <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Blog Topic Tips</span>
              </div>
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.6rem', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Getting Better Topics</h4>
                <ul style={{ listStyle: 'none', margin: '0 0 1.25rem', padding: 0 }}>
                  {[
                    'Be specific (e.g., "Instagram marketing for restaurants")',
                    'Use the angle selector to focus on specific content types',
                    "Pick topics you're genuinely interested in writing about",
                    "Consider your audience's skill level and interests",
                  ].map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.2rem 0', fontSize: '0.8rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700 }}>→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.6rem', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Pro Tips</h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {[
                    'Mix evergreen topics with trending ones',
                    "Generate ideas in batches when you're creative",
                    'These are starting points — add your unique perspective',
                    "Don't overthink — sometimes obvious topics work best",
                  ].map((tip, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.2rem 0', fontSize: '0.8rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700 }}>→</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOUNDER QUOTE ── */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in SEO</div>
              <p className="founder-quote-text">
                &ldquo;The blogs that win are not the ones with the best writers, they are the ones that never miss a publishing week. Idea generation is where consistency dies. This blog topic generator removes that failure point: seed it with your niche, get a month of angles in seconds, and spend your energy writing instead of staring.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts ·{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT / INTRO / WHY / HOW ── white (prose-section) */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Never Stare at a Blank Screen Again</h2>
            <p className="s-sub">Generate unlimited blog topic ideas instantly. No more writer&apos;s block, no more blank screens.</p>
          </div>
          <div className="prose-content reveal">
            <h3>Generate Blog Topic Ideas When Your Brain Just Won&apos;t Cooperate</h3>
            <p>
              Okay, confession time. Last Tuesday, I sat at my laptop for THREE HOURS trying to think of what to write about.
              Three hours! I could&apos;ve learned to juggle in that time.
            </p>
            <p>
              You know that feeling? You&apos;ve got a blog to feed, deadlines breathing down your neck, and your brain feels like
              it&apos;s been replaced with soggy cereal. I&apos;ve been there way too many times.
            </p>
            <p>
              I used to think writer&apos;s block was just part of being a blogger. Wrong! The pros don&apos;t sit around waiting
              for lightning to strike. They&apos;ve got systems.
            </p>
            <p>
              <strong>Our Blog Ideas Generator</strong> is basically that system in tool form. Type in your topic, hit a button,
              and suddenly you&apos;ve got more blog ideas than you know what to do with.
            </p>

            <div style={{ padding: '1rem 1.5rem', borderLeft: '3px solid var(--blue)', background: 'var(--blue-pale)', margin: '1.5rem 0', fontSize: '1rem', fontWeight: 600, color: 'var(--ink)', lineHeight: 1.6 }}>
              Tired of brain fog when you need ideas most? Use the tool above!
            </div>

            <h3 style={{ marginTop: '2.5rem' }}>Why Coming Up With Blog Topics Feels Impossible Sometimes</h3>
            <p>Here&apos;s what I&apos;ve noticed after years of blogging and helping other people with content:</p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
              {[
                { bold: 'We make it way harder than it needs to be.', rest: " Like, unnecessarily complicated. Instead of just picking something useful to write about, we convince ourselves it needs to be this groundbreaking piece that changes the world." },
                { bold: 'We forget our readers are regular humans with regular problems.', rest: " They don't need us to reinvent the wheel. They just want help with stuff they're struggling with." },
                { bold: "We think everything's been covered already.", rest: " Newsflash: it hasn't. And even if it has, your take on it matters. Your experience matters. Your weird way of explaining things might be exactly what someone needs to hear." },
                { bold: "We get stuck in our own heads.", rest: " This happens to me all the time. I start thinking about what I should write instead of what my readers actually want to know." },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--line)', alignItems: 'flex-start', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--gray-5)' }}>
                  <span style={{ color: 'var(--blue)', fontWeight: 700, flexShrink: 0, lineHeight: 1.7 }}>—</span>
                  <span><strong style={{ color: 'var(--ink)' }}>{item.bold}</strong>{item.rest}</span>
                </li>
              ))}
            </ul>

            <div style={{ padding: '1rem 1.5rem', borderLeft: '3px solid var(--amber)', background: 'rgba(245,158,11,0.05)', margin: '1.5rem 0', fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.7 }}>
              <strong>Truth bomb:</strong> Your audience wants you to cover the basics. They want straightforward help with their
              problems. Stop trying to be clever and start being useful.
            </div>

            <h3 style={{ marginTop: '2.5rem' }}>How This Tool Actually Helps (Without the Fancy AI Buzzwords)</h3>
            <p>
              Look, I could tell you about &ldquo;advanced algorithms&rdquo; and &ldquo;machine learning,&rdquo; but honestly?
              Here&apos;s what really happens:
            </p>
            <p>
              You tell it what you write about (like &ldquo;small business marketing&rdquo; or &ldquo;vegan cooking&rdquo;), and
              it spits out a bunch of topic ideas that people are actually interested in reading about.
            </p>

            <div className="tool-grid-2col" style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ borderTop: '1px solid var(--line)', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)', borderLeft: '3px solid var(--green)', padding: '1.25rem' }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>The Smart Part</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    "It knows what's trending in your space right now",
                    "It suggests different angles you probably hadn't thought of",
                    "It gives you topics people are actually searching for",
                    'It mixes up the format so you\'re not always writing "5 Tips for..." posts',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem 0', fontSize: '0.825rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--green)', fontWeight: 700, flexShrink: 0 }}>+</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ borderTop: '1px solid var(--line)', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)', borderLeft: '3px solid var(--blue)', padding: '1.25rem' }}>
                <h4 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.875rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>The Human Part (That&apos;s You)</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'Pick the ideas that excite you',
                    'Add your own spin and personality',
                    'Actually write something good',
                    'Choose topics you can speak about with authority',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem 0', fontSize: '0.825rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--blue)', fontWeight: 700, flexShrink: 0 }}>→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ padding: '1rem 1.5rem', borderLeft: '3px solid var(--green)', background: 'rgba(5,150,105,0.05)', margin: '1.5rem 0', fontSize: '0.9rem', color: 'var(--ink)', fontWeight: 600 }}>
              Simple? Yes. Effective? Also yes.
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT KINDS ── gray (features-section) */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">What Kind of Ideas You&apos;ll Actually Get</h2>
            <p className="s-sub">The generator mixes all these up so you&apos;re not stuck writing the same type of post over and over.</p>
          </div>
          <div className="features-grid reveal">
            {[
              {
                title: 'The Bread-and-Butter Stuff',
                desc: '"How to" guides that solve real problems. "Complete beginner\'s guide to" posts for people just starting out. The foundational content every niche needs.',
                paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'],
              },
              {
                title: 'Problem-Solving Posts',
                desc: '"Why your [thing] isn\'t working and how to fix it" type content. These perform really well because they address specific pain points.',
                paths: ['M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'],
              },
              {
                title: 'Comparison and Review Content',
                desc: '"X vs Y" posts, tool reviews, "best of" lists. People love these because they help with decision-making.',
                paths: ['M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18'],
              },
              {
                title: 'Behind-the-Scenes and Personal Experience',
                desc: '"What I learned when I..." or "My experience with..." posts. These build connection and trust with your audience.',
                paths: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M9 7a4 4 0 100 8 4 4 0 000-8z'],
              },
              {
                title: 'Current Events and Trend Commentary',
                desc: "What's happening in your industry right now? What should people know about the latest changes or updates?",
                paths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="feature-card reveal"
                style={{
                  borderRight: (i % 3 === 2 || i === 4) ? 'none' : '1px solid var(--line)',
                  borderBottom: i >= 3 ? 'none' : '1px solid var(--line)',
                }}
              >
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

      {/* ── HOW TO USE ── white (howto-section) */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">How to Use It (It&apos;s Stupidly Simple)</h2>
          </div>
          <div className="steps-grid reveal" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              { n: '01', title: 'Type In Your Main Topic or Keyword', desc: 'Could be broad like "fitness" or specific like "home workouts for busy moms."' },
              { n: '02', title: 'Hit Generate and Watch the Magic Happen', desc: "You'll get a list of topic ideas based on your niche and the angle you selected." },
              { n: '03', title: 'Scan Through and Save the Winners', desc: "Don't overthink it. If an idea sparks something in your brain, grab it." },
              { n: '04', title: 'Start Writing', desc: "Pick your favorite and just start. Don't wait for perfect conditions or more research. Just write." },
              { n: '05', title: 'Come Back When You Need More Ideas', desc: "The tool's always here when inspiration runs dry." },
            ].map((s, i) => (
              <div key={s.n} className="step-card reveal">
                {i % 3 !== 2 && i < 4 && (
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
          <div className="reveal" style={{ marginTop: '2.5rem', padding: '1.25rem 1.5rem', borderLeft: '3px solid var(--amber)', background: 'rgba(245,158,11,0.06)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.7, margin: 0 }}>
              <strong>Pro tip I learned the hard way:</strong> Generate ideas in batches when you&apos;re feeling creative. Don&apos;t
              wait until you&apos;re desperate and deadline-stressed.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHO USES IT ── gray (features-section) */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Who Actually Uses This Thing?</h2>
          </div>
          <div className="features-grid reveal">
            {[
              {
                title: 'Bloggers Who Are Tired of Struggling',
                desc: "Anyone who's ever sat staring at a blank screen wondering what the hell to write about next.",
                paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'],
              },
              {
                title: 'Small Business Owners',
                desc: "People who know they should be blogging but don't have time to brainstorm topics on top of everything else they're doing.",
                paths: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
              },
              {
                title: 'Content Creators and Freelancers',
                desc: 'Writers who need a steady stream of ideas for their own blogs or client work.',
                paths: ['M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2', 'M9 7a4 4 0 100 8 4 4 0 000-8z', 'M23 21v-2a4 4 0 00-3-3.87', 'M16 3.13a4 4 0 010 7.75'],
              },
              {
                title: 'Marketing Teams',
                desc: "Groups that need to keep content calendars full without spending entire meetings just trying to think of topics.",
                paths: ['M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'],
              },
              {
                title: "Anyone Who's Ever Had Writer's Block",
                desc: "If you've ever procrastinated on writing because you couldn't think of what to write about, this tool is for you.",
                paths: ['M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'],
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="feature-card reveal"
                style={{
                  borderRight: (i % 3 === 2 || i === 4) ? 'none' : '1px solid var(--line)',
                  borderBottom: i >= 3 ? 'none' : '1px solid var(--line)',
                }}
              >
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

      {/* ── REAL SITUATIONS ── white (prose-section) */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Real Situations Where This Tool Saves Your Sanity</h2>
          </div>
          <div className="reveal tool-grid-2col" style={{ gap: '1rem', marginTop: '2.5rem' }}>
            {[
              { title: '"I Need to Post Tomorrow and I\'ve Got Nothing"', desc: 'Panic mode activated? Generate some ideas right now, pick one that speaks to you, and start writing. Crisis averted.' },
              { title: '"I Feel Like I\'ve Written About Everything in My Niche"', desc: "You haven't. The generator will prove it by showing you angles and subtopics you totally forgot about." },
              { title: '"My Content Calendar Is a Disaster Zone"', desc: 'Spend 20 minutes generating ideas and you can plan out weeks of content. Future you will thank present you.' },
              { title: '"I Don\'t Know What My Readers Want"', desc: "The tool suggests topics based on what people are actually searching for, not just what sounds interesting to you." },
              { title: '"I\'m Bored Writing the Same Stuff Over and Over"', desc: 'Mix up your content with different formats and fresh angles on familiar topics.' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '1.25rem 1.5rem',
                  borderTop: '1px solid var(--line)',
                  borderRight: '1px solid var(--line)',
                  borderBottom: '1px solid var(--line)',
                  borderLeft: '3px solid var(--blue)',
                  gridColumn: i === 4 ? '1 / -1' : 'auto',
                }}
              >
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.5rem', lineHeight: 1.4 }}>{item.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-5)', lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GETTING THE MOST ── gray (why-section) */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Getting the Most Bang for Your Buck</h2>
          </div>
          <div className="why-grid reveal" style={{ marginTop: '3rem' }}>
            {[
              { title: 'Pick Topics You Actually Care About', body: "Don't write about stuff just because it might be popular. Write about things you have opinions on, experience with, or genuine interest in.", color: 'var(--blue)' },
              { title: "Know Your Audience's Skill Level", body: "Are you talking to complete beginners or people who already know the basics? Match your topic choice to where your readers are at.", color: 'var(--green)' },
              { title: 'Mix Evergreen with Trending', body: 'Some topics will be relevant forever. Others are hot right now but might fizzle out. Having both keeps your blog balanced.', color: 'var(--amber)' },
              { title: 'Don\'t Overthink the "Perfect" Topic', body: "Sometimes the most obvious topic is exactly what your readers need. Don't get too clever for your own good.", color: 'var(--red)' },
              { title: 'Test Different Formats', body: 'If you always write long guides, try a quick tips post. If you never do personal stories, experiment with one. Variety keeps things interesting.', color: 'var(--blue)' },
            ].map((card, i) => (
              <div
                key={card.title}
                className="why-card reveal"
                style={{ borderTop: `3px solid ${card.color}`, gridColumn: i === 4 ? '1 / -1' : 'auto' }}
              >
                <div className="why-card-title">
                  <div className="why-card-icon" style={{ background: card.color }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  {card.title}
                </div>
                <p className="why-card-body">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── white (faq-section) */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Common Questions People Ask</h2>
          </div>
          <div className="faq-list reveal">
            {[
              { q: 'What if someone else already wrote about my topic?', a: 'So what? Your perspective is different. Your experience is unique. Your way of explaining things might be exactly what someone needs to finally "get it."' },
              { q: 'Are these topics going to be unique to my blog?', a: "The generator gives suggestions based on what works in your niche. Other people might get similar ideas, but what you do with them is what makes them yours." },
              { q: 'Can I change the suggested titles?', a: "Of course! These are starting points, not commandments. Tweak them to fit your voice and style." },
              { q: 'How often should I generate new ideas?', a: "Whenever you're planning content. Some people batch it monthly, others prefer to generate as needed. Do whatever works for your workflow." },
              { q: "What if I don't like any of the suggestions?", a: 'Try different keywords or be more specific. Sometimes "social media marketing" gives you different results than "Instagram marketing for restaurants."' },
              { q: 'Is this blog topic generator really free?', a: 'Yes. No account, no credit card, no locked features. There is a fair-use daily limit to keep the AI fast for everyone, but every feature of the blog topic generator is available to every user at no cost.' },
            ].map((item) => (
              <details key={item.q} className="faq-item reveal">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED ── dark (related-section) */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header reveal">
            <h2 className="s-title">Explore Our Other SEO Tools</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO and content tools designed to help you optimize, rank, and create better content.
            </p>
          </div>
          <div className="related-tools-grid reveal">
            {[
              { name: 'Blog Ideas Generator', current: true, href: '/tools/blog-ideas-generator/', desc: 'Never run out of blog topics with AI-powered idea generation tailored to your niche.', paths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'] },
              { name: 'AI Copywriter', current: false, href: '/tools/ai-copywriter/', desc: 'Generate high-converting copy for ads, product descriptions, emails, and more with AI.', paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'] },
              { name: 'SEO Meta Writer', current: false, href: '/tools/seo-meta-writer/', desc: 'Generate compelling meta titles and descriptions for better click-through rates in search.', paths: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8'] },
              { name: 'Keyword Density Analyzer', current: false, href: '/tools/keyword-density-analyzer/', desc: 'Analyze keyword density and optimize content for target keywords without over-optimization.', paths: ['M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'] },
              { name: 'Meta Tag Optimizer', current: false, href: '/tools/meta-tag-optimizer/', desc: 'Generate perfect title tags and meta descriptions with real-time SERP preview and character counters.', paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
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
          <h2 className="final-cta-title">Ready to Never Run Out of <span>Ideas Again?</span></h2>
          <p className="final-cta-sub">
            Stop treating topic brainstorming like some mystical creative process that only works when the stars align.
            You need a system, and this tool is that system.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', fontWeight: 600, maxWidth: 640, margin: '0 auto 2rem', textAlign: 'center', lineHeight: 1.7 }}>
            Whether you need one topic for tomorrow&apos;s deadline or fifty ideas to plan your next quarter, the generator has your back.
          </p>

          <div className="tool-grid-2col" style={{ gap: '1rem', maxWidth: 680, margin: '0 auto 2rem', textAlign: 'left' }}>
            {[
              { title: 'Use the Blog Ideas Generator', desc: 'Generate unlimited topic ideas instantly — completely free, no account required.' },
              { title: 'Works Great on Mobile Too', desc: 'Generate ideas on the go when inspiration strikes — fully responsive on any device.' },
            ].map((card) => (
              <div key={card.title} style={{ padding: '1.25rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#fff', marginBottom: '0.5rem' }}>{card.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="final-cta-row">
            <a href="#top" className="btn-primary">Generate Blog Ideas Now</a>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {['Never waste another hour on blank screens', "Built for writers who hate writer's block", '100% free, unlimited inspiration'].map((p) => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogIdeasGeneratorClient
