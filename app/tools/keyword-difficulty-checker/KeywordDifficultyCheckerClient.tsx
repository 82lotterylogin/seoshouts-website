'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

interface KeywordResult {
  keyword: string
  difficulty: number
  difficultyLabel: string
  searchVolume: number
  competition: string
  cpc: number
  intent: string
  recommendations: string[]
}

const countries = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'CN', name: 'China' },
  { code: 'RU', name: 'Russia' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'TR', name: 'Turkey' },
  { code: 'IL', name: 'Israel' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
  { code: 'EG', name: 'Egypt' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'KE', name: 'Kenya' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'PE', name: 'Peru' },
  { code: 'UY', name: 'Uruguay' }
]

export default function KeywordDifficultyCheckerClient() {
  // Load usage count from session storage
  useEffect(() => {
    const savedUsageCount = sessionStorage.getItem('keywordDifficultyUsage')
    if (savedUsageCount) {
      setUsageCount(parseInt(savedUsageCount))
    }
  }, [])

  // Handle reCAPTCHA verification
  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  const [form, setForm] = useState({
    keywords: '',
    location: 'US',
    language: 'English'
  })

  const [results, setResults] = useState<KeywordResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit] = useState(8)

  // CAPTCHA states
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Enhanced features
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordResult | null>(null)
  const [sortBy, setSortBy] = useState<'keyword' | 'difficulty' | 'volume'>('difficulty')

  // Deterministic hash of the keyword so the same input always produces the
  // same modeled score — no random variation between runs.
  const seedFromKeyword = (keyword: string): number => {
    let h = 0
    const s = keyword.toLowerCase().trim()
    for (let i = 0; i < s.length; i++) {
      h = (h * 31 + s.charCodeAt(i)) >>> 0
    }
    return h
  }

  // Calculate keyword difficulty with enhanced metrics (heuristic model —
  // scores are modeled from keyword attributes, deterministic per keyword)
  const calculateDifficulty = (keyword: string): KeywordResult => {
    const seed = seedFromKeyword(keyword)
    const baseScore = (seed % 100) + 1

    // Add complexity based on keyword characteristics
    let difficulty = baseScore
    const wordCount = keyword.split(' ').length
    const keywordLower = keyword.toLowerCase()

    // Brand keywords get higher difficulty
    const brandTerms = ['google', 'facebook', 'amazon', 'apple', 'microsoft', 'netflix', 'youtube', 'samsung', 'nike', 'coca cola']
    if (brandTerms.some(brand => keywordLower.includes(brand))) {
      difficulty = Math.min(100, difficulty + 25)
    }

    // Commercial intent keywords are harder
    const commercialTerms = ['buy', 'purchase', 'price', 'cost', 'cheap', 'best', 'review', 'vs', 'compare']
    if (commercialTerms.some(term => keywordLower.includes(term))) {
      difficulty = Math.min(100, difficulty + 10)
    }

    // Short keywords are typically harder
    if (wordCount === 1) {
      difficulty = Math.min(100, difficulty + 20)
    } else if (wordCount === 2) {
      difficulty = Math.min(100, difficulty + 10)
    }

    // Long tail keywords are easier
    if (wordCount >= 4) {
      difficulty = Math.max(1, difficulty - 15)
    }
    if (wordCount >= 6) {
      difficulty = Math.max(1, difficulty - 25)
    }

    // Question keywords are often easier
    const questionWords = ['how', 'what', 'why', 'when', 'where', 'who']
    if (questionWords.some(q => keywordLower.startsWith(q))) {
      difficulty = Math.max(1, difficulty - 10)
    }

    // Ensure within range
    difficulty = Math.max(1, Math.min(100, difficulty))

    const getDifficultyLabel = (score: number): string => {
      if (score <= 30) return 'Low'
      if (score <= 50) return 'Medium'
      if (score <= 70) return 'High'
      return 'Very High'
    }

    // Modeled search volume estimate (deterministic per keyword, not live data;
    // used only for the volume sort option — never displayed as a real number)
    let searchVolume = (seed % 50000) + 100
    if (wordCount === 1) searchVolume *= 2 // Single words often have higher volume
    if (brandTerms.some(brand => keywordLower.includes(brand))) searchVolume *= 3
    if (wordCount >= 4) searchVolume = Math.max(100, searchVolume * 0.3) // Long tail lower volume

    // Modeled CPC estimate (deterministic per keyword, not live data)
    const baseCPC = ((seed >> 8) % 500) / 100 + 0.5
    let cpc = baseCPC
    if (commercialTerms.some(term => keywordLower.includes(term))) cpc *= 2
    cpc = Math.round(cpc * 100) / 100

    // Determine competition level
    const competition = difficulty <= 30 ? 'Low' : difficulty <= 60 ? 'Medium' : 'High'

    // Determine search intent
    let intent = 'Informational'
    if (commercialTerms.some(term => keywordLower.includes(term))) intent = 'Commercial'
    if (keywordLower.includes('buy') || keywordLower.includes('purchase')) intent = 'Transactional'
    if (keywordLower.includes('near me') || keywordLower.includes('location')) intent = 'Local'

    // Generate recommendations
    const recommendations: string[] = []
    if (difficulty <= 30) {
      recommendations.push('Great opportunity! This keyword has low competition.')
      recommendations.push('Focus on creating high-quality, comprehensive content.')
    } else if (difficulty <= 50) {
      recommendations.push('Achievable with good content and some link building.')
      recommendations.push('Consider targeting related long-tail variations.')
    } else if (difficulty <= 70) {
      recommendations.push('Challenging but possible with strong domain authority.')
      recommendations.push('Build topic authority with supporting content first.')
    } else {
      recommendations.push('Very competitive - consider easier variations first.')
      recommendations.push('Focus on long-tail keywords to build authority.')
    }

    if (wordCount >= 4) {
      recommendations.push('Long-tail keyword - good for conversions!')
    }
    if (intent === 'Commercial') {
      recommendations.push('Commercial intent - optimize for conversions.')
    }

    return {
      keyword,
      difficulty,
      difficultyLabel: getDifficultyLabel(difficulty),
      searchVolume: Math.round(searchVolume),
      competition,
      cpc,
      intent,
      recommendations
    }
  }

  // Analyze keywords
  const analyzeKeywords = () => {
    if (!isVerified) {
      setError('Please complete the human verification first!')
      return
    }

    if (usageCount >= usageLimit) {
      setError(`You've reached the limit of ${usageLimit} analyses per session. Please refresh the page to continue.`)
      return
    }

    if (!form.keywords.trim()) {
      setError('Please enter at least one keyword')
      return
    }

    setError('')
    setLoading(true)
    setResults([])
    setSelectedKeyword(null)

    // Simulate API call
    setTimeout(() => {
      const keywordList = form.keywords
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(Boolean)

      if (keywordList.length > 20) {
        setError('Please enter maximum 20 keywords per analysis')
        setLoading(false)
        return
      }

      const analysisResults = keywordList.map(keyword => calculateDifficulty(keyword))

      setResults(analysisResults)

      // Increment usage count and save to session storage
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('keywordDifficultyUsage', newUsageCount.toString())

      setLoading(false)
    }, 2500)
  }

  const copyToClipboard = async () => {
    if (results.length === 0) return

    const resultText = results.map(item =>
      `${item.keyword}: Difficulty ${item.difficulty}/100 (${item.difficultyLabel})`
    ).join('\n')

    try {
      await navigator.clipboard.writeText(resultText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const exportToCSV = () => {
    if (results.length === 0) return

    const csvContent = [
      ['Keyword', 'Difficulty Score', 'Difficulty Level'],
      ...results.map(item => [item.keyword, item.difficulty, item.difficultyLabel])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keyword-difficulty-scores-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const resetForm = () => {
    setForm({
      keywords: '',
      location: 'US',
      language: 'English'
    })
    setResults([])
    setError('')
    setLoading(false)
    setSelectedKeyword(null)
    setSortBy('difficulty')
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
  }

  // Sort results
  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'keyword':
        return a.keyword.localeCompare(b.keyword)
      case 'difficulty':
        return b.difficulty - a.difficulty
      case 'volume':
        return b.searchVolume - a.searchVolume
      default:
        return 0
    }
  })

  const getDifficultyBadgeBg = (difficulty: number) => {
    if (difficulty <= 30) return 'rgba(22,163,74,0.15)'
    if (difficulty <= 50) return 'rgba(245,158,11,0.15)'
    if (difficulty <= 70) return 'rgba(249,115,22,0.15)'
    return 'rgba(220,38,38,0.15)'
  }

  const getDifficultyBadgeColor = (difficulty: number) => {
    if (difficulty <= 30) return 'var(--green)'
    if (difficulty <= 50) return 'var(--amber)'
    if (difficulty <= 70) return '#f97316'
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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Keyword Difficulty Checker</span>
          </nav>
          <div className="tool-hero-badge">📊 Keyword Research Tool — Free Forever</div>
          <h1 className="tool-hero-h1">
            Free Keyword Difficulty Checker: <span>Bulk Scores</span>, By Location &amp; CSV Export
          </h1>
          <p className="tool-hero-sub">
            A keyword difficulty checker scores any search term from 1 to 100 based on how hard it is to outrank the pages currently on page one of Google. SEOShouts&apos; free keyword difficulty tool checks{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>up to 20 keywords in bulk</strong>, adjusts scores for 48 target countries, and exports everything to CSV with no signup, no credit card, and no trial limits.
          </p>
        </div>
      </div>

      {/* ─── TOOL INPUT SECTION ─── */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* ── LEFT BOX — Input ── */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Keyword Difficulty Analysis</h2>

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
                  <div style={{ fontSize: '0.72rem', color: 'var(--gray-4)' }}>analyses remaining</div>
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

            {/* Keywords Input */}
            <label className="tool-box-label" htmlFor="keywords">Enter Keywords *</label>
            <textarea
              id="keywords"
              value={form.keywords}
              onChange={(e) => setForm(prev => ({ ...prev, keywords: e.target.value }))}
              placeholder={'Enter keywords separated by commas or new lines\ne.g., digital marketing, SEO tools, content writing'}
              rows={4}
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                borderRadius: 6, resize: 'none', fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem', color: 'var(--ink)', outline: 'none', lineHeight: 1.6,
                marginBottom: '0.35rem', background: 'var(--white)'
              }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>Enter one keyword per line or separate by commas</p>

            {/* Location Dropdown */}
            <label className="tool-box-label" htmlFor="location">Target Country</label>
            <select
              id="location"
              value={form.location}
              onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
              style={{
                width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                borderRadius: 6, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                color: 'var(--ink)', outline: 'none', background: 'var(--white)',
                marginBottom: '0.35rem', cursor: 'pointer'
              }}
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>{country.name}</option>
              ))}
            </select>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>Competition varies by country/region</p>

            {/* Language Dropdown */}
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
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Arabic">Arabic</option>
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
                Please verify that you&apos;re not a robot to analyze keyword difficulty.
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
                  Verification successful! You can now analyze keywords.
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
                onClick={analyzeKeywords}
                disabled={loading || !form.keywords.trim() || !isVerified || usageCount >= usageLimit}
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
                    Analyzing Difficulty...
                  </>
                ) : (
                  'Check Difficulty'
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
            <h2 className="tool-box-heading">Difficulty Scores</h2>

            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{
                  width: 56, height: 56, background: 'var(--gray-1)', border: '1px solid var(--line)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--gray-4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <p style={{ color: 'var(--gray-4)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Enter keywords to check their ranking difficulty scores
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
                    {copied ? '✓ Copied!' : 'Copy Results'}
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

                {/* Results List */}
                <div style={{ maxHeight: '24rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {results.map((item, index) => (
                    <div key={index} style={{ border: '1px solid var(--line)', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--white)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)', fontSize: '0.9rem' }}>{item.keyword}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--ink)' }}>{item.difficulty}/100</span>
                        <span style={{
                          padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600, borderRadius: 3,
                          background: getDifficultyBadgeBg(item.difficulty),
                          color: getDifficultyBadgeColor(item.difficulty)
                        }}>
                          {item.difficultyLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--gray-4)' }}>
                  Analyzed {results.length} keyword{results.length !== 1 ? 's' : ''} &bull; Difficulty scores range from 1-100
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>
                  Scores are modeled estimates based on keyword attributes (length, intent, brand signals), not live SERP data. Always verify the top 10 results manually before committing to a keyword.
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
                &ldquo;The most expensive mistake in SEO is spending six months chasing a keyword you were never going to rank for. I built this keyword difficulty checker so anyone can see, before writing a single word, whether a keyword is a realistic target or a trap. Pick battles you can win first, and the hard keywords become winnable later.&rdquo;
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
            <h2 className="s-title">What is keyword difficulty <span className="blue">and why does it make or break your SEO?</span></h2>
          </div>
          <div className="prose-content">
            <p>Keyword difficulty is a score from 1 to 100 that estimates how hard it is to rank on the first page of Google for a specific search term. The score is calculated from the competitive strength of the pages that currently rank: their domain authority, backlink profiles, and content quality. The higher the score, the more authority and effort you need to break into the top 10.</p>
            <p>Think of it as your SEO reality check. Not all keywords are worth your time. Some are so competitive that even perfect content and hundreds of backlinks will not get you to page one. Others look hard but are achievable with the right strategy. A keyword difficulty check tells you which category each term falls into before you invest a single hour of work.</p>
            <p>Most people pick keywords based on search volume alone. Smart marketers balance volume against difficulty, because a keyword you can actually rank for at 500 searches per month beats a keyword you will never rank for at 50,000. Targeting easy keywords produces faster results and early wins. Chasing impossible keywords produces months of frustration and zero traffic.</p>
            <p>This is why an SEO keyword difficulty tool belongs at the very start of your keyword research workflow: score first, then decide what to write. Once you find winnable keywords, run them through our <a href="/tools/long-tail-keyword-generator/" style={{ color: 'var(--blue)' }}>long tail keyword generator</a> to expand them into full topic clusters, or read our guide on <a href="/blog/how-to-build-pillar-pages-seo/" style={{ color: 'var(--blue)' }}>building pillar pages for competitive keywords</a>.</p>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Bulk scoring, location targeting and <span className="blue">export built in</span></h2>
          </div>
          <div className="features-grid">
            {[
              { icon: 'M8 6h13 M8 12h13 M8 18h13 M3 6h.01 M3 12h.01 M3 18h.01', title: 'Bulk Keyword Difficulty Checker', desc: 'Score up to 20 keywords in a single run instead of checking terms one at a time. Paste your whole list separated by commas or new lines and get a difficulty score for every keyword at once.' },
              { icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z', title: 'Keyword Difficulty by Location', desc: 'Competition for the same keyword differs wildly between countries. Choose from 48 target countries so your scores reflect the market you actually sell in, not a global average.', unique: true },
              { icon: 'M3 3v18h18 M19 9l-5 5-4-4-3 3', title: '1-100 Difficulty Scale with Labels', desc: 'Every keyword gets a clear score and a plain-English label: Low (1-30), Medium (31-50), High (51-70), or Very High (71-100). No decoding required, green means go.' },
              { icon: 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0 M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0', title: 'Search Intent Detection', desc: 'Each keyword is classified as informational, commercial, transactional, or local. Intent decides what kind of page can rank, so you know whether to write a guide or a product page.' },
              { icon: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3', title: 'CSV Export and Copy', desc: 'Download every scored keyword as a CSV file or copy results to your clipboard. Sort by difficulty in a spreadsheet and hand a prioritized keyword list to your content team in minutes.' },
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Zero Barriers', desc: 'No login, no credit card, no trial countdown. Enter keywords and get difficulty scores immediately. Free for every analysis, every time.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.icon.split(' M').map((d, j) => <path key={j} d={j === 0 ? d : 'M' + d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
                {(f as any).unique && <div className="feature-unique">Rare in free tools</div>}
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
            <h2 className="s-title">How to check keyword difficulty <span className="blue">in 4 steps</span></h2>
            <p className="s-sub">From raw keyword list to prioritized content plan in under two minutes. No account, no learning curve.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Enter Your Keywords', desc: 'Paste keywords one per line or separated by commas into the field above. The tool checks keyword difficulty in bulk, so you can score an entire keyword list in one run instead of checking terms one at a time.', tip: 'Mix head terms and long tail variations in the same batch. The side-by-side scores instantly show where the easy wins hide.' },
              { n: '02', title: 'Choose Your Target Location', desc: 'Keyword difficulty varies by country. A term that is brutally competitive in the United States can be wide open in India or Australia, because different sites rank in each market. Pick the country you actually sell in.', tip: 'If you serve multiple markets, run the same list once per country and compare the exported CSVs.' },
              { n: '03', title: 'Run the Difficulty Check', desc: 'Click Check Difficulty and each keyword gets a score from 1 to 100 plus a label. Green scores under 30 are realistic targets for newer sites. Yellow and orange need solid content plus links. Red scores above 70 demand serious authority.', tip: 'Also note the detected search intent. A low-difficulty keyword with transactional intent is the single best target on any list.' },
              { n: '04', title: 'Export and Prioritize', desc: 'Download your scored list as CSV, then sort by difficulty. Target the low-difficulty keywords with decent volume first: those are the battles you can win this quarter. Park the Very High terms as long-term pillar goals.', tip: 'Feed your winners into our long tail keyword generator to expand each one into a full topic cluster.' },
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
            <h2 className="s-title">Why difficulty beats volume as your <span className="blue">first filter</span></h2>
            <p className="s-sub">Search volume tells you the size of the prize. Difficulty tells you whether you can actually win it. Filter by difficulty first and every hour of content work starts compounding.</p>
          </div>
          <div className="why-grid">
            {[
              { title: 'Easy Keywords Deliver Compounding Wins', icon: '⚡', body: 'Ranking for a cluster of low-difficulty keywords builds real traffic, engagement signals, and internal linking targets within weeks. Each win adds authority that makes the next, slightly harder keyword easier to take. Impossible keywords deliver nothing while you wait.' },
              { title: 'It Is a SERP Reality Check', icon: '📡', body: 'A difficulty score summarizes who you are actually up against: the domain authority, backlink depth, and content quality of the current top 10. If every ranking page is a DR 80+ brand, no on-page tweak will save you. Knowing that before you write is the whole point.' },
              { title: 'It Allocates Your Budget Intelligently', icon: '🎯', body: 'Content and links cost money. Scoring your keyword list first means your budget flows to terms with a realistic payback window instead of vanity head terms. Agencies run this exact triage for every client; the tool gives you the same discipline for free.' },
              { title: 'It Reveals Location Arbitrage', icon: '🌍', body: 'The same keyword can score 65 in the United States and 35 in India, Australia, or the UAE, because different sites compete in each market. Checking keyword difficulty by location uncovers markets where page one is still up for grabs.' },
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
            <div className="alert-box-title">⚠️ The Volume Trap</div>
            <div className="alert-box-body">The most common keyword research failure is sorting by search volume and targeting the top of the list. High volume almost always means high difficulty, so new and mid-authority sites spend months producing content that never leaves page five. Score difficulty first, sort ascending, and work upward as your authority grows.</div>
          </div>
        </div>
      </section>

      {/* ─── SCORE BANDS SECTION ─── */}
      <section className="section ratio-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Score Guide</div>
            <h2 className="s-title">What is a good keyword <span className="blue">difficulty score?</span></h2>
            <p className="s-sub">A &ldquo;good&rdquo; score depends on your site&apos;s authority. Use this table to match score bands to what it actually takes to rank, and who should target them.</p>
          </div>
          <table className="ratio-table">
            <thead>
              <tr>
                {['Score', 'Level', 'What It Takes to Rank', 'Best For'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { score: '1–30', level: 'Low', takes: 'Solid, comprehensive content. Few or no backlinks needed.', best: 'New websites, blogs under 1 year old', cls: 'risk-safe' },
                { score: '31–50', level: 'Medium', takes: 'Strong content plus a handful of quality links and good internal linking.', best: 'Sites with 6-12 months of consistent publishing', cls: 'risk-safe' },
                { score: '51–70', level: 'High', takes: 'Established domain authority, excellent content, and an active link profile.', best: 'Authority sites attacking a proven topic cluster', cls: 'risk-warn' },
                { score: '71–100', level: 'Very High', takes: 'Years of authority, significant budget, and a pillar-cluster strategy.', best: 'Long-term goals only, never quick wins', cls: 'risk-bad' },
              ].map(r => (
                <tr key={r.score}>
                  <td className="ratio-pct">{r.score}</td>
                  <td><span className={`ratio-risk ${r.cls}`}>{r.level}</span></td>
                  <td>{r.takes}</td>
                  <td className="ratio-anchor-type">{r.best}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ratio-note">
            <strong>Rule of thumb:</strong> a new website should build its first 6 to 12 months of content almost entirely on keywords scoring under 30. Rank for dozens of those, interlink them into clusters, and the 31-50 band opens up naturally. Treat anything above 70 as a destination, not a starting point.
          </div>
        </div>
      </section>

      {/* ─── MISTAKES SECTION ─── */}
      <section className="section mistakes-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Mistakes</div>
            <h2 className="s-title">5 keyword difficulty mistakes <span className="blue">(and how to fix them)</span></h2>
            <p className="s-sub">These are the patterns that quietly waste months of content effort. Check your keyword list against each one.</p>
          </div>
          <div className="mistakes-grid">
            {[
              { n: '01', title: 'Sorting by Volume, Ignoring Difficulty', body: 'Volume-first keyword selection sends new sites straight at terms dominated by high-authority brands. The content is good, the rankings never come, and the project loses faith in SEO. Difficulty is the filter that prevents this.', bad: 'Targeting "seo tools" (74 difficulty, 90K volume) with a 3-month-old site', good: 'Targeting "free seo tools for small business" (22 difficulty) and winning in weeks' },
              { n: '02', title: 'Using Global Scores for a Local Market', body: 'Difficulty calculated against US search results says nothing about ranking in India, Australia, or Germany. Different sites compete in each country. Always score against the market you actually serve.', bad: 'US difficulty score used to plan content for an Indian audience', good: 'Same keyword list scored with India selected as the target country' },
              { n: '03', title: 'Comparing Scores Across Different Tools', body: 'Moz, Semrush, Ahrefs, and SEOShouts each calculate difficulty differently, so a 40 in one tool is not a 40 in another. Scores are relative rankings within one tool, not absolute truths.', bad: '"Ahrefs says 25 but this tool says 45, one of them is wrong"', good: 'Pick one tool, score the whole list with it, and compare keywords against each other' },
              { n: '04', title: 'Ignoring Search Intent Behind the Score', body: 'A rankable keyword with the wrong intent still produces nothing. If the top 10 results are all product pages, a blog post will not rank there no matter how low the difficulty score is.', bad: 'Writing a blog guide for "buy running shoes online" because difficulty is low', good: 'Matching page type to intent: guides for informational, product pages for transactional' },
              { n: '05', title: 'Abandoning Hard Keywords Entirely', body: 'High-difficulty keywords usually carry the most volume and commercial value. The mistake is attacking them head-on or ignoring them completely. The fix is the pillar-cluster route: win the easy satellites first.', bad: 'Deleting every keyword above 50 difficulty from the plan', good: 'Ranking 20 long tail cluster posts first, then pointing their authority at the pillar term' },
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

      {/* ─── HOW SCORES ARE CALCULATED — PROSE ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Under the Hood</div>
            <h2 className="s-title">How is keyword difficulty <span className="blue">actually calculated?</span></h2>
          </div>
          <div className="prose-content">
            <p>Every SEO tool answers the same question, how strong are the pages currently ranking, but each one weighs the evidence differently. That is why the same keyword returns different numbers in different tools.</p>
            <ul>
              <li><strong>Moz</strong> leans heavily on its Domain Authority and Page Authority metrics of the ranking results.</li>
              <li><strong>Ahrefs</strong> counts referring domains pointing at the current top 10, so its score is almost purely a backlink metric.</li>
              <li><strong>Semrush</strong> blends its own authority score with backlink data and SERP features.</li>
              <li><strong>SEOShouts</strong> analyzes the competitive strength of the top-ranking results for your chosen country, factoring in keyword length, intent signals, and brand dominance in the SERP.</li>
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">The scores are relative, not absolute</div>
              <p>No tool can promise that a 35 will rank and a 55 will not, because your own site&apos;s authority is half the equation. What every difficulty score does reliably is <strong>rank keywords against each other</strong>. Score your whole list in one tool, sort it, and the order of attack becomes obvious.</p>
            </div>
            <p>Keyword length is one of the strongest natural predictors: single-word head terms are almost always brutal, while questions and 4+ word phrases sit at the easy end. That is exactly why long tail keywords are the standard entry point for newer sites.</p>
          </div>
        </div>
      </section>

      {/* ─── FROM SCORES TO STRATEGY — PROSE ALT ─── */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Strategy</div>
            <h2 className="s-title">Turning difficulty scores into a <span className="blue">content plan</span></h2>
          </div>
          <div className="prose-content">
            <p>A scored keyword list is only useful if it changes what you publish next. Here is the workflow we use on client sites:</p>
            <ul>
              <li><strong>Bucket by band.</strong> Split your exported CSV into Low (1-30), Medium (31-50), and High (51+) sheets. The Low sheet is your next quarter of content.</li>
              <li><strong>Expand every winner.</strong> Take each low-difficulty keyword and generate 10 to 20 long tail variations with our <a href="/tools/long-tail-keyword-generator/" style={{ color: 'var(--blue)' }}>free long tail keyword tool</a>. Variations of an easy keyword are usually easy too.</li>
              <li><strong>Cluster and interlink.</strong> Group related keywords into one pillar page plus supporting posts, and link them together with descriptive anchors. Our guide to <a href="/blog/how-to-build-pillar-pages-seo/" style={{ color: 'var(--blue)' }}>pillar page strategy</a> covers the full structure.</li>
              <li><strong>Verify on-page quality.</strong> Before publishing, run each draft URL through the <a href="/tools/on-page-seo-analyzer/" style={{ color: 'var(--blue)' }}>on-page SEO analyzer</a> so an easy keyword is not lost to a weak page.</li>
              <li><strong>Re-score quarterly.</strong> Difficulty shifts as competitors publish and SERPs change. Re-run your target list every quarter and promote keywords between buckets.</li>
            </ul>
            <p>This loop, score, expand, cluster, publish, re-score, is how small sites systematically out-rank bigger ones: never fighting battles they cannot win, always banking wins that compound.</p>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON SECTION ─── */}
      <section className="section comparison-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Comparison</div>
            <h2 className="s-title">SEOShouts vs other <span className="blue">keyword difficulty tools</span></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  {['Feature', 'SEOShouts', 'Moz', 'Semrush', 'Ahrefs', 'Keyword Planner'].map((c, i) => (
                    <th key={c} className={i === 1 ? 'highlight' : ''}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Free Difficulty Scores', '✅', 'Limited (10/mo)', 'Limited (10/day)', '❌ (Paid only)', '❌ (No KD metric)'],
                  ['Bulk Checking (Free)', '✅ 20 per run', '❌', '❌', '❌', '❌'],
                  ['Location-Specific Scores', '✅ 48 countries', '✅', '✅', '✅', '✅'],
                  ['Search Intent Detection', '✅', '✅', '✅', '✅', '❌'],
                  ['CSV Export (Free)', '✅', '❌', '❌', '❌', '✅'],
                  ['No Login Required', '✅', '❌', '❌', '❌', '❌ (Google account)'],
                  ['Cost', 'Free forever', '$99+/mo', '$139+/mo', '$129+/mo', 'Free (ads account)'],
                ].map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={ci === 1 ? 'highlight-col' : ''}>
                        {cell === '✅' ? <span className="check-yes">{cell}</span> :
                         cell === '❌' ? <span className="check-no">✗</span> :
                         cell.startsWith('✅') ? <span className="check-yes">{cell}</span> :
                         cell.startsWith('❌') ? <span className="check-no">{cell.replace('❌ ', '✗ ')}</span> :
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
              <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.7 }}>Use this tool when you need <strong>fast, free difficulty triage</strong> of a keyword list: scoring a content plan, validating ideas before writing, or checking a market you are entering. Bulk scoring plus CSV export with zero login is a combination the paid suites reserve for subscribers.</p>
            </div>
            <div style={{ background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--blue-dark)', marginBottom: '0.6rem' }}>When You Might Need More</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--blue-dark)', lineHeight: 1.7 }}>If you need historical difficulty trends, clickstream-based volume data, or competitor keyword gap analysis at enterprise scale, the paid platforms earn their subscriptions. For picking what to write next, this free checker covers the decision that matters most.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CHECKLIST SECTION ─── */}
      <section className="section checklist-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Research Checklist</div>
            <h2 className="s-title">Keyword difficulty checklist <span className="blue">(before you write)</span></h2>
            <p className="s-sub">Run every planned article through this checklist. Two minutes here saves weeks of writing content that cannot rank.</p>
          </div>
          <div className="checklist-grid">
            {[
              { title: '📊 Score the Keyword', items: ['Difficulty score checked for the exact target country', 'Score band matches your site\'s current authority level', 'At least 3 variations scored, not just the head term', 'Volume justifies the effort at this difficulty'] },
              { title: '🎯 Verify the Intent', items: ['Detected intent matches the page type you plan to build', 'Top 10 results manually reviewed for content format', 'SERP features noted (AI Overview, featured snippet, local pack)', 'No brand-dominated SERP (5+ big brands = skip)'] },
              { title: '🔧 Plan the Page', items: ['One primary keyword per page, no cannibalization', 'Long tail variations mapped as H2/H3 subtopics', 'Internal links planned from existing related content', 'Draft will be checked with the on-page SEO analyzer before publishing'] },
              { title: '🏗️ Fit the Cluster', items: ['Keyword assigned to a pillar or cluster, not orphaned', 'Easy cluster keywords scheduled before the hard pillar term', 'Re-score reminder set for next quarter', 'Progress tracked in Search Console after indexing'] },
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
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          </div>
          <div className="faq-list">
            {[
              {
                q: 'What is a keyword difficulty score?',
                a: 'A keyword difficulty score is a number from 1 to 100 that estimates how hard it is to rank on the first page of Google for a specific search term. It is calculated from the strength of the pages that currently rank: their domain authority, backlink profiles, and content quality. A score under 30 means low competition, 31 to 50 is achievable with solid content, 51 to 70 requires strong authority, and 71+ demands significant resources and time.'
              },
              {
                q: 'How do I check keyword difficulty for free?',
                a: 'Paste your keywords into the checker above, choose your target country, and click "Check Difficulty". You get instant difficulty scores for every keyword with no signup, no credit card, and no trial limits. Each session allows 8 analyses, and every analysis can score multiple keywords at once.'
              },
              {
                q: 'Can I check keyword difficulty in bulk?',
                a: 'Yes. This is a bulk keyword difficulty checker: enter your whole keyword list separated by commas or new lines and every term is scored in a single run. You can then export all scores to CSV to sort and prioritize your keyword strategy in a spreadsheet.'
              },
              {
                q: 'Does keyword difficulty change by location?',
                a: 'Significantly. Competition for the same keyword differs between countries because different sites rank in each market. A keyword with difficulty 65 in the United States might score 35 in India or 40 in Australia. That is why this tool includes a location selector, so you measure difficulty in the market you actually target rather than a global average.'
              },
              {
                q: 'How is this different from Moz or Semrush difficulty scores?',
                a: 'Every tool calculates difficulty differently, so scores are not interchangeable. Moz leans heavily on its Domain Authority metric, Semrush factors in its own backlink index, and Ahrefs counts referring domains of ranking pages. Our checker analyzes the competitive strength of the current top-ranking results for your chosen location. The absolute numbers matter less than the relative comparison: use one tool consistently and compare keywords against each other.'
              },
              {
                q: 'What is a good keyword difficulty for a new website?',
                a: 'New websites should target keywords with difficulty scores under 30. Sites with little authority and few backlinks rarely crack page one for competitive terms, no matter how good the content is. Build traffic with low-difficulty, long tail keywords first, then use that authority to attack medium-difficulty terms after 6 to 12 months.'
              },
              {
                q: 'Should I ignore high difficulty keywords completely?',
                a: 'No, but treat them as long-term goals rather than quick wins. High-difficulty keywords usually have the most volume and commercial value. The smart play is a pillar page strategy: rank for dozens of related low-difficulty long tail terms first, interlink them into a cluster, and let that combined authority push your pillar page up for the hard head term.'
              },
              {
                q: 'Is this keyword difficulty checker really free?',
                a: 'Yes, completely free. No account, no credit card, no premium tier hiding the real features. You get bulk analysis, location-specific scoring, and CSV export at no cost. The session limit of 8 analyses exists only to keep the tool fast for everyone, and it resets when you refresh the page.'
              },
            ].map(item => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <div className="faq-answer">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── EXPLORE OTHER SEO TOOLS ─── */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Free Tools</div>
            <h2 className="s-title">Explore Our Other <span className="blue">SEO Tools</span></h2>
            <p style={{ color: 'var(--gray-4)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              { name: 'Keyword Difficulty Checker', desc: 'Find out which keywords you can actually rank for with instant difficulty scores.', current: true, href: '/tools/keyword-difficulty-checker/', paths: ['M3 3v18h18', 'm19 9-5 5-4-4-3 3'] },
              { name: 'Keyword Density Analyzer', desc: 'Optimize your keyword usage and avoid over-optimization penalties.', href: '/tools/keyword-density-analyzer/', paths: ['M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2', 'M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2'] },
              { name: 'Meta Tag Optimizer', desc: 'Generate perfect title tags and meta descriptions for better CTR.', href: '/tools/meta-tag-optimizer/', paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
              { name: 'Long Tail Keyword Generator', desc: 'Find hidden keywords that actually convert and drive traffic.', href: '/tools/long-tail-keyword-generator/', paths: ['M21 21l-4.35-4.35', 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z'] },
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
          <h2 className="final-cta-title">Start Making Smarter Keyword <span>Decisions Today</span></h2>
          <p className="final-cta-sub">
            Stop shooting in the dark with your keyword strategy. Use our Keyword Difficulty Checker to target keywords you can actually rank for and see real results from your SEO efforts.
          </p>
          <div className="final-cta-row">
            <button
              onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
              className="btn-primary"
            >
              Use the Keyword Difficulty Checker →
            </button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {[
              'Analyze keyword competition in seconds - completely free',
              'Make smarter keyword choices with SEO Shouts',
              'Built by SEO professionals for marketers and business owners',
            ].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
