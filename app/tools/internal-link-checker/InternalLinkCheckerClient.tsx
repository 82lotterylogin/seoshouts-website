'use client'

import { useState, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'
import InternalLinkVisualization from './InternalLinkVisualization'
import InternalLinkDataTable from './InternalLinkDataTable'
import ExportOptions from './ExportOptions'
import ShapeGrid from '../../components/ShapeGrid'

interface AnchorData {
  text: string;
  href: string;
  count: number;
  pages: string[];
  destinations?: Array<{ href: string; count: number }>;
}

interface AnalysisInsights {
  totalUniqueAnchors: number;
  totalInternalLinks: number;
  averageLinksPerPage: number;
  pagesCrawled: number;
  successfulPages: number;
  failedPages: number;
  mostFrequentAnchor: AnchorData | null;
  singleUsageAnchors: number;
  topAnchors: AnchorData[];
}

interface CrawledPage {
  url: string;
  title: string;
  linkCount: number;
  error: string | null;
}

interface AnalysisResult {
  baseUrl: string;
  anchors: AnchorData[];
  insights: AnalysisInsights;
  crawledPages: CrawledPage[];
  pagesWithNoLinks?: Array<{
    url: string;
    title: string;
    reason: string;
  }>;
}

interface ProgressStep {
  step: string;
  status: 'in_progress' | 'completed' | 'failed';
  message: string;
  timestamp: number;
}

interface UserInputRequest {
  needsUserInput: boolean;
  step: string;
  message: string;
  progressSteps?: ProgressStep[];
  options?: Array<{ id: string; label: string }>;
  checkedLocations?: string[];
  robotsSitemaps?: string[];
  urlCount?: number;
  sitemapUrl?: string;
}

export default function InternalLinkCheckerClient() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [activeTab, setActiveTab] = useState<'cloud' | 'table' | 'pages' | 'no-links'>('cloud')
  const resultsPanelRef = useRef<HTMLDivElement>(null)

  // State for multi-step workflow
  const [userInputRequest, setUserInputRequest] = useState<UserInputRequest | null>(null)
  const [manualSitemapUrl, setManualSitemapUrl] = useState('')
  const [manualUrls, setManualUrls] = useState('')
  const [usageInfo, setUsageInfo] = useState<{
    remainingRequests?: number;
    resetTime?: string;
    isLimitReached?: boolean;
  }>({})

  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Group anchors by text to combine duplicates
  const groupAnchors = (anchors: AnchorData[]) => {
    const groupedAnchors = new Map<string, AnchorData>()

    anchors.forEach(anchor => {
      if (groupedAnchors.has(anchor.text)) {
        const existing = groupedAnchors.get(anchor.text)!
        // Combine counts
        existing.count += anchor.count
        // Merge all pages (remove duplicates)
        existing.pages = [...new Set([...existing.pages, ...anchor.pages])]

        // Handle multiple destination URLs properly
        const existingHrefs = existing.href.split(', ').filter(h => h.trim())
        if (!existingHrefs.includes(anchor.href)) {
          existingHrefs.push(anchor.href)
          existing.href = existingHrefs.join(', ')
        }

        // Store detailed destination information
        if (!existing.destinations) {
          const originalHref = existingHrefs[0]
          existing.destinations = [{ href: originalHref, count: existing.count - anchor.count }]
        }

        // Add this destination or update count
        const destIndex = existing.destinations.findIndex(d => d.href === anchor.href)
        if (destIndex >= 0) {
          existing.destinations[destIndex].count += anchor.count
        } else {
          existing.destinations.push({ href: anchor.href, count: anchor.count })
        }

      } else {
        const newAnchor = { ...anchor }
        newAnchor.destinations = [{ href: anchor.href, count: anchor.count }]
        groupedAnchors.set(anchor.text, newAnchor)
      }
    })

    return Array.from(groupedAnchors.values())
  }

  const performAnalysis = async (step: string = 'discover', sitemapUrl?: string, manualUrlList?: string[]) => {
    // Get reCAPTCHA token
    let recaptchaToken = '';

    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      try {
        recaptchaToken = await recaptchaRef.current?.getValue() || ''

        if (!recaptchaToken) {
          setError('Please complete the reCAPTCHA verification.')
          return
        }
      } catch (error) {
        setError('reCAPTCHA verification failed. Please try again.')
        return
      }
    } else {
      setError('reCAPTCHA is not properly configured. Please contact support.')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setResults(null)
    setUserInputRequest(null)
    setProgress('Analyzing website...')

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800000); // 30 minute timeout

      const requestBody: any = {
        url: url.trim(),
        recaptchaToken,
        step
      }

      if (sitemapUrl) {
        requestBody.sitemapUrl = sitemapUrl
      }

      if (manualUrlList) {
        requestBody.manualUrls = manualUrlList
      }

      const response = await fetch('/api/internal-link-analyzer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      const data = await response.json()

      if (!response.ok) {
        // Handle rate limiting response
        if (response.status === 429) {
          setUsageInfo({
            remainingRequests: data.remainingRequests || 0,
            resetTime: data.resetTime || 'tomorrow',
            isLimitReached: true
          })
        }
        throw new Error(data.error || 'Analysis failed')
      }

      // Update usage info on successful request
      if (data.remainingRequests !== undefined) {
        setUsageInfo({
          remainingRequests: data.remainingRequests,
          resetTime: data.resetTime || 'tomorrow',
          isLimitReached: false
        })
      }

      if (data.success) {
        // Analysis completed successfully
        setResults(data.data)
        setProgress('Analysis completed!')
        setTimeout(() => {
          resultsPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
        recaptchaRef.current?.reset()

        // Update usage info from successful response
        if (data.remainingRequests !== undefined) {
          setUsageInfo({
            remainingRequests: data.remainingRequests,
            resetTime: data.resetTime || 'tomorrow',
            isLimitReached: false
          })
        }
      } else if (data.needsUserInput) {
        // Need user input for next step
        setUserInputRequest(data)
        // Reset reCAPTCHA so it can be used for follow-up requests
        recaptchaRef.current?.reset()
      } else {
        throw new Error(data.error || 'Analysis failed')
      }

    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Analysis timed out after 30 minutes. The website may be extremely large, very slow, or blocking our crawler. Please try with a smaller site or specific URLs.')
        } else {
          setError(err.message)
        }
      } else {
        setError('An unexpected error occurred')
      }
      setProgress('')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('Please enter a website URL')
      return
    }

    await performAnalysis()
  }

  const handleUserChoice = async (choice: string) => {
    if (choice === 'provide_sitemap') {
      // Show sitemap URL input
      setUserInputRequest({
        ...userInputRequest!,
        step: 'sitemap_input_needed'
      })
    } else if (choice === 'no_sitemap') {
      // Show manual URL input
      setUserInputRequest({
        ...userInputRequest!,
        step: 'manual_urls_needed'
      })
    } else if (choice === 'retry_sitemap') {
      // Clear sitemap URL and show input again
      setManualSitemapUrl('')
      setUserInputRequest({
        ...userInputRequest!,
        step: 'sitemap_input_needed'
      })
    }
  }

  const handleSitemapSubmit = async () => {
    if (!manualSitemapUrl.trim()) {
      setError('Please enter a sitemap URL')
      return
    }
    await performAnalysis('manual_sitemap', manualSitemapUrl.trim())
  }

  const handleManualUrlsSubmit = async () => {
    if (!manualUrls.trim()) {
      setError('Please enter at least one URL')
      return
    }

    const urlList = manualUrls
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.length > 0)

    if (urlList.length === 0) {
      setError('Please enter valid URLs')
      return
    }

    await performAnalysis('manual_urls', undefined, urlList)
  }

  const resetAnalysis = () => {
    setResults(null)
    setError('')
    setProgress('')
    setUrl('')
    setActiveTab('cloud')
    setUserInputRequest(null)
    setManualSitemapUrl('')
    setManualUrls('')
    // Don't reset usage info as it should persist across analyses
    recaptchaRef.current?.reset()
  }

  return (
    <>
      {/* ─── TOOL HERO ─── */}
      <div id="top" className="tool-hero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, rgba(8,9,10,0.9) 100%)', pointerEvents: 'none' }} />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Internal Link Checker</span>
          </nav>
          <div className="tool-hero-badge">🔗 Technical SEO Tool — Free Forever</div>
          <h1 className="tool-hero-h1">
            Free Internal Link Checker: <span>Audit Anchor Text</span>, Link Distribution &amp; Site Architecture
          </h1>
          <p className="tool-hero-sub">
            An internal link checker crawls your website to analyze anchor text patterns, link distribution, and site structure — identifying over-optimization, wasted generic anchors, and keyword stuffing across your internal linking profile. SEOShouts&apos; free tool scans up to 500 URLs and generates a{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>visual word cloud</strong>{' '}
            showing which anchor phrases dominate your link structure, a feature no other free tool offers.
          </p>
        </div>
      </div>

      {/* ─── TOOL INPUT SECTION ─── */}
      <div className="tool-input-section">
        <div className="tool-input-inner">
          <div className="tool-box">
            <h2 className="tool-box-heading">Analyze Your Website&apos;s Internal Link Structure</h2>
            <p className="tool-box-sub">
              Enter your website URL below to start crawling and analyzing{' '}
              <span>internal anchor text patterns</span>.
            </p>

            {/* Usage Counter */}
            {(usageInfo.remainingRequests !== undefined || usageInfo.isLimitReached) && (
              <div style={{
                marginBottom: '1rem', padding: '8px 14px', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center',
                background: usageInfo.isLimitReached ? 'rgba(220,38,38,0.08)' : usageInfo.remainingRequests === 0 ? 'rgba(217,119,6,0.08)' : 'rgba(22,163,74,0.08)',
                border: `1px solid ${usageInfo.isLimitReached ? 'rgba(220,38,38,0.25)' : usageInfo.remainingRequests === 0 ? 'rgba(217,119,6,0.25)' : 'rgba(22,163,74,0.2)'}`,
                color: usageInfo.isLimitReached ? 'var(--red)' : usageInfo.remainingRequests === 0 ? 'var(--amber)' : 'var(--green)',
              }}>
                {usageInfo.isLimitReached
                  ? `Daily limit reached. Resets: ${usageInfo.resetTime}`
                  : `${usageInfo.remainingRequests} of 5 daily uses remaining${usageInfo.resetTime ? ` (Resets: ${usageInfo.resetTime})` : ''}`
                }
              </div>
            )}

            <form onSubmit={handleAnalyze}>
              <label className="tool-box-label" htmlFor="url-input">Website URL</label>
              <input
                id="url-input"
                className="tool-url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                disabled={isAnalyzing}
              />

              {/* reCAPTCHA */}
              {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                <div className="tool-captcha">
                  <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} />
                </div>
              )}

              <button
                type="submit"
                className="tool-analyze-btn"
                disabled={isAnalyzing || !url.trim() || usageInfo.isLimitReached}
              >
                <div className="tool-analyze-btn-dot" />
                {isAnalyzing ? 'Analyzing...' : usageInfo.isLimitReached ? 'Limit Reached' : '🔍 Analyze Internal Links'}
              </button>
            </form>

            {/* Error */}
            {error && (
              <div style={{
                marginTop: '1rem', padding: '1rem 1.25rem',
                background: usageInfo.isLimitReached ? 'rgba(217,119,6,0.06)' : 'rgba(220,38,38,0.06)',
                border: `1px solid ${usageInfo.isLimitReached ? 'rgba(217,119,6,0.25)' : 'rgba(220,38,38,0.2)'}`,
                borderLeft: `3px solid ${usageInfo.isLimitReached ? 'var(--amber)' : 'var(--red)'}`,
              }}>
                <div style={{ fontWeight: 600, color: usageInfo.isLimitReached ? 'var(--amber)' : 'var(--red)', marginBottom: 4, fontSize: '0.88rem' }}>
                  {usageInfo.isLimitReached ? 'Usage Limit Reached' : 'Analysis Error'}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.6 }}>{error}</div>
              </div>
            )}

            {/* User Input Request */}
            {userInputRequest && (
              <div style={{ marginTop: '1rem', padding: '1.25rem', background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.2)' }}>
                <div style={{ fontWeight: 600, color: 'var(--amber)', marginBottom: '0.5rem', fontSize: '0.88rem' }}>📝 User Input Required</div>
                <p style={{ color: 'var(--gray-5)', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.6 }}>{userInputRequest.message}</p>

                {userInputRequest.step === 'no_sitemap_found' && userInputRequest.options && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {userInputRequest.options.map((option) => (
                      <button key={option.id} onClick={() => handleUserChoice(option.id)}
                        style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'var(--white)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', borderRadius: 4 }}
                        onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--blue)' }}
                        onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = 'var(--line)' }}
                      >{option.label}</button>
                    ))}
                  </div>
                )}

                {userInputRequest.step === 'sitemap_input_needed' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <input type="url" placeholder="Enter sitemap URL (e.g., https://example.com/sitemap.xml)"
                      value={manualSitemapUrl} onChange={(e) => setManualSitemapUrl(e.target.value)}
                      className="tool-url-input" />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleSitemapSubmit} disabled={!manualSitemapUrl.trim()}
                        style={{ flex: 1, padding: '10px 16px', background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: !manualSitemapUrl.trim() ? 'not-allowed' : 'pointer', opacity: !manualSitemapUrl.trim() ? 0.5 : 1, borderRadius: 4 }}>
                        Analyze Sitemap
                      </button>
                      <button onClick={() => handleUserChoice('no_sitemap')}
                        style={{ padding: '10px 16px', background: 'transparent', color: 'var(--gray-5)', border: '1px solid var(--line)', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', borderRadius: 4 }}>
                        No Sitemap
                      </button>
                    </div>
                  </div>
                )}

                {userInputRequest.step === 'manual_urls_needed' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <textarea placeholder={'Enter URLs to analyze (one per line)\nhttps://example.com/page1\nhttps://example.com/page2'}
                      value={manualUrls} onChange={(e) => setManualUrls(e.target.value)} rows={6}
                      style={{ width: '100%', padding: '10px 14px', background: 'var(--white)', border: '1px solid var(--gray-3)', color: 'var(--ink)', fontSize: '0.85rem', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', borderRadius: 6 }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleManualUrlsSubmit} disabled={!manualUrls.trim()}
                        style={{ flex: 1, padding: '10px 16px', background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: !manualUrls.trim() ? 'not-allowed' : 'pointer', opacity: !manualUrls.trim() ? 0.5 : 1, borderRadius: 4 }}>
                        Analyze URLs
                      </button>
                      <button onClick={() => handleUserChoice('provide_sitemap')}
                        style={{ padding: '10px 16px', background: 'transparent', color: 'var(--gray-5)', border: '1px solid var(--line)', fontWeight: 500, fontSize: '0.85rem', cursor: 'pointer', borderRadius: 4 }}>
                        Try Sitemap
                      </button>
                    </div>
                  </div>
                )}

                {userInputRequest.step === 'url_limit_exceeded' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', color: 'var(--red)', fontSize: '0.85rem', borderRadius: 4 }}>
                      <strong>Found {userInputRequest.urlCount} URLs</strong> — exceeds our limit of 500 URLs for optimal performance.
                    </div>
                    <button onClick={() => handleUserChoice('no_sitemap')}
                      style={{ width: '100%', padding: '10px 16px', background: 'var(--blue)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', borderRadius: 4 }}>
                      Provide Specific URLs Instead
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Key Features */}
            <div className="tool-key-features">
              <div className="tool-key-features-title">Key Features:</div>
              <div className="tool-features-grid">
                {[
                  { name: 'Visual Anchor Cloud', desc: 'Instantly see which words dominate your internal linking profile' },
                  { name: 'Keyword Stuffing Detection', desc: 'Identify if you are over-using specific keywords' },
                  { name: 'Generic Link Finder', desc: 'Spot wasted opportunities like "read more" or "this post"' },
                  { name: 'Deep Crawl Analysis', desc: 'Scan up to 500 URLs for a complete site picture' },
                ].map(f => (
                  <div key={f.name} className="tool-feat-item">
                    <div className="tool-feat-check">
                      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                    </div>
                    <div>
                      <div className="tool-feat-name">{f.name}</div>
                      <div className="tool-feat-desc">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── LOADING STATE ─── */}
      {isAnalyzing && (
        <div className="results-panel">
          <div className="results-inner">
            <div className="loading-state">
              <div style={{ fontSize: '0.9rem', color: 'var(--gray-5)', fontWeight: 600 }}>Crawling {url}...</div>
              <div className="loading-bar-track"><div className="loading-bar-fill" /></div>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray-4)' }}>{progress || 'Analyzing website...'}</div>
            </div>
          </div>
        </div>
      )}

      {/* ─── RESULTS ─── */}
      {results && (
        <div className="results-panel" ref={resultsPanelRef}>
          <div className="results-inner">
            <div className="results-header">
              <div className="results-site">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
                Analysis complete
                <span className="results-site-url">— {results.baseUrl}</span>
              </div>
              <div className="results-actions">
                <ExportOptions results={results} />
                <button className="btn-sm" onClick={resetAnalysis}>New Analysis</button>
              </div>
            </div>

            <div className="stats-strip">
              {[
                { val: results.insights.totalUniqueAnchors.toLocaleString(), label: 'Unique Anchors', cls: 'blue' },
                { val: results.insights.totalInternalLinks.toLocaleString(), label: 'Total Links', cls: '' },
                { val: results.insights.pagesCrawled.toLocaleString(), label: 'Pages Crawled', cls: '' },
                { val: results.insights.successfulPages.toLocaleString(), label: 'With Anchor Text', cls: 'green' },
                { val: results.insights.averageLinksPerPage.toLocaleString(), label: 'Avg Links/Page', cls: '' },
              ].map((s) => (
                <div key={s.label} className="stat-cell">
                  <div className={`stat-cell-num ${s.cls}`}>{s.val}</div>
                  <div className="stat-cell-label">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="result-card result-card-full" style={{ marginTop: '1.25rem' }}>
              <div className="tabs">
                {[
                  { key: 'cloud', label: 'Word Cloud' },
                  { key: 'table', label: 'Data Table' },
                  { key: 'pages', label: `All Pages (${results.insights.pagesCrawled})` },
                  { key: 'no-links', label: `No Links (${results.pagesWithNoLinks?.length || 0})` },
                ].map(tab => (
                  <button key={tab.key}
                    className={`tab${activeTab === tab.key ? ' active' : ''}`}
                    onClick={() => setActiveTab(tab.key as any)}
                  >{tab.label}</button>
                ))}
              </div>
              <div style={{ padding: '1.5rem' }}>
                {activeTab === 'cloud' && (
                  <InternalLinkVisualization anchors={groupAnchors(results.anchors)} insights={results.insights} />
                )}
                {activeTab === 'table' && (
                  <InternalLinkDataTable anchors={groupAnchors(results.anchors)} insights={results.insights} />
                )}
                {activeTab === 'pages' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 8 }}>
                      <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--ink)', fontSize: '1.05rem' }}>All Crawled Pages</h3>
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-4)' }}>
                        {results.insights.pagesCrawled} total · {results.insights.successfulPages} with anchor text · {results.pagesWithNoLinks?.length || 0} without links
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
                      {results.crawledPages.map((page, index) => (
                        <div key={index} style={{ padding: '10px 14px', background: 'var(--gray-1)', border: `1px solid ${page.error ? 'rgba(220,38,38,0.2)' : page.linkCount > 0 ? 'rgba(22,163,74,0.2)' : 'var(--line)'}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                <div style={{ width: 6, height: 6, background: page.error ? 'var(--red)' : page.linkCount > 0 ? 'var(--green)' : 'var(--gray-4)', flexShrink: 0 }} />
                                <div style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{page.title || 'Untitled'}</div>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--gray-5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingLeft: 14 }}>{page.url}</div>
                              {page.error && <div style={{ fontSize: '0.72rem', color: 'var(--red)', marginTop: 2, paddingLeft: 14 }}>Error: {page.error}</div>}
                            </div>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: page.error ? 'var(--red)' : page.linkCount > 0 ? 'var(--green)' : 'var(--gray-4)', flexShrink: 0 }}>
                              {page.error ? 'Failed' : `${page.linkCount} links`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'no-links' && (
                  <div>
                    <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--ink)', fontSize: '1.05rem', marginBottom: '1.25rem' }}>Pages with No Internal Links</h3>
                    {results.pagesWithNoLinks && results.pagesWithNoLinks.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
                        {results.pagesWithNoLinks.map((page, index) => (
                          <div key={index} style={{ padding: '10px 14px', background: 'var(--amber-bg)', border: '1px solid rgba(217,119,6,0.2)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 500, fontSize: '0.85rem', color: 'var(--ink)', marginBottom: 2 }}>{page.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--gray-5)', marginBottom: 4 }}>{page.url}</div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--amber)' }}>{page.reason}</div>
                              </div>
                              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--amber)', background: 'rgba(217,119,6,0.1)', padding: '3px 8px', flexShrink: 0, border: '1px solid rgba(217,119,6,0.2)' }}>No Links</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                        <div style={{ width: 48, height: 48, background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                          <span style={{ fontSize: '1.25rem' }}>✅</span>
                        </div>
                        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>Excellent!</div>
                        <div style={{ color: 'var(--gray-4)', fontSize: '0.88rem' }}>All pages have internal links in their content.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── FOUNDER QUOTE ─── */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in Technical SEO</div>
              <p className="founder-quote-text">
                &ldquo;I built this internal link checker after auditing 500+ websites and finding the same pattern: site owners obsess over broken links but completely ignore what their anchor text tells Google. This tool doesn&apos;t just find links — it visualizes the words you&apos;re using and shows whether they&apos;re helping or hurting your rankings.&rdquo;
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
            <h2 className="s-title">What is an internal link checker <span className="blue">and why do you need one?</span></h2>
          </div>
          <div className="prose-content">
            <p>An internal link checker is an SEO tool that crawls your website to map how pages connect to each other through hyperlinks. It analyzes anchor text (the clickable words in each link), tracks link distribution across your site, identifies broken or redirected links, and flags pages that receive too few or too many incoming links.</p>
            <p>Most internal link tools stop at finding broken links and counting totals. That misses the point entirely. The real value lies in <strong>anchor text analysis</strong> — understanding what words you&apos;re using to link pages together, because those words directly tell Google what each destination page is about.</p>
            <p>Google&apos;s John Mueller confirmed this in a Search Central session: <strong>&ldquo;Internal linking is super critical for SEO. It&apos;s one of the biggest things that you can do on a website to guide Google and guide visitors to the pages that you think are important.&rdquo;</strong></p>
            <p>According to Semrush&apos;s site audit data, <strong>25% of all web pages have zero incoming internal links</strong> — effectively invisible to both search engines and users. Meanwhile, Zyppy&apos;s study of 23 million internal links found that pages with <strong>more anchor text variations receive significantly more clicks</strong> from Google, proving that diverse, descriptive anchor text directly impacts traffic.</p>
            <p>The SEOShouts Internal Link Checker addresses both problems: it finds underlinked pages AND shows you exactly what anchor text you&apos;re using through a visual word cloud that no other free tool provides.</p>
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Internal link analysis and visualization <span className="blue">features</span></h2>
          </div>
          <div className="features-grid">
            {[
              { icon: 'M3 3h18v18H3zM9 3v18M3 9h18', title: 'Visual Anchor Text Word Cloud', desc: 'Instantly see which words and phrases dominate your internal linking profile. The word cloud sizes each term by frequency — if one keyword towers over everything else, you know your anchor profile is over-optimized. This feature is unique to SEOShouts — no other free tool offers it.', unique: true },
              { icon: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0-3.42 0z M12 9v4 M12 17h.01', title: 'Keyword Stuffing Detection', desc: 'Identify aggressive over-use of specific anchor keywords before Google\'s algorithms flag it. Sites with anchor text diversity below 30% have experienced ranking drops of up to 15 positions in competitive niches. Catch the problem early.' },
              { icon: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', title: 'Generic Link Finder', desc: 'Spot wasted opportunities where you\'re using "click here," "read more," "learn more," or "this article" as anchor text. These words carry zero semantic value and tell search engines nothing about the destination page.' },
              { icon: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0', title: 'Deep Crawl Analysis', desc: 'Scan up to 500 URLs to get a complete picture of your site\'s internal linking structure. The crawler reads actual HTML anchor elements for accurate insights.' },
              { icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z', title: 'Anchor Text Grouping & URL Mapping', desc: 'See which anchor texts point to which destination URLs, grouped by frequency. Identify pages receiving too many exact-match anchors and pages receiving none at all.' },
              { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', title: 'Zero Barriers', desc: 'No login, no credit card, no account creation. Enter your URL and get results in minutes. Free for every analysis, every time.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.icon.split(' M').map((d, j) => <path key={j} d={j === 0 ? d : 'M' + d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
                {(f as any).unique && <div className="feature-unique">Unique to SEOShouts</div>}
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
            <h2 className="s-title">How to run an internal linking audit <span className="blue">(step-by-step)</span></h2>
            <p className="s-sub">Optimizing your internal linking structure is one of the fastest ways to improve rankings without building a single backlink. A Databox study found that 42% of SEO experts spend equal time on internal links as external links.</p>
          </div>
          <div className="steps-grid">
            {[
              { n: '01', title: 'Enter Your Domain', desc: 'Type your homepage URL into the input field above. Our crawler reads your website\'s HTML, extracting anchor text across up to 500 pages to build a comprehensive map of your site\'s linking vocabulary.', tip: 'For the most thorough analysis, enter your homepage URL rather than an inner page. This gives the crawler the broadest starting point to discover your internal link structure.' },
              { n: '02', title: 'Analyze the Word Cloud', desc: 'Once the crawl completes, study the visual word cloud. What you want: a diverse mix of terms at similar sizes. What signals a problem: a single keyword dominating the cloud — that indicates over-optimization that could trigger Google\'s spam detection.', tip: 'Zyppy: pages with more unique anchor text variations receive significantly more organic clicks. Diversity isn\'t just safe — it directly drives traffic.' },
              { n: '03', title: 'Review the Data Table', desc: 'Switch to the data view for granular insights — frequency count for each unique anchor, which pages each anchor points to, and source pages. Flag any anchor that appears more than 15% of the time pointing to a single URL.', tip: 'Check your distribution against the benchmarks in the ratio section below.' },
              { n: '04', title: 'Fix and Optimize', desc: 'Replace generic anchors ("click here," "read more") with descriptive phrases. Diversify over-optimized anchors using synonyms and partial matches. Add internal links to orphan pages — any page with fewer than 3 incoming internal links needs attention.', tip: 'After making changes, re-run the analysis to confirm your improvements. Monthly audits keep your anchor profile balanced.' },
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
            <h2 className="s-title">Why anchor text is the most <span className="blue">underrated ranking factor</span></h2>
            <p className="s-sub">Many site owners chase backlinks while completely ignoring the text within those links. Here&apos;s why your internal anchor text strategy matters more than most SEOs realize.</p>
          </div>
          <div className="why-grid">
            {[
              { title: 'It Directly Tells Google What Pages Are About', icon: '📡', body: 'Google\'s crawlers rely on anchor text to understand what the linked page covers. When you link from Page A to Page B using "technical SEO audit checklist," you\'re explicitly signaling to Google that Page B is relevant for that topic. Industry data: 8% of SEO professionals rank internal links as the single most important ranking factor.' },
              { title: 'It Builds Topical Authority Across Your Site', icon: '🏗️', body: 'Internal links don\'t just connect pages — they create topic clusters that prove expertise to search engines. When you consistently use relevant, descriptive anchors to link related pages within a topic cluster, you signal to Google that your site has depth and authority on that subject.' },
              { title: 'It Protects You from Algorithmic Penalties', icon: '🛡️', body: 'Google\'s Penguin algorithm specifically targets manipulative anchor text patterns — and it applies to internal links, not just backlinks. Research shows sites with anchor text diversity below 30% have experienced ranking drops averaging 15 positions. Your anchor profile should look like natural human writing.' },
              { title: 'It Distributes Link Equity to Pages That Need It', icon: '⚡', body: 'Every internal link passes a portion of the linking page\'s authority to the destination page. Pages with strong backlink profiles can "share" that authority with newer or weaker pages through strategic internal linking. The key insight: link from your strongest pages to the pages you most want to rank.' },
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
            <div className="alert-box-title">⚠️ The Risk of Ignoring Anchor Text</div>
            <div className="alert-box-body">If 100 pages on your site all link to your money page using the exact same keyword anchor, Google may interpret that as manipulation. Research shows sites with anchor text diversity below 30% have experienced ranking drops averaging 15 positions. Use our word cloud to instantly spot keyword spikes, then diversify with synonyms, partial matches, and natural language variations.</div>
          </div>
        </div>
      </section>

      {/* ─── ANCHOR RATIO SECTION ─── */}
      <section className="section ratio-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Anchor Text Ratio</div>
            <h2 className="s-title">The ideal internal anchor text <span className="blue">distribution</span></h2>
            <p className="s-sub">There&apos;s no single perfect formula, but analyzing top-ranking sites reveals a consistent healthy pattern. Aim for this distribution:</p>
          </div>
          <table className="ratio-table">
            <thead>
              <tr>
                {['Anchor Type', 'Example', 'Target %', 'Risk Level'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                { type: 'Descriptive / Partial Match', example: '"check out our internal link audit guide"', pct: '50–60%', risk: 'Safest & Most Useful', cls: 'risk-safe' },
                { type: 'Branded', example: '"according to SEOShouts\' analysis"', pct: '20–30%', risk: 'Builds Brand Entity', cls: 'risk-safe' },
                { type: 'Exact Match', example: '"internal link checker"', pct: '10–15%', risk: 'High Power, High Risk', cls: 'risk-warn' },
                { type: 'Generic', example: '"click here," "read more"', pct: '< 5%', risk: 'Zero SEO Value', cls: 'risk-bad' },
                { type: 'Naked URL', example: '"seoshouts.com/tools/"', pct: '< 5%', risk: 'Wasted Opportunity', cls: 'risk-bad' },
              ].map(r => (
                <tr key={r.type}>
                  <td className="ratio-anchor-type">{r.type}</td>
                  <td style={{ fontStyle: 'italic' }}>{r.example}</td>
                  <td className="ratio-pct">{r.pct}</td>
                  <td><span className={`ratio-risk ${r.cls}`}>{r.risk}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ratio-note">
            <strong>Critical rule:</strong> Never use the same anchor text twice for the same target URL. If 10 different pages link to your pricing page, each one should use a different anchor variation. Repetition is the fastest path to over-optimization.<br /><br />
            Zyppy&apos;s study of 23 million internal links confirmed that <strong>anchor text variety correlates directly with organic traffic</strong> — the more unique anchors pointing to a page, the more clicks it receives from Google.
          </div>
        </div>
      </section>

      {/* ─── MISTAKES SECTION ─── */}
      <section className="section mistakes-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Mistakes</div>
            <h2 className="s-title">5 common anchor text mistakes <span className="blue">(and how to fix them)</span></h2>
            <p className="s-sub">Run the SEOShouts Internal Link Checker to find these specific problems in your site structure.</p>
          </div>
          <div className="mistakes-grid">
            {[
              { n: '01', title: 'The "Click Here" Problem', body: 'Anchors like "Click here," "Read more," "Learn more," "This article," or "This post" carry zero semantic value. They tell Google absolutely nothing about the destination page. Every generic anchor is a missed opportunity to send a topical relevance signal.', bad: '"Click here to see our services."', good: '"Explore our technical SEO audit services."' },
              { n: '02', title: 'Exact-Match Keyword Stuffing', body: 'The same high-value keyword used as anchor text on dozens of internal links, all pointing to the same page. It looks unnatural and robotic. Google\'s algorithms detect this pattern and may flag it as manipulative — the Penguin algorithm doesn\'t distinguish between internal and external anchor spam.', bad: '"SEO audit" repeated 20× linking to the same page', good: '"website audit checklist," "analyze your site\'s SEO health," "run a comprehensive site review"' },
              { n: '03', title: 'Mismatched Anchors', body: 'Linking to a page about "local SEO services" using anchor text about "website development" creates a relevancy conflict. Google expects the anchor text to accurately describe the destination. Mismatches confuse both algorithms and users.', bad: '"website development" → /services/local-seo/', good: '"local SEO services" or "dominate local search" → /services/local-seo/' },
              { n: '04', title: 'Naked URL Anchors', body: 'Using raw URLs as the visible link text. While not harmful, it\'s a significant wasted opportunity — a naked URL passes no topical signal to Google. Replace every raw URL anchor with a descriptive phrase.', bad: '"Check out https://seoshouts.com/tools/on-page-seo-analyzer/ for more."', good: '"Check out our on-page SEO analyzer with 100+ ranking factors for a deeper audit."' },
              { n: '05', title: 'Orphan Pages with Zero Internal Links', body: 'Important pages that receive no internal links from any other page. Search engines struggle to discover orphan pages. According to Semrush, 25% of all web pages have zero incoming internal links and receive virtually no organic traffic.', bad: 'Key service page with 0 incoming internal links', good: 'Every important page has at least 3 incoming internal links from related content' },
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

      {/* ─── HOW MANY LINKS — PROSE ─── */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Link Quantity</div>
            <h2 className="s-title">How many internal links should a page <span className="blue">actually have?</span></h2>
          </div>
          <div className="prose-content">
            <p>This is one of the most debated questions in SEO, and Zyppy answered it with data.</p>
            <p>Their analysis of <strong>23 million internal links</strong> found clear patterns:</p>
            <ul>
              <li><strong>40–44 internal links:</strong> The range where pages receive the most clicks from Google</li>
              <li><strong>45–50 internal links:</strong> Peak traffic performance</li>
              <li><strong>50+ internal links:</strong> Traffic declines — Google may discount the value of individual links when pages are link-saturated</li>
              <li><strong>3–5 contextual links per 1,000 words:</strong> The recommended density for in-content links specifically (not including navigation)</li>
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">Click depth matters too</div>
              <p>The same study found that pages buried <strong>4 or more clicks deep</strong> from the homepage receive <strong>9× less traffic</strong> than pages within 3 clicks. Internal linking isn&apos;t just about anchor text — where you place links in your site hierarchy determines whether pages get found at all.</p>
            </div>
            <p>This is why a holistic internal link audit — anchor text quality AND link placement — delivers the biggest ranking improvements. Our tool handles the anchor text analysis; pair it with a <a href="/tools/on-page-seo-analyzer/" style={{ color: 'var(--blue)' }}>full on-page SEO analysis</a> to evaluate overall page structure and depth.</p>
          </div>
        </div>
      </section>

      {/* ─── AI SEARCH SECTION ─── */}
      <section className="section prose-section alt">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">AI Search Optimization</div>
            <h2 className="s-title">Optimizing internal links for <span className="blue">AI search engines (2026)</span></h2>
          </div>
          <div className="prose-content">
            <p>AI search is fundamentally changing how internal links function. Google AI Overviews, ChatGPT, Perplexity, Claude, and Gemini don&apos;t just follow links — they use them to build <strong>semantic maps</strong> of your site&apos;s knowledge structure.</p>
            <h3>How AI models interpret your internal links</h3>
            <p>Traditional search engines follow links to crawl and index pages. AI models go further — they use internal link patterns to understand <strong>topical relationships</strong> between your content. When your blog post about "anchor text optimization" links to your tool page using the anchor "analyze your anchor text distribution," the AI model learns that these two pieces of content are semantically related.</p>
            <div className="prose-callout">
              <div className="prose-callout-title">seoClarity, 2025</div>
              <p>&ldquo;A strong internal linking structure gives AI engines clearer semantic signals, making it easier for AI search engines to surface your most authoritative and relevant pages in generative results.&rdquo;</p>
            </div>
            <h3>Natural language anchors beat keywords for AI</h3>
            <p>AI models process language as vectors — mathematical representations of meaning. Short, robotic keyword anchors provide weak semantic signals. Longer, natural language anchors provide rich context.</p>
            <div style={{ margin: '1.5rem 0', border: '1px solid var(--line)', background: 'var(--white)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--ink)', color: '#fff' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>✗ Old SEO Anchors</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>✓ AI-Optimized Anchors</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['"internal link checker"', '"use our free internal link checker to audit your anchor text"'],
                    ['"best pizza NYC"', '"the top-rated pizza places across New York City"'],
                    ['"SEO audit"', '"run a comprehensive technical SEO audit of your website"'],
                    ['"link building"', '"proven strategies for building high-quality backlinks"'],
                  ].map(([bad, good], i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--line)' }}>
                      <td style={{ padding: '10px 16px', color: 'var(--red)', fontStyle: 'italic' }}>{bad}</td>
                      <td style={{ padding: '10px 16px', color: 'var(--green)', fontStyle: 'italic' }}>{good}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>The shift is clear: <strong>write anchors as if you&apos;re explaining the destination to a human</strong>, not stuffing keywords for a crawler.</p>
            <p>We recommend testing your site&apos;s AI visibility weekly. Use our internal link checker alongside proper <a href="/tools/schema-generator/" style={{ color: 'var(--blue)' }}>schema markup</a> and <a href="/tools/robots-txt-generator/" style={{ color: 'var(--blue)' }}>robots.txt configuration for AI crawlers</a> to cover all three key AI visibility signals.</p>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON SECTION ─── */}
      <section className="section comparison-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Tool Comparison</div>
            <h2 className="s-title">SEOShouts vs other <span className="blue">internal link checkers</span></h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="comparison-table">
              <thead>
                <tr>
                  {['Feature', 'SEOShouts', 'Screaming Frog', 'Ahrefs', 'SEOptimer', 'Sitechecker'].map((c, i) => (
                    <th key={c} className={i === 1 ? 'highlight' : ''}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Visual Word Cloud', '✅ Unique', '❌', '❌', '❌', '❌'],
                  ['Free Crawl Limit', '500 pages', '500 pages', 'Paid only ($99+/mo)', 'Single page', '14-day trial only'],
                  ['Anchor Text Grouping', '✅', '✅', '✅', '❌', '✅'],
                  ['No Login Required', '✅', '❌ (Desktop install)', '❌ (Account required)', '✅', '❌ (Trial signup)'],
                  ['Browser-Based', '✅', '❌ (Desktop only)', '✅ (Cloud)', '✅', '✅'],
                  ['Keyword Stuffing Alert', '✅', '❌', '❌', '❌', '❌'],
                  ['Generic Anchor Detection', '✅', 'Manual only', 'Manual only', '❌', '❌'],
                  ['Destination URL Mapping', '✅', '✅', '✅', '❌', '✅'],
                  ['Cost', 'Free forever', 'Free (limited) / £199/yr', '$99–$999/mo', 'Free (limited)', '$49+/mo'],
                ].map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={ci === 1 ? 'highlight-col' : ''}>
                        {cell === '✅' || cell === '✅ Unique' ? <span className="check-yes">{cell}</span> :
                         cell === '❌' ? <span className="check-no">✗</span> :
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
              <p style={{ fontSize: '0.9rem', color: '#166534', lineHeight: 1.7 }}>Use our tool when you need a <strong>fast, visual health check</strong> of your anchor text profile without installing software or paying for subscriptions. The word cloud gives you an insight in 2 seconds that would take 20 minutes to extract from a Screaming Frog data table.</p>
            </div>
            <div style={{ background: 'var(--blue-pale)', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', padding: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--blue-dark)', marginBottom: '0.6rem' }}>When You Might Need More</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--blue-dark)', lineHeight: 1.7 }}>For enterprise sites with 10,000+ pages, full JavaScript rendering, or integration with backlink data, desktop crawlers like Screaming Frog or paid platforms like Ahrefs offer deeper capabilities. For most blogs, small businesses, and service websites under 500 pages, SEOShouts provides everything you need at zero cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CHECKLIST SECTION ─── */}
      <section className="section checklist-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Audit Checklist</div>
            <h2 className="s-title">Complete internal link audit checklist <span className="blue">(2026)</span></h2>
            <p className="s-sub">Use this checklist after running your SEOShouts analysis. Bookmark it and revisit monthly.</p>
          </div>
          <div className="checklist-grid">
            {[
              { title: '📊 Link Quantity & Distribution', items: ['Total internal links per page between 40–50 (not exceeding 50)', 'All important pages within 3 clicks of homepage', 'Zero orphan pages (every page has 3+ incoming internal links)', '3–5 contextual in-content links per 1,000 words', 'High-authority pages link to pages you most want to rank'] },
              { title: '🎯 Anchor Text Quality', items: ['Anchor ratio: 50–60% partial match, 10–15% exact, 20–30% branded, <5% generic', 'No duplicate anchor text pointing to the same target URL', 'Zero "click here," "read more," or "learn more" anchors', 'No naked URL anchors (raw URLs as link text)', 'Anchors include natural language for AI search parsing'] },
              { title: '🔧 Technical Health', items: ['All internal links return 200 status codes', 'No redirect chains (301→301) in internal links', 'No internal links pointing to noindex pages', 'Links use standard HTML anchor elements (not JavaScript-only)', 'No links with empty anchor text'] },
              { title: '🏗️ Content Architecture', items: ['Topic clusters bidirectionally linked (pillar ↔ cluster ↔ cluster)', 'New content receives 3–5 internal links within 48 hours of publishing', 'Content silos don\'t create isolated sections with no cross-links', 'Homepage links to most important category/tool pages directly'] },
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

      {/* ─── FAQ SECTION ─── */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently asked questions</h2>
            <p className="s-sub">Everything you need to know about internal link auditing.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'What is an internal link checker?', a: 'An internal link checker is an SEO tool that crawls your website to analyze how pages link to each other. It examines anchor text patterns, link distribution, and identifies issues like broken links, orphan pages, and over-optimized anchor text. SEOShouts\' version adds visual word cloud analysis to show which anchor phrases dominate your linking profile.' },
              { q: 'How many internal links should a page have?', a: 'According to Zyppy\'s analysis of 23 million internal links, pages with 40–44 internal links receive the most Google clicks, with 45–50 being the peak traffic range. Beyond 50 internal links per page, traffic declines significantly. Aim for 3–5 contextual internal links per 1,000 words of content.' },
              { q: 'What is the ideal anchor text ratio for internal links?', a: 'A healthy distribution is approximately: 50–60% descriptive or partial match anchors, 20–30% branded anchors, 10–15% exact match anchors, and less than 5% generic anchors like "click here." Never use the same anchor text repeatedly for the same target URL.' },
              { q: 'Can over-optimized anchor text hurt SEO rankings?', a: 'Yes. Google\'s Penguin algorithm specifically targets unnatural anchor text patterns. Sites with anchor text diversity below 30% have experienced ranking drops of up to 15 positions in competitive niches. Our word cloud visualization makes it easy to spot over-optimization before it triggers penalties.' },
              { q: 'Is the SEOShouts internal link checker free?', a: 'Yes, completely free. The tool crawls up to 500 URLs per analysis with no registration, no credit card, and no usage limits. You get full anchor text analysis, word cloud visualization, keyword stuffing detection, and generic link identification at zero cost.' },
              { q: 'What makes SEOShouts different from other internal link checkers?', a: 'SEOShouts is the only free internal link checker that generates visual word clouds of your anchor text profile. While tools like Screaming Frog, Ahrefs, and SEOptimer show data in tables, our word cloud gives you an instant visual health check. We also offer anchor text grouping, destination URL analysis, and keyword stuffing detection — all without login or payment.' },
              { q: 'How does internal linking affect AI search rankings?', a: 'AI search engines like ChatGPT, Perplexity, and Google Gemini use internal links to understand topical relationships between your pages. Descriptive, natural language anchor text helps AI models map your site\'s semantic structure more effectively than short keyword anchors.' },
              { q: 'How often should I audit internal links?', a: 'Run a full internal link audit monthly. Check for sudden spikes in exact-match anchor text, identify orphan pages with zero incoming links, verify all links return 200 status codes, and ensure important pages receive adequate link equity.' },
              { q: 'What are orphan pages and why do they matter?', a: 'Orphan pages have zero internal links pointing to them. Search engines struggle to discover and index them, and they receive virtually no organic traffic. According to Semrush data, 25% of all web pages have zero incoming internal links. Every important page should have at least 3 incoming internal links from related content.' },
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
              { name: 'Internal Link Checker', desc: 'Map your anchor text profile and uncover over-optimization risks', current: true, href: '/tools/internal-link-checker/', paths: ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'] },
              { name: 'On-Page SEO Analyzer', desc: 'Score any URL across 150+ on-page ranking signals', href: '/tools/on-page-seo-analyzer/', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
              { name: 'Schema Generator', desc: 'Build structured data markup for 39+ schema types', href: '/tools/schema-generator/', paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'] },
              { name: 'Robots.txt Generator', desc: 'Control how AI and web crawlers access your site', href: '/tools/robots-txt-generator/', paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'] },
              { name: 'Disavow File Generator', desc: 'Create Google-compliant disavow files in seconds', href: '/tools/disavow-file-generator/', paths: ['M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636'] },
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
          <h2 className="final-cta-title">Start your internal link audit <span>now</span></h2>
          <p className="final-cta-sub">Poor anchor text hides your best content from Google and AI search engines. Run your analysis in under 5 minutes, identify the problems, and fix them today.</p>
          <div className="final-cta-row">
            <a href="#top" className="btn-primary">🔗 Analyze Internal Links Now</a>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {['Complete analysis in under 5 minutes', 'Up to 500 pages crawled', 'Visual word cloud — only at SEOShouts'].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
