'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

export default function KeywordDensityAnalyzerClient() {
  const [form, setForm] = useState({
    content: '',
    targetKeyword: '',
    isAnalyzing: false,
    results: null as any
  })

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit] = useState(10)

  // Input mode selection
  const [inputMode, setInputMode] = useState<'text' | 'url'>('text')
  const [url, setUrl] = useState('')

  // CAPTCHA states
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  const [analysis, setAnalysis] = useState<{
    totalWords: number
    totalCharacters: number
    keywordCount: number
    keywordDensity: number
    topKeywords: Array<{ word: string; count: number; density: number }>
    recommendations: string[]
    readabilityScore: number
  } | null>(null)

  // Load usage count from session storage
  useEffect(() => {
    const savedUsageCount = sessionStorage.getItem('keywordAnalyzerUsage')
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

  // Clean and process text
  const cleanText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Fetch content from URL
  const fetchUrlContent = async (url: string): Promise<string> => {
    try {
      const response = await fetch('/api/fetch-url-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      const data = await response.json()
      if (data.success) {
        return data.content
      } else {
        throw new Error(data.error || 'Failed to fetch content')
      }
    } catch (error) {
      throw error
    }
  }

  // Calculate keyword density
  const analyzeContent = async () => {
    if (!isVerified) {
      alert('Please complete the human verification first!')
      return
    }

    // Check usage limit
    if (usageCount >= usageLimit) {
      alert(`You've reached the limit of ${usageLimit} analyses per session. Please refresh the page to continue.`)
      return
    }

    let contentToAnalyze = ''

    if (inputMode === 'text') {
      if (!form.content.trim()) {
        alert('Please enter some content to analyze')
        return
      }
      contentToAnalyze = form.content.trim()
    } else {
      if (!url.trim()) {
        alert('Please enter a URL to analyze')
        return
      }
      try {
        setForm(prev => ({ ...prev, isAnalyzing: true }))
        contentToAnalyze = await fetchUrlContent(url.trim())
        if (!contentToAnalyze.trim()) {
          alert('No content found at the provided URL')
          setForm(prev => ({ ...prev, isAnalyzing: false }))
          return
        }
      } catch (error) {
        alert('Failed to fetch content from URL. Please check the URL and try again.')
        setForm(prev => ({ ...prev, isAnalyzing: false }))
        return
      }
    }

    setForm(prev => ({ ...prev, isAnalyzing: true }))

    setTimeout(() => {
      const content = contentToAnalyze
      const cleanedContent = cleanText(content)
      const words = cleanedContent.split(' ').filter(word => word.length > 0)

      const totalWords = words.length
      const totalCharacters = content.length

      const targetKeyword = form.targetKeyword.toLowerCase().trim()
      let keywordCount = 0
      let keywordDensity = 0

      if (targetKeyword) {
        const keywordRegex = new RegExp(`\\b${targetKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
        const matches = content.match(keywordRegex)
        keywordCount = matches ? matches.length : 0
        keywordDensity = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
      }

      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within', 'without', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except', 'but', 'until', 'unless', 'since', 'while', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
      ])

      const wordCount: { [key: string]: number } = {}
      words.forEach(word => {
        if (word.length > 2 && !stopWords.has(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1
        }
      })

      const topKeywords = Object.entries(wordCount)
        .map(([word, count]) => ({
          word,
          count,
          density: (count / totalWords) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      const recommendations: string[] = []

      if (targetKeyword) {
        if (keywordDensity < 0.5) {
          recommendations.push(`Your target keyword "${targetKeyword}" appears ${keywordCount} times (${keywordDensity.toFixed(2)}%). Consider adding it 2-3 more times naturally.`)
        } else if (keywordDensity > 3) {
          recommendations.push(`Your target keyword "${targetKeyword}" appears ${keywordCount} times (${keywordDensity.toFixed(2)}%). This might be over-optimization. Consider reducing usage.`)
        } else {
          recommendations.push(`Great! Your target keyword "${targetKeyword}" has optimal density (${keywordDensity.toFixed(2)}%).`)
        }
      }

      if (totalWords < 300) {
        recommendations.push('Consider adding more content. Aim for at least 300-500 words for better SEO.')
      } else if (totalWords > 2000) {
        recommendations.push('Your content is quite long. Consider breaking it into multiple pages or sections.')
      }

      if (topKeywords.length > 0 && topKeywords[0].density > 5) {
        recommendations.push(`The word "${topKeywords[0].word}" appears very frequently (${topKeywords[0].density.toFixed(2)}%). Consider using synonyms for better readability.`)
      }

      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const avgWordsPerSentence = totalWords / Math.max(sentences, 1)
      const avgCharsPerWord = totalCharacters / Math.max(totalWords, 1)

      let readabilityScore = 100 - (avgWordsPerSentence * 1.5) - (avgCharsPerWord * 2)
      readabilityScore = Math.max(0, Math.min(100, readabilityScore))

      if (readabilityScore < 50) {
        recommendations.push('Consider using shorter sentences and simpler words to improve readability.')
      }

      setAnalysis({
        totalWords,
        totalCharacters,
        keywordCount,
        keywordDensity,
        topKeywords,
        recommendations,
        readabilityScore
      })

      // Increment usage count and save to session storage
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('keywordAnalyzerUsage', newUsageCount.toString())

      setForm(prev => ({ ...prev, isAnalyzing: false }))
    }, 1500)
  }

  const resetAnalysis = () => {
    setForm({
      content: '',
      targetKeyword: '',
      isAnalyzing: false,
      results: null
    })
    setUrl('')
    setInputMode('text')
    setAnalysis(null)
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) {
      recaptchaRef.current.reset()
    }
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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Keyword Density Analyzer</span>
          </nav>
          <div className="tool-hero-badge">🔑 SEO Content Tool — Free Forever</div>
          <h1 className="tool-hero-h1">
            Free Keyword Density <span>Analyzer</span>
          </h1>
          <p className="tool-hero-sub">
            Stop guessing about your keyword usage. Our{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Free Keyword Density Analyzer</strong>{' '}
            gives you instant insights into how often keywords appear in your content, helping you strike the perfect balance between optimization and natural readability. Whether you&apos;re writing blog posts, product descriptions, or web pages, this tool ensures your content is optimized without risking keyword stuffing penalties.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Instant Analysis', 'Top Keywords Report', 'SEO Recommendations', '100% Free'].map(label => (
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
            <h2 className="tool-box-heading">Content Analysis</h2>

            {/* Usage Counter */}
            {(usageCount > 0 || usageCount >= usageLimit) && (
              <div style={{
                marginBottom: '1rem', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center',
                background: usageCount >= usageLimit ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)',
                border: `1px solid ${usageCount >= usageLimit ? 'rgba(220,38,38,0.25)' : 'rgba(22,163,74,0.2)'}`,
                color: usageCount >= usageLimit ? 'var(--red)' : 'var(--green)',
              }}>
                {usageCount >= usageLimit
                  ? 'Session limit reached. Refresh page to continue.'
                  : `${usageLimit - usageCount} of ${usageLimit} session analyses remaining`
                }
              </div>
            )}

            {/* Input Mode Tabs */}
            <label className="tool-box-label">Choose Analysis Method *</label>
            <div className="tabs" style={{ marginBottom: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`tab${inputMode === 'text' ? ' active' : ''}`}
              >
                Text Content
              </button>
              <button
                type="button"
                onClick={() => setInputMode('url')}
                className={`tab${inputMode === 'url' ? ' active' : ''}`}
              >
                Website URL
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>
              {inputMode === 'text' ? 'Paste your content directly for analysis' : 'Analyze content from any webpage'}
            </p>

            {/* Target Keyword */}
            <label className="tool-box-label" htmlFor="targetKeyword">Target Keyword (Optional)</label>
            <input
              type="text"
              id="targetKeyword"
              className="tool-url-input"
              value={form.targetKeyword}
              onChange={(e) => setForm(prev => ({ ...prev, targetKeyword: e.target.value }))}
              placeholder="e.g., SEO tips, digital marketing"
              disabled={form.isAnalyzing}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>Enter your main keyword to check its density</p>

            {/* URL Input */}
            {inputMode === 'url' && (
              <>
                <label className="tool-box-label" htmlFor="url">Website URL to Analyze *</label>
                <input
                  type="url"
                  id="url"
                  className="tool-url-input"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/your-page"
                  disabled={form.isAnalyzing}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>
                  Enter the URL of the webpage you want to analyze for keyword density
                </p>
              </>
            )}

            {/* Text Content Input */}
            {inputMode === 'text' && (
              <>
                <label className="tool-box-label" htmlFor="content">Content to Analyze *</label>
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Paste your article, blog post, or web page content here..."
                  rows={9}
                  disabled={form.isAnalyzing}
                  required
                  style={{
                    width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                    borderRadius: 6, resize: 'none', fontFamily: 'Inter, sans-serif',
                    fontSize: '0.9rem', color: 'var(--ink)', outline: 'none', lineHeight: 1.6,
                    marginBottom: '0.35rem'
                  }}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>
                  {form.content.length} characters &middot; {form.content.trim().split(/\s+/).filter(word => word.length > 0).length} words
                </p>
              </>
            )}

            {/* Human Verification */}
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.35rem' }}>Human Verification Required</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Please verify that you&apos;re not a robot to analyze your content.
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
                  Verification successful! You can now analyze your content.
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={analyzeContent}
                disabled={form.isAnalyzing || (inputMode === 'text' && !form.content.trim()) || (inputMode === 'url' && !url.trim()) || !isVerified || usageCount >= usageLimit}
                className="tool-analyze-btn"
                style={{ flex: 1 }}
              >
                <div className="tool-analyze-btn-dot" />
                {form.isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
              </button>
              {analysis && (
                <button
                  onClick={resetAnalysis}
                  style={{
                    padding: '14px 20px', background: 'var(--gray-1)', color: 'var(--gray-5)',
                    border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.85rem',
                    cursor: 'pointer', borderRadius: 6, fontFamily: 'Space Grotesk, sans-serif'
                  }}
                >
                  Reset
                </button>
              )}
            </div>

          </div>

          {/* ── RIGHT BOX — Results ── */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Analysis Results</h2>

            {!analysis ? (
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
                  Enter your content and click &ldquo;Analyze Content&rdquo; to see detailed keyword density analysis
                </p>
              </div>
            ) : (
              <>
                {/* Stats Strip */}
                <div className="stats-strip" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '1.25rem' }}>
                  <div className="stat-cell">
                    <div className="stat-cell-num blue">{analysis.totalWords.toLocaleString()}</div>
                    <div className="stat-cell-label">Total Words</div>
                  </div>
                  <div className="stat-cell" style={{ borderRight: 'none' }}>
                    <div className="stat-cell-num">{analysis.totalCharacters.toLocaleString()}</div>
                    <div className="stat-cell-label">Characters</div>
                  </div>
                </div>

                {/* Target Keyword Analysis */}
                {form.targetKeyword && (
                  <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>Target Keyword Analysis</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)' }}>Keyword:</span>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--blue)' }}>&ldquo;{form.targetKeyword}&rdquo;</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)' }}>Count:</span>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)', fontFamily: 'Space Grotesk, sans-serif' }}>{analysis.keywordCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)' }}>Density:</span>
                      <span style={{
                        fontWeight: 700, fontSize: '0.85rem', fontFamily: 'Space Grotesk, sans-serif',
                        color: analysis.keywordDensity >= 0.5 && analysis.keywordDensity <= 3 ? 'var(--green)' : 'var(--amber)'
                      }}>
                        {analysis.keywordDensity.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Readability Score */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>Readability Score</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--gray-2)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.max(analysis.readabilityScore, 10)}%`,
                        background: analysis.readabilityScore >= 70 ? 'var(--green)' : analysis.readabilityScore >= 50 ? 'var(--amber)' : 'var(--red)',
                        transition: 'width 0.5s ease',
                        borderRadius: 3
                      }} />
                    </div>
                    <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', flexShrink: 0, minWidth: 52, textAlign: 'right' }}>
                      {analysis.readabilityScore.toFixed(0)}/100
                    </span>
                  </div>
                </div>

                {/* Top Keywords */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>Top Keywords</div>
                  <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    {analysis.topKeywords.map((keyword, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--line)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: 22, height: 22, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{index + 1}</span>
                          </div>
                          <span style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--ink)' }}>{keyword.word}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--gray-4)' }}>{keyword.count}&times;</span>
                          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--blue)', fontFamily: 'Space Grotesk, sans-serif' }}>{keyword.density.toFixed(2)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SEO Recommendations */}
                <div style={{ background: 'var(--white)', border: '1px solid var(--line)', padding: '1.25rem' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: '0.75rem' }}>SEO Recommendations</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {analysis.recommendations.map((rec, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--blue)', marginTop: 2, flexShrink: 0, fontSize: '0.85rem' }}>•</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
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
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in Technical SEO</div>
              <p className="founder-quote-text">
                &ldquo;I built this keyword density analyzer after seeing too many content teams either obsess over hitting a magic percentage or ignore keyword placement entirely. The real goal is natural writing that covers a topic thoroughly. This tool helps you verify you&apos;re in the right range — not chase an arbitrary number. Write first, optimize once.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts &middot;{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT IS KEYWORD DENSITY ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">What is Keyword Density and <span className="blue">Why Does It Matter?</span></h2>
          </div>
          <div className="prose-content">
            <p>Keyword density is the percentage of times a target keyword appears in your content compared to the total word count. While there&apos;s no &ldquo;perfect&rdquo; density percentage, maintaining the right balance is crucial for SEO success.</p>
            <h3>Here&apos;s why keyword density matters:</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', margin: '1rem 0' }}>
              {[
                { bold: 'Search engines need context', rest: ' to understand what your content is about' },
                { bold: 'Over-optimization can trigger penalties', rest: ' and hurt your rankings' },
                { bold: 'Under-optimization means missed opportunities', rest: ' for relevant traffic' },
                { bold: 'Natural keyword distribution', rest: ' improves user experience and readability' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <span style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 2, fontSize: '0.82rem', fontWeight: 700 }}>✓</span>
                  <span><strong>{item.bold}</strong>{item.rest}</span>
                </li>
              ))}
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">The Sweet Spot</div>
              <p>Most SEO experts recommend keeping primary keyword density between <strong>1–3%</strong> for optimal results. Focus on natural usage and user value — not hitting exact percentages.</p>
            </div>
            <p>Ready to optimize your content? Try the Keyword Density Analyzer now and get instant recommendations to improve your SEO performance.</p>
          </div>
        </div>
      </section>

      {/* ─── KEY FEATURES SECTION ─── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Key features of our <span className="blue">Keyword Density Analyzer</span></h2>
          </div>
          <div className="features-grid">
            {[
              {
                icon: 'M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 1 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z',
                title: 'Comprehensive Keyword Analysis',
                bullets: [
                  '<strong>Real-time density calculations</strong> for any text or webpage URL',
                  '<strong>Primary and secondary keyword tracking</strong> to monitor all target terms',
                  '<strong>Phrase density analysis</strong> for long-tail keywords and key phrases',
                  '<strong>Word count statistics</strong> to understand content length and structure',
                ],
              },
              {
                icon: 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
                title: 'Advanced Analytics and Insights',
                bullets: [
                  '<strong>Keyword frequency charts</strong> showing exact occurrence counts',
                  '<strong>Density percentage breakdowns</strong> for every keyword and phrase',
                  '<strong>Stop word filtering</strong> to focus on meaningful content words',
                  '<strong>Keyword distribution mapping</strong> throughout your content',
                ],
              },
              {
                icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 0 0 1.946-.806 3.42 3.42 0 0 1 4.438 0 3.42 3.42 0 0 0 1.946.806 3.42 3.42 0 0 1 3.138 3.138 3.42 3.42 0 0 0 .806 1.946 3.42 3.42 0 0 1 0 4.438 3.42 3.42 0 0 0-.806 1.946 3.42 3.42 0 0 1-3.138 3.138 3.42 3.42 0 0 0-1.946.806 3.42 3.42 0 0 1-4.438 0 3.42 3.42 0 0 0-1.946-.806 3.42 3.42 0 0 1-3.138-3.138 3.42 3.42 0 0 0-.806-1.946 3.42 3.42 0 0 1 0-4.438 3.42 3.42 0 0 0 .806-1.946 3.42 3.42 0 0 1 3.138-3.138z',
                title: 'User-Friendly Interface',
                bullets: [
                  '<strong>Simple copy-paste functionality</strong> for quick text analysis',
                  '<strong>URL analysis capability</strong> to check live webpages',
                  '<strong>Clean, easy-to-read reports</strong> that anyone can understand',
                  '<strong>Mobile-responsive design</strong> for analysis on any device',
                ],
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'Professional SEO Features',
                bullets: [
                  '<strong>Keyword highlighting</strong> to visualize distribution patterns',
                  '<strong>Export functionality</strong> for detailed reporting and client presentations',
                  '<strong>Bulk keyword tracking</strong> for comprehensive content audits',
                  '<strong>Historical comparison</strong> to track optimization improvements',
                ],
              },
              {
                icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                title: 'Privacy-Focused Analysis',
                bullets: [
                  '<strong>Content analyzed locally</strong> and never stored on our servers',
                  '<strong>No account creation needed</strong> throughout the analysis process',
                  '<strong>Complete confidentiality</strong> for your unpublished drafts',
                ],
              },
              {
                icon: 'M18 20V10 M12 20V4 M6 20v-6',
                title: 'Readability Scoring',
                bullets: [
                  '<strong>0–100 readability score</strong> based on sentence and word complexity',
                  '<strong>Identifies readability issues</strong> before they hurt user engagement',
                  '<strong>Longer sentences and complex words</strong> flagged for improvement',
                ],
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <ul style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', listStyle: 'none', padding: 0, margin: '0.75rem 0 0' }}>
                  {f.bullets.map((b, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, marginTop: 1, fontSize: '0.82rem', fontWeight: 700 }}>✓</span>
                      <span style={{ fontSize: '0.83rem', color: 'var(--gray-5)', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: b }} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW TO USE SECTION ─── */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How To Use</div>
            <h2 className="s-title">How to use the Keyword Density Analyzer <span className="blue">(step-by-step)</span></h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>

            {/* Step 01 — For Text Content */}
            <div className="step-card">
              <div className="step-num-big">01</div>
              <div className="step-title">For Text Content</div>
              <ol style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Copy your content from your document or CMS',
                  'Paste it into the analyzer input field',
                  'Click "Analyze Content" to generate your report',
                  'Review the results and identify optimization opportunities',
                  'Adjust your content based on the recommendations',
                ].map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ width: 20, height: 20, background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', marginTop: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="step-tip">Tip: For best results, analyze just your main content (body text) rather than including navigation, footers, or sidebar elements.</div>
            </div>

            {/* Step 02 — For Live Webpages */}
            <div className="step-card">
              <div className="step-connector">
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
              </div>
              <div className="step-num-big">02</div>
              <div className="step-title">For Live Webpages</div>
              <ol style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Enter the webpage URL you want to analyze',
                  'Click "Analyze URL" to fetch and process the content',
                  'Review keyword density for all detected keywords',
                  'Compare with competitors to identify gaps',
                  'Optimize your content for better performance',
                ].map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ width: 20, height: 20, background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem', fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif', marginTop: 1 }}>{i + 1}</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>{step}</span>
                  </li>
                ))}
              </ol>
              <div className="step-tip">Tip: You can analyze any publicly accessible webpage using the URL analysis feature — including competitor pages to benchmark your density.</div>
            </div>

            {/* Step 03 — Understanding Results */}
            <div className="step-card">
              <div className="step-connector">
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
              </div>
              <div className="step-num-big">03</div>
              <div className="step-title">Understanding Results</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                {[
                  { color: 'var(--green)', label: 'Green indicators:', desc: 'Optimal keyword density (1–3%)' },
                  { color: 'var(--amber)', label: 'Yellow indicators:', desc: 'Slightly high density (3–5%) — monitor closely' },
                  { color: 'var(--red)', label: 'Red indicators:', desc: 'Potential over-optimization (5%+) — reduce usage' },
                ].map((ind) => (
                  <div key={ind.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span style={{ width: 12, height: 12, borderRadius: '50%', background: ind.color, flexShrink: 0, marginTop: 3 }} />
                    <div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)' }}>{ind.label}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', marginLeft: '0.3rem' }}>{ind.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="step-tip">Tip: Check density during content creation and before publishing. Also analyze when updating existing content or if you notice ranking changes.</div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SEO BEST PRACTICES ─── */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Best Practices</div>
            <h2 className="s-title">SEO best practices for <span className="blue">keyword density</span></h2>
          </div>
          <div className="why-grid">

            {/* Primary Keywords */}
            <div className="why-card">
              <div className="why-card-title">
                <div className="why-card-icon">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                Primary Keywords
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Keep density between <strong>1–3%</strong> for main target keywords',
                  'Use variations and synonyms naturally throughout content',
                  'Focus on user intent rather than strict percentage targets',
                  'Ensure keywords appear in key locations (title, headings, first paragraph)',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--blue)', flexShrink: 0, fontSize: '0.78rem', marginTop: 3 }}>•</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Secondary Keywords */}
            <div className="why-card">
              <div className="why-card-title">
                <div className="why-card-icon">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                </div>
                Secondary Keywords
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Maintain <strong>0.5–2%</strong> density for supporting keywords',
                  'Use semantic variations to cover related search terms',
                  'Balance keyword usage with natural language flow',
                  'Include long-tail variations for comprehensive coverage',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--blue)', flexShrink: 0, fontSize: '0.78rem', marginTop: 3 }}>•</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.55 }} dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Content Optimization Tips */}
          <div style={{ marginTop: '1.5rem', background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', padding: '1.75rem 2rem' }}>
            <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)', marginBottom: '1.25rem', textAlign: 'center' }}>
              Content Optimization Tips
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 2rem' }}>
              {[
                { bold: 'Write for humans first,', rest: ' optimize for search engines second' },
                { bold: 'Use keywords naturally', rest: ' in context rather than forcing them' },
                { bold: 'Vary your vocabulary', rest: ' with synonyms and related terms' },
                { bold: 'Focus on topic coverage', rest: ' rather than keyword repetition' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>
                    <strong style={{ color: 'var(--ink)' }}>{item.bold}</strong>{item.rest}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ─── COMMON MISTAKES SECTION ─── */}
      <section className="section mistakes-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Mistakes</div>
            <h2 className="s-title">Common keyword density mistakes <span className="blue">to avoid</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '2.5rem' }}>

            {/* Card 1 — Over-Optimization */}
            <div className="mistake-card">
              <div className="mistake-card-top">
                <div className="mistake-num">Mistake 01</div>
                <div className="mistake-title">Over-Optimization Red Flags</div>
                <div className="mistake-body-text">These patterns signal keyword stuffing to Google&apos;s algorithms and will hurt your rankings.</div>
              </div>
              <div className="code-example" style={{ borderTop: '1px solid var(--line)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Repeating the same keyword phrase excessively',
                  'Forcing keywords into every paragraph unnaturally',
                  'Using exact-match keywords when variations would flow better',
                  'Ignoring readability for the sake of keyword density',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span className="code-label" style={{ color: 'var(--red)', flexShrink: 0, fontWeight: 700 }}>✗</span>
                    <span style={{ fontSize: '0.83rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2 — Under-Optimization */}
            <div className="mistake-card">
              <div className="mistake-card-top">
                <div className="mistake-num">Mistake 02</div>
                <div className="mistake-title">Under-Optimization Issues</div>
                <div className="mistake-body-text">Failing to use your target keywords in important sections means missed ranking opportunities.</div>
              </div>
              <div className="code-example" style={{ borderTop: '1px solid var(--line)', padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  'Failing to use target keywords in important sections',
                  'Not including keyword variations and synonyms',
                  'Missing opportunities for natural keyword placement',
                  'Ignoring search intent in favor of unrelated keywords',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ color: 'var(--amber)', flexShrink: 0, fontWeight: 700, fontSize: '0.9rem' }}>!</span>
                    <span style={{ fontSize: '0.83rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE SECTION ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Why Choose Us</div>
            <h2 className="s-title">Why choose SEO Shouts&apos; <span className="blue">Keyword Density Analyzer?</span></h2>
          </div>
          <div className="why-grid">
            {[
              {
                title: 'Completely Free to Use',
                path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
                body: 'No hidden fees, no registration required. Just paste your content and get instant analysis.',
              },
              {
                title: 'Accurate and Reliable',
                path: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z',
                body: 'Built by SEO experts with 13+ years of experience in keyword optimization and content analysis.',
              },
              {
                title: 'Regular Updates',
                path: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z',
                body: 'Our tool evolves with Google\'s algorithm changes and SEO best practices. We continuously improve the analyzer based on the latest research.',
              },
              {
                title: 'Privacy-Focused',
                path: 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
                body: 'Your content is analyzed locally and not stored on our servers. No account creation needed, and your data stays private.',
              },
            ].map((c) => (
              <div key={c.title} className="why-card">
                <div className="why-card-title">
                  <div className="why-card-icon">
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
                      <path d={c.path} />
                    </svg>
                  </div>
                  {c.title}
                </div>
                <div className="why-card-body">{c.body}</div>
              </div>
            ))}
          </div>

          {/* 5th card — full width */}
          <div className="why-card" style={{ marginTop: '1.5rem' }}>
            <div className="why-card-title">
              <div className="why-card-icon">
                <svg width={14} height={14} viewBox="0 0 24 24" fill="white">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              Professional-Grade Results
            </div>
            <div className="why-card-body">The same quality analysis that we use for client campaigns, available free to everyone.</div>
          </div>

        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently asked questions</h2>
            <p className="s-sub">Everything you need to know about keyword density and content optimization.</p>
          </div>
          <div className="faq-list">
            {[
              {
                q: "What's the ideal keyword density percentage?",
                a: "There's no universal perfect percentage, but 1–3% for primary keywords is generally recommended. Focus more on natural usage and user value than hitting exact percentages. Some competitive topics may require different densities depending on what's already ranking."
              },
              {
                q: 'Can high keyword density hurt my rankings?',
                a: "Yes, keyword stuffing (excessive keyword repetition) can result in penalties from Google's algorithms. Our tool helps you identify when density is too high so you can adjust before publishing or making your content live."
              },
              {
                q: 'Should I analyze just my main content or include navigation?',
                a: 'For best results, analyze just your main content (body text) rather than including navigation, footers, or sidebar elements which can dilute or significantly skew your density readings.'
              },
              {
                q: 'How often should I check keyword density?',
                a: 'Check density during content creation and before publishing. Also analyze when updating existing content or if you notice ranking changes that might indicate over- or under-optimization issues.'
              },
              {
                q: 'Does the tool work for non-English content?',
                a: 'Yes, our analyzer works with content in multiple languages, though optimal density ranges may vary by language and the stop word filtering may be less comprehensive for non-English content.'
              },
              {
                q: 'Can I analyze competitor content?',
                a: 'Yes, you can analyze any publicly accessible webpage using the URL analysis feature, including competitor pages. This helps you benchmark your density against pages that are already ranking well for your target keyword.'
              },
            ].map(faq => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
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
            <h2 className="s-title">More tools in the <span className="blue">SEOShouts suite</span></h2>
          </div>
          <div className="related-tools-grid">
            {[
              {
                name: 'Keyword Density Analyzer',
                desc: 'Analyze keyword usage and optimize content for SEO without stuffing',
                current: true,
                href: '/tools/keyword-density-analyzer/',
                paths: ['M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z'],
              },
              {
                name: 'Internal Link Checker',
                desc: 'Map your anchor text profile and uncover over-optimization risks',
                href: '/tools/internal-link-checker/',
                paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
              },
              {
                name: 'On-Page SEO Analyzer',
                desc: 'Score any URL across 150+ on-page ranking signals',
                href: '/tools/on-page-seo-analyzer/',
                paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
              },
              {
                name: 'Schema Generator',
                desc: 'Build structured data markup for 39+ schema types',
                href: '/tools/schema-generator/',
                paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
              },
              {
                name: 'Robots.txt Generator',
                desc: 'Control how AI and web crawlers access your site',
                href: '/tools/robots-txt-generator/',
                paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'],
              },
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
          <h2 className="final-cta-title">Start Optimizing Your Content <span>Today</span></h2>
          <p className="final-cta-sub">Stop leaving your keyword optimization to chance. Use our Free Keyword Density Analyzer to ensure your content hits the sweet spot between optimization and readability.</p>
          <div className="final-cta-row">
            <a href="#top" className="btn-primary">Analyze Content Now</a>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {['Instant analysis — no signup required', 'Works for text and live URLs', 'Built by 13+ year SEO professionals'].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
