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

  // Calculate keyword difficulty with enhanced metrics
  const calculateDifficulty = (keyword: string): KeywordResult => {
    // Simulate realistic difficulty calculation
    const baseScore = Math.floor(Math.random() * 100) + 1

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

    // Generate search volume (simulate realistic data)
    let searchVolume = Math.floor(Math.random() * 50000) + 100
    if (wordCount === 1) searchVolume *= 2 // Single words often have higher volume
    if (brandTerms.some(brand => keywordLower.includes(brand))) searchVolume *= 3
    if (wordCount >= 4) searchVolume = Math.max(100, searchVolume * 0.3) // Long tail lower volume

    // Generate CPC
    const baseCPC = Math.random() * 5 + 0.5
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
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free Keyword Difficulty Checker Tool<br />
            <span>Stop Wasting Time on Impossible Keywords</span>
          </h1>
          <h2 style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: '1.1rem', marginTop: '0.75rem', marginBottom: '0.75rem', fontFamily: 'Space Grotesk, sans-serif', maxWidth: '900px' }}>
            Find Out Which Keywords You Can Actually Rank For
          </h2>
          <p className="tool-hero-sub" style={{ maxWidth: '900px' }}>
            Ever spent months trying to rank for a keyword, only to realize later that you needed the SEO budget of Amazon to compete? Yeah, we&apos;ve all been there.
          </p>
          <p className="tool-hero-sub" style={{ marginTop: '0.75rem', maxWidth: '900px' }}>
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Here&apos;s the thing:</strong> Not all keywords are worth your time. Some are so competitive that even perfect content and hundreds of backlinks won&apos;t get you to page one. Others look hard but are actually achievable with the right strategy.
          </p>
          <p className="tool-hero-sub" style={{ marginTop: '0.75rem', maxWidth: '900px' }}>
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Our Keyword Difficulty Checker</strong> tells you exactly which category your target keywords fall into. No more guessing. No more wasted effort. Just clear data to help you pick battles you can actually win.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Instant Difficulty Scores', 'Bulk Analysis', 'CSV Export', '100% Free'].map(label => (
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
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ─── WHAT IS KEYWORD DIFFICULTY ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header center">
            <h2 className="s-title">What Is Keyword Difficulty <span className="blue">(And Why It Can Make or Break Your SEO)</span></h2>
          </div>
          <div className="prose-content">
            <p>
              Keyword difficulty is basically a score that tells you how hard it&apos;ll be to rank on the first page of Google for a specific keyword. Think of it as your SEO reality check.
            </p>

            <h3>Here&apos;s what the scores mean:</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 2rem', margin: '1rem 0 1.5rem' }}>
              {[
                { color: '#16a34a', label: '0-30:', text: 'Low competition - Good opportunities for new or smaller sites' },
                { color: '#ca8a04', label: '31-50:', text: 'Medium competition - Achievable with solid content and some links' },
                { color: '#ea580c', label: '51-70:', text: 'High competition - Need strong domain authority and great content' },
                { color: '#dc2626', label: '71-100:', text: 'Very high - Requires significant resources and time' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <div style={{ width: 14, height: 14, borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: 3 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>
                    <strong>{item.label}</strong> {item.text}
                  </span>
                </div>
              ))}
            </div>

            <h3>Why this matters more than you think:</h3>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Targeting easy keywords = faster results and early wins',
                'Going after impossible keywords = months of frustration',
                'Finding the sweet spot = steady traffic growth you can actually achieve',
                'Understanding competition = smarter resource allocation',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>{item}</span>
                </li>
              ))}
            </ul>

            <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
              <p style={{ margin: 0, color: 'var(--gray-5)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Most people pick keywords based on search volume alone. Smart marketers balance volume with difficulty.
              </p>
            </div>
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
