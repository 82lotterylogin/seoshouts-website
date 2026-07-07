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
    language: 'English',
    country: 'us'
  })

  type MinedKeyword = { keyword: string; group: string; intent: string; demand: 'High' | 'Medium' | 'Low' }
  const [results, setResults] = useState<MinedKeyword[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit] = useState(5)

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  // Mine real long-tail keywords from Google Autocomplete
  const generateKeywords = async () => {
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

    try {
      const response = await fetch('/api/keyword-suggest/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword: form.keyword,
          location: form.location,
          language: form.language,
          country: form.country,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate keywords. Please try again.')
      }

      setResults(data.keywords)

      // Increment usage count and save to session storage
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('longTailKeywordUsage', newUsageCount.toString())
    } catch (err: any) {
      setError(err.message || 'Failed to generate keywords. Please try again.')
    } finally {
      setLoading(false)
    }
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
      ['Keyword', 'Demand', 'Intent', 'Type'],
      ...results.map(item => [item.keyword, item.demand, item.intent, item.group])
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
      language: 'English',
      country: 'us'
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

  const getDemandBg = (demand: string) => {
    if (demand === 'High') return 'rgba(22,163,74,0.12)'
    if (demand === 'Medium') return 'rgba(245,158,11,0.12)'
    return 'rgba(107,114,128,0.12)'
  }

  const getDemandColor = (demand: string) => {
    if (demand === 'High') return 'var(--green)'
    if (demand === 'Medium') return 'var(--amber)'
    return 'var(--gray-4)'
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
          <div className="tool-hero-badge">🔑 Keyword Research Tool — Free Forever</div>
          <h1 className="tool-hero-h1">
            Free Long Tail Keyword Generator: <span>Hundreds of Ideas</span> From One Seed Keyword
          </h1>
          <p className="tool-hero-sub">
            A long tail keyword generator expands any seed keyword into hundreds of longer, more specific search phrases with lower competition and higher buying intent. SEOShouts&apos; free long tail keyword tool mines{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>real queries straight from Google Autocomplete</strong>{' '}
            — 300-500 per seed, with demand signals, intent labels, per-country targeting, CSV export and no signup required.
          </p>
        </div>
      </div>

      {/* ─── TOOL INPUT SECTION ─── */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── LEFT BOX — Input ── */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            {/* Usage strip */}
            <div className="tool-usage-strip">
              <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--gray-5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Session Usage</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {usageCount >= usageLimit && (
                  <span style={{ fontSize: '0.7rem', fontFamily: 'var(--mono, monospace)', color: 'var(--red)', fontWeight: 700 }}>Limit reached — refresh page</span>
                )}
                <div style={{ width: '72px', height: '3px', background: 'var(--line)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.min((usageCount / usageLimit) * 100, 100)}%`, background: usageCount >= usageLimit ? 'var(--red)' : 'var(--green)', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--mono, monospace)', color: usageCount >= usageLimit ? 'var(--red)' : 'var(--green)', fontWeight: 700 }}>
                  {usageCount}/{usageLimit}
                </span>
              </div>
            </div>

            <h2 className="tool-box-heading">Keyword Generator</h2>

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

            {/* Country */}
            <label className="tool-box-label" htmlFor="country">Target Country</label>
            <select
              id="country"
              value={form.country}
              onChange={(e) => setForm(prev => ({ ...prev, country: e.target.value }))}
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                color: 'var(--ink)', outline: 'none', background: 'var(--white)',
                marginBottom: '0.35rem', cursor: 'pointer'
              }}
            >
              <option value="us">United States</option>
              <option value="in">India</option>
              <option value="gb">United Kingdom</option>
              <option value="ca">Canada</option>
              <option value="au">Australia</option>
              <option value="de">Germany</option>
              <option value="fr">France</option>
              <option value="es">Spain</option>
              <option value="it">Italy</option>
              <option value="br">Brazil</option>
              <option value="mx">Mexico</option>
              <option value="nl">Netherlands</option>
              <option value="sg">Singapore</option>
              <option value="ae">United Arab Emirates</option>
              <option value="jp">Japan</option>
              <option value="id">Indonesia</option>
            </select>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: 0 }}>Suggestions come from Google&apos;s autocomplete for this country</p>

            {/* Location */}
            <label className="tool-box-label" htmlFor="location">City / Local Area (Optional)</label>
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

            {/* Human Verification — widget label is self-explanatory */}
            <div style={{ marginBottom: '1.25rem' }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                onChange={handleCaptchaChange}
                theme="light"
              />
              {isVerified && (
                <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--green)' }}>
                  ✓ Verified — you can now generate keywords.
                </p>
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
                        <span style={{
                          padding: '2px 7px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 3,
                          background: getDemandBg(item.demand),
                          color: getDemandColor(item.demand)
                        }}>
                          {item.demand} Demand
                        </span>
                        <span style={{
                          padding: '2px 7px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 3,
                          background: 'rgba(37,99,235,0.1)', color: 'var(--blue)'
                        }}>
                          {item.intent}
                        </span>
                        <span style={{
                          padding: '2px 7px', fontSize: '0.72rem', fontWeight: 600, borderRadius: 3,
                          background: 'var(--gray-1)', color: 'var(--gray-5)', border: '1px solid var(--line)'
                        }}>
                          {item.group}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--gray-4)' }}>
                  {results.length} real queries mined from Google Autocomplete
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>
                  Every phrase above is a real query Google suggests to searchers. Demand reflects Google&apos;s own suggestion ranking; intent labels are heuristic.
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── FOUNDER QUOTE ─── */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in SEO</div>
              <p className="founder-quote-text">
                &ldquo;Every site I have ever grown from zero got its first real traffic from long tail keywords. Not the big head terms, the specific five-word phrases nobody else bothered to target. This generator exists so you can find those phrases in seconds instead of scraping autocomplete by hand for hours.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts ·{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS SECTION ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">What are long tail keywords <span className="blue">and why are they marketing gold?</span></h2>
          </div>
          <div className="prose-content">
            <p>Long tail keywords are longer, more specific search phrases, usually three to six words, that individually attract fewer searches but collectively make up the majority of all Google queries. Instead of targeting &ldquo;shoes&rdquo; (good luck ranking for that), smart marketers target phrases like &ldquo;waterproof running shoes for women&rdquo; or &ldquo;best hiking boots under 5000 rupees.&rdquo;</p>
            <p>They work because specificity changes everything. Fewer websites compete for the same phrase, so ranking is dramatically easier. The searcher&apos;s intent is crystal clear, so you know exactly what page to build. And people typing specific queries are much closer to taking action, which is why long tail traffic converts at a far higher rate than head-term traffic.</p>
            <p>Think about it: would you rather rank #47 for &ldquo;digital marketing&rdquo; or #3 for &ldquo;digital marketing services for small restaurants in Mumbai&rdquo;? The second keyword sends fewer visitors, but every one of them is your exact customer, and you can actually win the position.</p>
            <p>A long tail keywords generator automates the discovery: it mines one seed term into hundreds of real search phrases pulled directly from Google Autocomplete, with demand signals and intent labels attached. Before committing to any keyword, verify how winnable it is with our <a href="/tools/keyword-difficulty-checker/" style={{ color: 'var(--blue)' }}>free keyword difficulty checker</a>, then organize the winners using our guide to <a href="/blog/how-to-build-pillar-pages-seo/" style={{ color: 'var(--blue)' }}>pillar pages and topic clusters</a>.</p>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">What this free long tail keyword tool <span className="blue">gives you</span></h2>
          </div>
          <div className="features-grid">
            {[
              { icon: 'M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z M9 21h6', title: 'AI-Powered Keyword Discovery', desc: 'Smart algorithms analyze real search behavior, not dictionary combinations, and expand your seed keyword into hundreds of long tail variations people actually type into Google.' },
              { icon: 'M3 3v18h18 M19 9l-5 5-4-4-3 3', title: 'Real Google Autocomplete Data', desc: 'Every suggestion is a real query mined live from Google Autocomplete — phrases people actually type, not template guesses. Demand levels come from Google\'s own popularity ranking.' },
              { icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0', title: 'Intent Classification', desc: 'Keywords are labeled by search intent: buyer keywords for product pages, question keywords for blog content, and local queries for location pages. You always know what to build.' },
              { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', title: 'Location and Language Targeting', desc: 'Generate keywords for a specific country, city, or language. Local and international campaigns get suggestions that match how your actual market searches.' },
              { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3', title: 'CSV Export and Copy', desc: 'Download the full keyword list as a CSV file or copy everything to your clipboard, ready for your content calendar, PPC campaign, or client deliverable.' },
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Zero Barriers', desc: 'No registration, no email verification, no credit card. Enter a seed keyword and start generating. Free for every session, on any device.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.icon.split(' M').map((d, j) => <path key={j} d={j === 0 ? d : 'M' + d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO SECTION ─── */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How To Use</div>
            <h2 className="s-title">How to generate long tail keywords <span className="blue">(step by step)</span></h2>
            <p className="s-sub">One seed keyword in, hundreds of scored suggestions out. The whole loop takes under a minute.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Enter Your Main Keyword', desc: 'Start with a broad term related to your business, like "coffee maker," "digital marketing," or "yoga classes." The broader the seed, the wider the net of long tail variations the generator casts.', tip: 'Run 3-4 different seed keywords per topic to build a comprehensive opportunity list.' },
              { n: '02', title: 'Choose Your Target Location', desc: 'Pick the country whose Google Autocomplete you want to mine, and optionally add a city. Location changes which real phrases appear, and it unlocks "near me" style local variations.', tip: 'Local businesses: add your city ("yoga classes" + Mumbai) for hyper-local suggestions.' },
              { n: '03', title: 'Pick Your Language', desc: 'Choose the language your customers search in. The tool supports English, Hindi, Spanish, French, German, and Portuguese for global and regional campaigns.', tip: 'Non-English markets usually have far lower keyword competition. Same product, easier rankings.' },
              { n: '04', title: 'Generate Keywords', desc: 'Complete the quick human verification and click Generate. The tool probes Google Autocomplete with 50+ query patterns and returns 300-500 real phrases, each with a demand signal, intent label, and type.', tip: 'Filter mentally by intent first: transactional phrases are worth more than their demand level suggests.' },
              { n: '05', title: 'Analyze and Export', desc: 'Review the list, shortlist phrases that match pages you can build, and export to CSV. Feed the shortlist into your content calendar or PPC campaign structure.', tip: 'Score your shortlist with the keyword difficulty checker before writing anything.' },
            ].map((s, i, arr) => (
              <div key={s.n} className="step-card">
                {i < arr.length - 1 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
                  </div>
                )}
                <div className="step-num-big">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
                {s.tip && <div className="step-tip">💡 Tip: {s.tip}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY SECTION ─── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Why It Matters</div>
            <h2 className="s-title">Why long tail keywords out-earn <span className="blue">head terms</span></h2>
            <p className="s-sub">The math of long tail SEO favors small and mid-size sites in every dimension that matters: competition, conversion, and compounding.</p>
          </div>
          <div className="why-grid">
            {[
              { title: 'They Convert at a Higher Rate', icon: '💰', body: 'Someone searching "shoes" is browsing. Someone searching "waterproof trail running shoes size 9 women" has a credit card out. Specific queries signal buying-stage intent, which is why long tail visitors convert several times better than head-term visitors.' },
              { title: 'They Are Winnable Without Authority', icon: '🎯', body: 'Head terms are locked up by high-authority brands that have compounded links for a decade. Long tail phrases often have weak, outdated, or zero dedicated pages ranking, so a genuinely good page from a newer site can take page one in weeks.' },
              { title: 'They Compound Into Head Rankings', icon: '🏗️', body: 'Ranking for 50 long tail variations around one topic builds exactly the topical authority Google wants before trusting you with the head term. The long tail is not instead of the big keyword, it is the route to it.' },
              { title: 'They Match How AI Search Works', icon: '🤖', body: 'Queries typed into ChatGPT, Perplexity, and Google AI Overviews are conversational and specific, which is long tail by definition. Content built around natural, specific phrases is far more likely to be cited in AI answers than content optimized for two-word head terms.' },
            ].map((c) => (
              <div key={c.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">{c.icon}</div>
                  {c.title}
                </div>
                <div className="why-card-body">{c.body}</div>
              </div>
            ))}
          </div>
          <div className="alert-box">
            <div className="alert-box-title">⚠️ The Zero-Volume Trap</div>
            <div className="alert-box-body">The classic long tail failure is targeting phrases so specific that nobody searches them at all. A keyword with 10 searches per month and buyer intent is gold; a keyword with zero searches is a diary entry. The advantage of autocomplete mining: if a phrase appears in Google&apos;s suggestions at all, real people are typing it, and the demand signal tells you how heavily. Prefer clusters of related lower-demand phrases over one isolated micro-keyword.</div>
          </div>
        </div>
      </section>

      {/* ─── KEYWORD TYPES SECTION ─── */}
      <section className="section ratio-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Keyword Types</div>
            <h2 className="s-title">Short tail vs mid tail vs <span className="blue">long tail keywords</span></h2>
            <p className="s-sub">Where each keyword type fits in your strategy, and what you can realistically expect from it.</p>
          </div>
          <table className="ratio-table">
            <thead>
              <tr>
                {['Type', 'Example', 'Competition', 'Best Use'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Short Tail (1–2 words)', example: '"running shoes"', comp: 'Brutal', cls: 'risk-bad', use: 'Long-term pillar goal only' },
                { type: 'Mid Tail (2–3 words)', example: '"trail running shoes"', comp: 'High', cls: 'risk-warn', use: 'Category pages on established sites' },
                { type: 'Long Tail (3–5 words)', example: '"waterproof trail running shoes women"', comp: 'Low to Medium', cls: 'risk-safe', use: 'Product pages, comparison posts' },
                { type: 'Question / Conversational (5+ words)', example: '"what are the best trail shoes for wide feet"', comp: 'Very Low', cls: 'risk-safe', use: 'Blog content, FAQ pages, AI search visibility' },
              ].map(r => (
                <tr key={r.type}>
                  <td className="ratio-anchor-type">{r.type}</td>
                  <td style={{ fontStyle: 'italic' }}>{r.example}</td>
                  <td><span className={`ratio-risk ${r.cls}`}>{r.comp}</span></td>
                  <td>{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ratio-note">
            <strong>The 70% rule:</strong> studies of search demand consistently show that long tail phrases make up roughly 70% of all searches performed. Head terms get the attention; the long tail gets the traffic. A healthy content plan spends most of its effort where most of the searches actually happen.
          </div>
        </div>
      </section>

      {/* ─── MISTAKES SECTION ─── */}
      <section className="section mistakes-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Mistakes</div>
            <h2 className="s-title">5 long tail keyword mistakes <span className="blue">(and how to fix them)</span></h2>
            <p className="s-sub">The generator finds the keywords. Avoiding these mistakes is what turns them into traffic.</p>
          </div>
          <div className="mistakes-grid">
            {[
              { n: '01', title: 'Targeting Zero-Volume Phrases', body: 'Ultra-specific phrases feel safe because competition is zero, but so is the traffic. The demand signal exists precisely to filter these out: if Google does not autocomplete a phrase, almost nobody types it.', bad: 'Building a page for "blue ceramic pour over coffee maker with wooden handle india"', good: 'Targeting "ceramic pour over coffee maker" (High demand) and covering variations within the page' },
              { n: '02', title: 'One Thin Page Per Keyword', body: 'Creating a separate shallow page for every tiny variation splits your authority and triggers cannibalization. Google treats near-identical long tail phrases as the same intent.', bad: '10 pages: "best yoga mat", "top yoga mat", "great yoga mats"...', good: 'One comprehensive page targeting the cluster, with variations as H2 subtopics' },
              { n: '03', title: 'Ignoring the Intent Label', body: 'A question keyword needs a guide, a buyer keyword needs a product or comparison page. Publishing the wrong format for the intent means ranking nowhere regardless of competition.', bad: 'Product page for "how to choose a coffee maker"', good: 'Buying guide for the question, product page for "buy drip coffee maker online"' },
              { n: '04', title: 'Skipping the Difficulty Check', body: 'Long tail usually means easier, not always. Some specific phrases are dominated by big publishers. Thirty seconds of scoring saves weeks of wasted content.', bad: 'Assuming every 5-word phrase is low competition', good: 'Running the shortlist through the keyword difficulty checker before writing' },
              { n: '05', title: 'Forgetting Seasonality and Trends', body: 'Some long tail phrases spike for two months and die. Committing evergreen resources to seasonal phrases, or vice versa, wastes both.', bad: 'Publishing "diwali gift ideas for employees" in December', good: 'Scheduling seasonal content 8-10 weeks before the peak, checking trends first' },
            ].map(m => (
              <div key={m.n} className="mistake-card">
                <div className="mistake-card-top">
                  <div className="mistake-num">Mistake {m.n}</div>
                  <div className="mistake-title">{m.title}</div>
                  <div className="mistake-body-text">{m.body}</div>
                </div>
                <div className="code-example">
                  <div className="code-bad"><span className="code-label">✗</span><span className="code-text">{m.bad}</span></div>
                  <div className="code-good"><span className="code-label">✓</span><span className="code-text">{m.good}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO FIND FREE — PROSE ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Free Methods</div>
            <h2 className="s-title">How to find long tail keywords <span className="blue">for free</span></h2>
          </div>
          <div className="prose-content">
            <p>This generator is the fastest route, but it works even better combined with the other free discovery methods. Here is the complete free toolkit:</p>
            <ul>
              <li><strong>This long tail keyword generator.</strong> One seed keyword mines 300-500 real Google Autocomplete queries with demand, intent, and type labels. Start here and export the list.</li>
              <li><strong>Google Autocomplete.</strong> Type your seed keyword and note what Google suggests. Add a letter (a, b, c...) after the seed to force new variations.</li>
              <li><strong>People Also Ask boxes.</strong> Every PAA question is a long tail keyword with proven search demand. Click a few open and the list keeps growing.</li>
              <li><strong>Google Search Console.</strong> The Performance report shows real queries where you already get impressions. Filter for queries with 4+ words and position 11-30: those are long tail terms one optimization push away from page one.</li>
              <li><strong>Related searches.</strong> The suggestions at the bottom of every results page are Google telling you which variations share intent.</li>
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">Workflow that compounds</div>
              <p>Generate with the tool, validate demand against autocomplete and PAA, then score everything with the <a href="/tools/keyword-difficulty-checker/" style={{ color: 'var(--blue)' }}>keyword difficulty checker</a>. Fifteen minutes of research replaces the guesswork that sinks most content plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STRATEGIES — PROSE ALT ─── */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Strategies</div>
            <h2 className="s-title">Long tail strategies by <span className="blue">business type</span></h2>
          </div>
          <div className="prose-content">
            <p>The same generator output feeds very different playbooks depending on what you sell:</p>
            <ul>
              <li><strong>Content marketing and blogs:</strong> build around question-based keywords. Each question becomes a post, each cluster of questions becomes a pillar guide, and question phrasing doubles as AI-search-ready headings.</li>
              <li><strong>Local businesses:</strong> target service + location combinations like &ldquo;plumber in Sector 18 Noida&rdquo; or &ldquo;best restaurant near Connaught Place.&rdquo; Competition for hyper-local phrases is usually a handful of unoptimized listings.</li>
              <li><strong>eCommerce stores:</strong> focus on product + modifier combinations: &ldquo;wireless earbuds under 3000,&rdquo; &ldquo;organic skincare for sensitive skin.&rdquo; These map directly to category and filter pages buyers actually want.</li>
              <li><strong>Service businesses:</strong> target problem + solution phrasing like &ldquo;laptop screen repair near me&rdquo; or &ldquo;small business accounting software.&rdquo; The problem phrasing captures customers before they know which provider to search for.</li>
              <li><strong>PPC campaigns:</strong> long tail phrases carry lower cost-per-click and higher conversion rates. Export the buyer-intent keywords to CSV and use them as exact-match ad groups.</li>
            </ul>
            <p>Whatever the business type, the sequencing is identical: win the long tail cluster first, interlink it, and let the accumulated authority carry your pillar page up for the head term.</p>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON SECTION ─── */}
      <section className="section comparison-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Comparison</div>
            <h2 className="s-title">SEOShouts vs other <span className="blue">long tail keyword tools</span></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  {['Feature', 'SEOShouts', 'LongTail Pro', 'KeywordTool.io', 'AnswerThePublic', 'Ubersuggest'].map((c, i) => (
                    <th key={c} className={i === 1 ? 'highlight' : ''}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Free to Use', '✅ Forever', '❌ ($59+/mo)', 'Limited (no volume)', 'Limited (3/day)', 'Limited (3/day)'],
                  ['Real Google Autocomplete Mining', '✅ 50+ probes', '❌', '✅', '✅ (Limited)', '✅ (Limited)'],
                  ['Intent Classification', '✅', '✅', '❌', '❌', '❌'],
                  ['Location Targeting', '✅', '✅', '✅', '✅', '✅'],
                  ['Multi-Language', '✅ 6 languages', '✅', '✅', '✅', '✅'],
                  ['CSV Export (Free)', '✅', '❌', '❌ (Paid only)', '❌ (Paid only)', '✅ (Limited)'],
                  ['No Login Required', '✅', '❌', '✅', '❌ (Account needed)', '❌ (Google login)'],
                ].map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={ci === 1 ? 'highlight-col' : ''}>
                        {cell.startsWith('✅') ? <span className="check-yes">{cell}</span> :
                         cell.startsWith('❌') ? <span className="check-no">{cell.replace('❌', '✗')}</span> :
                         cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-cards">
            <div style={{ background: 'var(--green-bg)', border: '1px solid #86efac', borderLeft: '4px solid var(--green)', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: '#14532d', marginBottom: '0.6rem' }}>When to Choose SEOShouts</h3>
              <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.7 }}>Use this tool for <strong>unlimited free long tail research from real Google Autocomplete data</strong>: 300-500 real queries per seed with demand and intent labels, per-country targeting, and CSV export, with no daily paywall interrupting a research session.</p>
            </div>
            <div style={{ background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--blue-dark)', marginBottom: '0.6rem' }}>When You Might Need More</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--blue-dark)', lineHeight: 1.7 }}>If you need clickstream-verified volumes, SERP history, or rank tracking on thousands of keywords, a paid suite earns its cost. For discovering what to write and which phrases to bid on, this free generator covers the complete workflow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CHECKLIST SECTION ─── */}
      <section className="section checklist-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Research Checklist</div>
            <h2 className="s-title">Long tail keyword checklist <span className="blue">(before you publish)</span></h2>
            <p className="s-sub">Run every shortlisted keyword through these checks and your content plan stops leaking effort.</p>
          </div>
          <div className="checklist-grid">
            {[
              { title: '📊 Validate Demand', items: ['Demand signal is Medium or High (or Low with buyer intent)', 'Phrase appears in Google Autocomplete or PAA', 'Trend is stable or growing, not a dead spike', 'Cluster has 5+ related variations worth covering'] },
              { title: '🎯 Match the Intent', items: ['Intent label matches the page type you plan', 'Top 10 checked for content format', 'Buyer keywords mapped to product/service pages', 'Question keywords mapped to guides and FAQs'] },
              { title: '🔧 Confirm Winnability', items: ['Difficulty score checked for your target country', 'No 5+ big brands locking the SERP', 'Your site\'s authority fits the score band', 'One primary keyword per page, no cannibalization'] },
              { title: '🏗️ Plan the Cluster', items: ['Keyword assigned to a pillar topic', 'Internal links planned from related content', 'Variations used as H2/H3 subtopics', 'CSV exported and added to the content calendar'] },
            ].map(cat => (
              <div key={cat.title} className="checklist-card">
                <div className="checklist-head">{cat.title}</div>
                <div className="checklist-items">
                  {cat.items.map((item, i) => (
                    <div key={i} className="checklist-item">
                      <input type="checkbox" id={`${cat.title}-${i}`} />
                      <label htmlFor={`${cat.title}-${i}`} className="checklist-text">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently asked questions</h2>
            <p className="s-sub">Everything you need to know about generating and using long tail keywords.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'What is a long tail keyword generator?', a: 'A long tail keyword generator is a tool that expands one broad seed keyword into hundreds of longer, more specific search phrases that real people type into Google. SEOShouts\' version mines them live from Google Autocomplete using 50+ query patterns, then adds demand signals and intent labels so you can prioritize instantly.' },
              { q: 'Is this long tail keyword tool really free?', a: 'Yes, completely free. No account, no credit card, no daily paywall on core features. Real Google Autocomplete mining, intent classification, and CSV export, the features most tools reserve for paid plans, are included for every user.' },
              { q: 'How do I find long tail keywords for free?', a: 'Enter a seed keyword in the generator above, pick your location and language, and generate. Combine the results with Google Autocomplete, People Also Ask boxes, and your own Search Console query data for complete coverage. All four methods are free.' },
              { q: 'What is the difference between short tail and long tail keywords?', a: 'Short tail keywords are 1-2 word phrases with huge volume and brutal competition, like "running shoes." Long tail keywords are 3+ word phrases with lower individual volume but clearer intent and far easier rankings, like "waterproof trail running shoes for women." Long tail phrases collectively account for roughly 70% of all searches.' },
              { q: 'Where do the keyword suggestions come from?', a: 'Directly from Google Autocomplete, the same suggestions Google shows searchers as they type. Every phrase is a real query, and the High/Medium/Low demand signal is derived from Google\'s own popularity ordering of those suggestions, not a fabricated volume number.' },
              { q: 'Can I use this for PPC campaigns?', a: 'Absolutely. Long tail keywords typically cost less per click and convert better in paid search. Export the buyer-intent suggestions to CSV and use them as tightly themed exact-match ad groups.' },
              { q: 'How many keywords can I generate?', a: 'Each generation produces a full list of suggestions from your seed keyword, and you can run multiple generations per session. Use different seed keywords to build out complete topic maps.' },
              { q: 'Can I save or export my keyword lists?', a: 'Yes. Export any generated list to a CSV file or copy all keywords to your clipboard with one click, ready for spreadsheets, content calendars, or campaign builders.' },
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
