'use client'

import { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import ShapeGrid from '../../components/ShapeGrid'

interface SitemapUrl {
  url: string
  lastmod: string
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
  type: 'page'
}

export default function XmlSitemapGeneratorClient() {
  // Load usage count from session storage
  useEffect(() => {
    const savedUsageCount = sessionStorage.getItem('sitemapGeneratorUsage')
    if (savedUsageCount) {
      setUsageCount(parseInt(savedUsageCount))
    }
  }, [])

  const [inputMode, setInputMode] = useState<'manual' | 'crawl'>('crawl')
  const [manualUrls, setManualUrls] = useState('')
  const [crawlUrl, setCrawlUrl] = useState('')
  const [maxPages, setMaxPages] = useState(100)
  const [crawlDepth, setCrawlDepth] = useState(3)
  const [changeFreq, setChangeFreq] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [isGenerating, setIsGenerating] = useState(false)
  const [sitemapUrls, setSitemapUrls] = useState<SitemapUrl[]>([])
  const [sitemapXML, setSitemapXML] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Sitemap validator state
  const [valUrl, setValUrl] = useState('')
  const [valLoading, setValLoading] = useState(false)
  const [valError, setValError] = useState('')
  const [valProgress, setValProgress] = useState('')
  const [valResults, setValResults] = useState<Array<{ url: string; status: number; ok: boolean; redirected: boolean; finalUrl: string; error?: string }>>([])
  const [valMeta, setValMeta] = useState<{ totalInSitemap: number; checked: number; isIndex: boolean } | null>(null)

  // Validate an existing sitemap: fetch it, extract <loc> URLs, status-check them
  const validateSitemap = async () => {
    setValError(''); setValResults([]); setValMeta(null)

    let sitemapUrl = valUrl.trim()
    if (!sitemapUrl) { setValError('Enter a sitemap URL, e.g. example.com/sitemap.xml'); return }
    if (!/^https?:\/\//i.test(sitemapUrl)) sitemapUrl = 'https://' + sitemapUrl

    setValLoading(true)
    try {
      setValProgress('Fetching sitemap…')
      const fetchXml = async (u: string): Promise<string> => {
        const res = await fetch('/api/fetch-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: u }),
        })
        const data = await res.json()
        if (!res.ok || data.error) throw new Error(data.error || 'Could not fetch the sitemap')
        if (data.status >= 400) throw new Error(`Sitemap returned HTTP ${data.status}`)
        return data.html as string
      }

      let xml = await fetchXml(sitemapUrl)
      let isIndex = /<sitemapindex/i.test(xml)

      if (isIndex) {
        // Sitemap index: follow the first child sitemap
        const childLocs = Array.from(xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)).map(m => m[1].trim())
        if (childLocs.length === 0) throw new Error('Sitemap index contains no child sitemaps')
        setValProgress(`Sitemap index with ${childLocs.length} child sitemaps — validating the first one…`)
        xml = await fetchXml(childLocs[0])
      }

      const locs = Array.from(xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi))
        .map(m => m[1].trim())
        .filter(u => /^https?:\/\//i.test(u))

      if (locs.length === 0) {
        throw new Error('No <loc> URLs found — is this a valid XML sitemap?')
      }

      const toCheck = locs.slice(0, 50)
      setValProgress(`Checking ${toCheck.length} of ${locs.length} URLs…`)

      const checkRes = await fetch('/api/check-urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: toCheck }),
      })
      const checkData = await checkRes.json()
      if (!checkRes.ok || checkData.error) throw new Error(checkData.error || 'URL checking failed')

      // Problems first: errors, then 4xx/5xx, then redirects, then OK
      const rank = (r: any) => (r.error || r.status === 0 ? 0 : r.status >= 400 ? 1 : r.redirected ? 2 : 3)
      const sorted = [...checkData.results].sort((a: any, b: any) => rank(a) - rank(b))

      setValResults(sorted)
      setValMeta({ totalInSitemap: locs.length, checked: sorted.length, isIndex })
      setValProgress('')
    } catch (err: any) {
      setValError(err.message || 'Validation failed. Check the sitemap URL and try again.')
      setValProgress('')
    } finally {
      setValLoading(false)
    }
  }

  // CAPTCHA states
  const [isVerified, setIsVerified] = useState(false)
  const [captchaValue, setCaptchaValue] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Usage tracking
  const [usageCount, setUsageCount] = useState(0)
  const [usageLimit] = useState(5)

  const handleCaptchaChange = (value: string | null) => {
    console.log('reCAPTCHA value:', value)
    setCaptchaValue(value)
    setIsVerified(!!value)
  }

  const generateSitemap = async () => {
    if (!isVerified) {
      setError('Please complete the human verification first!')
      return
    }
    if (usageCount >= usageLimit) {
      setError(`You've reached the limit of ${usageLimit} sitemap generations per session. Please refresh the page to continue.`)
      return
    }

    setError('')
    setIsGenerating(true)
    setSitemapUrls([])
    setSitemapXML('')

    try {
      let urls: string[] = []

      if (inputMode === 'manual') {
        if (!manualUrls.trim()) {
          setError('Please enter URLs to include in the sitemap')
          setIsGenerating(false)
          return
        }
        urls = manualUrls.split('\n').map(url => url.trim()).filter(url => url.length > 0)
        if (urls.length > 2000) {
          setError(`Too many URLs! You've entered ${urls.length} URLs, but the maximum allowed is 2,000. Please remove ${urls.length - 2000} URLs.`)
          setIsGenerating(false)
          return
        }
      } else {
        if (!crawlUrl.trim()) {
          setError('Please enter a website URL to crawl')
          setIsGenerating(false)
          return
        }
        try {
          new URL(crawlUrl)
        } catch {
          setError('Please enter a valid website URL (e.g., https://example.com)')
          setIsGenerating(false)
          return
        }
        urls = await crawlWebsite(crawlUrl, maxPages, crawlDepth)
        if (urls.length === 0) {
          setError('No valid pages found. Please check the URL and try again.')
          setIsGenerating(false)
          return
        }
      }

      const normalizedUrls = new Set<string>()
      urls.forEach(url => {
        try {
          const urlObj = new URL(url)
          let normalizedUrl = urlObj.origin + urlObj.pathname
          const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(urlObj.pathname)
          if (!hasFileExtension && !normalizedUrl.endsWith('/')) {
            normalizedUrl += '/'
          }
          if (urlObj.search) normalizedUrl += urlObj.search
          if (urlObj.hash) normalizedUrl += urlObj.hash
          normalizedUrls.add(normalizedUrl)
        } catch { /* skip invalid URLs */ }
      })

      const validUrls = Array.from(normalizedUrls)
      if (validUrls.length === 0) {
        setError('No valid URLs found. Please check your URLs and try again.')
        setIsGenerating(false)
        return
      }

      const sitemapData: SitemapUrl[] = validUrls.map(url => {
        let priority = 0.5
        let changefreq: SitemapUrl['changefreq'] = changeFreq
        const path = new URL(url).pathname
        if (path === '/' || path === '') {
          priority = 1.0
          changefreq = 'daily'
        } else if (path.includes('/blog/') || path.includes('/news/')) {
          priority = 0.6
          changefreq = 'weekly'
        } else if (path.includes('/products/') || path.includes('/services/')) {
          priority = 0.8
          changefreq = 'monthly'
        }
        return { url, lastmod: new Date().toISOString().split('T')[0], changefreq, priority, type: 'page' }
      })

      setSitemapUrls(sitemapData)
      generateXML(sitemapData)
      const newUsageCount = usageCount + 1
      setUsageCount(newUsageCount)
      sessionStorage.setItem('sitemapGeneratorUsage', newUsageCount.toString())
    } catch (err) {
      setError('Failed to generate sitemap. Please try again.')
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const crawlWebsite = async (startUrl: string, maxPages: number, maxDepth: number): Promise<string[]> => {
    try {
      const response = await fetch('/api/crawl-website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: startUrl, maxPages, maxDepth, recaptchaToken: captchaValue })
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error || 'Crawling failed')
      return data.urls || []
    } catch (error) {
      console.error('Crawl error:', error)
      throw error
    }
  }

  const generateXML = (urls: SitemapUrl[]) => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
    urls.forEach(urlData => {
      xml += `  <url>\n`
      xml += `    <loc>${urlData.url}</loc>\n`
      xml += `    <lastmod>${urlData.lastmod}</lastmod>\n`
      xml += `    <changefreq>${urlData.changefreq}</changefreq>\n`
      xml += `    <priority>${urlData.priority.toFixed(1)}</priority>\n`
      xml += `  </url>\n`
    })
    xml += `</urlset>`
    setSitemapXML(xml)
  }

  const downloadSitemap = () => {
    if (!isVerified) { alert('Please complete the human verification first!'); return }
    const blob = new Blob([sitemapXML], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sitemap.xml'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    if (!isVerified) { alert('Please complete the human verification first!'); return }
    try {
      await navigator.clipboard.writeText(sitemapXML)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) { console.error('Failed to copy: ', err) }
  }

  const resetForm = () => {
    setInputMode('crawl')
    setManualUrls('')
    setCrawlUrl('')
    setMaxPages(100)
    setCrawlDepth(3)
    setChangeFreq('weekly')
    setSitemapUrls([])
    setSitemapXML('')
    setError('')
    setIsVerified(false)
    setCaptchaValue(null)
    if (recaptchaRef.current) recaptchaRef.current.reset()
  }

  const urlCount = inputMode === 'manual' ? manualUrls.split('\n').filter(url => url.trim().length > 0).length : 0

  const selectStyle = {
    width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: 'var(--ink)',
    outline: 'none', background: 'var(--white)', cursor: 'pointer'
  }

  return (
    <>
      {/* --- TOOL HERO --- */}
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
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>XML Sitemap Generator</span>
          </nav>
          <div className="tool-hero-badge">Free SEO Tool</div>
          <h1 className="tool-hero-h1">
            Free XML Sitemap <span>Generator</span>
          </h1>
          <p className="tool-hero-sub">
            Make sure Google finds every page on your site. Our{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>Free XML Sitemap Generator</strong>{' '}
            creates professional, search-engine-approved sitemaps in seconds &mdash; no coding required. Add your URLs, set priorities, and download a ready-to-submit sitemap file instantly.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem 2rem', marginTop: '1.5rem' }}>
            {['Up to 2,000 URLs', 'Google-Approved Format', 'Instant Download', '100% Free'].map(label => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: '0.85rem' }}>&#10003;</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- TOOL INPUT SECTION --- */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT BOX */}
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

            <h2 className="tool-box-heading">XML Sitemap Generator</h2>

            {/* Input Mode Selection */}
            <label className="tool-box-label">How would you like to create your sitemap? *</label>
            <div className="tabs" style={{ marginBottom: '0.5rem' }}>
              <button type="button" onClick={() => setInputMode('crawl')} className={`tab${inputMode === 'crawl' ? ' active' : ''}`}>
                Automatic Crawling
              </button>
              <button type="button" onClick={() => setInputMode('manual')} className={`tab${inputMode === 'manual' ? ' active' : ''}`}>
                Manual Input
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>
              {inputMode === 'crawl'
                ? 'Enter your website URL and let us crawl it automatically to find all pages (Recommended)'
                : 'Manually enter specific URLs you want to include — perfect for precise control and private sites'}
            </p>

            {/* Crawl Mode */}
            {inputMode === 'crawl' && (
              <>
                <label htmlFor="crawlUrl" className="tool-box-label">Website URL to Crawl *</label>
                <input
                  type="url"
                  id="crawlUrl"
                  className="tool-url-input"
                  value={crawlUrl}
                  onChange={(e) => setCrawlUrl(e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem', marginTop: '0.35rem' }}>
                  Enter the main URL of your website. We&apos;ll automatically discover all linked pages.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label htmlFor="maxPages" className="tool-box-label">Maximum Pages to Crawl</label>
                    <select id="maxPages" value={maxPages} onChange={(e) => setMaxPages(parseInt(e.target.value))} style={selectStyle}>
                      <option value={50}>50 pages</option>
                      <option value={100}>100 pages</option>
                      <option value={250}>250 pages</option>
                      <option value={500}>500 pages</option>
                      <option value={1000}>1,000 pages</option>
                      <option value={2000}>2,000 pages (max)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="crawlDepth" className="tool-box-label">Crawl Depth</label>
                    <select id="crawlDepth" value={crawlDepth} onChange={(e) => setCrawlDepth(parseInt(e.target.value))} style={selectStyle}>
                      <option value={1}>1 level (homepage only)</option>
                      <option value={2}>2 levels</option>
                      <option value={3}>3 levels (recommended)</option>
                      <option value={4}>4 levels</option>
                      <option value={5}>5 levels (deep crawl)</option>
                    </select>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-4)', marginTop: '0.35rem' }}>How many clicks deep to follow links from your homepage</p>
                  </div>
                </div>
                <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.5rem' }}>Automatic Crawling:</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {['Discovers pages automatically by following links', 'Respects robots.txt files and meta tags', 'Filters out non-indexable pages', 'Perfect for most websites'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.78rem' }}>&#10003;</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Manual Mode */}
            {inputMode === 'manual' && (
              <>
                <label htmlFor="manualUrls" className="tool-box-label">Website URLs *</label>
                <textarea
                  id="manualUrls"
                  value={manualUrls}
                  onChange={(e) => setManualUrls(e.target.value)}
                  placeholder={'Enter your website URLs, one per line:\nhttps://yourwebsite.com\nhttps://yourwebsite.com/about\nhttps://yourwebsite.com/contact\nhttps://yourwebsite.com/blog/post-1\nhttps://yourwebsite.com/products/product-1'}
                  rows={10}
                  style={{
                    width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                    resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.85rem',
                    color: 'var(--ink)', outline: 'none', lineHeight: 1.6, marginBottom: '0.35rem'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: urlCount > 2000 ? '0.5rem' : '1.25rem' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', margin: 0 }}>Enter one URL per line (maximum 2,000 URLs)</p>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif', color: urlCount > 2000 ? 'var(--red)' : urlCount > 1800 ? 'var(--amber)' : 'var(--gray-4)' }}>
                    {urlCount}/2,000
                  </span>
                </div>
                {urlCount > 2000 && (
                  <div style={{ marginBottom: '1.25rem', padding: '8px 12px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.82rem', color: 'var(--red)' }}>
                    Too many URLs! Please remove {urlCount - 2000} URLs to proceed.
                  </div>
                )}
                <div style={{ padding: '1rem 1.25rem', border: '1px solid rgba(245,158,11,0.3)', borderLeft: '4px solid var(--amber)', background: 'rgba(245,158,11,0.06)', marginBottom: '1.25rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--amber)', marginBottom: '0.5rem' }}>Manual Input:</div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {['Complete control over which pages to include', 'Perfect for private or password-protected sites', 'Good for new sites with few pages', 'Requires you to list all URLs manually'].map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                        <span style={{ color: 'var(--amber)', flexShrink: 0, fontWeight: 700, fontSize: '0.78rem' }}>&#10003;</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Change Frequency */}
            <label htmlFor="changeFreq" className="tool-box-label">Default Change Frequency</label>
            <select id="changeFreq" value={changeFreq} onChange={(e) => setChangeFreq(e.target.value as any)} style={{ ...selectStyle, marginBottom: '0.35rem' }}>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>How often your content typically changes</p>

            {/* Usage & Limits */}
            <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.5rem' }}>Usage &amp; Limits:</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {[
                  'Maximum 2,000 URLs per sitemap',
                  `${usageLimit - usageCount} generations remaining this session`,
                  'Automatic priority optimization',
                  'Google-compliant XML format',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.78rem' }}>&#10003;</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Human Verification — widget label is self-explanatory */}
            <div style={{ marginBottom: '1.25rem' }}>
              <ReCAPTCHA ref={recaptchaRef} sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''} onChange={handleCaptchaChange} theme="light" />
              {isVerified && (
                <p style={{ marginTop: '0.4rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--green)' }}>
                  ✓ Verified — you can now generate your sitemap.
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.85rem', color: 'var(--red)' }}>
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={generateSitemap}
                disabled={isGenerating || (inputMode === 'manual' && (!manualUrls.trim() || urlCount > 2000)) || (inputMode === 'crawl' && !crawlUrl.trim()) || !isVerified || usageCount >= usageLimit}
                className="tool-analyze-btn"
                style={{ flex: 1 }}
              >
                <div className="tool-analyze-btn-dot" />
                {isGenerating ? (
                  <>
                    <svg className="animate-spin" style={{ width: 16, height: 16, marginRight: '0.4rem' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Sitemap...
                  </>
                ) : (
                  'Generate Sitemap'
                )}
              </button>
              <button onClick={resetForm} style={{ padding: '14px 20px', background: 'var(--gray-1)', color: 'var(--gray-5)', border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
                Reset
              </button>
            </div>
          </div>

          {/* RIGHT BOX */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">
              {inputMode === 'crawl' ? 'Crawled Sitemap Results' : 'Generated Sitemap'}
            </h2>

            {sitemapUrls.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                <div style={{ width: 56, height: 56, background: 'var(--gray-1)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--gray-4)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
                  </svg>
                </div>
                <p style={{ color: 'var(--gray-4)', fontSize: '0.88rem', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Add your website URLs and complete verification to generate a professional XML sitemap
                </p>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="stats-strip" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: '1.25rem' }}>
                  <div className="stat-cell">
                    <div className="stat-cell-num blue">{sitemapUrls.length}</div>
                    <div className="stat-cell-label">Total URLs</div>
                  </div>
                  <div className="stat-cell" style={{ borderRight: 'none' }}>
                    <div className="stat-cell-num">{Math.round(sitemapXML.length / 1024) || '&lt;1'}KB</div>
                    <div className="stat-cell-label">File Size</div>
                  </div>
                </div>

                {/* Export Buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <button onClick={copyToClipboard} disabled={!isVerified} style={{ flex: 1, padding: '7px 14px', background: 'var(--gray-1)', color: isVerified ? 'var(--gray-5)' : 'var(--gray-3)', border: '1px solid var(--line)', fontWeight: 600, fontSize: '0.78rem', cursor: isVerified ? 'pointer' : 'not-allowed', opacity: isVerified ? 1 : 0.5, borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                    {copied ? '✓ Copied!' : 'Copy XML'}
                  </button>
                  <button onClick={downloadSitemap} disabled={!isVerified} style={{ flex: 1, padding: '7px 14px', background: isVerified ? 'var(--blue)' : 'var(--gray-2)', color: '#fff', border: 'none', fontWeight: 600, fontSize: '0.78rem', cursor: isVerified ? 'pointer' : 'not-allowed', opacity: isVerified ? 1 : 0.5, borderRadius: 4, fontFamily: 'Space Grotesk, sans-serif' }}>
                    Download sitemap.xml
                  </button>
                </div>

                {/* Chain into the internal link checker with the same site */}
                {sitemapUrls.length > 0 && (
                  <a
                    href={`/tools/internal-link-checker/?url=${encodeURIComponent(sitemapUrls[0].url)}`}
                    style={{ display: 'block', textAlign: 'center', fontSize: '0.78rem', fontWeight: 600, color: 'var(--blue)', marginBottom: '1rem', textDecoration: 'none' }}
                  >
                    Next step: audit this site&apos;s internal links →
                  </a>
                )}

                {/* XML Preview */}
                <div style={{ background: '#111318', padding: '1.25rem', overflowX: 'auto', fontSize: '0.77rem', fontFamily: 'JetBrains Mono, monospace', height: 200, overflowY: 'auto', marginBottom: '1rem' }}>
                  <pre style={{ color: '#86efac', margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {sitemapXML.substring(0, 1000)}
                    {sitemapXML.length > 1000 && '\n... (truncated for preview)'}
                  </pre>
                </div>

                {/* URL List Preview */}
                <div style={{ border: '1px solid var(--line)', padding: '1rem 1.25rem', maxHeight: 120, overflowY: 'auto', marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '0.82rem', color: 'var(--ink)', marginBottom: '0.5rem' }}>Included URLs:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {sitemapUrls.slice(0, 10).map((url, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--gray-5)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{url.url}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--gray-4)', marginLeft: '0.5rem', flexShrink: 0, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>{url.priority}</span>
                      </div>
                    ))}
                    {sitemapUrls.length > 10 && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--gray-4)', textAlign: 'center', paddingTop: '0.25rem' }}>
                        ...and {sitemapUrls.length - 10} more URLs
                      </div>
                    )}
                  </div>
                </div>

                {/* Next Steps */}
                <div style={{ padding: '1rem 1.25rem', border: '1px solid var(--blue-mid)', borderLeft: '4px solid var(--blue)', background: 'var(--blue-pale)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--blue-dark)', marginBottom: '0.5rem' }}>Next Steps:</div>
                  <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {['Download the sitemap.xml file', "Upload it to your website's root directory", 'Submit to Google Search Console', 'Add to Bing Webmaster Tools', 'Test at: yoursite.com/sitemap.xml'].map((step, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ width: 18, height: 18, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.68rem', fontWeight: 700, color: '#fff', fontFamily: 'Space Grotesk, sans-serif' }}>{i + 1}</span>
                        <span style={{ fontSize: '0.82rem', color: 'var(--blue-dark)', lineHeight: 1.5 }}>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Verification Required */}
                {!isVerified && (
                  <div style={{ marginTop: '1rem', padding: '0.875rem 1.25rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.25)' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--amber)', marginBottom: '0.25rem' }}>Verification Required</div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-5)', margin: 0 }}>Complete human verification to download or copy your XML sitemap.</p>
                  </div>
                )}
              </>
            )}
          </div>

        </div>

        {/* ── SITEMAP VALIDATOR ── */}
        <div style={{ maxWidth: 1360, margin: '1.5rem auto 0' }}>
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Sitemap Validator — Check an Existing Sitemap</h2>
            <p className="tool-box-sub">
              Already have a sitemap? Paste its URL and this validator fetches it, extracts every entry, and <span>live-checks each URL&apos;s HTTP status</span>: broken 404 entries, redirected URLs wasting crawl budget, and server errors, sorted problems-first.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', alignItems: 'end', marginBottom: '1rem' }}>
              <div>
                <label className="tool-box-label" htmlFor="val-sitemap-url">Sitemap URL</label>
                <input
                  type="text"
                  id="val-sitemap-url"
                  className="tool-url-input"
                  value={valUrl}
                  onChange={(e) => setValUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') validateSitemap() }}
                  placeholder="example.com/sitemap.xml"
                />
              </div>
              <button onClick={validateSitemap} disabled={valLoading} className="tool-analyze-btn" style={{ whiteSpace: 'nowrap' }}>
                <div className="tool-analyze-btn-dot" />
                {valLoading ? 'Validating…' : 'Validate Sitemap'}
              </button>
            </div>

            {valProgress && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'rgba(37,99,235,0.06)', border: '1px solid rgba(37,99,235,0.18)', fontSize: '0.85rem', color: 'var(--blue)' }}>
                {valProgress}
              </div>
            )}
            {valError && (
              <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)', fontSize: '0.85rem', color: 'var(--red)' }}>
                {valError}
              </div>
            )}

            {valResults.length > 0 && valMeta && (
              <div>
                {/* Summary strip */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem', padding: '10px 14px', background: 'var(--gray-1)', border: '1px solid var(--line)' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    <strong style={{ color: 'var(--ink)' }}>{valMeta.totalInSitemap}</strong> URLs in sitemap{valMeta.isIndex ? ' (first child of index)' : ''}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    <strong style={{ color: 'var(--green)' }}>{valResults.filter(r => r.ok && !r.redirected).length}</strong> healthy
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    <strong style={{ color: 'var(--amber)' }}>{valResults.filter(r => r.ok && r.redirected).length}</strong> redirected
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-5)' }}>
                    <strong style={{ color: 'var(--red)' }}>{valResults.filter(r => !r.ok).length}</strong> broken / errors
                  </span>
                  {valMeta.totalInSitemap > valMeta.checked && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-4)' }}>checked first {valMeta.checked}</span>
                  )}
                </div>

                {/* Results table */}
                <div style={{ border: '1px solid var(--line)', overflowX: 'auto', maxHeight: 420, overflowY: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                    <thead>
                      <tr style={{ background: 'var(--ink)', position: 'sticky', top: 0 }}>
                        {['Status', 'URL', 'Note'].map((h, j) => (
                          <th key={h} style={{ textAlign: 'left', padding: '9px 14px', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', borderRight: j < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {valResults.map((r, i) => {
                        const isBroken = !r.ok
                        const note = r.error ? r.error : isBroken ? 'Remove or fix this entry' : r.redirected ? `Redirects to ${r.finalUrl} — update the sitemap entry` : 'OK'
                        return (
                          <tr key={i} style={{ borderBottom: i < valResults.length - 1 ? '1px solid var(--line)' : 'none' }}>
                            <td style={{ padding: '8px 14px' }}>
                              <span style={{
                                padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace',
                                background: isBroken ? 'rgba(220,38,38,0.12)' : r.redirected ? 'rgba(245,158,11,0.12)' : 'rgba(22,163,74,0.12)',
                                color: isBroken ? 'var(--red)' : r.redirected ? 'var(--amber)' : 'var(--green)'
                              }}>
                                {r.status || 'ERR'}
                              </span>
                            </td>
                            <td style={{ padding: '8px 14px', fontSize: '0.78rem', color: 'var(--ink)', fontFamily: 'JetBrains Mono, monospace', wordBreak: 'break-all' }}>{r.url}</td>
                            <td style={{ padding: '8px 14px', fontSize: '0.75rem', color: 'var(--gray-4)', wordBreak: 'break-all' }}>{note}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <p style={{ marginTop: '0.75rem', fontSize: '0.72rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>
                  Every status above is a live HTTP check. Redirected entries still work but waste crawl budget and dilute signals — sitemaps should list final URLs only.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── FOUNDER QUOTE ── */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in Technical SEO</div>
              <p className="founder-quote-text">
                &ldquo;An XML sitemap is the cheapest indexing insurance that exists: one file that tells Google every URL you want crawled. I have audited stores where half the catalog was invisible to search purely because no sitemap existed. Generate it, submit it in Search Console, and that entire class of problem disappears.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts ·{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OVERVIEW --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">Help Search Engines Find <span className="blue">Every Page on Your Website</span></h2>
          </div>
          <div className="prose-content">
            <h3>Create Professional Sitemaps in Seconds (No Coding Required)</h3>
            <p>
              Here&apos;s a story that&apos;ll make you appreciate sitemaps: A friend launched her online store last year with 500 products. Three months later, she discovered that Google had only indexed 47 of her product pages. The rest? Invisible to search engines.
            </p>
            <p>
              Turns out, her website structure was so confusing that Google&apos;s crawlers gave up trying to find everything. One properly formatted XML sitemap later, and boom &mdash; all 500+ pages got indexed within two weeks.
            </p>
            <p><strong>That&apos;s the power of a good sitemap.</strong></p>
            <p>
              Most people think search engines automatically find every page on their website. Nope. If you&apos;ve got a complex site structure, new pages, or just want to make sure nothing gets missed, you need an XML sitemap.
            </p>
            <p>
              <strong>Our XML Sitemap Generator</strong> creates professional, Google-approved sitemaps in seconds. No technical knowledge required.
            </p>

            <h3>What&apos;s an XML Sitemap (And Why Your Website Needs One)</h3>
            <p>
              Think of an XML sitemap as a detailed map you give to Google saying, &ldquo;Hey, here are all the important pages on my website. Please make sure you don&apos;t miss any of them.&rdquo;
            </p>
            <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 2rem', margin: '1rem 0 1.5rem' }}>
              {[
                'Lists every page you want search engines to find',
                'Tells them when each page was last updated',
                'Shows which pages are most important',
                'Helps new pages get discovered faster',
                'Prevents important content from being overlooked',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>&#10003;</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="prose-callout">
              <div className="prose-callout-title">Real talk</div>
              <p>Small websites with good navigation might not desperately need one, but why take chances? Plus, if you&apos;ve got more than 20&ndash;30 pages, a sitemap is basically mandatory. Google actually recommends having one, especially for larger sites, new websites, or sites that don&apos;t have many external links pointing to them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- WHY OUR GENERATOR BEATS DIY --- */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Key Features</div>
            <h2 className="s-title">Why Our Sitemap Generator <span className="blue">Beats DIY</span></h2>
          </div>
          <div className="features-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {[
              {
                iconPaths: ['M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-5-4H5z', 'M14 3v4h4', 'M9 13h6', 'M9 17h3'],
                title: 'Point, Click, Done',
                desc: 'No XML coding, no syntax headaches, no wondering if you got the format right.',
                bullets: ['Enter your website URLs', 'Complete human verification', 'Click generate', 'Download your perfect sitemap', 'Takes literally 30 seconds.'],
              },
              {
                iconPaths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'],
                title: 'Complete Control',
                desc: "You know your website better than any automated crawler. Add exactly the pages you want indexed.",
                bullets: ['No missed important pages', 'No unwanted pages included', 'Complete control over priorities', 'Works with any website structure', 'Perfect for private or new sites'],
              },
              {
                iconPaths: ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                title: 'Google-Approved Format',
                desc: 'Mess up the XML format and Google might ignore your whole sitemap. We handle it automatically.',
                bullets: ['Proper XML syntax and structure', 'Correct date formatting', 'Valid URL encoding', 'Priority and frequency settings', '2,000 URL limit compliance'],
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.iconPaths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.75rem 0 0.75rem' }}>{f.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {f.bullets.map((b, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                      <span style={{ color: 'var(--blue)', flexShrink: 0, fontWeight: 700, fontSize: '0.78rem', marginTop: 2 }}>&#10003;</span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-4)', lineHeight: 1.5 }}>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW TO USE --- */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How To Use</div>
            <h2 className="s-title">How to Use the XML Sitemap Generator <span className="blue">(Super Easy)</span></h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { n: '01', title: 'Gather Your URLs', desc: 'Create a list of all the important pages on your website that you want search engines to index. Include your homepage, about page, product pages, blog posts, and any other valuable content.' },
              { n: '02', title: 'Paste Your URLs', desc: 'Copy and paste your URLs into the text area, one URL per line. Make sure each URL is complete and properly formatted (starting with https:// or http://). Remember the 2,000 URL limit!' },
              { n: '03', title: 'Complete Verification', desc: 'Complete the human verification to prevent automated abuse and ensure fair usage of our free tool.' },
              { n: '04', title: 'Generate and Download', desc: "Click generate to create your XML sitemap, then download the file and upload it to your website's root directory. Don't forget to submit it to Google Search Console!" },
            ].map((s, i) => (
              <div key={s.n} className="step-card">
                {i < 3 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
                  </div>
                )}
                <div className="step-num-big">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '2rem', background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.15)', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
            <p style={{ margin: 0, color: 'var(--gray-5)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <strong>Pro tip:</strong> Your sitemap should live at yourdomain.com/sitemap.xml &mdash; that&apos;s where search engines expect to find it.
            </p>
          </div>
        </div>
      </section>

      {/* --- WHAT GETS INCLUDED --- */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">What&apos;s Inside</div>
            <h2 className="s-title">What Gets Included <span className="blue">(And What Doesn&apos;t)</span></h2>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>
            {[
              {
                title: 'Automatically Included',
                color: 'var(--green)',
                iconPaths: ['M20 6L9 17l-5-5'],
                items: ['All URLs you manually add', 'Proper priority settings (homepage = 1.0)', 'Current date as last modified', 'Appropriate change frequency', 'Valid XML formatting'],
              },
              {
                title: 'Smart Optimization',
                color: 'var(--blue)',
                iconPaths: ['M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', 'M12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
                items: ['Homepage gets priority 1.0', 'Product/service pages get 0.8', 'Blog/news pages get 0.6', 'Other pages get 0.5', 'URL validation and cleanup'],
              },
              {
                title: 'Important Limits',
                color: 'var(--amber)',
                iconPaths: ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
                items: ['Maximum 2,000 URLs per sitemap', 'Only manually added URLs included', 'Human verification required', 'Invalid URLs are excluded', 'One sitemap file generated'],
              },
            ].map((card) => (
              <div key={card.title} className="why-card" style={{ borderTop: `3px solid ${card.color}` }}>
                <div className="why-card-title">
                  <div className="why-card-icon" style={{ background: card.color }}>
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      {card.iconPaths.map((d, j) => <path key={j} d={d} />)}
                    </svg>
                  </div>
                  {card.title}
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {card.items.map((item, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <span style={{ color: card.color, flexShrink: 0, fontWeight: 700, fontSize: '0.82rem', marginTop: 2 }}>•</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray-5)', lineHeight: 1.55 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
            <p className="s-sub">Everything you need to know about XML sitemaps.</p>
          </div>
          <div className="faq-list">
            {[
              { q: 'What is an XML sitemap?', a: 'An XML sitemap is a file listing every URL on your website that you want search engines to crawl and index, along with optional metadata like last-modified dates and priority. Search engines read it to discover pages they might otherwise miss, especially new pages, deep pages, and pages with few internal links.' },
              { q: 'Is this XML sitemap generator free?', a: 'Yes, completely free with no signup, no page-limit paywall, and no watermarks. Enter your site URL, let the crawler collect your pages, and download a standards-compliant sitemap.xml ready to upload.' },
              { q: 'Do I need a sitemap if my site is small?', a: 'Google can usually find every page on a well-linked small site without one, but a sitemap still helps: it speeds up discovery of new content and gives you Search Console indexing reports per URL. Since generating one takes under a minute, there is no reason to skip it.' },
              { q: 'Where do I upload the sitemap file?', a: 'Place sitemap.xml in your website root so it loads at yoursite.com/sitemap.xml. Then reference it in your robots.txt file (Sitemap: https://yoursite.com/sitemap.xml) and submit it in Google Search Console under Indexing > Sitemaps.' },
              { q: 'How often should I update my sitemap?', a: 'Whenever you add, remove, or significantly change pages. For frequently updated sites, regenerate monthly or use a CMS plugin that maintains the sitemap automatically. A stale sitemap with deleted URLs wastes crawl budget and produces Search Console errors.' },
              { q: 'How many URLs can one sitemap contain?', a: 'The protocol limit is 50,000 URLs or 50MB uncompressed per file. Larger sites split URLs across multiple sitemaps tied together by a sitemap index file. This generator handles standard sites well within the single-file limit.' },
            ].map(faq => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- RELATED TOOLS --- */}
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
              { name: 'XML Sitemap Generator', desc: 'Help search engines find every page on your website (up to 2,000 URLs).', current: true, href: '/tools/xml-sitemap-generator/', paths: ['M3 3h18v18H3z', 'M3 9h18M3 15h18M9 3v18M15 3v18'] },
              { name: 'Robots.txt Generator', desc: 'Create robots.txt rules that control crawler access, including AI crawlers like GPTBot.', href: '/tools/robots-txt-generator/', paths: ['M12 2a3 3 0 0 0-3 3v1H6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v4h10v-4h1a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3V5a3 3 0 0 0-3-3z', 'M9 12h.01', 'M15 12h.01'] },
              { name: 'On-Page SEO Analyzer', desc: 'Audit your page SEO health across 150+ factors with real PageSpeed data.', href: '/tools/on-page-seo-analyzer/', paths: ['M9 11l3 3L22 4', 'M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11'] },
              { name: 'Meta Tag Optimizer', desc: 'Generate perfect title tags and meta descriptions for better click-through rates.', href: '/tools/meta-tag-optimizer/', paths: ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'] },
              { name: 'Keyword Density Analyzer', desc: 'Analyze keyword frequency and optimize content for SEO without over-optimization.', href: '/tools/keyword-density-analyzer/', paths: ['M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z'] },
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

      {/* --- FINAL CTA --- */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Ready to Get All Your <span>Pages Found?</span></h2>
          <p className="final-cta-sub">
            Don&apos;t leave page discovery to chance. Create a professional XML sitemap that gives search engines a complete roadmap to all your important content.
          </p>
          <div className="final-cta-row">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="btn-primary">
              Create Your XML Sitemap &rarr;
            </button>
          </div>
          <div className="final-cta-pills">
            {[
              'Professional sitemaps in 30 seconds &mdash; completely free',
              'Supports automatic crawling and manual URL input',
              'Google-approved XML format with smart priority optimization',
            ].map(p => (
              <div key={p} className="final-pill" dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 600, margin: '1.5rem auto 0', textAlign: 'center' }}>
            <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Don&apos;t let great content go undiscovered. Create your sitemap with SEO Shouts and make sure Google finds everything.</strong>
            <br />
            <em>Built by SEO pros who understand that every page deserves a chance to rank.</em>
          </p>
        </div>
      </div>
    </>
  )
}
